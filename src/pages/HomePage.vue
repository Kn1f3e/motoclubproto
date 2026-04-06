<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { appStore } from '../state/AppStore'
import flagSrc from '../assets/flag.png'

const pageVisible = ref(false)
const isSectionsOpen = ref(false)
const activeSlideIndex = ref(0)
let galleryTimer = null

const preloaded = {
  club: false,
  events: false,
  routes: false,
  motoService: false
}

const cardAppearBaseDelay = 0.26
const cardAppearStep = 0.08

const triggerPageIntro = () => {
  pageVisible.value = false
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      setTimeout(() => {
        pageVisible.value = true
      }, 30)
    })
  })
}

const prefetchClub = () => {
  if (preloaded.club) return
  preloaded.club = true
  import('./ClubPage.vue')
}

const prefetchEvents = () => {
  if (preloaded.events) return
  preloaded.events = true
  import('./EventsPage.vue')
}

const prefetchRoutes = () => {
  if (preloaded.routes) return
  preloaded.routes = true
  import('./RoutesPage.vue')
}

const prefetchMotoService = () => {
  if (preloaded.motoService) return
  preloaded.motoService = true
  import('./MotoServicePage.vue')
}

const homeCardAppearStyle = (index) => ({
  '--appear-delay': `${cardAppearBaseDelay + index * cardAppearStep}s`
})

const motoServiceCard = computed(() => {
  if (appStore.state.language === 'ru') {
    return {
      title: 'МотоМаркет и Сервис',
      desc: 'Доставка и покупка техники с аукционов Японии и Китая, аксессуары под заказ, ремонт и аренда.'
    }
  }

  return {
    title: 'Moto Market & Service',
    desc: 'Auction sourcing and delivery from Japan/China, custom accessories, repair, and moto rental.'
  }
})

const homeSections = computed(() => [
  {
    key: 'club',
    to: '/club',
    title: appStore.t('home.clubTitle'),
    desc: appStore.t('home.clubDesc'),
    prefetch: prefetchClub
  },
  {
    key: 'events',
    to: '/events',
    title: appStore.t('home.eventsTitle'),
    desc: appStore.t('home.eventsDesc'),
    prefetch: prefetchEvents
  },
  {
    key: 'routes',
    to: '/routes',
    title: appStore.t('home.routesTitle'),
    desc: appStore.t('home.routesDesc'),
    prefetch: prefetchRoutes
  },
  {
    key: 'moto-service',
    to: '/moto-service',
    title: motoServiceCard.value.title,
    desc: motoServiceCard.value.desc,
    prefetch: prefetchMotoService
  }
])

const customSections = computed(() => {
  const sections = appStore.state.siteContent?.homeSections
  if (!Array.isArray(sections) || sections.length === 0) return null

  return sections.map((item, index) => {
    const to = typeof item.to === 'string' && item.to.trim() ? item.to.trim() : '/home'
    const prefetchMap = {
      '/club': prefetchClub,
      '/events': prefetchEvents,
      '/routes': prefetchRoutes,
      '/moto-service': prefetchMotoService
    }

    return {
      key: item.id || `custom-${index}`,
      to,
      title: item.title || (appStore.state.language === 'ru' ? 'Раздел' : 'Section'),
      desc: item.desc || '',
      prefetch: prefetchMap[to] || (() => {})
    }
  })
})

const resolvedHomeSections = computed(() => customSections.value || homeSections.value)

const gallerySlides = computed(() => {
  if (appStore.state.language === 'ru') {
    return [
      {
        key: 'mountain',
        src: flagSrc,
        title: 'Горные маршруты',
        desc: 'Поездки с панорамными видами и остановками на перевалах.'
      },
      {
        key: 'group',
        src: flagSrc,
        title: 'Клубные выезды',
        desc: 'Совместные мотопробеги и маршруты выходного дня.'
      },
      {
        key: 'sunset',
        src: flagSrc,
        title: 'Дальние путешествия',
        desc: 'Многодневные поездки и точки притяжения по пути.'
      }
    ]
  }

  return [
    {
      key: 'mountain',
      src: flagSrc,
      title: 'Mountain routes',
      desc: 'Rides with wide panoramic views and scenic pass stops.'
    },
    {
      key: 'group',
      src: flagSrc,
      title: 'Club rides',
      desc: 'Community ride-outs and curated weekend itineraries.'
    },
    {
      key: 'sunset',
      src: flagSrc,
      title: 'Long-distance touring',
      desc: 'Multi-day trips with memorable waypoints along the road.'
    }
  ]
})

