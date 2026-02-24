<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { appStore } from '../state/AppStore'

const router = useRouter()
const pageVisible = ref(false)
const backLabel = computed(() => (appStore.state.language === 'ru' ? 'Назад' : 'Back'))

const goBackSection = () => {
  if (window.history.length > 1) {
    router.back()
    return
  }
  router.push('/club')
}

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

onMounted(triggerPageIntro)
</script>

<template>
  <main :class="['detail-page', 'page-appear', 'page-delay-1', { 'page-visible': pageVisible }]">
    <section :class="['detail-card', 'page-appear', 'page-delay-2', { 'page-visible': pageVisible }]">
      <button type="button" class="detail-back-btn" @click="goBackSection">
        <span class="detail-back-icon" aria-hidden="true">&#8617;</span>
        <span>{{ backLabel }}</span>
      </button>
      <h2>{{ appStore.state.language === 'ru' ? 'Друзья и партнеры' : 'Friends and partners' }}</h2>
      <p>
        {{
          appStore.state.language === 'ru'
            ? 'Раздел о дружественных сообществах, технических партнерах и организациях, поддерживающих клубные проекты.'
            : 'Information about partner communities, technical collaborators, and organizations supporting club initiatives.'
        }}
      </p>
    </section>
  </main>
</template>
