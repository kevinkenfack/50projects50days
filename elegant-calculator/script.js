const display = document.getElementById('display')
const history = document.getElementById('history')
const keys = document.querySelector('.keys')

const state = {
  current: '0',
  previous: null,
  operator: null,
  overwrite: false,
}

const format = (value) => {
  const number = Number(value)

  if (!Number.isFinite(number)) {
    return 'Erreur'
  }

  return new Intl.NumberFormat('fr-FR', {
    maximumFractionDigits: 10,
  }).format(number)
}

const updateDisplay = () => {
  display.textContent = format(state.current)

  if (state.previous !== null && state.operator) {
    const opSymbol = state.operator.replace('*', '×').replace('/', '÷').replace('-', '−')
    history.textContent = `${format(state.previous)} ${opSymbol}`
  } else {
    history.textContent = ''
  }
}

const calculate = () => {
  const prev = Number(state.previous)
  const current = Number(state.current)
  if (!Number.isFinite(prev) || !Number.isFinite(current)) return

  switch (state.operator) {
    case '+':
      state.current = String(prev + current)
      break
    case '-':
      state.current = String(prev - current)
      break
    case '*':
      state.current = String(prev * current)
      break
    case '/':
      state.current = current === 0 ? 'NaN' : String(prev / current)
      break
    default:
      return
  }
}

const appendNumber = (value) => {
  if (state.overwrite) {
    state.current = '0'
    state.overwrite = false
  }

  if (state.current === '0') {
    state.current = value
    return
  }

  state.current += value
}

const appendDecimal = () => {
  if (state.overwrite) {
    state.current = '0'
    state.overwrite = false
  }

  if (!state.current.includes('.')) {
    state.current += '.'
  }
}

const setOperator = (op) => {
  if (state.operator && !state.overwrite) {
    calculate()
  }

  state.previous = state.current
  state.operator = op
  state.overwrite = true
}

const clearAll = () => {
  state.current = '0'
  state.previous = null
  state.operator = null
  state.overwrite = false
}

const deleteOne = () => {
  if (state.overwrite) return

  if (state.current.length <= 1) {
    state.current = '0'
    return
  }

  state.current = state.current.slice(0, -1)
}

const percentage = () => {
  state.current = String(Number(state.current) / 100)
}

const computeResult = () => {
  if (!state.operator || state.previous === null) return

  calculate()
  state.previous = null
  state.operator = null
  state.overwrite = true
}

keys.addEventListener('click', (event) => {
  const button = event.target.closest('button')
  if (!button) return

  const action = button.dataset.action
  const value = button.dataset.value

  if (action === 'number' && value) appendNumber(value)
  if (action === 'decimal') appendDecimal()
  if (action === 'operator' && value) setOperator(value)
  if (action === 'clear') clearAll()
  if (action === 'delete') deleteOne()
  if (action === 'percent') percentage()
  if (action === 'equals') computeResult()

  updateDisplay()
})

window.addEventListener('keydown', (event) => {
  if (/^[0-9]$/.test(event.key)) appendNumber(event.key)
  if (event.key === ',' || event.key === '.') appendDecimal()
  if (['+', '-', '*', '/'].includes(event.key)) setOperator(event.key)
  if (event.key === 'Enter' || event.key === '=') computeResult()
  if (event.key === 'Backspace') deleteOne()
  if (event.key === 'Escape') clearAll()
  if (event.key === '%') percentage()

  updateDisplay()
})

updateDisplay()
