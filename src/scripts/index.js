$(() => {
  'use strict'

  function initSwiper() {
    if (typeof Swiper === 'undefined') {
      setTimeout(initSwiper, 100)
      return
    }

    const container = document.querySelector('.slider-section__container')
    if (!container) {
      setTimeout(initSwiper, 100)
      return
    }

    // Функция обновления data-атрибута на body
    function updateBodyIndex(swiperInstance) {
      // Получаем активный слайд
      const activeSlide = swiperInstance.slides[swiperInstance.activeIndex]

      const $banerContainer = document.querySelector('.baner__container')

      if (activeSlide) {
        // Читаем data-index из активного слайда
        const dataIndex = activeSlide.getAttribute('data-index')

        if (dataIndex !== null) {
          // Записываем в body
          $banerContainer.setAttribute('data-active-slide', dataIndex)

          // Также можно добавить класс для стилизации
          // Удаляем старые классы
          $banerContainer.classList.forEach((className) => {
            if (className.startsWith('slide-')) {
              $banerContainer.classList.remove(className)
            }
          })

          // Добавляем новый класс
          $banerContainer.classList.add(`slide-${dataIndex}`)

          console.log(`Активный слайд: ${dataIndex}`) // Для отладки
        }
      }
    }

    const swiper = new Swiper('.slider-section__container', {
      slidesPerView: 5,
      centeredSlides: true, // центральный слайд активный
      initialSlide: 2, // стартуем с центра
      spaceBetween: 8,
      speed: 600,
      loop: true, // бесконечный
      loopedSlides: 10, // рекомендуется для 5 видимых слайдов

      navigation: {
        nextEl: '.slider-section__button--next',
        prevEl: '.slider-section__button--prev',
      },

      breakpoints: {
        320: {
          slidesPerView: 1.8,
          centeredSlides: true,
        },
        480: {
          slidesPerView: 2.5,
          centeredSlides: true,
        },
        768: {
          slidesPerView: 3.5,
          centeredSlides: true,
        },
        1024: {
          slidesPerView: 5, // строго 5 слайдов
          centeredSlides: true,
          spaceBetween: 8,
        },
      },

      // События
      on: {
        init: function () {
          updateBodyIndex(this)
        },
        slideChange: function () {
          updateBodyIndex(this)
        },
        slideChangeTransitionEnd: function () {
          updateBodyIndex(this)
        },
      },
    })

    window.swiper = swiper
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSwiper)
  } else {
    initSwiper()
  }

  // header sticky

  // не показываем фиксированное меню на главной

  const isHomePage =
    window.location.pathname === '/' || window.location.pathname === ''
  console.log('isHomePage:', isHomePage)

  const header = document.querySelector('.header')

  const body = document.querySelector('body')

  if (!isHomePage && header) {
    let lastScrollY = window.scrollY
    let ticking = false

    const updateHeader = () => {
      const currentScrollY = window.scrollY
      const scrollThreshold = 60

      if (currentScrollY > scrollThreshold) {
        header.classList.add('header--scrolled')
        body.classList.add('page-scrolled')
      } else {
        header.classList.remove('header--scrolled')
        body.classList.remove('page-scrolled')
      }

      lastScrollY = currentScrollY
      ticking = false
    }

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateHeader()
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', onScroll, {passive: true})

    updateHeader()
  }

  const burger = document.querySelector('.header__burger')
  const headerRight = document.querySelector('.header__right')

  const MenuClose = () => {
    burger.setAttribute('aria-expanded', 'false')
    headerRight.classList.remove('header__right--open')
    document.body.classList.remove('menu-open')
  }

  if (burger && headerRight) {
    burger.addEventListener('click', () => {
      const isExpanded = burger.getAttribute('aria-expanded') === 'true'
      burger.setAttribute('aria-expanded', String(!isExpanded))
      headerRight.classList.toggle('header__right--open', !isExpanded)
      document.body.classList.toggle('menu-open', !isExpanded)
    })

    headerRight.querySelectorAll('.header__link').forEach((link) => {
      link.addEventListener('click', () => {
        MenuClose()
      })
    })

    document.querySelector('.menu-close').addEventListener('click', () => {
      MenuClose()
    })
  }

  function formatPhoneValue(value) {
    const digits = value.replace(/\D/g, '')
    if (!digits) {
      return ''
    }

    let normalized = digits
    if (normalized.startsWith('8')) {
      normalized = '7' + normalized.slice(1)
    }
    if (!normalized.startsWith('7')) {
      normalized = '7' + normalized
    }
    normalized = normalized.slice(0, 11)

    const local = normalized.slice(1)
    const part1 = local.slice(0, 3)
    const part2 = local.slice(3, 6)
    const part3 = local.slice(6, 8)
    const part4 = local.slice(8, 10)

    let formatted = '+7'
    if (part1) formatted += ' ' + part1
    if (part2) formatted += ' ' + part2
    if (part3) formatted += ' ' + part3
    if (part4) formatted += ' ' + part4

    return formatted
  }

  function isPhoneFilled(value) {
    return /^\+7\s\d{3}\s\d{3}\s\d{2}\s\d{2}$/.test(value)
  }

  function setContactMode(mode) {
    const phoneInput = document.getElementById('phone')
    const telegramInput = document.getElementById('telegram')
    if (!phoneInput || !telegramInput) {
      return
    }

    const phoneActive = mode === 'phone'
    phoneInput.disabled = !phoneActive
    telegramInput.disabled = phoneActive
    phoneInput.required = phoneActive
    telegramInput.required = !phoneActive

    if (!phoneActive) {
      phoneInput.value = ''
    } else {
      telegramInput.value = ''
    }
  }

  function validateForm() {
    const nameInput = document.getElementById('name')
    const phoneInput = document.getElementById('phone')
    const telegramInput = document.getElementById('telegram')
    const agreementInput = document.querySelector('input[name="agreement"]')
    const submitButton = document.querySelector('.form__submit')
    const activeContact = document.querySelector(
      'input[name="contact-type"]:checked',
    )

    if (
      !nameInput ||
      !phoneInput ||
      !telegramInput ||
      !agreementInput ||
      !submitButton ||
      !activeContact
    ) {
      return
    }

    const nameFilled = nameInput.value.trim().length > 0
    const phoneFilled =
      activeContact.value === 'phone' && isPhoneFilled(phoneInput.value.trim())
    const telegramFilled =
      activeContact.value === 'telegram' &&
      telegramInput.value.trim().length > 0
    const agreementChecked = agreementInput.checked

    submitButton.disabled = !(
      nameFilled &&
      (phoneFilled || telegramFilled) &&
      agreementChecked
    )
  }

  const contactRadios = document.querySelectorAll('input[name="contact-type"]')
  contactRadios.forEach((radio) => {
    radio.addEventListener('change', () => {
      setContactMode(radio.value)
      validateForm()
    })
  })

  const phoneInput = document.getElementById('phone')
  const telegramInput = document.getElementById('telegram')
  const nameInput = document.getElementById('name')
  const agreementInput = document.querySelector('input[name="agreement"]')

  if (phoneInput) {
    phoneInput.addEventListener('input', () => {
      const formatted = formatPhoneValue(phoneInput.value)
      phoneInput.value = formatted
      validateForm()
    })
  }

  if (telegramInput) {
    telegramInput.addEventListener('input', validateForm)
  }

  if (nameInput) {
    nameInput.addEventListener('input', validateForm)
  }

  if (agreementInput) {
    agreementInput.addEventListener('change', validateForm)
  }

  const successModal = document.getElementById('formSuccessModal')
  const formElement = document.querySelector('.form')

  function openModal() {
    if (!successModal) {
      return
    }

    successModal.classList.add('modal--visible')
    successModal.setAttribute('aria-hidden', 'false')
    document.body.classList.add('modal-open')
  }

  function closeModal() {
    if (!successModal) {
      return
    }

    successModal.classList.remove('modal--visible')
    successModal.setAttribute('aria-hidden', 'true')
    document.body.classList.remove('modal-open')

    document.querySelector('.form-section').scrollIntoView({
      behavior: 'smooth',
    })
  }

  document.querySelectorAll('[data-modal-close]').forEach((button) => {
    button.addEventListener('click', closeModal)
  })

  if (successModal) {
    successModal.addEventListener('click', (event) => {
      if (event.target === successModal) {
        closeModal()
      }
    })
  }

  document.addEventListener('keydown', (event) => {
    if (
      event.key === 'Escape' &&
      successModal?.classList.contains('modal--visible')
    ) {
      closeModal()
    }
  })

  // start form validation
  if (formElement) {
    formElement.addEventListener('submit', async (event) => {
      event.preventDefault()

      const submitButton = formElement.querySelector('.form__submit')
      if (!submitButton || submitButton.disabled) {
        return
      }

      const apiUrl = 'SendRequest.php'
      const activeContact = document.querySelector(
        'input[name="contact-type"]:checked',
      )
      const payload = {
        name: nameInput?.value.trim(),
        contactType: activeContact?.value || null,
        phone: phoneInput?.value.trim(),
        telegram: telegramInput?.value.trim(),
        agreement: agreementInput?.checked,
      }

      try {
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        })

        if (!response.ok) {
          throw new Error('Ошибка запроса')
        }

        openModal()
        formElement.reset()
        setContactMode('phone')
        validateForm()
      } catch (error) {
        console.error('Ошибка отправки формы', error)
        alert('Не удалось отправить заявку. Попробуйте позже.')
      }
    })
  }

  // end form validation

  setContactMode(
    document.querySelector('input[name="contact-type"]:checked')?.value ||
      'telegram',
  )
  validateForm()

  //   // акардион
})
