// Asesorados list + filters + Profile views
function AsesoradosList({ goto }) {
  const { CLIENTS } = window.WE_DATA;
  const [filter, setFilter] = useState('Todos');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    let r = CLIENTS;
    if (filter !== 'Todos') r = r.filter(c => c.status === filter);
    if (search) r = r.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));
    return r;
  }, [filter, search]);

  const counts = useMemo(() => ({
    Todos: CLIENTS.length,
    Activo: CLIENTS.filter(c => c.status === 'Activo').length,
    'Por renovar': CLIENTS.filter(c => c.status === 'Por renovar').length,
    Nuevo: CLIENTS.filter(c => c.status === 'Nuevo').length,
    Vencido: CLIENTS.filter(c => c.status === 'Vencido').length,
  }), []);

  return (
    <div className="content">
      <div className="row between mb-20">
        <div>
          <div className="display" style={{ fontSize: 26, letterSpacing: 1 }}>
            ASESORADOS <span style={{ color: 'var(--we-orange)' }}>· {filtered.length}</span>
          </div>
          <div className="text-sm text-mid mt-4">200 personas confiando en tu proceso</div>
        </div>
        <div className="row gap-8">
          <button className="btn btn-ghost btn-sm"><Icon name="download" size={12}/> Exportar CSV</button>
          <button className="btn btn-primary"><Icon name="plus" size={13}/> Nuevo asesorado</button>
        </div>
      </div>

      {/* Filter chips */}
      <div className="row gap-8 mb-16" style={{ flexWrap: 'wrap' }}>
        {Object.entries(counts).map(([k, v]) => (
          <button key={k}
            className={'btn ' + (filter === k ? 'btn-primary' : 'btn-ghost') + ' btn-sm'}
            onClick={() => setFilter(k)}
          >
            {k} · {v}
          </button>
        ))}
        <div style={{ flex: 1 }} />
        <div className="topbar-search" style={{ background: 'var(--we-carbon)', maxWidth: 260, padding: '7px 10px 7px 32px' }}>
          <Icon name="search" size={13} />
          <input placeholder="Buscar por nombre..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      {/* Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="scrollable" style={{ maxHeight: '70vh' }}>
          <table className="table">
            <thead style={{ position: 'sticky', top: 0, background: 'var(--we-carbon)', zIndex: 1 }}>
              <tr>
                <th>Asesorado</th>
                <th>Plan</th>
                <th>Progreso</th>
                <th>Adherencia</th>
                <th>Días restantes</th>
                <th>Pago</th>
                <th>Estado</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.slice(0, 50).map(c => (
                <tr key={c.id} onClick={() => goto('perfil')}>
                  <td>
                    <div className="row gap-10">
                      <div className="avatar">{c.initials}</div>
                      <div>
                        <div style={{ fontWeight: 600 }}>{c.name}</div>
                        <div className="text-xs text-mid">{c.location} · {c.age}a</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, fontSize: 12 }}>{c.plan}</div>
                    <div className="text-xs text-mid">{c.goal}</div>
                  </td>
                  <td>
                    <div className="text-xs text-mid mb-4">
                      {c.startWeight}kg → <span style={{ color: 'var(--we-orange)' }}>{c.currentWeight}kg</span> → {c.goalWeight}kg
                    </div>
                    <div className="bar" style={{ width: 120 }}>
                      <div className="bar-fill" style={{ width: Math.min(100, ((c.startWeight - c.currentWeight) / (c.startWeight - c.goalWeight)) * 100) + '%' }} />
                    </div>
                  </td>
                  <td>
                    <div className="row gap-8">
                      <div className="bar" style={{ width: 80 }}>
                        <div className={'bar-fill ' + (c.adherence > 80 ? 'success' : c.adherence > 60 ? 'warn' : 'danger')}
                          style={{ width: c.adherence + '%', background: c.adherence > 80 ? 'var(--we-success)' : c.adherence > 60 ? 'var(--we-warn)' : 'var(--we-danger)' }} />
                      </div>
                      <span style={{ fontSize: 11, color: c.adherence > 80 ? 'var(--we-success)' : c.adherence > 60 ? 'var(--we-warn)' : 'var(--we-danger)', fontWeight: 600 }}>
                        {c.adherence}%
                      </span>
                    </div>
                  </td>
                  <td>
                    <div className="display" style={{ fontSize: 14, color: c.daysLeft < 14 ? 'var(--we-orange)' : '#fff' }}>
                      {c.daysLeft < 0 ? '−' + Math.abs(c.daysLeft) : c.daysLeft}
                    </div>
                    <div className="text-xs text-low">de {c.planLength}</div>
                  </td>
                  <td>
                    <span className={'tag ' + (c.payment === 'Al día' ? 'success' : c.payment === 'Pendiente' ? 'warn' : 'danger')}>
                      ${c.monthly} · {c.payment}
                    </span>
                  </td>
                  <td>
                    <span className={'tag ' + (
                      c.status === 'Activo' ? 'success' :
                      c.status === 'Por renovar' ? 'warn' :
                      c.status === 'Vencido' ? 'danger' : 'orange'
                    )}>{c.status}</span>
                  </td>
                  <td><Icon name="chevronRight" size={14}/></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="row between" style={{ padding: '12px 16px', borderTop: '1px solid var(--we-carbon-2)' }}>
          <div className="text-xs text-mid">Mostrando 50 de {filtered.length}</div>
          <div className="row gap-4">
            <button className="btn btn-ghost btn-sm"><Icon name="chevronLeft" size={11}/></button>
            <button className="btn btn-primary btn-sm">1</button>
            <button className="btn btn-ghost btn-sm">2</button>
            <button className="btn btn-ghost btn-sm">3</button>
            <button className="btn btn-ghost btn-sm">4</button>
            <button className="btn btn-ghost btn-sm"><Icon name="chevronRight" size={11}/></button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ===========================================================
// PROFILE — full asesorado view
// ===========================================================
function AsesoradoProfile({ goto }) {
  const c = window.WE_DATA.FEATURED;
  const [tab, setTab] = useState('overview');

  const weightDelta = (c.currentWeight - c.startWeight).toFixed(1);
  const progress = ((c.startWeight - c.currentWeight) / (c.startWeight - c.goalWeight)) * 100;

  return (
    <div className="content">
      {/* Header */}
      <div className="row gap-8 text-xs text-mid mb-12">
        <span onClick={() => goto('asesorados')} style={{ cursor: 'pointer' }}>Asesorados</span>
        <Icon name="chevronRight" size={10}/>
        <span style={{ color: '#fff' }}>{c.name}</span>
      </div>

      <div className="card accent mb-20" style={{ padding: 22 }}>
        <div className="row gap-20">
          <div className="avatar xl placeholder-photo" style={{ width: 96, height: 96 }}>
            <span>FOTO</span>
          </div>
          <div className="flex-1">
            <div className="row gap-8 mb-4">
              <span className="tag success">ACTIVO</span>
              <span className="tag orange">{c.plan}</span>
              <span className="tag">Al día</span>
            </div>
            <div className="display" style={{ fontSize: 32, letterSpacing: 0.5 }}>{c.name.toUpperCase()}</div>
            <div className="text-sm text-mid mt-4">
              {c.age} años · {c.gender === 'F' ? 'Femenino' : 'Masculino'} · {c.height} cm · {c.location} · Desde {c.joinedMonth}
            </div>
          </div>
          <div className="col gap-8">
            <button className="btn btn-primary"><Icon name="message" size={13}/> Mensaje</button>
            <button className="btn btn-ghost btn-sm"><Icon name="share" size={12}/> Compartir link</button>
            <button className="btn btn-ghost btn-sm"><Icon name="more" size={12}/> Más acciones</button>
          </div>
        </div>

        {/* Quick stats row */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12, marginTop: 22, paddingTop: 18,
          borderTop: '1px solid var(--we-carbon-2)'
        }}>
          {[
            { label: 'Inicio', value: c.startWeight + 'kg', icon: 'flame' },
            { label: 'Actual', value: c.currentWeight + 'kg', icon: 'activity', accent: true },
            { label: 'Meta', value: c.goalWeight + 'kg', icon: 'target' },
            { label: 'Δ Perdido', value: weightDelta + 'kg', icon: 'trending', success: true },
            { label: 'Progreso', value: progress.toFixed(0) + '%', icon: 'award' },
          ].map((s, i) => (
            <div key={i} style={{ borderLeft: i > 0 ? '1px solid var(--we-carbon-2)' : 'none', paddingLeft: i > 0 ? 14 : 0 }}>
              <div className="text-xs text-mid uppercase" style={{ letterSpacing: 1.5, marginBottom: 4 }}>{s.label}</div>
              <div className="display" style={{
                fontSize: 24,
                color: s.accent ? 'var(--we-orange)' : s.success ? 'var(--we-success)' : '#fff'
              }}>{s.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="row gap-4 mb-16" style={{ borderBottom: '1px solid var(--we-carbon-2)' }}>
        {[
          ['overview','Resumen'],
          ['nutricion','Nutrición'],
          ['entrenamiento','Entrenamiento'],
          ['progreso','Progreso & Fotos'],
          ['cobros','Pagos & Plan'],
          ['notas','Notas']
        ].map(([id, label]) => (
          <button key={id}
            onClick={() => setTab(id)}
            style={{
              padding: '12px 16px',
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: 1,
              textTransform: 'uppercase',
              color: tab === id ? '#fff' : 'var(--we-gray-mid)',
              borderBottom: '2px solid ' + (tab === id ? 'var(--we-orange)' : 'transparent'),
              marginBottom: -1
            }}
          >{label}</button>
        ))}
      </div>

      {tab === 'overview' && <ProfileOverview c={c} />}
      {tab === 'nutricion' && <ProfileNutrition c={c} />}
      {tab === 'entrenamiento' && <ProfileTraining c={c} />}
      {tab === 'progreso' && <ProfileProgress c={c} />}
      {tab === 'cobros' && <ProfilePayments c={c} />}
      {tab === 'notas' && <ProfileNotes c={c} />}
    </div>
  );
}

// ====== Profile sub-views ======
function ProfileOverview({ c }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 18 }}>
      <div className="col gap-18" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        {/* Weight chart */}
        <div className="card">
          <div className="row between mb-16">
            <div>
              <div className="card-title">CURVA DE PESO · 14 SEMANAS</div>
              <div className="card-subtitle">Tendencia descendente saludable</div>
            </div>
            <span className="tag success">−11.8 KG</span>
          </div>
          <WeightChart data={c.weightHistory} goal={c.goalWeight} start={c.startWeight} />
        </div>

        {/* Measurements */}
        <div className="card">
          <div className="card-title mb-16">MEDIDAS CORPORALES · CM</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 14 }}>
            {Object.entries(c.measurements).map(([k, v]) => {
              const initial = c.initialMeasurements[k];
              const delta = (v - initial).toFixed(1);
              return (
                <div key={k} style={{ padding: 12, background: 'var(--we-black)', position: 'relative' }}>
                  <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, background: 'var(--we-orange)' }}/>
                  <div className="text-xs text-mid uppercase" style={{ letterSpacing: 1.5, marginBottom: 6 }}>{k}</div>
                  <div className="display" style={{ fontSize: 22 }}>{v}</div>
                  <div className="text-xs" style={{ color: 'var(--we-success)', marginTop: 4 }}>{delta} cm</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Adherence + checkin */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
          <div className="card">
            <div className="card-title mb-12">ADHERENCIA · ÚLTIMOS 30 DÍAS</div>
            <div className="row gap-16">
              <div style={{ width: 88, height: 88, position: 'relative' }}>
                <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="#2B2B2B" strokeWidth="3"/>
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="#FF4500" strokeWidth="3"
                    strokeDasharray={c.adherence + ', 100'} strokeLinecap="round"/>
                </svg>
                <div className="display" style={{
                  position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', fontSize: 22
                }}>{c.adherence}%</div>
              </div>
              <div className="flex-1">
                <div className="row between text-sm" style={{ marginBottom: 6 }}>
                  <span className="text-mid">Nutrición</span><b>92%</b>
                </div>
                <div className="bar success mb-12"><div className="bar-fill" style={{ width: '92%', background: 'var(--we-success)' }}/></div>
                <div className="row between text-sm" style={{ marginBottom: 6 }}>
                  <span className="text-mid">Entreno</span><b>84%</b>
                </div>
                <div className="bar warn mb-12"><div className="bar-fill" style={{ width: '84%', background: 'var(--we-warn)' }}/></div>
                <div className="row between text-sm" style={{ marginBottom: 6 }}>
                  <span className="text-mid">Cardio</span><b>78%</b>
                </div>
                <div className="bar"><div className="bar-fill" style={{ width: '78%' }}/></div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-title mb-12">CHECK-IN SEMANAL</div>
            <div className="col gap-12">
              <div className="row gap-12">
                <Icon name="droplet" size={20}/>
                <div className="flex-1">
                  <div className="text-xs text-mid">Energía</div>
                  <div className="display" style={{ fontSize: 18 }}>{c.energy}/10</div>
                </div>
                <div className="bar" style={{ width: 80 }}><div className="bar-fill" style={{ width: c.energy*10 + '%' }}/></div>
              </div>
              <div className="row gap-12">
                <Icon name="moon" size={20}/>
                <div className="flex-1">
                  <div className="text-xs text-mid">Sueño</div>
                  <div className="display" style={{ fontSize: 18 }}>{c.sleep}/10</div>
                </div>
                <div className="bar" style={{ width: 80 }}><div className="bar-fill" style={{ width: c.sleep*10 + '%' }}/></div>
              </div>
              <div className="row gap-12">
                <Icon name="star" size={20}/>
                <div className="flex-1">
                  <div className="text-xs text-mid">Ánimo</div>
                  <div className="display" style={{ fontSize: 18 }}>{c.mood}/10</div>
                </div>
                <div className="bar" style={{ width: 80 }}><div className="bar-fill" style={{ width: c.mood*10 + '%' }}/></div>
              </div>
              <div className="text-xs text-mid mt-8" style={{ paddingTop: 12, borderTop: '1px solid var(--we-carbon-2)' }}>
                Último check-in <b style={{ color: '#fff' }}>hace {c.lastCheckin} días</b>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right sidebar */}
      <div className="col gap-18" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div className="card">
          <div className="card-title mb-12">CONTACTO</div>
          <div className="col gap-10 text-sm">
            <div className="row between"><span className="text-mid">Teléfono</span><b>{c.phone}</b></div>
            <div className="row between"><span className="text-mid">Email</span><b style={{ fontSize: 11 }}>{c.email}</b></div>
            <div className="row between"><span className="text-mid">Ubicación</span><b>{c.location}</b></div>
            <div className="row between"><span className="text-mid">Ingresó</span><b>{c.joinedMonth}</b></div>
          </div>
          <div className="row gap-6 mt-16">
            <button className="btn btn-dark btn-sm flex-1" style={{ justifyContent: 'center' }}><Icon name="message" size={11}/> WhatsApp</button>
            <button className="btn btn-dark btn-sm flex-1" style={{ justifyContent: 'center' }}><Icon name="instagram" size={11}/> IG</button>
          </div>
        </div>

        <div className="card">
          <div className="card-title mb-12">PLAN ACTUAL</div>
          <div className="col gap-12">
            <div>
              <div className="text-xs text-mid uppercase" style={{ letterSpacing: 1.5 }}>Plan</div>
              <div className="display" style={{ fontSize: 18 }}>{c.plan}</div>
            </div>
            <div className="row between">
              <div>
                <div className="text-xs text-mid uppercase" style={{ letterSpacing: 1.5 }}>Día</div>
                <div className="display" style={{ fontSize: 18 }}>{c.dayInPlan} / {c.planLength}</div>
              </div>
              <div>
                <div className="text-xs text-mid uppercase" style={{ letterSpacing: 1.5 }}>Restantes</div>
                <div className="display" style={{ fontSize: 18, color: 'var(--we-orange)' }}>{c.daysLeft}d</div>
              </div>
            </div>
            <div className="bar"><div className="bar-fill" style={{ width: (c.dayInPlan / c.planLength * 100) + '%' }}/></div>
          </div>
        </div>

        <div className="card">
          <div className="row between mb-12">
            <div className="card-title">TAREAS PENDIENTES</div>
            <span className="tag orange">3</span>
          </div>
          <div className="col gap-10">
            {[
              { txt: 'Actualizar plan nutricional', due: 'esta semana' },
              { txt: 'Revisar fotos de progreso', due: 'hoy' },
              { txt: 'Llamada de seguimiento', due: 'mañana' },
            ].map((t, i) => (
              <div key={i} className="row gap-8" style={{ padding: '8px 0', borderBottom: i < 2 ? '1px solid var(--we-carbon-2)' : 'none' }}>
                <div style={{ width: 14, height: 14, border: '1.5px solid var(--we-orange)' }}/>
                <div className="flex-1">
                  <div className="text-sm">{t.txt}</div>
                  <div className="text-xs text-mid">Vence {t.due}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function WeightChart({ data, goal, start }) {
  const max = Math.max(...data) + 2;
  const min = goal - 2;
  const W = 600, H = 180;
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * W;
    const y = H - ((v - min) / (max - min)) * H;
    return `${x},${y}`;
  }).join(' ');

  const areaPath = `M0,${H} L${points} L${W},${H} Z`;

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ width: '100%', height: 180 }}>
        <defs>
          <linearGradient id="wgrad" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#FF4500" stopOpacity="0.45"/>
            <stop offset="100%" stopColor="#FF4500" stopOpacity="0"/>
          </linearGradient>
        </defs>
        {/* Goal line */}
        <line x1="0" y1={H - ((goal - min)/(max-min))*H} x2={W} y2={H - ((goal - min)/(max-min))*H}
              stroke="#FF4500" strokeDasharray="4 4" strokeWidth="1" opacity="0.5"/>
        <path d={`M${points.split(' ').join(' L')}`} fill="none" stroke="#FF4500" strokeWidth="2"/>
        <path d={`M0,${H - ((data[0] - min)/(max-min))*H} L${points} L${W},${H} L0,${H} Z`} fill="url(#wgrad)"/>
        {data.map((v, i) => {
          const x = (i / (data.length - 1)) * W;
          const y = H - ((v - min) / (max - min)) * H;
          return <circle key={i} cx={x} cy={y} r="3" fill="#FF4500"/>
        })}
      </svg>
      <div className="row between mt-8 text-xs text-mid">
        <span>S1</span><span>S4</span><span>S7</span><span>S10</span><span>S14 actual</span>
      </div>
      <div className="row gap-16 mt-12 text-xs">
        <div className="row gap-6"><div style={{ width: 12, height: 2, background: '#FF4500' }}/> Peso real</div>
        <div className="row gap-6"><div style={{ width: 12, height: 2, background: '#FF4500', opacity: 0.5, borderTop: '1px dashed #FF4500' }}/> Meta {goal}kg</div>
      </div>
    </div>
  );
}

