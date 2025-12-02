import { useState, useEffect } from 'react';
import { Plus, Search, Check, ShieldAlert, Trash2, Sun, Moon, Monitor } from 'lucide-react';
import { invoke } from "@tauri-apps/api/core";
import { setTheme as setTauriTheme } from '@tauri-apps/api/app';
import { getCurrentWindow } from '@tauri-apps/api/window';

// --- Types ---
interface HostEntry {
  id: string;
  ip: string;
  domain: string;
  enabled: boolean;
  isSystem: boolean;
}

type AppTheme = 'light' | 'dark' | 'system';

export default function App() {
  const [hosts, setHosts] = useState<HostEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [hasChanges, setHasChanges] = useState(false);
  const [focusedId, setFocusedId] = useState<string | null>(null);
  const [theme, setTheme] = useState<AppTheme>('system');

  useEffect(() => {
    // Load actual file on startup
    invoke<HostEntry[]>('read_hosts_file')
      .then(setHosts)
      .catch(console.error);
  }, []);

  // Theme Effect
  useEffect(() => {
    // 1. Tell Tauri to update the window theme
    const updateTauriTheme = async () => {
      try {
        if (theme === 'system') {
          await setTauriTheme(null);
        } else {
          await setTauriTheme(theme);
        }
      } catch (e) {
        console.error("Failed to set theme:", e);
      }
    };
    updateTauriTheme();
  }, [theme]);

  useEffect(() => {
    // 2. Listen for theme changes to update the DOM
    let unlisten: Promise<() => void>;

    const updateDomTheme = (themeStr: string | null) => {
      const root = window.document.documentElement;
      if (themeStr === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    };

    const setupListener = async () => {
      const win = getCurrentWindow();

      // Get initial theme
      try {
        const currentTheme = await win.theme();
        updateDomTheme(currentTheme);
      } catch (e) {
        console.error("Failed to get initial theme:", e);
      }

      // Listen for changes
      unlisten = win.onThemeChanged(({ payload: newTheme }: { payload: 'light' | 'dark' }) => {
        updateDomTheme(newTheme);
      });
    };

    setupListener();

    return () => {
      if (unlisten) {
        unlisten.then(f => f());
      }
    };
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
    <div className="flex flex-col h-screen bg-[#F5F5F7] dark:bg-[#000000] text-gray-900 dark:text-gray-100 font-sans selection:bg-blue-200 dark:selection:bg-blue-800 transition-colors duration-200">

      {/* --- Title Bar Area --- */}
      <header
        data-tauri-drag-region
        className="h-[52px] flex items-center justify-between px-4 bg-white/80 dark:bg-[#1C1C1E]/80 backdrop-blur-xl border-b border-gray-200 dark:border-[#38383A] sticky top-0 z-50 transition-all select-none"
      >
        {/* Left: Window Controls spacer + Search */}
        <div className="flex items-center gap-4 w-1/3 pl-24" data-tauri-drag-region>

          <div className="relative group w-full max-w-[200px]">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2 group-focus-within:text-blue-500 transition-colors" />
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-100 dark:bg-[#2C2C2E] hover:bg-gray-200 dark:hover:bg-[#3A3A3C] focus:bg-white dark:focus:bg-[#1C1C1E] border border-transparent focus:border-blue-500/30 rounded-md py-1 pl-8 pr-2 text-xs outline-none transition-all text-gray-900 dark:text-gray-100 placeholder-gray-500 shadow-sm"
            />
          </div>
        </div>

        {/* Center: Title */}
        <div className="text-xs font-semibold tracking-wider text-gray-500 dark:text-gray-400 uppercase" data-tauri-drag-region>
          HostMaster
        </div>

        {/* Right: Actions */}
        <div className="flex items-center justify-end gap-3 w-1/3">
          <button
            onClick={addNewEntry}
            className="p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-[#3A3A3C] text-gray-500 dark:text-gray-400 transition-colors"
            title="Add New Entry (Cmd+N)"
          >
            <Plus className="w-4 h-4" />
          </button>

          <button
            onClick={handleSave}
            disabled={!hasChanges}
            className={`
              px-3 py-1 text-xs font-medium rounded-md transition-all duration-200 flex items-center gap-1.5 border
              ${hasChanges
                ? 'bg-blue-600 border-blue-500 text-white shadow-sm hover:bg-blue-500'
                : 'bg-gray-100 dark:bg-[#2C2C2E] border-gray-200 dark:border-[#38383A] text-gray-400 dark:text-gray-500 cursor-default'}
            `}
          >
            {hasChanges ? <ShieldAlert className="w-3 h-3" /> : <Check className="w-3 h-3" />}
            {hasChanges ? 'Apply' : 'Synced'}
          </button>
        </div>
      </header>

      {/* --- Main Content --- */}
      <main className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto">

          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 px-4 py-2 text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider select-none">
            <div className="col-span-1 text-center">Active</div>
            <div className="col-span-3">IP Address</div>
            <div className="col-span-7">Hostname / Domains</div>
            <div className="col-span-1"></div>
          </div>

          {/* List */}
          <div className="bg-white dark:bg-[#1C1C1E] rounded-xl shadow-sm border border-gray-200 dark:border-[#38383A] overflow-hidden transition-colors duration-200">
            {filteredHosts.length === 0 ? (
              <div className="p-8 text-center text-gray-400 dark:text-gray-500">
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

          {/* Footer / Status Bar */}
          <div className="mt-6 flex flex-col items-center gap-4">

            {/* Theme Switcher */}
            <div className="flex items-center gap-1 p-1 bg-gray-200 dark:bg-[#1C1C1E] rounded-full border border-gray-300 dark:border-[#38383A]">
              <button
                onClick={() => setTheme('light')}
                className={`p-1.5 rounded-full transition-all ${theme === 'light' ? 'bg-white dark:bg-[#3A3A3C] shadow-sm text-yellow-500' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
                title="Light Mode"
              >
                <Sun className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setTheme('system')}
                className={`p-1.5 rounded-full transition-all ${theme === 'system' ? 'bg-white dark:bg-[#3A3A3C] shadow-sm text-blue-500' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
                title="System Theme"
              >
                <Monitor className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={`p-1.5 rounded-full transition-all ${theme === 'dark' ? 'bg-white dark:bg-[#3A3A3C] shadow-sm text-purple-400' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
                title="Dark Mode"
              >
                <Moon className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="text-[10px] text-gray-400 dark:text-gray-600">
              Editing /etc/hosts requires administrator privileges on save.
            </div>
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
      group grid grid-cols-12 gap-4 px-4 py-3 items-center border-b border-gray-100 dark:border-[#38383A] last:border-0 hover:bg-gray-50 dark:hover:bg-[#2C2C2E] transition-colors
      ${!enabled ? 'opacity-50 grayscale' : ''}
    `}>

      {/* Toggle Switch */}
      <div className="col-span-1 flex justify-center">
        <button
          onClick={onToggle}
          disabled={isSystem}
          className={`
            relative w-11 h-6 rounded-full transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1.0)] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#1C1C1E]
            ${enabled ? 'bg-[#34C759]' : 'bg-[#E9E9EA] dark:bg-[#39393D]'}
            ${isSystem ? 'cursor-not-allowed opacity-60' : 'cursor-pointer active:scale-95'}
          `}
        >
          <span className={`
            absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-[0_2px_4px_rgba(0,0,0,0.1)] transition-transform duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1.0)]
            ${enabled ? 'translate-x-5' : 'translate-x-0'}
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
            w-full bg-transparent font-mono text-sm text-gray-800 dark:text-gray-200 outline-none rounded px-1.5 py-0.5
            ${!isSystem && 'hover:bg-gray-200/50 dark:hover:bg-[#3A3A3C] focus:bg-white dark:focus:bg-[#1C1C1E] focus:ring-2 focus:ring-blue-500/20 transition-all'}
            ${isSystem && 'text-gray-500 dark:text-gray-500 cursor-default'}
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
            w-full bg-transparent text-sm font-medium text-gray-900 dark:text-gray-100 outline-none rounded px-1.5 py-0.5
            ${!isSystem && 'hover:bg-gray-200/50 dark:hover:bg-[#3A3A3C] focus:bg-white dark:focus:bg-[#1C1C1E] focus:ring-2 focus:ring-blue-500/20 transition-all'}
            ${isSystem && 'text-gray-500 dark:text-gray-500 cursor-default'}
          `}
          spellCheck={false}
        />
      </div>

      {/* Delete Action */}
      <div className="col-span-1 flex justify-end">
        {!isSystem && (
          <button
            onClick={onDelete}
            className="text-gray-300 dark:text-[#3A3A3C] hover:text-red-500 dark:hover:text-red-400 p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition-all opacity-0 group-hover:opacity-100"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
        {isSystem && (
          <span className="text-xs text-gray-300 dark:text-[#3A3A3C] select-none">System</span>
        )}
      </div>
    </div>
  );
}
