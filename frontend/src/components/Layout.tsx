import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  Megaphone,
  TrendingUp,
  Sparkles,
  Menu,
  X,
  ChevronRight
} from 'lucide-react';
import clsx from 'clsx';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
}

const navItems = [
  { id: 'dashboard', label: '總覽', icon: LayoutDashboard },
  { id: 'kols', label: 'KOL 探索', icon: Users },
  { id: 'campaigns', label: 'Campaign', icon: Megaphone },
  { id: 'insights', label: '數據洞察', icon: TrendingUp },
  { id: 'stories', label: '數據故事', icon: Sparkles },
];

export function Layout({ children, currentPage, onNavigate }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-[var(--background)] flex">
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarOpen ? 260 : 72 }}
        className="fixed left-0 top-0 h-full bg-[var(--surface)] border-r border-[var(--border)] z-50 flex flex-col"
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-4 border-b border-[var(--border)]">
          <motion.div
            initial={false}
            animate={{ opacity: sidebarOpen ? 1 : 0 }}
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            {sidebarOpen && (
              <div>
                <h1 className="font-bold text-lg text-white">Influence</h1>
                <p className="text-xs text-[var(--text-secondary)]">Dashboard</p>
              </div>
            )}
          </motion.div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="ml-auto p-2 rounded-lg hover:bg-[var(--surface-light)] transition-colors"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-2">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;

              return (
                <li key={item.id}>
                  <button
                    onClick={() => onNavigate(item.id)}
                    className={clsx(
                      'w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200',
                      isActive
                        ? 'bg-[var(--primary)] text-white shadow-lg shadow-[var(--primary)]/20'
                        : 'text-[var(--text-secondary)] hover:bg-[var(--surface-light)] hover:text-white'
                    )}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <AnimatePresence>
                      {sidebarOpen && (
                        <motion.span
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          className="font-medium"
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </AnimatePresence>
                    {isActive && sidebarOpen && (
                      <ChevronRight className="w-4 h-4 ml-auto" />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-[var(--border)]">
          <AnimatePresence>
            {sidebarOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="glass rounded-xl p-4"
              >
                <p className="text-xs text-[var(--text-secondary)] mb-2">
                  Powered by
                </p>
                <p className="font-semibold text-sm">Nuway Tech</p>
                <p className="text-xs text-[var(--text-secondary)]">
                  影響力數據專案 Prototype
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main
        className="flex-1 transition-all duration-300"
        style={{ marginLeft: sidebarOpen ? 260 : 72 }}
      >
        <div className="min-h-screen p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
