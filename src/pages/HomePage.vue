<script setup>
import { computed, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { appStore } from '../state/AppStore'

const pageVisible = ref(false)
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

const homeFooterAppearStyle = computed(() => ({
  '--appear-delay': `${cardAppearBaseDelay + 4 * cardAppearStep + cardAppearStep}s`
}))

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

onMounted(triggerPageIntro)
</script>

<template>
  <main :class="['home', 'page-appear', 'page-delay-1', { 'page-visible': pageVisible }]">
    <section :class="['home-hero', 'page-appear', 'page-delay-2', { 'page-visible': pageVisible }]">
      <h2>{{ appStore.t('home.title') }}</h2>
      <p>{{ appStore.t('home.subtitle') }}</p>
    </section>

    <section class="home-grid">
      <RouterLink
        :class="['home-card', 'home-link-card', 'page-appear', { 'page-visible': pageVisible }]"
        :style="homeCardAppearStyle(0)"
        to="/club"
        @mouseenter="prefetchClub"
        @focus="prefetchClub"
      >
        <h3>{{ appStore.t('home.clubTitle') }}</h3>
        <p>{{ appStore.t('home.clubDesc') }}</p>
      </RouterLink>

      <RouterLink
        :class="['home-card', 'home-link-card', 'page-appear', { 'page-visible': pageVisible }]"
        :style="homeCardAppearStyle(1)"
        to="/events"
        @mouseenter="prefetchEvents"
        @focus="prefetchEvents"
      >
        <h3>{{ appStore.t('home.eventsTitle') }}</h3>
        <p>{{ appStore.t('home.eventsDesc') }}</p>
      </RouterLink>

      <RouterLink
        :class="['home-card', 'home-link-card', 'page-appear', { 'page-visible': pageVisible }]"
        :style="homeCardAppearStyle(2)"
        to="/routes"
        @mouseenter="prefetchRoutes"
        @focus="prefetchRoutes"
      >
        <h3>{{ appStore.t('home.routesTitle') }}</h3>
        <p>{{ appStore.t('home.routesDesc') }}</p>
      </RouterLink>

      <RouterLink
        :class="['home-card', 'home-link-card', 'page-appear', { 'page-visible': pageVisible }]"
        :style="homeCardAppearStyle(3)"
        to="/moto-service"
        @mouseenter="prefetchMotoService"
        @focus="prefetchMotoService"
      >
        <h3>{{ motoServiceCard.title }}</h3>
        <p>{{ motoServiceCard.desc }}</p>
      </RouterLink>
    </section>

    <footer :class="['home-footer', 'page-appear', { 'page-visible': pageVisible }]" :style="homeFooterAppearStyle">
      <div class="home-footer-block">
        <h4>{{ appStore.state.language === 'ru' ? 'Связь с нами' : 'Stay Connected' }}</h4>
        <p class="home-footer-label">{{ appStore.state.language === 'ru' ? 'Соцсети' : 'Social' }}</p>
        <div class="home-footer-links" aria-label="Social links">
          <a
            class="social-icon-link"
            href="https://t.me/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Telegram"
            title="Telegram"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="M21.9 4.6c.2-.9-.5-1.6-1.4-1.3L3.1 9.3c-1 .3-1 1.7 0 2l4.6 1.5 1.7 5.3c.3.9 1.4 1.1 2 .3l2.5-3.3 4.6 3.4c.7.5 1.7.2 1.9-.7L21.9 4.6zM9.5 12.3l8.2-5.6-6.5 6.8-.3 3.2-1.4-4.4z" />
            </svg>
          </a>
          <a
            class="social-icon-link"
            href="https://vk.com/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="VK"
            title="VK"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="M3.9 7.5c.2 4.5 2.4 8.7 6.2 8.7h.6v-3.3c1.9.2 3.3 1.6 3.9 3.3h2.7c-.8-2.8-2.9-4.3-4.2-4.9 1.3-.8 3.1-2.6 3.5-4.7h-2.4c-.5 1.7-2.2 3.5-3.5 3.7V6.6H8.2v6.5c-1.4-.4-3.1-2.3-3.2-5.6H3.9z" />
            </svg>
          </a>
          <a
            class="social-icon-link"
            href="https://www.youtube.com/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="YouTube"
            title="YouTube"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="M21.6 8.1a2.8 2.8 0 0 0-2-2c-1.8-.5-7.6-.5-7.6-.5s-5.8 0-7.6.5a2.8 2.8 0 0 0-2 2A29.7 29.7 0 0 0 2 12a29.7 29.7 0 0 0 .4 3.9 2.8 2.8 0 0 0 2 2c1.8.5 7.6.5 7.6.5s5.8 0 7.6-.5a2.8 2.8 0 0 0 2-2A29.7 29.7 0 0 0 22 12a29.7 29.7 0 0 0-.4-3.9zM10 15.2V8.8l5.2 3.2L10 15.2z" />
            </svg>
          </a>
        </div>
      </div>

      <div class="home-footer-block">
        <h4>{{ appStore.state.language === 'ru' ? 'Контакты' : 'Contacts' }}</h4>
        <p class="home-footer-contact">
          {{ appStore.state.language === 'ru' ? 'Email' : 'Email' }}:
          <a href="mailto:contact@vsemoto.club">contact@vsemoto.club</a>
        </p>
        <p class="home-footer-contact">
          {{ appStore.state.language === 'ru' ? 'Телефон' : 'Phone' }}:
          <a href="tel:+79001234567">+7 (900) 123-45-67</a>
        </p>
      </div>
    </footer>
  </main>
</template>
