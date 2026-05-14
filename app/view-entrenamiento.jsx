// Plan de Entrenamiento — biblioteca de ejercicios + plantilla editable
const EXERCISES = [
  { id: 1, name: 'Sentadilla con barra', muscle: 'Pierna', equip: 'Barra', level: 'Intermedio' },
  { id: 2, name: 'Sentadilla búlgara', muscle: 'Pierna', equip: 'Mancuernas', level: 'Intermedio' },
  { id: 3, name: 'Prensa 45°', muscle: 'Pierna', equip: 'Máquina', level: 'Principiante' },
  { id: 4, name: 'Peso muerto rumano', muscle: 'Pierna', equip: 'Barra', level: 'Intermedio' },
  { id: 5, name: 'Hip thrust', muscle: 'Glúteo', equip: 'Barra', level: 'Intermedio' },
  { id: 6, name: 'Patada de glúteo en máquina', muscle: 'Glúteo', equip: 'Máquina', level: 'Principiante' },
  { id: 7, name: 'Sentadilla goblet', muscle: 'Pierna', equip: 'Mancuerna', level: 'Principiante' },
  { id: 8, name: 'Press banca plano', muscle: 'Pecho', equip: 'Barra', level: 'Intermedio' },
  { id: 9, name: 'Press inclinado con mancuernas', muscle: 'Pecho', equip: 'Mancuernas', level: 'Intermedio' },
  { id: 10, name: 'Fondos en paralelas', muscle: 'Pecho', equip: 'Peso corporal', level: 'Avanzado' },
  { id: 11, name: 'Cruce de poleas', muscle: 'Pecho', equip: 'Poleas', level: 'Principiante' },
  { id: 12, name: 'Remo con barra', muscle: 'Espalda', equip: 'Barra', level: 'Intermedio' },
  { id: 13, name: 'Jalón al pecho', muscle: 'Espalda', equip: 'Polea', level: 'Principiante' },
  { id: 14, name: 'Dominadas', muscle: 'Espalda', equip: 'Peso corporal', level: 'Avanzado' },
  { id: 15, name: 'Remo unilateral', muscle: 'Espalda', equip: 'Mancuerna', level: 'Intermedio' },
  { id: 16, name: 'Press militar', muscle: 'Hombro', equip: 'Barra', level: 'Intermedio' },
  { id: 17, name: 'Elevaciones laterales', muscle: 'Hombro', equip: 'Mancuernas', level: 'Principiante' },
  { id: 18, name: 'Press Arnold', muscle: 'Hombro', equip: 'Mancuernas', level: 'Intermedio' },
  { id: 19, name: 'Curl bíceps con barra Z', muscle: 'Brazo', equip: 'Barra Z', level: 'Principiante' },
  { id: 20, name: 'Curl martillo', muscle: 'Brazo', equip: 'Mancuernas', level: 'Principiante' },
  { id: 21, name: 'Press francés', muscle: 'Brazo', equip: 'Barra Z', level: 'Intermedio' },
  { id: 22, name: 'Extensión de tríceps en polea', muscle: 'Brazo', equip: 'Polea', level: 'Principiante' },
  { id: 23, name: 'Plancha abdominal', muscle: 'Core', equip: 'Peso corporal', level: 'Principiante' },
  { id: 24, name: 'Crunch en máquina', muscle: 'Core', equip: 'Máquina', level: 'Principiante' },
  { id: 25, name: 'Russian twist con peso', muscle: 'Core', equip: 'Disco', level: 'Intermedio' },
  { id: 26, name: 'Mountain climbers', muscle: 'Core', equip: 'Peso corporal', level: 'Principiante' },
  { id: 27, name: 'Burpees', muscle: 'Full body', equip: 'Peso corporal', level: 'Intermedio' },
  { id: 28, name: 'Saltos al cajón', muscle: 'Pierna', equip: 'Cajón', level: 'Intermedio' },
  { id: 29, name: 'Step-up con mancuernas', muscle: 'Pierna', equip: 'Mancuernas', level: 'Principiante' },
  { id: 30, name: 'Caminata en cinta inclinada', muscle: 'Cardio', equip: 'Cinta', level: 'Principiante' },
];

const MUSCLE_GROUPS = ['Todos', 'Pierna', 'Glúteo', 'Pecho', 'Espalda', 'Hombro', 'Brazo', 'Core', 'Cardio', 'Full body'];

