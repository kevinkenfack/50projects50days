const amountInput = document.getElementById('amount')
const peopleInput = document.getElementById('people')
const tipInput = document.getElementById('tip')
const tipValue = document.getElementById('tipValue')
const calcBtn = document.getElementById('calcBtn')
const result = document.getElementById('result')

const money = (n) =>
  new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(n)

tipInput.addEventListener('input', () => {
  tipValue.textContent = `${tipInput.value}%`
})

calcBtn.addEventListener('click', () => {
  const amount = Number(amountInput.value)
  const people = Number(peopleInput.value)
  const tip = Number(tipInput.value) / 100

  if (amount <= 0 || people < 1) {
    result.textContent = 'Veuillez saisir des valeurs valides.'
    return
  }

  const totalWithTip = amount * (1 + tip)
  const each = totalWithTip / people
  result.textContent = `Chaque personne: ${money(each)}`
})
