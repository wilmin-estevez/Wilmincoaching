// Dashboard view — coach's command center
function Dashboard({ goto }) {
  const { CLIENTS } = window.WE_DATA;

  const stats = useMemo(() => {
    const active = CLIENTS.filter(c => c.status === 'Activo').length;
    const renew = CLIENTS.filter(c => c.status === 'Por renovar').length;
    const overdue = CLIENTS.filter(c => c.status === 'Vencido').length;
    const newOnes = CLIENTS.filter(c => c.status === 'Nuevo').length;
    const revenue = CLIENTS.reduce((a, c) => a + c.monthly, 0);
    const pending = CLIENTS.filter(c => c.payment === 'Pendiente').length;
    const overduePay = CLIENTS.filter(c => c.payment === 'Vencido').length;
    return { active, renew, overdue, newOnes, revenue, pending, overduePay };
  }, [CLIENTS]);

  const todayChecks = CLIENTS.slice(0, 12).map((c, i) => ({
    ...c,
    time: ['8:00 AM','9:30 AM','11:00 AM','12:30 PM','2:00 PM','3:30 PM','5:00 PM','6:30 PM'][i % 8],
    type: ['Check-in semanal','Plan a actualizar','Llamada de seguimiento','Revisión de fotos','Ajuste de macros'][i % 5]
  }));

  const renewalSoon = CLIENTS
    .filter(c => c.status === 'Por renovar' || c.status === 'Vencido')
    .slice(0, 6);

  const lowAdherence = CLIENTS
    .filter(c => c.adherence < 60)
    .sort((a, b) => a.adherence - b.adherence)
    .slice(0, 5);

  return (
    <div className="content">
      {/* Hero motivational strip */}
      <div style={{
        background: '#0A0A0A',
        border: '1px solid var(--we-carbon-2)',
        padding: '22px 26px',
        marginBottom: 22,
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 24
      }}>
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 6, background: 'var(--we-orange)' }} />
        <div style={{ paddingLeft: 8 }}>
          <div style={{ fontSize: 10, letterSpacing: 2, color: 'var(--we-orange)', fontWeight: 700, marginBottom: 6 }}>MIÉRCOLES · 13 MAY 2026</div>
          <div className="display" style={{ fontSize: 28, letterSpacing: 0.5, lineHeight: 1.1 }}>
            BUEN DÍA, <span style={{ color: 'var(--we-orange)' }}>WILMIN.</span>
          </div>
          <div className="text-sm text-mid" style={{ marginTop: 6, maxWidth: 520 }}>
            Hoy tienes <b style={{ color: '#fff' }}>12 check-ins</b>, <b style={{ color: '#fff' }}>{stats.renew}</b> renovaciones próximas y <b style={{ color: 'var(--we-orange)' }}>{stats.overduePay}</b> pagos por cobrar. Vamos.
          </div>
        </div>
        <div className="row gap-8">
          <button className="btn btn-ghost btn-sm"><Icon name="instagram" size={12}/> Compartir reel</button>
          <button className="btn btn-primary"><Icon name="plus" size={13}/> Generar plan</button>
        </div>
      </div>

      {/* KPI grid */}
      <div className="kpi-grid">
        <div className="kpi">
          <div className="kpi-label">Asesorados activos</div>
          <div className="kpi-value">{stats.active}</div>
          <div className="kpi-delta up"><Icon name="arrowUp" size={11}/> +14 este mes</div>
        </div>
        <div className="kpi">
          <div className="kpi-label">Ingresos del mes</div>
          <div className="kpi-value">${(stats.revenue / 1000).toFixed(1)}K</div>
          <div className="kpi-delta up"><Icon name="trending" size={11}/> +18% vs Abr</div>
        </div>
        <div className="kpi dim">
          <div className="kpi-label">Por renovar</div>
          <div className="kpi-value">{stats.renew}</div>
          <div className="kpi-delta"><Icon name="bell" size={11}/> 14 días o menos</div>
        </div>
        <div className="kpi dim">
          <div className="kpi-label">Pagos vencidos</div>
          <div className="kpi-value">{stats.overduePay}</div>
          <div className="kpi-delta down"><Icon name="arrowDown" size={11}/> -2 vs sem pasada</div>
        </div>
      </div>

      {/* 2-col layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 18 }}>
        {/* Today's agenda */}
        <div className="card accent">
          <div className="row between mb-16">
            <div>
              <div className="card-title">AGENDA DE HOY</div>
              <div className="card-subtitle">12 check-ins programados · 4 llamadas</div>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={() => goto('calendario')}>Ver semana <Icon name="arrowRight" size={11}/></button>
          </div>
          <div className="col gap-8 scrollable" style={{ maxHeight: 420 }}>
            {todayChecks.map((c, i) => (
              <div key={i} style={{
                display: 'grid',
                gridTemplateColumns: '70px 1fr auto',
                gap: 14,
                alignItems: 'center',
                padding: '12px 14px',
                background: 'var(--we-black)',
                borderLeft: '3px solid ' + (i < 3 ? 'var(--we-orange)' : 'var(--we-carbon-3)'),
              }}>
                <div className="display" style={{ fontSize: 14, letterSpacing: 1 }}>{c.time}</div>
                <div className="row gap-12">
                  <div className="avatar">{c.initials}</div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{c.name.split(' ').slice(0,2).join(' ')}</div>
                    <div className="text-xs text-mid">{c.type}</div>
                  </div>
                </div>
                <div className="row gap-4">
                  <span className={'tag ' + (c.adherence > 80 ? 'success' : c.adherence > 60 ? 'warn' : 'danger')}>
                    {c.adherence}%
                  </span>
                  <button className="btn btn-ghost btn-sm" style={{ padding: '4px 8px' }} onClick={() => goto('perfil')}><Icon name="chevronRight" size={11}/></button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div className="col gap-16">
          {/* Renewals */}
          <div className="card">
            <div className="row between mb-12">
              <div>
                <div className="card-title">RENOVACIONES URGENTES</div>
                <div className="card-subtitle">Cobra antes que se enfríen</div>
              </div>
              <Icon name="flame" size={18} stroke={1.8} />
            </div>
            <div className="col gap-8">
              {renewalSoon.map((c, i) => (
                <div key={i} style={{
                  display: 'grid',
                  gridTemplateColumns: '32px 1fr auto',
                  gap: 10,
                  alignItems: 'center',
                  padding: '8px 0',
                  borderBottom: i < renewalSoon.length-1 ? '1px solid var(--we-carbon-2)' : 'none'
                }}>
                  <div className="avatar" style={{ width: 28, height: 28, fontSize: 10 }}>{c.initials}</div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600 }}>{c.name.split(' ').slice(0,2).join(' ')}</div>
                    <div className="text-xs text-mid">{c.plan}</div>
                  </div>
                  <span className={'tag ' + (c.daysLeft < 0 ? 'danger' : 'warn')}>
                    {c.daysLeft < 0 ? Math.abs(c.daysLeft) + 'd venc.' : c.daysLeft + 'd'}
                  </span>
                </div>
              ))}
            </div>
            <button className="btn btn-ghost btn-sm mt-12" style={{ width: '100%', justifyContent: 'center' }} onClick={() => goto('cobros')}>
              Ver todos los cobros
            </button>
          </div>

          {/* Low adherence */}
          <div className="card">
            <div className="row between mb-12">
              <div>
                <div className="card-title">BAJA ADHERENCIA</div>
                <div className="card-subtitle">Necesitan tu llamada</div>
              </div>
              <Icon name="bell" size={18} />
            </div>
            <div className="col gap-10">
              {lowAdherence.map((c, i) => (
                <div key={i} className="row gap-10">
                  <div className="avatar" style={{ width: 28, height: 28, fontSize: 10 }}>{c.initials}</div>
                  <div className="flex-1">
                    <div className="row between">
                      <div style={{ fontSize: 12, fontWeight: 600 }}>{c.name.split(' ').slice(0,2).join(' ')}</div>
                      <div className="text-xs" style={{ color: c.adherence < 50 ? 'var(--we-danger)' : 'var(--we-warn)' }}>
                        {c.adherence}%
                      </div>
                    </div>
                    <div className="bar mt-4">
                      <div className={'bar-fill ' + (c.adherence < 50 ? 'danger' : 'warn')}
                        style={{ width: c.adherence + '%', background: c.adherence < 50 ? 'var(--we-danger)' : 'var(--we-warn)' }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom — recent activity + revenue chart */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginTop: 18 }}>
        <div className="card">
          <div className="card-title mb-16">INGRESOS · ÚLTIMAS 12 SEMANAS</div>
          <RevenueChart />
        </div>
        <div className="card">
          <div className="row between mb-12">
            <div className="card-title">ACTIVIDAD RECIENTE</div>
            <button className="btn btn-ghost btn-sm">Filtrar</button>
          </div>
          <ActivityFeed />
        </div>
      </div>
    </div>
  );
}

function RevenueChart() {
  const data = [12,14,13,16,15,17,18,17,19,21,20,24];
  const max = Math.max(...data);
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 8, alignItems: 'flex-end', height: 140 }}>
        {data.map((v, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <div style={{
              width: '100%',
              height: (v/max)*100 + '%',
              background: i === data.length-1 ? 'var(--we-orange)' : 'var(--we-carbon-3)',
              minHeight: 8,
              position: 'relative'
            }}>
              {i === data.length-1 && (
                <div style={{
                  position: 'absolute', top: -22, left: '50%', transform: 'translateX(-50%)',
                  fontSize: 10, fontWeight: 700, color: 'var(--we-orange)', whiteSpace: 'nowrap'
                }}>${v}K</div>
              )}
            </div>
            <div style={{ fontSize: 9, color: 'var(--we-gray-low)' }}>{['S1','S2','S3','S4','S5','S6','S7','S8','S9','S10','S11','S12'][i]}</div>
          </div>
        ))}
      </div>
      <div className="row gap-16 mt-16" style={{ paddingTop: 14, borderTop: '1px solid var(--we-carbon-2)' }}>
        <div>
          <div className="text-xs text-mid uppercase" style={{ letterSpacing: 1.5 }}>Total</div>
          <div className="display" style={{ fontSize: 22 }}>$206K</div>
        </div>
        <div>
          <div className="text-xs text-mid uppercase" style={{ letterSpacing: 1.5 }}>Promedio</div>
          <div className="display" style={{ fontSize: 22 }}>$17.2K</div>
        </div>
        <div>
          <div className="text-xs text-mid uppercase" style={{ letterSpacing: 1.5 }}>Mejor sem.</div>
          <div className="display" style={{ fontSize: 22, color: 'var(--we-orange)' }}>$24K</div>
        </div>
      </div>
    </div>
  );
}

