// Sidebar + topbar + shell shared pieces
const { useState, useEffect, useMemo, useRef } = React;

function Sidebar({ active, setActive }) {
  const items = [
    { group: 'PRINCIPAL', items: [
      { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
      { id: 'asesorados', label: 'Asesorados', icon: 'users', badge: '200' },
      { id: 'checkins', label: 'Check-ins', icon: 'check', badge: '12' },
    ]},
    { group: 'PLANES', items: [
      { id: 'nutricion', label: 'Nutrición', icon: 'apple' },
      { id: 'entrenamiento', label: 'Entrenamiento', icon: 'dumbbell' },
      { id: 'biblioteca', label: 'Biblioteca', icon: 'file' },
    ]},
    { group: 'NEGOCIO', items: [
      { id: 'cobros', label: 'Cobros', icon: 'money' },
      { id: 'calendario', label: 'Calendario', icon: 'calendar' },
      { id: 'mensajes', label: 'Mensajes', icon: 'message', badge: '4' },
    ]},
    { group: 'COMPARTIR', items: [
      { id: 'link', label: 'Link público', icon: 'link' },
      { id: 'pdf', label: 'Vista PDF', icon: 'file' },
    ]},
  ];

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark">WE</div>
        <div className="brand-text">
          <div className="name">WILMIN <span>ESTÉVEZ</span></div>
          <div className="role">Fitness Coach · RD</div>
        </div>
      </div>

      {items.map(group => (
        <div key={group.group}>
          <div className="nav-label">{group.group}</div>
          {group.items.map(item => (
            <div
              key={item.id}
              className={'nav-item' + (active === item.id ? ' active' : '')}
              onClick={() => setActive(item.id)}
            >
              <span className="nav-icon"><Icon name={item.icon} size={15} /></span>
              <span>{item.label}</span>
              {item.badge && <span className="badge">{item.badge}</span>}
            </div>
          ))}
        </div>
      ))}

      <div className="sidebar-footer">
        <div className="coach-avatar">WE</div>
        <div className="coach-info">
          <div className="name">Wilmin Estévez</div>
          <div className="handle">@wilmin_estevez</div>
        </div>
        <Icon name="settings" size={14} />
      </div>
    </aside>
  );
}

function Topbar({ title, accent, children }) {
  return (
    <div className="topbar">
      <div className="topbar-title">
        {title} {accent && <span>{accent}</span>}
      </div>
      <div className="topbar-search">
        <Icon name="search" size={14} />
        <input placeholder="Buscar asesorado, plan, nota..." />
      </div>
      <div style={{ flex: 1 }} />
      {children}
      <button className="btn-ghost btn btn-sm"><Icon name="bell" size={13} /></button>
      <button className="btn btn-primary btn-sm"><Icon name="plus" size={13} /> Nuevo asesorado</button>
    </div>
  );
}

Object.assign(window, { Sidebar, Topbar });
