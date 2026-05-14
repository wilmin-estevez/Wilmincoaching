// Mock data for the coaching app
const FIRST_NAMES = ['María','José','Ana','Carlos','Laura','Pedro','Sofía','Luis','Carmen','Juan','Yarisbel','Elena','Miguel','Patricia','Roberto','Karla','Fernando','Daniela','Andrés','Valeria','Diego','Isabela','Jorge','Camila','Ricardo','Gabriela','Eduardo','Mariana','Pablo','Lucía','Felipe','Renata','Sebastián','Adriana','Ramón','Nicole','Iván','Paola','Héctor','Joselín','Stephanie','Yulissa','Geraldine','Anneris','Robert','Junior','Yelitza','Brayan'];
const LAST_NAMES = ['Pérez','García','Martínez','Rodríguez','Gómez','Fernández','López','Díaz','Sánchez','Cruz','Reyes','Núñez','Mejía','Pichardo','Vargas','Ramírez','Castro','Báez','Polanco','Almonte','Hernández','Jiménez','Tejada','Peralta','Henríquez','Ureña','De los Santos','Brito','Encarnación','Familia'];

const GOALS = ['Pérdida de peso','Ganancia muscular','Recomposición','Tonificación','Resistencia'];
const PLAN_TYPES = ['VIP 12 meses','Pro 6 meses','Básico 3 meses','Mensual','Anual'];
const STATUS = ['Activo','Por renovar','Vencido','Nuevo'];

function seededRandom(seed) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

const rnd = seededRandom(7);
const pick = arr => arr[Math.floor(rnd() * arr.length)];
const range = (a, b) => Math.floor(rnd() * (b - a + 1)) + a;

function genClient(i) {
  const fn = pick(FIRST_NAMES);
  const ln = pick(LAST_NAMES) + ' ' + pick(LAST_NAMES);
  const goal = pick(GOALS);
  const plan = pick(PLAN_TYPES);
  const startWeight = range(58, 110);
  const currentWeight = Math.max(50, startWeight - range(0, 18));
  const goalWeight = startWeight - range(8, 25);
  const adherence = range(35, 100);
  const dayInPlan = range(10, 240);
  const planLength = pick([90,180,365]);
  const daysLeft = Math.max(-15, planLength - dayInPlan);
  let status;
  if (daysLeft < 0) status = 'Vencido';
  else if (daysLeft <= 14) status = 'Por renovar';
  else if (dayInPlan < 14) status = 'Nuevo';
  else status = 'Activo';

  const initials = (fn[0] + ln[0]).toUpperCase();
  const lastCheckin = range(0, 14);
  const payment = pick(['Al día','Pendiente','Vencido']);

  return {
    id: i,
    name: fn + ' ' + ln,
    initials,
    age: range(19, 48),
    gender: rnd() > 0.4 ? 'F' : 'M',
    height: range(150, 188),
    startWeight,
    currentWeight,
    goalWeight,
    goal,
    plan,
    status,
    adherence,
    dayInPlan,
    planLength,
    daysLeft,
    lastCheckin,
    payment,
    monthly: pick([45,65,85,125,150,200]),
    location: pick(['Santo Domingo','Santiago','La Vega','Punta Cana','New York','Madrid','Miami','San Cristóbal']),
    joinedMonth: pick(['ENE','FEB','MAR','ABR','MAY','JUN','JUL','AGO','SEP','OCT','NOV','DIC']) + ' ' + pick(['2024','2025','2026']),
  };
}

const CLIENTS = Array.from({length: 200}, (_, i) => genClient(i));

// Featured client for the profile demo
const FEATURED = {
  ...CLIENTS[0],
  name: 'Yarisbel Pichardo',
  initials: 'YP',
  age: 29,
  gender: 'F',
  height: 168,
  startWeight: 86,
  currentWeight: 74.2,
  goalWeight: 65,
  goal: 'Pérdida de peso',
  plan: 'VIP 12 meses',
  status: 'Activo',
  adherence: 87,
  dayInPlan: 96,
  planLength: 365,
  daysLeft: 269,
  lastCheckin: 2,
  payment: 'Al día',
  monthly: 150,
  location: 'Santo Domingo',
  joinedMonth: 'FEB 2026',
  phone: '+1 829 555 0192',
  email: 'yarisbel.p@gmail.com',
  weightHistory: [86, 85.1, 84, 83.2, 82, 81.4, 80, 79.2, 78.5, 77.8, 76.9, 76, 75.2, 74.8, 74.2],
  measurements: { cintura: 78, cadera: 102, brazo: 28, muslo: 58, pecho: 92 },
  initialMeasurements: { cintura: 92, cadera: 110, brazo: 31, muslo: 64, pecho: 98 },
  energy: 8, sleep: 7, mood: 9,
};

window.WE_DATA = { CLIENTS, FEATURED, GOALS, PLAN_TYPES, STATUS };
