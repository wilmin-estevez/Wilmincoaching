# WE System v4 — Spec de diseño

**Fecha:** 2026-05-14  
**Coach:** Wilmin Estévez · @wilmin_estevez · Fitness Coach · RD  
**Objetivo:** Reconstruir el sistema de coaching desde cero con stack moderno, IA para generación de planes, y migración completa de datos v3.

---

## 1. Stack tecnológico

| Capa | Tecnología | Notas |
|---|---|---|
| Frontend + API | Next.js 14 (App Router) + TypeScript | Hosted en Vercel |
| Base de datos | Supabase (PostgreSQL) | Free tier — 500 MB |
| Auth | Supabase Auth | Solo el coach hace login |
| IA | Claude API (`claude-sonnet-4-6`) | Server-side, key nunca expuesta |
| Estilos | Tailwind CSS + shadcn/ui (tema WE) | Design tokens naranja #FF4500 |
| PDF | `@react-pdf/renderer` | Generado server-side |
| Storage | Supabase Storage | Fotos de clientes, PDFs cacheados |
| Deploy | Vercel (CI/CD en push a main) | Dominio: wesystem.wilminestevezcoaching.com |

**Costo estimado:** $0/mes en free tier. Escala a ~$20/mes con 200+ clientes activos.

---

## 2. Brand system (Dark Pro)

```
--we-orange:      #FF4500   (acento principal, CTAs, barra vertical)
--we-orange-dark: #CC3700   (hover)
--we-orange-soft: rgba(255,69,0,0.10)  (fondos activos)
--we-black:       #0B0B0B   (background app)
--we-carbon:      #141414   (cards)
--we-carbon-1:    #181818   (nested)
--we-carbon-2:    #232323   (bordes, dividers)
--we-carbon-3:    #2E2E2E   (bordes fuertes)
--we-white:       #F5F5F5   (texto primario)
--we-gray-mid:    #8E8E8E   (texto secundario)
--we-success:     #22C55E
--we-warn:        #F59E0B
--we-danger:      #EF4444

Fuentes: Oswald 700 (display) + Open Sans 400/600 (body)
Barra naranja vertical 4px: firma de marca en sidebar, heroes, PDF
Logo WE: tile naranja 40px, Oswald 700 blanco, border-radius 6px
```

---

## 3. Base de datos — Esquema Supabase

### `clients`
```sql
id              uuid PRIMARY KEY DEFAULT gen_random_uuid()
name            text NOT NULL
email           text
whatsapp        text
age             int
weight_kg       numeric
height_m        numeric
goal_weight_kg  numeric
goal            text          -- 'lose_fat' | 'gain_muscle' | 'habits' | 'performance'
timeline        text
experience      text          -- 'beginner' | 'intermediate' | 'advanced'
training_days   int           -- 2 | 3 | 4 | 5+
gym_access      text
dietary_restrictions text
injuries        text
status          text DEFAULT 'active'  -- 'active' | 'renew' | 'expired' | 'new'
plan_type       text          -- 'basic' | 'pro' | 'vip'
monthly_fee     numeric
joined_at       timestamptz DEFAULT now()
plan_expires_at timestamptz
notes           text
v3_id           text          -- ID original de sync.json para migración
```

### `nutrition_plans`
```sql
id              uuid PRIMARY KEY DEFAULT gen_random_uuid()
client_id       uuid REFERENCES clients(id)
week_start      date
kcal_target     int
protein_g       int
carbs_high_g    int           -- carbs en día ALTO
carbs_mid_g     int           -- carbs en día MEDIO
carbs_low_g     int           -- carbs en día BAJO
fat_g           int
cycle           int[7]        -- [0,1,2,0,1,2,2] → 0=ALTO, 1=MEDIO, 2=BAJO
meals           jsonb         -- estructura detallada abajo
status          text DEFAULT 'draft'  -- 'draft' | 'sent'
public_slug     text UNIQUE   -- token para link público
created_at      timestamptz DEFAULT now()
```

