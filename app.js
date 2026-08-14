// Mundial de la Sostenibilidad - Logica Principal de la Aplicación
// Basado en Bond, Morrison-Saunders & Pope (2012)

const STORAGE_KEYS = {
  SESSION: "mundial_sostenibilidad_session",
  SUBMISSIONS: "mundial_sostenibilidad_submissions",
  TEAMS_GENERATED: "mundial_sostenibilidad_teams_generated"
};

const APP_PUBLIC_URL = "https://juanes31081.github.io/GestionSostenible.github.io/";

// Estado Global de la App
const state = {
  currentUser: null, // { type: 'country' | 'admin', countryId?: string }
  submissions: {},   // { inglaterra: { ATAQUE: [], DEFENSA: [], ARQUERO: [], pool: [], submittedAt: ... }, ... }
  generatedTeams: null,
  sortableInstances: {},
  radarChartInstance: null
};

// Inicialización de la aplicación
document.addEventListener("DOMContentLoaded", () => {
  loadStateFromStorage();
  setupEventListeners();
  renderCurrentView();
});

// Carga del estado guardado en localStorage
function loadStateFromStorage() {
  const savedSession = localStorage.getItem(STORAGE_KEYS.SESSION);
  if (savedSession) {
    try {
      state.currentUser = JSON.parse(savedSession);
    } catch (e) {
      state.currentUser = null;
    }
  }

  const savedSubmissions = localStorage.getItem(STORAGE_KEYS.SUBMISSIONS);
  if (savedSubmissions) {
    try {
      state.submissions = JSON.parse(savedSubmissions);
    } catch (e) {
      state.submissions = {};
    }
  }

  const savedTeams = localStorage.getItem(STORAGE_KEYS.TEAMS_GENERATED);
  if (savedTeams) {
    try {
      state.generatedTeams = JSON.parse(savedTeams);
    } catch (e) {
      state.generatedTeams = null;
    }
  }
}

// Guardar cambios en localStorage
function saveSubmissionsToStorage() {
  localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(state.submissions));
}

function saveSessionToStorage() {
  if (state.currentUser) {
    localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(state.currentUser));
  } else {
    localStorage.removeItem(STORAGE_KEYS.SESSION);
  }
}

// Enrutador de vistas
function renderCurrentView() {
  const viewContainer = document.getElementById("app-view");
  if (!viewContainer) return;

  if (!state.currentUser) {
    renderIndexView(viewContainer);
  } else if (state.currentUser.type === "admin") {
    renderAdminView(viewContainer);
  } else if (state.currentUser.type === "country") {
    renderCountryBoardView(viewContainer, state.currentUser.countryId);
  }
}

// Listeners Globales
function setupEventListeners() {
  document.addEventListener("click", (e) => {
    if (e.target.closest("[data-action='logout']")) {
      logout();
    }
  });
}

// Cerrar sesión
function logout() {
  state.currentUser = null;
  saveSessionToStorage();
  renderCurrentView();
  Swal.fire({
    title: "Sesión cerrada",
    text: "Has salido de la sesión actual.",
    icon: "info",
    timer: 1500,
    showConfirmButton: false,
    toast: true,
    position: "top-end"
  });
}

/* ==========================================================================
   1. VISTA ÍNDICE / PRINCIPAL (Selección de País y Generador)
   ========================================================================== */
