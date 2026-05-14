// PDF preview — multi-page navigable + Public Link mobile view
function PDFPreview() {
  const [page, setPage] = useState(0);
  const pages = [
    { id: 'cover', label: 'Portada', component: <PDFCover /> },
    { id: 'overview', label: 'Resumen & Macros', component: <PDFOverview /> },
    { id: 'day1', label: 'Lunes · Alto', component: <PDFNutritionDay day="LUNES" cycle="ALTO EN CARBOS" cycleColor="#FF4500" /> },
    { id: 'day2', label: 'Martes · Medio', component: <PDFNutritionDay day="MARTES" cycle="MEDIO EN CARBOS" cycleColor="#F59E0B" /> },
    { id: 'day3', label: 'Miércoles · Bajo', component: <PDFNutritionDay day="MIÉRCOLES" cycle="BAJO EN CARBOS" cycleColor="#9CA3AF" /> },
    { id: 'training', label: 'Plan de entreno', component: <PDFTraining /> },
    { id: 'shopping', label: 'Lista de compra', component: <PDFShopping /> },
    { id: 'closing', label: 'Cierre & Fe', component: <PDFClosing /> },
  ];

  return (
    <div className="content">
      <div className="row between mb-24">
        <div>
          <div className="display" style={{ fontSize: 34, letterSpacing: 1, lineHeight: 1 }}>
            VISTA PDF
          </div>
          <div className="row gap-8 mt-8">
            <span className="chip-mod" style={{ background: 'var(--we-orange)', color: '#fff' }}>YARISBEL PICHARDO</span>
            <span className="chip-mod">SEMANA 14 · 13–19 MAY</span>
            <span className="chip-mod">{pages.length} PÁGINAS</span>
          </div>
        </div>
        <div className="row gap-8">
          <button className="btn btn-ghost btn-sm"><Icon name="print" size={12}/> Imprimir</button>
          <button className="btn btn-ghost btn-sm"><Icon name="message" size={12}/> Enviar WhatsApp</button>
          <button className="btn btn-primary"><Icon name="download" size={13}/> Descargar PDF</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: 20, alignItems: 'flex-start' }}>
        {/* Pages thumbnails */}
        <div className="card-mod" style={{ padding: 16, position: 'sticky', top: 80 }}>
          <div className="card-title-mod mb-12">PÁGINAS</div>
          <div className="col gap-6">
            {pages.map((p, i) => (
              <div key={p.id}
                onClick={() => setPage(i)}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '32px 1fr',
                  gap: 10,
                  padding: '8px 10px',
                  background: i === page ? 'rgba(255,69,0,0.10)' : 'transparent',
                  borderLeft: '2px solid ' + (i === page ? 'var(--we-orange)' : 'transparent'),
                  borderRadius: 4,
                  cursor: 'pointer',
                  alignItems: 'center'
                }}
              >
                <div className="display" style={{
                  fontSize: 12, color: i === page ? 'var(--we-orange)' : 'var(--we-gray-mid)'
                }}>{String(i + 1).padStart(2, '0')}</div>
                <div style={{
                  fontSize: 11.5,
                  fontWeight: i === page ? 600 : 500,
                  color: i === page ? '#fff' : 'var(--we-gray-mid)'
                }}>{p.label}</div>
              </div>
            ))}
          </div>

          <div className="divider"/>

          <div className="card-title-mod mb-10">ENTREGA</div>
          <div className="col gap-6">
            <button className="btn btn-primary btn-sm" style={{ justifyContent: 'center', width: '100%' }}><Icon name="download" size={11}/> Descargar</button>
            <button className="btn btn-dark btn-sm" style={{ justifyContent: 'center', width: '100%' }}><Icon name="link" size={11}/> Link público</button>
            <button className="btn btn-dark btn-sm" style={{ justifyContent: 'center', width: '100%' }}><Icon name="message" size={11}/> WhatsApp</button>
          </div>
        </div>

        {/* Paper */}
        <div>
          <div className="row between mb-12 text-sm">
            <button className="btn btn-ghost btn-sm" onClick={() => setPage(Math.max(0, page - 1))} disabled={page === 0}>
              <Icon name="chevronLeft" size={11}/> Anterior
            </button>
            <div className="text-mid">Página <b style={{ color: '#fff' }}>{page + 1}</b> de {pages.length}</div>
            <button className="btn btn-ghost btn-sm" onClick={() => setPage(Math.min(pages.length - 1, page + 1))} disabled={page === pages.length - 1}>
              Siguiente <Icon name="chevronRight" size={11}/>
            </button>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="paper-mod">
              {pages[page].component}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============ PDF PAGE COMPONENTS ============
const PDF_FONT = { fontFamily: "'Open Sans', sans-serif" };
const PDF_DISPLAY = { fontFamily: "'Oswald', Impact, sans-serif" };

function PDFPageFrame({ children, footerLabel = '01' }) {
  return (
    <div style={{ position: 'relative', minHeight: 900, background: '#111', color: '#fff', ...PDF_FONT, overflow: 'hidden' }}>
      {/* Orange left bar — brand mark */}
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 12, background: '#FF4500' }}/>

      {/* Top header strip */}
      <div style={{ padding: '18px 36px 14px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #222' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 28, height: 28, background: '#FF4500', display: 'grid', placeItems: 'center', ...PDF_DISPLAY, fontSize: 12, fontWeight: 700 }}>WE</div>
          <div>
            <div style={{ ...PDF_DISPLAY, fontSize: 11, letterSpacing: 1.5, lineHeight: 1 }}>WILMIN <span style={{ color: '#FF4500' }}>ESTÉVEZ</span></div>
            <div style={{ fontSize: 7, letterSpacing: 2, color: '#888', marginTop: 2 }}>FITNESS COACH · RD</div>
          </div>
        </div>
        <div style={{ fontSize: 8, color: '#666', letterSpacing: 1.5 }}>YARISBEL P. · SEMANA 14 · 13–19 MAY 2026</div>
      </div>

      {children}

      {/* Footer */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '14px 36px 14px 48px', borderTop: '1px solid #222', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 8, color: '#666', letterSpacing: 2, fontWeight: 600 }}>@WILMIN_ESTEVEZ</div>
        <div style={{ fontSize: 8, color: '#666', letterSpacing: 1 }}>{footerLabel}</div>
        <div style={{ fontSize: 8, color: '#444' }}>we-coach.app/y/yarisbel</div>
      </div>
    </div>
  );
}

