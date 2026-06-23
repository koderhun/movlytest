;(function () {
  'use strict'

  // Функция инициализации слайдера
  function initSwiper() {
    // Проверяем, загружен ли Swiper
    if (typeof Swiper === 'undefined') {
      console.warn('Swiper не загружен, повторная попытка через 100мс')
      setTimeout(initSwiper, 100)
      return
    }

    console.log('Swiper загружен, инициализация слайдера...')

    // Убеждаемся, что DOM загружен
    const container = document.querySelector('.slider-section__container')
    if (!container) {
      console.warn('Контейнер слайдера не найден')
      setTimeout(initSwiper, 100)
      return
    }

    // Находим активный слайд (третий по счету, индекс 2)
    const slides = document.querySelectorAll('.slider-section__slide')
    if (slides.length > 2) {
      // Устанавливаем начальный активный слайд
      slides.forEach((slide, index) => {
        if (index === 2) {
          slide.classList.add('swiper-slide-active')
        } else {
          slide.classList.remove('swiper-slide-active')
        }
      })
    }

    // Создаем экземпляр Swiper
    const swiper = new Swiper('.slider-section__container', {
      // Показываем 5 слайдов с центрированием
      slidesPerView: 5,
      centeredSlides: true,
      initialSlide: 2, // Начинаем с третьего слайда (индекс 2)
      spaceBetween: 20,
      loop: true,
      speed: 600,
      watchSlidesProgress: true,

      // Навигация
      navigation: {
        nextEl: '.slider-section__button--next',
        prevEl: '.slider-section__button--prev',
      },

      // Адаптивность
      breakpoints: {
        320: {
          slidesPerView: 1.2,
          spaceBetween: 10,
          centeredSlides: true,
        },
        480: {
          slidesPerView: 2,
          spaceBetween: 15,
          centeredSlides: true,
        },
        768: {
          slidesPerView: 3,
          spaceBetween: 20,
          centeredSlides: true,
        },
        1024: {
          slidesPerView: 5,
          spaceBetween: 20,
          centeredSlides: true,
        },
      },

      // События
      on: {
        init: function () {
          updateInfoBlock(this)
          updateSlideStates(this)
        },
        slideChange: function () {
          updateInfoBlock(this)
          updateSlideStates(this)
        },
        slideChangeTransitionEnd: function () {
          updateSlideStates(this)
        },
      },
    })

    // Функция обновления информационного блока
    function updateInfoBlock(swiperInstance) {
      const activeSlide = swiperInstance.slides[swiperInstance.activeIndex]
      const title = activeSlide
        ? activeSlide.querySelector('.slider-section__title')
        : null
      const infoText = document.getElementById('activeInfo')

      if (title && infoText) {
        infoText.textContent = title.textContent
        infoText.classList.remove('info-block__text--active')
        // Триггер перезапуска анимации
        void infoText.offsetWidth
        infoText.classList.add('info-block__text--active')
      }
    }

    // Функция обновления состояний слайдов
    function updateSlideStates(swiperInstance) {
      const slides = swiperInstance.slides
      const activeIndex = swiperInstance.activeIndex

      slides.forEach((slide, index) => {
        // Удаляем все специальные классы
        slide.classList.remove('slider-section__slide--active')
        slide.classList.remove('slider-section__slide--inactive')
        slide.classList.remove('slider-section__slide--near')

        // Определяем расстояние от активного слайда
        const distance = Math.abs(index - activeIndex)

        if (distance === 0) {
          // Активный слайд (центральный)
          slide.classList.add('slider-section__slide--active')
        } else if (distance <= 2) {
          // Близкие к активному (соседние)
          slide.classList.add('slider-section__slide--near')
        } else {
          // Далекие (неактивные)
          slide.classList.add('slider-section__slide--inactive')
        }
      })
    }

    // Обработка кликов по слайдам
    document.querySelectorAll('.slider-section__slide').forEach((slide) => {
      slide.addEventListener('click', function () {
        const index = this.dataset.index
        if (index !== undefined) {
          swiper.slideTo(parseInt(index))
        }
      })
    })

    // Сохраняем экземпляр в глобальную область
    window.swiper = swiper

    console.log('Слайдер успешно инициализирован')
  }

  // Запускаем инициализацию после загрузки DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSwiper)
  } else {
    initSwiper()
  }
})()