function PlanEntrenamientoView({ mini }) {
  const [activeDay, setActiveDay] = useState('LUN');
  const [search, setSearch] = useState('');
  const [muscleFilter, setMuscleFilter] = useState('Todos');
  const [showLibrary, setShowLibrary] = useState(true);

  // Routine: { LUN: { name, ejercicios: [{id, sets, reps, rest, weight, notes}] }, ... }
  const [routine, setRoutine] = useState({
    LUN: { name: 'Pierna + Glúteo', ejercicios: [
      { id: 1, sets: 4, reps: '12-10-8-6', rest: '90s', weight: 'Progresivo', notes: 'Calentar bien con peso ligero' },
      { id: 5, sets: 4, reps: '12', rest: '75s', weight: '40kg', notes: 'Apretar arriba 1 seg' },
      { id: 2, sets: 3, reps: '12 c/u', rest: '60s', weight: '12kg', notes: '' },
      { id: 6, sets: 3, reps: '15', rest: '45s', weight: 'Máquina #5', notes: '' },
    ]},
    MAR: { name: 'Pecho + Brazo', ejercicios: [
      { id: 8, sets: 4, reps: '10-8-8-6', rest: '90s', weight: 'Progresivo', notes: '' },
      { id: 9, sets: 3, reps: '10', rest: '75s', weight: '12kg', notes: 'Banco a 30°' },
      { id: 19, sets: 3, reps: '12', rest: '45s', weight: '15kg', notes: '' },
    ]},
    MIÉ: { name: 'Cardio + Core', ejercicios: [
      { id: 30, sets: 1, reps: '30 min', rest: '-', weight: 'Inclinación 8', notes: '' },
      { id: 23, sets: 3, reps: '45s', rest: '30s', weight: 'Peso corporal', notes: '' },
      { id: 25, sets: 3, reps: '20', rest: '45s', weight: '5kg', notes: '' },
    ]},
    JUE: { name: 'Espalda + Hombro', ejercicios: [
      { id: 13, sets: 4, reps: '12', rest: '75s', weight: 'Progresivo', notes: '' },
      { id: 15, sets: 3, reps: '12 c/u', rest: '60s', weight: '12kg', notes: '' },
      { id: 17, sets: 4, reps: '15', rest: '45s', weight: '5kg', notes: 'Forma estricta' },
    ]},
    VIE: { name: 'Pierna pesada', ejercicios: [
      { id: 1, sets: 5, reps: '8-6-6-4-4', rest: '120s', weight: 'Progresivo', notes: 'Día de fuerza' },
      { id: 3, sets: 4, reps: '12', rest: '90s', weight: 'Máquina', notes: '' },
      { id: 4, sets: 4, reps: '10', rest: '90s', weight: 'Progresivo', notes: '' },
    ]},
    SÁB: { name: 'Cardio LISS', ejercicios: [
      { id: 30, sets: 1, reps: '45 min', rest: '-', weight: 'Zona 2', notes: '' },
    ]},
    DOM: { name: 'Descanso', ejercicios: [] },
  });

  const exById = id => EXERCISES.find(e => e.id === id);

  const filtered = useMemo(() => {
    return EXERCISES.filter(e =>
      (muscleFilter === 'Todos' || e.muscle === muscleFilter) &&
      (search === '' || e.name.toLowerCase().includes(search.toLowerCase()))
    );
  }, [search, muscleFilter]);

  const addExercise = (exId) => {
    setRoutine(r => ({
      ...r,
      [activeDay]: {
        ...r[activeDay],
        ejercicios: [...r[activeDay].ejercicios, {
          id: exId, sets: 3, reps: '12', rest: '60s', weight: '', notes: ''
        }]
      }
    }));
  };

  const removeExercise = (idx) => {
    setRoutine(r => ({
      ...r,
      [activeDay]: { ...r[activeDay], ejercicios: r[activeDay].ejercicios.filter((_, i) => i !== idx) }
    }));
  };

  const moveExercise = (idx, dir) => {
    setRoutine(r => {
      const list = [...r[activeDay].ejercicios];
      const ni = idx + dir;
      if (ni < 0 || ni >= list.length) return r;
      [list[idx], list[ni]] = [list[ni], list[idx]];
      return { ...r, [activeDay]: { ...r[activeDay], ejercicios: list } };
    });
  };

  const updateField = (idx, field, value) => {
    setRoutine(r => {
      const list = [...r[activeDay].ejercicios];
      list[idx] = { ...list[idx], [field]: value };
      return { ...r, [activeDay]: { ...r[activeDay], ejercicios: list } };
    });
  };

  const dayData = routine[activeDay];

  return (
    <div className={mini ? '' : 'content'}>
      {!mini && (
        <div className="row between mb-20">
          <div>
            <div className="row gap-8 text-xs text-mid mb-6">
              <span>Asesorados</span><Icon name="chevronRight" size={10}/>
              <span>Yarisbel Pichardo</span><Icon name="chevronRight" size={10}/>
              <span style={{ color: '#fff' }}>Plan de Entrenamiento</span>
            </div>
            <div className="display" style={{ fontSize: 26, letterSpacing: 1 }}>
              PLAN DE ENTRENAMIENTO <span style={{ color: 'var(--we-orange)' }}>· SEMANA 1</span>
            </div>
            <div className="text-sm text-mid mt-4">6 días entreno · 1 descanso · diseñado por ti, paso a paso</div>
          </div>
          <div className="row gap-8">
            <button className="btn btn-ghost btn-sm" onClick={() => setShowLibrary(!showLibrary)}>
              {showLibrary ? 'Ocultar biblioteca' : 'Mostrar biblioteca'}
            </button>
            <button className="btn btn-ghost btn-sm"><Icon name="copy" size={12}/> Duplicar semana</button>
            <button className="btn btn-primary"><Icon name="download" size={13}/> Exportar PDF</button>
          </div>
        </div>
      )}

      {/* Day tabs */}
      <div className="row gap-4 mb-16" style={{ background: 'var(--we-carbon)', padding: 4, display: 'inline-flex' }}>
        {WEEK_DAYS.map(d => (
          <button
            key={d}
            onClick={() => setActiveDay(d)}
            style={{
              padding: '10px 20px',
              background: activeDay === d ? 'var(--we-orange)' : 'transparent',
              color: activeDay === d ? '#fff' : 'var(--we-gray-mid)',
              fontFamily: 'var(--font-display)',
              fontSize: 14,
              fontWeight: 600,
              letterSpacing: 1.5,
              borderBottom: '2px solid ' + (routine[d].ejercicios.length === 0 ? 'transparent' : (activeDay === d ? '#fff' : 'var(--we-orange)'))
            }}
          >
            {d}
            <div style={{ fontSize: 9, opacity: 0.7, marginTop: 2, letterSpacing: 0.5 }}>
              {routine[d].ejercicios.length === 0 ? 'descanso' : routine[d].ejercicios.length + ' ejer.'}
            </div>
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: showLibrary ? '1.5fr 1fr' : '1fr', gap: 18 }}>
        {/* Routine editor */}
        <div className="card">
          <div className="row between mb-16">
            <div className="row gap-12" style={{ alignItems: 'center' }}>
              <div className="display" style={{ fontSize: 22, letterSpacing: 1, color: 'var(--we-orange)' }}>
                {activeDay}
              </div>
              <input
                className="input"
                style={{ fontSize: 16, fontWeight: 600, background: 'transparent', border: 'none', maxWidth: 300 }}
                value={dayData.name}
                onChange={e => setRoutine(r => ({ ...r, [activeDay]: { ...r[activeDay], name: e.target.value } }))}
              />
            </div>
            <div className="row gap-8">
              <span className="tag">{dayData.ejercicios.length} ejercicios</span>
              <span className="tag orange">~{dayData.ejercicios.reduce((a, e) => a + e.sets * 1.5, 0).toFixed(0)} min</span>
            </div>
          </div>

          {dayData.ejercicios.length === 0 ? (
            <div style={{ padding: 60, textAlign: 'center', background: 'var(--we-black)' }}>
              <Icon name="dumbbell" size={32}/>
              <div className="display mt-12" style={{ fontSize: 16, letterSpacing: 1 }}>DÍA DE DESCANSO</div>
              <div className="text-sm text-mid mt-4">O arrastra ejercicios desde la biblioteca</div>
            </div>
          ) : (
            <div className="col gap-10">
              {dayData.ejercicios.map((ex, i) => {
                const exDef = exById(ex.id);
                return (
                  <div key={i} style={{
                    padding: 14,
                    background: 'var(--we-black)',
                    borderLeft: '3px solid var(--we-orange)',
                    position: 'relative'
                  }}>
                    <div className="row between mb-10">
                      <div className="row gap-10">
                        <div className="display" style={{
                          width: 28, height: 28, background: 'var(--we-orange)',
                          color: '#fff', display: 'grid', placeItems: 'center', fontSize: 13
                        }}>{i + 1}</div>
                        <div>
                          <div style={{ fontWeight: 600 }}>{exDef?.name}</div>
                          <div className="text-xs text-mid">{exDef?.muscle} · {exDef?.equip}</div>
                        </div>
                      </div>
                      <div className="row gap-4">
                        <button className="btn btn-ghost btn-sm" style={{ padding: '4px 6px' }} onClick={() => moveExercise(i, -1)}>
                          <Icon name="arrowUp" size={11}/>
                        </button>
                        <button className="btn btn-ghost btn-sm" style={{ padding: '4px 6px' }} onClick={() => moveExercise(i, 1)}>
                          <Icon name="arrowDown" size={11}/>
                        </button>
                        <button className="btn btn-ghost btn-sm" style={{ padding: '4px 6px' }}>
                          <Icon name="fork" size={11}/>
                        </button>
                        <button className="btn btn-ghost btn-sm" style={{ padding: '4px 6px' }} onClick={() => removeExercise(i)}>
                          <Icon name="x" size={11}/>
                        </button>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr) 1.4fr', gap: 8 }}>
                      <div>
                        <div className="field-label">Series</div>
                        <input className="input" value={ex.sets} onChange={e => updateField(i, 'sets', e.target.value)} />
                      </div>
                      <div>
                        <div className="field-label">Reps</div>
                        <input className="input" value={ex.reps} onChange={e => updateField(i, 'reps', e.target.value)} />
                      </div>
                      <div>
                        <div className="field-label">Descanso</div>
                        <input className="input" value={ex.rest} onChange={e => updateField(i, 'rest', e.target.value)} />
                      </div>
                      <div>
                        <div className="field-label">Peso</div>
                        <input className="input" value={ex.weight} onChange={e => updateField(i, 'weight', e.target.value)} />
                      </div>
                      <div>
                        <div className="field-label">Notas</div>
                        <input className="input" placeholder="Tempo, técnica..." value={ex.notes} onChange={e => updateField(i, 'notes', e.target.value)} />
                      </div>
                    </div>
                  </div>
                );
              })}
              <button className="btn btn-ghost mt-8" style={{ justifyContent: 'center', padding: 14 }}>
                <Icon name="plus" size={13}/> Agregar superset / circuito
              </button>
            </div>
          )}
        </div>

        {/* Library */}
        {showLibrary && (
          <div className="card" style={{ padding: 0, display: 'flex', flexDirection: 'column', maxHeight: 'calc(100vh - 220px)' }}>
            <div style={{ padding: 20, borderBottom: '1px solid var(--we-carbon-2)' }}>
              <div className="card-title mb-4">BIBLIOTECA DE EJERCICIOS</div>
              <div className="card-subtitle">{filtered.length} de {EXERCISES.length} · click para agregar</div>

              <div className="topbar-search mt-12" style={{ background: 'var(--we-black)', padding: '8px 10px 8px 34px' }}>
                <Icon name="search" size={13}/>
                <input placeholder="Buscar ejercicio..." value={search} onChange={e => setSearch(e.target.value)} />
              </div>

              <div className="row gap-4 mt-10" style={{ flexWrap: 'wrap' }}>
                {MUSCLE_GROUPS.map(m => (
                  <button key={m}
                    onClick={() => setMuscleFilter(m)}
                    style={{
                      fontSize: 10,
                      fontWeight: 600,
                      letterSpacing: 1,
                      textTransform: 'uppercase',
                      padding: '4px 8px',
                      background: muscleFilter === m ? 'var(--we-orange)' : 'var(--we-black)',
                      color: muscleFilter === m ? '#fff' : 'var(--we-gray-mid)',
                      border: '1px solid ' + (muscleFilter === m ? 'var(--we-orange)' : 'var(--we-carbon-2)')
                    }}
                  >{m}</button>
                ))}
              </div>
            </div>

            <div className="scrollable" style={{ flex: 1, padding: 12 }}>
              {filtered.map(ex => (
                <div
                  key={ex.id}
                  onClick={() => addExercise(ex.id)}
                  style={{
                    padding: '10px 12px',
                    background: 'var(--we-black)',
                    marginBottom: 6,
                    cursor: 'pointer',
                    borderLeft: '3px solid transparent',
                    transition: 'all 0.12s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderLeftColor = 'var(--we-orange)'}
                  onMouseLeave={e => e.currentTarget.style.borderLeftColor = 'transparent'}
                >
                  <div className="flex-1">
                    <div style={{ fontSize: 12, fontWeight: 600 }}>{ex.name}</div>
                    <div className="row gap-6 mt-4">
                      <span className="tag">{ex.muscle}</span>
                      <span className="text-xs text-low">{ex.equip} · {ex.level}</span>
                    </div>
                  </div>
                  <div className="btn btn-primary btn-sm" style={{ padding: '4px 8px' }}>
                    <Icon name="plus" size={11}/>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ padding: 12, borderTop: '1px solid var(--we-carbon-2)', textAlign: 'center' }}>
              <button className="btn btn-ghost btn-sm" style={{ width: '100%', justifyContent: 'center' }}>
                <Icon name="plus" size={12}/> Crear ejercicio personalizado
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

window.PlanEntrenamientoView = PlanEntrenamientoView;
window.EXERCISES = EXERCISES;
