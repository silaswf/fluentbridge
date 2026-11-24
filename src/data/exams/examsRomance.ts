import type { MockExam } from '../../types/exams';

export const ROMANCE_MOCK_EXAMS: MockExam[] = [
  // =========================================================================
  // DELE (Spanish — Instituto Cervantes, Simulations 1-4)
  // =========================================================================
  {
    id: 'dele-sim-1',
    examTypeId: 'dele',
    languageCode: 'es',
    simulationNumber: 1,
    title: 'DELE B2 — Simulacro 1: Movilidad y Ciudades Sostenibles',
    targetCefr: 'B2',
    durationMinutes: 30,
    questions: [
      {
        id: 'dele-sim-1-q1',
        section: 'reading',
        passageTitle: 'Superillas: recuperar la calle para el peatón',
        passageText:
          'En varias ciudades españolas, el modelo urbanístico conocido como "superilla" o supermanzana agrupa nueve manzanas tradicionales para restringir el tráfico motorizado de paso en su interior. Solo los vehículos de residentes, emergencias y reparto en horario limitado pueden circular a baja velocidad. Según estudios municipales realizados en Barcelona, esta medida redujo los niveles de dióxido de nitrógeno en un 25 % dentro de las zonas intervenidas y favoreció la apertura de comercios de proximidad, aunque algunos conductores vecinos denunciaron inicialmente desvíos más largos en las vías perimetrales.',
        prompt: 'Según el texto, ¿qué vehículos tienen permitido entrar en el interior de una supermanzana?',
        options: [
          'Cualquier automóvil particular fuera de las horas punta.',
          'Únicamente residentes, servicios de emergencia y reparto autorizado.',
          'Exclusivamente autobuses municipales y taxis eléctricos.',
          'Ningún vehículo motorizado bajo ninguna circunstancia.',
        ],
        correctIndex: 1,
        explanation:
          'El texto indica que solo los vehículos de residentes, emergencias y reparto en horario limitado pueden circular a baja velocidad.',
      },
      {
        id: 'dele-sim-1-q2',
        section: 'reading',
        passageTitle: 'Superillas: recuperar la calle para el peatón',
        passageText:
          'En varias ciudades españolas, el modelo urbanístico conocido como "superilla" o supermanzana agrupa nueve manzanas tradicionales para restringir el tráfico motorizado de paso en su interior. Solo los vehículos de residentes, emergencias y reparto en horario limitado pueden circular a baja velocidad. Según estudios municipales realizados en Barcelona, esta medida redujo los niveles de dióxido de nitrógeno en un 25 % dentro de las zonas intervenidas y favoreció la apertura de comercios de proximidad, aunque algunos conductores vecinos denunciaron inicialmente desvíos más largos en las vías perimetrales.',
        prompt: '¿Qué efecto negativo mencionaron inicialmente algunos conductores?',
        options: [
          'El cierre definitivo de los comercios de barrio.',
          'El aumento del dióxido de nitrógeno en el centro.',
          'Rutas más largas por las calles que rodean la supermanzana.',
          'La prohibición total de circular en bicicleta.',
        ],
        correctIndex: 2,
        explanation:
          'Algunos conductores denunciaron inicialmente "desvíos más largos en las vías perimetrales".',
      },
      {
        id: 'dele-sim-1-q3',
        section: 'listening',
        audioText:
          'Locutor: Atención, usuarios de la línea C-3 de Cercanías. Por obras de mejora en la estación de Atocha durante este fin de semana, los trenes con destino Aranjuez saldrán excepcionalmente desde la vía 7 en lugar de la vía 3 habitual. Asimismo, el servicio nocturno de autobuses lanzadera será gratuito presentando el abono transporte vigente.',
        audioPlaysLimit: 2,
        prompt: '¿Desde qué vía saldrán los trenes hacia Aranjuez este fin de semana?',
        options: [
          'Desde la vía 3',
          'Desde la vía 7',
          'Desde la estación de autobuses',
          'No habrá trenes hacia Aranjuez',
        ],
        correctIndex: 1,
        explanation:
          'El aviso especifica que saldrán excepcionalmente desde la vía 7.',
      },
      {
        id: 'dele-sim-1-q4',
        section: 'listening',
        audioText:
          'Locutor: Atención, usuarios de la línea C-3 de Cercanías. Por obras de mejora en la estación de Atocha durante este fin de semana, los trenes con destino Aranjuez saldrán excepcionalmente desde la vía 7 en lugar de la vía 3 habitual. Asimismo, el servicio nocturno de autobuses lanzadera será gratuito presentando el abono transporte vigente.',
        audioPlaysLimit: 2,
        prompt: '¿Qué requisito se pide para usar gratuitamente el autobús lanzadera nocturno?',
        options: [
          'Comprar un billete especial en taquilla.',
          'Viajar en grupo de al menos tres personas.',
          'Mostrar el abono transporte en vigor.',
          'Reservar plaza por teléfono.',
        ],
        correctIndex: 2,
        explanation:
          'El servicio nocturno será gratuito "presentando el abono transporte vigente".',
      },
      {
        id: 'dele-sim-1-q5',
        section: 'language_use',
        prompt: 'Elija la forma verbal correcta: "No creo que el ayuntamiento _____ a tiempo la ampliación del carril bici antes del otoño."',
        options: [
          'termina',
          'terminaba',
          'terminó',
          'termine',
        ],
        correctIndex: 3,
        explanation:
          'La expresión negativa de opinión "No creo que" exige presente de subjuntivo ("termine").',
      },
      {
        id: 'dele-sim-1-q6',
        section: 'language_use',
        prompt: 'Complete con el conector adecuado: "_____ la inversión inicial fue elevada, el ahorro energético compensó el gasto en tres años."',
        options: [
          'A pesar de que',
          'Sin embargo',
          'Por lo tanto',
          'En cambio',
        ],
        correctIndex: 0,
        explanation:
          '"A pesar de que" introduce una oración subordinada concesiva con verbo conjugado.',
      },
    ],
    writingTask: {
      prompt:
        'DELE B2 — Carta formal al director: En su barrio se debate cerrar al tráfico la calle principal los domingos para convertirla en zona peatonal y cultural. Escriba una carta al periódico local exponiendo su postura con al menos dos argumentos.',
      minWords: 140,
      rubricCriteria: [
        'Registro formal adecuado a una carta al director',
        'Postura clara y dos argumentos bien desarrollados',
        'Uso correcto del subjuntivo y conectores discursivos',
        'Cohesión y corrección ortográfica',
      ],
      expectedKeywords: ['estimado', 'peatonal', 'tráfico', 'comercio', 'vecinos', 'atentamente'],
      modelAnswer:
        'Estimado director:\n\nMe dirijo a usted con motivo del reciente debate sobre la peatonalización dominical de la calle Mayor. Considero que esta iniciativa resultaría sumamente beneficiosa para la convivencia y la economía del barrio.\n\nEn primer lugar, restringir el tráfico durante los domingos reduciría de forma notable la contaminación acústica, permitiendo que familias y personas mayores disfruten de un espacio seguro para pasear. En segundo lugar, las experiencias en otros distritos demuestran que las calles peatonales impulsan el consumo en librerías, cafeterías y pequeños comercios locales.\n\nAunque algunos comerciantes temen una pérdida de clientes que acuden en automóvil, bastaría con reforzar las líneas de autobús y habilitar aparcamientos disuasorios en las inmediaciones. Por todo ello, animo al consistorio a aprobar esta medida de prueba.\n\nAtentamente,\nLucía Morales',
    },
  },
  {
    id: 'dele-sim-2',
    examTypeId: 'dele',
    languageCode: 'es',
    simulationNumber: 2,
    title: 'DELE C1 — Simulacro 2: Patrimonio Lingüístico y Traducción',
    targetCefr: 'C1',
    durationMinutes: 30,
    questions: [
      {
        id: 'dele-sim-2-q1',
        section: 'reading',
        passageTitle: 'El español neutro frente a la riqueza dialectal',
        passageText:
          'Durante décadas, la industria del doblaje cinematográfico intentó imponer un llamado "español neutro", desprovisto de localismos léxicos y de marcas fonéticas regionales, con el fin de comercializar una única versión en todo el mundo hispanohablante. Sin embargo, numerosos lingüistas advierten que dicha variedad artificial carece de hablantes reales y empobrece la expresividad dramática de las obras. En los últimos años, varias plataformas audiovisuales han optado por doblajes diferenciados o por conservar giros propios de cada país cuando el contexto narrativo lo exige.',
        prompt: '¿Por qué critican muchos lingüistas el denominado "español neutro"?',
        options: [
          'Porque resulta incomprensible fuera de España.',
          'Porque es una construcción artificial que resta expresividad.',
          'Porque encarece los costes de grabación en América Latina.',
          'Porque prohíbe el uso de tiempos verbales compuestos.',
        ],
        correctIndex: 1,
        explanation:
          'Los lingüistas señalan que carece de hablantes reales y empobrece la expresividad dramática.',
      },
      {
        id: 'dele-sim-2-q2',
        section: 'reading',
        passageTitle: 'El español neutro frente a la riqueza dialectal',
        passageText:
          'Durante décadas, la industria del doblaje cinematográfico intentó imponer un llamado "español neutro", desprovisto de localismos léxicos y de marcas fonéticas regionales, con el fin de comercializar una única versión en todo el mundo hispanohablante. Sin embargo, numerosos lingüistas advierten que dicha variedad artificial carece de hablantes reales y empobrece la expresividad dramática de las obras. En los últimos años, varias plataformas audiovisuales han optado por doblajes diferenciados o por conservar giros propios de cada país cuando el contexto narrativo lo exige.',
        prompt: '¿Qué tendencia reciente describe el último párrafo?',
        options: [
          'La eliminación total del doblaje en favor de los subtítulos.',
          'La adopción de doblajes adaptados o el mantenimiento de rasgos locales.',
          'La creación de un diccionario obligatorio para guionistas.',
          'El regreso exclusivo al español neutro en todas las plataformas.',
        ],
        correctIndex: 1,
        explanation:
          'Varias plataformas optan ahora por "doblajes diferenciados o por conservar giros propios de cada país".',
      },
      {
        id: 'dele-sim-2-q3',
        section: 'listening',
        audioText:
          'Profesora: Antes de entregar la traducción literaria del viernes, recuerden que no basta con reproducir el significado literal de las metáforas. Si el autor original emplea un registro coloquial de los años sesenta, conviene buscar equivalentes naturales en español que no suenen ni excesivamente arcaicos ni demasiado juveniles hoy en día.',
        audioPlaysLimit: 2,
        prompt: '¿Qué consejo da la profesora sobre el registro de la traducción?',
        options: [
          'Traducir todas las metáforas de manera estrictamente literal.',
          'Modernizar el texto usando jerga juvenil actual.',
          'Encontrar equivalentes naturales acordes con el tono original.',
          'Mantener las expresiones sin traducir en el idioma de partida.',
        ],
        correctIndex: 2,
        explanation:
          'Recomienda buscar equivalentes naturales que no suenen ni arcaicos ni demasiado juveniles.',
      },
      {
        id: 'dele-sim-2-q4',
        section: 'listening',
        audioText:
          'Profesora: Antes de entregar la traducción literaria del viernes, recuerden que no basta con reproducir el significado literal de las metáforas. Si el autor original emplea un registro coloquial de los años sesenta, conviene buscar equivalentes naturales en español que no suenen ni excesivamente arcaicos ni demasiado juveniles hoy en día.',
        audioPlaysLimit: 2,
        prompt: '¿Cuándo deben entregar el trabajo los estudiantes?',
        options: [
          'El próximo lunes',
          'Dentro de dos semanas',
          'A final de mes',
          'El viernes',
        ],
        correctIndex: 3,
        explanation:
          'Menciona explícitamente "la traducción literaria del viernes".',
      },
      {
        id: 'dele-sim-2-q5',
        section: 'language_use',
        prompt: 'Seleccione la opción correcta: "De _____ sabido que la conferencia se aplazaba, habría reservado el billete para otro día."',
        options: [
          'haber',
          'haberse',
          'haya',
          'había',
        ],
        correctIndex: 0,
        explanation:
          'La construcción condicional "De + infinitivo compuesto" ("De haber sabido") equivale a "Si hubiera sabido".',
      },
      {
        id: 'dele-sim-2-q6',
        section: 'language_use',
        prompt: 'Elija la preposición adecuada: "El traductor insistió _____ revisar las notas al pie antes de enviar el manuscrito a imprenta."',
        options: [
          'a',
          'de',
          'en',
          'por',
        ],
        correctIndex: 2,
        explanation:
          'El verbo "insistir" rige la preposición "en" ("insistir en + infinitivo").',
      },
    ],
    writingTask: {
      prompt:
        'DELE C1 — Artículo de opinión: Redacte un texto argumentativo sobre el impacto de las plataformas de streaming en la difusión de las distintas variedades del español. Incluya ventajas, posibles riesgos y su valoración personal.',
      minWords: 160,
      rubricCriteria: [
        'Registro culto y precisión léxica de nivel C1',
        'Estructura argumentativa sólida con tesis, desarrollo y cierre',
        'Uso natural de marcadores discursivos complejos',
        'Dominio de estructuras subordinadas y tiempos del subjuntivo',
      ],
      expectedKeywords: ['variedades', 'doblaje', 'identidad', 'audiovisual', 'comprensión', 'riqueza'],
      modelAnswer:
        'La expansión global de las plataformas audiovisuales ha transformado profundamente la percepción mutua entre los hablantes de español. Por primera vez, millones de espectadores consumen de manera cotidiana series argentinas, mexicanas, colombianas o españolas sin necesidad de filtros artificiales.\n\nEsta exposición constante aporta una ventaja lingüística indudable: normaliza la diversidad fonética y léxica de nuestra lengua, desterrando el prejuicio de que existe una única norma prestigiosa. No obstante, algunos críticos señalan el riesgo de que la presión comercial acabe estandarizando ciertos guiones para facilitar su venta inmediata.\n\nA mi juicio, lejos de homogeneizar el idioma, el intercambio audiovisual fomenta una mayor tolerancia dialectal. Cuanto más nos familiarizamos con giros ajenos a nuestra región, más rica y cohesionada se vuelve la comunidad hispanohablante.',
    },
  },
  {
    id: 'dele-sim-3',
    examTypeId: 'dele',
    languageCode: 'es',
    simulationNumber: 3,
    title: 'DELE B2 — Simulacro 3: Economía Circular y Consumo',
    targetCefr: 'B2',
    durationMinutes: 30,
    questions: [
      {
        id: 'dele-sim-3-q1',
        section: 'reading',
        passageTitle: 'El derecho a reparar dispositivos electrónicos',
        passageText:
          'Ante el crecimiento acelerado de los residuos electrónicos, varias normativas europeas exigen ahora a los fabricantes que diseñen electrodomésticos y teléfonos móviles más fáciles de desmontar. Las nuevas reglas obligan a suministrar piezas de repuesto y manuales técnicos a talleres independientes durante al menos siete años tras la retirada de un modelo del mercado. Las asociaciones de consumidores celebran la medida porque alarga la vida útil de los aparatos, aunque advierten que el precio de las baterías oficiales sigue siendo un obstáculo.',
        prompt: '¿Qué obligación impone la normativa a los fabricantes tras retirar un modelo?',
        options: [
          'Regalar un teléfono nuevo a cada comprador.',
          'Proveer repuestos y manuales durante un mínimo de siete años.',
          'Cerrar los talleres de reparación independientes.',
          'Reducir la garantía legal a seis meses.',
        ],
        correctIndex: 1,
        explanation:
          'Deben suministrar piezas de repuesto y manuales técnicos durante al menos siete años.',
      },
      {
        id: 'dele-sim-3-q2',
        section: 'reading',
        passageTitle: 'El derecho a reparar dispositivos electrónicos',
        passageText:
          'Ante el crecimiento acelerado de los residuos electrónicos, varias normativas europeas exigen ahora a los fabricantes que diseñen electrodomésticos y teléfonos móviles más fáciles de desmontar. Las nuevas reglas obligan a suministrar piezas de repuesto y manuales técnicos a talleres independientes durante al menos siete años tras la retirada de un modelo del mercado. Las asociaciones de consumidores celebran la medida porque alarga la vida útil de los aparatos, aunque advierten que el precio de las baterías oficiales sigue siendo un obstáculo.',
        prompt: '¿Qué problema señalan aún las asociaciones de consumidores?',
        options: [
          'La falta de interés de los usuarios en reciclar.',
          'El elevado coste de las baterías originales.',
          'La prohibición de reparar lavadoras.',
          'La escasez de manuales en formato digital.',
        ],
        correctIndex: 1,
        explanation:
          'Advierten que "el precio de las baterías oficiales sigue siendo un obstáculo".',
      },
      {
        id: 'dele-sim-3-q3',
        section: 'listening',
        audioText:
          'Clienta: Buenos días, traje mi cafetera hace cinco días porque perdía agua por la base. Técnico: Sí, aquí tengo su ficha. Cambiamos la junta de silicona, que estaba agrietada, y ya no gotea. Como el aparato todavía estaba dentro de los dos años de garantía, no tiene que abonar nada; solo firme este comprobante de entrega.',
        audioPlaysLimit: 2,
        prompt: '¿Cuál era la avería de la cafetera?',
        options: [
          'No calentaba el agua.',
          'Le faltaba el depósito superior.',
          'El cable eléctrico estaba roto.',
          'Tenía una junta de silicona agrietada y perdía agua.',
        ],
        correctIndex: 3,
        explanation:
          'La cafetera perdía agua porque la junta de silicona estaba agrietada.',
      },
      {
        id: 'dele-sim-3-q4',
        section: 'listening',
        audioText:
          'Clienta: Buenos días, traje mi cafetera hace cinco días porque perdía agua por la base. Técnico: Sí, aquí tengo su ficha. Cambiamos la junta de silicona, que estaba agrietada, y ya no gotea. Como el aparato todavía estaba dentro de los dos años de garantía, no tiene que abonar nada; solo firme este comprobante de entrega.',
        audioPlaysLimit: 2,
        prompt: '¿Cuánto debe pagar la clienta por la reparación?',
        options: [
          'Solo el precio de la junta de silicona.',
          'La mitad de la mano de obra.',
          'Nada, porque la cubre la garantía.',
          'Veinte euros de diagnóstico.',
        ],
        correctIndex: 2,
        explanation:
          'El técnico indica que "no tiene que abonar nada" al estar dentro de los dos años de garantía.',
      },
      {
        id: 'dele-sim-3-q5',
        section: 'language_use',
        prompt: 'Complete la oración: "La empresa decidió retirar el producto del mercado _____ evitar futuras reclamaciones."',
        options: [
          'para que',
          'con objeto de',
          'a fin de que',
          'por motivo que',
        ],
        correctIndex: 1,
        explanation:
          '"Con objeto de + infinitivo" expresa finalidad cuando el sujeto es el mismo.',
      },
      {
        id: 'dele-sim-3-q6',
        section: 'language_use',
        prompt: 'Elija el pronombre relativo correcto: "El taller _____ llevé el ordenador cerró el mes pasado."',
        options: [
          'al que',
          'cuyo',
          'lo que',
          'quien',
        ],
        correctIndex: 0,
        explanation:
          'Se lleva algo "a" un lugar, por lo que corresponde la preposición "a" + artículo + "que" ("al que").',
      },
    ],
    writingTask: {
      prompt:
        'DELE B2 — Reclamación formal: Compró un ordenador portátil hace tres meses y la batería se descarga en menos de una hora. Escriba un correo formal al servicio de atención al cliente explicando el problema y solicitando una reparación o sustitución en garantía.',
      minWords: 140,
      rubricCriteria: [
        'Fórmulas de saludo y despedida formales',
        'Exposición clara de los hechos y fechas',
        'Petición concreta amparada en la garantía',
        'Corrección gramatical y léxico comercial adecuado',
      ],
      expectedKeywords: ['garantía', 'factura', 'batería', 'reparación', 'solicito', 'atentamente'],
      modelAnswer:
        'Estimados señores:\n\nMe pongo en contacto con ustedes para presentar una reclamación relativa al ordenador portátil modelo Nova-14, adquirido en su tienda en línea el pasado 15 de agosto (número de pedido 48291).\n\nDesde hace dos semanas, la batería ha perdido autonomía de forma drástica y el equipo se apaga tras apenas cuarenta minutos de uso, pese a seguir las indicaciones de carga del fabricante. Adjunto copia de la factura de compra como comprobante de que el producto se encuentra dentro del periodo legal de garantía.\n\nPor todo ello, les solicito que gestionen la recogida del dispositivo para su reparación sin coste alguno o, en su defecto, la sustitución por una unidad en perfecto estado.\n\nQuedo a la espera de su pronta respuesta.\n\nAtentamente,\nCarlos Méndez',
    },
  },
  {
    id: 'dele-sim-4',
    examTypeId: 'dele',
    languageCode: 'es',
    simulationNumber: 4,
    title: 'DELE C1 — Simulacro 4: Salud Pública y Telemedicina',
    targetCefr: 'C1',
    durationMinutes: 30,
    questions: [
      {
        id: 'dele-sim-4-q1',
        section: 'reading',
        passageTitle: 'Consultas virtuales en zonas rurales',
        passageText:
          'La implantación de la telemedicina en comarcas rurales con escasa densidad de población ha permitido reducir los desplazamientos innecesarios para controles rutinarios y renovación de recetas. Sin embargo, los médicos de familia subrayan que la videoconsulta no sustituye la exploración física presencial ni resuelve la brecha digital que afecta a numerosos pacientes de edad avanzada que carecen de conexión estable o de apoyo familiar para manejar aplicaciones sanitarias.',
        prompt: '¿Qué beneficio concreto aporta la telemedicina en zonas rurales según el texto?',
        options: [
          'Elimina la necesidad de médicos de familia en los pueblos.',
          'Disminuye los viajes evitables para revisiones de rutina y recetas.',
          'Garantiza conexión de fibra óptica a todos los mayores.',
          'Sustituye por completo las pruebas de laboratorio.',
        ],
        correctIndex: 1,
        explanation:
          'Ha permitido reducir los desplazamientos innecesarios para controles rutinarios y renovación de recetas.',
      },
      {
        id: 'dele-sim-4-q2',
        section: 'reading',
        passageTitle: 'Consultas virtuales en zonas rurales',
        passageText:
          'La implantación de la telemedicina en comarcas rurales con escasa densidad de población ha permitido reducir los desplazamientos innecesarios para controles rutinarios y renovación de recetas. Sin embargo, los médicos de familia subrayan que la videoconsulta no sustituye la exploración física presencial ni resuelve la brecha digital que afecta a numerosos pacientes de edad avanzada que carecen de conexión estable o de apoyo familiar para manejar aplicaciones sanitarias.',
        prompt: '¿Qué limitación preocupa a los médicos respecto a los pacientes mayores?',
        options: [
          'Prefieren viajar en autobús antes que hablar por teléfono.',
          'Las farmacias rurales no aceptan recetas electrónicas.',
          'Los médicos no tienen tiempo para atender videoconsultas.',
          'Las dificultades de acceso tecnológico y falta de asistencia para usar las aplicaciones.',
        ],
        correctIndex: 3,
        explanation:
          'Muchos pacientes mayores carecen de conexión estable o de apoyo familiar para manejar aplicaciones sanitarias.',
      },
      {
        id: 'dele-sim-4-q3',
        section: 'listening',
        audioText:
          'Recepcionista: Centro de Salud San Marcos, dígame. Paciente: Hola, llamo para cambiar mi cita de análisis de sangre de mañana jueves porque me surgió un viaje imprevisto. Recepcionista: Sin problema. El lunes ya está completo, pero tengo un hueco el martes a las ocho y cuarto. Recuerde venir en ayunas de al menos ocho horas; solo puede beber agua.',
        audioPlaysLimit: 2,
        prompt: '¿Para cuándo consigue nueva cita el paciente?',
        options: [
          'Para el jueves por la tarde',
          'Para el lunes a primera hora',
          'Para el martes a las 8:15',
          'Para la semana siguiente al martes',
        ],
        correctIndex: 2,
        explanation:
          'La recepcionista le ofrece "un hueco el martes a las ocho y cuarto".',
      },
      {
        id: 'dele-sim-4-q4',
        section: 'listening',
        audioText:
          'Recepcionista: Centro de Salud San Marcos, dígame. Paciente: Hola, llamo para cambiar mi cita de análisis de sangre de mañana jueves porque me surgió un viaje imprevisto. Recepcionista: Sin problema. El lunes ya está completo, pero tengo un hueco el martes a las ocho y cuarto. Recuerde venir en ayunas de al menos ocho horas; solo puede beber agua.',
        audioPlaysLimit: 2,
        prompt: '¿Qué indicación médica debe seguir antes de la prueba?',
        options: [
          'Desayunar ligero dos horas antes.',
          'No ingerir alimentos durante ocho horas, salvo agua.',
          'Traer los resultados del análisis anterior.',
          'Tomar un café sin azúcar antes de salir.',
        ],
        correctIndex: 1,
        explanation:
          'Debe acudir "en ayunas de al menos ocho horas; solo puede beber agua".',
      },
      {
        id: 'dele-sim-4-q5',
        section: 'language_use',
        prompt: 'Complete la estructura concesiva: "Por mucho que _____ las plataformas digitales, la atención presencial seguirá siendo insustituible."',
        options: [
          'avanzan',
          'avancen',
          'avanzaron',
          'avanzarían',
        ],
        correctIndex: 1,
        explanation:
          '"Por mucho que" referido a un hecho futuro o hipotético exige subjuntivo ("avancen").',
      },
      {
        id: 'dele-sim-4-q6',
        section: 'language_use',
        prompt: 'Elija el término más preciso en español formal: "El informe médico _____ la necesidad de reforzar la atención primaria."',
        options: [
          'pone de relieve',
          'hace vista gorda',
          'echa por tierra',
          'toma el pelo',
        ],
        correctIndex: 0,
        explanation:
          '"Poner de relieve" es una colocación formal que significa destacar o subrayar.',
      },
    ],
    writingTask: {
      prompt:
        'DELE C1 — Informe profesional: Como coordinador de un centro de salud, redacte un breve informe dirigido a la dirección evaluando la implantación de la telemedicina y proponiendo medidas para atender a las personas mayores con dificultades digitales.',
      minWords: 160,
      rubricCriteria: [
        'Formato claro de informe institucional',
        'Análisis equilibrado de logros y carencias',
        'Propuestas viables y concretas',
        'Nivel C1 en gramática, registro y vocabulario',
      ],
      expectedKeywords: ['diagnóstico', 'telemedicina', 'brecha digital', 'asistencia', 'propuesta', 'conclusión'],
      modelAnswer:
        'Informe sobre la implantación de la consulta telemática\n\n1. Valoración general\nDurante el último semestre, las consultas telemáticas han agilizado el seguimiento de pacientes crónicos y reducido la saturación en sala de espera. Sin embargo, los datos de asistencia muestran una menor participación entre mayores de setenta años.\n\n2. Dificultades detectadas\nEl principal escollo radica en la complejidad de las aplicaciones móviles y la inestabilidad de la red en pedanías alejadas, lo que genera frustración e inequidad asistencial.\n\n3. Propuestas de mejora\nSe recomienda habilitar una línea telefónica directa sin cita previa por aplicación, así como instalar un punto de apoyo presencial en el centro cívico municipal con personal auxiliar que oriente a los pacientes mayores durante sus primeras videoconsultas.',
    },
  },

  // =========================================================================
  // SIELE GLOBAL (Spanish — Instituto Cervantes / UNAM / USAL / UBA, 1-4)
  // =========================================================================
  {
    id: 'siele-sim-1',
    examTypeId: 'siele',
    languageCode: 'es',
    simulationNumber: 1,
    title: 'SIELE Global — Simulacro 1: Vida Académica y Becas',
    targetCefr: 'B1',
    durationMinutes: 30,
    questions: [
      {
        id: 'siele-sim-1-q1',
        section: 'reading',
        passageTitle: 'Convocatoria de intercambio universitario',
        passageText:
          'La Oficina de Relaciones Internacionales abre hasta el 30 de abril el plazo para solicitar becas de movilidad en universidades latinoamericanas y europeas. Podrán postularse estudiantes de grado que hayan aprobado al menos el 50 % de los créditos de su carrera y acrediten un nivel B1 del idioma del país de destino, salvo en los programas impartidos íntegramente en español. La selección valorará el expediente académico y una carta de motivación.',
        prompt: '¿Quiénes están exentos de acreditar un idioma extranjero?',
        options: [
          'Los estudiantes que ya tienen el 50 % de los créditos.',
          'Quienes entreguen la carta de motivación antes de abril.',
          'Los alumnos de posgrado con buen expediente.',
          'Quienes soliciten programas dictados totalmente en español.',
        ],
        correctIndex: 3,
        explanation:
          'Se exige nivel B1 del idioma de destino, "salvo en los programas impartidos íntegramente en español".',
      },
      {
        id: 'siele-sim-1-q2',
        section: 'reading',
        passageTitle: 'Convocatoria de intercambio universitario',
        passageText:
          'La Oficina de Relaciones Internacionales abre hasta el 30 de abril el plazo para solicitar becas de movilidad en universidades latinoamericanas y europeas. Podrán postularse estudiantes de grado que hayan aprobado al menos el 50 % de los créditos de su carrera y acrediten un nivel B1 del idioma del país de destino, salvo en los programas impartidos íntegramente en español. La selección valorará el expediente académico y una carta de motivación.',
        prompt: '¿Cuál es la fecha límite para presentar la solicitud?',
        options: [
          'El 15 de abril',
          'El 30 de abril',
          'El 1 de mayo',
          'El texto no indica fecha',
        ],
        correctIndex: 1,
        explanation:
          'El plazo está abierto "hasta el 30 de abril".',
      },
      {
        id: 'siele-sim-1-q3',
        section: 'listening',
        audioText:
          'Ana: Oye, Diego, ¿fuiste ya a la charla sobre las becas de verano en Buenos Aires? Diego: Sí, salí hace un rato. Me sorprendió saber que la ayuda económica cubre el alojamiento en residencia universitaria, pero no los pasajes de avión. Aun así, vale mucho la pena porque incluye un curso intensivo de investigación.',
        audioPlaysLimit: 2,
        prompt: '¿Qué gasto NO cubre la beca según Diego?',
        options: [
          'La residencia universitaria',
          'El curso intensivo de investigación',
          'Los billetes de avión',
          'La inscripción en la charla',
        ],
        correctIndex: 2,
        explanation:
          'Diego menciona que cubre el alojamiento, "pero no los pasajes de avión".',
      },
      {
        id: 'siele-sim-1-q4',
        section: 'listening',
        audioText:
          'Ana: Oye, Diego, ¿fuiste ya a la charla sobre las becas de verano en Buenos Aires? Diego: Sí, salí hace un rato. Me sorprendió saber que la ayuda económica cubre el alojamiento en residencia universitaria, pero no los pasajes de avión. Aun así, vale mucho la pena porque incluye un curso intensivo de investigación.',
        audioPlaysLimit: 2,
        prompt: '¿Cuál es la actitud de Diego hacia la beca?',
        options: [
          'Piensa que no merece la pena por el costo del vuelo.',
          'Considera que sigue siendo una oportunidad muy valiosa.',
          'Cree que el curso intensivo es demasiado largo.',
          'Prefiere buscar una beca en otra ciudad.',
        ],
        correctIndex: 1,
        explanation:
          'Dice: "Aun así, vale mucho la pena porque incluye un curso intensivo de investigación."',
      },
      {
        id: 'siele-sim-1-q5',
        section: 'language_use',
        prompt: 'Complete correctamente: "Cuando _____ los resultados de la beca, te llamaré enseguida."',
        options: [
          'salen',
          'salían',
          'saldrán',
          'salgan',
        ],
        correctIndex: 3,
        explanation:
          'Con "cuando" referido a una acción futura, en español se usa presente de subjuntivo ("salgan").',
      },
      {
        id: 'siele-sim-1-q6',
        section: 'language_use',
        prompt: 'Elija la opción correcta: "Llevo tres meses _____ para el examen oficial de español."',
        options: [
          'estudiar',
          'estudiando',
          'estudiado',
          'a estudiar',
        ],
        correctIndex: 1,
        explanation:
          'La perífrasis de duración "llevar + tiempo + gerundio" requiere "estudiando".',
      },
    ],
    writingTask: {
      prompt:
        'SIELE Tarea 1 — Correo electrónico: Escriba un correo a la Oficina de Relaciones Internacionales de su universidad preguntando por los requisitos de la beca de intercambio, las fechas de entrega y las opciones de alojamiento.',
      minWords: 110,
      rubricCriteria: [
        'Saludo y cierre adecuados a un correo universitario',
        'Preguntas claras y bien organizadas',
        'Uso correcto de conectores y tiempos verbales',
        'Ortografía y puntuación correctas',
      ],
      expectedKeywords: ['estimados', 'beca', 'requisitos', 'plazo', 'alojamiento', 'agradecería'],
      modelAnswer:
        'Estimados responsables de la Oficina de Relaciones Internacionales:\n\nMi nombre es Sofía Herrera y curso el tercer año de Economía. Estoy muy interesada en postularme a la convocatoria de intercambio para el próximo semestre, por lo que les agradecería que me confirmaran dos detalles.\n\nEn primer lugar, quisiera saber si el certificado oficial de idiomas debe entregarse junto con la solicitud antes del 30 de abril o si puede presentarse más adelante. Además, me gustaría conocer si la universidad de destino ofrece plazas en residencias estudiantiles o si el alojamiento corre por cuenta del alumno.\n\nMuchas gracias por su atención. Un cordial saludo,\nSofía Herrera',
    },
  },
  {
    id: 'siele-sim-2',
    examTypeId: 'siele',
    languageCode: 'es',
    simulationNumber: 2,
    title: 'SIELE Global — Simulacro 2: Cultura Gastronómica y Comercio',
    targetCefr: 'B2',
    durationMinutes: 30,
    questions: [
      {
        id: 'siele-sim-2-q1',
        section: 'reading',
        passageTitle: 'Mercados municipales reinventados',
        passageText:
          'En numerosas ciudades iberoamericanas, los mercados municipales tradicionales han encontrado una nueva vitalidad al combinar los puestos de fruta, pescado y carne de toda la vida con pequeños espacios de degustación. Esta fórmula permite que los vecinos sigan haciendo la compra diaria mientras los visitantes descubren recetas locales preparadas con ingredientes frescos del propio mercado. Sin embargo, los gestores procuran limitar el número de locales de restauración para evitar que los alquileres suban y expulsen a los comerciantes tradicionales.',
        prompt: '¿Por qué los gestores limitan la cantidad de espacios de restauración en los mercados?',
        options: [
          'Porque los turistas no compran fruta ni pescado.',
          'Para impedir que el alza de alquileres desplace a los puestos tradicionales.',
          'Porque la ley prohíbe cocinar dentro de edificios públicos.',
          'Para reducir el horario de apertura por las mañanas.',
        ],
        correctIndex: 1,
        explanation:
          'Limitan los locales para evitar que "los alquileres suban y expulsen a los comerciantes tradicionales".',
      },
      {
        id: 'siele-sim-2-q2',
        section: 'reading',
        passageTitle: 'Mercados municipales reinventados',
        passageText:
          'En numerosas ciudades iberoamericanas, los mercados municipales tradicionales han encontrado una nueva vitalidad al combinar los puestos de fruta, pescado y carne de toda la vida con pequeños espacios de degustación. Esta fórmula permite que los vecinos sigan haciendo la compra diaria mientras los visitantes descubren recetas locales preparadas con ingredientes frescos del propio mercado. Sin embargo, los gestores procuran limitar el número de locales de restauración para evitar que los alquileres suban y expulsen a los comerciantes tradicionales.',
        prompt: '¿Qué caracteriza la fórmula actual de estos mercados?',
        options: [
          'La sustitución total de las carnicerías por restaurantes.',
          'El cierre de los puestos durante los fines de semana.',
          'La venta exclusiva por internet para los vecinos.',
          'La convivencia entre la venta de productos frescos y la degustación.',
        ],
        correctIndex: 3,
        explanation:
          'Combinan puestos tradicionales de alimentos frescos con pequeños espacios de degustación.',
      },
      {
        id: 'siele-sim-2-q3',
        section: 'listening',
        audioText:
          'Vendedor: Buenas tardes, ¿en qué puedo ayudarle? Cliente: Busco aceite de oliva virgen extra de cosecha temprana, pero en botella oscura para que no le dé la luz. Vendedor: Tenemos esta lata de medio litro de Jaén, que protege aún mejor el aroma que el vidrio. Si prefiere botella, nos llega un pedido nuevo el jueves por la mañana.',
        audioPlaysLimit: 2,
        prompt: '¿Por qué recomienda el vendedor el envase de lata?',
        options: [
          'Porque es más barato que la botella.',
          'Porque conserva mejor el aroma frente a la luz.',
          'Porque tiene capacidad de dos litros.',
          'Porque es el único producto de Jaén.',
        ],
        correctIndex: 1,
        explanation:
          'El vendedor explica que la lata "protege aún mejor el aroma que el vidrio".',
      },
      {
        id: 'siele-sim-2-q4',
        section: 'listening',
        audioText:
          'Vendedor: Buenas tardes, ¿en qué puedo ayudarle? Cliente: Busco aceite de oliva virgen extra de cosecha temprana, pero en botella oscura para que no le dé la luz. Vendedor: Tenemos esta lata de medio litro de Jaén, que protege aún mejor el aroma que el vidrio. Si prefiere botella, nos llega un pedido nuevo el jueves por la mañana.',
        audioPlaysLimit: 2,
        prompt: '¿Cuándo dispondrá la tienda de botellas oscuras?',
        options: [
          'Hoy mismo por la tarde',
          'El miércoles al mediodía',
          'El jueves por la mañana',
          'La próxima semana',
        ],
        correctIndex: 2,
        explanation:
          'El vendedor indica que "nos llega un pedido nuevo el jueves por la mañana".',
      },
      {
        id: 'siele-sim-2-q5',
        section: 'language_use',
        prompt: 'Elija la opción correcta: "Aunque el restaurante _____ lleno los viernes, hoy pudimos reservar mesa sin dificultad."',
        options: [
          'suele estar',
          'estuvo',
          'estuviera',
          'había estado',
        ],
        correctIndex: 0,
        explanation:
          'Con "aunque" + indicativo se expresa un hecho real y habitual ("suele estar lleno").',
      },
      {
        id: 'siele-sim-2-q6',
        section: 'language_use',
        prompt: 'Complete con el pronombre adecuado: "¿Ya probaste el pan artesanal? Sí, _____ compré esta mañana en el mercado."',
        options: [
          'le',
          'lo',
          'se',
          'nos',
        ],
        correctIndex: 1,
        explanation:
          '"El pan" es objeto directo masculino singular, por lo que corresponde "lo".',
      },
    ],
    writingTask: {
      prompt:
        'SIELE Tarea 2 — Entrada de blog: Escriba un artículo breve para un blog de viajes y cultura recomendando visitar un mercado tradicional de su ciudad o región, describiendo qué productos ofrece y por qué merece la pena conocerlo.',
      minWords: 120,
      rubricCriteria: [
        'Tono cercano, descriptivo y atractivo propio de un blog',
        'Léxico variado relacionado con gastronomía y comercio',
        'Coherencia entre párrafos',
        'Precisión gramatical en tiempos presentes y pasados',
      ],
      expectedKeywords: ['mercado', 'productos', 'frescos', 'ambiente', 'recomiendo', 'tradición'],
      modelAnswer:
        'Un paseo imprescindible por el Mercado Central\n\nSi visitan mi ciudad y desean conocer su verdadera esencia cotidiana, les recomiendo acercarse temprano al Mercado Central. Nada más cruzar sus puertas de hierro forjado, el visitante se ve envuelto por el aroma a fruta recién cortada, café molido y pan caliente.\n\nEn sus pasillos conviven puestos familiares con más de cincuenta años de historia junto a pequeñas barras donde se pueden degustar quesos artesanos y tapas de temporada. Más allá de la calidad de sus productos frescos, lo más valioso del mercado es su ambiente cercano: los comerciantes siempre están dispuestos a recomendar una receta o explicar el origen de cada ingrediente.',
    },
  },
  {
    id: 'siele-sim-3',
    examTypeId: 'siele',
    languageCode: 'es',
    simulationNumber: 3,
    title: 'SIELE Global — Simulacro 3: Tecnología y Educación',
    targetCefr: 'B2',
    durationMinutes: 30,
    questions: [
      {
        id: 'siele-sim-3-q1',
        section: 'reading',
        passageTitle: 'Aulas sin teléfonos móviles',
        passageText:
          'Cada vez más institutos de secundaria en América Latina y Europa han restringido el uso de teléfonos móviles durante la jornada escolar, exigiendo que los alumnos los guarden en taquillas desde la primera hora hasta la salida. Un seguimiento realizado en cuarenta centros mostró una mejora moderada en la concentración en clase y, sobre todo, un aumento notable de la conversación cara a cara durante los recreos. No obstante, algunos docentes opinan que la prohibición total desaprovecha oportunidades didácticas si no se acompaña de educación digital.',
        prompt: '¿Cuál fue el cambio más destacado observado durante los recreos?',
        options: [
          'Los estudiantes prefirieron estudiar en la biblioteca.',
          'Los alumnos trajeron tabletas en lugar de teléfonos.',
          'Se redujo el tiempo del recreo en diez minutos.',
          'Aumentó significativamente la interacción personal directa.',
        ],
        correctIndex: 3,
        explanation:
          'El estudio destacó "un aumento notable de la conversación cara a cara durante los recreos".',
      },
      {
        id: 'siele-sim-3-q2',
        section: 'reading',
        passageTitle: 'Aulas sin teléfonos móviles',
        passageText:
          'Cada vez más institutos de secundaria en América Latina y Europa han restringido el uso de teléfonos móviles durante la jornada escolar, exigiendo que los alumnos los guarden en taquillas desde la primera hora hasta la salida. Un seguimiento realizado en cuarenta centros mostró una mejora moderada en la concentración en clase y, sobre todo, un aumento notable de la conversación cara a cara durante los recreos. No obstante, algunos docentes opinan que la prohibición total desaprovecha oportunidades didácticas si no se acompaña de educación digital.',
        prompt: '¿Qué matiz introducen algunos profesores frente a la prohibición absoluta?',
        options: [
          'Creen que las taquillas son demasiado pequeñas.',
          'Señalan que hace falta educación digital además de limitar el uso.',
          'Piden que los móviles se usen en todos los exámenes.',
          'Afirman que la concentración no mejoró en absoluto.',
        ],
        correctIndex: 1,
        explanation:
          'Algunos docentes opinan que la prohibición total desaprovecha oportunidades si no se acompaña de educación digital.',
      },
      {
        id: 'siele-sim-3-q3',
        section: 'listening',
        audioText:
          'Director: Estimadas familias, les recordamos que a partir del próximo lunes el uso de la plataforma escolar será obligatorio para consultar las tareas y justificar ausencias. Quienes tengan dificultades para activar su clave pueden acudir a secretaría de nueve a doce, donde nuestro equipo técnico les ayudará personalmente.',
        audioPlaysLimit: 2,
        prompt: '¿Para qué servirá principalmente la plataforma escolar desde el lunes?',
        options: [
          'Para pagar el comedor escolar en efectivo.',
          'Para revisar deberes y justificar faltas de asistencia.',
          'Para descargar libros de texto gratuitos.',
          'Para chatear en directo durante las clases.',
        ],
        correctIndex: 1,
        explanation:
          'Servirá "para consultar las tareas y justificar ausencias".',
      },
      {
        id: 'siele-sim-3-q4',
        section: 'listening',
        audioText:
          'Director: Estimadas familias, les recordamos que a partir del próximo lunes el uso de la plataforma escolar será obligatorio para consultar las tareas y justificar ausencias. Quienes tengan dificultades para activar su clave pueden acudir a secretaría de nueve a doce, donde nuestro equipo técnico les ayudará personalmente.',
        audioPlaysLimit: 2,
        prompt: '¿Dónde y cuándo ofrecen ayuda para activar la contraseña?',
        options: [
          'En la biblioteca por la tarde',
          'Por correo electrónico los domingos',
          'En secretaría entre las 9:00 y las 12:00',
          'En el aula de informática a las 16:00',
        ],
        correctIndex: 2,
        explanation:
          'Pueden acudir a secretaría de nueve a doce.',
      },
      {
        id: 'siele-sim-3-q5',
        section: 'language_use',
        prompt: 'Complete la oración: "El profesor nos pidió que _____ el teléfono en silencio antes de empezar la prueba."',
        options: [
          'ponemos',
          'hemos puesto',
          'pondremos',
          'pusiéramos',
        ],
        correctIndex: 3,
        explanation:
          'El verbo principal en pretérito ("pidió") requiere imperfecto de subjuntivo ("pusiéramos") en la subordinada.',
      },
      {
        id: 'siele-sim-3-q6',
        section: 'language_use',
        prompt: 'Elija el conector correcto: "La aplicación es muy intuitiva; _____, algunos usuarios prefieren la versión web."',
        options: [
          'no obstante',
          'además',
          'en consecuencia',
          'es decir',
        ],
        correctIndex: 0,
        explanation:
          '"No obstante" introduce una idea de contraste.',
      },
    ],
    writingTask: {
      prompt:
        'SIELE Tarea 2 — Texto argumentativo: ¿Considera positivo prohibir el uso de teléfonos móviles en los centros educativos o cree que es mejor integrarlos como herramienta de aprendizaje? Exponga su opinión fundamentada.',
      minWords: 130,
      rubricCriteria: [
        'Tesis clara desde el inicio',
        'Argumentos sólidos y ejemplos concretos',
        'Uso de conectores de causa, contraste y conclusión',
        'Corrección gramatical y vocabulario académico',
      ],
      expectedKeywords: ['atención', 'distracción', 'herramienta', 'educación digital', 'normas', 'equilibrio'],
      modelAnswer:
        'El debate sobre la presencia de los teléfonos móviles en las escuelas exige distinguir entre el uso recreativo y el aprovechamiento pedagógico. En mi opinión, restringir su utilización libre durante las clases y los recreos resulta necesario, siempre que no se renuncie a formar a los jóvenes en competencias digitales.\n\nPor un lado, las notificaciones constantes fragmentan la atención y perjudican el rendimiento académico, además de reducir la convivencia presencial entre compañeros. Guardar los dispositivos en taquillas crea un entorno más sereno para el aprendizaje.\n\nSin embargo, prohibir sin educar sería insuficiente. Los centros deberían complementar estas normas con talleres de uso responsable y emplear tabletas o portátiles escolares cuando una actividad requiera búsqueda de información. De ese modo, se protege la concentración sin aislar al alumnado de la realidad tecnológica.',
    },
  },
  {
    id: 'siele-sim-4',
    examTypeId: 'siele',
    languageCode: 'es',
    simulationNumber: 4,
    title: 'SIELE Global — Simulacro 4: Ciencia y Energía Solar',
    targetCefr: 'C1',
    durationMinutes: 30,
    questions: [
      {
        id: 'siele-sim-4-q1',
        section: 'reading',
        passageTitle: 'Agrivoltaica: producir energía y alimentos en el mismo suelo',
        passageText:
          'La agrivoltaica propone instalar paneles solares elevados sobre terrenos agrícolas de modo que la maquinaria pueda circular por debajo y los cultivos reciban sombra parcial. Ensayos realizados en zonas áridas del sur de España y el norte de Chile revelan que esa sombra controlada reduce la evaporación del agua de riego hasta en un 20 % y protege ciertas hortalizas frente a olas de calor extremas, generando al mismo tiempo electricidad limpia sin competir por suelo fértil.',
        prompt: '¿Qué ventaja agrícola aporta la sombra de los paneles elevados en regiones áridas?',
        options: [
          'Acelera la evaporación del exceso de lluvia.',
          'Disminuye la pérdida de agua de riego y protege cultivos del calor extremo.',
          'Duplica la altura de los árboles frutales.',
          'Sustituye la necesidad de fertilizantes orgánicos.',
        ],
        correctIndex: 1,
        explanation:
          'Reduce la evaporación del agua de riego hasta en un 20 % y protege hortalizas de olas de calor.',
      },
      {
        id: 'siele-sim-4-q2',
        section: 'reading',
        passageTitle: 'Agrivoltaica: producir energía y alimentos en el mismo suelo',
        passageText:
          'La agrivoltaica propone instalar paneles solares elevados sobre terrenos agrícolas de modo que la maquinaria pueda circular por debajo y los cultivos reciban sombra parcial. Ensayos realizados en zonas áridas del sur de España y el norte de Chile revelan que esa sombra controlada reduce la evaporación del agua de riego hasta en un 20 % y protege ciertas hortalizas frente a olas de calor extremas, generando al mismo tiempo electricidad limpia sin competir por suelo fértil.',
        prompt: '¿Qué problema territorial busca evitar la agrivoltaica?',
        options: [
          'La falta de mano de obra en las ciudades.',
          'La competencia entre plantas solares y producción alimentaria por tierra fértil.',
          'El transporte de maquinaria por carreteras secundarias.',
          'El exceso de humedad en invernaderos cerrados.',
        ],
        correctIndex: 1,
        explanation:
          'Permite generar electricidad limpia "sin competir por suelo fértil".',
      },
      {
        id: 'siele-sim-4-q3',
        section: 'listening',
        audioText:
          'Investigador: En nuestro proyecto piloto en Murcia comprobamos que la lechuga cultivada bajo paneles semitransparentes mantuvo un peso similar al del cultivo a cielo abierto, pero requirió un dieciocho por ciento menos de agua. El único inconveniente observado fue el mayor coste inicial de la estructura metálica elevada.',
        audioPlaysLimit: 2,
        prompt: '¿Qué ocurrió con el rendimiento de la lechuga en el proyecto piloto?',
        options: [
          'Pesó la mitad que la cultivada al aire libre.',
          'Necesitó el doble de riego que antes.',
          'No pudo cosecharse por falta de luz.',
          'Mantuvo un peso parecido usando menos agua.',
        ],
        correctIndex: 3,
        explanation:
          'Mantuvo un peso similar al del cultivo a cielo abierto, pero requirió un 18 % menos de agua.',
      },
      {
        id: 'siele-sim-4-q4',
        section: 'listening',
        audioText:
          'Investigador: En nuestro proyecto piloto en Murcia comprobamos que la lechuga cultivada bajo paneles semitransparentes mantuvo un peso similar al del cultivo a cielo abierto, pero requirió un dieciocho por ciento menos de agua. El único inconveniente observado fue el mayor coste inicial de la estructura metálica elevada.',
        audioPlaysLimit: 2,
        prompt: '¿Cuál fue la única desventaja mencionada por el investigador?',
        options: [
          'La calidad del sabor de la lechuga.',
          'El precio más alto de los soportes metálicos elevados.',
          'La dificultad para limpiar los paneles.',
          'La oposición de los agricultores vecinos.',
        ],
        correctIndex: 1,
        explanation:
          'El único inconveniente fue "el mayor coste inicial de la estructura metálica elevada".',
      },
      {
        id: 'siele-sim-4-q5',
        section: 'language_use',
        prompt: 'Elija la forma correcta: "El proyecto no habría sido viable _____ el apoyo técnico de la universidad."',
        options: [
          'sin',
          'a no ser',
          'salvo que',
          'si no',
        ],
        correctIndex: 0,
        explanation:
          'Delante de un sintagma nominal ("el apoyo técnico"), la preposición correcta es "sin".',
      },
      {
        id: 'siele-sim-4-q6',
        section: 'language_use',
        prompt: 'Complete con el verbo adecuado: "Los resultados del ensayo _____ nuevas vías de colaboración entre el sector agrícola y el energético."',
        options: [
          'abren',
          'acuden',
          'caben',
          'suelen',
        ],
        correctIndex: 0,
        explanation:
          '"Abrir nuevas vías" es la colocación idiomática correcta.',
      },
    ],
    writingTask: {
      prompt:
        'SIELE Tarea 2 — Ensayo breve: Analice los desafíos y beneficios de compatibilizar la transición energética con la conservación de los suelos agrícolas. Proponga qué criterios deberían guiar la planificación rural.',
      minWords: 150,
      rubricCriteria: [
        'Análisis riguroso de nivel C1',
        'Integración fluida de argumentos ambientales y económicos',
        'Riqueza léxica y precisión sintáctica',
        'Conclusión clara y propositiva',
      ],
      expectedKeywords: ['transición energética', 'suelo agrícola', 'sostenibilidad', 'planificación', 'hídrico', 'innovación'],
      modelAnswer:
        'La urgente descarbonización de la economía ha impulsado la instalación de grandes parques solares en zonas rurales, lo que en ocasiones genera tensiones con el aprovechamiento agrario tradicional. Compatibilizar ambos objetivos exige superar la falsa dicotomía entre producir energía limpia o garantizar la seguridad alimentaria.\n\nSoluciones innovadoras como la agrivoltaica demuestran que el uso dual del territorio es técnicamente viable y hasta beneficioso en regiones expuestas a sequías crecientes, al reducir el estrés hídrico de determinados cultivos. No obstante, su mayor inversión inicial requiere incentivos públicos bien diseñados.\n\nEn definitiva, la planificación territorial debería priorizar los terrenos degradados o improductivos para las plantas convencionales y fomentar proyectos híbridos en fincas activas, asegurando que la transición energética fortalezca también la economía agrícola local.',
    },
  },

  // =========================================================================
  // DELF / DALF (French — France Éducation International, Simulations 1-4)
  // =========================================================================
  {
    id: 'delf-sim-1',
    examTypeId: 'delf',
    languageCode: 'fr',
    simulationNumber: 1,
    title: 'DELF B2 — Épreuve blanche 1 : Télétravail et vie locale',
    targetCefr: 'B2',
    durationMinutes: 30,
    questions: [
      {
        id: 'delf-sim-1-q1',
        section: 'reading',
        passageTitle: 'Le retour des tiers-lieux en milieu rural',
        passageText:
          'Avec l’essor du travail à distance, de nombreuses communes rurales françaises ont aménagé d’anciennes mairies ou gares désaffectées en espaces de travail partagés, appelés tiers-lieux. Ces espaces offrent une connexion fibre optique fiable et rompent l’isolement professionnel des travailleurs indépendants. Toutefois, les gérants soulignent que leur pérennité financière reste fragile sans l’organisation régulière d’ateliers ou de formations ouvertes aux habitants.',
        prompt: 'Quel avantage principal les tiers-lieux offrent-ils aux travailleurs indépendants ?',
        options: [
          'Ils garantissent un salaire fixe versé par la mairie.',
          'Ils fournissent une connexion rapide et évitent l’isolement.',
          'Ils remplacent entièrement les transports ferroviaires.',
          'Ils sont réservés uniquement aux fonctionnaires.',
        ],
        correctIndex: 1,
        explanation:
          'Le texte précise qu’ils offrent une connexion fibre optique fiable et rompent l’isolement professionnel.',
      },
      {
        id: 'delf-sim-1-q2',
        section: 'reading',
        passageTitle: 'Le retour des tiers-lieux en milieu rural',
        passageText:
          'Avec l’essor du travail à distance, de nombreuses communes rurales françaises ont aménagé d’anciennes mairies ou gares désaffectées en espaces de travail partagés, appelés tiers-lieux. Ces espaces offrent une connexion fibre optique fiable et rompent l’isolement professionnel des travailleurs indépendants. Toutefois, les gérants soulignent que leur pérennité financière reste fragile sans l’organisation régulière d’ateliers ou de formations ouvertes aux habitants.',
        prompt: 'De quoi dépend souvent l’équilibre économique de ces lieux ?',
        options: [
          'De l’augmentation des tarifs d’abonnement mensuel.',
          'De subventions européennes exclusivement touristiques.',
          'De la fermeture des bibliothèques municipales.',
          'De la tenue régulière d’activités et de formations pour le public local.',
        ],
        correctIndex: 3,
        explanation:
          'Leur pérennité financière reste fragile sans l’organisation régulière d’ateliers ou de formations ouvertes aux habitants.',
      },
      {
        id: 'delf-sim-1-q3',
        section: 'listening',
        audioText:
          'Animatrice : Bonjour à tous ! Pour réserver un bureau fermé à l’espace de coworking du Moulin, n’oubliez pas que les demandes doivent être enregistrées sur l’application la veille avant 18 heures. Le café et le thé sont compris dans le forfait journée, mais l’impression couleur est facturée à la page à l’accueil.',
        audioPlaysLimit: 2,
        prompt: 'Quand faut-il réserver un bureau fermé ?',
        options: [
          'Le matin même avant 9 heures',
          'La veille avant 18 heures',
          'Une semaine à l’avance',
          'Uniquement le vendredi',
        ],
        correctIndex: 1,
        explanation:
          'Les demandes doivent être enregistrées sur l’application la veille avant 18 heures.',
      },
      {
        id: 'delf-sim-1-q4',
        section: 'listening',
        audioText:
          'Animatrice : Bonjour à tous ! Pour réserver un bureau fermé à l’espace de coworking du Moulin, n’oubliez pas que les demandes doivent être enregistrées sur l’application la veille avant 18 heures. Le café et le thé sont compris dans le forfait journée, mais l’impression couleur est facturée à la page à l’accueil.',
        audioPlaysLimit: 2,
        prompt: 'Quel service entraîne un coût supplémentaire ?',
        options: [
          'Le café',
          'Le thé',
          'L’impression en couleur',
          'L’accès à l’application mobile',
        ],
        correctIndex: 2,
        explanation:
          'L’impression couleur est facturée à la page à l’accueil.',
      },
      {
        id: 'delf-sim-1-q5',
        section: 'language_use',
        prompt: 'Choisissez la forme verbale correcte : "Bien que le télétravail _____ de la souplesse, il demande une grande discipline."',
        options: [
          'offre',
          'offrira',
          'offrait',
          'ait offert',
        ],
        correctIndex: 0,
        explanation:
          '"Bien que" est suivi du subjonctif ; "offre" est ici la forme du subjonctif présent du verbe "offrir".',
      },
      {
        id: 'delf-sim-1-q6',
        section: 'language_use',
        prompt: 'Complétez avec le pronom relatif qui convient : "C’est un projet _____ la commune est particulièrement fière."',
        options: [
          'que',
          'qui',
          'dont',
          'où',
        ],
        correctIndex: 2,
        explanation:
          'On est "fier de quelque chose" ; le pronom relatif remplaçant un complément introduit par "de" est "dont".',
      },
    ],
    writingTask: {
      prompt:
        'DELF B2 — Lettre formelle au maire : Votre commune envisage de fermer une ancienne bibliothèque de quartier pour réduire ses coûts. Écrivez une lettre argumentée au maire pour proposer de la transformer plutôt en tiers-lieu culturel et espace de télétravail.',
      minWords: 150,
      rubricCriteria: [
        'Respect des codes de la lettre formelle en français',
        'Argumentation structurée et nuancée',
        'Emploi correct du subjonctif et des articulateurs logiques',
        'Richesse lexicale et orthographe soignée',
      ],
      expectedKeywords: ['Monsieur le Maire', 'bibliothèque', 'tiers-lieu', 'habitants', 'proposition', 'salutations'],
      modelAnswer:
        'Monsieur le Maire,\n\nJ’ai appris avec inquiétude le projet de fermeture de la bibliothèque du quartier Nord pour des raisons budgétaires. En tant que résidente, je souhaite vous soumettre une alternative qui permettrait de préserver ce bâtiment tout en dynamisant la vie locale.\n\nPlutôt que de fermer définitivement cet espace, il serait judicieux de le transformer en tiers-lieu associant prêt de livres et postes de télétravail. De nombreux habitants travaillant à distance recherchent un endroit calme équipé d’une bonne connexion. Une participation modique pour l’accès à l’espace de travail permettrait de financer une partie de l’entretien.\n\nEn outre, des ateliers numériques destinés aux seniors pourraient y être organisés chaque semaine. Espérant que cette proposition retiendra votre attention, je vous prie d’agréer, Monsieur le Maire, l’expression de mes salutations distinguées.\n\nClaire Laurent',
    },
  },
  {
    id: 'delf-sim-2',
    examTypeId: 'delf',
    languageCode: 'fr',
    simulationNumber: 2,
    title: 'DELF B2 / DALF C1 — Épreuve blanche 2 : Alimentation durable',
    targetCefr: 'C1',
    durationMinutes: 30,
    questions: [
      {
        id: 'delf-sim-2-q1',
        section: 'reading',
        passageTitle: 'Les circuits courts à l’épreuve de la logistique',
        passageText:
          'Acheter des produits agricoles directement auprès de producteurs locaux séduit un public croissant, soucieux de réduire l’empreinte carbone liée au transport des denrées. Pourtant, des chercheurs en agronomie nuancent ce constat : une camionnette parcourant cent kilomètres à moitié vide pour livrer quelques paniers peut émettre davantage de CO2 par kilo transporté qu’un camion frigorifique optimisé. D’où l’importance de mutualiser les tournées entre fermes voisines.',
        prompt: 'Pourquoi l’achat local n’est-il pas automatiquement plus écologique selon les chercheurs ?',
        options: [
          'Les produits locaux nécessitent plus d’emballages plastiques.',
          'De petits véhicules peu remplis peuvent avoir un bilan carbone élevé par kilo.',
          'Les camions frigorifiques ne consomment presque pas de carburant.',
          'Les fermes voisines refusent de livrer en ville.',
        ],
        correctIndex: 1,
        explanation:
          'Une camionnette à moitié vide peut émettre davantage de CO2 par kilo transporté qu’un camion optimisé.',
      },
      {
        id: 'delf-sim-2-q2',
        section: 'reading',
        passageTitle: 'Les circuits courts à l’épreuve de la logistique',
        passageText:
          'Acheter des produits agricoles directement auprès de producteurs locaux séduit un public croissant, soucieux de réduire l’empreinte carbone liée au transport des denrées. Pourtant, des chercheurs en agronomie nuancent ce constat : une camionnette parcourant cent kilomètres à moitié vide pour livrer quelques paniers peut émettre davantage de CO2 par kilo transporté qu’un camion frigorifique optimisé. D’où l’importance de mutualiser les tournées entre fermes voisines.',
        prompt: 'Quelle solution est suggérée dans le texte ?',
        options: [
          'Interdire la vente directe aux particuliers.',
          'Augmenter le prix des paniers de légumes.',
          'Importer davantage de fruits par voie aérienne.',
          'Regrouper les livraisons entre plusieurs exploitations proches.',
        ],
        correctIndex: 3,
        explanation:
          'Le texte souligne "l’importance de mutualiser les tournées entre fermes voisines".',
      },
      {
        id: 'delf-sim-2-q3',
        section: 'listening',
        audioText:
          'Journaliste : Pour notre chronique consommation, nous sommes au marché de Dijon. Madame Morel, votre coopérative vient de lancer des casiers réfrigérés en libre-service devant la gare. Comment ça fonctionne ? Productrice : C’est très simple : les clients commandent leur panier sur notre site avant mardi midi, reçoivent un code par SMS et le retirent quand ils sortent du train, jusqu’à vingt-deux heures.',
        audioPlaysLimit: 2,
        prompt: 'À quelle heure limite faut-il commander le mardi ?',
        options: [
          'Avant 10 heures',
          'Avant midi',
          'Avant 18 heures',
          'Avant 22 heures',
        ],
        correctIndex: 1,
        explanation:
          'Les clients commandent leur panier "avant mardi midi".',
      },
      {
        id: 'delf-sim-2-q4',
        section: 'listening',
        audioText:
          'Journaliste : Pour notre chronique consommation, nous sommes au marché de Dijon. Madame Morel, votre coopérative vient de lancer des casiers réfrigérés en libre-service devant la gare. Comment ça fonctionne ? Productrice : C’est très simple : les clients commandent leur panier sur notre site avant mardi midi, reçoivent un code par SMS et le retirent quand ils sortent du train, jusqu’à vingt-deux heures.',
        audioPlaysLimit: 2,
        prompt: 'Comment les clients ouvrent-ils le casier réfrigéré ?',
        options: [
          'Avec une carte bancaire',
          'En demandant la clé au guichet',
          'À l’aide d’un code reçu par SMS',
          'En scannant leur billet de train',
        ],
        correctIndex: 2,
        explanation:
          'Ils "reçoivent un code par SMS" pour retirer leur panier.',
      },
      {
        id: 'delf-sim-2-q5',
        section: 'language_use',
        prompt: 'Choisissez l’articulateur correct : "Les cantines scolaires privilégient les produits bio, _____ cela représente un surcoût modéré."',
        options: [
          'quand bien même',
          'à condition que',
          'tandis que',
          'en dépit de',
        ],
        correctIndex: 0,
        explanation:
          '"Quand bien même" (même si) introduit une concession avec un verbe conjugué.',
      },
      {
        id: 'delf-sim-2-q6',
        section: 'language_use',
        prompt: 'Complétez : "Il est essentiel que les producteurs _____ leurs livraisons pour réduire les trajets."',
        options: [
          'coordonnent',
          'coordonneront',
          'coordonneraient',
          'ont coordonné',
        ],
        correctIndex: 0,
        explanation:
          'La tournure impersonnelle "Il est essentiel que" demande le subjonctif présent ("coordonnent").',
      },
    ],
    writingTask: {
      prompt:
        'DALF C1 — Essai argumenté : Le succès des circuits courts alimentaires suffit-il à garantir une transition écologique efficace, ou faut-il aussi transformer nos modes de distribution et de consommation ? Rédigez un essai structuré.',
      minWords: 160,
      rubricCriteria: [
        'Problématisation claire de niveau C1',
        'Nuance entre production locale, logistique et habitudes alimentaires',
        'Connecteurs logiques variés et registre soutenu',
        'Maîtrise grammaticale et orthographique',
      ],
      expectedKeywords: ['circuits courts', 'logistique', 'empreinte carbone', 'mutualisation', 'transition', 'consommateurs'],
      modelAnswer:
        'Si l’engouement pour les circuits courts témoigne d’une prise de conscience écologique salutaire, réduire la transition alimentaire à la seule proximité géographique serait réducteur. En effet, l’impact environnemental d’un aliment dépend autant de sa logistique et de son mode de production que des kilomètres parcourus.\n\nCertes, acheter directement aux agriculteurs soutient l’économie rurale et limite les intermédiaires. Toutefois, comme le rappellent les agronomes, des livraisons fragmentées en petits véhicules s’avèrent parfois plus énergivores qu’un transport groupé. La mutualisation des tournées et l’installation de points de retrait collectifs constituent donc des leviers indispensables.\n\nPar ailleurs, le contenu même de nos assiettes — notamment la saisonnalité des produits et la réduction du gaspillage — pèse davantage dans le bilan carbone que la distance seule. Une transition réussie exige donc d’allier proximité, logistique collective et sobriété alimentaire.',
    },
  },
  {
    id: 'delf-sim-3',
    examTypeId: 'delf',
    languageCode: 'fr',
    simulationNumber: 3,
    title: 'DELF B2 — Épreuve blanche 3 : Culture et lecture publique',
    targetCefr: 'B2',
    durationMinutes: 30,
    questions: [
      {
        id: 'delf-sim-3-q1',
        section: 'reading',
        passageTitle: 'Les médiathèques deviennent des lieux de vie',
        passageText:
          'Loin de l’image austère des salles de lecture silencieuses d’autrefois, les médiathèques contemporaines misent sur la convivialité. On y trouve désormais des grainothèques pour échanger des semences, des ateliers de réparation de vélos et des prêts d’instruments de musique. Selon le dernier rapport ministériel, cette diversification a permis d’attirer un public jeune qui ne fréquentait plus ces établissements depuis le lycée.',
        prompt: 'Quel résultat concret a produit la diversification des services en médiathèque ?',
        options: [
          'La disparition complète des livres imprimés.',
          'Le retour d’un public jeune qui s’en était éloigné.',
          'L’interdiction des ateliers manuels le week-end.',
          'La hausse des frais d’inscription annuels.',
        ],
        correctIndex: 1,
        explanation:
          'Cette diversification a permis "d’attirer un public jeune qui ne fréquentait plus ces établissements depuis le lycée".',
      },
      {
        id: 'delf-sim-3-q2',
        section: 'reading',
        passageTitle: 'Les médiathèques deviennent des lieux de vie',
        passageText:
          'Loin de l’image austère des salles de lecture silencieuses d’autrefois, les médiathèques contemporaines misent sur la convivialité. On y trouve désormais des grainothèques pour échanger des semences, des ateliers de réparation de vélos et des prêts d’instruments de musique. Selon le dernier rapport ministériel, cette diversification a permis d’attirer un public jeune qui ne fréquentait plus ces établissements depuis le lycée.',
        prompt: 'Que peut-on emprunter ou échanger dans ces médiathèques selon le texte ?',
        options: [
          'Des vélos électriques neufs',
          'Des billets de concert gratuits',
          'Des ordinateurs portables pour un an',
          'Des graines et des instruments de musique',
        ],
        correctIndex: 3,
        explanation:
          'Le texte mentionne "des grainothèques pour échanger des semences" et "des prêts d’instruments de musique".',
      },
      {
        id: 'delf-sim-3-q3',
        section: 'listening',
        audioText:
          'Bibliothécaire : Bonjour, vous souhaitez vous inscrire ? L’adhésion est gratuite pour les moins de vingt-cinq ans et coûte quinze euros par an pour les autres adultes résidant dans la ville. Avec votre carte, vous pouvez emprunter jusqu’à dix documents pour trois semaines, renouvelables une fois en ligne s’ils ne sont pas réservés par un autre lecteur.',
        audioPlaysLimit: 2,
        prompt: 'Combien coûte l’inscription annuelle pour un adulte de trente ans habitant la ville ?',
        options: [
          'Elle est gratuite.',
          'Dix euros.',
          'Quinze euros.',
          'Vingt-cinq euros.',
        ],
        correctIndex: 2,
        explanation:
          'Elle coûte "quinze euros par an pour les autres adultes résidant dans la ville".',
      },
      {
        id: 'delf-sim-3-q4',
        section: 'listening',
        audioText:
          'Bibliothécaire : Bonjour, vous souhaitez vous inscrire ? L’adhésion est gratuite pour les moins de vingt-cinq ans et coûte quinze euros par an pour les autres adultes résidant dans la ville. Avec votre carte, vous pouvez emprunter jusqu’à dix documents pour trois semaines, renouvelables une fois en ligne s’ils ne sont pas réservés par un autre lecteur.',
        audioPlaysLimit: 2,
        prompt: 'À quelle condition peut-on prolonger un prêt en ligne ?',
        options: [
          'En payant un euro par document.',
          'Si personne d’autre n’a réservé le document.',
          'Seulement pour les moins de vingt-cinq ans.',
          'En se déplaçant obligatoirement au guichet.',
        ],
        correctIndex: 1,
        explanation:
          'Les prêts sont renouvelables "s’ils ne sont pas réservés par un autre lecteur".',
      },
      {
        id: 'delf-sim-3-q5',
        section: 'language_use',
        prompt: 'Choisissez la bonne forme : "Si j’avais su que la médiathèque proposait des cours de guitare, je _____ plus tôt."',
        options: [
          'm’inscris',
          'me serais inscrit',
          'm’inscrirai',
          'me suis inscrit',
        ],
        correctIndex: 1,
        explanation:
          'Dans une hypothèse irréelle du passé ("Si + plus-que-parfait"), la proposition principale prend le conditionnel passé ("me serais inscrit").',
      },
      {
        id: 'delf-sim-3-q6',
        section: 'language_use',
        prompt: 'Complétez avec la préposition juste : "La médiathèque veille _____ maintenir un espace calme à l’étage supérieur."',
        options: [
          'à',
          'de',
          'pour',
          'sur',
        ],
        correctIndex: 0,
        explanation:
          'Le verbe "veiller" se construit avec la préposition "à" ("veiller à + infinitif").',
      },
    ],
    writingTask: {
      prompt:
        'DELF B2 — Contribution à un forum : Un forum culturel demande si les médiathèques doivent rester centrées sur les livres et le silence, ou s’ouvrir à des activités collectives (jeux, musique, ateliers). Donnez votre avis argumenté.',
      minWords: 140,
      rubricCriteria: [
        'Position claire adaptée à un forum d’opinion',
        'Arguments illustrés par des exemples concrets',
        'Cohérence et fluidité des transitions',
        'Correction morphosyntaxique de niveau B2',
      ],
      expectedKeywords: ['médiathèque', 'lecture', 'convivialité', 'accès', 'culture', 'équilibre'],
      modelAnswer:
        'À mon avis, l’ouverture des médiathèques à des activités collectives constitue une évolution très positive, à condition de préserver des zones dédiées au silence.\n\nAujourd’hui, la culture ne se limite plus au livre imprimé : proposer des prêts d’instruments, des clubs de débat ou des ateliers numériques permet à des publics très variés de franchir la porte de ces établissements gratuits. Pour de nombreux jeunes ou personnes isolées, la médiathèque devient ainsi un véritable repère social.\n\nBien sûr, les étudiants et les lecteurs attachés au calme ne doivent pas être oubliés. Une organisation intelligente des étages — rez-de-chaussée animé et salles d’étude silencieuses à l’étage — permet de concilier ces deux usages sans conflit.',
    },
  },
  {
    id: 'delf-sim-4',
    examTypeId: 'delf',
    languageCode: 'fr',
    simulationNumber: 4,
    title: 'DELF B2 / DALF C1 — Épreuve blanche 4 : Environnement marin',
    targetCefr: 'C1',
    durationMinutes: 30,
    questions: [
      {
        id: 'delf-sim-4-q1',
        section: 'reading',
        passageTitle: 'Les herbiers de posidonie, boucliers de la Méditerranée',
        passageText:
          'Souvent confondue avec une algue, la posidonie est en réalité une plante marine à fleurs endémique de Méditerranée. Ses vastes prairies sous-marines jouent un rôle écologique majeur : elles produisent une grande quantité d’oxygène, abritent des centaines d’espèces de poissons et freinent la houle, protégeant ainsi les plages contre l’érosion. Or, le mouillage répété des ancres de bateaux de plaisance arrache chaque année des hectares de ces herbiers à croissance extrêmement lente.',
        prompt: 'Quelle erreur fréquente concernant la posidonie le texte corrige-t-il ?',
        options: [
          'Elle ne pousse que dans l’océan Atlantique.',
          'Elle repousse en quelques semaines après arrachage.',
          'Elle provoque l’érosion rapide des plages.',
          'Ce n’est pas une algue, mais une plante marine à fleurs.',
        ],
        correctIndex: 3,
        explanation:
          'Le texte précise : "Souvent confondue avec une algue, la posidonie est en réalité une plante marine à fleurs".',
      },
      {
        id: 'delf-sim-4-q2',
        section: 'reading',
        passageTitle: 'Les herbiers de posidonie, boucliers de la Méditerranée',
        passageText:
          'Souvent confondue avec une algue, la posidonie est en réalité une plante marine à fleurs endémique de Méditerranée. Ses vastes prairies sous-marines jouent un rôle écologique majeur : elles produisent une grande quantité d’oxygène, abritent des centaines d’espèces de poissons et freinent la houle, protégeant ainsi les plages contre l’érosion. Or, le mouillage répété des ancres de bateaux de plaisance arrache chaque année des hectares de ces herbiers à croissance extrêmement lente.',
        prompt: 'Quelle menace pèse actuellement sur ces herbiers ?',
        options: [
          'La baisse de la salinité de l’eau.',
          'Les ancres jetées par les bateaux de plaisance.',
          'L’augmentation du nombre de poissons.',
          'La disparition des vagues en été.',
        ],
        correctIndex: 1,
        explanation:
          'Le mouillage répété des ancres arrache chaque année des hectares de ces herbiers.',
      },
      {
        id: 'delf-sim-4-q3',
        section: 'listening',
        audioText:
          'Garde maritime : Bonjour, capitaine. Depuis le 1er juin, le mouillage sur ancre est interdit dans cette baie afin de préserver les herbiers de posidonie. Vous pouvez toutefois utiliser gratuitement les bouées écologiques blanches installées à cent mètres du rivage pour une durée maximale de quatre heures.',
        audioPlaysLimit: 2,
        prompt: 'Que doit faire le capitaine s’il souhaite s’arrêter dans la baie ?',
        options: [
          'Jeter l’ancre à cinquante mètres de la plage.',
          'S’amarrer à l’une des bouées écologiques blanches.',
          'Quitter immédiatement la baie sans s’arrêter.',
          'Payer un droit d’ancrage au port voisin.',
        ],
        correctIndex: 1,
        explanation:
          'Il peut utiliser gratuitement "les bouées écologiques blanches installées à cent mètres du rivage".',
      },
      {
        id: 'delf-sim-4-q4',
        section: 'listening',
        audioText:
          'Garde maritime : Bonjour, capitaine. Depuis le 1er juin, le mouillage sur ancre est interdit dans cette baie afin de préserver les herbiers de posidonie. Vous pouvez toutefois utiliser gratuitement les bouées écologiques blanches installées à cent mètres du rivage pour une durée maximale de quatre heures.',
        audioPlaysLimit: 2,
        prompt: 'Combien de temps peut-on rester amarré à une bouée ?',
        options: [
          'Deux heures au maximum',
          'Sans aucune limite de durée',
          'Toute la nuit gratuitement',
          'Quatre heures au maximum',
        ],
        correctIndex: 3,
        explanation:
          'La durée maximale autorisée est de quatre heures.',
      },
      {
        id: 'delf-sim-4-q5',
        section: 'language_use',
        prompt: 'Complétez avec la tournure correcte : "Faute _____ protégés à temps, certains herbiers mettront des décennies à se régénérer."',
        options: [
          'd’avoir été',
          'qu’ils soient',
          'd’être',
          'à être',
        ],
        correctIndex: 0,
        explanation:
          '"Faute de + infinitif passé" ("Faute d’avoir été protégés") exprime l’absence d’une action passée ayant un effet futur.',
      },
      {
        id: 'delf-sim-4-q6',
        section: 'language_use',
        prompt: 'Choisissez le terme le plus juste : "Les autorités ont installé des bouées _____ limiter l’impact du tourisme nautique."',
        options: [
          'afin de',
          'malgré',
          'quant à',
          'faute de',
        ],
        correctIndex: 0,
        explanation:
          '"Afin de + infinitif" exprime le but.',
      },
    ],
    writingTask: {
      prompt:
        'DALF C1 — Note de synthèse et prise de position : Expliquez pourquoi la préservation des écosystèmes côtiers comme la posidonie nécessite à la fois une réglementation stricte et une sensibilisation des usagers de la mer.',
      minWords: 160,
      rubricCriteria: [
        'Style analytique soutenu de niveau C1',
        'Articulation logique entre contrainte légale et pédagogie',
        'Lexique environnemental précis',
        'Maîtrise syntaxique et ponctuation irréprochable',
      ],
      expectedKeywords: ['écosystème', 'réglementation', 'sensibilisation', 'littoral', 'mouillage', 'préservation'],
      modelAnswer:
        'La dégradation rapide des herbiers marins illustre la difficulté de concilier l’attractivité touristique du littoral avec la préservation d’écosystèmes fragiles. Pour enrayer ce phénomène, la réglementation et la pédagogie apparaissent indissociables.\n\nD’une part, l’interdiction du mouillage sauvage et l’installation de bouées écologiques s’imposent comme des mesures d’urgence : face à une plante dont la croissance se mesure en centimètres par an, le seul appel à la bonne volonté resterait insuffisant. Les sanctions dissuasives garantissent un respect immédiat des zones sensibles.\n\nD’autre part, la contrainte juridique peine à durer sans adhésion citoyenne. Expliquer aux plaisanciers que la posidonie protège les plages contre l’érosion et nourrit la biodiversité locale transforme une règle perçue comme punitive en responsabilité partagée.',
    },
  },

  // =========================================================================
  // TCF (French — France Éducation International, Simulations 1-4)
  // =========================================================================
  {
    id: 'tcf-sim-1',
    examTypeId: 'tcf',
    languageCode: 'fr',
    simulationNumber: 1,
    title: 'TCF — Simulation 1 : Vie quotidienne et logement',
    targetCefr: 'B1',
    durationMinutes: 30,
    questions: [
      {
        id: 'tcf-sim-1-q1',
        section: 'reading',
        passageTitle: 'Annonce de colocation à Lyon',
        passageText:
          'Chambre meublée de 14 m² disponible dès le 1er septembre dans un appartement lumineux de trois chambres, situé à cinq minutes à pied du métro Jean Macé. Loyer : 520 € par mois, charges comprises (eau, chauffage et internet). Cuisine équipée et balcon commun. Profil recherché : étudiant ou jeune actif calme, non-fumeur. Dossier avec garant exigé.',
        prompt: 'Qu’est-ce qui est inclus dans le loyer mensuel de 520 € ?',
        options: [
          'Uniquement le loyer sans les factures.',
          'L’eau, le chauffage et la connexion internet.',
          'Le ménage hebdomadaire et les repas.',
          'Une place de parking souterrain.',
        ],
        correctIndex: 1,
        explanation:
          'Les charges comprises couvrent l’eau, le chauffage et internet.',
      },
      {
        id: 'tcf-sim-1-q2',
        section: 'reading',
        passageTitle: 'Annonce de colocation à Lyon',
        passageText:
          'Chambre meublée de 14 m² disponible dès le 1er septembre dans un appartement lumineux de trois chambres, situé à cinq minutes à pied du métro Jean Macé. Loyer : 520 € par mois, charges comprises (eau, chauffage et internet). Cuisine équipée et balcon commun. Profil recherché : étudiant ou jeune actif calme, non-fumeur. Dossier avec garant exigé.',
        prompt: 'Quelle condition est exigée pour déposer sa candidature ?',
        options: [
          'Avoir un animal de compagnie.',
          'Fournir un dossier avec un garant.',
          'Payer six mois de loyer d’avance.',
          'Être obligatoirement propriétaire d’une voiture.',
        ],
        correctIndex: 1,
        explanation:
          'L’annonce précise : "Dossier avec garant exigé."',
      },
      {
        id: 'tcf-sim-1-q3',
        section: 'listening',
        audioText:
          'Propriétaire : Bonjour Julien, j’ai bien reçu votre dossier pour la chambre. Tout est complet. Si cela vous convient, nous pouvons faire la visite jeudi à 17 h 30. Sonnez chez Martin, au troisième étage gauche.',
        audioPlaysLimit: 2,
        prompt: 'À quel étage Julien doit-il monter pour la visite ?',
        options: [
          'Au rez-de-chaussée',
          'Au deuxième étage',
          'Au troisième étage',
          'Au cinquième étage',
        ],
        correctIndex: 2,
        explanation:
          'Le propriétaire lui dit de sonner chez Martin "au troisième étage gauche".',
      },
      {
        id: 'tcf-sim-1-q4',
        section: 'listening',
        audioText:
          'Propriétaire : Bonjour Julien, j’ai bien reçu votre dossier pour la chambre. Tout est complet. Si cela vous convient, nous pouvons faire la visite jeudi à 17 h 30. Sonnez chez Martin, au troisième étage gauche.',
        audioPlaysLimit: 2,
        prompt: 'Que manque-t-il dans le dossier de Julien ?',
        options: [
          'Une pièce d’identité',
          'Les justificatifs du garant',
          'Rien, le dossier est complet',
          'Une attestation d’assurance',
        ],
        correctIndex: 2,
        explanation:
          'Le propriétaire confirme : "Tout est complet."',
      },
      {
        id: 'tcf-sim-1-q5',
        section: 'language_use',
        prompt: 'Complétez : "L’appartement est un peu petit, mais il est _____ situé près du métro."',
        options: [
          'idéalement',
          'idéale',
          'idéal',
          'idéaux',
        ],
        correctIndex: 0,
        explanation:
          'L’adverbe "idéalement" modifie le participe passé "situé".',
      },
      {
        id: 'tcf-sim-1-q6',
        section: 'language_use',
        prompt: 'Choisissez la forme correcte : "Dès que tu _____ les clés, envoie-moi un message."',
        options: [
          'auras',
          'aies',
          'avais',
          'as eu',
        ],
        correctIndex: 0,
        explanation:
          'Après "dès que" suivi d’un impératif futur, on emploie le futur simple ("auras").',
      },
    ],
    writingTask: {
      prompt:
        'TCF Expression écrite — Tâche 2 : Écrivez un message à un ami pour lui décrire votre nouveau logement en colocation, expliquer ce qui vous plaît le plus dans le quartier et l’inviter à venir le visiter ce week-end.',
      minWords: 110,
      rubricCriteria: [
        'Registre familier-courant adapté à un message amical',
        'Description claire du logement et du quartier',
        'Invitation précise avec jour ou horaire',
        'Exactitude grammaticale de niveau B1',
      ],
      expectedKeywords: ['colocation', 'quartier', 'métro', 'loyer', 'week-end', 'passer'],
      modelAnswer:
        'Salut Thomas,\n\nÇa y est, j’ai enfin emménagé dans ma nouvelle colocation près du métro Jean Macé ! L’appartement est très lumineux et ma chambre donne sur une cour intérieure calme, ce qui est parfait pour travailler le soir. Mes deux colocataires sont sympas et nous partageons un grand balcon.\n\nCe que j’adore surtout dans le quartier, c’est qu’il y a une boulangerie juste en bas et un parc à deux minutes à pied. Est-ce que tu serais libre samedi après-midi pour passer prendre un café et découvrir l’appartement ? Dis-moi ce qui t’arrange !\n\nÀ très vite,\nJulien',
    },
  },
  {
    id: 'tcf-sim-2',
    examTypeId: 'tcf',
    languageCode: 'fr',
    simulationNumber: 2,
    title: 'TCF — Simulation 2 : Monde du travail et formation',
    targetCefr: 'B2',
    durationMinutes: 30,
    questions: [
      {
        id: 'tcf-sim-2-q1',
        section: 'reading',
        passageTitle: 'La semaine de quatre jours à l’essai',
        passageText:
          'Plusieurs PME du secteur numérique expérimentent la semaine de quatre jours sans réduction de salaire. Le principe consiste à concentrer les tâches prioritaires en supprimant les réunions superflues et en automatisant certains comptes rendus. Après six mois d’essai, une majorité d’entreprises interrogées constatent une baisse de l’absentéisme et une stabilité du chiffre d’affaires, même si certains postes en relation directe avec la clientèle exigent un système de rotation.',
        prompt: 'Comment les entreprises parviennent-elles à maintenir leur activité en quatre jours ?',
        options: [
          'En réduisant les salaires de 20 %.',
          'En embauchant deux fois plus de stagiaires.',
          'En fermant le service client toute la semaine.',
          'En éliminant les réunions inutiles et en automatisant des tâches.',
        ],
        correctIndex: 3,
        explanation:
          'Elles suppriment les réunions superflues et automatisent certains comptes rendus.',
      },
      {
        id: 'tcf-sim-2-q2',
        section: 'reading',
        passageTitle: 'La semaine de quatre jours à l’essai',
        passageText:
          'Plusieurs PME du secteur numérique expérimentent la semaine de quatre jours sans réduction de salaire. Le principe consiste à concentrer les tâches prioritaires en supprimant les réunions superflues et en automatisant certains comptes rendus. Après six mois d’essai, une majorité d’entreprises interrogées constatent une baisse de l’absentéisme et une stabilité du chiffre d’affaires, même si certains postes en relation directe avec la clientèle exigent un système de rotation.',
        prompt: 'Quelle adaptation est nécessaire pour les équipes en contact avec les clients ?',
        options: [
          'Travailler depuis l’étranger.',
          'Mettre en place un roulement entre collègues.',
          'Répondre uniquement par courrier postal.',
          'Conserver la semaine de six jours.',
        ],
        correctIndex: 1,
        explanation:
          'Ces postes "exigent un système de rotation".',
      },
      {
        id: 'tcf-sim-2-q3',
        section: 'listening',
        audioText:
          'DRH : Bonjour à toute l’équipe. À partir du mois prochain, vous pourrez utiliser votre compte personnel de formation pour suivre des modules de langue ou de gestion de projet pendant vos heures de travail, jusqu’à deux heures par semaine, avec l’accord préalable de votre responsable.',
        audioPlaysLimit: 2,
        prompt: 'Combien d’heures par semaine les employés peuvent-ils consacrer à la formation ?',
        options: [
          'Une heure maximum',
          'Jusqu’à deux heures',
          'Quatre heures obligatoires',
          'Uniquement le week-end',
        ],
        correctIndex: 1,
        explanation:
          'Ils peuvent suivre des modules "jusqu’à deux heures par semaine".',
      },
      {
        id: 'tcf-sim-2-q4',
        section: 'listening',
        audioText:
          'DRH : Bonjour à toute l’équipe. À partir du mois prochain, vous pourrez utiliser votre compte personnel de formation pour suivre des modules de langue ou de gestion de projet pendant vos heures de travail, jusqu’à deux heures par semaine, avec l’accord préalable de votre responsable.',
        audioPlaysLimit: 2,
        prompt: 'Quelle démarche est indispensable avant de commencer la formation sur le temps de travail ?',
        options: [
          'Obtenir l’autorisation de son responsable.',
          'Payer les frais d’inscription soi-même.',
          'Passer un test de niveau à l’université.',
          'Démissionner de son poste actuel.',
        ],
        correctIndex: 0,
        explanation:
          'Il faut "l’accord préalable de votre responsable".',
      },
      {
        id: 'tcf-sim-2-q5',
        section: 'language_use',
        prompt: 'Choisissez la bonne préposition : "Cette formation permet _____ salariés d’acquérir de nouvelles compétences."',
        options: [
          'aux',
          'des',
          'les',
          'pour',
        ],
        correctIndex: 0,
        explanation:
          'La structure est "permettre à quelqu’un de faire quelque chose", donc "aux salariés".',
      },
      {
        id: 'tcf-sim-2-q6',
        section: 'language_use',
        prompt: 'Complétez : "_____ les progrès technologiques, le contact humain reste primordial dans la négociation."',
        options: [
          'Malgré',
          'Bien que',
          'Puisque',
          'Grâce à',
        ],
        correctIndex: 0,
        explanation:
          '"Malgré" est suivi d’un groupe nominal ("les progrès technologiques"), tandis que "Bien que" exige une proposition avec verbe.',
      },
    ],
    writingTask: {
      prompt:
        'TCF Expression écrite — Tâche 3 : La semaine de quatre jours est-elle une solution d’avenir pour améliorer la productivité et le bien-être au travail, ou comporte-t-elle des limites ? Présentez les deux points de vue puis votre avis.',
      minWords: 130,
      rubricCriteria: [
        'Présentation équilibrée des avantages et des limites',
        'Prise de position personnelle claire',
        'Articulateurs logiques adaptés',
        'Correction grammaticale et lexicale',
      ],
      expectedKeywords: ['productivité', 'équilibre', 'réunions', 'clientèle', 'organisation', 'bien-être'],
      modelAnswer:
        'La semaine de quatre jours suscite un vif intérêt chez les employeurs comme chez les salariés. Si cette organisation présente des atouts indéniables, sa généralisation se heurte toutefois à certaines contraintes sectorielles.\n\nD’un côté, disposer d’un jour de repos supplémentaire favorise la récupération physique et mentale, ce qui réduit l’absentéisme et renforce la motivation. Dans les métiers de bureau, supprimer les réunions inutiles permet souvent d’accomplir le même volume de travail en moins de jours.\n\nD’un autre côté, dans les hôpitaux, les commerces ou les services d’accueil, la présence continue reste indispensable et impose des recrutements ou des rotations complexes. En conclusion, la semaine de quatre jours constitue une piste prometteuse, à condition de l’adapter avec souplesse aux réalités de chaque métier.',
    },
  },
  {
    id: 'tcf-sim-3',
    examTypeId: 'tcf',
    languageCode: 'fr',
    simulationNumber: 3,
    title: 'TCF — Simulation 3 : Mobilité internationale et Québec',
    targetCefr: 'B2',
    durationMinutes: 30,
    questions: [
      {
        id: 'tcf-sim-3-q1',
        section: 'reading',
        passageTitle: 'S’intégrer professionnellement au Québec',
        passageText:
          'Pour les nouveaux arrivants francophones au Québec, la maîtrise de la langue ne suffit pas toujours à décrocher un premier emploi qualifié : les employeurs accordent une grande importance à la connaissance du marché local et aux réseaux professionnels. Les organismes d’accueil recommandent donc de participer à des programmes de mentorat et d’adapter son curriculum vitæ aux normes nord-américaines, plus axées sur les réalisations concrètes que sur la photo ou l’état civil.',
        prompt: 'Quelle différence importante concerne le CV nord-américain selon le texte ?',
        options: [
          'Il doit obligatoirement inclure une photo professionnelle.',
          'Il ne mentionne jamais les expériences passées.',
          'Il doit être rédigé exclusivement en anglais.',
          'Il met l’accent sur les résultats concrets plutôt que sur des données personnelles.',
        ],
        correctIndex: 3,
        explanation:
          'Il est "plus axé sur les réalisations concrètes que sur la photo ou l’état civil".',
      },
      {
        id: 'tcf-sim-3-q2',
        section: 'reading',
        passageTitle: 'S’intégrer professionnellement au Québec',
        passageText:
          'Pour les nouveaux arrivants francophones au Québec, la maîtrise de la langue ne suffit pas toujours à décrocher un premier emploi qualifié : les employeurs accordent une grande importance à la connaissance du marché local et aux réseaux professionnels. Les organismes d’accueil recommandent donc de participer à des programmes de mentorat et d’adapter son curriculum vitæ aux normes nord-américaines, plus axées sur les réalisations concrètes que sur la photo ou l’état civil.',
        prompt: 'Que conseillent les organismes d’accueil aux nouveaux arrivants ?',
        options: [
          'D’attendre un an avant de postuler.',
          'De rejoindre des programmes de mentorat et d’adapter leur CV.',
          'De refuser les emplois dans le secteur privé.',
          'De traduire leur passeport en espagnol.',
        ],
        correctIndex: 1,
        explanation:
          'Ils recommandent "de participer à des programmes de mentorat et d’adapter son curriculum vitæ".',
      },
      {
        id: 'tcf-sim-3-q3',
        section: 'listening',
        audioText:
          'Conseillère : Bienvenue à la séance d’information sur la reconnaissance des diplômes. Notez que pour les professions réglementées comme l’ingénierie ou les soins infirmiers, il est indispensable de contacter l’ordre professionnel concerné avant même votre départ, car l’évaluation du dossier peut prendre plusieurs mois.',
        audioPlaysLimit: 2,
        prompt: 'Pourquoi faut-il contacter l’ordre professionnel avant le départ ?',
        options: [
          'Pour réserver un billet d’avion à tarif réduit.',
          'Parce que l’examen du dossier demande souvent plusieurs mois.',
          'Pour obtenir un logement étudiant.',
          'Parce que les bureaux ferment en hiver.',
        ],
        correctIndex: 1,
        explanation:
          'L’évaluation du dossier "peut prendre plusieurs mois".',
      },
      {
        id: 'tcf-sim-3-q4',
        section: 'listening',
        audioText:
          'Conseillère : Bienvenue à la séance d’information sur la reconnaissance des diplômes. Notez que pour les professions réglementées comme l’ingénierie ou les soins infirmiers, il est indispensable de contacter l’ordre professionnel concerné avant même votre départ, car l’évaluation du dossier peut prendre plusieurs mois.',
        audioPlaysLimit: 2,
        prompt: 'Quel domaine est cité comme profession réglementée ?',
        options: [
          'La restauration',
          'Le journalisme sportif',
          'Les soins infirmiers',
          'La traduction littéraire',
        ],
        correctIndex: 2,
        explanation:
          'La conseillère cite "l’ingénierie ou les soins infirmiers".',
      },
      {
        id: 'tcf-sim-3-q5',
        section: 'language_use',
        prompt: 'Complétez avec l’expression correcte : "_____ vos diplômes soient reconnus rapidement, préparez toutes les traductions certifiées."',
        options: [
          'Pour que',
          'Parce que',
          'Alors que',
          'Bien que',
        ],
        correctIndex: 0,
        explanation:
          '"Pour que" (+ subjonctif "soient") exprime le but.',
      },
      {
        id: 'tcf-sim-3-q6',
        section: 'language_use',
        prompt: 'Choisissez la bonne forme : "Nous avons échangé avec plusieurs collègues _____ expérience nous a beaucoup aidés."',
        options: [
          'dont l’',
          'que l’',
          'qui l’',
          'où l’',
        ],
        correctIndex: 0,
        explanation:
          '"L’expérience de ces collègues" se remplace par "dont l’expérience".',
      },
    ],
    writingTask: {
      prompt:
        'TCF Expression écrite — Tâche 2 : Vous préparez un projet d’expatriation professionnelle. Écrivez à un organisme d’accueil pour demander des renseignements sur les ateliers d’intégration, l’adaptation du CV et les démarches de reconnaissance de diplôme.',
      minWords: 120,
      rubricCriteria: [
        'Formulation polie et claire des demandes',
        'Structure en paragraphes logiques',
        'Vocabulaire professionnel approprié',
        'Exactitude grammaticale',
      ],
      expectedKeywords: ['expatriation', 'ateliers', 'curriculum vitæ', 'diplôme', 'renseignements', 'cordialement'],
      modelAnswer:
        'Madame, Monsieur,\n\nJe prépare actuellement mon installation à Montréal dans le cadre d’une mobilité professionnelle prévue pour l’automne prochain. Afin d’anticiper au mieux mon intégration, je souhaiterais obtenir quelques précisions sur vos services d’accompagnement.\n\nTout d’abord, organisez-vous des ateliers en ligne pour aider les nouveaux arrivants à adapter leur curriculum vitæ aux attentes locales ? Par ailleurs, étant titulaire d’un diplôme d’ingénieur civil, pourriez-vous m’indiquer les coordonnées de l’ordre professionnel compétent pour entamer mes démarches de reconnaissance ?\n\nJe vous remercie par avance pour votre aide précieuse.\n\nCordialement,\nAntoine Mercier',
    },
  },
  {
    id: 'tcf-sim-4',
    examTypeId: 'tcf',
    languageCode: 'fr',
    simulationNumber: 4,
    title: 'TCF — Simulation 4 : Sciences et patrimoine architectural',
    targetCefr: 'C1',
    durationMinutes: 30,
    questions: [
      {
        id: 'tcf-sim-4-q1',
        section: 'reading',
        passageTitle: 'La construction en terre crue remise à l’honneur',
        passageText:
          'Longtemps cantonnée aux manuels d’architecture vernaculaire, la construction en terre crue — pisé ou bauge — retrouve aujourd’hui sa place dans des bâtiments publics contemporains. Ce matériau abondant, issu des déblais de chantier, régule naturellement l’hygrométrie intérieure et affiche une empreinte carbone quasi nulle comparée au ciment. Sa mise en œuvre exige toutefois un savoir-faire artisanal précis et une protection soignée contre le ruissellement des eaux de pluie.',
        prompt: 'D’où provient souvent la terre crue utilisée dans ces chantiers modernes ?',
        options: [
          'D’importations maritimes spécialisées.',
          'De carrières situées uniquement en montagne.',
          'Du recyclage de briques cuites industrielles.',
          'Des terres extraites lors des travaux de terrassement.',
        ],
        correctIndex: 3,
        explanation:
          'Le texte indique qu’il s’agit d’un matériau "issu des déblais de chantier".',
      },
      {
        id: 'tcf-sim-4-q2',
        section: 'reading',
        passageTitle: 'La construction en terre crue remise à l’honneur',
        passageText:
          'Longtemps cantonnée aux manuels d’architecture vernaculaire, la construction en terre crue — pisé ou bauge — retrouve aujourd’hui sa place dans des bâtiments publics contemporains. Ce matériau abondant, issu des déblais de chantier, régule naturellement l’hygrométrie intérieure et affiche une empreinte carbone quasi nulle comparée au ciment. Sa mise en œuvre exige toutefois un savoir-faire artisanal précis et une protection soignée contre le ruissellement des eaux de pluie.',
        prompt: 'Quelle précaution technique est indispensable lors de son utilisation ?',
        options: [
          'La mélanger systématiquement avec du ciment pur.',
          'La protéger efficacement contre l’écoulement de la pluie.',
          'L’utiliser uniquement dans les sous-sols humides.',
          'Éviter toute ventilation naturelle.',
        ],
        correctIndex: 1,
        explanation:
          'Elle exige "une protection soignée contre le ruissellement des eaux de pluie".',
      },
      {
        id: 'tcf-sim-4-q3',
        section: 'listening',
        audioText:
          'Architecte : Lors de la visite de l’école construite en pisé, vous remarquerez que les murs atteignent cinquante centimètres d’épaisseur. Ce n’est pas un caprice esthétique : cette masse thermique emmagasine la fraîcheur nocturne en été, ce qui nous a permis de supprimer la climatisation mécanique.',
        audioPlaysLimit: 2,
        prompt: 'Quel rôle jouent les murs épais de cinquante centimètres ?',
        options: [
          'Ils isolent uniquement du bruit extérieur.',
          'Ils conservent la fraîcheur de la nuit pour éviter la climatisation.',
          'Ils servent à soutenir des panneaux solaires très lourds.',
          'Ils ont un objectif purement décoratif.',
        ],
        correctIndex: 1,
        explanation:
          'Cette masse thermique "emmagasine la fraîcheur nocturne en été", permettant de supprimer la climatisation.',
      },
      {
        id: 'tcf-sim-4-q4',
        section: 'listening',
        audioText:
          'Architecte : Lors de la visite de l’école construite en pisé, vous remarquerez que les murs atteignent cinquante centimètres d’épaisseur. Ce n’est pas un caprice esthétique : cette masse thermique emmagasine la fraîcheur nocturne en été, ce qui nous a permis de supprimer la climatisation mécanique.',
        audioPlaysLimit: 2,
        prompt: 'De quel type de bâtiment s’agit-il ?',
        options: [
          'D’un musée d’art moderne',
          'D’une mairie rurale',
          'D’une école',
          'D’un hôpital',
        ],
        correctIndex: 2,
        explanation:
          'L’architecte parle de "la visite de l’école construite en pisé".',
      },
      {
        id: 'tcf-sim-4-q5',
        section: 'language_use',
        prompt: 'Choisissez la tournure soutenue la plus juste : "_____ sa robustesse, ce matériau naturel régule efficacement l’humidité."',
        options: [
          'Outre',
          'Hormis',
          'À défaut de',
          'Quitte à',
        ],
        correctIndex: 0,
        explanation:
          '"Outre" signifie "en plus de", ajoutant une qualité supplémentaire à la robustesse.',
      },
      {
        id: 'tcf-sim-4-q6',
        section: 'language_use',
        prompt: 'Complétez : "Il conviendrait que les écoles d’architecture _____ davantage les matériaux biosourcés et géosourcés."',
        options: [
          'enseignent',
          'enseigneront',
          'enseignaient',
          'ont enseigné',
        ],
        correctIndex: 0,
        explanation:
          '"Il conviendrait que" appelle le subjonctif ("enseignent").',
      },
    ],
    writingTask: {
      prompt:
        'TCF Expression écrite — Tâche 3 : L’architecture contemporaine doit-elle s’inspirer davantage des matériaux traditionnels locaux plutôt que de recourir partout aux mêmes standards industriels ? Rédigez un texte argumenté.',
      minWords: 150,
      rubricCriteria: [
        'Réflexion nuancée de niveau C1',
        'Comparaison pertinente entre matériaux locaux et standards industriels',
        'Connecteurs soutenus et précision lexicale',
        'Orthographe et syntaxe maîtrisées',
      ],
      expectedKeywords: ['matériaux locaux', 'empreinte carbone', 'climat', 'savoir-faire', 'architecture', 'durable'],
      modelAnswer:
        'Pendant près d’un siècle, l’architecture mondiale a privilégié des matériaux industriels standardisés — béton, acier et verre — indépendamment du climat local. Aujourd’hui, l’urgence climatique invite à réhabiliter les ressources régionales telles que la terre crue, la pierre ou le bois.\n\nS’inspirer des savoir-faire vernaculaires présente un double avantage : cela réduit drastiquement les émissions liées au transport tout en offrant une inertie thermique adaptée aux températures locales. Une école en pisé ou en pierre sèche vieillit souvent mieux qu’un bâtiment vitré exposé aux canicules.\n\nPour autant, il ne s’agit pas de rejeter l’ingénierie moderne, mais de l’associer intelligemment à ces matériaux anciens afin de respecter les normes de sécurité actuelles. Former les artisans et les architectes à cette hybridation constitue la voie la plus durable.',
    },
  },

  // =========================================================================
  // CILS (Italian — Università per Stranieri di Siena, Simulations 1-4)
  // =========================================================================
  {
    id: 'cils-sim-1',
    examTypeId: 'cils',
    languageCode: 'it',
    simulationNumber: 1,
    title: 'CILS B1/B2 — Simulazione 1: Trasporti e vita cittadina',
    targetCefr: 'B1',
    durationMinutes: 30,
    questions: [
      {
        id: 'cils-sim-1-q1',
        section: 'reading',
        passageTitle: 'Zone a Traffico Limitato nei centri storici',
        passageText:
          'In molte città italiane, l’accesso al centro storico è regolato dalle Zone a Traffico Limitato (ZTL), controllate da telecamere elettroniche ai varchi d’ingresso. Negli orari attivi possono entrare soltanto i residenti muniti di permesso, i mezzi pubblici e i veicoli elettrici autorizzati. Chi soggiorna in un albergo all’interno della ZTL deve comunicare la targa alla reception al momento dell’arrivo per evitare sanzioni automatiche.',
        prompt: 'Cosa deve fare chi alloggia in un hotel dentro la ZTL per non ricevere una multa?',
        options: [
          'Parcheggiare fuori regione.',
          'Comprare un biglietto dell’autobus per ogni passeggero.',
          'Spegnere i fari prima delle telecamere.',
          'Fornire il numero di targa alla reception dell’albergo.',
        ],
        correctIndex: 3,
        explanation:
          'Il testo spiega che bisogna comunicare la targa alla reception al momento dell’arrivo.',
      },
      {
        id: 'cils-sim-1-q2',
        section: 'reading',
        passageTitle: 'Zone a Traffico Limitato nei centri storici',
        passageText:
          'In molte città italiane, l’accesso al centro storico è regolato dalle Zone a Traffico Limitato (ZTL), controllate da telecamere elettroniche ai varchi d’ingresso. Negli orari attivi possono entrare soltanto i residenti muniti di permesso, i mezzi pubblici e i veicoli elettrici autorizzati. Chi soggiorna in un albergo all’interno della ZTL deve comunicare la targa alla reception al momento dell’arrivo per evitare sanzioni automatiche.',
        prompt: 'Come vengono controllati gli accessi alle ZTL?',
        options: [
          'Solo tramite barriere manuali.',
          'Attraverso telecamere elettroniche ai varchi.',
          'Esclusivamente nei giorni festivi.',
          'Da volontari del comune.',
        ],
        correctIndex: 1,
        explanation:
          'Le ZTL sono "controllate da telecamere elettroniche ai varchi d’ingresso".',
      },
      {
        id: 'cils-sim-1-q3',
        section: 'listening',
        audioText:
          'Annuncio: I signori passeggeri del treno regionale 2418 diretto a Firenze sono informati che, per un guasto tecnico allo scambio, la partenza avverrà dal binario 6 anziché dal binario 2. Il treno effettuerà tutte le fermate previste e partirà con dieci minuti di ritardo.',
        audioPlaysLimit: 2,
        prompt: 'Da quale binario partirà il treno per Firenze?',
        options: [
          'Dal binario 2',
          'Dal binario 4',
          'Dal binario 6',
          'Dal binario 10',
        ],
        correctIndex: 2,
        explanation:
          'L’annuncio informa che "la partenza avverrà dal binario 6".',
      },
      {
        id: 'cils-sim-1-q4',
        section: 'listening',
        audioText:
          'Annuncio: I signori passeggeri del treno regionale 2418 diretto a Firenze sono informati che, per un guasto tecnico allo scambio, la partenza avverrà dal binario 6 anziché dal binario 2. Il treno effettuerà tutte le fermate previste e partirà con dieci minuti di ritardo.',
        audioPlaysLimit: 2,
        prompt: 'Che cosa succede alle fermate del treno?',
        options: [
          'Vengono cancellate due fermate intermedie.',
          'Il treno fa tutte le fermate normali, con 10 minuti di ritardo.',
          'Il treno è stato sostituito da un autobus.',
          'Il treno parte in anticipo.',
        ],
        correctIndex: 1,
        explanation:
          'Il treno "effettuerà tutte le fermate previste e partirà con dieci minuti di ritardo".',
      },
      {
        id: 'cils-sim-1-q5',
        section: 'language_use',
        prompt: 'Scegli l’opzione corretta: "Prima di entrare in centro, _____ al vigile se la ZTL è attiva."',
        options: [
          'chiediamo',
          'chiedessimo',
          'avessimo chiesto',
          'chiesero',
        ],
        correctIndex: 0,
        explanation:
          'In un contesto presente quotidiano, l’indicativo presente ("chiediamo") esprime la proposta immediata.',
      },
      {
        id: 'cils-sim-1-q6',
        section: 'language_use',
        prompt: 'Completa con il pronome combinato giusto: "Hai già dato il permesso di parcheggio a Marco? Sì, _____ ho dato stamattina."',
        options: [
          'glielo',
          'l’ho',
          'gliene',
          'celo',
        ],
        correctIndex: 0,
        explanation:
          '"A Marco" (gli) + "il permesso" (lo) forma il pronome combinato "glielo" (eliso davanti a "ho": "gliel’ho" o "glielo ho").',
      },
    ],
    writingTask: {
      prompt:
        'CILS B1/B2 — Email formale: Hai prenotato una camera in un albergo nel centro storico di Siena e arriverai in auto. Scrivi un’email alla reception per chiedere informazioni sul parcheggio e sulla procedura per accedere alla ZTL senza prendere multe.',
      minWords: 110,
      rubricCriteria: [
        'Saluto e chiusura formali in italiano',
        'Richiesta chiara di informazioni su ZTL e parcheggio',
        'Uso corretto dei tempi verbali e delle preposizioni',
        'Ortografia accurata',
      ],
      expectedKeywords: ['gentile', 'prenotazione', 'targa', 'parcheggio', 'ZTL', 'cordiali saluti'],
      modelAnswer:
        'Gentile Reception,\n\nLe scrivo in merito alla mia prenotazione dal 12 al 15 ottobre a nome di Laura Bianchi. Poiché arriveremo a Siena in automobile, vorrei gentilmente sapere qual è la procedura corretta per raggiungere l’albergo attraversando la ZTL senza incorrere in sanzioni.\n\nDevo comunicarVi il numero di targa prima della partenza oppure è sufficiente registrarlo al momento del check-in? Inoltre, desidero sapere se disponete di un garage convenzionato nelle vicinanze e qual è la tariffa giornaliera.\n\nLa ringrazio in anticipo per la disponibilità.\n\nCordiali saluti,\nLaura Bianchi',
    },
  },
  {
    id: 'cils-sim-2',
    examTypeId: 'cils',
    languageCode: 'it',
    simulationNumber: 2,
    title: 'CILS B2 — Simulazione 2: Lavoro e artigianato digitale',
    targetCefr: 'B2',
    durationMinutes: 30,
    questions: [
      {
        id: 'cils-sim-2-q1',
        section: 'reading',
        passageTitle: 'Botteghe storiche e commercio elettronico',
        passageText:
          'Negli ultimi anni diverse botteghe artigiane italiane — dalla pelletteria toscana alla ceramica pugliese — hanno affiancato alla vendita diretta in laboratorio un negozio digitale curato nei dettagli. Questa scelta ha permesso a piccoli laboratori familiari di raggiungere clienti internazionali senza trasferirsi nelle grandi metropoli. Tuttavia, gli artigiani ricordano che gestire spedizioni, resi e servizio clienti richiede competenze nuove e tempo sottratto alla produzione manuale.',
        prompt: 'Quale vantaggio ha portato il commercio elettronico alle botteghe artigiane?',
        options: [
          'Ha eliminato il bisogno di lavorare a mano.',
          'Ha reso gratuita la spedizione internazionale.',
          'Ha chiuso tutti i negozi fisici.',
          'Ha permesso di vendere all’estero rimanendo nei propri territori.',
        ],
        correctIndex: 3,
        explanation:
          'Ha permesso di raggiungere clienti internazionali senza trasferirsi nelle grandi metropoli.',
      },
      {
        id: 'cils-sim-2-q2',
        section: 'reading',
        passageTitle: 'Botteghe storiche e commercio elettronico',
        passageText:
          'Negli ultimi anni diverse botteghe artigiane italiane — dalla pelletteria toscana alla ceramica pugliese — hanno affiancato alla vendita diretta in laboratorio un negozio digitale curato nei dettagli. Questa scelta ha permesso a piccoli laboratori familiari di raggiungere clienti internazionali senza trasferirsi nelle grandi metropoli. Tuttavia, gli artigiani ricordano che gestire spedizioni, resi e servizio clienti richiede competenze nuove e tempo sottratto alla produzione manuale.',
        prompt: 'Quale difficoltà comporta la gestione del negozio online?',
        options: [
          'La mancanza di interesse da parte dei clienti stranieri.',
          'Il tempo e le competenze richiesti per spedizioni e assistenza clienti.',
          'Il divieto di vendere ceramica fuori dall’Italia.',
          'L’impossibilità di fotografare i prodotti.',
        ],
        correctIndex: 1,
        explanation:
          'Gestire spedizioni, resi e servizio clienti richiede competenze nuove e toglie tempo alla produzione.',
      },
      {
        id: 'cils-sim-2-q3',
        section: 'listening',
        audioText:
          'Artigiana: Benvenuti nel nostro laboratorio di ceramica. Ogni piatto è dipinto a mano, quindi nessun pezzo è identico all’altro. Se desiderate ordinare un servizio personalizzato per un evento, vi preghiamo di contattarci almeno sei settimane prima: i tempi di asciugatura e doppia cottura in forno non si possono accelerare.',
        audioPlaysLimit: 2,
        prompt: 'Con quanto anticipo bisogna ordinare un servizio personalizzato?',
        options: [
          'Almeno due giorni prima',
          'Almeno una settimana prima',
          'Almeno sei settimane prima',
          'Il giorno stesso dell’evento',
        ],
        correctIndex: 2,
        explanation:
          'Chiede di contattarli "almeno sei settimane prima".',
      },
      {
        id: 'cils-sim-2-q4',
        section: 'listening',
        audioText:
          'Artigiana: Benvenuti nel nostro laboratorio di ceramica. Ogni piatto è dipinto a mano, quindi nessun pezzo è identico all’altro. Se desiderate ordinare un servizio personalizzato per un evento, vi preghiamo di contattarci almeno sei settimane prima: i tempi di asciugatura e doppia cottura in forno non si possono accelerare.',
        audioPlaysLimit: 2,
        prompt: 'Perché i tempi di consegna non possono essere ridotti?',
        options: [
          'Per i lunghi controlli doganali.',
          'A causa delle fasi necessarie di asciugatura e doppia cottura.',
          'Perché il laboratorio apre solo la domenica.',
          'Per mancanza di colori.',
        ],
        correctIndex: 1,
        explanation:
          '"I tempi di asciugatura e doppia cottura in forno non si possono accelerare."',
      },
      {
        id: 'cils-sim-2-q5',
        section: 'language_use',
        prompt: 'Scegli il congiuntivo corretto: "Sebbene la bottega _____ piccola, esporta le sue creazioni in tutto il mondo."',
        options: [
          'è',
          'fosse',
          'sarà',
          'sia',
        ],
        correctIndex: 3,
        explanation:
          'La congiunzione concessiva "sebbene" richiede il congiuntivo ("sia").',
      },
      {
        id: 'cils-sim-2-q6',
        section: 'language_use',
        prompt: 'Completa la frase: "Se avessimo aperto il sito web prima, _____ molti più clienti durante l’inverno."',
        options: [
          'avremmo raggiunto',
          'raggiungeremmo',
          'abbiamo raggiunto',
          'raggiungiamo',
        ],
        correctIndex: 0,
        explanation:
          'Periodo ipotetico dell’irrealtà nel passato: "Se + congiuntivo trapassato" regge il condizionale passato ("avremmo raggiunto").',
      },
    ],
    writingTask: {
      prompt:
        'CILS B2 — Testo argomentativo: L’artigianato tradizionale può sopravvivere nell’era della produzione industriale e del commercio digitale? Esponi la tua opinione portando almeno due esempi o argomenti concreti.',
      minWords: 140,
      rubricCriteria: [
        'Tesi chiara e argomentazione coerente',
        'Uso efficace di connettivi concessivi e causali',
        'Registro semi-formale/formale appropriato',
        'Correttezza grammaticale di livello B2',
      ],
      expectedKeywords: ['artigianato', 'qualità', 'digitale', 'tradizione', 'sostenibilità', 'valore'],
      modelAnswer:
        'In un mercato dominato da prodotti industriali economici e standardizzati, molti temono la scomparsa delle botteghe artigiane. Ritengo tuttavia che l’artigianato non solo possa sopravvivere, ma anche trovare nuovo slancio grazie agli strumenti digitali.\n\nIn primo luogo, un numero crescente di consumatori ricerca oggetti durevoli, riparabili e realizzati con materiali autentici, preferendo la qualità alla quantità. Un paio di scarpe cucite a mano o un piatto in ceramica raccontano una storia territoriale che la produzione in serie non può imitare.\n\nIn secondo luogo, Internet offre alle piccole officine una vetrina globale prima impensabile. Con una buona comunicazione digitale e spedizioni curate, i laboratori locali possono vendere direttamente a clienti appassionati in tutto il mondo senza rinunciare alla propria identità.',
    },
  },
  {
    id: 'cils-sim-3',
    examTypeId: 'cils',
    languageCode: 'it',
    simulationNumber: 3,
    title: 'CILS C1 — Simulazione 3: Università e ricerca scientifica',
    targetCefr: 'C1',
    durationMinutes: 30,
    questions: [
      {
        id: 'cils-sim-3-q1',
        section: 'reading',
        passageTitle: 'L’accesso aperto alle pubblicazioni scientifiche',
        passageText:
          'Il movimento per la scienza aperta sostiene che i risultati delle ricerche finanziate con fondi pubblici debbano essere consultabili gratuitamente da chiunque, senza barriere di abbonamento imposte dalle grandi riviste accademiche. Oltre a favorire il confronto rapido tra studiosi di paesi diversi, l’accesso aperto consente a medici, insegnanti e imprese locali di applicare le scoperte più recenti. Resta tuttavia aperta la questione dei costi editoriali di revisione paritaria, spesso trasferiti sugli autori o sugli atenei.',
        prompt: 'Qual è il principio centrale del movimento per la scienza aperta?',
        options: [
          'Eliminare la revisione paritaria dagli articoli.',
          'Rendere gratuiti gli studi finanziati con denaro pubblico.',
          'Vietare alle imprese di leggere articoli scientifici.',
          'Pubblicare le ricerche solo in formato cartaceo.',
        ],
        correctIndex: 1,
        explanation:
          'Sostiene che i risultati finanziati con fondi pubblici debbano essere consultabili gratuitamente.',
      },
      {
        id: 'cils-sim-3-q2',
        section: 'reading',
        passageTitle: 'L’accesso aperto alle pubblicazioni scientifiche',
        passageText:
          'Il movimento per la scienza aperta sostiene che i risultati delle ricerche finanziate con fondi pubblici debbano essere consultabili gratuitamente da chiunque, senza barriere di abbonamento imposte dalle grandi riviste accademiche. Oltre a favorire il confronto rapido tra studiosi di paesi diversi, l’accesso aperto consente a medici, insegnanti e imprese locali di applicare le scoperte più recenti. Resta tuttavia aperta la questione dei costi editoriali di revisione paritaria, spesso trasferiti sugli autori o sugli atenei.',
        prompt: 'Quale problema economico permane secondo il testo?',
        options: [
          'Gli atenei rifiutano di finanziare qualsiasi ricerca.',
          'Le spese editoriali vengono spesso addebitate ai ricercatori o alle università.',
          'I medici devono pagare per ogni lettura gratuita.',
          'Le riviste non accettano più articoli in inglese.',
        ],
        correctIndex: 1,
        explanation:
          'I costi editoriali di revisione paritaria sono "spesso trasferiti sugli autori o sugli atenei".',
      },
      {
        id: 'cils-sim-3-q3',
        section: 'listening',
        audioText:
          'Relatore: Prima di concludere il seminario, ricordo ai dottorandi che la scadenza per caricare la versione definitiva dell’abstract è fissata al 18 novembre. Non saranno accettati file superiori a trecento parole e vi invitiamo a indicare chiaramente l’affiliazione universitaria sotto il titolo.',
        audioPlaysLimit: 2,
        prompt: 'Qual è il limite massimo di parole per l’abstract?',
        options: [
          '150 parole',
          'Non c’è limite di parole',
          '500 parole',
          '300 parole',
        ],
        correctIndex: 3,
        explanation:
          'Non saranno accettati file "superiori a trecento parole".',
      },
      {
        id: 'cils-sim-3-q4',
        section: 'listening',
        audioText:
          'Relatore: Prima di concludere il seminario, ricordo ai dottorandi che la scadenza per caricare la versione definitiva dell’abstract è fissata al 18 novembre. Non saranno accettati file superiori a trecento parole e vi invitiamo a indicare chiaramente l’affiliazione universitaria sotto il titolo.',
        audioPlaysLimit: 2,
        prompt: 'Cosa va scritto esattamente sotto il titolo?',
        options: [
          'La data di nascita',
          'Il numero di parole',
          'L’affiliazione universitaria',
          'La bibliografia completa',
        ],
        correctIndex: 2,
        explanation:
          'Devono indicare "chiaramente l’affiliazione universitaria sotto il titolo".',
      },
      {
        id: 'cils-sim-3-q5',
        section: 'language_use',
        prompt: 'Scegli l’opzione più adeguata al registro accademico: "I dati raccolti _____ l’ipotesi formulata all’inizio dello studio."',
        options: [
          'avvalorano',
          'danno corda a',
          'mettono in piedi',
          'fanno finta di',
        ],
        correctIndex: 0,
        explanation:
          '"Avvalorare un’ipotesi" è la collocazione formale corretta (significa confermare, sostenere con prove).',
      },
      {
        id: 'cils-sim-3-q6',
        section: 'language_use',
        prompt: 'Completa correttamente: "Qualora il comitato _____ modifiche al testo, i candidati saranno avvisati via email."',
        options: [
          'richiede',
          'richiedesse',
          'richiederà',
          'ha richiesto',
        ],
        correctIndex: 1,
        explanation:
          'La congiunzione formale "qualora" (nel caso in cui) regge il congiuntivo imperfetto ("richiedesse").',
      },
    ],
    writingTask: {
      prompt:
        'CILS C1 — Saggio breve: Analizza i vantaggi e le criticità dell’accesso aperto (Open Access) nella ricerca scientifica contemporanea, proponendo possibili soluzioni per garantire sostenibilità ed equità.',
      minWords: 160,
      rubricCriteria: [
        'Registro accademico di livello C1',
        'Analisi equilibrata tra accesso libero e costi editoriali',
        'Coerenza testuale e uso di connettivi complessi',
        'Precisione lessicale e sintattica',
      ],
      expectedKeywords: ['ricerca pubblica', 'accesso aperto', 'revisione paritaria', 'costi editoriali', 'equità', 'sostenibilità'],
      modelAnswer:
        'La diffusione del modello Open Access rappresenta una svolta fondamentale per la circolazione della conoscenza scientifica. Poiché gran parte della ricerca di base è sostenuta dai contribuenti, risulta eticamente coerente che i risultati siano accessibili senza costosi abbonamenti privati.\n\nL’apertura dei dati accelera la collaborazione internazionale, evita la duplicazione degli esperimenti e consente alle università con budget ridotti di rimanere aggiornate. Tuttavia, il passaggio dal modello a pagamento per chi legge a quello a pagamento per chi pubblica rischia di penalizzare i giovani ricercatori privi di grandi finanziamenti.\n\nPer superare tale squilibrio, sarebbe auspicabile rafforzare gli archivi istituzionali gestiti direttamente dagli atenei e dai consorzi pubblici. Solo così la scienza aperta potrà coniugare rigore nella revisione paritaria, gratuità per i lettori ed equità per gli autori.',
    },
  },
  {
    id: 'cils-sim-4',
    examTypeId: 'cils',
    languageCode: 'it',
    simulationNumber: 4,
    title: 'CILS B1/B2 — Simulazione 4: Ambiente e turismo responsabile',
    targetCefr: 'B2',
    durationMinutes: 30,
    questions: [
      {
        id: 'cils-sim-4-q1',
        section: 'reading',
        passageTitle: 'Sentieri di montagna e numero chiuso',
        passageText:
          'Per proteggere i pascoli alpini e ridurre il sovraffollamento estivo, alcuni parchi naturali delle Dolomiti hanno introdotto la prenotazione obbligatoria per le navette che conducono ai rifugi più frequentati. L’iniziativa ha diminuito sensibilmente le code di automobili lungo i tornanti e ha permesso ai visitatori di godersi i sentieri in maggiore tranquillità, incoraggiando allo stesso tempo la scoperta di vallate meno conosciute.',
        prompt: 'Quale misura è stata adottata in alcuni parchi delle Dolomiti?',
        options: [
          'La chiusura definitiva di tutti i rifugi alpini.',
          'La prenotazione obbligatoria per le navette verso i sentieri più affollati.',
          'L’ampliamento dei parcheggi privati in alta quota.',
          'Il divieto di camminare nei mesi estivi.',
        ],
        correctIndex: 1,
        explanation:
          'È stata introdotta "la prenotazione obbligatoria per le navette che conducono ai rifugi più frequentati".',
      },
      {
        id: 'cils-sim-4-q2',
        section: 'reading',
        passageTitle: 'Sentieri di montagna e numero chiuso',
        passageText:
          'Per proteggere i pascoli alpini e ridurre il sovraffollamento estivo, alcuni parchi naturali delle Dolomiti hanno introdotto la prenotazione obbligatoria per le navette che conducono ai rifugi più frequentati. L’iniziativa ha diminuito sensibilmente le code di automobili lungo i tornanti e ha permesso ai visitatori di godersi i sentieri in maggiore tranquillità, incoraggiando allo stesso tempo la scoperta di vallate meno conosciute.',
        prompt: 'Quale effetto collaterale positivo ha avuto questa scelta?',
        options: [
          'I turisti hanno iniziato a esplorare anche valli meno note.',
          'I prezzi dei rifugi sono raddoppiati.',
          'Sono stati costruiti nuovi alberghi sui pascoli.',
          'Le navette viaggiano ora senza conducente.',
        ],
        correctIndex: 0,
        explanation:
          'Ha incoraggiato "allo stesso tempo la scoperta di vallate meno conosciute".',
      },
      {
        id: 'cils-sim-4-q3',
        section: 'listening',
        audioText:
          'Guida: Domattina partiamo dal rifugio alle sette in punto per evitare i temporali pomeridiani. Portate almeno un litro e mezzo d’acqua, giacca impermeabile e scarponi con suola scolpita: chi indossa scarpe da ginnastica lisce non potrà salire sul tratto roccioso per ragioni di sicurezza.',
        audioPlaysLimit: 2,
        prompt: 'Perché la partenza è fissata alle sette del mattino?',
        options: [
          'Perché il rifugio chiude alle otto.',
          'Perché la guida ha un altro impegno a mezzogiorno.',
          'Per prendere la prima navetta della giornata.',
          'Per evitare possibili temporali nel pomeriggio.',
        ],
        correctIndex: 3,
        explanation:
          'Partono alle sette "per evitare i temporali pomeridiani".',
      },
      {
        id: 'cils-sim-4-q4',
        section: 'listening',
        audioText:
          'Guida: Domattina partiamo dal rifugio alle sette in punto per evitare i temporali pomeridiani. Portate almeno un litro e mezzo d’acqua, giacca impermeabile e scarponi con suola scolpita: chi indossa scarpe da ginnastica lisce non potrà salire sul tratto roccioso per ragioni di sicurezza.',
        audioPlaysLimit: 2,
        prompt: 'Chi non potrà percorrere il tratto roccioso?',
        options: [
          'Chi ha una giacca impermeabile.',
          'Chi porta scarpe da ginnastica con suola liscia.',
          'Chi ha solo un litro e mezzo d’acqua.',
          'Chi non ha prenotato la cena al rifugio.',
        ],
        correctIndex: 1,
        explanation:
          '"Chi indossa scarpe da ginnastica lisce non potrà salire sul tratto roccioso per ragioni di sicurezza."',
      },
      {
        id: 'cils-sim-4-q5',
        section: 'language_use',
        prompt: 'Scegli la preposizione corretta: "È vietato uscire _____ sentieri segnalati per non danneggiare la flora alpina."',
        options: [
          'dai',
          'sui',
          'nei',
          'con i',
        ],
        correctIndex: 0,
        explanation:
          'Il verbo "uscire" con valore di allontanamento si costruisce con "da" ("uscire dai sentieri").',
      },
      {
        id: 'cils-sim-4-q6',
        section: 'language_use',
        prompt: 'Completa correttamente: "Nonostante _____ previsto pioggia nel pomeriggio, la mattinata è rimasta limpida."',
        options: [
          'fosse',
          'era',
          'sarà',
          'sia stato',
        ],
        correctIndex: 0,
        explanation:
          '"Nonostante" richiede il congiuntivo; in correlazione con il passato ("è rimasta"), "fosse previsto" esprime anteriorità/contemporaneità nel passato.',
      },
    ],
    writingTask: {
      prompt:
        'CILS B2 — Lettera a un giornale: Scrivi una breve lettera per esprimere la tua opinione sull’introduzione del numero chiuso o della prenotazione obbligatoria nelle località naturali più fragili.',
      minWords: 130,
      rubricCriteria: [
        'Struttura chiara di lettera di opinione',
        'Argomenti equilibrati tra tutela ambientale e diritto alla visita',
        'Uso corretto di connettivi e congiuntivo',
        'Precisione lessicale',
      ],
      expectedKeywords: ['ambiente', 'turismo', 'prenotazione', 'tutela', 'sostenibile', 'visitatori'],
      modelAnswer:
        'Gentile Direttore,\n\nNegli ultimi anni il dibattito sulla prenotazione obbligatoria per accedere ai sentieri e alle spiagge più fragili è diventato sempre più acceso. Personalmente, ritengo che limitare gli ingressi giornalieri sia una misura necessaria per tutelare il patrimonio naturale.\n\nIl turismo di massa concentra migliaia di persone negli stessi luoghi durante poche settimane estive, causando erosione del suolo, traffico e accumulo di rifiuti. Regolare i flussi tramite navette prenotabili permette di proteggere gli ecosistemi e, allo stesso tempo, offre ai visitatori un’esperienza più autentica e silenziosa.\n\nNaturalmente, è fondamentale che le tariffe restino accessibili a tutti e che vengano valorizzati anche gli itinerari minori, così da distribuire i benefici economici su tutto il territorio.\n\nCordiali saluti,\nMatteo Conti',
    },
  },

  // =========================================================================
  // CELI (Italian — Università per Stranieri di Perugia, Simulations 1-4)
  // =========================================================================
  {
    id: 'celi-sim-1',
    examTypeId: 'celi',
    languageCode: 'it',
    simulationNumber: 1,
    title: 'CELI 2/3 — Simulazione 1: Cultura, cinema e tempo libero',
    targetCefr: 'B1',
    durationMinutes: 30,
    questions: [
      {
        id: 'celi-sim-1-q1',
        section: 'reading',
        passageTitle: 'Il ritorno dei cinema di quartiere',
        passageText:
          'Dopo anni di chiusure, alcune piccole sale cinematografiche di quartiere stanno tornando a riempirsi grazie a una programmazione curata: film indipendenti in lingua originale con sottotitoli, rassegne dedicate ai classici restaurati e incontri serali con registi e sceneggiatori. Gli spettatori apprezzano soprattutto l’atmosfera raccolta e la possibilità di fermarsi a discutere al termine della proiezione.',
        prompt: 'Come attirano il pubblico questi cinema di quartiere?',
        options: [
          'Proiettando solo film d’azione senza sottotitoli.',
          'Con film in lingua originale, classici restaurati e dibattiti.',
          'Offrendo popcorn gratuiti tutto il mese.',
          'Trasmettendo partite sportive ogni sera.',
        ],
        correctIndex: 1,
        explanation:
          'Grazie a film indipendenti in lingua originale, classici restaurati e incontri con registi.',
      },
      {
        id: 'celi-sim-1-q2',
        section: 'reading',
        passageTitle: 'Il ritorno dei cinema di quartiere',
        passageText:
          'Dopo anni di chiusure, alcune piccole sale cinematografiche di quartiere stanno tornando a riempirsi grazie a una programmazione curata: film indipendenti in lingua originale con sottotitoli, rassegne dedicate ai classici restaurati e incontri serali con registi e sceneggiatori. Gli spettatori apprezzano soprattutto l’atmosfera raccolta e la possibilità di fermarsi a discutere al termine della proiezione.',
        prompt: 'Che cosa gradiscono in particolare gli spettatori dopo il film?',
        options: [
          'Poter commentare e discutere insieme la proiezione.',
          'Uscire prima dei titoli di coda.',
          'Acquistare DVD scontati all’ingresso.',
          'Prenotare la sala per feste private.',
        ],
        correctIndex: 0,
        explanation:
          'Apprezzano "la possibilità di fermarsi a discutere al termine della proiezione".',
      },
      {
        id: 'celi-sim-1-q3',
        section: 'listening',
        audioText:
          'Biglietteria: Buonasera! Per lo spettacolo delle ventuno abbiamo ancora posti in galleria a otto euro, mentre la platea è esaurita. Se invece preferite la proiezione delle diciotto e trenta di domani, ci sono diversi posti centrali in platea.',
        audioPlaysLimit: 2,
        prompt: 'Quali posti sono rimasti disponibili per stasera alle 21:00?',
        options: [
          'Posti centrali in platea',
          'Solo posti in piedi',
          'Nessun posto disponibile',
          'Posti in galleria',
        ],
        correctIndex: 3,
        explanation:
          'Per le 21:00 ci sono "ancora posti in galleria a otto euro, mentre la platea è esaurita".',
      },
      {
        id: 'celi-sim-1-q4',
        section: 'listening',
        audioText:
          'Biglietteria: Buonasera! Per lo spettacolo delle ventuno abbiamo ancora posti in galleria a otto euro, mentre la platea è esaurita. Se invece preferite la proiezione delle diciotto e trenta di domani, ci sono diversi posti centrali in platea.',
        audioPlaysLimit: 2,
        prompt: 'A che ora è lo spettacolo di domani con posti in platea?',
        options: [
          'Alle 16:00',
          'Alle 18:30',
          'Alle 20:00',
          'Alle 21:00',
        ],
        correctIndex: 1,
        explanation:
          'La biglietteria cita "la proiezione delle diciotto e trenta di domani".',
      },
      {
        id: 'celi-sim-1-q5',
        section: 'language_use',
        prompt: 'Completa la frase: "Mi piace molto guardare i film in lingua originale _____ migliorare la pronuncia."',
        options: [
          'per',
          'da',
          'di',
          'sul',
        ],
        correctIndex: 0,
        explanation:
          '"Per + infinito" esprime il fine o lo scopo.',
      },
      {
        id: 'celi-sim-1-q6',
        section: 'language_use',
        prompt: 'Scegli il tempo verbale corretto: "Ieri sera, mentre _____ al cinema, ho incontrato un mio vecchio compagno di università."',
        options: [
          'andavo',
          'sono andato',
          'andrò',
          'vado',
        ],
        correctIndex: 0,
        explanation:
          'L’azione in corso nel passato interrotta da un evento puntuale richiede l’imperfetto ("andavo").',
      },
    ],
    writingTask: {
      prompt:
        'CELI — Messaggio a un amico: Racconta a un amico un film o uno spettacolo che hai visto di recente al cinema o a teatro, spiegando brevemente di cosa parla, cosa ti ha colpito e se glielo consigli.',
      minWords: 110,
      rubricCriteria: [
        'Tono spontaneo e coerente con un messaggio personale',
        'Uso corretto di passato prossimo e imperfetto',
        'Lessico appropriato per descrivere un film o spettacolo',
        'Chiarezza espositiva',
      ],
      expectedKeywords: ['film', 'regista', 'storia', 'cinema', 'consiglio', 'colpito'],
      modelAnswer:
        'Ciao Davide,\n\nIeri sera sono finalmente andato al cinema Nuovo a vedere il film indipendente di cui ti parlavo. È la storia di due fratelli che riaprono una vecchia tipografia in un piccolo paese di mare. All’inizio il ritmo sembra molto tranquillo, ma poi i dialoghi diventano davvero intensi ed emozionanti.\n\nQuello che mi ha colpito di più sono stati la fotografia e il fatto che, alla fine della proiezione, il regista sia rimasto in sala per rispondere alle domande del pubblico. Te lo consiglio assolutamente: se vuoi, possiamo andare insieme alla replica di domenica pomeriggio!\n\nUn abbraccio,\nLuca',
    },
  },
  {
    id: 'celi-sim-2',
    examTypeId: 'celi',
    languageCode: 'it',
    simulationNumber: 2,
    title: 'CELI 3 — Simulazione 2: Lavoro agile e benessere',
    targetCefr: 'B2',
    durationMinutes: 30,
    questions: [
      {
        id: 'celi-sim-2-q1',
        section: 'reading',
        passageTitle: 'Il diritto alla disconnessione',
        passageText:
          'Con la diffusione del lavoro da remoto, il confine tra orario d’ufficio e vita privata è diventato più sfumato. Per tutelare il riposo dei dipendenti, diversi contratti aziendali italiani prevedono ora il cosiddetto "diritto alla disconnessione": al di fuori della fascia concordata, il lavoratore non è tenuto a rispondere a email o messaggi di servizio, salvo emergenze formalmente definite. Secondo i sindacati, questa clausola riduce lo stress da reperibilità costante.',
        prompt: 'Che cosa garantisce il "diritto alla disconnessione"?',
        options: [
          'La possibilità di lavorare senza connessione internet.',
          'Il diritto di non rispondere a comunicazioni di lavoro fuori orario, salvo emergenze.',
          'Un mese extra di ferie retribuite ogni anno.',
          'L’eliminazione totale delle email interne.',
        ],
        correctIndex: 1,
        explanation:
          'Il lavoratore non è tenuto a rispondere a email o messaggi al di fuori della fascia concordata, salvo emergenze definite.',
      },
      {
        id: 'celi-sim-2-q2',
        section: 'reading',
        passageTitle: 'Il diritto alla disconnessione',
        passageText:
          'Con la diffusione del lavoro da remoto, il confine tra orario d’ufficio e vita privata è diventato più sfumato. Per tutelare il riposo dei dipendenti, diversi contratti aziendali italiani prevedono ora il cosiddetto "diritto alla disconnessione": al di fuori della fascia concordata, il lavoratore non è tenuto a rispondere a email o messaggi di servizio, salvo emergenze formalmente definite. Secondo i sindacati, questa clausola riduce lo stress da reperibilità costante.',
        prompt: 'Quale beneficio individuano i sindacati in questa misura?',
        options: [
          'Aumenta la durata delle riunioni mattutine.',
          'Obbliga tutti a tornare in ufficio cinque giorni su cinque.',
          'Riduce i costi dell’energia elettrica in azienda.',
          'Diminuisce la pressione legata al dover essere sempre reperibili.',
        ],
        correctIndex: 3,
        explanation:
          'Secondo i sindacati, "questa clausola riduce lo stress da reperibilità costante".',
      },
      {
        id: 'celi-sim-2-q3',
        section: 'listening',
        audioText:
          'Responsabile: Giulia, ho visto che hai inviato la relazione alle dieci di sera. Apprezzo molto il tuo impegno, ma ti ricordo che la nostra politica aziendale scoraggia l’invio di messaggi dopo le diciannove: puoi usare l’invio programmato per la mattina seguente alle nove.',
        audioPlaysLimit: 2,
        prompt: 'Cosa suggerisce il responsabile a Giulia?',
        options: [
          'Di lavorare più velocemente nel pomeriggio.',
          'Di programmare l’invio delle email serali per le nove del mattino.',
          'Di non scrivere più relazioni scritte.',
          'Di inviare i messaggi su un gruppo privato.',
        ],
        correctIndex: 1,
        explanation:
          'Le suggerisce di usare "l’invio programmato per la mattina seguente alle nove".',
      },
      {
        id: 'celi-sim-2-q4',
        section: 'listening',
        audioText:
          'Responsabile: Giulia, ho visto che hai inviato la relazione alle dieci di sera. Apprezzo molto il tuo impegno, ma ti ricordo che la nostra politica aziendale scoraggia l’invio di messaggi dopo le diciannove: puoi usare l’invio programmato per la mattina seguente alle nove.',
        audioPlaysLimit: 2,
        prompt: 'Da che ora l’azienda scoraggia l’invio di messaggi?',
        options: [
          'Dalle 17:00',
          'Dalle 18:00',
          'Dalle 19:00',
          'Dalle 22:00',
        ],
        correctIndex: 2,
        explanation:
          'La politica aziendale scoraggia l’invio di messaggi "dopo le diciannove".',
      },
      {
        id: 'celi-sim-2-q5',
        section: 'language_use',
        prompt: 'Scegli il connettivo corretto: "Il lavoro agile offre maggiore autonomia; _____, richiede regole chiare sugli orari."',
        options: [
          'tuttavia',
          'inoltre',
          'pertanto',
          'cioè',
        ],
        correctIndex: 0,
        explanation:
          '"Tuttavia" introduce una limitazione o un contrasto.',
      },
      {
        id: 'celi-sim-2-q6',
        section: 'language_use',
        prompt: 'Completa correttamente: "È opportuno che ogni azienda _____ fasce orarie ben definite."',
        options: [
          'stabilisce',
          'stabilisca',
          'stabilirà',
          'stabiliva',
        ],
        correctIndex: 1,
        explanation:
          'La forma impersonale "È opportuno che" richiede il congiuntivo presente ("stabilisca").',
      },
    ],
    writingTask: {
      prompt:
        'CELI 3 — Articolo / Opinione: Secondo te, il diritto alla disconnessione è facile da applicare nella realtà lavorativa di oggi o incontra ancora ostacoli culturali? Argomenta la tua risposta.',
      minWords: 140,
      rubricCriteria: [
        'Posizione chiara e argomentazione articolata',
        'Riferimento ad aspetti pratici e culturali',
        'Uso corretto di congiuntivo e connettivi',
        'Lessico preciso',
      ],
      expectedKeywords: ['disconnessione', 'orari', 'cultura aziendale', 'riposo', 'reperibilità', 'equilibrio'],
      modelAnswer:
        'Sebbene il diritto alla disconnessione sia ormai riconosciuto in molti contratti, la sua applicazione concreta incontra ancora diversi ostacoli di natura culturale. Spesso, infatti, non è la norma scritta a mancare, bensì l’abitudine condivisa di rispettarla.\n\nIn molte organizzazioni persiste l’idea implicita che rispondere rapidamente anche di sera dimostri maggiore dedizione. Questa pressione informale spinge soprattutto i lavoratori più giovani a controllare continuamente il telefono, vanificando i benefici del lavoro agile.\n\nAffinché la disconnessione diventi reale, è necessario che siano i dirigenti stessi a dare l’esempio, evitando richieste fuori orario e utilizzando l’invio programmato delle email. Solo un cambiamento nella cultura aziendale può garantire un autentico equilibrio tra lavoro e vita privata.',
    },
  },
  {
    id: 'celi-sim-3',
    examTypeId: 'celi',
    languageCode: 'it',
    simulationNumber: 3,
    title: 'CELI 4 — Simulazione 3: Architettura e rigenerazione urbana',
    targetCefr: 'C1',
    durationMinutes: 30,
    questions: [
      {
        id: 'celi-sim-3-q1',
        section: 'reading',
        passageTitle: 'Cortili verdi contro le isole di calore',
        passageText:
          'Nei quartieri più densamente edificati, l’asfalto e le superfici scure assorbono radiazione solare durante il giorno e rilasciano calore nelle ore notturne, generando il fenomeno delle isole di calore urbane. Per contrastarlo, diverse amministrazioni incentivano la depavimentazione dei cortili scolastici e delle piazze secondarie, sostituendo il cemento con aiuole permeabili e alberi a chioma ampia che migliorano anche il drenaggio delle piogge intense.',
        prompt: 'Quale doppio beneficio offre la sostituzione del cemento con aree verdi permeabili?',
        options: [
          'Aumenta i posti auto e riduce i costi dell’asfalto.',
          'Accelera la circolazione delle automobili.',
          'Elimina la necessità di illuminazione stradale.',
          'Mitiga il calore notturno e facilita l’assorbimento delle piogge forti.',
        ],
        correctIndex: 3,
        explanation:
          'Contrasta le isole di calore e "migliora anche il drenaggio delle piogge intense".',
      },
      {
        id: 'celi-sim-3-q2',
        section: 'reading',
        passageTitle: 'Cortili verdi contro le isole di calore',
        passageText:
          'Nei quartieri più densamente edificati, l’asfalto e le superfici scure assorbono radiazione solare durante il giorno e rilasciano calore nelle ore notturne, generando il fenomeno delle isole di calore urbane. Per contrastarlo, diverse amministrazioni incentivano la depavimentazione dei cortili scolastici e delle piazze secondarie, sostituendo il cemento con aiuole permeabili e alberi a chioma ampia che migliorano anche il drenaggio delle piogge intense.',
        prompt: 'Cosa provoca principalmente il fenomeno delle isole di calore?',
        options: [
          'La presenza eccessiva di alberi a chioma ampia.',
          'L’accumulo di calore diurno da parte di asfalto e superfici scure.',
          'La depavimentazione dei cortili scolastici.',
          'Il drenaggio troppo rapido dell’acqua piovana.',
        ],
        correctIndex: 1,
        explanation:
          'L’asfalto e le superfici scure assorbono radiazione di giorno e rilasciano calore di notte.',
      },
      {
        id: 'celi-sim-3-q3',
        section: 'listening',
        audioText:
          'Urbanista: Nel progetto pilota della scuola media Verdi abbiamo rimosso quattrocento metri quadrati di asfalto dal cortile. Oltre a ridurre di tre gradi la temperatura percepita a giugno, lo spazio ombreggiato è diventato un’aula all’aperto usata per le lezioni di scienze.',
        audioPlaysLimit: 2,
        prompt: 'Di quanto è diminuita la temperatura percepita nel cortile a giugno?',
        options: [
          'Di un grado',
          'Di tre gradi',
          'Di dieci gradi',
          'Non è cambiata',
        ],
        correctIndex: 1,
        explanation:
          'L’urbanista afferma che ha ridotto "di tre gradi la temperatura percepita a giugno".',
      },
      {
        id: 'celi-sim-3-q4',
        section: 'listening',
        audioText:
          'Urbanista: Nel progetto pilota della scuola media Verdi abbiamo rimosso quattrocento metri quadrati di asfalto dal cortile. Oltre a ridurre di tre gradi la temperatura percepita a giugno, lo spazio ombreggiato è diventato un’aula all’aperto usata per le lezioni di scienze.',
        audioPlaysLimit: 2,
        prompt: 'Come viene utilizzato il nuovo spazio ombreggiato dagli studenti?',
        options: [
          'Come parcheggio per le biciclette',
          'È chiuso durante le ore scolastiche',
          'Solo per le gare di corsa',
          'Come aula all’aperto per le lezioni di scienze',
        ],
        correctIndex: 3,
        explanation:
          'È diventato "un’aula all’aperto usata per le lezioni di scienze".',
      },
      {
        id: 'celi-sim-3-q5',
        section: 'language_use',
        prompt: 'Scegli l’espressione più appropriata al livello C1: "La rigenerazione dei cortili scolastici _____ un intervento rapido ed efficace contro il caldo estivo."',
        options: [
          'si configura come',
          'si fa avanti con',
          'si tira indietro da',
          'si mette in bocca',
        ],
        correctIndex: 0,
        explanation:
          '"Configurarsi come" è una forma elegante e precisa di livello C1 per indicare "rappresentare / risultare essere".',
      },
      {
        id: 'celi-sim-3-q6',
        section: 'language_use',
        prompt: 'Completa la frase ipotetica: "Laddove i comuni _____ più superfici permeabili, diminuirebbero anche i rischi di allagamento."',
        options: [
          'creano',
          'creassero',
          'creeranno',
          'hanno creato',
        ],
        correctIndex: 1,
        explanation:
          '"Laddove" con valore ipotetico in correlazione con il condizionale ("diminuirebbero") richiede il congiuntivo imperfetto ("creassero").',
      },
    ],
    writingTask: {
      prompt:
        'CELI 4 — Saggio argomentativo: Perché le città contemporanee dovrebbero ripensare i propri spazi pubblici privilegiando il verde e la permeabilità del suolo rispetto all’asfalto? Illustra le ragioni climatiche, sociali ed economiche.',
      minWords: 160,
      rubricCriteria: [
        'Struttura saggistica avanzata di livello C1',
        'Integrazione di argomenti climatici, sociali ed economici',
        'Lessico tecnico-urbanistico preciso',
        'Piena padronanza sintattica',
      ],
      expectedKeywords: ['isole di calore', 'permeabilità', 'spazi pubblici', 'drenaggio', 'benessere', 'investimento'],
      modelAnswer:
        'Per decenni la pianificazione urbana ha privilegiato l’impermeabilizzazione del suolo, ricoprendo piazze e cortili con distese continue di asfalto e cemento. Oggi, di fronte all’intensificarsi delle ondate di calore e delle precipitazioni estreme, ripensare gli spazi pubblici in chiave verde non è più un lusso estetico, bensì una necessità strutturale.\n\nSul piano climatico, la depavimentazione attenua le isole di calore e facilita l’assorbimento dell’acqua piovana, riducendo i danni da allagamento. Sotto il profilo sociale, cortili ombreggiati e piazze alberate restituiscono luoghi di incontro sicuri per bambini e anziani anche nei mesi più caldi.\n\nInfine, dal punto di vista economico, tali interventi risultano più vantaggiosi rispetto ai costi sanitari ed energetici legati al raffrescamento artificiale. Investire nella permeabilità urbana significa dunque rendere le città più resilienti e vivibili nel lungo periodo.',
    },
  },
  {
    id: 'celi-sim-4',
    examTypeId: 'celi',
    languageCode: 'it',
    simulationNumber: 4,
    title: 'CELI 3 — Simulazione 4: Lingua, media e lettura',
    targetCefr: 'B2',
    durationMinutes: 30,
    questions: [
      {
        id: 'celi-sim-4-q1',
        section: 'reading',
        passageTitle: 'Audiolibri e nuove abitudini di lettura',
        passageText:
          'Il mercato italiano degli audiolibri ha registrato una crescita costante negli ultimi cinque anni, spinto soprattutto dai pendolari che ascoltano romanzi e saggi durante gli spostamenti quotidiani. Gli editori notano che l’audio non sostituisce il libro cartaceo, ma spesso lo affianca: molti ascoltatori acquistano in seguito l’edizione stampata delle opere che hanno apprezzato di più.',
        prompt: 'Chi traina maggiormente il consumo di audiolibri secondo il testo?',
        options: [
          'Gli studenti universitari durante gli esami scritti.',
          'I pendolari durante i tragitti giornalieri.',
          'Le librerie indipendenti durante le fiere.',
          'Gli autori che registrano le proprie opere.',
        ],
        correctIndex: 1,
        explanation:
          'La crescita è spinta soprattutto "dai pendolari che ascoltano romanzi e saggi durante gli spostamenti quotidiani".',
      },
      {
        id: 'celi-sim-4-q2',
        section: 'reading',
        passageTitle: 'Audiolibri e nuove abitudini di lettura',
        passageText:
          'Il mercato italiano degli audiolibri ha registrato una crescita costante negli ultimi cinque anni, spinto soprattutto dai pendolari che ascoltano romanzi e saggi durante gli spostamenti quotidiani. Gli editori notano che l’audio non sostituisce il libro cartaceo, ma spesso lo affianca: molti ascoltatori acquistano in seguito l’edizione stampata delle opere che hanno apprezzato di più.',
        prompt: 'Qual è il rapporto tra audiolibri e libri di carta descritto dagli editori?',
        options: [
          'L’audiolibro sta facendo scomparire la stampa.',
          'I saggi non vengono mai pubblicati in formato audio.',
          'Chi ascolta audiolibri non compra mai libri cartacei.',
          'I due formati convivono e si rafforzano a vicenda.',
        ],
        correctIndex: 3,
        explanation:
          'L’audio non sostituisce il libro cartaceo, ma spesso lo affianca e porta ad acquistare l’edizione stampata.',
      },
      {
        id: 'celi-sim-4-q3',
        section: 'listening',
        audioText:
          'Conduttrice: Questa sera al circolo dei lettori ospitiamo la doppiatrice Elena Conti, che ci parlerà di come si dà voce a un romanzo. L’ingresso è libero fino a esaurimento posti, ma chi possiede la tessera del circolo può prenotare una sedia nelle prime tre file scrivendo entro le sedici.',
        audioPlaysLimit: 2,
        prompt: 'Chi può prenotare un posto nelle prime tre file?',
        options: [
          'Chiunque arrivi prima delle sedici.',
          'Solo chi ha la tessera del circolo e scrive entro le 16:00.',
          'Esclusivamente gli studenti di teatro.',
          'Nessuno, i posti sono tutti liberi senza prenotazione.',
        ],
        correctIndex: 1,
        explanation:
          '"Chi possiede la tessera del circolo può prenotare una sedia nelle prime tre file scrivendo entro le sedici."',
      },
      {
        id: 'celi-sim-4-q4',
        section: 'listening',
        audioText:
          'Conduttrice: Questa sera al circolo dei lettori ospitiamo la doppiatrice Elena Conti, che ci parlerà di come si dà voce a un romanzo. L’ingresso è libero fino a esaurimento posti, ma chi possiede la tessera del circolo può prenotare una sedia nelle prime tre file scrivendo entro le sedici.',
        audioPlaysLimit: 2,
        prompt: 'Di che cosa parlerà Elena Conti?',
        options: [
          'Di come si scrive un romanzo giallo.',
          'Del lavoro di dare voce a un libro.',
          'Della storia del cinema muto.',
          'Della gestione economica di una libreria.',
        ],
        correctIndex: 1,
        explanation:
          'Parlerà "di come si dà voce a un romanzo".',
      },
      {
        id: 'celi-sim-4-q5',
        section: 'language_use',
        prompt: 'Completa correttamente: "Pur _____ letto il romanzo anni fa, riascoltarlo in treno mi ha emozionato di nuovo."',
        options: [
          'avendo',
          'avere',
          'avessi',
          'ho',
        ],
        correctIndex: 0,
        explanation:
          '"Pur + gerundio composto" ("Pur avendo letto") esprime concessione con lo stesso soggetto.',
      },
      {
        id: 'celi-sim-4-q6',
        section: 'language_use',
        prompt: 'Scegli il pronome relativo giusto: "Il romanzo _____ ti parlavo ieri è disponibile anche in versione audio."',
        options: [
          'di cui',
          'che',
          'a cui',
          'in cui',
        ],
        correctIndex: 0,
        explanation:
          'Si parla "di" qualcosa, quindi il pronome relativo corretto è "di cui".',
      },
    ],
    writingTask: {
      prompt:
        'CELI 3 — Testo di opinione: Preferisci leggere libri su carta, su schermo digitale oppure ascoltare audiolibri? Confronta i vantaggi dei diversi formati e spiega quale si adatta meglio alle tue abitudini.',
      minWords: 130,
      rubricCriteria: [
        'Confronto chiaro tra almeno due formati di lettura',
        'Espressione personale ben motivata',
        'Coerenza e uso naturale dei connettivi',
        'Correttezza grammaticale di livello B2',
      ],
      expectedKeywords: ['lettura', 'cartaceo', 'audiolibro', 'concentrazione', 'spostamenti', 'formato'],
      modelAnswer:
        'Negli ultimi anni il modo di avvicinarsi ai libri si è moltiplicato, offrendo ai lettori la possibilità di scegliere tra carta, formato digitale e audiolibri. A mio avviso, ciascun supporto risponde a momenti diversi della giornata, anche se continuo a preferire il libro cartaceo per la lettura serale.\n\nDa un lato, l’audiolibro rappresenta un compagno prezioso sui mezzi pubblici o durante una passeggiata, perché permette di seguire una storia senza affaticare la vista. I lettori digitali, invece, risultano comodissimi in viaggio grazie al peso ridotto.\n\nTuttavia, quando desidero studiare un saggio o immergermi in un romanzo complesso, la carta resta insostituibile: sfogliare le pagine, sottolineare a matita e staccare dagli schermi favorisce una concentrazione più profonda.',
    },
  },
];
