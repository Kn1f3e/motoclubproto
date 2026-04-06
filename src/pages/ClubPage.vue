<script setup>
import { computed, onMounted, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { appStore } from '../state/AppStore'

const pageVisible = ref(false)
const router = useRouter()
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

const sectionCardAppearStyle = (index) => ({
  '--appear-delay': `${cardAppearBaseDelay + index * cardAppearStep}s`
})

const goBackSection = () => {
  if (window.history.length > 1) {
    router.back()
    return
  }
  router.push('/home')
}

const clubSections = computed(() => {
  if (appStore.state.language === 'en') {
    return [
      {
        to: '/club/charter',
        title: 'Club charter',
        body: 'Rules, safety principles, code of conduct, and participation standards for all members.'
      },
      {
        to: '/club/partners',
        title: 'Friends and partners',
        body: 'Trusted communities, technical partners, and local teams with whom the club runs rides and projects.'
      },
      {
        to: '/club/media',
        title: 'Photos and videos from club life',
        body: 'Media archive of trips, route reviews, and key moments from meetings and events.'
      },
      {
        to: '/club/plans',
        title: 'Club plans and development',
        body: 'Upcoming goals, route expansion, educational initiatives, and seasonal development roadmap.'
      }
    ]
  }

  return [
    {
      to: '/club/charter',
      title: 'Устав клуба',
      body: 'Правила, принципы безопасности, этика общения и формат участия для всех участников сообщества.'
    },
    {
      to: '/club/partners',
      title: 'Друзья и партнеры',
      body: 'Дружественные сообщества, технические партнеры и команды, с которыми клуб проводит совместные активности.'
    },
    {
      to: '/club/media',
      title: 'Фото, видео из жизни клуба',
      body: 'Медиаматериалы с выездов, обзоры маршрутов и ключевые моменты встреч и клубных событий.'
    },
    {
      to: '/club/plans',
      title: 'Планы и развитие клуба',
      body: 'Ближайшие цели, расширение маршрутов, обучающие инициативы и планы развития клуба по сезонам.'
    }
  ]
})

const extraClubCards = computed(() => {
  return appStore.getSectionCards('/club', [])
})

onMounted(triggerPageIntro)
</script>

<template>
  <main :class="['detail-page', 'page-appear', 'page-delay-1', { 'page-visible': pageVisible }]">
    <section :class="['detail-card', 'detail-card-main', 'page-appear', 'page-delay-2', { 'page-visible': pageVisible }]">
      <button type="button" class="detail-back-btn" @click="goBackSection">
        <span class="detail-back-icon" aria-hidden="true">&#8617;</span>
        <span>{{ appStore.state.language === 'ru' ? 'Назад' : 'Back' }}</span>
      </button>
      <h2>{{ appStore.t('club.title') }}</h2>
      <p>{{ appStore.t('club.body') }}</p>
    </section>

    <section class="detail-grid">
      <RouterLink
        v-for="(section, index) in clubSections"
        :key="section.to"
        :to="section.to"
        :class="[
          'detail-card',
          'detail-subcard',
          'detail-link-card',
          'page-appear',
          { 'page-visible': pageVisible }
        ]"
        :style="sectionCardAppearStyle(index)"
      >
        <h3>{{ section.title }}</h3>
        <p>{{ section.body }}</p>
      </RouterLink>
    </section>

    <section v-if="extraClubCards.length" class="detail-grid">
      <article
        v-for="(card, index) in extraClubCards"
        :key="card.id || `${card.title}-${index}`"
        :class="['detail-card', 'detail-subcard', 'page-appear', { 'page-visible': pageVisible }]"
        :style="sectionCardAppearStyle(index + clubSections.length)"
      >
        <h3>{{ card.title }}</h3>
        <p v-if="card.subtitle">{{ card.subtitle }}</p>
        <p>{{ card.body }}</p>
      </article>
    </section>
  </main>
</template>