function ActivityFeed() {
  const events = [
    { who: 'YP', name: 'Yarisbel P.', what: 'subió fotos de progreso · semana 14', when: 'hace 12 min', icon: 'camera' },
    { who: 'RC', name: 'Robert C.', what: 'pagó mensualidad · $150', when: 'hace 1 h', icon: 'money', tag: 'success' },
    { who: 'AM', name: 'Anneris M.', what: 'completó check-in semanal', when: 'hace 2 h', icon: 'check', tag: 'success' },
    { who: 'JN', name: 'Junior N.', what: 'plan vence en 3 días', when: 'hace 3 h', icon: 'bell', tag: 'warn' },
    { who: 'SP', name: 'Stephanie P.', what: 'nuevo asesorado · onboarding pendiente', when: 'hace 5 h', icon: 'star', tag: 'orange' },
    { who: 'BR', name: 'Brayan R.', what: 'no respondió mensaje en 4 días', when: 'ayer', icon: 'message', tag: 'danger' },
  ];
  return (
    <div className="col gap-12">
      {events.map((e, i) => (
        <div key={i} className="row gap-10" style={{ paddingBottom: 12, borderBottom: i < events.length-1 ? '1px solid var(--we-carbon-2)' : 'none' }}>
          <div className="avatar" style={{ width: 28, height: 28, fontSize: 10 }}>{e.who}</div>
          <div className="flex-1">
            <div style={{ fontSize: 12 }}>
              <b>{e.name}</b> <span className="text-mid">{e.what}</span>
            </div>
            <div className="text-xs text-low">{e.when}</div>
          </div>
          {e.tag && <span className={'tag ' + e.tag}><Icon name={e.icon} size={9}/></span>}
        </div>
      ))}
    </div>
  );
}

window.Dashboard = Dashboard;
