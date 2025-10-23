// =======================
// CONFIGURAÇÃO DA API
// =======================
const API_BASE_URL = "https://se-liga-enem-backend.vercel.app"

// =======================
// INICIALIZAÇÃO
// =======================
document.addEventListener("DOMContentLoaded", () => {
  initializeApp()
})

function initializeApp() {
  setupNavigation()
  setupForms()
  setupMobileMenu()
}

// =======================
// NAVEGAÇÃO
// =======================
function setupNavigation() {
  const navItems = document.querySelectorAll(".nav-item")
  const sections = document.querySelectorAll(".content-section")

  navItems.forEach((item) => {
    item.addEventListener("click", () => {
      const targetSection = item.dataset.section

      navItems.forEach((nav) => nav.classList.remove("active"))
      item.classList.add("active")

      sections.forEach((section) => section.classList.remove("active"))
      const target = document.getElementById(targetSection)
      if (target) target.classList.add("active")

      const sidebar = document.getElementById("sidebar")
      if (sidebar) sidebar.classList.remove("active")
    })
  })
}

// =======================
// MENU MOBILE
// =======================
function setupMobileMenu() {
  const menuToggle = document.getElementById("menuToggle")
  const sidebar = document.getElementById("sidebar")

  if (!menuToggle || !sidebar) return

  menuToggle.addEventListener("click", () => {
    sidebar.classList.toggle("active")
  })

  document.addEventListener("click", (e) => {
    if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
      sidebar.classList.remove("active")
    }
  })
}

// =======================
// UTILITÁRIOS
// =======================
function safeFixed(value, digits = 2) {
  const n = Number.parseFloat(value)
  return Number.isFinite(n) ? n.toFixed(digits) : "—"
}

function showLoading() {
  const overlay = document.getElementById("loadingOverlay")
  if (overlay) overlay.classList.add("active")
}

function hideLoading() {
  const overlay = document.getElementById("loadingOverlay")
  if (overlay) overlay.classList.remove("active")
}

function showError(resultId, message) {
  const resultDiv = document.getElementById(resultId)
  if (!resultDiv) return
  const contentDiv = resultDiv.querySelector(".result-content")
  contentDiv.innerHTML = `
    <div class="error-message">
      <strong>Erro:</strong> ${message}
    </div>
  `
  resultDiv.style.display = "block"
}

function clearResult(resultId) {
  const resultDiv = document.getElementById(resultId)
  if (!resultDiv) return
  const contentDiv = resultDiv.querySelector(".result-content")
  contentDiv.innerHTML = ""
  resultDiv.style.display = "none"
}

// =======================
// SETUP DOS FORMULÁRIOS
// =======================
function setupForms() {
  const f1 = document.getElementById("formMediaSimples")
  if (f1) f1.addEventListener("submit", handleMediaSimples)

  const f2 = document.getElementById("formMediaPonderada")
  if (f2) f2.addEventListener("submit", handleMediaPonderada)

  const f3 = document.getElementById("formSimuladorSisu")
  if (f3) f3.addEventListener("submit", handleSimuladorSisu)

  const f4 = document.getElementById("formCompararNotas")
  if (f4) f4.addEventListener("submit", handleCompararNotas)

  const f5 = document.getElementById("formSugestaoFoco")
  if (f5) f5.addEventListener("submit", handleSugestaoFoco)

  const f6 = document.getElementById("formCursos")
  if (f6) f6.addEventListener("submit", handleCursos)
}

// =======================
// HANDLERS DE FORMULÁRIO
// =======================

/* MÉDIA SIMPLES */
async function handleMediaSimples(e) {
  e.preventDefault()
  clearResult("resultMediaSimples")

  const formData = {
    linguagens: Number.parseFloat(document.getElementById("linguagens").value),
    humanas: Number.parseFloat(document.getElementById("humanas").value),
    natureza: Number.parseFloat(document.getElementById("natureza").value),
    matematica: Number.parseFloat(document.getElementById("matematica").value),
    redacao: Number.parseFloat(document.getElementById("redacao").value),
  }

  try {
    showLoading()
    const response = await fetch(`${API_BASE_URL}/media-simples/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data.detail || "Erro ao calcular média")
    displayMediaSimplesResult(data)
  } catch (err) {
    showError("resultMediaSimples", err.message)
  } finally {
    hideLoading()
  }
}

/* MÉDIA PONDERADA */
async function handleMediaPonderada(e) {
  e.preventDefault()
  clearResult("resultMediaPonderada")

  const formData = {
    linguagens: Number.parseFloat(document.getElementById("linguagens-pond").value),
    humanas: Number.parseFloat(document.getElementById("humanas-pond").value),
    natureza: Number.parseFloat(document.getElementById("natureza-pond").value),
    matematica: Number.parseFloat(document.getElementById("matematica-pond").value),
    redacao: Number.parseFloat(document.getElementById("redacao-pond").value),
    curso: document.getElementById("curso-pond").value,
  }

  try {
    showLoading()
    const response = await fetch(`${API_BASE_URL}/media-ponderada/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data.detail || "Erro ao calcular média ponderada")
    displayMediaPonderadaResult(data, formData)
  } catch (err) {
    showError("resultMediaPonderada", err.message)
  } finally {
    hideLoading()
  }
}

