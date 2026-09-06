import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext.jsx';

const linkClass = ({ isActive }) =>
  `text-sm transition-colors ${isActive ? 'text-ink font-medium' : 'text-slate-ink hover:text-ink'}`;

export default function Navbar() {
  const navigate = useNavigate();
  const { resetIntake } = useAppContext();
  const [menuOpen, setMenuOpen] = useState(false);

  const startNew = () => {
    resetIntake();
    setMenuOpen(false);
    navigate('/analyze');
  };

  return (
    <header className="sticky top-0 z-40 border-b border-ink/8 bg-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <NavLink to="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ink text-sm font-display text-gold">
            F
          </span>
          <span className="font-display text-lg tracking-tight">Fitmark</span>
        </NavLink>

        <nav className="hidden items-center gap-7 md:flex">
          <NavLink to="/" className={linkClass} end>
            Home
          </NavLink>
          <NavLink to="/history" className={linkClass}>
            History
          </NavLink>
          <button onClick={startNew} className="btn-primary">
            New analysis
          </button>
        </nav>

        <button
          className="flex h-9 w-9 items-center justify-center rounded-card border border-ink/15 md:hidden"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      {menuOpen && (
        <div className="flex flex-col gap-1 border-t border-ink/8 px-5 py-3 md:hidden">
          <NavLink to="/" className={linkClass} end onClick={() => setMenuOpen(false)}>
            Home
          </NavLink>
          <NavLink to="/history" className={linkClass} onClick={() => setMenuOpen(false)}>
            History
          </NavLink>
          <button onClick={startNew} className="btn-primary mt-2 w-full">
            New analysis
          </button>
        </div>
      )}
    </header>
  );
}