**Estructura `meals` (jsonb):**
```json
{
  "lunes": {
    "cycle_level": 0,
    "desayuno": {
      "time": "7:00am",
      "options": [
        {
          "name": "Avena con claras y fruta",
          "ingredients": [
            { "food": "Avena en hojuelas", "amount_g": 80, "unit": "1 taza" },
            { "food": "Claras de huevo",   "amount_g": 200, "unit": "5 claras" },
            { "food": "Banano",            "amount_g": 120, "unit": "1 mediano" }
          ],
          "protein_g": 38, "carbs_g": 72, "fat_g": 4, "kcal": 468
        },
        { ... },  // opción 2
        { ... }   // opción 3
      ]
    },
    "merienda": { ... },
    "almuerzo": { ... },
    "cena":     { ... }
  },
  "martes": { ... },
  ...
}
```

> **4 comidas por día:** desayuno · merienda · almuerzo · cena  
> **3 opciones por comida** con ingredientes completos (gramos + unidad)  
> **Las 3 opciones van al PDF y al link público** — el cliente elige la que quiere cada día

### `training_plans`
```sql
id              uuid PRIMARY KEY DEFAULT gen_random_uuid()
client_id       uuid REFERENCES clients(id)
week_start      date
days            jsonb         -- estructura abajo
status          text DEFAULT 'draft'
public_slug     text UNIQUE
created_at      timestamptz DEFAULT now()
```

**Estructura `days` (jsonb):**
```json
{
  "lunes": {
    "name": "Pierna y Glúteo",
    "exercises": [
      {
        "name": "Sentadilla con barra",
        "muscle": "Pierna · Glúteo · Core",
        "equipment": "Barra olímpica",
        "sets": 4, "reps": "12", "rest_s": 90, "weight": "60kg",
        "gif_url": "https://...",
        "notes": ""
      }
    ]
  },
  "martes": { ... },
  ...
}
```

### `payments`
```sql
id          uuid PRIMARY KEY DEFAULT gen_random_uuid()
client_id   uuid REFERENCES clients(id)
amount      numeric
method      text    -- 'Banreservas' | 'Popular' | 'Wise' | 'Cash'
status      text    -- 'paid' | 'pending' | 'overdue'
due_date    date
paid_at     timestamptz
notes       text
created_at  timestamptz DEFAULT now()
```

### `form_submissions`
```sql
id          uuid PRIMARY KEY DEFAULT gen_random_uuid()
raw_data    jsonb         -- datos crudos del Google Form
status      text DEFAULT 'new'  -- 'new' | 'converted'
client_id   uuid REFERENCES clients(id)  -- null hasta que se convierte
created_at  timestamptz DEFAULT now()
```

---

## 4. Integración Google Forms

**Formulario existente:** https://docs.google.com/forms/d/e/1FAIpQLSfSU56OB0fuEQ5h3srsgiI3_OfF6aKxVBU5DekbYT0YifogFg/viewform

**Campos del formulario (21 campos):** nombre, edad, email, WhatsApp, peso/altura, objetivo, timeline, situación actual, hábitos alimenticios, frecuencia comidas, proteína consciente, restricciones, agua, comida rápida/alcohol, disposición plan, experiencia entreno, días disponibles, acceso gym, condiciones médicas, por qué Wilmin, disposición inversión.

**Flujo de integración:**
1. Google Form guarda respuesta en Google Sheets (automático)
2. Apps Script instalado en el Sheet detecta nueva fila (trigger `onFormSubmit`)
3. Script hace `POST` a `/api/form-submission` con los datos en JSON
4. API valida el secret header y guarda en `form_submissions`
5. En el dashboard aparece el card "✦ Nuevos formularios" con botón "GENERAR PLAN"

**Apps Script** (se instala una vez en el Google Sheet de Wilmin):
```js
function onFormSubmit(e) {
  const data = {};
  e.namedValues; // mapea columnas a campos
  UrlFetchApp.fetch('https://wesystem.vercel.app/api/form-submission', {
    method: 'POST',
    headers: { 'x-we-secret': '<SECRET>', 'Content-Type': 'application/json' },
    payload: JSON.stringify(data)
  });
}
```

