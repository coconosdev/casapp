import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { sections, recipes } from '../data/recipes';

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none"
       stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="7" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const CloseIcon = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none"
       stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const ArrowIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none"
       stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

function RecipeModal({ recipe, onClose }) {
  const [tab, setTab] = useState('ingredientes');

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  return (
    <div className="comidas-modal-backdrop" onClick={onClose}>
      <div className="comidas-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label={recipe.name}>
        <header className="comidas-modal-header">
          <h2>{recipe.name}</h2>
          <button className="comidas-icon-btn" onClick={onClose} aria-label="Cerrar">
            <CloseIcon />
          </button>
        </header>

        <div className="comidas-segmented" role="tablist">
          <button
            role="tab"
            aria-selected={tab === 'ingredientes'}
            className={tab === 'ingredientes' ? 'is-active' : ''}
            onClick={() => setTab('ingredientes')}
          >
            Ingredientes
          </button>
          <button
            role="tab"
            aria-selected={tab === 'instrucciones'}
            className={tab === 'instrucciones' ? 'is-active' : ''}
            onClick={() => setTab('instrucciones')}
          >
            Instrucciones
          </button>
        </div>

        <div className="comidas-modal-body">
          {tab === 'ingredientes' ? (
            <ul className="comidas-ingredients">
              {recipe.ingredients.map((ing, i) => <li key={i}>{ing}</li>)}
            </ul>
          ) : (
            <ol className="comidas-steps">
              {recipe.steps.map((s, i) => <li key={i}>{s}</li>)}
            </ol>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Comidas() {
  const [activeSection, setActiveSection] = useState(sections[0].id);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return recipes
      .filter((r) => r.section === activeSection)
      .filter((r) => (q ? r.name.toLowerCase().includes(q) : true));
  }, [activeSection, query]);

  const handleSection = useCallback((id) => {
    setActiveSection(id);
    setQuery('');
  }, []);

  return (
    <section className="comidas">
      <div className="comidas-header">
        <h1>Comidas</h1>
        <p>Recetario nutricional — escoge una sección para empezar.</p>
      </div>

      <div className="comidas-tabs" role="tablist">
        {sections.map((s) => (
          <button
            key={s.id}
            role="tab"
            aria-selected={activeSection === s.id}
            className={`comidas-tab ${activeSection === s.id ? 'is-active' : ''}`}
            onClick={() => handleSection(s.id)}
          >
            <span className="comidas-tab-emoji" aria-hidden="true">{s.emoji}</span>
            <span>{s.label}</span>
          </button>
        ))}
      </div>

      <label className="comidas-search">
        <span className="comidas-search-icon" aria-hidden="true"><SearchIcon /></span>
        <input
          type="text"
          placeholder="Buscar receta..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </label>

      {filtered.length === 0 ? (
        <p className="comidas-empty">No hay recetas que coincidan con tu búsqueda.</p>
      ) : (
        <div className="comidas-grid">
          {filtered.map((r) => (
            <button
              key={r.id}
              className="comidas-card"
              onClick={() => setSelected(r)}
            >
              <span className="comidas-card-name">{r.name}</span>
              <span className="comidas-card-arrow" aria-hidden="true"><ArrowIcon /></span>
            </button>
          ))}
        </div>
      )}

      {selected && <RecipeModal recipe={selected} onClose={() => setSelected(null)} />}
    </section>
  );
}
