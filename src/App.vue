<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router'
import { appStore } from './state/AppStore'
import logoSrc from './assets/logowithoutback.png'

const route = useRoute()
const router = useRouter()

const shellVisible = ref(false)
const isHeaderScrolled = ref(false)
const isCompactHeader = ref(false)
const showScrollTop = ref(false)
let shellTimer = null
const isBootLoading = ref(true)
let bootMinDelayTimer = null
let bootFactTimer = null
const bootFact = ref('')

const bootFactsByLang = {
  ru: [
    '\u041c\u043e\u0442\u043e\u0442\u0443\u0440\u0438\u0437\u043c \u0440\u0430\u0437\u0432\u0438\u0432\u0430\u0435\u0442 \u0432\u044b\u043d\u043e\u0441\u043b\u0438\u0432\u043e\u0441\u0442\u044c \u0438 \u043a\u043e\u043d\u0446\u0435\u043d\u0442\u0440\u0430\u0446\u0438\u044e \u043d\u0430 \u0434\u043e\u0440\u043e\u0433\u0435.',
    '\u041f\u0435\u0440\u0435\u0434 \u0434\u0430\u043b\u044c\u043d\u0438\u043c \u0432\u044b\u0435\u0437\u0434\u043e\u043c \u0432\u0430\u0436\u043d\u043e \u043f\u0440\u043e\u0432\u0435\u0440\u044f\u0442\u044c \u0434\u0430\u0432\u043b\u0435\u043d\u0438\u0435 \u0432 \u0448\u0438\u043d\u0430\u0445 \u0438 \u0446\u0435\u043f\u044c.',
    '\u042d\u043a\u0438\u043f\u0438\u0440\u043e\u0432\u043a\u0430 \u0441\u043d\u0438\u0436\u0430\u0435\u0442 \u0440\u0438\u0441\u043a \u0442\u0440\u0430\u0432\u043c \u0434\u0430\u0436\u0435 \u043d\u0430 \u0433\u043e\u0440\u043e\u0434\u0441\u043a\u0438\u0445 \u0441\u043a\u043e\u0440\u043e\u0441\u0442\u044f\u0445.',
    '\u041f\u043b\u0430\u043d\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u0435 \u043c\u0430\u0440\u0448\u0440\u0443\u0442\u0430 \u0441 \u0442\u043e\u0447\u043a\u0430\u043c\u0438 \u043e\u0442\u0434\u044b\u0445\u0430 \u0443\u043c\u0435\u043d\u044c\u0448\u0430\u0435\u0442 \u0443\u0441\u0442\u0430\u043b\u043e\u0441\u0442\u044c \u0440\u0430\u0439\u0434\u0435\u0440\u0430.',
    '\u0412 \u0433\u0440\u0443\u043f\u043f\u0435 \u0431\u0435\u0437\u043e\u043f\u0430\u0441\u043d\u0435\u0435 \u0435\u0445\u0430\u0442\u044c \u0432 \u0448\u0430\u0445\u043c\u0430\u0442\u043d\u043e\u043c \u043f\u043e\u0440\u044f\u0434\u043a\u0435, \u0441\u043e\u0445\u0440\u0430\u043d\u044f\u044f \u0434\u0438\u0441\u0442\u0430\u043d\u0446\u0438\u044e.',
    '\u0420\u0435\u0433\u0443\u043b\u044f\u0440\u043d\u044b\u0435 \u043a\u043e\u0440\u043e\u0442\u043a\u0438\u0435 \u043e\u0441\u0442\u0430\u043d\u043e\u0432\u043a\u0438 \u0434\u0435\u043b\u0430\u044e\u0442 \u0434\u0430\u043b\u044c\u043d\u0438\u0439 \u043f\u0443\u0442\u044c \u0437\u0430\u043c\u0435\u0442\u043d\u043e \u043a\u043e\u043c\u0444\u043e\u0440\u0442\u043d\u0435\u0435.'
  ],
  en: [
    'Moto touring builds stamina and road focus.',
    'Before a long ride, always check tire pressure and chain condition.',
    'Riding gear reduces injury risk even at city speeds.',
    'Route planning with rest points helps reduce rider fatigue.',
    'In group rides, staggered formation improves visibility and safety.',
    'Short regular breaks make long-distance riding more comfortable.'
  ]
}

const pickRandomFact = () => {
  const lang = appStore.state.language === 'en' ? 'en' : 'ru'
  const facts = bootFactsByLang[lang]
  const index = Math.floor(Math.random() * facts.length)
  bootFact.value = facts[index]
}

const showShell = computed(() => appStore.state.isAuthenticated && route.name !== 'auth')