/* SIMULADOR SISU */
async function handleSimuladorSisu(e) {
  e.preventDefault()
  clearResult("resultSimuladorSisu")

  const formData = {
    media: Number.parseFloat(document.getElementById("media-enem").value),
    curso: document.getElementById("curso-sisu").value,
    modalidade: document.getElementById("modalidade-sisu").value,
  }

  try {
    showLoading()
    const response = await fetch(`${API_BASE_URL}/simulador-sisu/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data.detail || "Erro ao simular SISU")
    displaySimuladorSisuResult(data, formData)
  } catch (err) {
    showError("resultSimuladorSisu", err.message)
  } finally {
    hideLoading()
  }
}

/* COMPARAR NOTAS */
async function handleCompararNotas(e) {
  e.preventDefault()
  clearResult("resultCompararNotas")

  const formData = {
    linguagens: Number.parseFloat(document.getElementById("linguagens-comp").value),
    humanas: Number.parseFloat(document.getElementById("humanas-comp").value),
    natureza: Number.parseFloat(document.getElementById("natureza-comp").value),
    matematica: Number.parseFloat(document.getElementById("matematica-comp").value),
    redacao: Number.parseFloat(document.getElementById("redacao-comp").value),
  }

  try {
    showLoading()
    const response = await fetch(`${API_BASE_URL}/comparar-notas/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data.detail || "Erro ao comparar notas")
    displayCompararNotasResult(data, formData)
  } catch (err) {
    showError("resultCompararNotas", err.message)
  } finally {
    hideLoading()
  }
}

/* SUGESTÃO DE FOCO */
async function handleSugestaoFoco(e) {
  e.preventDefault()
  clearResult("resultSugestaoFoco")

  const formData = {
    linguagens: Number.parseFloat(document.getElementById("linguagens-foco").value),
    humanas: Number.parseFloat(document.getElementById("humanas-foco").value),
    natureza: Number.parseFloat(document.getElementById("natureza-foco").value),
    matematica: Number.parseFloat(document.getElementById("matematica-foco").value),
    redacao: Number.parseFloat(document.getElementById("redacao-foco").value),
    curso: document.getElementById("curso-foco").value,
  }

  try {
    showLoading()
    const response = await fetch(`${API_BASE_URL}/pontos-fracos/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data.detail || "Erro ao obter sugestões")
    displaySugestaoFocoResult(data, formData.curso)
  } catch (err) {
    showError("resultSugestaoFoco", err.message)
  } finally {
    hideLoading()
  }
}

/* CURSOS */
async function handleCursos(e) {
  e.preventDefault()
  clearResult("resultCursos")

  const formData = { curso: document.getElementById("curso-info").value }

  try {
    showLoading()
    const response = await fetch(`${API_BASE_URL}/info-curso/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data.detail || "Erro ao buscar informações do curso")
    displayCursosResult(data)
  } catch (err) {
    showError("resultCursos", err.message)
  } finally {
    hideLoading()
  }
}

// =======================
// RENDERIZAÇÃO DE RESULTADOS
// =======================
function displayMediaSimplesResult(data) {
  const resultDiv = document.getElementById("resultMediaSimples")
  if (!resultDiv) return
  const contentDiv = resultDiv.querySelector(".result-content")
  const media = data.media ?? data["media"] ?? null
  contentDiv.innerHTML = `
    <div class="stat-card">
      <div class="label">Sua Média</div>
      <div class="value">${safeFixed(media)}</div>
    </div>
  `
  resultDiv.style.display = "block"
}

function displayMediaPonderadaResult(data, formData) {
  const resultDiv = document.getElementById("resultMediaPonderada")
  if (!resultDiv) return
  const contentDiv = resultDiv.querySelector(".result-content")
  const media = data["Média ponderada"] ?? data.media ?? null
  const detalhes = data["Detalhes"] ?? data.Detalhes ?? []

  let detalhesHtml = ""
  if (Array.isArray(detalhes) && detalhes.length > 0) {
    detalhesHtml = detalhes
      .map(
        (d) => `
        <div class="result-item">
          <strong>${d["Área"]}</strong>Nota ${safeFixed(d["Nota"], 1)} • Peso ${d["Peso"]}
        </div>
      `,
      )
      .join("")
  }

  contentDiv.innerHTML = `
    <div class="stat-card">
      <div class="label">Média Ponderada</div>
      <div class="value">${safeFixed(media)}</div>
    </div>
    <div class="result-item"><strong>Curso:</strong> ${(formData && formData.curso) || "—"}</div>
    ${detalhesHtml}
  `
  resultDiv.style.display = "block"
}

