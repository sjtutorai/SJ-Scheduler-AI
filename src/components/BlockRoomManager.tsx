/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Block, Room } from "../types";
import { Search, Plus, Trash2, Edit, X, Layout, MapPin, Tv, CheckSquare, Settings } from "lucide-react";

interface BlockRoomManagerProps {
  blocks: Block[];
  setBlocks: (blocks: Block[]) => void;
  rooms: Room[];
  setRooms: (rooms: Room[]) => void;
  triggerNotification: (title: string, message: string, type: "success" | "warning" | "info") => void;
}

export default function BlockRoomManager({
  blocks,
  setBlocks,
  rooms,
  setRooms,
  triggerNotification
}: BlockRoomManagerProps) {
  const [activeTab, setActiveTab] = useState<"rooms" | "blocks">("rooms");
  const [searchTerm, setSearchTerm] = useState("");

  const [showRoomModal, setShowRoomModal] = useState(false);
  const [showBlockModal, setShowBlockModal] = useState(false);

  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [editingBlock, setEditingBlock] = useState<Block | null>(null);

  // Form Fields
  const [roomFields, setRoomFields] = useState<Omit<Room, "id">>({
    roomNumber: "101",
    blockName: "A Block",
    floor: 1,
    capacity: 40,
    numberOfBenches: 20,
    studentsPerBench: 2,
    isSmartClassroom: true,
    isLab: false,
    isComputerLab: false
  });

  const [blockFields, setBlockFields] = useState<Omit<Block, "id">>({
    name: "A Block",
    numberOfFloors: 3,
    rooms: ["101", "102"],
    supervisor: "Mr. Ramesh Kumar"
  });

  // Room CRUD Helpers
  const handleOpenRoomCreate = () => {
    setEditingRoom(null);
    setRoomFields({
      roomNumber: "",
      blockName: blocks[0]?.name || "A Block",
      floor: 1,
      capacity: 40,
      numberOfBenches: 20,
      studentsPerBench: 2,
      isSmartClassroom: false,
      isLab: false,
      isComputerLab: false
    });
    setShowRoomModal(true);
  };

  const handleOpenRoomEdit = (r: Room) => {
    setEditingRoom(r);
    setRoomFields({
      roomNumber: r.roomNumber,
      blockName: r.blockName,
      floor: r.floor,
      capacity: r.capacity,
      numberOfBenches: r.numberOfBenches,
      studentsPerBench: r.studentsPerBench,
      isSmartClassroom: r.isSmartClassroom,
      isLab: r.isLab,
      isComputerLab: r.isComputerLab
    });
    setShowRoomModal(true);
  };

  const handleRoomDelete = (id: string) => {
    const deleted = rooms.find((r) => r.id === id);
    setRooms(rooms.filter((r) => r.id !== id));
    if (deleted) {
      triggerNotification("Infrastructure Deleted", `Room ${deleted.roomNumber} deleted.`, "warning");
    }
  };

  const handleRoomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const derivedCapacity = roomFields.numberOfBenches * roomFields.studentsPerBench;
    const finalRoom = { ...roomFields, capacity: derivedCapacity };

    if (editingRoom) {
      setRooms(rooms.map((r) => (r.id === editingRoom.id ? { ...r, ...finalRoom } : r)));
      triggerNotification("Room Updated", `Room ${roomFields.roomNumber} settings saved.`, "success");
    } else {
      setRooms([...rooms, { id: `rm-${Date.now()}`, ...finalRoom }]);
      triggerNotification("Room Registered", `Created Room ${roomFields.roomNumber} successfully.`, "success");
    }
    setShowRoomModal(false);
  };

  // Block CRUD Helpers
  const handleOpenBlockCreate = () => {
    setEditingBlock(null);
    setBlockFields({
      name: "",
      numberOfFloors: 2,
      rooms: [],
      supervisor: ""
    });
    setShowBlockModal(true);
  };

  const handleOpenBlockEdit = (b: Block) => {
    setEditingBlock(b);
    setBlockFields({
      name: b.name,
      numberOfFloors: b.numberOfFloors,
      rooms: b.rooms,
      supervisor: b.supervisor
    });
    setShowBlockModal(true);
  };

  const handleBlockDelete = (id: string) => {
    const deleted = blocks.find((b) => b.id === id);
    setBlocks(blocks.filter((b) => b.id !== id));
    if (deleted) {
      triggerNotification("Infrastructure Deleted", `${deleted.name} configuration deleted.`, "warning");
    }
  };

  const handleBlockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingBlock) {
      setBlocks(blocks.map((b) => (b.id === editingBlock.id ? { ...b, ...blockFields } : b)));
      triggerNotification("Block Configured", `${blockFields.name} updated.`, "success");
    } else {
      setBlocks([...blocks, { id: `blk-${Date.now()}`, ...blockFields }]);
      triggerNotification("Block Registered", `Registered ${blockFields.name} successfully.`, "success");
    }
    setShowBlockModal(false);
  };

  // Filters
  const filteredRooms = rooms.filter(
    (r) =>
      r.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.blockName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredBlocks = blocks.filter((b) =>
    b.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6" id="infrastructure-tab">
      {/* Selector and Subnav */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => {
              setActiveTab("rooms");
              setSearchTerm("");
            }}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === "rooms" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Manage Rooms & Halls
          </button>
          <button
            onClick={() => {
              setActiveTab("blocks");
              setSearchTerm("");
            }}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === "blocks" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Manage Wings & Blocks
          </button>
        </div>

        {/* Search */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder={activeTab === "rooms" ? "Search Room / Hall..." : "Search Block name..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-64 pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 text-xs rounded-xl focus:outline-none"
            />
          </div>

          <button
            onClick={activeTab === "rooms" ? handleOpenRoomCreate : handleOpenBlockCreate}
            className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-medium hover:bg-slate-800 transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add {activeTab === "rooms" ? "Room" : "Block"}</span>
          </button>
        </div>
      </div>

      {/* Main Section */}
      {activeTab === "rooms" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredRooms.map((r) => (
            <div
              key={r.id}
              className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4 relative flex flex-col justify-between group hover:shadow-md transition-all"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-mono font-bold text-lg text-slate-950">Room {r.roomNumber}</h3>
                    <p className="text-[11px] text-slate-400 font-medium font-sans">
                      {r.blockName} • Floor {r.floor}
                    </p>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenRoomEdit(r)}
                      className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-50 rounded-lg transition-all cursor-pointer"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleRoomDelete(r.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 bg-slate-50 p-2.5 rounded-xl text-center border border-slate-100 font-mono">
                  <div>
                    <div className="text-[10px] text-slate-400">Seats</div>
                    <div className="font-bold text-slate-800 text-sm">{r.capacity}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400">Benches</div>
                    <div className="font-bold text-slate-800 text-sm">{r.numberOfBenches}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400">Per Bench</div>
                    <div className="font-bold text-slate-800 text-sm">{r.studentsPerBench}</div>
                  </div>
                </div>
              </div>

              {/* Badges / features indicators */}
              <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-50">
                {r.isSmartClassroom && (
                  <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 rounded text-[9px] font-bold">
                    Smart Board
                  </span>
                )}
                {r.isLab && (
                  <span className="bg-indigo-50 text-indigo-700 border border-indigo-100 px-2 py-0.5 rounded text-[9px] font-bold">
                    Lab Area
                  </span>
                )}
                {r.isComputerLab && (
                  <span className="bg-cyan-50 text-cyan-700 border border-cyan-100 px-2 py-0.5 rounded text-[9px] font-bold">
                    Computer PC
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredBlocks.map((b) => (
            <div
              key={b.id}
              className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4 relative flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-slate-100 text-slate-800 rounded-xl">
                      <Layout className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 font-sans">{b.name}</h3>
                      <p className="text-xs text-slate-400">{b.numberOfFloors} Floor Levels Wing</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenBlockEdit(b)}
                      className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-50 rounded-lg transition-all cursor-pointer"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleBlockDelete(b.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="text-xs space-y-1 pt-2">
                  <div className="text-slate-500">
                    Supervisor: <span className="font-semibold text-slate-800">{b.supervisor || "Unassigned"}</span>
                  </div>
                  <div className="text-slate-500">
                    Rooms Associated:{" "}
                    <span className="font-mono text-slate-700 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                      {b.rooms.join(", ") || "None"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Room Modal */}
      {showRoomModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xl max-w-md w-full overflow-hidden flex flex-col">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-800 font-sans">
                {editingRoom ? "Edit Infrastructure Seating Room" : "Create Infrastructure Room"}
              </h3>
              <button
                onClick={() => setShowRoomModal(false)}
                className="p-1.5 text-slate-400 hover:bg-slate-100 rounded-lg transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleRoomSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Room / Hall Number</label>
                  <input
                    type="text"
                    required
                    value={roomFields.roomNumber}
                    onChange={(e) => setRoomFields({ ...roomFields, roomNumber: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none"
                    placeholder="e.g. 101"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Floor Level</label>
                  <input
                    type="number"
                    value={roomFields.floor}
                    onChange={(e) => setRoomFields({ ...roomFields, floor: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-mono focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Associated Wing Block</label>
                <select
                  value={roomFields.blockName}
                  onChange={(e) => setRoomFields({ ...roomFields, blockName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none cursor-pointer"
                >
                  {blocks.map((b) => (
                    <option key={b.id} value={b.name}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Number of Benches</label>
                  <input
                    type="number"
                    value={roomFields.numberOfBenches}
                    onChange={(e) => setRoomFields({ ...roomFields, numberOfBenches: parseInt(e.target.value) || 20 })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-mono focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Students Per Bench</label>
                  <input
                    type="number"
                    value={roomFields.studentsPerBench}
                    onChange={(e) => setRoomFields({ ...roomFields, studentsPerBench: parseInt(e.target.value) || 2 })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-mono focus:outline-none"
                  />
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center font-mono">
                <span className="text-xs text-slate-400">Computed Seating Capacity: </span>
                <span className="text-sm font-bold text-slate-800">
                  {roomFields.numberOfBenches * roomFields.studentsPerBench} Pupils
                </span>
              </div>

              <div className="space-y-2 pt-2">
                <label className="block text-xs font-semibold text-slate-500">Facility Type Features</label>
                <div className="grid grid-cols-3 gap-2">
                  <label className="flex items-center gap-1.5 text-[10px] font-bold text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={roomFields.isSmartClassroom}
                      onChange={(e) => setRoomFields({ ...roomFields, isSmartClassroom: e.target.checked })}
                      className="rounded text-slate-950"
                    />
                    <span>Smart Board</span>
                  </label>

                  <label className="flex items-center gap-1.5 text-[10px] font-bold text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={roomFields.isLab}
                      onChange={(e) => setRoomFields({ ...roomFields, isLab: e.target.checked })}
                      className="rounded text-slate-950"
                    />
                    <span>Science Lab</span>
                  </label>

                  <label className="flex items-center gap-1.5 text-[10px] font-bold text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={roomFields.isComputerLab}
                      onChange={(e) => setRoomFields({ ...roomFields, isComputerLab: e.target.checked })}
                      className="rounded text-slate-950"
                    />
                    <span>PC Lab</span>
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowRoomModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-medium transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-medium transition-all cursor-pointer"
                >
                  Save Room
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Block Modal */}
      {showBlockModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xl max-w-md w-full overflow-hidden flex flex-col">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-800 font-sans">
                {editingBlock ? "Edit Infrastructure Wing Block" : "Register Wing Block"}
              </h3>
              <button
                onClick={() => setShowBlockModal(false)}
                className="p-1.5 text-slate-400 hover:bg-slate-100 rounded-lg transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleBlockSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Block / Wing Name</label>
                <input
                  type="text"
                  required
                  value={blockFields.name}
                  onChange={(e) => setBlockFields({ ...blockFields, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none"
                  placeholder="e.g. A Block"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Number of Floors</label>
                  <input
                    type="number"
                    value={blockFields.numberOfFloors}
                    onChange={(e) => setBlockFields({ ...blockFields, numberOfFloors: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-mono focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Supervisor Officer</label>
                  <input
                    type="text"
                    value={blockFields.supervisor}
                    onChange={(e) => setBlockFields({ ...blockFields, supervisor: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none"
                    placeholder="e.g. Mr. Ramesh Kumar"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Rooms (comma separated)</label>
                <input
                  type="text"
                  value={blockFields.rooms.join(", ")}
                  onChange={(e) =>
                    setBlockFields({
                      ...blockFields,
                      rooms: e.target.value.split(",").map((s) => s.trim()).filter(Boolean)
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-mono focus:outline-none"
                  placeholder="e.g. 101, 102, 201"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowBlockModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-medium transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-medium transition-all cursor-pointer"
                >
                  Save Block
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
