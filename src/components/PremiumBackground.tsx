import React, { useEffect, useRef, useState } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  targetAlpha: number;
  color: string;
}

interface Connection {
  from: number;
  to: number;
  alpha: number;
}

interface DataDot {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  progress: number;
  speed: number;
  path: number[]; // indices of particles
  currentPathIdx: number;
}

export default function PremiumBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mouseRef = useRef({ x: -1000, y: -1000, targetX: -1000, targetY: -1000 });
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const scrollRef = useRef(0);

  useEffect(() => {
    // Detect reduced motion preferences
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);
    const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", listener);

    // Track scroll for parallax effects
    const handleScroll = () => {
      scrollRef.current = window.scrollY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      mediaQuery.removeEventListener("change", listener);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Re-adjust on resize
    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Handle mouse move with subtle ease-in-out interpolation
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.targetX = e.clientX;
      mouseRef.current.targetY = e.clientY;
    };

    const handleMouseLeave = () => {
      mouseRef.current.targetX = -1000;
      mouseRef.current.targetY = -1000;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    // Initialize Particles (Layer 2)
    const particleCount = prefersReducedMotion ? 25 : 85;
    const particles: Particle[] = [];
    const colors = ["#3b82f6", "#6366f1", "#06b6d4", "#a855f7"]; // Blue, Indigo, Cyan, Purple

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        size: Math.random() * 2 + 1,
        alpha: Math.random() * 0.5 + 0.1,
        targetAlpha: Math.random() * 0.6 + 0.2,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    // Initialize Data Dots (Layer 8)
    const dataDots: DataDot[] = [];
    const maxDataDots = prefersReducedMotion ? 2 : 8;

    const createDataDot = () => {
      if (particles.length < 4) return;
      // Choose a starting particle
      const startIdx = Math.floor(Math.random() * particles.length);
      const path: number[] = [startIdx];
      
      // Build a random path of 3-5 connected particles
      let currentIdx = startIdx;
      for (let steps = 0; steps < 3; steps++) {
        // Find closest particles that aren't already in the path
        const neighbors = particles
          .map((p, idx) => ({ idx, dist: Math.hypot(p.x - particles[currentIdx].x, p.y - particles[currentIdx].y) }))
          .filter((item) => item.idx !== currentIdx && !path.includes(item.idx))
          .sort((a, b) => a.dist - b.dist)
          .slice(0, 5);

        if (neighbors.length > 0) {
          const next = neighbors[Math.floor(Math.random() * neighbors.length)].idx;
          path.push(next);
          currentIdx = next;
        } else {
          break;
        }
      }

      if (path.length > 1) {
        dataDots.push({
          x: particles[path[0]].x,
          y: particles[path[0]].y,
          targetX: particles[path[1]].x,
          targetY: particles[path[1]].y,
          progress: 0,
          speed: Math.random() * 0.015 + 0.008,
          path,
          currentPathIdx: 0,
        });
      }
    };

    // Draw loops
    let waveOffset = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse coordinates interpolation
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.08;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.08;

      const mouseX = mouseRef.current.x;
      const mouseY = mouseRef.current.y;
      const scrollY = scrollRef.current;

      // Ensure waves drift continuously
      waveOffset += 0.005;

      // 1. Draw Animated AI Grid (Layer 3) with subtle perspective
      if (!prefersReducedMotion) {
        ctx.strokeStyle = "rgba(99, 102, 241, 0.04)";
        ctx.lineWidth = 1;
        const gridSize = 65;
        const columns = Math.ceil(width / gridSize) + 1;
        const rows = Math.ceil(height / gridSize) + 1;

        for (let i = 0; i < columns; i++) {
          ctx.beginPath();
          const x = i * gridSize;
          ctx.moveTo(x, 0);
          ctx.lineTo(x, height);
          ctx.stroke();
        }

        for (let j = 0; j < rows; j++) {
          ctx.beginPath();
          const y = j * gridSize + (scrollY * 0.1) % gridSize; // Grid Parallax
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
          ctx.stroke();
        }

        // Draw light waves in grid
        ctx.strokeStyle = "rgba(6, 182, 212, 0.06)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        for (let i = 0; i < columns; i++) {
          const x = i * gridSize;
          const yOffset = Math.sin(i * 0.3 + waveOffset) * 20 + height * 0.5 + (scrollY * 0.05);
          if (i === 0) ctx.moveTo(x, yOffset);
          else ctx.lineTo(x, yOffset);
        }
        ctx.stroke();
      }

      // 2. Draw Connections & Networks (Layer 4)
      const maxDistance = 145;
      const connections: Connection[] = [];
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.hypot(dx, dy);

          if (dist < maxDistance) {
            let alpha = (1 - dist / maxDistance) * 0.15;

            // React to mouse
            if (mouseX > 0 && mouseY > 0) {
              const mDistI = Math.hypot(particles[i].x - mouseX, particles[i].y - mouseY);
              const mDistJ = Math.hypot(particles[j].x - mouseX, particles[j].y - mouseY);
              if (mDistI < 200 || mDistJ < 200) {
                alpha += 0.12; // brighten connection lines near mouse
              }
            }

            connections.push({ from: i, to: j, alpha });
          }
        }
      }

      connections.forEach((conn) => {
        const p1 = particles[conn.from];
        const p2 = particles[conn.to];
        ctx.beginPath();
        const grad = ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y);
        grad.addColorStop(0, p1.color + Math.floor(conn.alpha * 255).toString(16).padStart(2, "0"));
        grad.addColorStop(1, p2.color + Math.floor(conn.alpha * 255).toString(16).padStart(2, "0"));
        ctx.strokeStyle = grad;
        ctx.lineWidth = 0.8;
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      });

      // 3. Update & Draw Floating Particles (Layer 2)
      particles.forEach((p) => {
        // Base movement
        p.x += p.vx;
        p.y += p.vy + (scrollY * 0.005); // Parallax offset

        // Slowly fade particle alpha up and down
        p.alpha += (p.targetAlpha - p.alpha) * 0.01;
        if (Math.abs(p.alpha - p.targetAlpha) < 0.05) {
          p.targetAlpha = Math.random() * 0.6 + 0.1;
        }

        // Mouse reaction (subtle follow)
        if (mouseX > 0 && mouseY > 0) {
          const dx = mouseX - p.x;
          const dy = mouseY - p.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 180) {
            const force = (180 - dist) * 0.0003;
            p.x += dx * force;
            p.y += dy * force;
          }
        }

        // Boundary bounce / wrap
        if (p.x < 0) p.x = width;
        else if (p.x > width) p.x = 0;

        if (p.y < 0) p.y = height;
        else if (p.y > height) p.y = 0;

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color + Math.floor(p.alpha * 255).toString(16).padStart(2, "0");
        ctx.shadowBlur = p.size * 2;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.shadowBlur = 0; // reset
      });

      // 4. Update & Draw AI Data Flow (Layer 8)
      if (!prefersReducedMotion) {
        if (dataDots.length < maxDataDots && Math.random() < 0.03) {
          createDataDot();
        }

        for (let i = dataDots.length - 1; i >= 0; i--) {
          const dot = dataDots[i];
          dot.progress += dot.speed;

          if (dot.progress >= 1) {
            // Move to next segment in path
            dot.currentPathIdx++;
            if (dot.currentPathIdx < dot.path.length - 1) {
              const currPart = particles[dot.path[dot.currentPathIdx]];
              const nextPart = particles[dot.path[dot.currentPathIdx + 1]];
              if (currPart && nextPart) {
                dot.x = currPart.x;
                dot.y = currPart.y;
                dot.targetX = nextPart.x;
                dot.targetY = nextPart.y;
                dot.progress = 0;
              } else {
                dataDots.splice(i, 1);
                continue;
              }
            } else {
              // Path finished
              dataDots.splice(i, 1);
              continue;
            }
          }

          // Interpolated position
          const x = dot.x + (dot.targetX - dot.x) * dot.progress;
          const y = dot.y + (dot.targetY - dot.y) * dot.progress;

          // Draw glowy data dot
          ctx.beginPath();
          ctx.arc(x, y, 2.5, 0, Math.PI * 2);
          ctx.fillStyle = "#22d3ee"; // Cyan glow
          ctx.shadowBlur = 8;
          ctx.shadowColor = "#06b6d4";
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }

      // 5. Digital Wave at Bottom (Layer 7)
      ctx.beginPath();
      ctx.fillStyle = "rgba(99, 102, 241, 0.02)";
      ctx.moveTo(0, height);
      for (let i = 0; i <= width; i += 10) {
        const waveY = Math.sin(i * 0.003 + waveOffset * 2) * 20 + Math.cos(i * 0.0015 + waveOffset) * 10 + height - 80;
        ctx.lineTo(i, waveY);
      }
      ctx.lineTo(width, height);
      ctx.fill();

      ctx.beginPath();
      ctx.fillStyle = "rgba(6, 182, 212, 0.015)";
      ctx.moveTo(0, height);
      for (let i = 0; i <= width; i += 15) {
        const waveY = Math.sin(i * 0.002 - waveOffset * 1.5) * 15 + Math.cos(i * 0.004 + waveOffset * 0.8) * 12 + height - 60;
        ctx.lineTo(i, waveY);
      }
      ctx.lineTo(width, height);
      ctx.fill();

      // Next frame
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [prefersReducedMotion]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 w-full h-full -z-50 overflow-hidden bg-slate-950"
      style={{ isolation: "isolate" }}
    >
      {/* Layer 1: Animated Shifting Gradient background */}
      <div className="absolute inset-0 opacity-45 bg-[radial-gradient(circle_at_20%_30%,#1e1b4b_0%,transparent_50%),radial-gradient(circle_at_80%_70%,#0f172a_0%,transparent_50%),radial-gradient(circle_at_50%_40%,#1e293b_0%,transparent_60%)] animate-pulse" style={{ animationDuration: "12s" }} />

      {/* Layer 6: Dynamic blurred glowing light orbs floating slowly */}
      {!prefersReducedMotion && (
        <>
          <div
            className="absolute w-[45vw] h-[45vw] rounded-full blur-[140px] bg-indigo-600/10 pointer-events-none"
            style={{
              top: "-5%",
              left: "10%",
              animation: "floatOrb1 28s ease-in-out infinite alternate",
            }}
          />
          <div
            className="absolute w-[35vw] h-[35vw] rounded-full blur-[120px] bg-cyan-600/8 pointer-events-none"
            style={{
              bottom: "10%",
              right: "5%",
              animation: "floatOrb2 22s ease-in-out infinite alternate",
            }}
          />
          <div
            className="absolute w-[40vw] h-[40vw] rounded-full blur-[150px] bg-purple-600/8 pointer-events-none"
            style={{
              bottom: "-10%",
              left: "-5%",
              animation: "floatOrb3 35s ease-in-out infinite alternate",
            }}
          />
        </>
      )}

      {/* Layer 5: Floating Glass shapes rotating and drifting */}
      {!prefersReducedMotion && (
        <div className="absolute inset-0 pointer-events-none select-none opacity-40">
          {/* Glass Circle */}
          <div
            className="absolute border border-white/5 bg-white/2 rounded-full backdrop-blur-[3px] shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]"
            style={{
              width: "120px",
              height: "120px",
              top: "20%",
              left: "15%",
              animation: "floatGlass1 25s ease-in-out infinite alternate",
            }}
          />
          {/* Glass Hexagon */}
          <div
            className="absolute border border-white/5 bg-white/2 backdrop-blur-[2px] shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]"
            style={{
              width: "100px",
              height: "100px",
              clipPath: "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)",
              top: "65%",
              left: "8%",
              animation: "floatGlass2 30s ease-in-out infinite alternate",
            }}
          />
          {/* Glass Rounded Rectangle */}
          <div
            className="absolute border border-white/5 bg-white/2 rounded-2xl backdrop-blur-[4px] shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]"
            style={{
              width: "140px",
              height: "80px",
              top: "15%",
              right: "12%",
              animation: "floatGlass3 22s ease-in-out infinite alternate",
            }}
          />
        </div>
      )}

      {/* Canvas for Particles, Connections, Wave, AI data paths */}
      <canvas ref={canvasRef} className="absolute inset-0 block w-full h-full pointer-events-none" />

      {/* Style overrides for custom GPU-accelerated keyframe animations */}
      <style>{`
        @keyframes floatOrb1 {
          0% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(8%, 12%) scale(1.1); }
          100% { transform: translate(-5%, -5%) scale(0.9); }
        }
        @keyframes floatOrb2 {
          0% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-12%, -8%) scale(0.9); }
          100% { transform: translate(6%, 10%) scale(1.15); }
        }
        @keyframes floatOrb3 {
          0% { transform: translate(0, 0) scale(1.1); }
          50% { transform: translate(10%, -10%) scale(0.85); }
          100% { transform: translate(-8%, 5%) scale(1.05); }
        }
        @keyframes floatGlass1 {
          0% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(15px, -30px) rotate(45deg); }
          100% { transform: translate(-10px, 15px) rotate(90deg); }
        }
        @keyframes floatGlass2 {
          0% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(-20px, 20px) rotate(-60deg); }
          100% { transform: translate(15px, -15px) rotate(-120deg); }
        }
        @keyframes floatGlass3 {
          0% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(25px, 25px) rotate(35deg); }
          100% { transform: translate(-15px, -25px) rotate(70deg); }
        }
      `}</style>
    </div>
  );
}