function displaySimuladorSisuResult(data, formData) {
  const resultDiv = document.getElementById("resultSimuladorSisu")
  if (!resultDiv) return
  const contentDiv = resultDiv.querySelector(".result-content")

  if (!Array.isArray(data) || data.length === 0) {
    contentDiv.innerHTML = `<div class="error-message">Nenhum resultado encontrado.</div>`
    resultDiv.style.display = "block"
    return
  }

  let html = `
    <div class="result-item"><strong>Curso:</strong> ${(formData && formFormValue(formData, "curso")) || "—"}</div>
    <div class="result-item"><strong>Modalidade:</strong> ${(formData && formFormValue(formData, "modalidade")) || "—"}</div>
    <div class="result-item"><strong>Sua Média:</strong> ${safeFixed(formData && formFormValue(formData, "media"), 1)}</div>
    <h4 style="margin-top: 1rem;">Resultados por Campus:</h4>
  `

  data.forEach((campus) => {
    const chanceRaw = campus["Chance"] || campus.Chance || "—"
    const chance = chanceRaw.toString()
    let color
    switch (chance.toUpperCase()) {
      case "MUITO ALTA":
      case "ALTA":
        color = "#10b981" // verde
        break
      case "MÉDIA":
      case "MEDIA":
        color = "#f59e0b" // amarelo
        break
      case "BAIXA":
        color = "#ef4444" // vermelho
        break
      default:
        color = "#a0a0a0" // neutro
    }

    html += `
      <div class="result-item" style="border-left: 5px solid ${color}; padding-left: 10px;">
        <strong>${campus["Campus"] || campus["Nome do polo"] || "—"}</strong>
        <div style="margin-top: 0.5rem; display: grid; grid-template-columns: repeat(auto-fit,minmax(150px,1fr)); gap: 0.5rem;">
          <div><span style="color: var(--text-secondary);">Nota de Corte:</span> ${safeFixed(campus["Nota de corte na modalidade escolhida"] ?? campus["Nota de corte"] ?? null)}</div>
          <div><span style="color: var(--text-secondary);">Diferença:</span> ${safeFixed(campus["Diferença"] ?? campus["Diferença"] ?? null)}</div>
          <div><span style="color: var(--text-secondary);">Turno:</span> ${campus["Turno"] || campus["Informações do polo"]?.Turno || "—"}</div>
          <div><span style="color: var(--text-secondary);">Chance:</span> <strong style="color:${color}">${chance}</strong></div>
        </div>
      </div>
    `
  })

  contentDiv.innerHTML = html
  resultDiv.style.display = "block"
}

function displayCompararNotasResult(data, formData) {
  const resultDiv = document.getElementById("resultCompararNotas")
  if (!resultDiv) return
  const contentDiv = resultDiv.querySelector(".result-content")
  const mapa = {}
  if (Array.isArray(data)) {
    data.forEach((item) => {
      const chave = (item["Área"] || item.Area || "").toString().toLowerCase()
      mapa[chave] = item
    })
  }

  const subjects = [
    { key: "linguagens", label: "Linguagens", score: formData.linguagens },
    { key: "humanas", label: "Ciências Humanas", score: formData.humanas },
    { key: "natureza", label: "Ciências da Natureza", score: formData.natureza },
    { key: "matemática", label: "Matemática", score: formData.matematica },
    { key: "redacao", label: "Redação", score: formData.redacao },
  ]

  contentDiv.innerHTML = subjects
    .map((s) => {
      const item = mapa[s.key] || {}
      const situacao = item["Situação"] || item["Situacao"] || item["Situacao"] || "—"
      const mediaEstadual = item["Média estadual"] ?? item["Media estadual"] ?? "—"
      const diferenca = item["Diferença"] ?? item["Dif"] ?? "—"

      // Define a cor da situação
      let situacaoClass = "neutral"
      if (situacao.toLowerCase().includes("excelente")) situacaoClass = "positive"
      else if (situacao.toLowerCase().includes("ok")) situacaoClass = "warning"
      else if (situacao.toLowerCase().includes("abaixo")) situacaoClass = "negative"

      return `
      <div class="comparison-item">
        <div>
          <span class="subject">${s.label}</span>
        </div>
        <div class="scores">
          <span class="your-score">${safeFixed(s.score, 1)}</span>
          <span class="meta"> (Estadual: ${safeFixed(mediaEstadual, 1)})</span>
          <span class="difference situacao ${situacaoClass}">
            ${situacao}
          </span>
        </div>
        <div class="small">
          Diferença: ${typeof diferenca === "number" ? safeFixed(diferenca, 1) : diferenca}
        </div>
      </div>
    `
    })
    .join("")
  resultDiv.style.display = "block"
}