---

## 5. Pantallas del dashboard (solo coach)

### 5.1 Dashboard
- **Hero strip** con barra naranja izquierda: fecha, saludo "BUEN DÍA, WILMIN.", resumen, botones "GENERAR PLAN" y "VER AGENDA"
- **KPI grid (4 cards):** Activos · Ingresos del mes · Por renovar · Nuevos formularios hoy
- **2 columnas:** Agenda del día (check-ins con hora + adherencia) | Nuevos formularios (nombre + objetivo + botón GENERAR)
- Click en formulario → navega al perfil del cliente pre-llenado con sus datos

### 5.2 Asesorados
- Lista de clientes reales (de Supabase, migrados de v3)
- Filtros: Todos / Activo / Por renovar / Vencido / Nuevo
- Búsqueda por nombre
- Columnas: Nombre · Objetivo · Peso actual → meta · Días restantes · Pago · Estado
- Click en fila → Perfil completo

### 5.3 Perfil del asesorado
- Hero con nombre (Oswald 32px), datos personales, tags de estado/plan/pago
- **Tabs:** Resumen · Nutrición · Entrenamiento · Pagos · Notas
- **Resumen:** Gráfica de peso, medidas, datos del formulario
- **Nutrición:** Generador de plan (ver §5.4)
- **Entrenamiento:** Builder de rutina (ver §5.5)
- **Pagos:** Historial + registrar nuevo pago
- **Notas:** Textarea + lista de notas con fecha

### 5.4 Generador Plan Nutricional (dentro del perfil)
**Flujo:**
1. Datos del cliente visibles (peso, objetivo, restricciones, días de entreno)
2. Objetivos de macros pre-calculados (ajustables por Wilmin)
3. Strip de 7 días con nivel carb cycling (ALTO/MEDIO/BAJO) — rotable con click
4. Botón **"GENERAR PLAN CON IA"** → spinner ~15 segundos → plan aparece
5. Editor de plan:
   - 4 comidas por día: Desayuno · Merienda · Almuerzo · Cena
   - Cada comida muestra **3 opciones en cards lado a lado**
   - Cada opción: nombre de comida + lista de ingredientes con gramos + unidad + macros footer
   - Wilmin puede editar cualquier campo inline
6. Botón **"GENERAR PDF + LINK"** → crea PDF + token público

**Prompt de IA (Claude API):**
```
Eres el asistente nutricional de Wilmin Estévez, fitness coach en RD.
Cliente: {nombre}, {edad} años, {peso}kg / {altura}m, meta {peso_meta}kg.
Objetivo: {objetivo}. Restricciones: {restricciones}.
Días de entrenamiento: {dias}/semana. Experiencia: {experiencia}.
Macros objetivo: {kcal}kcal · {prot}g proteína · {carbs}g carbs · {grasa}g grasa.

Genera un plan nutricional de carb cycling para 7 días con:
- 4 comidas: Desayuno (7am) · Merienda (10:30am) · Almuerzo (1pm) · Cena (7pm)
- 3 opciones por cada comida
- Cada opción con ingredientes detallados: nombre del alimento, gramos exactos, unidad equivalente (tazas, unidades, cdas)
- Macros y kcal totales por opción
- Ciclo de carbos: días de entreno = ALTO o MEDIO, días de descanso = BAJO
- Alimentos accesibles en República Dominicana
- Responde SOLO en JSON siguiendo el esquema proporcionado.
```

### 5.5 Builder Plan de Entrenamiento (dentro del perfil)
1. Botón **"GENERAR RUTINA CON IA"** basado en días disponibles, equipo, experiencia
2. Editor por día de semana (LUN-DOM)
3. Cada ejercicio: nombre + músculo + GIF animado + series · reps · descanso · peso
4. Edición inline de todos los campos
5. Biblioteca de ejercicios: búsqueda + filtro por músculo → agregar con click
6. **GIFs:** Base de datos propia de ~80 ejercicios comunes pre-cargada con URLs de GIFs de Muscle Wiki (musclewiki.com — gratuito, sin API key). La IA genera el nombre del ejercicio, se busca por nombre en la tabla local `exercises`. Wilmin puede agregar ejercicios personalizados con URL de YouTube o GIF propio.