const triggerShellIntro = () => {
  shellVisible.value = false
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      shellTimer = setTimeout(() => {
        shellVisible.value = true
      }, 30)
    })
  })
}

watch(
  showShell,
  (visible) => {
    if (visible) {
      triggerShellIntro()
      return
    }
    shellVisible.value = false
  },
  { immediate: true }
)

const openProfile = () => {
  router.push('/profile')
}

const updateScrollUiState = () => {
  isHeaderScrolled.value = window.scrollY > 10
  const scrollRange = Math.max(document.documentElement.scrollHeight - window.innerHeight, 0)
  const middlePoint = scrollRange * 0.5
  showScrollTop.value = window.scrollY >= middlePoint && window.scrollY > 140
}

const updateHeaderLayout = () => {
  isCompactHeader.value = window.innerWidth <= 600
}

const userGreetingText = computed(() => {
  if (isCompactHeader.value) return appStore.state.currentUserName
  return `${appStore.t('header.greeting')}, ${appStore.state.currentUserName}`
})

const scrollToTop = () => {
  const startY = window.scrollY
  if (startY <= 0) return

  const duration = 820
  const startTs = performance.now()

  const easeInOutCubic = (t) => {
    if (t < 0.5) return 4 * t * t * t
    return 1 - Math.pow(-2 * t + 2, 3) / 2
  }

  const step = (now) => {
    const elapsed = now - startTs
    const progress = Math.min(elapsed / duration, 1)
    const eased = easeInOutCubic(progress)
    const nextY = startY * (1 - eased)

    window.scrollTo(0, nextY)

    if (progress < 1) requestAnimationFrame(step)
  }

  requestAnimationFrame(step)
}

onBeforeUnmount(() => {
  if (bootMinDelayTimer) clearTimeout(bootMinDelayTimer)
  if (bootFactTimer) clearInterval(bootFactTimer)
  if (shellTimer) clearTimeout(shellTimer)
  window.removeEventListener('scroll', updateScrollUiState)
  window.removeEventListener('resize', updateHeaderLayout)
  appStore.dispose()
})

onMounted(() => {
  updateHeaderLayout()
  window.addEventListener('resize', updateHeaderLayout, { passive: true })
  updateScrollUiState()
  window.addEventListener('scroll', updateScrollUiState, { passive: true })

  pickRandomFact()
  bootFactTimer = setInterval(() => {
    if (!isBootLoading.value) return
    pickRandomFact()
  }, 1800)

  const logoReady = new Promise((resolve) => {
    const img = new Image()
    img.onload = resolve
    img.onerror = resolve
    img.src = logoSrc
  })

  const minDelay = new Promise((resolve) => {
    bootMinDelayTimer = setTimeout(resolve, 2600)
  })

  Promise.all([logoReady, minDelay]).then(() => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        isBootLoading.value = false
        if (bootFactTimer) clearInterval(bootFactTimer)
      })
    })
  })
})
</script>

<template>
  <div class="page">
    <Transition name="boot-loader">
      <div v-if="isBootLoading" class="boot-loader">
        <div class="boot-loader-content">
          <img class="boot-logo" :src="logoSrc" alt="VSE loading logo" />
          <div class="boot-fact-box">{{ bootFact }}</div>
        </div>
      </div>
    </Transition>

    <Transition name="welcome-toast">
      <div v-if="appStore.state.welcomeVisible" class="welcome-toast">{{ appStore.state.welcomeMessage }}</div>
    </Transition>

    <template v-if="showShell && !isBootLoading">
      <header
        :class="[
          'top-strip',
          'top-strip-global',
          'page-appear',
          'page-delay-1',
          { 'page-visible': shellVisible, 'top-strip-scrolled': isHeaderScrolled }
        ]"
      >
        <RouterLink to="/home" class="top-title top-title-link">{{ appStore.t('common.appTitle') }}</RouterLink>

        <div class="header-controls">
          <button type="button" class="user-greet" @click="openProfile">
            {{ userGreetingText }}
          </button>
        </div>
      </header>

      <section class="app-shell">
        <RouterView />
      </section>
    </template>

    <RouterView v-else-if="!isBootLoading" />

    <Transition name="scroll-top-fab">
      <button
        v-if="!isBootLoading && showScrollTop"
        type="button"
        class="scroll-top-btn"
        @click="scrollToTop"
        :title="appStore.state.language === 'ru' ? '\u041d\u0430\u0432\u0435\u0440\u0445' : 'Scroll to top'"
        aria-label="Scroll to top"
      >
        &#8593;
      </button>
    </Transition>
  </div>
</template>

