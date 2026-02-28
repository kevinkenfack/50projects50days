const colorA = document.getElementById('colorA')
const colorB = document.getElementById('colorB')
const angle = document.getElementById('angle')
const cssCode = document.getElementById('cssCode')
const copyBtn = document.getElementById('copyBtn')

function renderGradient() {
  const gradient = `linear-gradient(${angle.value}deg, ${colorA.value}, ${colorB.value})`
  document.body.style.background = gradient
  cssCode.textContent = `background: ${gradient};`
}

copyBtn.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(cssCode.textContent)
    copyBtn.textContent = 'Copié ✅'
    setTimeout(() => {
      copyBtn.textContent = 'Copier le CSS'
    }, 1200)
  } catch {
    copyBtn.textContent = 'Impossible de copier'
  }
})

;colorA.addEventListener('input', renderGradient)
;colorB.addEventListener('input', renderGradient)
;angle.addEventListener('input', renderGradient)

renderGradient()