### 5.6 PDF + Link público
**PDF (react-pdf/renderer):**
- Página 1 — Portada: branding WE, nombre del cliente, fecha, objetivo
- Página 2 — Plan nutricional: para cada día, 4 comidas × 3 opciones con ingredientes (gramos + unidades)
- Página 3 — Plan de entrenamiento: días, ejercicios, series/reps/descanso/peso
- Footer en cada página: barra naranja izquierda + @wilmin_estevez + URL app
- Fuentes: Oswald + Open Sans embebidas

**Link público (`/plan/[slug]`):**
- Página mobile-first sin login
- Muestra plan nutricional y de entrenamiento
- Por cada comida: **las 3 opciones completas** con ingredientes, gramos, macros — el cliente elige la que quiera cada día
- Por cada ejercicio: GIF animado + series/reps/descanso
- Header con logo WE + nombre del cliente
- No editable, solo lectura

### 5.7 Cobros
- KPI row: Total proyectado · Cobrado · Pendiente · Vencidos
- Lista de clientes con estado de pago (Al día / Pendiente / Vencido)
- Registrar pago manual (monto, método, fecha)
- Alertas de vencimiento próximo

---

## 6. Migración de datos v3 → v4

**Fuente:** `data/sync.json` en GitHub (repo `wilmin-estevez/Wilmincoaching`)

**Script de migración** (`scripts/migrate-v3.ts`):
1. Descarga `sync.json` via GitHub API con el token existente
2. Mapea cada cliente al esquema `clients` de Supabase
3. Mapea pagos al esquema `payments`
4. Importa todo con `supabase.from('clients').insert(batch)`
5. Guarda `v3_id` en cada registro para trazabilidad
6. Genera reporte: N clientes importados, N pagos, N errores

**El script se corre UNA VEZ antes del go-live.** Wilmin verifica la lista antes de activar el sistema nuevo.

---

## 7. Autenticación

- Solo el coach (Wilmin) tiene login
- Supabase Auth con email + contraseña
- Ruta `/login` → redirecciona a `/dashboard` si auth OK
- Todas las rutas del dashboard protegidas con middleware Next.js
- El link público (`/plan/[slug]`) es público, sin auth

---

## 8. Rutas de la aplicación

```
/                     → redirect a /dashboard (si auth) o /login
/login                → formulario de acceso coach
/dashboard            → pantalla principal
/clients              → lista de asesorados
/clients/[id]         → perfil + tabs (resumen, nutrición, entreno, pagos, notas)
/clients/[id]/nutrition → generador plan nutricional
/clients/[id]/training  → builder plan entrenamiento
/cobros               → gestión de pagos
/plan/[slug]          → link público del cliente (sin auth, mobile-first)
/api/form-submission  → webhook de Google Apps Script (POST)
/api/generate-nutrition → genera plan con Claude API (POST, auth)
/api/generate-training  → genera rutina con Claude API (POST, auth)
/api/generate-pdf       → genera PDF (POST, auth)
```

---

## 9. Lo que NO incluye esta fase (Fase 2)

- Calendario de check-ins
- Sistema de mensajes/chat
- Fotos de progreso
- Notificaciones push
- App móvil nativa
- Multi-coach (solo Wilmin)

---

## 10. Decisiones de diseño clave

| Decisión | Elección | Razón |
|---|---|---|
| 3 opciones en PDF/link | Las 3 visibles | El cliente elige libremente cada día |
| Comidas por día | 4 (no 5) | Preferencia de Wilmin |
| Link público | Solo lectura, sin login | Clientes no tienen cuenta |
| GIFs de ejercicios | Giphy API (free) | Sin costo, librería enorme |
| Generación plan | Coach presiona botón → revisa → envía | Control total del coach |
| Costo IA | ~$0.03 por plan | Aceptable, Claude API separada del chat |
| Datos v3 | Migración completa antes del go-live | Sin pérdida de clientes |
