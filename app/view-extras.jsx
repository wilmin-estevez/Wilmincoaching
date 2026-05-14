// Cobros · Calendar · Mensajes · Biblioteca · Onboarding modal

// ============================================================
// COBROS
// ============================================================
function CobrosView() {
  const { CLIENTS } = window.WE_DATA;

  const totalMonth = CLIENTS.reduce((a, c) => a + c.monthly, 0);
  const collected = CLIENTS.filter(c => c.payment === 'Al día').reduce((a, c) => a + c.monthly, 0);
  const pending = totalMonth - collected;
  const overdueList = CLIENTS.filter(c => c.payment === 'Vencido');
  const pendingList = CLIENTS.filter(c => c.payment === 'Pendiente');

  return (
    <div className="content">
      <div className="row between mb-20">
        <div>
          <div className="display" style={{ fontSize: 26, letterSpacing: 1 }}>
            COBROS <span style={{ color: 'var(--we-orange)' }}>· MAYO 2026</span>
          </div>
          <div className="text-sm text-mid mt-4">Gestiona pagos, planes y precios</div>
        </div>
        <div className="row gap-8">
          <button className="btn btn-ghost btn-sm"><Icon name="download" size={12}/> Reporte mensual</button>
          <button className="btn btn-primary"><Icon name="plus" size={13}/> Registrar pago</button>
        </div>
      </div>

      {/* KPI row */}
      <div className="kpi-grid">
        <div className="kpi">
          <div className="kpi-label">Total proyectado</div>
          <div className="kpi-value">${(totalMonth/1000).toFixed(1)}K</div>
          <div className="kpi-delta">{CLIENTS.length} asesorados</div>
        </div>
        <div className="kpi" style={{ borderTop: '2px solid var(--we-success)' }}>
          <div className="kpi-label">Cobrado</div>
          <div className="kpi-value" style={{ color: 'var(--we-success)' }}>${(collected/1000).toFixed(1)}K</div>
          <div className="kpi-delta up"><Icon name="check" size={11}/> {Math.round(collected/totalMonth*100)}% del mes</div>
        </div>
        <div className="kpi dim">
          <div className="kpi-label">Pendiente</div>
          <div className="kpi-value" style={{ color: 'var(--we-warn)' }}>${(pending/1000).toFixed(1)}K</div>
          <div className="kpi-delta">{pendingList.length + overdueList.length} cobros</div>
        </div>
        <div className="kpi dim">
          <div className="kpi-label">Vencidos</div>
          <div className="kpi-value" style={{ color: 'var(--we-danger)' }}>{overdueList.length}</div>
          <div className="kpi-delta down">Cobrar urgente</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 18 }}>
        {/* Pricing manager */}
        <div className="col gap-18">
          <div className="card">
            <div className="row between mb-16">
              <div>
                <div className="card-title">PLANES & PRECIOS</div>
                <div className="card-subtitle">Tú defines los precios · cambios aplican a nuevos asesorados</div>
              </div>
              <button className="btn btn-ghost btn-sm"><Icon name="plus" size={11}/> Nuevo plan</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
              {[
                { name: 'BÁSICO', dur: '3 MESES', price: 65, color: 'var(--we-carbon-3)', clients: 38, features: ['Plan nutrición','Plan entreno','Check-in mensual'] },
                { name: 'PRO', dur: '6 MESES', price: 125, color: 'var(--we-orange)', clients: 94, features: ['Todo lo de Básico','Check-in semanal','Ajustes mensuales','WhatsApp directo'] },
                { name: 'VIP', dur: '12 MESES', price: 200, color: 'var(--we-orange-dark)', clients: 68, features: ['Todo lo de Pro','Llamadas mensuales','Carb cycling','Plan adaptable mensual'] },
              ].map((p, i) => (
                <div key={i} style={{
                  padding: 18,
                  background: 'var(--we-black)',
                  border: '1px solid var(--we-carbon-2)',
                  borderTop: '4px solid ' + p.color,
                  position: 'relative'
                }}>
                  <div className="row between mb-12">
                    <div className="display" style={{ fontSize: 18, letterSpacing: 1 }}>{p.name}</div>
                    <span className="tag">{p.clients}</span>
                  </div>
                  <div className="text-xs text-mid uppercase mb-12" style={{ letterSpacing: 1.5 }}>{p.dur}</div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 14 }}>
                    <div className="display" style={{ fontSize: 32, color: 'var(--we-orange)' }}>${p.price}</div>
                    <div className="text-xs text-mid">/ mes</div>
                  </div>
                  <div className="col gap-6 mb-16">
                    {p.features.map((f, j) => (
                      <div key={j} className="row gap-6 text-xs">
                        <Icon name="check" size={11} stroke={2}/> {f}
                      </div>
                    ))}
                  </div>
                  <div className="row gap-6">
                    <button className="btn btn-ghost btn-sm flex-1" style={{ justifyContent: 'center' }}><Icon name="edit" size={10}/> Editar</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="row between mb-12">
              <div className="card-title">PAGOS POR REGISTRAR</div>
              <div className="row gap-4">
                <button className="btn btn-ghost btn-sm">Todos</button>
                <button className="btn btn-primary btn-sm">Vencidos</button>
              </div>
            </div>
            <table className="table">
              <thead>
                <tr><th>Asesorado</th><th>Plan</th><th>Monto</th><th>Vencimiento</th><th>Días</th><th>Acción</th></tr>
              </thead>
              <tbody>
                {[...overdueList.slice(0, 4), ...pendingList.slice(0, 4)].map((c, i) => (
                  <tr key={i}>
                    <td>
                      <div className="row gap-10">
                        <div className="avatar" style={{ width: 28, height: 28, fontSize: 10 }}>{c.initials}</div>
                        <div style={{ fontWeight: 600 }}>{c.name.split(' ').slice(0,2).join(' ')}</div>
                      </div>
                    </td>
                    <td className="text-sm">{c.plan}</td>
                    <td><b style={{ color: 'var(--we-orange)' }}>${c.monthly}</b></td>
                    <td className="text-sm">01 May 2026</td>
                    <td>
                      <span className={'tag ' + (c.payment === 'Vencido' ? 'danger' : 'warn')}>
                        {c.payment === 'Vencido' ? '−' + (i+3) + 'd' : 'En 3d'}
                      </span>
                    </td>
                    <td>
                      <div className="row gap-4">
                        <button className="btn btn-dark btn-sm" style={{ padding: '4px 8px' }}><Icon name="message" size={10}/></button>
                        <button className="btn btn-primary btn-sm">Cobrar</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Methods + history */}
        <div className="col gap-18">
          <div className="card">
            <div className="card-title mb-12">MÉTODOS DE COBRO</div>
            <div className="col gap-10">
              {[
                ['Banreservas', '****4421', 47],
                ['Banco Popular', '****1893', 28],
                ['Transferencia internacional', 'Wise', 14],
                ['Efectivo', '—', 6],
              ].map(([m, info, n], i) => (
                <div key={i} className="row gap-12" style={{ padding: '10px 0', borderBottom: i < 3 ? '1px solid var(--we-carbon-2)' : 'none' }}>
                  <Icon name="money" size={18}/>
                  <div className="flex-1">
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{m}</div>
                    <div className="text-xs text-mid">{info}</div>
                  </div>
                  <span className="tag">{n} pagos</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="row between mb-12">
              <div className="card-title">PAGOS RECIENTES</div>
              <Icon name="check" size={16}/>
            </div>
            <div className="col gap-8">
              {[
                ['RC','Robert Cruz','VIP','$200','hace 1h'],
                ['MA','María Almonte','PRO','$125','hace 3h'],
                ['JT','Joselín T.','BÁSICO','$65','ayer'],
                ['IF','Iván Familia','PRO','$125','ayer'],
                ['LB','Lucía Báez','VIP','$200','ayer'],
              ].map(([i, n, p, m, w], idx) => (
                <div key={idx} className="row gap-10" style={{ padding: '8px 0', borderBottom: idx < 4 ? '1px solid var(--we-carbon-2)' : 'none' }}>
                  <div className="avatar" style={{ width: 26, height: 26, fontSize: 9 }}>{i}</div>
                  <div className="flex-1">
                    <div style={{ fontSize: 12, fontWeight: 600 }}>{n}</div>
                    <div className="text-xs text-mid">{p} · {w}</div>
                  </div>
                  <div className="text-sm" style={{ color: 'var(--we-success)', fontWeight: 700 }}>{m}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// CALENDARIO / CHECK-INS
// ============================================================
function CalendarView() {
  const { CLIENTS } = window.WE_DATA;
  const days = ['LUN 11', 'MAR 12', 'MIÉ 13', 'JUE 14', 'VIE 15', 'SÁB 16', 'DOM 17'];
  const hours = ['7AM','9AM','11AM','1PM','3PM','5PM','7PM'];

  // Generate fake events
  const events = [
    { day: 0, hour: 0, name: 'María García', type: 'Check-in', who: 'MG' },
    { day: 0, hour: 1, name: 'Yarisbel P.', type: 'Llamada', who: 'YP', accent: true },
    { day: 0, hour: 3, name: 'Robert Cruz', type: 'Check-in', who: 'RC' },
    { day: 1, hour: 0, name: 'Karla Mejía', type: 'Plan a actualizar', who: 'KM', warn: true },
    { day: 1, hour: 2, name: 'Junior N.', type: 'Check-in', who: 'JN' },
    { day: 1, hour: 4, name: 'Stephanie P.', type: 'Onboarding', who: 'SP', accent: true },
    { day: 2, hour: 1, name: 'Yarisbel P.', type: 'Check-in semanal', who: 'YP', accent: true },
    { day: 2, hour: 3, name: 'Iván Familia', type: 'Plan a actualizar', who: 'IF', warn: true },
    { day: 3, hour: 0, name: 'Anneris M.', type: 'Check-in', who: 'AM' },
    { day: 3, hour: 2, name: 'Lucía Báez', type: 'Llamada', who: 'LB', accent: true },
    { day: 4, hour: 1, name: 'Joselín T.', type: 'Check-in', who: 'JT' },
    { day: 4, hour: 3, name: 'Brayan R.', type: 'Check-in', who: 'BR' },
    { day: 4, hour: 5, name: 'Yarisbel P.', type: 'Cierre semana', who: 'YP', accent: true },
    { day: 5, hour: 1, name: 'Patricia D.', type: 'Onboarding', who: 'PD', accent: true },
  ];

  return (
    <div className="content">
      <div className="row between mb-20">
        <div>
          <div className="display" style={{ fontSize: 26, letterSpacing: 1 }}>
            AGENDA <span style={{ color: 'var(--we-orange)' }}>· 11–17 MAY</span>
          </div>
          <div className="text-sm text-mid mt-4">Check-ins, llamadas y planes por actualizar</div>
        </div>
        <div className="row gap-8">
          <div className="segmented">
            <button>Día</button>
            <button className="active">Semana</button>
            <button>Mes</button>
          </div>
          <button className="btn btn-ghost btn-sm"><Icon name="chevronLeft" size={11}/></button>
          <button className="btn btn-ghost btn-sm">Hoy</button>
          <button className="btn btn-ghost btn-sm"><Icon name="chevronRight" size={11}/></button>
          <button className="btn btn-primary"><Icon name="plus" size={13}/> Agendar</button>
        </div>
      </div>

      <div className="card" style={{ padding: 0 }}>
        {/* Day headers */}
        <div style={{ display: 'grid', gridTemplateColumns: '60px repeat(7, 1fr)', borderBottom: '1px solid var(--we-carbon-2)' }}>
          <div></div>
          {days.map((d, i) => (
            <div key={d} style={{
              padding: '14px 10px',
              borderLeft: '1px solid var(--we-carbon-2)',
              textAlign: 'center',
              background: i === 2 ? 'var(--we-orange-soft)' : 'transparent'
            }}>
              <div className="display" style={{ fontSize: 14, color: i === 2 ? 'var(--we-orange)' : '#fff', letterSpacing: 1 }}>
                {d.split(' ')[0]}
              </div>
              <div className="display" style={{ fontSize: 24, color: i === 2 ? 'var(--we-orange)' : '#fff' }}>
                {d.split(' ')[1]}
              </div>
            </div>
          ))}
        </div>

        {/* Time grid */}
        {hours.map((h, hi) => (
          <div key={h} style={{
            display: 'grid',
            gridTemplateColumns: '60px repeat(7, 1fr)',
            minHeight: 80,
            borderBottom: hi < hours.length - 1 ? '1px solid var(--we-carbon-2)' : 'none'
          }}>
            <div style={{
              padding: 10,
              fontSize: 10,
              color: 'var(--we-gray-mid)',
              fontWeight: 600,
              letterSpacing: 1,
              textAlign: 'right'
            }}>{h}</div>
            {days.map((_, di) => {
              const ev = events.find(e => e.day === di && e.hour === hi);
              return (
                <div key={di} style={{
                  borderLeft: '1px solid var(--we-carbon-2)',
                  padding: 6,
                  background: di === 2 ? 'rgba(255,69,0,0.03)' : 'transparent',
                  position: 'relative'
                }}>
                  {ev && (
                    <div style={{
                      padding: '6px 8px',
                      background: ev.accent ? 'var(--we-orange)' : ev.warn ? 'var(--we-carbon-3)' : 'var(--we-carbon-2)',
                      borderLeft: '3px solid ' + (ev.accent ? 'var(--we-orange-dark)' : ev.warn ? 'var(--we-warn)' : 'var(--we-orange)'),
                      cursor: 'pointer'
                    }}>
                      <div className="row gap-6" style={{ marginBottom: 2 }}>
                        <div className="avatar" style={{ width: 18, height: 18, fontSize: 8, background: ev.accent ? 'rgba(0,0,0,0.3)' : 'var(--we-orange)', color: '#fff' }}>{ev.who}</div>
                        <span style={{ fontSize: 10, fontWeight: 700, lineHeight: 1.1, color: ev.accent ? '#fff' : '#fff' }}>{ev.name}</span>
                      </div>
                      <div style={{ fontSize: 8, letterSpacing: 1, textTransform: 'uppercase', color: ev.accent ? 'rgba(255,255,255,0.85)' : 'var(--we-gray-mid)', fontWeight: 600 }}>
                        {ev.type}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Pending alerts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginTop: 18 }}>
        <div className="card accent">
          <div className="row between mb-12">
            <div className="card-title">CHECK-INS ATRASADOS</div>
            <span className="tag danger">5</span>
          </div>
          <div className="col gap-8">
            {CLIENTS.filter(c => c.lastCheckin > 7).slice(0, 4).map((c, i) => (
              <div key={i} className="row gap-10">
                <div className="avatar" style={{ width: 24, height: 24, fontSize: 9 }}>{c.initials}</div>
                <div className="flex-1 text-sm">{c.name.split(' ').slice(0,2).join(' ')}</div>
                <span className="tag danger">{c.lastCheckin}d</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="row between mb-12">
            <div className="card-title">PLANES A ACTUALIZAR</div>
            <span className="tag warn">8</span>
          </div>
          <div className="col gap-8">
            {CLIENTS.slice(10, 14).map((c, i) => (
              <div key={i} className="row gap-10">
                <div className="avatar" style={{ width: 24, height: 24, fontSize: 9 }}>{c.initials}</div>
                <div className="flex-1 text-sm">{c.name.split(' ').slice(0,2).join(' ')}</div>
                <span className="tag warn">Mes 1</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="row between mb-12">
            <div className="card-title">CUMPLEAÑOS · MAYO</div>
            <span className="tag orange">3</span>
          </div>
          <div className="col gap-8">
            {[
              ['MA','María Almonte','15 May'],
              ['JG','Jorge Gómez','22 May'],
              ['CD','Camila Díaz','28 May'],
            ].map(([i, n, d], idx) => (
              <div key={idx} className="row gap-10">
                <div className="avatar" style={{ width: 24, height: 24, fontSize: 9 }}>{i}</div>
                <div className="flex-1 text-sm">{n}</div>
                <span className="tag orange">{d}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// MENSAJES
// ============================================================
function MensajesView() {
  const { CLIENTS } = window.WE_DATA;
  const [activeConv, setActiveConv] = useState(0);

  const convs = CLIENTS.slice(0, 12).map((c, i) => ({
    ...c,
    unread: [3, 0, 1, 0, 0, 2, 0, 0, 0, 0, 0, 0][i] || 0,
    lastMsg: [
      'Coach, terminé mi entreno!',
      '¿Puedo cambiar la cena de hoy?',
      'Subí mis fotos del check-in',
      'Listo coach, mañana mando el pago',
      'Gracias por la motivación de hoy',
      'No pude entrenar ayer, justifico',
      'Te llamo en la tarde',
      '¿Sigo con el mismo plan?',
      'Ya cumplí los pasos del día',
      'Necesito ajustar mi macros',
      'Excelente semana coach 💪',
      'Voy mejorando, me siento mejor'
    ][i],
    lastTime: ['ahora','hace 5m','hace 12m','hace 1h','hace 2h','ayer','ayer','ayer','2d','2d','3d','4d'][i]
  }));

  const activeC = convs[activeConv];

  return (
    <div className="content" style={{ padding: 0, display: 'grid', gridTemplateColumns: '300px 1fr 280px', height: 'calc(100vh - 64px)' }}>
      {/* Conversations list */}
      <div style={{ borderRight: '1px solid var(--we-carbon-2)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: 18, borderBottom: '1px solid var(--we-carbon-2)' }}>
          <div className="display" style={{ fontSize: 18, letterSpacing: 1 }}>MENSAJES <span style={{ color: 'var(--we-orange)' }}>· 12</span></div>
          <div className="topbar-search mt-12" style={{ background: 'var(--we-black)', padding: '8px 10px 8px 32px' }}>
            <Icon name="search" size={13}/>
            <input placeholder="Buscar..." />
          </div>
        </div>
        <div className="scrollable" style={{ flex: 1 }}>
          {convs.map((c, i) => (
            <div key={i}
              onClick={() => setActiveConv(i)}
              style={{
                padding: 14,
                display: 'grid',
                gridTemplateColumns: '36px 1fr auto',
                gap: 10,
                cursor: 'pointer',
                background: i === activeConv ? 'var(--we-carbon)' : 'transparent',
                borderLeft: '3px solid ' + (i === activeConv ? 'var(--we-orange)' : 'transparent'),
                borderBottom: '1px solid var(--we-carbon-2)'
              }}
            >
              <div className="avatar" style={{ width: 36, height: 36 }}>{c.initials}</div>
              <div style={{ minWidth: 0 }}>
                <div className="row between" style={{ marginBottom: 2 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.name.split(' ').slice(0,2).join(' ')}</div>
                </div>
                <div className="text-xs text-mid" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {c.lastMsg}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className="text-xs text-low">{c.lastTime}</div>
                {c.unread > 0 && (
                  <div style={{
                    background: 'var(--we-orange)', color: '#fff', fontSize: 9, fontWeight: 700,
                    width: 16, height: 16, borderRadius: '50%', display: 'grid', placeItems: 'center',
                    marginTop: 4, marginLeft: 'auto'
                  }}>{c.unread}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Conversation */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{
          padding: '14px 22px', borderBottom: '1px solid var(--we-carbon-2)',
          display: 'flex', alignItems: 'center', gap: 12
        }}>
          <div className="avatar lg" style={{ width: 42, height: 42 }}>{activeC.initials}</div>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, letterSpacing: 0.5 }}>{activeC.name}</div>
            <div className="text-xs text-mid">En línea · {activeC.plan}</div>
          </div>
          <div style={{ flex: 1 }}/>
          <button className="btn btn-ghost btn-sm"><Icon name="user" size={12}/> Ver perfil</button>
          <button className="btn btn-ghost btn-sm"><Icon name="more" size={12}/></button>
        </div>

        <div className="scrollable" style={{ flex: 1, padding: 22, display: 'flex', flexDirection: 'column', gap: 12, justifyContent: 'flex-end' }}>
          {[
            { mine: false, text: 'Buenos días coach! Ya terminé mi entreno de hoy 💪', time: '8:14am' },
            { mine: true, text: '¡Tremenda! ¿Cómo te sentiste?', time: '8:30am' },
            { mine: false, text: 'Bastante bien, pude subir 5kg en la sentadilla. La cintura la siento mejor también.', time: '8:32am' },
            { mine: true, text: 'Eso es lo que quería oír. Acuérdate del check-in del viernes.', time: '8:35am' },
            { mine: false, text: 'Coach, terminé mi entreno!', time: 'ahora', unread: true },
          ].map((m, i) => (
            <div key={i} style={{
              alignSelf: m.mine ? 'flex-end' : 'flex-start',
              maxWidth: '70%',
              padding: '10px 14px',
              background: m.mine ? 'var(--we-orange)' : 'var(--we-carbon)',
              color: '#fff',
              position: 'relative',
              borderLeft: m.mine ? 'none' : '3px solid var(--we-orange)'
            }}>
              <div style={{ fontSize: 13, lineHeight: 1.4 }}>{m.text}</div>
              <div className="text-xs" style={{ opacity: 0.7, marginTop: 4, textAlign: 'right' }}>{m.time}</div>
            </div>
          ))}
        </div>

        <div style={{ padding: 18, borderTop: '1px solid var(--we-carbon-2)', display: 'flex', gap: 8 }}>
          <button className="btn btn-ghost btn-sm"><Icon name="plus" size={13}/></button>
          <input className="input" placeholder="Escribe a Yarisbel..." style={{ flex: 1 }} />
          <button className="btn btn-primary"><Icon name="arrowRight" size={13}/></button>
        </div>
      </div>

      {/* Right context */}
      <div style={{ borderLeft: '1px solid var(--we-carbon-2)', padding: 20 }}>
        <div className="avatar xl placeholder-photo" style={{ width: 80, height: 80, margin: '0 auto', marginBottom: 14 }}>
          <span>FOTO</span>
        </div>
        <div style={{ textAlign: 'center', marginBottom: 16 }}>
          <div className="display" style={{ fontSize: 16, letterSpacing: 0.5 }}>{activeC.name.toUpperCase()}</div>
          <div className="text-xs text-mid mt-4">{activeC.plan} · día {activeC.dayInPlan}/{activeC.planLength}</div>
        </div>

        <div className="bar-section-title">ACCESOS RÁPIDOS</div>
        <div className="col gap-6 mb-16">
          {['Ver perfil completo','Plan nutricional','Plan de entreno','Generar PDF','Compartir link'].map(a => (
            <button key={a} className="btn btn-ghost btn-sm" style={{ justifyContent: 'flex-start', width: '100%' }}>{a}</button>
          ))}
        </div>

        <div className="bar-section-title">RESPUESTAS RÁPIDAS</div>
        <div className="col gap-6">
          {[
            '¡Tremenda semana! 🔥',
            'Sigue con el plan, lo estás haciendo bien.',
            'Acuérdate del check-in.',
            'No olvides hidratarte 💧',
          ].map(r => (
            <div key={r} style={{
              padding: '8px 10px', background: 'var(--we-black)',
              fontSize: 11, cursor: 'pointer', borderLeft: '2px solid var(--we-orange)'
            }}>{r}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// BIBLIOTECA DE EJERCICIOS (Standalone view)
// ============================================================
function BibliotecaView() {
  const [search, setSearch] = useState('');
  const [muscleFilter, setMuscleFilter] = useState('Todos');

  const filtered = window.EXERCISES.filter(e =>
    (muscleFilter === 'Todos' || e.muscle === muscleFilter) &&
    (search === '' || e.name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="content">
      <div className="row between mb-20">
        <div>
          <div className="display" style={{ fontSize: 26, letterSpacing: 1 }}>
            BIBLIOTECA <span style={{ color: 'var(--we-orange)' }}>· EJERCICIOS</span>
          </div>
          <div className="text-sm text-mid mt-4">{window.EXERCISES.length} ejercicios · video, técnica, errores comunes</div>
        </div>
        <div className="row gap-8">
          <button className="btn btn-ghost btn-sm"><Icon name="download" size={12}/> Importar CSV</button>
          <button className="btn btn-primary"><Icon name="plus" size={13}/> Nuevo ejercicio</button>
        </div>
      </div>

      <div className="row gap-10 mb-16">
        <div className="topbar-search" style={{ background: 'var(--we-carbon)', flex: 1, maxWidth: 400, padding: '9px 12px 9px 36px' }}>
          <Icon name="search" size={14}/>
          <input placeholder="Buscar por nombre, músculo, equipo..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="row gap-4" style={{ flexWrap: 'wrap' }}>
          {['Todos','Pierna','Glúteo','Pecho','Espalda','Hombro','Brazo','Core','Cardio'].map(m => (
            <button key={m}
              onClick={() => setMuscleFilter(m)}
              className={'btn btn-sm ' + (muscleFilter === m ? 'btn-primary' : 'btn-ghost')}
            >{m}</button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        {filtered.map(ex => (
          <div key={ex.id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div className="placeholder-photo" style={{ aspectRatio: '4/3', position: 'relative' }}>
              <div style={{
                position: 'absolute', inset: 0, display: 'grid', placeItems: 'center'
              }}>
                <div style={{
                  width: 44, height: 44, background: 'var(--we-orange)',
                  display: 'grid', placeItems: 'center'
                }}>
                  <Icon name="play" size={18}/>
                </div>
              </div>
              <span className="tag solid" style={{ position: 'absolute', top: 8, left: 8 }}>{ex.muscle}</span>
            </div>
            <div style={{ padding: 14 }}>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>{ex.name}</div>
              <div className="text-xs text-mid">{ex.equip} · {ex.level}</div>
              <div className="row gap-6 mt-12">
                <button className="btn btn-ghost btn-sm flex-1" style={{ justifyContent: 'center' }}><Icon name="eye" size={11}/></button>
                <button className="btn btn-ghost btn-sm flex-1" style={{ justifyContent: 'center' }}><Icon name="edit" size={11}/></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// ONBOARDING MODAL
// ============================================================
function OnboardingModal({ onClose }) {
  const [step, setStep] = useState(1);
  const totalSteps = 4;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 720 }} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <div className="text-xs text-mid uppercase" style={{ letterSpacing: 1.5 }}>PASO {step} DE {totalSteps}</div>
            <div className="display" style={{ fontSize: 22, letterSpacing: 0.5 }}>
              {['','DATOS BÁSICOS','OBJETIVO & SALUD','PLAN Y PRECIO','REVISIÓN & ENVIAR'][step]}
            </div>
          </div>
          <button onClick={onClose}><Icon name="x" size={18}/></button>
        </div>

        {/* Step progress */}
        <div className="row gap-4" style={{ padding: '0 22px 14px' }}>
          {[1,2,3,4].map(s => (
            <div key={s} style={{
              flex: 1, height: 3,
              background: s <= step ? 'var(--we-orange)' : 'var(--we-carbon-2)'
            }}/>
          ))}
        </div>

        <div className="modal-body">
          {step === 1 && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div><div className="field-label">Nombre completo</div><input className="input" placeholder="Ej: María García" defaultValue="Patricia Díaz" /></div>
              <div><div className="field-label">Edad</div><input className="input" placeholder="28" defaultValue="32"/></div>
              <div><div className="field-label">Género</div>
                <div className="row gap-6">
                  <button className="btn btn-primary btn-sm flex-1" style={{ justifyContent: 'center' }}>Femenino</button>
                  <button className="btn btn-ghost btn-sm flex-1" style={{ justifyContent: 'center' }}>Masculino</button>
                </div>
              </div>
              <div><div className="field-label">Ubicación</div><input className="input" placeholder="Santo Domingo" defaultValue="Santiago"/></div>
              <div><div className="field-label">WhatsApp</div><input className="input" placeholder="+1 829..." defaultValue="+1 809 555 0144"/></div>
              <div><div className="field-label">Email</div><input className="input" placeholder="cliente@email.com" defaultValue="patricia.d@gmail.com"/></div>
              <div><div className="field-label">Altura (cm)</div><input className="input" defaultValue="165"/></div>
              <div><div className="field-label">Peso actual (kg)</div><input className="input" defaultValue="78"/></div>
            </div>
          )}
          {step === 2 && (
            <div>
              <div className="field-label">Objetivo principal</div>
              <div className="row gap-8 mb-16" style={{ flexWrap: 'wrap' }}>
                {['Pérdida de peso','Ganancia muscular','Recomposición','Tonificar','Resistencia'].map((g, i) => (
                  <button key={g} className={'btn btn-sm ' + (i === 0 ? 'btn-primary' : 'btn-ghost')}>{g}</button>
                ))}
              </div>
              <div className="row gap-14 mb-16">
                <div className="flex-1"><div className="field-label">Peso meta (kg)</div><input className="input" defaultValue="65"/></div>
                <div className="flex-1"><div className="field-label">Plazo (meses)</div><input className="input" defaultValue="6"/></div>
              </div>
              <div className="field-label">Nivel actual</div>
              <div className="row gap-6 mb-16">
                {['Principiante','Intermedio','Avanzado'].map((l, i) => (
                  <button key={l} className={'btn btn-sm flex-1 ' + (i === 0 ? 'btn-primary' : 'btn-ghost')} style={{ justifyContent: 'center' }}>{l}</button>
                ))}
              </div>
              <div className="field-label">Condiciones de salud / lesiones</div>
              <textarea className="textarea" rows={3} placeholder="Ej: Dolor lumbar ocasional, intolerancia a lácteos..." defaultValue="Intolerancia leve a lácteos. Sin lesiones."/>
              <div className="field-label mt-12">Restricciones alimentarias</div>
              <div className="row gap-6">
                {['Lácteos','Gluten','Mariscos','Cerdo','Vegetariana','Ninguna'].map((r, i) => (
                  <button key={r} className={'btn btn-sm ' + (i === 0 ? 'btn-primary' : 'btn-ghost')}>{r}</button>
                ))}
              </div>
            </div>
          )}
          {step === 3 && (
            <div>
              <div className="field-label">Plan a contratar</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 18 }}>
                {[
                  ['BÁSICO','3 MESES','$65','var(--we-carbon-3)'],
                  ['PRO','6 MESES','$125','var(--we-orange)'],
                  ['VIP','12 MESES','$200','var(--we-orange-dark)'],
                ].map(([n, d, p, c], i) => (
                  <div key={n} style={{
                    padding: 14,
                    background: i === 1 ? 'var(--we-orange-soft)' : 'var(--we-black)',
                    border: '1px solid ' + (i === 1 ? 'var(--we-orange)' : 'var(--we-carbon-2)'),
                    borderTop: '4px solid ' + c,
                    cursor: 'pointer'
                  }}>
                    <div className="display" style={{ fontSize: 16, letterSpacing: 1 }}>{n}</div>
                    <div className="text-xs text-mid uppercase" style={{ letterSpacing: 1.5 }}>{d}</div>
                    <div className="display" style={{ fontSize: 26, color: 'var(--we-orange)', marginTop: 8 }}>{p}<span className="text-xs text-mid" style={{ fontFamily: 'var(--font-body)' }}>/mes</span></div>
                  </div>
                ))}
              </div>
              <div className="row gap-14">
                <div className="flex-1"><div className="field-label">Precio personalizado (USD/mes)</div><input className="input" defaultValue="125"/></div>
                <div className="flex-1"><div className="field-label">Método de cobro</div>
                  <select className="select"><option>Banreservas</option><option>Banco Popular</option><option>Efectivo</option></select>
                </div>
              </div>
              <div className="row gap-14 mt-12">
                <div className="flex-1"><div className="field-label">Fecha de inicio</div><input className="input" defaultValue="13/05/2026"/></div>
                <div className="flex-1"><div className="field-label">Recurrencia</div>
                  <select className="select"><option>Mensual</option><option>Trimestral</option><option>Pago único</option></select>
                </div>
              </div>
            </div>
          )}
          {step === 4 && (
            <div>
              <div className="card accent mb-16" style={{ background: 'var(--we-black)' }}>
                <div className="row gap-16">
                  <div className="avatar xl">PD</div>
                  <div>
                    <div className="display" style={{ fontSize: 22 }}>PATRICIA DÍAZ</div>
                    <div className="text-sm text-mid">32 años · Femenino · 165 cm · 78 kg · Santiago</div>
                    <div className="row gap-6 mt-8">
                      <span className="tag orange">PRO 6 MESES</span>
                      <span className="tag">$125/mes</span>
                      <span className="tag success">Pérdida de peso</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bar-section-title">PRÓXIMOS PASOS AUTOMÁTICOS</div>
              <div className="col gap-8 mb-16">
                {[
                  'Generar plan nutricional inicial (carb cycling)',
                  'Crear rutina de entrenamiento semana 1',
                  'Enviar PDF de bienvenida por WhatsApp',
                  'Programar primer check-in en 7 días',
                  'Agendar llamada de onboarding mañana 11AM',
                ].map((s, i) => (
                  <label key={s} className="row gap-10" style={{ padding: 10, background: 'var(--we-black)', borderLeft: '3px solid var(--we-orange)' }}>
                    <input type="checkbox" defaultChecked style={{ accentColor: '#FF4500' }}/>
                    <span className="text-sm">{s}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn btn-ghost btn-sm" onClick={() => setStep(Math.max(1, step - 1))} disabled={step === 1}>Atrás</button>
          <button className="btn btn-primary" onClick={() => step < totalSteps ? setStep(step + 1) : onClose()}>
            {step < totalSteps ? 'Siguiente' : 'Crear asesorado'} <Icon name="arrowRight" size={11}/>
          </button>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { CobrosView, CalendarView, MensajesView, BibliotecaView, OnboardingModal });