function renderIndexView(container) {
  container.innerHTML = `
    <div class="space-y-12 animate-fade-in">
      
      <!-- Banner Hero Header -->
      <header class="text-center max-w-4xl mx-auto pt-6 px-4">
        <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-semibold mb-4">
          <i class="fa-solid fa-trophy text-amber-400"></i>
          Mundial de la Sostenibilidad • Bond, Morrison-Saunders & Pope (2012)
        </div>
        <h1 class="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-4 leading-tight">
          Evaluación de Sostenibilidad <br/>
          <span class="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
            Juego Táctico de Tarjetas
          </span>
        </h1>
        <p class="text-gray-300 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
          Compara el desempeño de 4 países en el estado del arte de la sostenibilidad. Asigna estratégicamente las fortalezas y debilidad en las posiciones tácticas de <strong>Ataque</strong>, <strong>Defensa</strong> y <strong>Arquero</strong>.
        </p>
      </header>

      <!-- Barra de Acciones Superior -->
      <div class="flex flex-wrap justify-center gap-3">
        <button onclick="openGuideModal()" class="px-6 py-2.5 rounded-xl bg-emerald-900/60 hover:bg-emerald-800/70 border border-emerald-600/50 text-emerald-200 font-semibold text-sm transition flex items-center gap-2 shadow-lg">
          <i class="fa-solid fa-book-open text-emerald-400"></i>
          Guía Didáctica de la Actividad
        </button>
        <button onclick="openAdminLoginModal()" class="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-gray-200 font-semibold text-sm transition flex items-center gap-2 shadow-lg">
          <i class="fa-solid fa-user-shield text-amber-400"></i>
          Acceso Exclusivo para Moderadores / Docentes
        </button>
      </div>

      <!-- Selección de Países (Tarjetas de Equipos) -->
      <section class="max-w-6xl mx-auto px-4">
        <h2 class="text-2xl font-bold text-white mb-6 flex items-center gap-3">
          <i class="fa-solid fa-flag text-emerald-400"></i>
          Selecciona tu País Asignado
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          ${Object.values(MUNDIAL_DATA.countries).map(country => {
            const isSubmitted = state.submissions[country.id]?.submittedAt;
            return `
              <div class="glass-card rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between group border border-slate-700/60 hover:border-emerald-500/50">
                <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${country.headerBg} rounded-bl-full opacity-30 group-hover:opacity-50 transition-opacity"></div>
                
                <div>
                  <div class="flex items-center justify-between mb-4">
                    <span class="text-4xl shadow-sm">${country.flag}</span>
                    ${isSubmitted ? `
                      <span class="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-bold flex items-center gap-1">
                        <i class="fa-solid fa-check"></i> Enviado
                      </span>
                    ` : `
                      <span class="px-2.5 py-1 rounded-full bg-slate-800 text-gray-400 border border-slate-700 text-xs font-medium">
                        Pendiente
                      </span>
                    `}
                  </div>

                  <h3 class="text-2xl font-bold text-white mb-2">${country.name}</h3>
                  <p class="text-gray-400 text-xs leading-relaxed mb-6">
                    ${country.description}
                  </p>
                </div>

                <button onclick="openCountryLoginModal('${country.id}')" class="w-full py-3 px-4 rounded-xl ${country.badgeColor} font-bold text-sm flex items-center justify-center gap-2 shadow-md hover:brightness-110 transition">
                  <i class="fa-solid fa-key text-xs"></i>
                  Ingresar a ${country.name}
                </button>
              </div>
            `;
          }).join('')}
        </div>
      </section>

      <!-- Generador de Equipos Aleatorios -->
      <section class="max-w-6xl mx-auto px-4 pt-6">
        <div class="glass-panel rounded-3xl p-8 border border-slate-700/60 shadow-2xl">
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h2 class="text-2xl font-bold text-white flex items-center gap-3">
                <i class="fa-solid fa-shuffle text-amber-400"></i>
                Generador de Equipos Aleatorios
              </h2>
              <p class="text-gray-400 text-sm mt-1">
                Ingresa la lista de personas asistentes y el sistema las asignará de forma equitativa y aleatoria a los 4 países.
              </p>
            </div>
            ${state.generatedTeams ? `
              <button onclick="resetGeneratedTeams()" class="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-gray-300 text-xs font-semibold flex items-center gap-2 self-start md:self-auto">
                <i class="fa-solid fa-rotate-left"></i> Limpiar Asignación
              </button>
            ` : ''}
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <!-- Formulario de Entrada -->
            <div class="lg:col-span-5 space-y-4">
              <label class="block text-sm font-semibold text-gray-300">
                Nombres de los participantes (uno por línea o separados por coma):
              </label>
              <textarea id="participant-names" rows="6" placeholder="Juan Perez&#10;Maria Gomez&#10;Carlos Rodriguez&#10;Ana Martinez&#10;Luis Hernandez..." class="w-full p-4 rounded-2xl bg-slate-900/90 border border-slate-700 text-gray-100 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition resize-none"></textarea>
              
              <button onclick="generateRandomTeams()" class="w-full py-3.5 px-6 rounded-xl btn-glow-green text-white font-bold text-sm flex items-center justify-center gap-2">
                <i class="fa-solid fa-dice text-base"></i>
                Sorteo Aleatorio de Países
              </button>
            </div>

            <!-- Resultado del Sorteo -->
            <div class="lg:col-span-7 bg-slate-900/60 rounded-2xl p-6 border border-slate-800 flex flex-col justify-between">
              <div id="teams-result-container">
                ${renderTeamsResultHTML()}
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Sección QR de Acceso Rápido -->
      <section class="max-w-6xl mx-auto px-4">
        <div class="qr-share-panel rounded-3xl p-6 md:p-8 border border-cyan-400/30 shadow-2xl overflow-hidden relative">
          <div class="qr-wave qr-wave-1"></div>
          <div class="qr-wave qr-wave-2"></div>

          <div class="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div class="lg:col-span-7">
              <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-400/30 text-cyan-200 text-xs font-semibold mb-4">
                <i class="fa-solid fa-qrcode text-cyan-300"></i>
                Acceso Rápido a la Plataforma
              </div>

              <h2 class="text-2xl md:text-3xl font-extrabold text-white leading-tight mb-3">
                Escanea el QR y entra al
                <span class="text-cyan-300">Mundial de la Sostenibilidad</span>
              </h2>

              <p class="text-slate-300 text-sm md:text-base leading-relaxed max-w-2xl">
                Comparte este código en clase para que cualquier participante pueda abrir la actividad desde su celular en segundos.
                Ideal para iniciar la sesión sin escribir enlaces manualmente.
              </p>

              <div class="mt-5 flex flex-wrap gap-3">
                <a href="${APP_PUBLIC_URL}" target="_blank" rel="noopener noreferrer" class="px-5 py-2.5 rounded-xl bg-cyan-500/90 hover:bg-cyan-400 text-slate-950 font-bold text-sm transition shadow-lg shadow-cyan-500/30 flex items-center gap-2">
                  <i class="fa-solid fa-arrow-up-right-from-square"></i>
                  Abrir Sitio
                </a>
                <a href="${APP_PUBLIC_URL}" class="px-5 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-600 text-slate-200 font-semibold text-sm transition flex items-center gap-2">
                  <i class="fa-solid fa-link"></i>
                  ${APP_PUBLIC_URL}
                </a>
              </div>
            </div>

            <div class="lg:col-span-5 flex justify-center lg:justify-end">
              <div class="qr-frame pulse-glow">
                <div class="qr-ring qr-ring-1"></div>
                <div class="qr-ring qr-ring-2"></div>
                <div class="qr-code-shell">
                  <img
                    src="https://api.qrserver.com/v1/create-qr-code/?size=420x420&data=${encodeURIComponent(APP_PUBLIC_URL)}"
                    alt="Código QR para acceder al Mundial de la Sostenibilidad"
                    class="qr-image"
                    loading="lazy"
                  />
                </div>
                <p class="text-center text-xs text-cyan-100/90 mt-3 font-semibold tracking-wide">
                  Escanéame
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Breve Explicación Didáctica y Reglas del Juego -->
      <section class="max-w-6xl mx-auto px-4 pb-12">
        <div class="glass-panel rounded-3xl p-8 border border-slate-800">
          <h2 class="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <i class="fa-solid fa-circle-info text-cyan-400"></i>
            ¿Cómo Funciona la Actividad?
          </h2>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="bg-slate-900/70 p-6 rounded-2xl border border-slate-800 space-y-3">
              <div class="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-lg">
                1
              </div>
              <h3 class="text-lg font-bold text-white">Sorteo y Debate</h3>
              <p class="text-gray-400 text-xs leading-relaxed">
                Cada equipo ingresa a la sesión de su país. Recibirán tarjetas con características (fortalezas o debilidades) del marco legal y práctico de su país. Debaten en grupo a qué posición táctica corresponde cada tarjeta.
              </p>
            </div>

            <div class="bg-slate-900/70 p-6 rounded-2xl border border-slate-800 space-y-3">
              <div class="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-lg">
                2
              </div>
              <h3 class="text-lg font-bold text-white">Alineación en Cancha</h3>
              <p class="text-gray-400 text-xs leading-relaxed">
                Ubican las tarjetas en <strong>Ataque</strong> (aprendizaje y trade-offs), <strong>Defensa</strong> (integración, ley y participación) o <strong>Arquero</strong> (contribución neta positiva) arrastrando o usando el selector rápido de un clic.
              </p>
            </div>

            <div class="bg-slate-900/70 p-6 rounded-2xl border border-slate-800 space-y-3">
              <div class="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-lg">
                3
              </div>
              <h3 class="text-lg font-bold text-white">Síntesis y Debate Final</h3>
              <p class="text-gray-400 text-xs leading-relaxed">
                El docente/moderador revisa las respuestas de todos los equipos, explica hallazgos clave y abre la discusión final.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  `;
}