function ProfileNutrition({ c }) {
  return <PlanNutricionalView mini />;
}
function ProfileTraining({ c }) {
  return <PlanEntrenamientoView mini />;
}

function ProfileProgress({ c }) {
  const weeks = ['S1', 'S4', 'S8', 'S12', 'S14'];
  return (
    <div className="col gap-18">
      <div className="card">
        <div className="row between mb-16">
          <div>
            <div className="card-title">FOTOS DE PROGRESO</div>
            <div className="card-subtitle">5 sesiones · última hace 2 días</div>
          </div>
          <button className="btn btn-primary btn-sm"><Icon name="plus" size={11}/> Subir fotos</button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12 }}>
          {weeks.map((w, i) => (
            <div key={w}>
              <div className="placeholder-photo" style={{ width: '100%', aspectRatio: '3/4' }}>
                <span>{w}</span>
              </div>
              <div className="text-xs text-mid mt-6" style={{ textAlign: 'center' }}>
                {[86,82,79,75,74.2][i]}kg
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="card-title mb-16">HISTORIAL DE CHECK-INS</div>
        <table className="table">
          <thead>
            <tr><th>Fecha</th><th>Peso</th><th>Cintura</th><th>Adherencia</th><th>Notas</th></tr>
          </thead>
          <tbody>
            {[
              ['11 May 26', '74.2 kg', '78 cm', 92, 'Excelente semana, energía alta.'],
              ['04 May 26', '74.8 kg', '79 cm', 88, 'Cumplió todas las sesiones.'],
              ['27 Abr 26', '75.6 kg', '80 cm', 85, 'Saltó una comida en evento.'],
              ['20 Abr 26', '76.4 kg', '81 cm', 90, 'Dormir mejor esta semana.'],
            ].map((r, i) => (
              <tr key={i}>
                <td>{r[0]}</td>
                <td><b>{r[1]}</b></td>
                <td>{r[2]}</td>
                <td>
                  <div className="row gap-8">
                    <div className="bar" style={{ width: 60 }}>
                      <div className="bar-fill success" style={{ width: r[3] + '%', background: 'var(--we-success)' }}/>
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 600 }}>{r[3]}%</span>
                  </div>
                </td>
                <td className="text-sm text-mid">{r[4]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ProfilePayments({ c }) {
  return (
    <div className="card">
      <div className="row between mb-16">
        <div className="card-title">HISTORIAL DE PAGOS</div>
        <button className="btn btn-primary btn-sm"><Icon name="money" size={11}/> Registrar pago</button>
      </div>
      <div className="row gap-12 mb-20">
        <div className="kpi" style={{ flex: 1 }}>
          <div className="kpi-label">Total pagado</div>
          <div className="kpi-value">$450</div>
        </div>
        <div className="kpi dim" style={{ flex: 1 }}>
          <div className="kpi-label">Próximo pago</div>
          <div className="kpi-value">$150</div>
          <div className="kpi-delta">en 18 días</div>
        </div>
        <div className="kpi dim" style={{ flex: 1 }}>
          <div className="kpi-label">Método</div>
          <div className="display" style={{ fontSize: 18, marginTop: 8 }}>Transferencia</div>
        </div>
      </div>
      <table className="table">
        <thead><tr><th>Fecha</th><th>Concepto</th><th>Método</th><th>Monto</th><th>Estado</th></tr></thead>
        <tbody>
          {[
            ['01 May 26','Mensualidad #4','Banreservas','$150','Pagado'],
            ['01 Abr 26','Mensualidad #3','Banreservas','$150','Pagado'],
            ['01 Mar 26','Mensualidad #2','Cash','$150','Pagado'],
            ['01 Feb 26','Inicio VIP 12m','Banreservas','$150','Pagado'],
          ].map((r, i) => (
            <tr key={i}>
              <td>{r[0]}</td>
              <td><b>{r[1]}</b></td>
              <td>{r[2]}</td>
              <td><b style={{ color: 'var(--we-orange)' }}>{r[3]}</b></td>
              <td><span className="tag success">{r[4]}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ProfileNotes({ c }) {
  const notes = [
    { date: '11 May 26', tag: 'general', text: 'Mencionó que tiene una boda en junio, quiere verse "lista". Ajustar a fase agresiva las próximas 3 semanas.' },
    { date: '04 May 26', tag: 'salud', text: 'Refiere dolor leve en rodilla izquierda. Reducir impacto en cardio. Sustituir burpees por step-ups.' },
    { date: '27 Abr 26', tag: 'nutrición', text: 'No tolera bien lácteos en la mañana. Migrar el desayuno a opción sin lácteos.' },
    { date: '20 Abr 26', tag: 'motivación', text: 'Tuvo una semana emocionalmente difícil pero cumplió 6 de 6 entrenos. Reconocer públicamente.' },
  ];
  return (
    <div className="card">
      <div className="row between mb-16">
        <div className="card-title">NOTAS DEL COACH</div>
        <button className="btn btn-primary btn-sm"><Icon name="plus" size={11}/> Nueva nota</button>
      </div>
      <textarea className="textarea mb-20" rows={3} placeholder="Escribe una observación rápida..." />
      <div className="col gap-12">
        {notes.map((n, i) => (
          <div key={i} style={{ padding: 14, background: 'var(--we-black)', borderLeft: '3px solid var(--we-orange)' }}>
            <div className="row between mb-6">
              <div className="row gap-8">
                <span className="tag orange">{n.tag.toUpperCase()}</span>
                <span className="text-xs text-mid">{n.date}</span>
              </div>
              <Icon name="more" size={14}/>
            </div>
            <div className="text-sm" style={{ lineHeight: 1.6 }}>{n.text}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, {
  AsesoradosList, AsesoradoProfile,
  ProfileNutrition, ProfileTraining
});