// ===== Cover =====
function PDFCover() {
  return (
    <div style={{ position: 'relative', minHeight: 900, background: '#0A0A0A', color: '#fff', ...PDF_FONT, overflow: 'hidden' }}>
      {/* Orange bar full height */}
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 16, background: '#FF4500' }}/>

      {/* Background WE huge */}
      <div style={{
        position: 'absolute', right: -50, top: 80, ...PDF_DISPLAY,
        fontSize: 280, fontWeight: 700, color: '#1a1a1a', letterSpacing: -8, lineHeight: 0.8, userSelect: 'none'
      }}>WE</div>

      <div style={{ position: 'relative', padding: '60px 50px 0 60px' }}>
        {/* Header brand mark */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 60 }}>
          <div style={{ width: 50, height: 50, background: '#FF4500', display: 'grid', placeItems: 'center', ...PDF_DISPLAY, fontSize: 22, fontWeight: 700 }}>WE</div>
          <div>
            <div style={{ ...PDF_DISPLAY, fontSize: 18, letterSpacing: 2, lineHeight: 1 }}>WILMIN <span style={{ color: '#FF4500' }}>ESTÉVEZ</span></div>
            <div style={{ fontSize: 9, letterSpacing: 3, color: '#888', marginTop: 4 }}>FITNESS COACH · REPÚBLICA DOMINICANA</div>
          </div>
        </div>

        {/* Main title */}
        <div style={{ marginTop: 30 }}>
          <div style={{ fontSize: 10, letterSpacing: 4, color: '#FF4500', fontWeight: 700, marginBottom: 18 }}>TU PLAN SEMANAL</div>
          <div style={{ ...PDF_DISPLAY, fontSize: 84, fontWeight: 700, lineHeight: 0.92, letterSpacing: 0 }}>
            CONSTRUYE<br/>
            EL HÁBITO.<br/>
            <span style={{ color: '#FF4500' }}>CAMBIA</span><br/>
            EL DESTINO.
          </div>
        </div>

        {/* Divider */}
        <div style={{ width: 100, height: 3, background: '#FF4500', marginTop: 36, marginBottom: 24 }}/>

        {/* Client + week */}
        <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: 18, alignItems: 'center' }}>
          <div style={{
            width: 80, height: 80, background: '#FF4500',
            display: 'grid', placeItems: 'center', ...PDF_DISPLAY,
            fontSize: 32, fontWeight: 700
          }}>YP</div>
          <div>
            <div style={{ ...PDF_DISPLAY, fontSize: 32, letterSpacing: 1, lineHeight: 1 }}>YARISBEL PICHARDO</div>
            <div style={{ fontSize: 10, color: '#888', letterSpacing: 2, marginTop: 8 }}>SEMANA 14 · 13–19 MAY 2026 · OBJETIVO: PÉRDIDA DE PESO</div>
          </div>
        </div>

        {/* Tag stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginTop: 36 }}>
          {[['INICIO','86 KG'],['ACTUAL','74.2 KG'],['META','65 KG'],['DÍA','96/365']].map(([l, v], i) => (
            <div key={i} style={{ padding: 12, background: '#181818', borderTop: '3px solid #FF4500' }}>
              <div style={{ fontSize: 8, letterSpacing: 2, color: '#888', fontWeight: 600 }}>{l}</div>
              <div style={{ ...PDF_DISPLAY, fontSize: 22, marginTop: 6, color: i === 1 ? '#FF4500' : '#fff' }}>{v}</div>
            </div>
          ))}
        </div>

        {/* Tagline */}
        <div style={{ position: 'absolute', bottom: 40, left: 60, right: 50 }}>
          <div style={{ width: 60, height: 2, background: '#FF4500', marginBottom: 14 }}/>
          <div style={{ ...PDF_DISPLAY, fontSize: 18, letterSpacing: 2 }}>
            MUÉVETE. ALIMÉNTATE. <span style={{ color: '#FF4500' }}>CREE.</span> REPITE.
          </div>
          <div style={{ fontSize: 8, color: '#444', letterSpacing: 2, marginTop: 14 }}>@WILMIN_ESTEVEZ · WE-COACH.APP</div>
        </div>
      </div>
    </div>
  );
}

