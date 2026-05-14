// Main app — routing + tweaks
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "#FF4500",
  "density": "comfortable",
  "showSidebar": true,
  "dashboardLayout": "command",
  "background": "urban"
}/*EDITMODE-END*/;

function App() {
  const [view, setView] = useState('dashboard');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [tweaks, setTweak] = (window.useTweaks || (d => [d, () => {}]))(TWEAK_DEFAULTS);

  // Map sidebar id -> view component
  const renderView = () => {
    switch (view) {
      case 'dashboard': return <Dashboard goto={setView} />;
      case 'asesorados': return <AsesoradosList goto={setView} />;
      case 'perfil': return <AsesoradoProfile goto={setView} />;
      case 'nutricion': return <PlanNutricionalView />;
      case 'entrenamiento': return <PlanEntrenamientoView />;
      case 'biblioteca': return <BibliotecaView />;
      case 'cobros': return <CobrosView />;
      case 'calendario': return <CalendarView />;
      case 'checkins': return <CalendarView />;
      case 'mensajes': return <MensajesView />;
      case 'pdf': return <PDFPreview />;
      case 'link': return <PublicLinkView />;
      default: return <Dashboard goto={setView} />;
    }
  };

  const titles = {
    dashboard: ['DASHBOARD', null],
    asesorados: ['ASESORADOS', null],
    perfil: ['PERFIL', '· YARISBEL P.'],
    nutricion: ['PLAN NUTRICIONAL', null],
    entrenamiento: ['PLAN DE ENTRENO', null],
    biblioteca: ['BIBLIOTECA', null],
    cobros: ['COBROS', null],
    calendario: ['AGENDA', null],
    checkins: ['CHECK-INS', null],
    mensajes: ['MENSAJES', null],
    pdf: ['VISTA PDF', null],
    link: ['LINK PÚBLICO', null],
  };

  const [title, accent] = titles[view] || ['', null];

  // Apply accent color from tweaks
  useEffect(() => {
    document.documentElement.style.setProperty('--we-orange', tweaks.accent);
    // Compute orange dark from accent
    const c = tweaks.accent;
    document.documentElement.style.setProperty('--we-orange-soft', c + '1F');
  }, [tweaks.accent]);

  return (
    <div className="app">
      <Sidebar active={view} setActive={setView} />
      <div className="main">
        {/* Special: mensajes has its own layout */}
        {view === 'mensajes' ? (
          <MensajesView />
        ) : (
          <>
            <div className="topbar">
              <div className="topbar-title">
                {title} {accent && <span>{accent}</span>}
              </div>
              <div className="topbar-search">
                <Icon name="search" size={14} />
                <input placeholder="Buscar asesorado, plan, nota..." />
              </div>
              <div style={{ flex: 1 }} />
              <button className="btn btn-ghost btn-sm"><Icon name="bell" size={13} /></button>
              <button className="btn btn-primary btn-sm" onClick={() => setShowOnboarding(true)}>
                <Icon name="plus" size={13} /> Nuevo asesorado
              </button>
            </div>
            {renderView()}
          </>
        )}
      </div>

      {showOnboarding && <OnboardingModal onClose={() => setShowOnboarding(false)} />}

      {/* Tweaks panel */}
      {window.TweaksPanel && (
        <window.TweaksPanel title="TWEAKS">
          <window.TweakSection title="Marca">
            <window.TweakColor
              label="Color principal"
              value={tweaks.accent}
              options={['#FF4500','#E11D48','#22C55E','#3B82F6','#A855F7']}
              onChange={(v) => setTweak('accent', v)}
            />
          </window.TweakSection>
          <window.TweakSection title="Layout">
            <window.TweakSelect
              label="Densidad"
              value={tweaks.density}
              options={['comfortable','compact']}
              onChange={(v) => setTweak('density', v)}
            />
          </window.TweakSection>
          <window.TweakSection title="Navegación rápida">
            <div className="col gap-6">
              {[
                ['dashboard','Dashboard'],
                ['asesorados','Lista asesorados'],
                ['perfil','Perfil completo'],
                ['nutricion','Plan nutricional'],
                ['entrenamiento','Plan entreno'],
                ['biblioteca','Biblioteca ejer.'],
                ['cobros','Cobros'],
                ['calendario','Calendario'],
                ['mensajes','Mensajes'],
                ['pdf','Vista PDF'],
                ['link','Link público'],
              ].map(([id, label]) => (
                <button key={id} onClick={() => setView(id)}
                  style={{
                    padding: '6px 10px',
                    background: view === id ? 'var(--we-orange)' : 'rgba(255,255,255,0.05)',
                    color: '#fff',
                    fontSize: 11,
                    textAlign: 'left',
                    border: 'none',
                    cursor: 'pointer'
                  }}>{label}</button>
              ))}
              <button onClick={() => setShowOnboarding(true)}
                style={{
                  padding: '6px 10px',
                  background: 'rgba(255,255,255,0.05)',
                  color: '#fff',
                  fontSize: 11,
                  textAlign: 'left',
                  border: '1px dashed var(--we-orange)',
                  cursor: 'pointer'
                }}>+ Onboarding (modal)</button>
            </div>
          </window.TweakSection>
        </window.TweaksPanel>
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
