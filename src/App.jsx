import { useState } from 'react';
import './index.css';
import {
  Home,
  MapPin,
  BarChart2,
  Droplet,
  Settings,
  Wrench,
  Gauge,
} from 'lucide-react';

import Bordcomputer from './Bordcomputer';
import Kosten from './Kosten';
import Dashboard from './components/dashboard/Dashboard';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [menuOpen, setMenuOpen] = useState(false);

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'trip1', label: 'Bordcomputer', icon: Gauge },
    { id: 'statistik', label: 'Statistik', icon: BarChart2 },
    { id: 'kosten', label: 'Kosten', icon: Droplet },
    { id: 'service', label: 'Service', icon: Wrench },
    { id: 'einstellungen', label: 'Einstellungen', icon: Settings },
  ];

  return (
    <div className="flex min-h-screen text-black dark:text-white bg-white dark:bg-zinc-900">
      {/* Sidebar */}
      <div
        className={`fixed z-50 top-0 left-0 h-full w-64 bg-gray-100 dark:bg-zinc-800 p-4 transform transition-transform duration-300 ease-in-out ${
          menuOpen ? 'translate-x-0' : '-translate-x-full'
        } md:relative md:translate-x-0`}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">ZeroTrace</h2>
          <button
            onClick={() => setMenuOpen(false)}
            className="md:hidden text-xl"
            aria-label="Menü schließen"
          >
            ×
          </button>
        </div>
        <nav className="flex flex-col space-y-2">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              className={`flex items-center gap-3 text-left px-3 py-2 rounded ${
                activeTab === id
                  ? 'bg-blue-600 text-white'
                  : 'hover:bg-blue-100 dark:hover:bg-zinc-700'
              }`}
              onClick={() => {
                setActiveTab(id);
                setMenuOpen(false);
              }}
            >
              <Icon size={20} />
              <span className="text-base">{label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 ml-0 md:ml-64">
        <header className="flex items-center justify-between mb-4">
          <button
            className="md:hidden text-2xl"
            onClick={() => setMenuOpen(true)}
            aria-label="Menü öffnen"
          >
            ☰
          </button>
          <h1 className="text-xl font-bold flex items-center gap-2">
            ZeroTrace KT v1
          </h1>
        </header>

        <main className="space-y-6">
          {activeTab === 'dashboard' && (
            <section>
              <Dashboard />
            </section>
          )}
          {activeTab === 'trip1' && (
            <section>
              <Bordcomputer />
            </section>
          )}
          {activeTab === 'statistik' && (
            <section>
              <h2 className="text-2xl font-semibold mb-2">Statistik</h2>
              <p>Hier kommen Statistiken und Graphen.</p>
            </section>
          )}
          {activeTab === 'kosten' && (
            <section>
              <Kosten />
            </section>
          )}
          {activeTab === 'service' && (
            <section>
              <h2 className="text-2xl font-semibold mb-2">Service</h2>
              <p>Wartung & Reparaturen.</p>
            </section>
          )}
          {activeTab === 'einstellungen' && (
            <section>
              <h2 className="text-2xl font-semibold mb-2">Einstellungen</h2>
              <p>App- & Fahrzeug-Einstellungen.</p>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