// ===== Overview / Macros =====
function PDFOverview() {
  return (
    <PDFPageFrame footerLabel="02 · RESUMEN">
      <div style={{ padding: '28px 36px 80px 60px' }}>
        <div style={{ fontSize: 9, letterSpacing: 3, color: '#FF4500', fontWeight: 700, marginBottom: 10 }}>RESUMEN DE LA SEMANA</div>
        <div style={{ ...PDF_DISPLAY, fontSize: 32, letterSpacing: 1, lineHeight: 1, marginBottom: 22 }}>
          TUS MACROS Y CARB CYCLING
        </div>

        {/* Macros block */}
        <div style={{ background: '#161616', padding: 22, borderLeft: '4px solid #FF4500', marginBottom: 22 }}>
          <div style={{ fontSize: 9, letterSpacing: 2, color: '#888', marginBottom: 14, fontWeight: 600 }}>OBJETIVO DIARIO</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
            {[['kcal','1,750'],['Proteína','140 g'],['Grasa','55 g'],['Agua','2.5 L']].map(([l,v], i) => (
              <div key={i}>
                <div style={{ fontSize: 8, color: '#888', letterSpacing: 1.5, textTransform: 'uppercase' }}>{l}</div>
                <div style={{ ...PDF_DISPLAY, fontSize: 26, marginTop: 4, color: i === 0 ? '#FF4500' : '#fff' }}>{v}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Carb cycle table */}
        <div style={{ fontSize: 9, letterSpacing: 3, color: '#FF4500', fontWeight: 700, marginBottom: 10 }}>CARB CYCLING SEMANAL</div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 10, marginBottom: 22 }}>
          <thead>
            <tr style={{ background: '#161616' }}>
              <th style={{ textAlign: 'left', padding: 10, fontSize: 8, letterSpacing: 1.5, color: '#888' }}>DÍA</th>
              <th style={{ textAlign: 'left', padding: 10, fontSize: 8, letterSpacing: 1.5, color: '#888' }}>NIVEL</th>
              <th style={{ textAlign: 'right', padding: 10, fontSize: 8, letterSpacing: 1.5, color: '#888' }}>CARBOS</th>
              <th style={{ textAlign: 'right', padding: 10, fontSize: 8, letterSpacing: 1.5, color: '#888' }}>PROT</th>
              <th style={{ textAlign: 'right', padding: 10, fontSize: 8, letterSpacing: 1.5, color: '#888' }}>GRASA</th>
              <th style={{ textAlign: 'right', padding: 10, fontSize: 8, letterSpacing: 1.5, color: '#888' }}>ENTRENO</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['LUNES','ALTO','#FF4500', '220 g','140 g','55 g','Pierna + Glúteo'],
              ['MARTES','MEDIO','#F59E0B','150 g','140 g','55 g','Pecho + Brazo'],
              ['MIÉRCOLES','BAJO','#9CA3AF','80 g','140 g','65 g','Cardio + Core'],
              ['JUEVES','ALTO','#FF4500','220 g','140 g','55 g','Espalda + Hombro'],
              ['VIERNES','MEDIO','#F59E0B','150 g','140 g','55 g','Pierna pesada'],
              ['SÁBADO','BAJO','#9CA3AF','80 g','140 g','65 g','Cardio LISS'],
              ['DOMINGO','BAJO','#9CA3AF','80 g','140 g','65 g','Descanso'],
            ].map((r, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #222' }}>
                <td style={{ padding: 10, ...PDF_DISPLAY, fontSize: 12, letterSpacing: 1 }}>{r[0]}</td>
                <td style={{ padding: 10 }}>
                  <span style={{ background: r[2], color: r[2] === '#F59E0B' || r[2] === '#9CA3AF' ? '#111' : '#fff', padding: '3px 8px', fontSize: 8, fontWeight: 700, letterSpacing: 1.5 }}>{r[1]}</span>
                </td>
                <td style={{ padding: 10, textAlign: 'right' }}>{r[3]}</td>
                <td style={{ padding: 10, textAlign: 'right' }}>{r[4]}</td>
                <td style={{ padding: 10, textAlign: 'right' }}>{r[5]}</td>
                <td style={{ padding: 10, textAlign: 'right', fontSize: 9, color: '#aaa' }}>{r[6]}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Reglas del coach */}
        <div style={{ fontSize: 9, letterSpacing: 3, color: '#FF4500', fontWeight: 700, marginBottom: 10 }}>REGLAS DEL COACH</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
          {[
            ['HIDRATACIÓN','2.5 L de agua mínimo. Café hasta 2 tazas sin azúcar.'],
            ['CADA COMIDA','Escoge UNA de las 3 opciones. No mezcles entre opciones.'],
            ['DÍAS ALTOS','Tu entreno pesado coincide con el carbo alto.'],
            ['SUPLEMENTOS','Whey post-entreno · Omega 3 con almuerzo · Multivit AM.'],
          ].map(([l, v], i) => (
            <div key={i} style={{ padding: 12, background: '#161616', borderLeft: '2px solid #FF4500' }}>
              <div style={{ fontSize: 9, letterSpacing: 2, color: '#FF4500', fontWeight: 700, marginBottom: 4 }}>{l}</div>
              <div style={{ fontSize: 10, color: '#ccc', lineHeight: 1.5 }}>{v}</div>
            </div>
          ))}
        </div>
      </div>
    </PDFPageFrame>
  );
}

