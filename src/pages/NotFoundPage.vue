<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { appStore } from '../state/AppStore'

const router = useRouter()
const pageVisible = ref(false)

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

const messageText = computed(() =>
  appStore.state.language === 'ru'
    ? `Мы заехали не туда... Такого маршрута нет. Ошибка 404.`
    : `We took a wrong turn... This route does not exist. Error 404.`
)
const backHomeText = computed(() => (appStore.state.language === 'ru' ? 'На главную' : 'Go to home'))

const goHome = () => {
  router.push('/home')
}

onMounted(triggerPageIntro)
</script>

<template>
  <main :class="['detail-page', 'page-appear', 'page-delay-1', { 'page-visible': pageVisible }]">
    <section :class="['detail-card', 'page-appear', 'page-delay-2', { 'page-visible': pageVisible }]">
      <p class="not-found-message">{{ messageText }}</p>
      <button type="button" class="detail-back-btn not-found-btn" @click="goHome">
        <span>{{ backHomeText }}</span>
      </button>
    </section>
  </main>
</template>
