<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { appStore } from '../state/AppStore'

const router = useRouter()
const pageVisible = ref(false)
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

const goBackSection = () => {
  if (window.history.length > 1) {
    router.back()
    return
  }
  router.push('/home')
}

const blockAppearStyle = (index) => ({
  '--appear-delay': `${cardAppearBaseDelay + index * cardAppearStep}s`
})

const pageCopy = computed(() => {
  if (appStore.state.language === 'ru') {
    return {
      title: 'Ближайшие события',
      intro: 'Ближайшие выезды клуба, weekend-туры и встречи по планированию маршрутов.',
      cards: [
        {
          id: 'events-default-1',
          title: 'Ближайший выезд',
          subtitle: 'Суббота, 09:00',
          body: 'Сбор на основной площадке клуба, маршрут средней сложности.'
        }
      ]
    }
  }

  return {
    title: 'Upcoming events',
    intro: 'Upcoming club rides, weekend trips, and route planning meetings.',
    cards: [
      {
        id: 'events-default-1',
        title: 'Upcoming ride',
        subtitle: 'Saturday, 09:00',
        body: 'Meet at club point, medium-difficulty route.'
      }
    ]
  }
})

const sectionCards = computed(() => appStore.getSectionCards('/events', pageCopy.value.cards))

onMounted(triggerPageIntro)
</script>

<template>
  <main :class="['detail-page', 'page-appear', 'page-delay-1', { 'page-visible': pageVisible }]">
    <section :class="['detail-card', 'page-appear', 'page-delay-2', { 'page-visible': pageVisible }]">
      <button type="button" class="detail-back-btn" @click="goBackSection">
        <span class="detail-back-icon" aria-hidden="true">&#8617;</span>
        <span>{{ appStore.state.language === 'ru' ? 'Назад' : 'Back' }}</span>
      </button>
      <h2>{{ pageCopy.title }}</h2>
      <p>{{ pageCopy.intro }}</p>
    </section>

    <section class="detail-grid">
      <article
        v-for="(card, index) in sectionCards"
        :key="card.id || `${card.title}-${index}`"
        :class="['detail-card', 'detail-subcard', 'page-appear', { 'page-visible': pageVisible }]"
        :style="blockAppearStyle(index)"
      >
        <h3>{{ card.title }}</h3>
        <p v-if="card.subtitle">{{ card.subtitle }}</p>
        <p>{{ card.body }}</p>
      </article>
    </section>
  </main>
</template>
