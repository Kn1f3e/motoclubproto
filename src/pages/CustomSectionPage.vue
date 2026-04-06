<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { appStore } from '../state/AppStore'

const route = useRoute()
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

const section = computed(() => {
  const path = route.path
  const sections = appStore.state.siteContent?.homeSections
  if (!Array.isArray(sections)) return null
  return sections.find((item) => item?.to === path) || null
})

const sectionCards = computed(() => appStore.getSectionCards(route.path, []))

onMounted(() => {
  if (!section.value) {
    router.replace({ name: 'not-found' })
    return
  }
  triggerPageIntro()
})
</script>

<template>
  <main v-if="section" :class="['detail-page', 'page-appear', 'page-delay-1', { 'page-visible': pageVisible }]">
    <section :class="['detail-card', 'page-appear', 'page-delay-2', { 'page-visible': pageVisible }]">
      <button type="button" class="detail-back-btn" @click="goBackSection">
        <span class="detail-back-icon" aria-hidden="true">&#8617;</span>
        <span>{{ appStore.state.language === 'ru' ? 'Назад' : 'Back' }}</span>
      </button>
      <h2>{{ section.title }}</h2>
      <p>{{ section.desc }}</p>
    </section>

    <section v-if="sectionCards.length" class="detail-grid">
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
