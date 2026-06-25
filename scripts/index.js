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
      centeredSlides: true,
      initialSlide: 2,
      spaceBetween: 8,
      speed: 600,
      autoplay: {
        delay: 9000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      },

      navigation: {
        nextEl: '.slider-section__button--next',
        prevEl: '.slider-section__button--prev',
      },

      breakpoints: {
        320: {
          slidesPerView: 1.2,
        },
        480: {
          slidesPerView: 2,
        },
        768: {
          slidesPerView: 3,
        },
        1024: {
          slidesPerView: 5,
        },
      },

      // События Swiper
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

  const header = document.querySelector('.header')

  if (header) {
    let lastScrollY = window.scrollY
    let ticking = false

    const updateHeader = () => {
      const currentScrollY = window.scrollY
      const scrollThreshold = 50

      if (currentScrollY > scrollThreshold) {
        header.classList.add('header--scrolled')
      } else {
        header.classList.remove('header--scrolled')
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

  if (burger && headerRight) {
    burger.addEventListener('click', () => {
      const isExpanded = burger.getAttribute('aria-expanded') === 'true'
      burger.setAttribute('aria-expanded', String(!isExpanded))
      headerRight.classList.toggle('header__right--open', !isExpanded)
      document.body.classList.toggle('menu-open', !isExpanded)
    })

    headerRight.querySelectorAll('.header__link').forEach((link) => {
      link.addEventListener('click', () => {
        burger.setAttribute('aria-expanded', 'false')
        headerRight.classList.remove('header__right--open')
        document.body.classList.remove('menu-open')
      })
    })
  }

  // акардион
})