// ===== Nutrition day with detailed ingredients =====
function PDFNutritionDay({ day, cycle, cycleColor }) {
  // Get sample meals for the day — using window.MEAL_DB
  const MEAL_DB = window.MEAL_DB;
  if (!MEAL_DB) return null;

  const cycleIdx = cycle.includes('ALTO') ? 0 : cycle.includes('MEDIO') ? 1 : 2;
  const meals = [
    { key: 'desayuno', label: 'DESAYUNO', time: '7:00 AM' },
    { key: 'media_manana', label: 'MEDIA MAÑANA', time: '10:30 AM' },
    { key: 'almuerzo', label: 'ALMUERZO', time: '1:00 PM' },
    { key: 'merienda', label: 'MERIENDA', time: '4:30 PM' },
    { key: 'cena', label: 'CENA', time: '7:30 PM' },
  ];

  return (
    <PDFPageFrame footerLabel={`${day.toUpperCase()}`}>
      <div style={{ padding: '24px 36px 80px 60px' }}>
        {/* Day header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 20, paddingBottom: 14, borderBottom: '1px solid #222' }}>
          <div>
            <div style={{ fontSize: 9, letterSpacing: 3, color: '#FF4500', fontWeight: 700, marginBottom: 6 }}>NUTRICIÓN</div>
            <div style={{ ...PDF_DISPLAY, fontSize: 38, lineHeight: 1, letterSpacing: 1 }}>{day}</div>
          </div>
          <div style={{ background: cycleColor, padding: '6px 12px', color: cycleIdx === 0 ? '#fff' : '#111', ...PDF_DISPLAY, fontSize: 11, letterSpacing: 2, fontWeight: 700 }}>
            {cycle}
          </div>
        </div>

        {/* Meals — each with 1 option's ingredients (the recommended one) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {meals.map((m, mi) => {
            const opt = MEAL_DB[m.key][cycleIdx][0];
            return (
              <div key={m.key} style={{ background: '#141414', padding: 14, borderLeft: '3px solid #FF4500' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '90px 1fr 100px', gap: 14, alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ ...PDF_DISPLAY, fontSize: 11, color: '#FF4500', letterSpacing: 2, fontWeight: 700 }}>{m.label}</div>
                    <div style={{ fontSize: 8, color: '#888', letterSpacing: 1.5, marginTop: 3 }}>{m.time}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11.5, fontWeight: 600, marginBottom: 8, lineHeight: 1.3 }}>{opt.name}</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                      {opt.ingredients.map((ing, ii) => (
                        <div key={ii} style={{
                          display: 'grid',
                          gridTemplateColumns: '1fr auto auto',
                          gap: 12,
                          alignItems: 'baseline',
                          padding: '2px 0',
                          fontSize: 9.5,
                          color: '#ccc'
                        }}>
                          <div>• {ing.food}</div>
                          <div style={{ color: '#FF4500', fontWeight: 700, fontSize: 9.5 }}>{ing.amount}</div>
                          <div style={{ color: '#888', fontSize: 9, minWidth: 70, textAlign: 'right' }}>{ing.portion}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', borderLeft: '1px solid #222', paddingLeft: 12 }}>
                    <div style={{ ...PDF_DISPLAY, fontSize: 16, color: '#FF4500' }}>{opt.p*4 + opt.c*4 + opt.f*9}</div>
                    <div style={{ fontSize: 7, color: '#666', letterSpacing: 1.5, marginBottom: 6 }}>KCAL</div>
                    <div style={{ fontSize: 8, color: '#888' }}>
                      P {opt.p}g · C {opt.c}g · G {opt.f}g
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Day totals */}
        <div style={{ marginTop: 16, padding: '14px 16px', background: '#FF4500', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ ...PDF_DISPLAY, fontSize: 14, letterSpacing: 2, fontWeight: 700 }}>TOTAL DEL DÍA</div>
          <div style={{ ...PDF_DISPLAY, fontSize: 18, letterSpacing: 1 }}>1,750 KCAL · 140P · {cycleIdx === 0 ? 220 : cycleIdx === 1 ? 150 : 80}C · {cycleIdx === 2 ? 65 : 55}G</div>
        </div>

        {/* Note */}
        <div style={{ marginTop: 14, fontSize: 9, color: '#888', lineHeight: 1.6, fontStyle: 'italic' }}>
          * En tu link y en la app puedes ver las 3 opciones de cada comida y escoger la que más te guste para cada día.
        </div>
      </div>
    </PDFPageFrame>
  );
}

