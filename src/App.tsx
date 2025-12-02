import React, { useState, useEffect } from 'react';
import { Plus, Search, Check, ShieldAlert, Trash2 } from 'lucide-react';
import { invoke } from "@tauri-apps/api/core";

// --- Types ---
interface HostEntry {
  id: string;
  ip: string;
  domain: string;
  enabled: boolean;
  isSystem: boolean;
}

export default function App() {
  const [hosts, setHosts] = useState<HostEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [hasChanges, setHasChanges] = useState(false);
  const [focusedId, setFocusedId] = useState<string | null>(null);

  useEffect(() => {
    // Load actual file on startup
    invoke<HostEntry[]>('read_hosts_file')
      .then(setHosts)
      .catch(console.error);
  }, []);

  // Filter logic
  const filteredHosts = hosts.filter(h =>
    h.ip.includes(searchTerm) || h.domain.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- Actions ---

  const toggleStatus = (id: string) => {
    setHosts(prev => prev.map(h => {
      if (h.id === id) return { ...h, enabled: !h.enabled };
      return h;
    }));
    setHasChanges(true);
  };

  const updateEntry = (id: string, field: 'ip' | 'domain', value: string) => {
    setHosts(prev => prev.map(h => {
      if (h.id === id) return { ...h, [field]: value };
      return h;
    }));
    setHasChanges(true);
  };

  const deleteEntry = (id: string) => {
    setHosts(prev => prev.filter(h => h.id !== id));
    setHasChanges(true);
  };

  const addNewEntry = () => {
    const newId = Math.random().toString(36).substr(2, 9);
    const newEntry: HostEntry = {
      id: newId,
      ip: '127.0.0.1',
      domain: 'new-entry.local',
      enabled: true,
      isSystem: false
    };
    setHosts([newEntry, ...hosts]);
    setHasChanges(true);
    setFocusedId(newId);
  };

  const handleSave = async () => {
    try {
      await invoke('save_hosts_file', { entries: hosts });
      setHasChanges(false);
    } catch (error) {
      console.error("Failed to save:", error);
      alert("Failed to save changes. Did you deny permission?");
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#F5F5F7] text-gray-900 font-sans selection:bg-blue-200">

      {/* --- Title Bar Area (Simulated) --- */}
      <header className="flex items-center justify-between px-4 py-3 bg-white/50 backdrop-blur-md border-b border-gray-200 sticky top-0 z-10 transition-all">
        {/* Left: Window Controls spacer + Search */}
        <div className="flex items-center gap-4 w-1/3">
          <div className="flex gap-2 mr-4 opacity-50 hover:opacity-100 transition-opacity">
            <div className="w-3 h-3 rounded-full bg-red-400"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
          </div>

          <div className="relative group w-full max-w-[200px]">
            <Search className="w-4 h-4 text-gray-400 absolute left-2 top-1/2 -translate-y-1/2 group-focus-within:text-blue-500 transition-colors" />
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-100/50 hover:bg-gray-100 focus:bg-white border border-transparent focus:border-blue-400/50 rounded-md py-1 pl-8 pr-2 text-sm outline-none transition-all"
            />
          </div>
        </div>

        {/* Center: Title */}
        <div className="text-sm font-semibold tracking-wide text-gray-700 select-none">
          Hosts Editor
        </div>

        {/* Right: Actions */}
        <div className="flex items-center justify-end gap-2 w-1/3">
          <button
            onClick={addNewEntry}
            className="p-1.5 rounded-md hover:bg-gray-200 text-gray-600 transition-colors"
            title="Add New Entry (Cmd+N)"
          >
            <Plus className="w-5 h-5" />
          </button>

          <button
            onClick={handleSave}
            disabled={!hasChanges}
            className={`
              px-3 py-1 text-xs font-medium rounded-md transition-all duration-200 flex items-center gap-1.5
              ${hasChanges
                ? 'bg-blue-500 text-white shadow-sm hover:bg-blue-600 active:scale-95'
                : 'bg-gray-200 text-gray-400 cursor-default'}
            `}
          >
            {hasChanges ? <ShieldAlert className="w-3 h-3" /> : <Check className="w-3 h-3" />}
            {hasChanges ? 'Apply Changes' : 'Synced'}
          </button>
        </div>
      </header>

      {/* --- Main Content --- */}
      <main className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto">

          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 px-4 py-2 text-xs font-medium text-gray-400 uppercase tracking-wider select-none">
            <div className="col-span-1 text-center">Active</div>
            <div className="col-span-3">IP Address</div>
            <div className="col-span-7">Hostname / Domains</div>
            <div className="col-span-1"></div>
          </div>

          {/* List */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {filteredHosts.length === 0 ? (
              <div className="p-8 text-center text-gray-400">
                No entries found.
              </div>
            ) : (
              filteredHosts.map((host) => (
                <Row
                  key={host.id}
                  data={host}
                  onToggle={() => toggleStatus(host.id)}
                  onChange={updateEntry}
                  onDelete={() => deleteEntry(host.id)}
                  isFocused={focusedId === host.id}
                />
              ))
            )}
          </div>

          <div className="mt-4 text-center text-xs text-gray-400">
            Editing /etc/hosts requires administrator privileges on save.
          </div>

        </div>
      </main>
    </div>
  );
}

// --- Row Component ---
function Row({
  data,
  onToggle,
  onChange,
  onDelete,
  isFocused
}: {
  data: HostEntry;
  onToggle: () => void;
  onChange: (id: string, field: 'ip' | 'domain', value: string) => void;
  onDelete: () => void;
  isFocused: boolean;
}) {
  const { id, ip, domain, enabled, isSystem } = data;

  return (
    <div className={`
      group grid grid-cols-12 gap-4 px-4 py-3 items-center border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors
      ${!enabled ? 'opacity-50 grayscale' : ''}
    `}>

      {/* Toggle Switch */}
      <div className="col-span-1 flex justify-center">
        <button
          onClick={onToggle}
          disabled={isSystem}
          className={`
            relative w-9 h-5 rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
            ${enabled ? 'bg-green-500' : 'bg-gray-300'}
            ${isSystem ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}
          `}
        >
          <span className={`
            absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ease-in-out
            ${enabled ? 'translate-x-4' : 'translate-x-0'}
          `} />
        </button>
      </div>

      {/* IP Input */}
      <div className="col-span-3">
        <input
          type="text"
          value={ip}
          readOnly={isSystem}
          onChange={(e) => onChange(id, 'ip', e.target.value)}
          className={`
            w-full bg-transparent font-mono text-sm text-gray-800 outline-none rounded px-1.5 py-0.5
            ${!isSystem && 'hover:bg-gray-200/50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all'}
            ${isSystem && 'text-gray-500 cursor-default'}
          `}
          spellCheck={false}
        />
      </div>

      {/* Domain Input */}
      <div className="col-span-7">
        <input
          type="text"
          value={domain}
          readOnly={isSystem}
          autoFocus={isFocused}
          onChange={(e) => onChange(id, 'domain', e.target.value)}
          className={`
            w-full bg-transparent text-sm font-medium outline-none rounded px-1.5 py-0.5
            ${!isSystem && 'hover:bg-gray-200/50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all'}
            ${isSystem && 'text-gray-500 cursor-default'}
          `}
          spellCheck={false}
        />
      </div>

      {/* Delete Action */}
      <div className="col-span-1 flex justify-end">
        {!isSystem && (
          <button
            onClick={onDelete}
            className="text-gray-300 hover:text-red-500 p-1 rounded hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
        {isSystem && (
          <span className="text-xs text-gray-300 select-none">System</span>
        )}
      </div>
    </div>
  );
}
