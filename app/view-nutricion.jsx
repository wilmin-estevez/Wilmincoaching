// Plan de Nutrición — diseño moderno con ingredientes detallados
const WEEK_DAYS = ['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB', 'DOM'];
const DEFAULT_CYCLE = [0, 1, 2, 0, 1, 2, 2];
const CYCLE_LABEL = ['ALTO EN CARBOS', 'MEDIO', 'BAJO EN CARBOS'];
const CYCLE_SHORT = ['ALTO', 'MEDIO', 'BAJO'];
const CYCLE_COLOR = ['var(--we-orange)', '#F59E0B', '#9CA3AF'];

function PlanNutricionalView({ mini }) {
  const MEAL_DB = window.MEAL_DB;
  const [cycle, setCycle] = useState(DEFAULT_CYCLE);
  const [activeDay, setActiveDay] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState({});
  const [expanded, setExpanded] = useState({}); // ingredients expanded per option

  const getOption = (day, meal) => selectedOpt[`${day}-${meal}`] || 0;
  const setOption = (day, meal, idx) => setSelectedOpt(s => ({ ...s, [`${day}-${meal}`]: idx }));

  const dayLevel = cycle[activeDay];
  const meals = ['desayuno', 'media_manana', 'almuerzo', 'merienda', 'cena'];
  const mealLabels = ['DESAYUNO', 'MEDIA MAÑANA', 'ALMUERZO', 'MERIENDA', 'CENA'];
  const mealTimes = ['7:00 AM', '10:30 AM', '1:00 PM', '4:30 PM', '7:30 PM'];

  const dayTotals = meals.reduce((acc, m, i) => {
    const opt = MEAL_DB[m][dayLevel][getOption(activeDay, m)];
    return { p: acc.p + opt.p, c: acc.c + opt.c, f: acc.f + opt.f };
  }, { p: 0, c: 0, f: 0 });
  const dayCals = dayTotals.p * 4 + dayTotals.c * 4 + dayTotals.f * 9;

  // Macro targets
  const targets = { kcal: 1750, p: 140, c: dayLevel === 0 ? 220 : dayLevel === 1 ? 150 : 80, f: 55 };

  return (
    <div className={mini ? '' : 'content'}>
      {!mini && (
        <div className="row between mb-24">
          <div>
            <div className="row gap-8 text-xs text-mid mb-8">
              <span>Asesorados</span><Icon name="chevronRight" size={10}/>
              <span>Yarisbel Pichardo</span><Icon name="chevronRight" size={10}/>
              <span style={{ color: '#fff' }}>Plan Nutricional</span>
            </div>
            <div className="display" style={{ fontSize: 34, letterSpacing: 1, lineHeight: 1 }}>
              PLAN NUTRICIONAL
            </div>
            <div className="row gap-8 mt-8">
              <span className="chip-mod" style={{ background: 'var(--we-orange)', color: '#fff' }}>CARB CYCLING</span>
              <span className="chip-mod">7 DÍAS · 5 COMIDAS</span>
              <span className="chip-mod">3 OPCIONES POR COMIDA</span>
            </div>
          </div>
          <div className="row gap-8">
            <button className="btn btn-ghost btn-sm"><Icon name="eye" size={12}/> Vista previa</button>
            <button className="btn btn-ghost btn-sm"><Icon name="link" size={12}/> Link público</button>
            <button className="btn btn-primary"><Icon name="download" size={13}/> Exportar PDF</button>
          </div>
        </div>
      )}

      {/* Macro targets — modern bento */}
      <div className="bento-row mb-20">
        <div className="bento-cell" style={{ flex: 1.4 }}>
          <div className="bento-label">OBJETIVO DEL DÍA</div>
          <div className="row gap-16" style={{ marginTop: 6, alignItems: 'baseline' }}>
            <div>
              <div className="display" style={{ fontSize: 40, color: 'var(--we-orange)', lineHeight: 1 }}>{targets.kcal}</div>
              <div className="text-xs text-mid mt-4">kcal totales · meta diaria</div>
            </div>
            <div style={{ width: 1, height: 38, background: 'var(--we-carbon-2)' }}/>
            <div className="col gap-4">
              <div className="text-xs text-mid">vs hoy</div>
              <div style={{ fontSize: 13, color: dayCals < targets.kcal + 100 && dayCals > targets.kcal - 100 ? 'var(--we-success)' : 'var(--we-warn)' }}>
                {dayCals > targets.kcal ? '+' : ''}{dayCals - targets.kcal} kcal
              </div>
            </div>
          </div>
        </div>
        {[
          ['PROTEÍNA', targets.p, dayTotals.p, 'g'],
          ['CARBOS', targets.c, dayTotals.c, 'g'],
          ['GRASA', targets.f, dayTotals.f, 'g'],
        ].map(([l, target, current, unit], i) => {
          const pct = Math.min(100, (current / target) * 100);
          return (
            <div className="bento-cell" key={l}>
              <div className="bento-label">{l}</div>
              <div className="display" style={{ fontSize: 26, marginTop: 6, lineHeight: 1 }}>
                {current}<span className="text-xs text-mid" style={{ fontFamily: 'var(--font-body)' }}>/{target}{unit}</span>
              </div>
              <div className="bar mt-12"><div className="bar-fill" style={{ width: pct + '%' }}/></div>
            </div>
          );
        })}
      </div>

      {/* Carb cycle week strip — modern */}
      <div className="card-mod mb-20">
        <div className="row between mb-14">
          <div>
            <div className="card-title-mod">CARB CYCLE · SEMANA</div>
            <div className="card-sub-mod">Click un día para alternar A · M · B · ciclo</div>
          </div>
          <div className="row gap-14 text-xs">
            {['ALTO','MEDIO','BAJO'].map((l, i) => (
              <div key={l} className="row gap-6">
                <div style={{ width: 10, height: 10, background: CYCLE_COLOR[i], borderRadius: 2 }}/>
                <span style={{ color: 'var(--we-gray-mid)', letterSpacing: 1, fontWeight: 600 }}>{l}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 10 }}>
          {WEEK_DAYS.map((d, i) => {
            const isActive = i === activeDay;
            return (
              <div
                key={d}
                onClick={() => setActiveDay(i)}
                style={{
                  padding: 16,
                  background: isActive ? 'var(--we-carbon-2)' : 'var(--we-carbon-1)',
                  cursor: 'pointer',
                  borderRadius: 8,
                  border: '1px solid ' + (isActive ? CYCLE_COLOR[cycle[i]] : 'transparent'),
                  position: 'relative',
                  transition: 'all 0.15s',
                  boxShadow: isActive ? '0 0 0 3px rgba(255,69,0,0.08)' : 'none'
                }}
              >
                <div className="display" style={{ fontSize: 18, letterSpacing: 1 }}>{d}</div>
                <div style={{
                  fontSize: 9, letterSpacing: 1.5, fontWeight: 700,
                  color: CYCLE_COLOR[cycle[i]], marginTop: 6
                }}>
                  {CYCLE_SHORT[cycle[i]]}
                </div>
                <div style={{
                  position: 'absolute', bottom: 8, right: 8,
                  width: 6, height: 6, borderRadius: '50%', background: CYCLE_COLOR[cycle[i]]
                }}/>
                <button
                  onClick={(e) => { e.stopPropagation(); setCycle(c => c.map((v, j) => j === i ? (v + 1) % 3 : v)); }}
                  style={{
                    position: 'absolute', top: 8, right: 8,
                    background: 'transparent', color: 'var(--we-gray-mid)',
                    fontSize: 12, padding: 0
                  }}
                  title="Cambiar nivel"
                >↻</button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active day — meals with ingredients */}
      <div className="card-mod">
        <div className="row between mb-20">
          <div className="row gap-12" style={{ alignItems: 'center' }}>
            <div style={{
              padding: '6px 14px',
              background: CYCLE_COLOR[dayLevel],
              color: dayLevel === 1 ? '#111' : '#fff',
              fontFamily: 'var(--font-display)',
              fontSize: 12,
              letterSpacing: 2,
              borderRadius: 4,
              fontWeight: 700
            }}>
              {CYCLE_LABEL[dayLevel]}
            </div>
            <div className="display" style={{ fontSize: 28, letterSpacing: 1 }}>
              {WEEK_DAYS[activeDay]} · DÍA {activeDay + 1}
            </div>
          </div>
          <button className="btn btn-ghost btn-sm"><Icon name="copy" size={11}/> Duplicar día</button>
        </div>

        <div className="col gap-20">
          {meals.map((m, mi) => (
            <div key={m}>
              <div className="row between mb-12">
                <div className="row gap-12" style={{ alignItems: 'center' }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 4,
                    background: 'var(--we-orange-soft)',
                    color: 'var(--we-orange)',
                    display: 'grid', placeItems: 'center',
                    fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14
                  }}>{mi + 1}</div>
                  <div>
                    <div className="display" style={{ fontSize: 16, letterSpacing: 1.5 }}>{mealLabels[mi]}</div>
                    <div className="text-xs text-mid" style={{ marginTop: 2 }}>{mealTimes[mi]} · Escoge 1 de las 3 opciones</div>
                  </div>
                </div>
                <button className="btn btn-ghost btn-sm"><Icon name="plus" size={11}/> Opción</button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                {MEAL_DB[m][dayLevel].map((opt, oi) => {
                  const isActive = getOption(activeDay, m) === oi;
                  const expandKey = `${activeDay}-${m}-${oi}`;
                  const isExpanded = expanded[expandKey] !== false; // default expanded
                  return (
                    <div
                      key={oi}
                      onClick={() => setOption(activeDay, m, oi)}
                      style={{
                        padding: 16,
                        background: isActive ? 'rgba(255,69,0,0.08)' : 'var(--we-carbon-1)',
                        borderRadius: 8,
                        border: '1px solid ' + (isActive ? 'var(--we-orange)' : 'var(--we-carbon-2)'),
                        cursor: 'pointer',
                        position: 'relative',
                        transition: 'all 0.15s',
                        display: 'flex',
                        flexDirection: 'column',
                        boxShadow: isActive ? '0 4px 16px rgba(255,69,0,0.15)' : 'none'
                      }}
                    >
                      <div className="row between mb-10">
                        <div style={{
                          padding: '3px 8px',
                          fontSize: 9, fontWeight: 700, letterSpacing: 1.5,
                          background: isActive ? 'var(--we-orange)' : 'transparent',
                          color: isActive ? '#fff' : 'var(--we-gray-mid)',
                          border: '1px solid ' + (isActive ? 'var(--we-orange)' : 'var(--we-carbon-3)'),
                          borderRadius: 2
                        }}>OPCIÓN {oi + 1}</div>
                        <div style={{
                          width: 18, height: 18, borderRadius: '50%',
                          border: '1.5px solid ' + (isActive ? 'var(--we-orange)' : 'var(--we-carbon-3)'),
                          background: isActive ? 'var(--we-orange)' : 'transparent',
                          display: 'grid', placeItems: 'center'
                        }}>
                          {isActive && <Icon name="check" size={11} stroke={3}/>}
                        </div>
                      </div>

                      <div style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.4, marginBottom: 12, color: '#fff' }}>
                        {opt.name}
                      </div>

                      {/* Ingredients list */}
                      <div className="col gap-6" style={{ marginBottom: 12, flex: 1 }}>
                        {opt.ingredients.map((ing, ii) => (
                          <div key={ii} style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr auto',
                            gap: 8,
                            alignItems: 'baseline',
                            paddingBottom: 6,
                            borderBottom: ii < opt.ingredients.length - 1 ? '1px dashed var(--we-carbon-2)' : 'none'
                          }}>
                            <div style={{ fontSize: 11.5, lineHeight: 1.3, color: '#E5E5E5' }}>{ing.food}</div>
                            <div style={{ textAlign: 'right' }}>
                              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--we-orange)', letterSpacing: 0.3 }}>{ing.amount}</div>
                              <div style={{ fontSize: 9.5, color: 'var(--we-gray-mid)' }}>{ing.portion}</div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Macros footer */}
                      <div style={{
                        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
                        gap: 4, padding: '10px 0 0',
                        borderTop: '1px solid var(--we-carbon-2)'
                      }}>
                        {[
                          ['P', opt.p + 'g'],
                          ['C', opt.c + 'g'],
                          ['G', opt.f + 'g'],
                          ['kcal', opt.p*4 + opt.c*4 + opt.f*9]
                        ].map(([l, v], i) => (
                          <div key={l} style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: 8, letterSpacing: 1.5, color: 'var(--we-gray-mid)', fontWeight: 600 }}>{l}</div>
                            <div style={{ fontSize: 12, fontWeight: 700, color: l === 'kcal' ? 'var(--we-orange)' : '#fff', marginTop: 2 }}>{v}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Notes & reminders */}
        <div style={{
          marginTop: 22,
          padding: 18,
          background: 'var(--we-carbon-1)',
          borderRadius: 8,
          borderLeft: '3px solid var(--we-orange)'
        }}>
          <div className="row between mb-10">
            <div className="card-title-mod">RECORDATORIOS DEL COACH</div>
            <button className="btn btn-ghost btn-sm"><Icon name="edit" size={11}/></button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
            {[
              ['Hidratación', '2.5 L', 'mínimo de agua'],
              ['Café', 'hasta 2', 'tazas sin azúcar'],
              ['Whey post-entreno', '30 g', '1 scoop'],
              ['Omega 3', '2 cápsulas', 'con almuerzo'],
            ].map(([l, v, s], i) => (
              <div key={l}>
                <div className="text-xs uppercase" style={{ letterSpacing: 1.5, color: 'var(--we-gray-mid)', fontWeight: 600 }}>{l}</div>
                <div className="display" style={{ fontSize: 18, color: 'var(--we-orange)', marginTop: 4 }}>{v}</div>
                <div className="text-xs text-mid mt-2">{s}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

window.PlanNutricionalView = PlanNutricionalView;
