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
      cards: [
        {
          id: 'service-default-1',
          title: 'Покупка и доставка',
          subtitle: 'Япония / Китай',
          body: 'Подбор техники с аукционов, проверка, доставка и оформление.'
        },
        {
          id: 'service-default-2',
          title: 'Аксессуары',
          subtitle: 'Под заказ',
          body: 'Подбор экипировки, расходников и аксессуаров под конкретную модель.'
        }
      ]
    }
  }

  return {
    title: 'Moto Market & Service',
    intro:
      'A section for sourcing, buying, and servicing motorcycles: from auctions to maintenance and rental.',
    cards: [
      {
        id: 'service-default-1',
        title: 'Purchase and delivery',
        subtitle: 'Japan / China',
        body: 'Auction sourcing, checks, delivery, and documentation.'
      },
      {
        id: 'service-default-2',
        title: 'Accessories',
        subtitle: 'On request',
        body: 'Gear, parts, and accessories tailored to a specific bike model.'
      }
    ]
  }
})

const sectionCards = computed(() => appStore.getSectionCards('/moto-service', pageCopy.value.cards))

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
