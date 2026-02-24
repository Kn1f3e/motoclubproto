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
      title: 'МотоМаркет и Сервис',
      intro:
        'Раздел для подбора, покупки и обслуживания мототехники: от аукционов до ремонта и аренды.',
      blocks: [
        {
          title: 'Покупка и доставка техники',
          body: 'Подбор мотоциклов с аукционов Японии и Китая, сопровождение сделки, логистика и доставка.'
        },
        {
          title: 'Аксессуары под заказ',
          body: 'Подбор экипировки, расходников и аксессуаров под конкретную модель и задачи райдера.'
        },
        {
          title: 'Ремонт и обслуживание',
          body: 'Плановое ТО, диагностика, ремонт и подготовка техники к сезону и дальним поездкам.'
        },
        {
          title: 'Аренда мототехники',
          body: 'Временная аренда техники для поездок, мероприятий и тестовых маршрутов.'
        }
      ]
    }
  }

  return {
    title: 'Moto Market & Service',
    intro:
      'A section for sourcing, buying, and servicing motorcycles: from auctions to maintenance and rental.',
    blocks: [
      {
        title: 'Purchase and delivery',
        body: 'Motorcycle sourcing from Japanese and Chinese auctions, deal support, logistics, and delivery.'
      },
      {
        title: 'Accessories on request',
        body: 'Gear, parts, and accessories tailored to a specific bike model and rider needs.'
      },
      {
        title: 'Repair and maintenance',
        body: 'Scheduled service, diagnostics, repairs, and bike preparation for season rides and long trips.'
      },
      {
        title: 'Moto rental',
        body: 'Short-term bike rental for trips, events, and test routes.'
      }
    ]
  }
})

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
        v-for="(block, index) in pageCopy.blocks"
        :key="block.title"
        :class="['detail-card', 'detail-subcard', 'page-appear', { 'page-visible': pageVisible }]"
        :style="blockAppearStyle(index)"
      >
        <h3>{{ block.title }}</h3>
        <p>{{ block.body }}</p>
      </article>
    </section>
  </main>
</template>
