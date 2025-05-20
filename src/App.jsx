import { useState } from 'react';
import './index.css';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [menuOpen, setMenuOpen] = useState(false);

  const tabs = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'trip1', label: 'Trip 1' },
    { id: 'trip2', label: 'Trip 2' },
    { id: 'statistik', label: 'Statistik' },
    { id: 'verbrauch', label: 'Verbrauch' },
    { id: 'service', label: 'Service' },
    { id: 'einstellungen', label: 'Einstellungen' },
  ];

  return (
    <div className="flex min-h-screen text-black dark:text-white bg-white dark:bg-zinc-900">
      <div className={`fixed z-50 top-0 left-0 h-full w-64 bg-gray-100 dark:bg-zinc-800 p-4 transform transition-transform duration-300 ease-in-out ${menuOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0`}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">ZeroTrace</h2>
          <button onClick={() => setMenuOpen(false)} className="md:hidden text-xl">×</button>
        </div>
        <nav className="flex flex-col space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`text-left px-3 py-2 rounded ${activeTab === tab.id ? 'bg-blue-600 text-white' : 'hover:bg-blue-100 dark:hover:bg-zinc-700'}`}
              onClick={() => {
                setActiveTab(tab.id);
                setMenuOpen(false);
              }}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="flex-1 p-4 ml-0 md:ml-64">
        <header className="flex items-center justify-between mb-4">
          <button className="md:hidden text-2xl" onClick={() => setMenuOpen(true)}>☰</button>
          <h1 className="text-xl font-bold">ZeroTrace KT v1</h1>
        </header>
        <main className="space-y-4">
          <p>Aktiver Reiter: {activeTab}</p>
        </main>
      </div>
    </div>
  );
}

export default App;