const activeSlide = computed(() => gallerySlides.value[activeSlideIndex.value] ?? gallerySlides.value[0])

const startGalleryAutoplay = () => {
  if (galleryTimer) clearInterval(galleryTimer)
  galleryTimer = setInterval(() => {
    if (!gallerySlides.value.length) return
    activeSlideIndex.value = (activeSlideIndex.value + 1) % gallerySlides.value.length
  }, 4300)
}

const setSlide = (index) => {
  activeSlideIndex.value = index
}

onMounted(() => {
  triggerPageIntro()
  startGalleryAutoplay()
})

onBeforeUnmount(() => {
  if (galleryTimer) clearInterval(galleryTimer)
})
</script>

<template>
  <main :class="['home', 'page-appear', 'page-delay-1', { 'page-visible': pageVisible }]">
    <section class="home-layout">
      <section :class="['home-accordion', 'page-appear', 'page-delay-3', { 'page-visible': pageVisible }]">
        <button class="home-accordion-toggle" type="button" @click="isSectionsOpen = !isSectionsOpen">
          {{ appStore.state.language === 'ru' ? 'Разделы сайта' : 'Site sections' }}
          <span :class="['home-accordion-arrow', { open: isSectionsOpen }]">▾</span>
        </button>

        <Transition name="home-sections">
          <TransitionGroup v-if="isSectionsOpen" tag="ul" class="home-accordion-list" name="home-list-item">
            <li v-for="(section, index) in resolvedHomeSections" :key="section.key" class="home-accordion-item" :style="homeCardAppearStyle(index)">
              <RouterLink class="home-accordion-link" :to="section.to" @mouseenter="section.prefetch" @focus="section.prefetch">
                <span class="home-accordion-link-title">{{ section.title }}</span>
                <span class="home-accordion-link-desc">{{ section.desc }}</span>
              </RouterLink>
            </li>
          </TransitionGroup>
        </Transition>
      </section>

      <section class="home-content">
        <section :class="['home-hero', 'page-appear', 'page-delay-2', { 'page-visible': pageVisible }]">
          <h2>{{ appStore.getSiteContent('homeTitle', appStore.t('home.title')) }}</h2>
          <p>{{ appStore.getSiteContent('homeSubtitle', appStore.t('home.subtitle')) }}</p>
        </section>

        <section :class="['home-gallery', 'page-appear', 'page-delay-4', { 'page-visible': pageVisible }]">
          <Transition name="home-gallery-fade" mode="out-in">
        <figure :key="activeSlide.key" class="home-gallery-slide">
          <div class="home-gallery-media">
            <img class="home-gallery-bg" :src="activeSlide.src" :alt="activeSlide.title" loading="lazy" />
            <img class="home-gallery-fg" :src="activeSlide.src" :alt="activeSlide.title" loading="lazy" />
          </div>
          <figcaption>
            <h3>{{ activeSlide.title }}</h3>
            <p>{{ activeSlide.desc }}</p>
          </figcaption>
        </figure>
          </Transition>

          <div class="home-gallery-dots" role="tablist" :aria-label="appStore.state.language === 'ru' ? 'Слайды' : 'Slides'">
            <button
              v-for="(slide, index) in gallerySlides"
              :key="slide.key"
              type="button"
              :class="['home-gallery-dot', { active: index === activeSlideIndex }]"
              :aria-label="slide.title"
              @click="setSlide(index)"
            />
          </div>
        </section>
      </section>
    </section>
  </main>
</template>