// ===== Training =====
function PDFTraining() {
  const days = [
    { d: 'LUNES', n: 'PIERNA + GLÚTEO', exs: [
      ['Sentadilla con barra', '4', '12-10-8-6', '90s', 'Progresivo'],
      ['Hip thrust con barra', '4', '12', '75s', '40 kg'],
      ['Sentadilla búlgara', '3', '12 c/u', '60s', '12 kg'],
      ['Patada de glúteo en máquina', '3', '15', '45s', 'Máq #5'],
    ]},
    { d: 'MARTES', n: 'PECHO + BRAZO', exs: [
      ['Press banca plano', '4', '10-8-8-6', '90s', 'Progresivo'],
      ['Press inclinado mancuernas', '3', '10', '75s', '12 kg · 30°'],
      ['Curl bíceps barra Z', '3', '12', '45s', '15 kg'],
    ]},
    { d: 'MIÉRCOLES', n: 'CARDIO + CORE', exs: [
      ['Caminata cinta inclinada', '1', '30 min', '—', 'Inclinación 8'],
      ['Plancha abdominal', '3', '45 s', '30s', 'Peso corporal'],
      ['Russian twist con disco', '3', '20', '45s', '5 kg'],
    ]},
    { d: 'JUEVES', n: 'ESPALDA + HOMBRO', exs: [
      ['Jalón al pecho', '4', '12', '75s', 'Progresivo'],
      ['Remo unilateral mancuerna', '3', '12 c/u', '60s', '12 kg'],
      ['Elevaciones laterales', '4', '15', '45s', '5 kg'],
    ]},
    { d: 'VIERNES', n: 'PIERNA PESADA', exs: [
      ['Sentadilla con barra', '5', '8-6-6-4-4', '120s', 'Día de fuerza'],
      ['Prensa 45°', '4', '12', '90s', 'Máquina'],
      ['Peso muerto rumano', '4', '10', '90s', 'Progresivo'],
    ]},
    { d: 'SÁBADO', n: 'CARDIO LISS', exs: [
      ['Caminata cinta', '1', '45 min', '—', 'Zona 2'],
    ]},
    { d: 'DOMINGO', n: 'DESCANSO ACTIVO', exs: [] },
  ];

  return (
    <PDFPageFrame footerLabel="ENTRENO · SEMANA 14">
      <div style={{ padding: '24px 36px 80px 60px' }}>
        <div style={{ marginBottom: 18 }}>
          <div style={{ fontSize: 9, letterSpacing: 3, color: '#FF4500', fontWeight: 700, marginBottom: 6 }}>ENTRENAMIENTO</div>
          <div style={{ ...PDF_DISPLAY, fontSize: 38, lineHeight: 1, letterSpacing: 1 }}>SEMANA COMPLETA</div>
          <div style={{ fontSize: 10, color: '#888', marginTop: 6 }}>6 días de entreno · 1 descanso · diseño Wilmin Estévez</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {days.map((d, di) => (
            <div key={di} style={{ background: '#141414', padding: 12, borderLeft: '3px solid #FF4500' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: d.exs.length > 0 ? 10 : 0 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
                  <div style={{ ...PDF_DISPLAY, fontSize: 14, letterSpacing: 1.5, color: '#FF4500' }}>{d.d}</div>
                  <div style={{ ...PDF_DISPLAY, fontSize: 14, letterSpacing: 1 }}>{d.n}</div>
                </div>
                <div style={{ fontSize: 8, color: '#888', letterSpacing: 1.5 }}>
                  {d.exs.length} {d.exs.length === 1 ? 'EJERCICIO' : 'EJERCICIOS'}
                </div>
              </div>
              {d.exs.length > 0 && (
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 9.5 }}>
                  <thead>
                    <tr>
                      <th style={{ textAlign: 'left', padding: '4px 0', fontSize: 7, letterSpacing: 1.5, color: '#666', fontWeight: 600 }}>EJERCICIO</th>
                      <th style={{ textAlign: 'center', padding: '4px 0', fontSize: 7, letterSpacing: 1.5, color: '#666', fontWeight: 600, width: 50 }}>SETS</th>
                      <th style={{ textAlign: 'center', padding: '4px 0', fontSize: 7, letterSpacing: 1.5, color: '#666', fontWeight: 600, width: 80 }}>REPS</th>
                      <th style={{ textAlign: 'center', padding: '4px 0', fontSize: 7, letterSpacing: 1.5, color: '#666', fontWeight: 600, width: 60 }}>DESC.</th>
                      <th style={{ textAlign: 'right', padding: '4px 0', fontSize: 7, letterSpacing: 1.5, color: '#666', fontWeight: 600, width: 110 }}>PESO/NOTA</th>
                    </tr>
                  </thead>
                  <tbody>
                    {d.exs.map((ex, ei) => (
                      <tr key={ei} style={{ borderTop: '1px solid #222' }}>
                        <td style={{ padding: '6px 0', color: '#fff' }}>{ex[0]}</td>
                        <td style={{ padding: '6px 0', textAlign: 'center', color: '#FF4500', fontWeight: 700 }}>{ex[1]}</td>
                        <td style={{ padding: '6px 0', textAlign: 'center' }}>{ex[2]}</td>
                        <td style={{ padding: '6px 0', textAlign: 'center', color: '#aaa' }}>{ex[3]}</td>
                        <td style={{ padding: '6px 0', textAlign: 'right', color: '#aaa' }}>{ex[4]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          ))}
        </div>
      </div>
    </PDFPageFrame>
  );
}

// ===== Shopping list =====
function PDFShopping() {
  const sections = [
    { title: 'PROTEÍNAS', items: [
      ['Pechuga de pollo', '1.5 kg'],
      ['Salmón fresco', '500 g'],
      ['Tilapia', '500 g'],
      ['Carne molida 95% magra', '300 g'],
      ['Atún en agua', '4 latas'],
      ['Huevos enteros', '30 unidades'],
      ['Whey vainilla', '1 envase'],
    ]},
    { title: 'CARBOHIDRATOS', items: [
      ['Arroz integral', '500 g'],
      ['Quinoa', '300 g'],
      ['Avena en hojuelas', '500 g'],
      ['Batata', '1 kg'],
      ['Pan integral', '1 paquete'],
      ['Plátano', '1 manojo'],
    ]},
    { title: 'GRASAS BUENAS', items: [
      ['Aguacate', '3 unidades'],
      ['Almendras crudas', '200 g'],
      ['Mantequilla de maní natural', '1 frasco'],
      ['Aceite de oliva extra virgen', '1 botella'],
      ['Nueces', '100 g'],
    ]},
    { title: 'VEGETALES', items: [
      ['Brócoli fresco', '1 kg'],
      ['Espinaca', '2 paquetes'],
      ['Espárragos', '1 manojo'],
      ['Lechugas mixtas', '1 paquete'],
      ['Tomate cherry', '500 g'],
      ['Pepino', '3 unidades'],
    ]},
    { title: 'LÁCTEOS Y OTROS', items: [
      ['Yogur griego 0%', '4 envases'],
      ['Queso fresco', '300 g'],
      ['Queso cottage', '1 envase'],
      ['Frutos rojos', '500 g'],
      ['Manzanas', '5 unidades'],
      ['Limones', '6 unidades'],
    ]},
  ];

  return (
    <PDFPageFrame footerLabel="LISTA DE COMPRA">
      <div style={{ padding: '24px 36px 80px 60px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 22, paddingBottom: 14, borderBottom: '1px solid #222' }}>
          <div>
            <div style={{ fontSize: 9, letterSpacing: 3, color: '#FF4500', fontWeight: 700, marginBottom: 6 }}>SUPERMERCADO</div>
            <div style={{ ...PDF_DISPLAY, fontSize: 38, lineHeight: 1, letterSpacing: 1 }}>LISTA DE COMPRA</div>
          </div>
          <div style={{ fontSize: 9, color: '#888', letterSpacing: 1.5 }}>PARA TODA LA SEMANA</div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
          {sections.map((s, si) => (
            <div key={si} style={{ background: '#141414', padding: 14, borderLeft: '3px solid #FF4500' }}>
              <div style={{ ...PDF_DISPLAY, fontSize: 12, letterSpacing: 2, color: '#FF4500', fontWeight: 700, marginBottom: 10 }}>{s.title}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                {s.items.map((it, i) => (
                  <div key={i} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '3px 0',
                    borderBottom: i < s.items.length - 1 ? '1px dashed #222' : 'none'
                  }}>
                    <div style={{ width: 10, height: 10, border: '1.5px solid #FF4500', flexShrink: 0 }}/>
                    <div style={{ flex: 1, fontSize: 9.5, color: '#ddd' }}>{it[0]}</div>
                    <div style={{ fontSize: 9, color: '#FF4500', fontWeight: 700 }}>{it[1]}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </PDFPageFrame>
  );
}

// ===== Closing =====
function PDFClosing() {
  return (
    <PDFPageFrame footerLabel="CIERRE">
      <div style={{ padding: '50px 50px 80px 60px', textAlign: 'center', position: 'relative' }}>
        <div style={{ fontSize: 9, letterSpacing: 4, color: '#FF4500', fontWeight: 700, marginBottom: 14 }}>MENSAJE DEL COACH</div>
        <div style={{ ...PDF_DISPLAY, fontSize: 56, lineHeight: 1, letterSpacing: 1, marginTop: 20 }}>
          CON DIOS<br/>
          Y <span style={{ color: '#FF4500' }}>DISCIPLINA,</span><br/>
          NO HAY EXCUSA<br/>
          QUE VALGA.
        </div>

        <div style={{ width: 80, height: 3, background: '#FF4500', margin: '36px auto 30px' }}/>

        <div style={{ maxWidth: 360, margin: '0 auto', fontSize: 11, lineHeight: 1.7, color: '#ccc', textAlign: 'left' }}>
          Yarisbel, esta es tu semana 14. Has perdido <b style={{ color: '#FF4500' }}>11.8 kg</b> desde que empezamos. Te quedan 9 kg para tu meta y vamos por el camino correcto.<br/><br/>
          Si fallas en una comida, no fallas en el plan. Si te saltas un entreno, no te saltas el proceso. Lo importante es <b style={{ color: '#fff' }}>volver siempre.</b>
          <br/><br/>
          Cualquier duda, escríbeme directo. Estoy contigo en cada paso.
        </div>

        {/* Signature block */}
        <div style={{ marginTop: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14 }}>
          <div style={{
            width: 54, height: 54, background: '#FF4500',
            display: 'grid', placeItems: 'center',
            ...PDF_DISPLAY, fontSize: 22, fontWeight: 700
          }}>WE</div>
          <div style={{ textAlign: 'left' }}>
            <div style={{ ...PDF_DISPLAY, fontSize: 18, letterSpacing: 1 }}>WILMIN ESTÉVEZ</div>
            <div style={{ fontSize: 9, letterSpacing: 2, color: '#888', marginTop: 2 }}>FITNESS COACH</div>
          </div>
        </div>

        {/* Quick contact */}
        <div style={{ position: 'absolute', bottom: 70, left: 60, right: 50, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
          {[
            ['INSTAGRAM', '@WILMIN_ESTEVEZ'],
            ['WHATSAPP', '+1 829 555 0100'],
            ['APP', 'WE-COACH.APP'],
          ].map(([l, v], i) => (
            <div key={i} style={{ padding: 10, background: '#141414', borderTop: '2px solid #FF4500', textAlign: 'center' }}>
              <div style={{ fontSize: 7, letterSpacing: 2, color: '#888', fontWeight: 600 }}>{l}</div>
              <div style={{ ...PDF_DISPLAY, fontSize: 11, marginTop: 4 }}>{v}</div>
            </div>
          ))}
        </div>
      </div>
    </PDFPageFrame>
  );
}

// ============================================================
// PUBLIC LINK — mobile preview
// ============================================================
function PublicLinkView() {
  const [copied, setCopied] = useState(false);
  const link = 'we-coach.app/y/yarisbel-pichardo';

  return (
    <div className="content">
      <div className="row between mb-24">
        <div>
          <div className="display" style={{ fontSize: 34, letterSpacing: 1, lineHeight: 1 }}>LINK PÚBLICO</div>
          <div className="row gap-8 mt-8">
            <span className="chip-mod" style={{ background: 'var(--we-orange)', color: '#fff' }}>MÓVIL FIRST</span>
            <span className="chip-mod">PARA YARISBEL P.</span>
          </div>
        </div>
        <div className="row gap-8">
          <button className="btn btn-ghost btn-sm"><Icon name="qr" size={12}/> Generar QR</button>
          <button className="btn btn-ghost btn-sm"><Icon name="eye" size={12}/> Ver en navegador</button>
        </div>
      </div>

      <div className="card-mod mb-20" style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 20px' }}>
        <Icon name="link" size={20}/>
        <div className="flex-1">
          <div className="text-xs text-mid uppercase" style={{ letterSpacing: 1.5 }}>Link público</div>
          <div className="display" style={{ fontSize: 17, color: 'var(--we-orange)', marginTop: 2 }}>{link}</div>
        </div>
        <button className="btn btn-ghost btn-sm" onClick={() => { setCopied(true); setTimeout(() => setCopied(false), 1500); }}>
          <Icon name="copy" size={11}/> {copied ? '¡Copiado!' : 'Copiar'}
        </button>
        <button className="btn btn-primary btn-sm"><Icon name="message" size={11}/> Enviar a Yarisbel</button>
      </div>

      <div className="row gap-24" style={{ alignItems: 'flex-start' }}>
        <div className="phone"><div className="phone-screen"><PublicLinkScreen /></div></div>

        <div className="col gap-16 flex-1">
          <div className="card-mod">
            <div className="card-title-mod mb-12">VISIBILIDAD</div>
            <div className="col gap-12">
              {[
                ['Plan nutricional completo', true],
                ['Plan de entrenamiento', true],
                ['Videos de los ejercicios', true],
                ['Su progreso (peso y fotos)', false],
                ['Lista de compra', true],
                ['Chat directo con el coach', true],
              ].map(([label, on], i) => (
                <div key={i} className="row between">
                  <span className="text-sm">{label}</span>
                  <div className={'toggle' + (on ? ' on' : '')}/>
                </div>
              ))}
            </div>
          </div>

          <div className="card-mod">
            <div className="card-title-mod mb-12">ESTADÍSTICAS</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div className="bento-cell" style={{ minHeight: 0 }}>
                <div className="bento-label">APERTURAS</div>
                <div className="display" style={{ fontSize: 32, marginTop: 6, color: 'var(--we-orange)' }}>47</div>
              </div>
              <div className="bento-cell" style={{ minHeight: 0 }}>
                <div className="bento-label">ÚLTIMA VISITA</div>
                <div className="display" style={{ fontSize: 16, marginTop: 10 }}>HOY 9:14 AM</div>
              </div>
            </div>
            <div className="text-xs text-mid mt-12" style={{ lineHeight: 1.5 }}>
              Yarisbel ha abierto el link <b style={{ color: '#fff' }}>47 veces</b> este mes. Está activa y comprometida 🔥
            </div>
          </div>

          <div className="card-mod">
            <div className="card-title-mod mb-12">PROTECCIÓN</div>
            <div className="col gap-12">
              <div className="row between text-sm"><span>Requiere PIN para abrir</span><div className="toggle on"/></div>
              <div className="row between text-sm"><span>Expira al renovar plan</span><div className="toggle on"/></div>
              <div className="row between text-sm"><span>Solo accesible desde RD</span><div className="toggle"/></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PublicLinkScreen() {
  const [tab, setTab] = useState('hoy');
  return (
    <div style={{ background: '#0A0A0A', color: '#fff', fontSize: 11, minHeight: '100%' }}>
      <div style={{ padding: 16, position: 'relative', borderBottom: '1px solid #2B2B2B' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, background: '#FF4500' }}/>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, background: '#FF4500', display: 'grid', placeItems: 'center', fontFamily: 'Oswald', fontSize: 14, fontWeight: 700, borderRadius: 6 }}>WE</div>
          <div>
            <div style={{ fontFamily: 'Oswald', fontSize: 13, letterSpacing: 1 }}>WILMIN <span style={{ color: '#FF4500' }}>ESTÉVEZ</span></div>
            <div style={{ fontSize: 8, color: '#888', letterSpacing: 1.5, textTransform: 'uppercase', marginTop: 1 }}>FITNESS COACH</div>
          </div>
        </div>
        <div style={{ marginTop: 14 }}>
          <div style={{ fontSize: 8, color: '#FF4500', letterSpacing: 2, fontWeight: 700 }}>BIENVENIDA</div>
          <div style={{ fontFamily: 'Oswald', fontSize: 22, marginTop: 4, lineHeight: 1.1 }}>
            HOLA, <span style={{ color: '#FF4500' }}>YARISBEL.</span>
          </div>
          <div style={{ fontSize: 9, color: '#aaa', marginTop: 4 }}>Día 96 de 365 · VIP 12 meses</div>
        </div>
      </div>

      <div style={{ display: 'flex', borderBottom: '1px solid #2B2B2B', position: 'sticky', top: 0, background: '#0A0A0A' }}>
        {['hoy','plan','progreso','chat'].map(t => (
          <div key={t} onClick={() => setTab(t)}
            style={{
              flex: 1, padding: '12px 6px', fontSize: 9, letterSpacing: 1.5, textTransform: 'uppercase',
              fontWeight: 700, textAlign: 'center',
              color: tab === t ? '#fff' : '#666',
              borderBottom: '2px solid ' + (tab === t ? '#FF4500' : 'transparent')
            }}>{t}</div>
        ))}
      </div>

      {tab === 'hoy' && (
        <div style={{ padding: 14 }}>
          <div style={{ background: '#FF4500', padding: 14, color: '#fff', marginBottom: 14, borderRadius: 6 }}>
            <div style={{ fontSize: 8, letterSpacing: 2, fontWeight: 700, opacity: 0.85 }}>MIÉRCOLES · DÍA MEDIO</div>
            <div style={{ fontFamily: 'Oswald', fontSize: 16, marginTop: 4, letterSpacing: 0.5 }}>CARDIO + CORE HOY</div>
            <div style={{ fontSize: 10, marginTop: 6, opacity: 0.9 }}>30 min cinta + plancha + russian twists</div>
          </div>

          <div style={{ fontSize: 8, letterSpacing: 2, color: '#FF4500', fontWeight: 700, marginBottom: 8, paddingLeft: 8, borderLeft: '2px solid #FF4500' }}>COMIDAS DE HOY</div>

          {[
            { time: 'Desayuno · 7:00', meal: 'Smoothie verde post entreno', macros: '32P · 32C · 12G' },
            { time: 'Almuerzo · 13:00', meal: 'Pollo con quinoa y vegetales', macros: '46P · 35C · 12G' },
            { time: 'Cena · 19:30', meal: 'Tilapia + quinoa + espinaca', macros: '38P · 30C · 8G' }
          ].map((m, i) => (
            <div key={i} style={{ padding: 10, background: '#1A1A1A', marginBottom: 6, borderRadius: 4, display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 18, height: 18, border: '1.5px solid #FF4500', flexShrink: 0, borderRadius: 3 }}/>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 8, color: '#FF4500', letterSpacing: 1.2, fontWeight: 700 }}>{m.time}</div>
                <div style={{ fontSize: 10, marginTop: 2 }}>{m.meal}</div>
                <div style={{ fontSize: 8, color: '#888', marginTop: 2 }}>{m.macros}</div>
              </div>
              <div style={{ fontSize: 10, color: '#666' }}>→</div>
            </div>
          ))}

          <div style={{ background: '#1A1A1A', padding: 14, marginTop: 14, border: '1px solid #FF4500', borderRadius: 6 }}>
            <div style={{ fontSize: 8, letterSpacing: 2, color: '#FF4500', fontWeight: 700 }}>CHECK-IN SEMANAL</div>
            <div style={{ fontSize: 10, marginTop: 4 }}>Te toca el viernes. Sube tu peso y fotos.</div>
            <button style={{
              marginTop: 10, padding: '8px 12px', background: '#FF4500',
              border: 'none', color: '#fff', fontSize: 9, letterSpacing: 1.5, fontWeight: 700,
              textTransform: 'uppercase', width: '100%', borderRadius: 4
            }}>HACER CHECK-IN</button>
          </div>
        </div>
      )}

      {tab === 'plan' && (
        <div style={{ padding: 14 }}>
          <div style={{ fontSize: 8, letterSpacing: 2, color: '#FF4500', fontWeight: 700, marginBottom: 8, paddingLeft: 8, borderLeft: '2px solid #FF4500' }}>TUS MACROS</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6, marginBottom: 14 }}>
            {[['kcal','1750'],['P','140'],['C','220'],['G','55']].map(([l,v], i) => (
              <div key={i} style={{ padding: 8, background: '#1A1A1A', textAlign: 'center', borderTop: '2px solid #FF4500', borderRadius: 3 }}>
                <div style={{ fontSize: 7, color: '#888', letterSpacing: 1 }}>{l}</div>
                <div style={{ fontFamily: 'Oswald', fontSize: 14, marginTop: 2 }}>{v}</div>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 8, letterSpacing: 2, color: '#FF4500', fontWeight: 700, marginBottom: 8, paddingLeft: 8, borderLeft: '2px solid #FF4500' }}>SEMANA</div>
          {['LUN · Pierna + Glúteo','MAR · Pecho + Brazo','MIÉ · Cardio + Core','JUE · Espalda + Hombro','VIE · Pierna pesada','SÁB · Cardio LISS','DOM · Descanso'].map((d, i) => (
            <div key={i} style={{
              padding: 10, background: i === 2 ? '#FF4500' : '#1A1A1A',
              marginBottom: 4, fontSize: 10, fontWeight: i === 2 ? 700 : 400, borderRadius: 3
            }}>{d}</div>
          ))}
        </div>
      )}

      {tab === 'progreso' && (
        <div style={{ padding: 14 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
            <div style={{ padding: 10, background: '#1A1A1A', borderTop: '2px solid #FF4500', borderRadius: 3 }}>
              <div style={{ fontSize: 7, color: '#888', letterSpacing: 1.5 }}>PESO ACTUAL</div>
              <div style={{ fontFamily: 'Oswald', fontSize: 22, color: '#FF4500' }}>74.2 kg</div>
            </div>
            <div style={{ padding: 10, background: '#1A1A1A', borderTop: '2px solid #FF4500', borderRadius: 3 }}>
              <div style={{ fontSize: 7, color: '#888', letterSpacing: 1.5 }}>PERDIDO</div>
              <div style={{ fontFamily: 'Oswald', fontSize: 22, color: '#22C55E' }}>−11.8</div>
            </div>
          </div>
          <div style={{ fontSize: 8, letterSpacing: 2, color: '#FF4500', fontWeight: 700, marginBottom: 8, paddingLeft: 8, borderLeft: '2px solid #FF4500' }}>FOTOS</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6 }}>
            {['S1','S8','S14'].map(s => (
              <div key={s} style={{ aspectRatio: '3/4', background: '#2B2B2B', display: 'grid', placeItems: 'center', fontSize: 9, letterSpacing: 1, color: '#666', borderRadius: 3 }}>{s}</div>
            ))}
          </div>
        </div>
      )}

      {tab === 'chat' && (
        <div style={{ padding: 14 }}>
          {[
            { who: 'Wilmin', text: 'Buen día Yarisbel! Vamos a darle con todo esta semana 🔥', mine: false },
            { who: 'Yo', text: 'Buenos días coach! Lista 💪', mine: true },
            { who: 'Wilmin', text: 'No olvides subir tu check-in el viernes.', mine: false },
          ].map((m, i) => (
            <div key={i} style={{
              padding: 10, background: m.mine ? '#FF4500' : '#1A1A1A', marginBottom: 6,
              maxWidth: '85%', marginLeft: m.mine ? 'auto' : 0, borderRadius: 6,
              borderLeft: m.mine ? 'none' : '2px solid #FF4500'
            }}>
              <div style={{ fontSize: 7, color: m.mine ? '#fff' : '#FF4500', letterSpacing: 1.5, fontWeight: 700, marginBottom: 4, opacity: m.mine ? 0.8 : 1 }}>{m.who.toUpperCase()}</div>
              <div style={{ fontSize: 10 }}>{m.text}</div>
            </div>
          ))}
        </div>
      )}

      <div style={{ padding: 18, textAlign: 'center', borderTop: '1px solid #2B2B2B', marginTop: 16 }}>
        <div style={{ fontFamily: 'Oswald', fontSize: 12, letterSpacing: 1, lineHeight: 1.4 }}>
          MUÉVETE. ALIMÉNTATE.<br/>
          <span style={{ color: '#FF4500' }}>CREE.</span> REPITE.
        </div>
        <div style={{ fontSize: 7, color: '#444', marginTop: 8, letterSpacing: 2 }}>@WILMIN_ESTEVEZ</div>
      </div>
    </div>
  );
}

Object.assign(window, { PDFPreview, PublicLinkView });
