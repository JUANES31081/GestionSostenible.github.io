// Mundial de la Sostenibilidad - Dataset y Configuración
// Basado en Bond, Morrison-Saunders & Pope (2012) "Sustainability assessment: the state of the art"

const MUNDIAL_DATA = {
  paperInfo: {
    authors: "Alan Bond, Angus Morrison-Saunders & Jenny Pope",
    year: 2012,
    title: "Sustainability assessment: the state of the art",
    journal: "Impact Assessment and Project Appraisal, 30:1, 53-62",
    doi: "10.1080/14615517.2012.661974"
  },
  
  positions: {
    ATAQUE: {
      id: "ATAQUE",
      title: "Ataque",
      icon: "fa-bullhorn",
      color: "from-amber-500 to-orange-600",
      borderColor: "border-amber-500",
      bgLight: "bg-amber-500/10",
      description: "Aprendizaje continuo, mejora adaptativa y reglas explícitas para gestionar compensaciones (trade-offs)."
    },
    DEFENSA: {
      id: "DEFENSA",
      title: "Defensa",
      icon: "fa-shield-halved",
      color: "from-emerald-500 to-teal-600",
      borderColor: "border-emerald-500",
      bgLight: "bg-emerald-500/10",
      description: "Definición contextual de sostenibilidad, integración de las dimensiones ambiental, social y económica, pluralismo y participación."
    },
    ARQUERO: {
      id: "ARQUERO",
      title: "Arquero",
      icon: "fa-hand",
      color: "from-blue-500 to-indigo-600",
      borderColor: "border-blue-500",
      bgLight: "bg-blue-500/10",
      description: "Capacidad de demostrar una contribución neta positiva a la sostenibilidad."
    }
  },

  credentials: {
    inglaterra: { username: "inglaterra", password: "Ing_Sus#2026", name: "Inglaterra", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" },
    australia: { username: "australia", password: "Aus_Eco*2026", name: "Australia Occidental", flag: "🇦🇺" },
    sudafrica: { username: "sudafrica", password: "Sud_Soc@2026", name: "Sudáfrica", flag: "🇿🇦" },
    canada: { username: "canada", password: "Can_Net&2026", name: "Canadá", flag: "🇨🇦" },
    admin: { username: "admin", password: "Mod_EAN$2026", name: "Moderador / Admin", flag: "⚖️" }
  },

  countries: {
    inglaterra: {
      id: "inglaterra",
      name: "Inglaterra",
      flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
      badgeColor: "bg-red-600 text-white",
      headerBg: "from-red-900/60 to-slate-900",
      description: "Evaluaciones basadas en la Directiva de Evaluación Ambiental Estratégica (SEA) de la Unión Europea.",
      cards: [
        {
          id: "ing-1",
          title: "Objetivos de sostenibilidad definidos desde el inicio",
          type: "FORTALEZA",
          isOptional: false,
          correctPosition: "DEFENSA",
          explanation: "Los objetivos se establecen tempranamente en el proceso y todas las actividades posteriores se dirigen a maximizar su cumplimiento, comparando alternativas según los beneficios netos que entregarían."
        },
        {
          id: "ing-2",
          title: "Público ausente",
          type: "DEBILIDAD",
          isOptional: false,
          correctPosition: "DEFENSA",
          explanation: "Las autoridades ambientales expertas deben ser consultadas en varias etapas y sus opiniones se toman en serio, pero el nivel de participación del público general es bajo."
        },
        {
          id: "ing-3",
          title: "Aprendizaje activo",
          type: "FORTALEZA",
          isOptional: false,
          correctPosition: "ATAQUE",
          explanation: "Los planificadores reportan beneficios indirectos como mayor comprensión de sus planes y de la sostenibilidad, e ideas para futuras rondas de planificación; académicos y consultores investigan activamente la práctica y promueven nuevos enfoques."
        },
        {
          id: "ing-4",
          title: "Sin contribución neta demostrable",
          type: "DEBILIDAD",
          isOptional: false,
          correctPosition: "ARQUERO",
          explanation: "Las evaluaciones generan cambios menores en los planes, no cambios en objetivos generales ni en enfoques amplios. Ayudan a reequilibrar los planes desde un sesgo socioeconómico, pero no garantizan sostenibilidad."
        },
        {
          id: "ing-5",
          title: "Costo alto",
          type: "DEBILIDAD",
          isOptional: true,
          correctPosition: "ARQUERO",
          explanation: "Las evaluaciones son bastante costosas, reflejando las exigencias detalladas y demandantes de la Directiva SEA. Se ubica en arquero porque compromete la viabilidad del proceso completo."
        }
      ]
    },

    australia: {
      id: "australia",
      name: "Australia Occidental",
      flag: "🇦🇺",
      badgeColor: "bg-amber-600 text-white",
      headerBg: "from-amber-900/60 to-slate-900",
      description: "Prácticas de evaluación de impacto de sostenibilidad desarrolladas caso por caso con aplicaciones pioneras de reglas de compensación.",
      cards: [
        {
          id: "aus-1",
          title: "Procesos hechos a la medida",
          type: "FORTALEZA",
          isOptional: false,
          correctPosition: "DEFENSA",
          explanation: "Los procesos se han desarrollado caso por caso, reflejando el contexto y una experticia en evolución."
        },
        {
          id: "aus-2",
          title: "Participación sin poder real",
          type: "DEBILIDAD",
          isOptional: false,
          correctPosition: "DEFENSA",
          explanation: "Las comunidades exigen cada vez más ser involucradas y tener influencia, pero la participación aún debe evolucionar desde el enfoque de 'consultar y comentar' hacia el involucramiento activo y el empoderamiento."
        },
        {
          id: "aus-3",
          title: "Reglas de trade-off aplicadas en la práctica",
          type: "FORTALEZA",
          isOptional: false,
          correctPosition: "ATAQUE",
          explanation: "En el proyecto South West Yarragadee el proponente intentó explícitamente aplicar las reglas de compensación de Gibson y dedicó un capítulo completo de su declaración de impacto de sostenibilidad a demostrar contribución neta."
        },
        {
          id: "aus-4",
          title: "Aprendizaje organizacional",
          type: "FORTALEZA",
          isOptional: false,
          correctPosition: "ATAQUE",
          explanation: "Hay evidencia clara de aprendizaje: la evaluación influyó directamente en el desarrollo de propuestas y generó aprendizaje organizacional para futuras aplicaciones."
        },
        {
          id: "aus-5",
          title: "No logra demostrar ganancias netas",
          type: "DEBILIDAD",
          isOptional: false,
          correctPosition: "ARQUERO",
          explanation: "Persisten retos con la integración, el manejo de compensaciones y la demostración de que la actividad de desarrollo entregará ganancias mutuamente reforzadas capaces de revertir las tendencias insostenibles."
        },
        {
          id: "aus-6",
          title: "Retroceso político",
          type: "DEBILIDAD",
          isOptional: true,
          correctPosition: "DEFENSA",
          explanation: "Tras 2006 la evaluación desapareció de la agenda gubernamental y la práctica se desplazó hacia formas impulsadas por el proponente, centradas en minimizar impactos negativos, reducir riesgo corporativo y mantener licencia social."
        }
      ]
    },

    sudafrica: {
      id: "sudafrica",
      name: "Sudáfrica",
      flag: "🇿🇦",
      badgeColor: "bg-emerald-700 text-white",
      headerBg: "from-emerald-900/60 to-slate-900",
      description: "Marco legal robusto sustentado en la NEMA de 1998 y la Constitución con amplios derechos de participación pública.",
      cards: [
        {
          id: "sud-1",
          title: "Sostenibilidad anclada en la ley",
          type: "FORTALEZA",
          isOptional: false,
          correctPosition: "DEFENSA",
          explanation: "La NEMA de 1998 define 'ambiente' y 'desarrollo sostenible' como principios que todos los organismos del Estado deben considerar; junto con los derechos ambientales de la Constitución y el Marco Nacional de Desarrollo Sostenible, sustentan una meta fuerte de desarrollo sostenible."
        },
        {
          id: "sud-2",
          title: "Participación amplia",
          type: "FORTALEZA",
          isOptional: false,
          correctPosition: "DEFENSA",
          explanation: "Existe provisión extensa de participación pública, acceso a la información y legitimación para actuar; la evidencia anecdótica sugiere que las partes interesadas y afectadas están satisfechas con las oportunidades ofrecidas."
        },
        {
          id: "sud-3",
          title: "Rigidez procedimental",
          type: "DEBILIDAD",
          isOptional: false,
          correctPosition: "DEFENSA",
          explanation: "El proceso se caracteriza por una inflexibilidad procedimental que reduce la flexibilidad y la creatividad en la toma de decisiones."
        },
        {
          id: "sud-4",
          title: "Aprendizaje desordenado",
          type: "DEBILIDAD",
          isOptional: false,
          correctPosition: "ATAQUE",
          explanation: "El aprendizaje de todos los actores ocurre de manera incremental y confusa, aunque el debate se ha desplazado hacia preguntas serias sobre valor agregado y efectividad."
        },
        {
          id: "sud-5",
          title: "Sin influencia verificable en las decisiones",
          type: "DEBILIDAD",
          isOptional: false,
          correctPosition: "ARQUERO",
          explanation: "No hay evidencia de cambios en las decisiones ni en el contenido de los planes, aunque sí de efectos indirectos sustanciales más allá de proyectos específicos."
        }
      ]
    },

    canada: {
      id: "canada",
      name: "Canadá",
      flag: "🇨🇦",
      badgeColor: "bg-rose-700 text-white",
      headerBg: "from-rose-900/60 to-slate-900",
      description: "Pruebas exigentes de contribución neta positiva con criterios avanzados específicos al contexto.",
      cards: [
        {
          id: "can-1",
          title: "Criterios integrados y específicos al contexto",
          type: "FORTALEZA",
          isOptional: false,
          correctPosition: "DEFENSA",
          explanation: "Las evaluaciones más avanzadas adoptan criterios comprehensivos basados en sostenibilidad y los especifican para cada caso y contexto, considerando efectos interactivos y compensaciones. El artículo aclara que esto sigue siendo poco frecuente."
        },
        {
          id: "can-2",
          title: "Participación robusta",
          type: "FORTALEZA",
          isOptional: false,
          correctPosition: "DEFENSA",
          explanation: "El involucramiento de actores está bien establecido en los procesos canadienses, a veces con financiación para intervinientes, y los procesos mayores con audiencias públicas son muy participativos."
        },
        {
          id: "can-3",
          title: "Aprendizaje institucional frenado",
          type: "DEBILIDAD",
          isOptional: false,
          correctPosition: "ATAQUE",
          explanation: "El aprendizaje de los participantes sobre asuntos sustantivos y sobre cómo ejercer influencia es evidente, pero el aprendizaje institucional se ha visto ralentizado por la resistencia a resultados que desafían supuestos y prácticas convencionales."
        },
        {
          id: "can-4",
          title: "El más cercano a la contribución neta",
          type: "FORTALEZA",
          isOptional: false,
          correctPosition: "ARQUERO",
          explanation: "Aplica una prueba mucho más exigente, contribución positiva a la sostenibilidad en lugar de mitigación de efectos adversos, lo que ha llevado al rechazo de proyectos mayores y a efectos sustanciales sobre la naturaleza de los proyectos aprobados."
        },
        {
          id: "can-5",
          title: "Procesos larguísimos",
          type: "DEBILIDAD",
          isOptional: true,
          correctPosition: "ARQUERO",
          explanation: "Algunas aplicaciones han sido muy prolongadas, en parte por su naturaleza compleja y por la necesidad de desarrollar procesos a la medida. Compromete la sostenibilidad del propio proceso."
        }
      ]
    }
  },

  idealTeam: {
    arquero: {
      countryId: "canada",
      countryName: "Canadá",
      flag: "🇨🇦",
      position: "ARQUERO",
      title: "El más cercano a la contribución neta",
      reason: "Es el único caso donde la exigencia de contribución positiva llevó al rechazo de proyectos mayores y modificó sustancialmente los aprobados."
    },
    defensa1: {
      countryId: "sudafrica",
      countryName: "Sudáfrica",
      flag: "🇿🇦",
      position: "DEFENSA",
      title: "Sostenibilidad anclada en la ley",
      reason: "Por el respaldo legal de la NEMA de 1998 y la Constitución, y por su amplia provisión de participación y acceso a la información."
    },
    defensa2: {
      countryId: "inglaterra",
      countryName: "Inglaterra",
      flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
      position: "DEFENSA",
      title: "Objetivos definidos desde el inicio",
      reason: "Por establecer los objetivos de sostenibilidad desde el inicio del proceso y dirigir hacia ellos todas las actividades posteriores."
    },
    ataque1: {
      countryId: "australia",
      countryName: "Australia Occidental",
      flag: "🇦🇺",
      position: "ATAQUE",
      title: "Reglas de trade-off aplicadas en la práctica",
      reason: "Por haber aplicado en la práctica las reglas de compensación de Gibson en el proyecto South West Yarragadee."
    },
    ataque2: {
      countryId: "inglaterra",
      countryName: "Inglaterra",
      flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
      position: "ATAQUE",
      title: "Aprendizaje activo de planificadores y académicos",
      reason: "Por el aprendizaje reportado por planificadores, académicos y consultores. Inglaterra juega en dos posiciones: hace de todo, pero no marca goles solos."
    }
  },

  stateOfTheArtCriteria: [
    {
      id: 1,
      name: "Contribución Neta Positiva",
      position: "ARQUERO",
      description: "Generar ganancias netas positivas en lugar de solo reducir o mitigar impactos negativos.",
      icon: "fa-bullseye"
    },
    {
      id: 2,
      name: "Definición Contextual & Integración 3D",
      position: "DEFENSA",
      description: "Establecer sostenibilidad caso a caso e integrar armónicamente dimensiones ambiental, social y económica.",
      icon: "fa-cubes"
    },
    {
      id: 3,
      name: "Reglas de Trade-Off Explícitas",
      position: "ATAQUE",
      description: "Gobernar las compensaciones de forma transparente, abierta, participativa y con reglas claras.",
      icon: "fa-scale-balanced"
    },
    {
      id: 4,
      name: "Pluralismo & Participación",
      position: "DEFENSA",
      description: "Reconocer visiones múltiples y empoderar activamente a las comunidades e intervinientes.",
      icon: "fa-users"
    },
    {
      id: 5,
      name: "Aprendizaje Continuo & Adaptativo",
      position: "ATAQUE",
      description: "Promover el aprendizaje institucional y social para evolucionar las políticas hacia la sostenibilidad.",
      icon: "fa-brain"
    }
  ],

  noWinnerExplanation: `Ningún país cumple cabalmente las cinco condiciones del estado del arte definidas por Bond, Morrison-Saunders & Pope (2012). Aunque el potencial de la evaluación de sostenibilidad para dirigir la toma de decisiones es claro, aún falta un largo camino antes de afirmar que se están logrando resultados verdaderamente sostenibles. La barrera más significativa en cualquier jurisdicción es la falta de comprensión sobre la necesidad de incorporar el aprendizaje continuo y acoger las visiones de todas las partes desde el encuadre inicial.`
};
