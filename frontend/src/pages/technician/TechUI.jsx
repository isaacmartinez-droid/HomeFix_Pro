import './TechWorkspace.css';
export function TechIcon({ name = 'work' }) {
  const paths = {
    work: 'M9 6V4h6v2M3 6h18v14H3zM3 11c6 3 12 3 18 0M10 12h4',
    shield: 'M12 3 3 7v5c0 5 9 9 9 9s9-4 9-9V7zM8 12l3 3 5-6',
    calendar: 'M4 5h16v16H4zM8 3v4M16 3v4M4 10h16M8 14h2M14 14h2',
    check: 'M5 12l4 4L19 6',
    pin: 'M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0zM14 10a2 2 0 1 1-4 0 2 2 0 0 1 4 0',
    person: 'M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0M4 21v-3a8 8 0 0 1 16 0v3',
    clock: 'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0M12 7v5l3 2',
    upload: 'M12 16V3M7 8l5-5 5 5M4 15v6h16v-6',
    document: 'M5 3h9l5 5v13H5zM14 3v6h5M8 13h8M8 17h6',
  };
  return <svg className="tech-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[name] || paths.work} /></svg>;
}
export function TechHero({ eyebrow, title, description, icon }) {
  return <header className="tech-hero"><div><p className="tech-eyebrow">{eyebrow}</p><h1>{title}</h1><p>{description}</p></div><div className="tech-hero-symbol"><TechIcon name={icon} /></div></header>;
}
export function TechEmpty({ title, description, icon = 'work', children }) {
  return <div className="tech-panel tech-empty"><div className="tech-stat-icon"><TechIcon name={icon} /></div><h2>{title}</h2><p className="tech-muted">{description}</p>{children}</div>;
}