function displaySugestaoFocoResult(data, curso) {
  const resultDiv = document.getElementById("resultSugestaoFoco")
  if (!resultDiv) return
  const contentDiv = resultDiv.querySelector(".result-content")

  if (!Array.isArray(data) || data.length === 0) {
    contentDiv.innerHTML = `<div class="result-item"><strong>Curso:</strong> ${curso || "—"} — Nenhum ponto fraco detectado.</div>`
    resultDiv.style.display = "block"
    return
  }

  contentDiv.innerHTML = `
    <div class="result-item"><strong>Curso:</strong> ${curso}</div>
    ${data
      .map(
        (d) => `
      <div class="suggestion-card">
        <h4>${d["Matéria"]}</h4>
        <p><strong>Sua nota:</strong> ${safeFixed(d["Sua nota"], 1)}</p>
        <p><strong>Peso:</strong> ${d["Peso"]}</p>
        <p style="color: var(--warning);">Priorize essa matéria para melhorar sua média.</p>
      </div>`,
      )
      .join("")}
  `
  resultDiv.style.display = "block"
}

function displayCursosResult(data) {
  const resultDiv = document.getElementById("resultCursos")
  if (!resultDiv) return
  const contentDiv = resultDiv.querySelector(".result-content")

  const info = data["Informações gerais"] || {}
  const polos = data["Polos disponíveis"] || []

  const pesosHtml = info.Pesos
    ? `
      <div class="course-info-section">
        <h4>Pesos das Áreas</h4>
        ${Object.entries(info.Pesos)
          .map(([area, peso]) => `<div class="peso-item"><span>${area}</span> <strong>${peso}</strong></div>`)
          .join("")}
      </div>
    `
    : ""

  const polosHtml = polos
    .map(
      (p) => `
      <div class="campus-card">
        <h5>${p.Campus} - ${p.Turno || p.Turno || "—"}</h5>
        <div class="campus-info-grid">
          <div class="result-item"><strong>Duração:</strong> ${p.Duração || "—"}</div>
        </div>
        <h6 style="margin-top: 1rem; margin-bottom: 0.5rem; color: var(--text-secondary);">Notas de Corte por Modalidade:</h6>
        <div class="notas-corte-grid">
          ${Object.entries(p["Notas de corte"] || {})
            .filter(([_, nota]) => Number(nota) > 0)
            .map(
              ([modalidade, nota]) =>
                `<div class="nota-corte-item">${formatModalidade(modalidade)}: ${safeFixed(nota, 2)}</div>`,
            )
            .join("")}
        </div>
      </div>`,
    )
    .join("")

  contentDiv.innerHTML = `
    <div class="result-item"><strong>Curso:</strong> ${data.Curso || "—"}</div>
    <div class="result-item"><strong>Grau:</strong> ${info.Grau || "—"}</div>
    <div class="result-item"><strong>Área de Conhecimento:</strong> ${info["Área de conhecimento"] || "—"}</div>
    <div class="result-item"><strong>Descrição:</strong><p style="margin-top:0.5rem;color:var(--text-secondary);line-height:1.6">${info.Descrição || "—"}</p></div>
    ${pesosHtml}
    ${polosHtml}
  `
  resultDiv.style.display = "block"
}

// =======================
// HELPERS
// =======================

function formFormValue(formData, key) {
  if (!formData) return null
  return formData[key] ?? formData[key.toString()] ?? null
}

// map for modalidades
function formatModalidade(modalidade) {
  const modalidadeMap = {
    Ampla: "Ampla Concorrência",
    Ampla_Concorrencia: "Ampla Concorrência",
    PPI_1sm: "PPI - Baixa Renda (≤1 SM)",
    PPI_pub: "PPI - Escola Pública",
    Quilombo_1sm: "Quilombola - Baixa Renda (≤1 SM)",
    Quilombo_pub: "Quilombola - Escola Pública",
    PCD_1sm: "PCD - Baixa Renda (≤1 SM)",
    PCD_pub: "PCD - Escola Pública",
    Renda_1sm: "Baixa Renda (≤1 SM)",
    Escola_pub: "Escola Pública",
    PCD_livre: "PCD - Livre",
    "": "—",
  }
  return modalidadeMap[modalidade] || modalidade
}
