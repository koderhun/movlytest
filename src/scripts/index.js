import './vendor'

// Burger menu toggle
document
  .querySelector('.header__burger')
  .addEventListener('click', function () {
    const nav = document.querySelector('.header__nav')
    nav.classList.toggle('open')
    this.classList.toggle('active')
    this.setAttribute('aria-expanded', nav.classList.contains('open'))
  })

// FAQ toggle
document.querySelectorAll('.faq__question').forEach((button) => {
  button.addEventListener('click', function () {
    const isActive = this.classList.contains('active')
    const parent = this.closest('.faq__item')
    const answer = parent.querySelector('.faq__answer')

    if (isActive) {
      this.classList.remove('active')
      this.setAttribute('aria-expanded', 'false')
      answer.classList.remove('active')
    } else {
      this.classList.add('active')
      this.setAttribute('aria-expanded', 'true')
      answer.classList.add('active')
    }
  })
})
