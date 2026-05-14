// Plan de Nutrición — Carb Cycling + 3 opciones × 5 comidas con ingredientes detallados
// Cada ingrediente: { food, amount, portion } — gramos/unidades + porción casera
const MEAL_DB = {
  desayuno: [
    [ // ALTO en carbos
      {
        name: 'Tortilla de claras + avena con frutas',
        ingredients: [
          { food: 'Claras de huevo', amount: '99 g', portion: '3 unidades' },
          { food: 'Huevo entero', amount: '50 g', portion: '1 unidad' },
          { food: 'Avena en hojuelas', amount: '50 g', portion: '½ taza' },
          { food: 'Plátano maduro', amount: '120 g', portion: '1 mediano' },
          { food: 'Canela', amount: '2 g', portion: '1 pizca' }
        ],
        p: 32, c: 65, f: 8
      },
      {
        name: 'Pancakes proteicos de avena y plátano',
        ingredients: [
          { food: 'Avena molida', amount: '60 g', portion: '⅔ taza' },
          { food: 'Plátano maduro', amount: '120 g', portion: '1 mediano' },
          { food: 'Whey vainilla', amount: '30 g', portion: '1 scoop' },
          { food: 'Claras de huevo', amount: '99 g', portion: '3 unidades' },
          { food: 'Miel pura', amount: '15 g', portion: '1 cdta' }
        ],
        p: 38, c: 72, f: 7
      },
      {
        name: 'Bowl griego con granola y arándanos',
        ingredients: [
          { food: 'Yogur griego 0% grasa', amount: '200 g', portion: '1 taza' },
          { food: 'Granola casera', amount: '50 g', portion: '⅓ taza' },
          { food: 'Arándanos', amount: '80 g', portion: '½ taza' },
          { food: 'Miel pura', amount: '10 g', portion: '1 cdta' }
        ],
        p: 26, c: 58, f: 9
      }
    ],
    [ // MEDIO
      {
        name: 'Tostada integral con aguacate y huevos',
        ingredients: [
          { food: 'Pan integral', amount: '60 g', portion: '2 rebanadas' },
          { food: 'Aguacate', amount: '70 g', portion: '½ unidad' },
          { food: 'Huevos pochados', amount: '100 g', portion: '2 unidades' },
          { food: 'Tomate', amount: '50 g', portion: '½ unidad' }
        ],
        p: 22, c: 30, f: 16
      },
      {
        name: 'Smoothie verde post entreno',
        ingredients: [
          { food: 'Espinaca fresca', amount: '40 g', portion: '1 puñado' },
          { food: 'Banano', amount: '100 g', portion: '1 unidad' },
          { food: 'Whey vainilla', amount: '30 g', portion: '1 scoop' },
          { food: 'Almendras', amount: '15 g', portion: '12 unidades' },
          { food: 'Leche de almendras', amount: '240 ml', portion: '1 taza' }
        ],
        p: 32, c: 32, f: 12
      },
      {
        name: 'Avena de noche con mantequilla de maní',
        ingredients: [
          { food: 'Avena en hojuelas', amount: '50 g', portion: '½ taza' },
          { food: 'Chía', amount: '10 g', portion: '1 cda' },
          { food: 'Mantequilla de maní natural', amount: '15 g', portion: '1 cda' },
          { food: 'Frutos rojos', amount: '80 g', portion: '½ taza' },
          { food: 'Leche descremada', amount: '200 ml', portion: '1 taza' }
        ],
        p: 24, c: 42, f: 13
      }
    ],
    [ // BAJO en carbos
      {
        name: 'Omelette de espinaca y queso fresco',
        ingredients: [
          { food: 'Huevos enteros', amount: '150 g', portion: '3 unidades' },
          { food: 'Espinaca fresca', amount: '40 g', portion: '1 puñado' },
          { food: 'Queso fresco', amount: '40 g', portion: '1 lonja' },
          { food: 'Aguacate', amount: '60 g', portion: '½ unidad' }
        ],
        p: 28, c: 8, f: 24
      },
      {
        name: 'Bowl keto de huevos y tocineta turkey',
        ingredients: [
          { food: 'Huevos revueltos', amount: '150 g', portion: '3 unidades' },
          { food: 'Tocineta de pavo', amount: '40 g', portion: '2 tiras' },
          { food: 'Aguacate', amount: '70 g', portion: '½ unidad' },
          { food: 'Tomate cherry', amount: '60 g', portion: '6 unidades' }
        ],
        p: 32, c: 6, f: 26
      },
      {
        name: 'Yogur griego con nueces y chía',
        ingredients: [
          { food: 'Yogur griego full grasa', amount: '200 g', portion: '1 taza' },
          { food: 'Nueces', amount: '20 g', portion: '6 unidades' },
          { food: 'Chía', amount: '10 g', portion: '1 cda' },
          { food: 'Canela', amount: '2 g', portion: '1 pizca' }
        ],
        p: 26, c: 10, f: 22
      }
    ]
  ],
  media_manana: [
    [
      {
        name: 'Manzana con maní y pavo',
        ingredients: [
          { food: 'Manzana roja', amount: '150 g', portion: '1 unidad' },
          { food: 'Maní natural', amount: '20 g', portion: '1 puñado' },
          { food: 'Pechuga de pavo', amount: '40 g', portion: '2 lonjas' }
        ],
        p: 14, c: 28, f: 11
      },
      {
        name: 'Banano con mantequilla de maní',
        ingredients: [
          { food: 'Banano', amount: '120 g', portion: '1 unidad' },
          { food: 'Mantequilla de maní natural', amount: '20 g', portion: '1 cda' }
        ],
        p: 6, c: 35, f: 12
      },
      {
        name: 'Galletas de arroz con cottage',
        ingredients: [
          { food: 'Galletas de arroz integral', amount: '20 g', portion: '4 unidades' },
          { food: 'Queso cottage', amount: '100 g', portion: '½ taza' },
          { food: 'Miel pura', amount: '10 g', portion: '1 cdta' }
        ],
        p: 14, c: 32, f: 3
      }
    ],
    [
      {
        name: 'Batido whey con fruta',
        ingredients: [
          { food: 'Whey vainilla', amount: '30 g', portion: '1 scoop' },
          { food: 'Fresas', amount: '100 g', portion: '6 unidades' },
          { food: 'Agua', amount: '300 ml', portion: '1¼ taza' }
        ],
        p: 26, c: 18, f: 2
      },
      {
        name: 'Huevos cocidos con cherry',
        ingredients: [
          { food: 'Huevos cocidos', amount: '100 g', portion: '2 unidades' },
          { food: 'Tomate cherry', amount: '80 g', portion: '8 unidades' },
          { food: 'Sal y pimienta', amount: '—', portion: 'a gusto' }
        ],
        p: 14, c: 6, f: 10
      },
      {
        name: 'Hummus con vegetales',
        ingredients: [
          { food: 'Hummus casero', amount: '60 g', portion: '3 cdas' },
          { food: 'Zanahoria baby', amount: '80 g', portion: '4 unidades' },
          { food: 'Galleta integral', amount: '15 g', portion: '2 unidades' }
        ],
        p: 8, c: 22, f: 8
      }
    ],
    [
      {
        name: 'Almendras y huevo',
        ingredients: [
          { food: 'Almendras crudas', amount: '25 g', portion: '20 unidades' },
          { food: 'Huevo cocido', amount: '50 g', portion: '1 unidad' }
        ],
        p: 12, c: 5, f: 18
      },
      {
        name: 'Queso fresco y nueces',
        ingredients: [
          { food: 'Queso fresco', amount: '50 g', portion: '1 porción' },
          { food: 'Nueces', amount: '15 g', portion: '5 unidades' }
        ],
        p: 14, c: 3, f: 17
      },
      {
        name: 'Atún con pepino',
        ingredients: [
          { food: 'Atún en agua', amount: '80 g', portion: '½ lata' },
          { food: 'Pepino fresco', amount: '100 g', portion: '½ unidad' },
          { food: 'Mayonesa light', amount: '10 g', portion: '1 cda' }
        ],
        p: 20, c: 4, f: 12
      }
    ]
  ],
  almuerzo: [
    [
      {
        name: 'Pollo con arroz integral y ensalada',
        ingredients: [
          { food: 'Pechuga de pollo', amount: '180 g', portion: '1 filete' },
          { food: 'Arroz integral cocido', amount: '180 g', portion: '1 taza' },
          { food: 'Lechuga, tomate, pepino', amount: '120 g', portion: '1 plato' },
          { food: 'Aceite de oliva', amount: '5 ml', portion: '1 cdta' },
          { food: 'Limón', amount: '15 ml', portion: '½ unidad' }
        ],
        p: 48, c: 58, f: 8
      },
      {
        name: 'Salmón con batata y brócoli',
        ingredients: [
          { food: 'Salmón fresco', amount: '170 g', portion: '1 filete' },
          { food: 'Batata horneada', amount: '200 g', portion: '1 mediana' },
          { food: 'Brócoli al vapor', amount: '150 g', portion: '1½ taza' },
          { food: 'Aceite de oliva', amount: '10 ml', portion: '2 cdtas' }
        ],
        p: 42, c: 52, f: 16
      },
      {
        name: 'Pasta integral con carne molida',
        ingredients: [
          { food: 'Carne molida 95% magra', amount: '150 g', portion: '1 porción' },
          { food: 'Pasta integral cocida', amount: '160 g', portion: '1 taza' },
          { food: 'Salsa de tomate natural', amount: '100 g', portion: '½ taza' },
          { food: 'Queso parmesano', amount: '10 g', portion: '1 cda' }
        ],
        p: 44, c: 60, f: 11
      }
    ],
    [
      {
        name: 'Pollo con quinoa y vegetales salteados',
        ingredients: [
          { food: 'Pechuga de pollo', amount: '180 g', portion: '1 filete' },
          { food: 'Quinoa cocida', amount: '120 g', portion: '⅔ taza' },
          { food: 'Vegetales mixtos', amount: '150 g', portion: '1 taza' },
          { food: 'Aceite de oliva', amount: '10 ml', portion: '2 cdtas' }
        ],
        p: 46, c: 35, f: 12
      },
      {
        name: 'Atún fresco con basmati y espárragos',
        ingredients: [
          { food: 'Atún fresco', amount: '160 g', portion: '1 filete' },
          { food: 'Arroz basmati', amount: '120 g', portion: '⅔ taza' },
          { food: 'Espárragos', amount: '120 g', portion: '8 tallos' },
          { food: 'Limón', amount: '15 ml', portion: '½ unidad' }
        ],
        p: 40, c: 32, f: 10
      },
      {
        name: 'Tilapia con puré de batata',
        ingredients: [
          { food: 'Tilapia fresca', amount: '180 g', portion: '1 filete' },
          { food: 'Batata en puré', amount: '180 g', portion: '¾ taza' },
          { food: 'Ensalada mixta', amount: '120 g', portion: '1 plato' },
          { food: 'Aceite de oliva', amount: '5 ml', portion: '1 cdta' }
        ],
        p: 38, c: 30, f: 8
      }
    ],
    [
      {
        name: 'Bistec magro con ensalada grande',
        ingredients: [
          { food: 'Bistec de res magro', amount: '180 g', portion: '1 corte' },
          { food: 'Lechugas mixtas', amount: '150 g', portion: '2 tazas' },
          { food: 'Tomate cherry', amount: '80 g', portion: '8 unidades' },
          { food: 'Aguacate', amount: '70 g', portion: '½ unidad' },
          { food: 'Aceite de oliva', amount: '10 ml', portion: '2 cdtas' }
        ],
        p: 48, c: 12, f: 24
      },
      {
        name: 'Pollo con brócoli y aguacate',
        ingredients: [
          { food: 'Pechuga de pollo', amount: '180 g', portion: '1 filete' },
          { food: 'Brócoli salteado', amount: '180 g', portion: '2 tazas' },
          { food: 'Aguacate', amount: '80 g', portion: '½ unidad' },
          { food: 'Aceite de oliva', amount: '5 ml', portion: '1 cdta' }
        ],
        p: 44, c: 14, f: 24
      },
      {
        name: 'Salmón con espinaca y nueces',
        ingredients: [
          { food: 'Salmón fresco', amount: '170 g', portion: '1 filete' },
          { food: 'Espinaca salteada', amount: '120 g', portion: '2 tazas' },
          { food: 'Tomate cherry', amount: '60 g', portion: '5 unidades' },
          { food: 'Nueces', amount: '15 g', portion: '5 unidades' }
        ],
        p: 42, c: 10, f: 26
      }
    ]
  ],
  merienda: [
    [
      {
        name: 'Yogur griego con granola y miel',
        ingredients: [
          { food: 'Yogur griego 0%', amount: '170 g', portion: '¾ taza' },
          { food: 'Granola casera', amount: '40 g', portion: '¼ taza' },
          { food: 'Miel pura', amount: '10 g', portion: '1 cdta' }
        ],
        p: 18, c: 32, f: 5
      },
      {
        name: 'Batido post-entreno',
        ingredients: [
          { food: 'Whey vainilla', amount: '30 g', portion: '1 scoop' },
          { food: 'Banano', amount: '100 g', portion: '1 unidad' },
          { food: 'Leche de almendras', amount: '240 ml', portion: '1 taza' }
        ],
        p: 28, c: 32, f: 4
      },
      {
        name: 'Tostadas de arroz con atún',
        ingredients: [
          { food: 'Galletas de arroz', amount: '20 g', portion: '4 unidades' },
          { food: 'Atún en agua', amount: '80 g', portion: '½ lata' },
          { food: 'Tomate', amount: '50 g', portion: '½ unidad' }
        ],
        p: 22, c: 25, f: 4
      }
    ],
    [
      {
        name: 'Cottage con fruta y almendras',
        ingredients: [
          { food: 'Queso cottage', amount: '120 g', portion: '½ taza' },
          { food: 'Manzana', amount: '120 g', portion: '1 unidad' },
          { food: 'Almendras', amount: '10 g', portion: '8 unidades' }
        ],
        p: 22, c: 20, f: 8
      },
      {
        name: 'Huevo duro con galletas integrales',
        ingredients: [
          { food: 'Huevos cocidos', amount: '100 g', portion: '2 unidades' },
          { food: 'Galletas integrales', amount: '20 g', portion: '3 unidades' },
          { food: 'Aguacate', amount: '40 g', portion: '⅓ unidad' }
        ],
        p: 14, c: 20, f: 12
      },
      {
        name: 'Yogur proteico con nueces de Brasil',
        ingredients: [
          { food: 'Yogur proteico', amount: '170 g', portion: '1 vaso' },
          { food: 'Nueces de Brasil', amount: '10 g', portion: '2 unidades' }
        ],
        p: 24, c: 16, f: 9
      }
    ],
    [
      {
        name: 'Queso fresco con aguacate',
        ingredients: [
          { food: 'Queso fresco', amount: '60 g', portion: '1 lonja gruesa' },
          { food: 'Aguacate', amount: '70 g', portion: '½ unidad' },
          { food: 'Tomate', amount: '60 g', portion: '½ unidad' }
        ],
        p: 16, c: 8, f: 18
      },
      {
        name: 'Atún con aguacate',
        ingredients: [
          { food: 'Atún en agua', amount: '100 g', portion: '1 lata' },
          { food: 'Aguacate', amount: '80 g', portion: '½ unidad' },
          { food: 'Mayonesa light', amount: '10 g', portion: '1 cda' }
        ],
        p: 24, c: 4, f: 22
      },
      {
        name: 'Huevos revueltos con queso',
        ingredients: [
          { food: 'Huevos enteros', amount: '100 g', portion: '2 unidades' },
          { food: 'Queso fresco', amount: '30 g', portion: '1 cda' },
          { food: 'Aceite de oliva', amount: '5 ml', portion: '1 cdta' }
        ],
        p: 22, c: 3, f: 18
      }
    ]
  ],
  cena: [
    [
      {
        name: 'Pollo grillado con papa al horno',
        ingredients: [
          { food: 'Pechuga de pollo', amount: '160 g', portion: '1 filete' },
          { food: 'Papa al horno', amount: '180 g', portion: '1 mediana' },
          { food: 'Ensalada verde', amount: '100 g', portion: '1 plato' },
          { food: 'Aceite de oliva', amount: '5 ml', portion: '1 cdta' }
        ],
        p: 42, c: 42, f: 6
      },
      {
        name: 'Atún con arroz y pepino',
        ingredients: [
          { food: 'Atún fresco', amount: '150 g', portion: '1 filete' },
          { food: 'Arroz blanco', amount: '160 g', portion: '1 taza' },
          { food: 'Pepino y cebolla', amount: '120 g', portion: '1 plato' },
          { food: 'Limón', amount: '15 ml', portion: '½ unidad' }
        ],
        p: 40, c: 50, f: 5
      },
      {
        name: 'Pollo con plátano horneado',
        ingredients: [
          { food: 'Pechuga de pollo', amount: '170 g', portion: '1 filete' },
          { food: 'Plátano horneado', amount: '180 g', portion: '1 unidad' },
          { food: 'Vegetales asados', amount: '150 g', portion: '1 taza' }
        ],
        p: 44, c: 52, f: 7
      }
    ],
    [
      {
        name: 'Tilapia con quinoa y espinaca',
        ingredients: [
          { food: 'Tilapia', amount: '170 g', portion: '1 filete' },
          { food: 'Quinoa cocida', amount: '100 g', portion: '½ taza' },
          { food: 'Espinaca salteada', amount: '120 g', portion: '2 tazas' },
          { food: 'Aceite de oliva', amount: '5 ml', portion: '1 cdta' }
        ],
        p: 38, c: 30, f: 8
      },
      {
        name: 'Pollo con camote y brócoli',
        ingredients: [
          { food: 'Pechuga de pollo', amount: '170 g', portion: '1 filete' },
          { food: 'Camote al horno', amount: '180 g', portion: '1 mediano' },
          { food: 'Brócoli al vapor', amount: '150 g', portion: '1½ taza' }
        ],
        p: 42, c: 32, f: 7
      },
      {
        name: 'Pavo molido con lentejas',
        ingredients: [
          { food: 'Pavo molido', amount: '150 g', portion: '1 porción' },
          { food: 'Lentejas cocidas', amount: '150 g', portion: '¾ taza' },
          { food: 'Tomate guisado', amount: '80 g', portion: '⅓ taza' }
        ],
        p: 40, c: 34, f: 9
      }
    ],
    [
      {
        name: 'Salmón con espárragos y aguacate',
        ingredients: [
          { food: 'Salmón fresco', amount: '170 g', portion: '1 filete' },
          { food: 'Espárragos', amount: '120 g', portion: '8 tallos' },
          { food: 'Aguacate', amount: '70 g', portion: '½ unidad' }
        ],
        p: 38, c: 8, f: 24
      },
      {
        name: 'Pollo con brócoli y nueces',
        ingredients: [
          { food: 'Pechuga de pollo', amount: '180 g', portion: '1 filete' },
          { food: 'Brócoli al vapor', amount: '180 g', portion: '2 tazas' },
          { food: 'Nueces', amount: '15 g', portion: '5 unidades' },
          { food: 'Aceite de oliva', amount: '10 ml', portion: '2 cdtas' }
        ],
        p: 42, c: 12, f: 26
      },
      {
        name: 'Bistec con ensalada César sin crutones',
        ingredients: [
          { food: 'Bistec magro', amount: '180 g', portion: '1 corte' },
          { food: 'Lechuga romana', amount: '120 g', portion: '2 tazas' },
          { food: 'Queso parmesano', amount: '15 g', portion: '1½ cda' },
          { food: 'Aderezo César light', amount: '20 g', portion: '2 cdas' }
        ],
        p: 44, c: 10, f: 24
      }
    ]
  ]
};

window.MEAL_DB = MEAL_DB;