// Renderizado auxiliar de resultados de sorteo de equipos
function renderTeamsResultHTML() {
  if (!state.generatedTeams) {
    return `
      <div class="h-full flex flex-col items-center justify-center text-center p-8 text-gray-500">
        <i class="fa-solid fa-users-viewfinder text-5xl mb-3 opacity-40"></i>
        <p class="text-sm font-medium">Aún no se han generado equipos.</p>
        <p class="text-xs opacity-75 mt-1">Escribe los nombres de los participantes y haz clic en "Sorteo Aleatorio".</p>
      </div>
    `;
  }

  return `
    <div class="space-y-4">
      <div class="flex items-center justify-between border-b border-slate-800 pb-3">
        <span class="text-xs font-bold text-emerald-400 uppercase tracking-wider">Resultado del Sorteo de Equipos</span>
        <button onclick="window.print()" class="text-xs text-gray-400 hover:text-white flex items-center gap-1">
          <i class="fa-solid fa-print"></i> Imprimir / Guardar PDF
        </button>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        ${Object.entries(state.generatedTeams).map(([countryId, members]) => {
          const country = MUNDIAL_DATA.countries[countryId];
          return `
            <div class="bg-slate-800/80 p-4 rounded-xl border border-slate-700/60">
              <div class="flex items-center gap-2 mb-2 font-bold text-white text-sm">
                <span>${country.flag}</span>
                <span>${country.name}</span>
                <span class="ml-auto text-xs px-2 py-0.5 rounded-full bg-slate-900 text-gray-400 font-mono">${members.length} miembros</span>
              </div>
              <ul class="text-xs text-gray-300 space-y-1 list-disc list-inside">
                ${members.length > 0 ? members.map(m => `<li>${m}</li>`).join('') : '<li class="text-gray-500 italic list-none">Sin integrantes asignados</li>'}
              </ul>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

// Algoritmo de Generación Aleatoria de Equipos
function generateRandomTeams() {
  const inputElem = document.getElementById("participant-names");
  if (!inputElem) return;

  const rawText = inputElem.value.trim();
  if (!rawText) {
    Swal.fire("Atención", "Por favor ingresa al menos un nombre para realizar el sorteo.", "warning");
    return;
  }

  const names = rawText
    .split(/[\n,]+/)
    .map(n => n.trim())
    .filter(n => n.length > 0);

  if (names.length < 2) {
    Swal.fire("Atención", "Ingresa al menos 2 nombres para distribuir los equipos.", "warning");
    return;
  }

  // Mezclar lista de nombres (Fisher-Yates Shuffle)
  for (let i = names.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [names[i], names[j]] = [names[j], names[i]];
  }

  const countryKeys = Object.keys(MUNDIAL_DATA.countries);
  const result = {
    inglaterra: [],
    australia: [],
    sudafrica: [],
    canada: []
  };

  names.forEach((name, index) => {
    const targetCountry = countryKeys[index % countryKeys.length];
    result[targetCountry].push(name);
  });

  state.generatedTeams = result;
  localStorage.setItem(STORAGE_KEYS.TEAMS_GENERATED, JSON.stringify(result));

  const resultContainer = document.getElementById("teams-result-container");
  if (resultContainer) {
    resultContainer.innerHTML = renderTeamsResultHTML();
  }

  confetti({ particleCount: 80, spread: 60, origin: { y: 0.7 } });
}

function resetGeneratedTeams() {
  state.generatedTeams = null;
  localStorage.removeItem(STORAGE_KEYS.TEAMS_GENERATED);
  renderCurrentView();
}

/* ==========================================================================
   2. AUTENTICACIÓN Y MODALES
   ========================================================================== */
function openCountryLoginModal(countryId) {
  const country = MUNDIAL_DATA.countries[countryId];
  const creds = MUNDIAL_DATA.credentials[countryId];

  Swal.fire({
    title: `<span class="text-2xl">${country.flag}</span> Acceso — ${country.name}`,
    html: `
      <p class="text-xs text-gray-400 mb-4">Ingresa las credenciales provistas por tu docente para acceder a la cancha táctica de tu equipo.</p>
      <input type="text" id="login-user" class="swal2-input" placeholder="Usuario" style="margin: 0.5em auto;">
      <input type="password" id="login-pass" class="swal2-input" placeholder="Contraseña" style="margin: 0.5em auto;">
    `,
    showCancelButton: true,
    confirmButtonText: "Ingresar a Cancha",
    cancelButtonText: "Cancelar",
    confirmButtonColor: "#10b981",
    focusConfirm: false,
    preConfirm: () => {
      const user = document.getElementById("login-user").value.trim();
      const pass = document.getElementById("login-pass").value.trim();

      if (user === creds.username && pass === creds.password) {
        return { type: "country", countryId: countryId };
      } else {
        Swal.showValidationMessage("Usuario o contraseña incorrectos");
        return false;
      }
    }
  }).then((result) => {
    if (result.isConfirmed && result.value) {
      state.currentUser = result.value;
      saveSessionToStorage();
      renderCurrentView();
    }
  });
}

function openAdminLoginModal() {
  const creds = MUNDIAL_DATA.credentials.admin;

  Swal.fire({
    title: `⚖️ Panel de Moderador — Acceso`,
    html: `
      <p class="text-xs text-gray-400 mb-4">Acceso exclusivo para el docente/moderador.</p>
      <input type="text" id="admin-user" class="swal2-input" placeholder="Usuario" style="margin: 0.5em auto;">
      <input type="password" id="admin-pass" class="swal2-input" placeholder="Contraseña" style="margin: 0.5em auto;">
    `,
    showCancelButton: true,
    confirmButtonText: "Acceder a Panel Moderador",
    cancelButtonText: "Cancelar",
    confirmButtonColor: "#f59e0b",
    background: "#3a3f45",
    color: "#f3f4f6",
    customClass: { popup: "border border-slate-600" },
    focusConfirm: false,
    preConfirm: () => {
      const user = document.getElementById("admin-user").value.trim();
      const pass = document.getElementById("admin-pass").value.trim();
      if (user === creds.username && pass === creds.password) {
        return { type: "admin" };
      } else {
        Swal.showValidationMessage("Credenciales de administrador incorrectas");
        return false;
      }
    }
  }).then((result) => {
    if (result.isConfirmed && result.value) {
      state.currentUser = result.value;
      saveSessionToStorage();
      renderCurrentView();
    }
  });
}

/* ==========================================================================
   GUÍA DIDÁCTICA DE LA ACTIVIDAD
   ========================================================================== */
function openGuideModal() {
  const slides = [
    {
      icon: "fa-book-open", color: "text-emerald-400",
      title: "¿Qué es la Evaluación de Sostenibilidad?",
      content: `
        <p class="text-sm text-gray-300 leading-relaxed mb-3">
          La <strong class="text-white">evaluación de sostenibilidad</strong> es un enfoque reciente de la evaluación de impacto que busca generar
          <em>ganancias netas positivas</em> para la sostenibilidad hoy y en el futuro. No se limita a minimizar daños;
          exige demostrar que las decisiones <strong class="text-emerald-400">mejoran activamente</strong> las condiciones sociales, económicas y ambientales.
        </p>
        <p class="text-sm text-gray-300 leading-relaxed mb-3">
          Según <strong>Bond, Morrison-Saunders &amp; Pope (2012)</strong>, puede aplicarse a cualquier tipo de decisión, adopta muchas formas
          y es <strong class="text-amber-400">fundamentalmente pluralista</strong>: reconoce que distintos actores tienen visiones legítimas sobre qué
          es sostenible y cómo lograrlo.
        </p>
        <div class="bg-slate-800 p-4 rounded-xl border border-slate-700 text-xs text-gray-300 space-y-2 mb-3">
          <strong class="text-cyan-300 block">Explicación superficial del artículo (lectura rápida):</strong>
          <p>1) Muestra cómo surge la evaluación de sostenibilidad y por qué no basta con mitigar impactos.</p>
          <p>2) Propone 5 condiciones para hablar de "estado del arte" (ganancia neta, integración, trade-offs, pluralismo y aprendizaje).</p>
          <p>3) Compara práctica real en Inglaterra, Australia Occidental, Sudáfrica y Canadá.</p>
          <p>4) Concluye que hay avances, pero ningún caso cumple todo de forma completa y consistente.</p>
        </div>
        <div class="bg-slate-800 p-4 rounded-xl border border-slate-700 text-xs text-gray-400">
          <strong class="text-emerald-400 block mb-1">📄 Artículo base de la actividad:</strong>
          Bond, A., Morrison-Saunders, A., &amp; Pope, J. (2012). <em>Sustainability assessment: the state of the art.</em>
          Impact Assessment and Project Appraisal, 30(1), 53–62.
        </div>`
    },
    {
      icon: "fa-globe", color: "text-cyan-400",
      title: "Los 5 Criterios del Estado del Arte",
      content: `
        <p class="text-xs text-gray-400 mb-3">El artículo define 5 condiciones que un proceso de evaluación debe cumplir para considerarse "estado del arte". Ningún país las cumple todas —por eso no hay campeón:</p>
        <div class="space-y-2">
          <div class="flex items-start gap-2 p-2.5 rounded-lg bg-slate-800 border border-slate-700">
            <span class="text-amber-400 mt-0.5">①</span>
            <div><strong class="text-white text-xs">Contribución Neta Positiva</strong><p class="text-xs text-gray-400">Avanzar activamente hacia la sostenibilidad, no solo mitigar impactos negativos.</p></div>
          </div>
          <div class="flex items-start gap-2 p-2.5 rounded-lg bg-slate-800 border border-slate-700">
            <span class="text-emerald-400 mt-0.5">②</span>
            <div><strong class="text-white text-xs">Definición Contextual de Sostenibilidad</strong><p class="text-xs text-gray-400">Establecer qué significa sostenibilidad para cada caso concreto, integrando las 3 dimensiones.</p></div>
          </div>
          <div class="flex items-start gap-2 p-2.5 rounded-lg bg-slate-800 border border-slate-700">
            <span class="text-blue-400 mt-0.5">③</span>
            <div><strong class="text-white text-xs">Reglas Explícitas de Trade-Off</strong><p class="text-xs text-gray-400">Mecanismos formales para gestionar compensaciones de forma abierta, participativa y transparente.</p></div>
          </div>
          <div class="flex items-start gap-2 p-2.5 rounded-lg bg-slate-800 border border-slate-700">
            <span class="text-purple-400 mt-0.5">④</span>
            <div><strong class="text-white text-xs">Pluralismo y Participación Real</strong><p class="text-xs text-gray-400">Involucrar activamente a todas las partes desde el encuadre inicial del problema, no solo para "consultar".</p></div>
          </div>
          <div class="flex items-start gap-2 p-2.5 rounded-lg bg-slate-800 border border-slate-700">
            <span class="text-rose-400 mt-0.5">⑤</span>
            <div><strong class="text-white text-xs">Aprendizaje Continuo e Institucional</strong><p class="text-xs text-gray-400">Promover que organizaciones y actores aprendan y mejoren sus prácticas a través de cada evaluación.</p></div>
          </div>
        </div>`
    },
    {
      icon: "fa-flag", color: "text-amber-400",
      title: "Los 4 Países: Fortalezas y Debilidades Reales",
      content: `
        <p class="text-xs text-gray-400 mb-3">El artículo analiza cómo cada jurisdicción implementa la evaluación en la práctica real. Estas son las características clave de cada una:</p>
        <div class="grid grid-cols-2 gap-2 text-xs">
          <div class="bg-slate-800 p-3 rounded-xl border border-slate-700 space-y-1">
            <div class="font-bold text-white flex items-center gap-1">🏴󠁧󠁢󠁥󠁮󠁧󠁿 <span>Inglaterra</span></div>
            <p class="text-emerald-400">✓ Objetivos definidos desde inicio</p>
            <p class="text-emerald-400">✓ Aprendizaje activo de planificadores</p>
            <p class="text-red-400">✗ Baja participación pública</p>
            <p class="text-red-400">✗ Sin contribución neta demostrable</p>
          </div>
          <div class="bg-slate-800 p-3 rounded-xl border border-slate-700 space-y-1">
            <div class="font-bold text-white flex items-center gap-1">🇦🇺 <span>Australia Occ.</span></div>
            <p class="text-emerald-400">✓ Trade-offs aplicados en práctica</p>
            <p class="text-emerald-400">✓ Aprendizaje organizacional</p>
            <p class="text-red-400">✗ Participación sin poder real</p>
            <p class="text-red-400">✗ Retroceso político post-2006</p>
          </div>
          <div class="bg-slate-800 p-3 rounded-xl border border-slate-700 space-y-1">
            <div class="font-bold text-white flex items-center gap-1">🇿🇦 <span>Sudáfrica</span></div>
            <p class="text-emerald-400">✓ Ley NEMA 1998 y Constitución</p>
            <p class="text-emerald-400">✓ Participación pública amplia</p>
            <p class="text-red-400">✗ Rigidez procedimental</p>
            <p class="text-red-400">✗ Sin influencia verificable</p>
          </div>
          <div class="bg-slate-800 p-3 rounded-xl border border-slate-700 space-y-1">
            <div class="font-bold text-white flex items-center gap-1">🇨🇦 <span>Canadá</span></div>
            <p class="text-emerald-400">✓ Prueba de contribución neta</p>
            <p class="text-emerald-400">✓ Participación robusta</p>
            <p class="text-red-400">✗ Aprendizaje institucional frenado</p>
            <p class="text-red-400">✗ Procesos muy prolongados</p>
          </div>
        </div>`
    },
    {
      icon: "fa-futbol", color: "text-amber-400",
      title: "Las 3 Posiciones Tácticas del Tablero",
      content: `
        <p class="text-xs text-gray-400 mb-3">La metáfora del fútbol fue creada para esta actividad (no es parte del artículo). Cada posición representa un <strong class="text-white">rol funcional</strong> dentro del proceso de evaluación:</p>
        <div class="space-y-3">
          <div class="flex items-start gap-3 p-3 rounded-xl bg-amber-900/30 border border-amber-700/50">
            <span class="text-2xl flex-shrink-0">⚔️</span>
            <div>
              <strong class="text-amber-300 text-sm block">ATAQUE — Impulsar el cambio</strong>
              <p class="text-xs text-gray-300">Criterios 3 y 5: Aprendizaje continuo, mejora adaptativa y reglas explícitas para gestionar compensaciones. Representa la capacidad <em>ofensiva</em> de generar sostenibilidad real.</p>
            </div>
          </div>
          <div class="flex items-start gap-3 p-3 rounded-xl bg-emerald-900/30 border border-emerald-700/50">
            <span class="text-2xl flex-shrink-0">🛡️</span>
            <div>
              <strong class="text-emerald-300 text-sm block">DEFENSA — Proteger las bases</strong>
              <p class="text-xs text-gray-300">Criterios 2 y 4: Definición contextual, integración de dimensiones ambiental-social-económica, pluralismo y participación real. Son las bases sólidas que sostienen el proceso.</p>
            </div>
          </div>
          <div class="flex items-start gap-3 p-3 rounded-xl bg-blue-900/30 border border-blue-700/50">
            <span class="text-2xl flex-shrink-0">🧤</span>
            <div>
              <strong class="text-blue-300 text-sm block">ARQUERO — Demostrar resultados</strong>
              <p class="text-xs text-gray-300">Criterio 1: Capacidad de demostrar una contribución neta positiva a la sostenibilidad. Es la última línea: ¿el proceso produce resultados sostenibles reales y verificables?</p>
            </div>
          </div>
        </div>`
    },
    {
      icon: "fa-hand-pointer", color: "text-purple-400",
      title: "¿Cómo se juega? — Instrucciones Rápidas",
      content: `
        <div class="space-y-3">
          <div class="flex items-start gap-3">
            <span class="w-7 h-7 rounded-full bg-emerald-800 text-emerald-300 flex items-center justify-center text-xs font-bold flex-shrink-0">1</span>
            <p class="text-sm text-gray-300">El docente realiza el <strong class="text-white">sorteo aleatorio</strong> y entrega usuario + contraseña a cada equipo.</p>
          </div>
          <div class="flex items-start gap-3">
            <span class="w-7 h-7 rounded-full bg-emerald-800 text-emerald-300 flex items-center justify-center text-xs font-bold flex-shrink-0">2</span>
            <p class="text-sm text-gray-300">Cada equipo lee sus tarjetas — con el nombre y si es <span class="text-emerald-400 font-semibold">Fortaleza</span> o <span class="text-red-400 font-semibold">Debilidad</span> — pero <strong class="text-white">sin la posición correcta</strong>.</p>
          </div>
          <div class="flex items-start gap-3">
            <span class="w-7 h-7 rounded-full bg-emerald-800 text-emerald-300 flex items-center justify-center text-xs font-bold flex-shrink-0">3</span>
            <p class="text-sm text-gray-300">El equipo <strong class="text-white">debate en grupo</strong> y arrastra o usa los botones para ubicar cada tarjeta en <em>Ataque, Defensa o Arquero</em>.</p>
          </div>
          <div class="flex items-start gap-3">
            <span class="w-7 h-7 rounded-full bg-emerald-800 text-emerald-300 flex items-center justify-center text-xs font-bold flex-shrink-0">4</span>
            <p class="text-sm text-gray-300">Al llegar a consenso, presionan <strong class="text-white">"Enviar Alineación"</strong>. El moderador luego revela las respuestas correctas y lee la justificación de cada tarjeta bien ubicada.</p>
          </div>
          <div class="mt-3 p-3 rounded-xl bg-amber-900/30 border border-amber-700/40 text-xs text-amber-200">
            <strong class="block mb-1">⚠️ Advertencia del Artículo:</strong>
            El mapeo a posiciones de fútbol es una <em>invención didáctica</em>. La Tabla 2 del artículo no rankea países ni declara ganadores: describe fortalezas y debilidades usando el mismo marco de efectividad.
          </div>
        </div>`
    }
  ];

  window.navigateGuide = (direction, currentIndex) => {
    const newIndex = currentIndex + direction;
    if (newIndex < 0 || newIndex >= slides.length) return;
    const container = document.getElementById("guide-slide-container");
    if (container) container.innerHTML = buildSlideHTML(newIndex);
  };

  function buildSlideHTML(index) {
    const slide = slides[index];
    const isFirst = index === 0;
    const isLast = index === slides.length - 1;
    const dots = slides.map((_, i) =>
      `<span class="inline-block w-2 h-2 rounded-full ${i === index ? "bg-emerald-400" : "bg-slate-600"}"></span>`
    ).join("");
    return `<div class="text-left space-y-4">
      <div class="flex items-center gap-3 pb-3 border-b border-slate-700">
        <i class="fa-solid ${slide.icon} ${slide.color} text-2xl"></i>
        <div>
          <h3 class="font-bold text-white text-base">${slide.title}</h3>
          <div class="flex gap-1 mt-1">${dots}</div>
        </div>
        <span class="ml-auto text-xs text-gray-500 font-mono">${index + 1}/${slides.length}</span>
      </div>
      <div class="min-h-[220px] overflow-y-auto pr-1">${slide.content}</div>
      <div class="flex justify-between pt-2 border-t border-slate-800">
        <button onclick="navigateGuide(-1, ${index})" ${isFirst ? "disabled" : ""}
          class="px-4 py-2 rounded-xl ${isFirst ? "bg-slate-900 text-gray-600 cursor-not-allowed border border-slate-800" : "bg-slate-700 hover:bg-slate-600 text-white border border-slate-600"} text-sm font-semibold flex items-center gap-2">
          <i class="fa-solid fa-arrow-left"></i> Anterior
        </button>
        ${isLast
          ? `<button onclick="Swal.close()" class="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 border border-emerald-600 text-white text-sm font-bold flex items-center gap-2"><i class="fa-solid fa-check"></i> ¡Listo para jugar!</button>`
          : `<button onclick="navigateGuide(1, ${index})" class="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 border border-emerald-700 text-white text-sm font-bold flex items-center gap-2">Siguiente <i class="fa-solid fa-arrow-right"></i></button>`
        }
      </div>
    </div>`;
  }

  Swal.fire({
    title: `<i class="fa-solid fa-book-open text-emerald-400 mr-2"></i><span style="color:#f3f4f6">Guía Didáctica</span>`,
    html: `<div id="guide-slide-container">${buildSlideHTML(0)}</div>`,
    width: "660px",
    background: "#3a3f45",
    color: "#f3f4f6",
    showConfirmButton: false,
    showCloseButton: true,
    customClass: { popup: "border border-slate-600" }
  });
}


/* ==========================================================================
   3. VISTA TABLERO DEL PAÍS (Juego Drag and Drop + Clic Directo)
   ========================================================================== */
function renderCountryBoardView(container, countryId) {
  const country = MUNDIAL_DATA.countries[countryId];
  
  if (!state.submissions[countryId]) {
    state.submissions[countryId] = {
      ATAQUE: [],
      DEFENSA: [],
      ARQUERO: [],
      pool: country.cards.map(c => c.id)
    };
    saveSubmissionsToStorage();
  }

  const currentSub = state.submissions[countryId];
  const isSubmitted = !!currentSub.submittedAt;

  container.innerHTML = `
    <div class="space-y-6 animate-fade-in pb-16">
      
      <!-- Top Navigation Bar -->
      <div class="flex items-center justify-between bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
        <div class="flex items-center gap-3">
          <span class="text-3xl">${country.flag}</span>
          <div>
            <h2 class="text-xl font-bold text-white leading-none">Equipo: ${country.name}</h2>
            <p class="text-xs text-gray-400 mt-1">${country.description}</p>
          </div>
        </div>

        <div class="flex items-center gap-3">
          ${isSubmitted ? `
            <span class="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-bold flex items-center gap-1.5">
              <i class="fa-solid fa-lock"></i> Alineación Enviada
            </span>
          ` : `
            <span class="px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 text-xs font-bold flex items-center gap-1.5">
              <i class="fa-solid fa-pen-ruler"></i> En Edición
            </span>
          `}
          
          <button data-action="logout" class="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-gray-300 text-xs font-semibold flex items-center gap-2">
            <i class="fa-solid fa-right-from-bracket"></i> Salir
          </button>
        </div>
      </div>

      <!-- Banner de Estado de Envío -->
      ${isSubmitted ? `
        <div class="bg-emerald-950/40 border border-emerald-500/30 p-4 rounded-2xl flex items-center justify-between text-emerald-200 text-sm">
          <div class="flex items-center gap-3">
            <i class="fa-solid fa-circle-check text-emerald-400 text-xl"></i>
            <span>¡Tu equipo ha enviado la alineación al moderador! Las posiciones están fijadas.</span>
          </div>
          <span class="text-xs text-emerald-400/80 font-mono">${new Date(currentSub.submittedAt).toLocaleTimeString()}</span>
        </div>
      ` : ''}

      <!-- Grid Principal: Cancha Táctica vs Banco de Tarjetas -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        <!-- Cancha Táctica (8 Columnas en Pantalla Grande) -->
        <div class="lg:col-span-8">
          <div class="tactical-pitch rounded-3xl p-6 space-y-6">
            <div class="center-circle"></div>
            <div class="penalty-box-top"></div>
            <div class="penalty-box-bottom"></div>

            <!-- Encabezado de Cancha -->
            <div class="flex items-center justify-between text-white border-b border-emerald-500/20 pb-3 relative z-10">
              <div class="flex items-center gap-2">
                <i class="fa-solid fa-futbol text-emerald-400"></i>
                <span class="font-bold text-sm uppercase tracking-wider">Tablero Táctico de Sostenibilidad</span>
              </div>
              <span class="text-xs text-gray-300 bg-slate-900/60 px-3 py-1 rounded-full border border-emerald-500/30">
                Puedes arrastrar o hacer clic en las tarjetas para moverlas
              </span>
            </div>

            <!-- Zona 1: ATAQUE -->
            <div class="relative z-10 space-y-2">
              <div class="flex items-center justify-between text-amber-400 font-bold text-sm">
                <span class="flex items-center gap-2">
                  <i class="fa-solid ${MUNDIAL_DATA.positions.ATAQUE.icon}"></i> ATAQUE
                </span>
                <span class="text-xs text-gray-300 font-normal">
                  ${MUNDIAL_DATA.positions.ATAQUE.description}
                </span>
              </div>
              <div id="zone-ATAQUE" class="drop-zone drop-zone-ataque p-3 flex flex-wrap gap-3 min-h-[120px]" data-position="ATAQUE">
                ${renderZoneCardsHTML(country, currentSub.ATAQUE, isSubmitted, "ATAQUE")}
              </div>
            </div>

            <!-- Zona 2: DEFENSA -->
            <div class="relative z-10 space-y-2">
              <div class="flex items-center justify-between text-emerald-400 font-bold text-sm">
                <span class="flex items-center gap-2">
                  <i class="fa-solid ${MUNDIAL_DATA.positions.DEFENSA.icon}"></i> DEFENSA
                </span>
                <span class="text-xs text-gray-300 font-normal">
                  ${MUNDIAL_DATA.positions.DEFENSA.description}
                </span>
              </div>
              <div id="zone-DEFENSA" class="drop-zone drop-zone-defensa p-3 flex flex-wrap gap-3 min-h-[120px]" data-position="DEFENSA">
                ${renderZoneCardsHTML(country, currentSub.DEFENSA, isSubmitted, "DEFENSA")}
              </div>
            </div>

            <!-- Zona 3: ARQUERO -->
            <div class="relative z-10 space-y-2">
              <div class="flex items-center justify-between text-blue-400 font-bold text-sm">
                <span class="flex items-center gap-2">
                  <i class="fa-solid ${MUNDIAL_DATA.positions.ARQUERO.icon}"></i> ARQUERO
                </span>
                <span class="text-xs text-gray-300 font-normal">
                  ${MUNDIAL_DATA.positions.ARQUERO.description}
                </span>
              </div>
              <div id="zone-ARQUERO" class="drop-zone drop-zone-arquero p-3 flex flex-wrap gap-3 min-h-[120px]" data-position="ARQUERO">
                ${renderZoneCardsHTML(country, currentSub.ARQUERO, isSubmitted, "ARQUERO")}
              </div>
            </div>

          </div>
        </div>

        <!-- Banco de Tarjetas Disponibles (4 Columnas) -->
        <div class="lg:col-span-4 flex flex-col justify-between space-y-6">
          <div class="glass-panel rounded-3xl p-6 border border-slate-700/60 flex-1 space-y-4">
            <div class="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 class="font-bold text-white text-base flex items-center gap-2">
                <i class="fa-solid fa-layer-group text-amber-400"></i>
                Tarjetas Disponibles
              </h3>
              <span id="pool-count" class="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-gray-300 font-mono">
                ${currentSub.pool ? currentSub.pool.length : 0} pendientes
              </span>
            </div>

            <p class="text-xs text-gray-400 leading-relaxed">
              Ubica las tarjetas mediante <strong>arrastre</strong> o usando los <strong>botones de acceso rápido</strong> en cada tarjeta.
            </p>

            <div id="zone-POOL" class="drop-zone bg-slate-900/60 p-3 min-h-[280px] flex flex-col gap-3" data-position="POOL">
              ${renderZoneCardsHTML(country, currentSub.pool, isSubmitted, "POOL")}
            </div>
          </div>

          <!-- Botón de Envío Definitivo -->
          ${!isSubmitted ? `
            <button onclick="confirmSubmission('${countryId}')" class="w-full py-4 px-6 rounded-2xl btn-glow-green text-white font-extrabold text-base flex items-center justify-center gap-3 shadow-xl">
              <i class="fa-solid fa-paper-plane"></i>
              Enviar Alineación al Moderador
            </button>
          ` : `
            <button disabled class="w-full py-4 px-6 rounded-2xl bg-slate-800 text-gray-500 font-bold text-sm cursor-not-allowed flex items-center justify-center gap-2">
              <i class="fa-solid fa-lock"></i>
              Envío Finalizado
            </button>
          `}
        </div>

      </div>

    </div>
  `;

  // Inicializar SortableJS para drag & drop si no ha sido enviado
  if (!isSubmitted) {
    initSortableForBoard(countryId);
  }
}

// Genera HTML de las tarjetas con selector directo opcional de 1-clic
function renderZoneCardsHTML(country, cardIds, isSubmitted, currentZone) {
  if (!cardIds || cardIds.length === 0) {
    return `<div class="w-full text-center py-4 text-xs text-gray-400 opacity-60 pointer-events-none italic">Zona vacía</div>`;
  }

  return cardIds.map(cardId => {
    const card = country.cards.find(c => c.id === cardId);
    if (!card) return '';

    const badgeClass = card.type === "FORTALEZA" ? "badge-fortaleza" : "badge-debilidad";

    return `
      <div class="draggable-card glass-card rounded-xl p-3.5 border border-slate-700 text-left space-y-2 relative group w-full" data-card-id="${card.id}">
        <div class="flex items-center justify-between gap-2">
          <span class="px-2 py-0.5 rounded-full text-[10px] font-extrabold tracking-wider ${badgeClass}">
            ${card.type}
          </span>
          ${card.isOptional ? `
            <span class="px-2 py-0.5 rounded-full text-[10px] font-semibold badge-opcional">
              Opcional
            </span>
          ` : ''}
        </div>
        
        <h4 class="font-semibold text-white text-xs leading-snug">
          ${card.title}
        </h4>

        <!-- Botones de Movimiento Rápido por Clic -->
        ${!isSubmitted ? `
          <div class="pt-2 border-t border-slate-700/60 flex items-center justify-between gap-1 text-[10px]">
            <span class="text-gray-400 font-medium">Mover a:</span>
            <div class="flex items-center gap-1">
              ${currentZone !== 'ATAQUE' ? `<button onclick="moveCardDirectly('${country.id}', '${card.id}', 'ATAQUE')" class="px-1.5 py-0.5 rounded bg-amber-500/20 hover:bg-amber-500/40 text-amber-300 font-bold transition" title="Mover a Ataque">⚔️ Ataque</button>` : ''}
              ${currentZone !== 'DEFENSA' ? `<button onclick="moveCardDirectly('${country.id}', '${card.id}', 'DEFENSA')" class="px-1.5 py-0.5 rounded bg-emerald-500/20 hover:bg-emerald-500/40 text-emerald-300 font-bold transition" title="Mover a Defensa">🛡️ Defensa</button>` : ''}
              ${currentZone !== 'ARQUERO' ? `<button onclick="moveCardDirectly('${country.id}', '${card.id}', 'ARQUERO')" class="px-1.5 py-0.5 rounded bg-blue-500/20 hover:bg-blue-500/40 text-blue-300 font-bold transition" title="Mover a Arquero">🧤 Arquero</button>` : ''}
              ${currentZone !== 'POOL' ? `<button onclick="moveCardDirectly('${country.id}', '${card.id}', 'POOL')" class="px-1.5 py-0.5 rounded bg-slate-700 hover:bg-slate-600 text-gray-300 font-bold transition" title="Regresar al Banco">📦 Banco</button>` : ''}
            </div>
          </div>
        ` : ''}
      </div>
    `;
  }).join('');
}

// Función para mover tarjeta mediante clic directo
function moveCardDirectly(countryId, cardId, targetZone) {
  const currentSub = state.submissions[countryId];
  if (!currentSub || currentSub.submittedAt) return;

  const zones = ["ATAQUE", "DEFENSA", "ARQUERO", "pool"];
  zones.forEach(z => {
    currentSub[z] = (currentSub[z] || []).filter(id => id !== cardId);
  });

  if (targetZone === "POOL") {
    currentSub.pool.push(cardId);
  } else {
    currentSub[targetZone].push(cardId);
  }

  saveSubmissionsToStorage();
  renderCurrentView();
}

// Configuración de SortableJS para arrastrar tarjetas libremente
function initSortableForBoard(countryId) {
  const zones = ["zone-ATAQUE", "zone-DEFENSA", "zone-ARQUERO", "zone-POOL"];

  zones.forEach(zoneId => {
    const el = document.getElementById(zoneId);
    if (!el) return;

    state.sortableInstances[zoneId] = Sortable.create(el, {
      group: "tactical-board",
      animation: 200,
      ghostClass: "sortable-ghost",
      chosenClass: "sortable-chosen",
      onEnd: (evt) => {
        updateCountryBoardState(countryId);
      }
    });
  });
}

// Actualizar el estado guardado al mover tarjetas mediante drag & drop
function updateCountryBoardState(countryId) {
  const zones = ["ATAQUE", "DEFENSA", "ARQUERO", "POOL"];
  const newSub = {
    ATAQUE: [],
    DEFENSA: [],
    ARQUERO: [],
    pool: [],
    submittedAt: state.submissions[countryId]?.submittedAt || null
  };

  zones.forEach(z => {
    const zoneElem = document.getElementById(`zone-${z}`);
    if (zoneElem) {
      const cards = Array.from(zoneElem.querySelectorAll(".draggable-card"))
        .map(c => c.getAttribute("data-card-id"))
        .filter(Boolean);
      
      if (z === "POOL") {
        newSub.pool = cards;
      } else {
        newSub[z] = cards;
      }
    }
  });

  state.submissions[countryId] = newSub;
  saveSubmissionsToStorage();

  const poolCount = document.getElementById("pool-count");
  if (poolCount) {
    poolCount.textContent = `${newSub.pool.length} pendientes`;
  }
}

// Confirmar y Enviar Alineación al Moderador
function confirmSubmission(countryId) {
  const currentSub = state.submissions[countryId];
  if (!currentSub || (currentSub.pool && currentSub.pool.length > 0)) {
    Swal.fire({
      title: "Tarjetas pendientes",
      text: "Aún tienes tarjetas en el banco disponible. Por favor ubica todas las tarjetas en Ataque, Defensa o Arquero antes de enviar.",
      icon: "warning",
      confirmButtonColor: "#f59e0b"
    });
    return;
  }

  Swal.fire({
    title: "¿Confirmar envío de alineación?",
    text: "Una vez enviada, la posición de las tarjetas quedará bloqueada y será evaluada por el moderador.",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Sí, Enviar al Moderador",
    cancelButtonText: "Seguir Editando",
    confirmButtonColor: "#10b981"
  }).then(result => {
    if (result.isConfirmed) {
      state.submissions[countryId].submittedAt = new Date().toISOString();
      saveSubmissionsToStorage();
      renderCurrentView();
      
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      Swal.fire("¡Enviado con éxito!", "Tu alineación ha sido enviada al panel del moderador.", "success");
    }
  });
}

/* ==========================================================================
   4. PANEL DE ADMINISTRACIÓN / MODERADOR Y SÍNTESIS
   ========================================================================== */
function renderAdminView(container) {
  container.innerHTML = `
    <div class="space-y-8 animate-fade-in pb-16">
      
      <!-- Top Nav Admin Bar -->
      <div class="flex items-center justify-between bg-slate-900/90 p-4 rounded-2xl border border-slate-800">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center text-xl font-bold">
            ⚖️
          </div>
          <div>
            <h2 class="text-xl font-bold text-white leading-none">Panel de Moderador & Evaluación</h2>
            <p class="text-xs text-gray-400 mt-1">Control del Mundial de Sostenibilidad • Resultados y Síntesis</p>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <button onclick="resetAllSubmissions()" class="px-3 py-1.5 rounded-xl bg-red-900/40 hover:bg-red-900/70 border border-red-700/50 text-red-300 text-xs font-semibold transition">
            <i class="fa-solid fa-rotate-right"></i> Reiniciar Envíos
          </button>

          <button data-action="logout" class="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-gray-300 text-xs font-semibold flex items-center gap-2">
            <i class="fa-solid fa-right-from-bracket"></i> Salir Moderador
          </button>
        </div>
      </div>

      <!-- Resumen en Tiempo Real de Envíos por País -->
      <section>
        <h3 class="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <i class="fa-solid fa-clipboard-check text-emerald-400"></i>
          Estado de Envíos de los Equipos
        </h3>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          ${Object.values(MUNDIAL_DATA.countries).map(country => {
            const sub = state.submissions[country.id];
            const isSubmitted = !!sub?.submittedAt;
            const score = calculateTeamScore(country.id);

            return `
              <div class="glass-panel rounded-2xl p-5 border border-slate-700/60 flex flex-col justify-between space-y-4">
                <div>
                  <div class="flex items-center justify-between mb-3">
                    <span class="text-3xl">${country.flag}</span>
                    ${isSubmitted ? `
                      <span class="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-bold">
                        ${score.percentage}% Aciertos
                      </span>
                    ` : `
                      <span class="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 text-xs font-bold">
                        En Proceso
                      </span>
                    `}
                  </div>

                  <h4 class="font-bold text-white text-lg">${country.name}</h4>
                  <p class="text-xs text-gray-400 mt-1">
                    ${isSubmitted ? `Correctas: ${score.correct}/${score.total}` : 'Pendiente por enviar'}
                  </p>
                </div>

                <button onclick="inspectCountrySubmissionModal('${country.id}')" class="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-gray-200 font-semibold text-xs transition flex items-center justify-center gap-2">
                  <i class="fa-solid fa-eye text-amber-400"></i>
                  Ver Alineación & Retroalimentación
                </button>
              </div>
            `;
          }).join('')}
        </div>
      </section>

      <!-- ¿Por qué no hay Campeón? + Gráfico de Radar de Criterios -->
      <section class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        <!-- Explicación Didáctica del Artículo (7 Columnas) -->
        <div class="lg:col-span-7 glass-panel rounded-3xl p-8 border border-slate-700/60 space-y-4">
          <h3 class="text-2xl font-bold text-white flex items-center gap-3">
            <i class="fa-solid fa-scale-unbalanced text-cyan-400"></i>
            ¿Por qué el Mundial queda Sin Campeón?
          </h3>

          <p class="text-gray-300 text-sm leading-relaxed">
            ${MUNDIAL_DATA.noWinnerExplanation}
          </p>

          <div class="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 space-y-3">
            <h4 class="text-xs font-bold text-emerald-400 uppercase tracking-wider">Los 5 Criterios del Estado del Arte (Bond et al. 2012):</h4>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              ${MUNDIAL_DATA.stateOfTheArtCriteria.map(c => `
                <div class="flex items-start gap-2 text-gray-300">
                  <i class="fa-solid ${c.icon} text-amber-400 mt-0.5"></i>
                  <div>
                    <span class="font-bold text-white">${c.name}:</span>
                    <span class="text-gray-400 block">${c.description}</span>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- Gráfico de Radar Interactivo (5 Columnas) -->
        <div class="lg:col-span-5 glass-panel rounded-3xl p-6 border border-slate-700/60 flex flex-col justify-between">
          <h4 class="font-bold text-white text-base mb-2 flex items-center gap-2">
            <i class="fa-solid fa-chart-radar text-amber-400"></i>
            Cumplimiento por Criterio
          </h4>
          <div class="relative w-full h-[300px] flex items-center justify-center">
            <canvas id="radarChart"></canvas>
          </div>
          <p class="text-[11px] text-gray-400 text-center mt-2">
            Desempeño relativo de las jurisdicciones según el marco de efectividad.
          </p>
        </div>

      </section>

      <!-- Panel de Debate Abierto Final con Cronómetro -->
      <section class="glass-panel rounded-3xl p-8 border border-slate-700/60 space-y-6">
        <h3 class="text-2xl font-bold text-white flex items-center gap-3">
          <i class="fa-solid fa-comments text-emerald-400"></i>
          Pregunta Final de Debate para el Curso
        </h3>

        <div class="bg-gradient-to-r from-slate-900 via-emerald-950/40 to-slate-900 p-6 rounded-2xl border border-emerald-500/30 space-y-4">
          <p class="text-lg font-semibold text-emerald-200 italic leading-relaxed">
            "Los autores postulan que la evaluación de sostenibilidad podría estar al comienzo de una fase de expansión no vista desde que la evaluación de impacto ambiental se adoptó mundialmente, y cierran con que el tiempo lo dirá. ¿Qué opinan ustedes hoy?"
          </p>

          <div class="flex items-center justify-between pt-2">
            <div class="flex items-center gap-3">
              <button onclick="toggleDebateTimer()" id="timer-btn" class="px-4 py-2 rounded-xl btn-glow-blue text-white font-bold text-xs flex items-center gap-2">
                <i class="fa-solid fa-stopwatch"></i> Iniciar Cronómetro (5 min)
              </button>
              <span id="timer-display" class="font-mono text-xl font-bold text-amber-400">05:00</span>
            </div>
            <span class="text-xs text-gray-400">Bond, Morrison-Saunders & Pope (2012)</span>
          </div>
        </div>
      </section>

    </div>
  `;

  // Renderizar Gráfico de Radar de Chart.js
  setTimeout(() => {
    renderRadarChart();
  }, 100);
}

// CÁLCULO DE PUNTAJE Y EVALUACIÓN POR PAÍS
function calculateTeamScore(countryId) {
  const country = MUNDIAL_DATA.countries[countryId];
  const sub = state.submissions[countryId];

  if (!sub) return { correct: 0, total: country.cards.length, percentage: 0 };

  let correctCount = 0;
  country.cards.forEach(card => {
    const placedZone = Object.keys(MUNDIAL_DATA.positions).find(pos => (sub[pos] || []).includes(card.id));
    if (placedZone === card.correctPosition) {
      correctCount++;
    }
  });

  const total = country.cards.length;
  const percentage = Math.round((correctCount / total) * 100);

  return { correct: correctCount, total, percentage };
}

// MODAL DE INSPECCIÓN Y RETROALIMENTACIÓN EN VOZ ALTA POR PAÍS
function inspectCountrySubmissionModal(countryId) {
  const country = MUNDIAL_DATA.countries[countryId];
  const sub = state.submissions[countryId] || { ATAQUE: [], DEFENSA: [], ARQUERO: [] };

  const positions = ["ATAQUE", "DEFENSA", "ARQUERO"];

  let modalHTML = `
    <div class="text-left space-y-4 max-h-[70vh] overflow-y-auto pr-2">
      <p class="text-xs text-gray-400">
        Revisión comparativa de las tarjetas colocadas por el equipo frente a la <strong>Hoja de Respuestas Oficial del Moderador</strong>.
      </p>
  `;

  country.cards.forEach(card => {
    const placedZone = positions.find(pos => (sub[pos] || []).includes(card.id)) || "Sin asignar";
    const isCorrect = placedZone === card.correctPosition;

    modalHTML += `
      <div class="p-3.5 rounded-xl border ${isCorrect ? 'bg-emerald-950/20 border-emerald-500/40' : 'bg-red-950/20 border-red-500/40'} space-y-2">
        <div class="flex items-center justify-between gap-2">
          <span class="font-bold text-white text-xs">${card.title}</span>
          <span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${isCorrect ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}">
            ${isCorrect ? '✓ Correcto' : '✗ Desubicada'}
          </span>
        </div>

        <div class="text-[11px] flex items-center justify-between text-gray-300">
          <span>Ubicación del equipo: <strong class="text-white">${placedZone}</strong></span>
          <span>Posición Oficial: <strong class="text-amber-400">${card.correctPosition}</strong></span>
        </div>

        ${isCorrect ? `
          <div class="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800 text-[11px] text-gray-300 space-y-1.5">
            <span class="font-bold text-emerald-400 block">Texto a leer en voz alta por el moderador:</span>
            <p class="italic">${card.explanation}</p>
            <button onclick="readAloudText('${escapeSpeechText(card.explanation)}')" class="text-[10px] text-cyan-400 hover:underline flex items-center gap-1 mt-1">
              <i class="fa-solid fa-volume-high"></i> Leer con Síntesis de Voz
            </button>
          </div>
        ` : ''}
      </div>
    `;
  });

  modalHTML += `</div>`;

  Swal.fire({
    title: `${country.flag} Evaluación de ${country.name}`,
    html: modalHTML,
    width: "700px",
    background: "#3a3f45",
    color: "#f3f4f6",
    customClass: { popup: "border border-slate-600" },
    confirmButtonText: "Entendido",
    confirmButtonColor: "#10b981"
  });
}

function escapeSpeechText(text) {
  return text.replace(/'/g, "\\'").replace(/"/g, '\\"');
}

// Síntesis de voz integrada para lectura en voz alta del moderador
function readAloudText(text) {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-ES';
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
  } else {
    Swal.fire("Info", text, "info");
  }
}

// GRÁFICO DE RADAR
function renderRadarChart() {
  const ctx = document.getElementById("radarChart");
  if (!ctx) return;

  if (state.radarChartInstance) {
    state.radarChartInstance.destroy();
  }

  state.radarChartInstance = new Chart(ctx, {
    type: 'radar',
    data: {
      labels: ['Contribución Neta', 'Definición & Integración', 'Reglas Trade-off', 'Pluralismo', 'Aprendizaje'],
      datasets: [
        {
          label: 'Canadá',
          data: [90, 85, 60, 80, 50],
          borderColor: '#e11d48',
          backgroundColor: 'rgba(225, 29, 72, 0.2)',
          pointBackgroundColor: '#e11d48'
        },
        {
          label: 'Sudáfrica',
          data: [30, 95, 40, 90, 40],
          borderColor: '#059669',
          backgroundColor: 'rgba(5, 150, 105, 0.2)',
          pointBackgroundColor: '#059669'
        },
        {
          label: 'Inglaterra',
          data: [40, 80, 50, 40, 85],
          borderColor: '#dc2626',
          backgroundColor: 'rgba(220, 38, 38, 0.2)',
          pointBackgroundColor: '#dc2626'
        },
        {
          label: 'Australia Occ.',
          data: [50, 75, 90, 50, 80],
          borderColor: '#d97706',
          backgroundColor: 'rgba(217, 119, 6, 0.2)',
          pointBackgroundColor: '#d97706'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        r: {
          angleLines: { color: 'rgba(255, 255, 255, 0.1)' },
          grid: { color: 'rgba(255, 255, 255, 0.1)' },
          pointLabels: { color: '#9ca3af', font: { size: 10 } },
          ticks: { display: false, max: 100 }
        }
      },
      plugins: {
        legend: {
          labels: { color: '#f3f4f6', font: { size: 11 } }
        }
      }
    }
  });
}

// CRONÓMETRO DE DEBATE
let debateTimerInterval = null;
let timerSeconds = 300;

function toggleDebateTimer() {
  const btn = document.getElementById("timer-btn");
  const display = document.getElementById("timer-display");

  if (debateTimerInterval) {
    clearInterval(debateTimerInterval);
    debateTimerInterval = null;
    if (btn) btn.innerHTML = `<i class="fa-solid fa-play"></i> Reanudar Cronómetro`;
  } else {
    debateTimerInterval = setInterval(() => {
      if (timerSeconds > 0) {
        timerSeconds--;
        const mins = String(Math.floor(timerSeconds / 60)).padStart(2, '0');
        const secs = String(timerSeconds % 60).padStart(2, '0');
        if (display) display.textContent = `${mins}:${secs}`;
      } else {
        clearInterval(debateTimerInterval);
        debateTimerInterval = null;
        if (display) display.textContent = "00:00 - ¡Tiempo Cumplido!";
        confetti({ particleCount: 50, spread: 50 });
      }
    }, 1000);

    if (btn) btn.innerHTML = `<i class="fa-solid fa-pause"></i> Pausar Cronómetro`;
  }
}

// REINICIAR TODOS LOS ENVÍOS DE TORNEO
function resetAllSubmissions() {
  Swal.fire({
    title: "¿Reiniciar torneo?",
    text: "Esto borrará todas las alineaciones enviadas por los países.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, reiniciar todo",
    confirmButtonColor: "#ef4444"
  }).then(result => {
    if (result.isConfirmed) {
      state.submissions = {};
      saveSubmissionsToStorage();
      renderCurrentView();
      Swal.fire("Reiniciado", "El torneo ha sido borrado.", "success");
    }
  });
}
