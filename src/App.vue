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
const isMobileLayout = ref(false)
const showScrollTop = ref(false)
let shellTimer = null
const isBootLoading = ref(true)
let bootMinDelayTimer = null
let bootFactTimer = null
const bootFact = ref('')
const MOBILE_DESKTOP_VIEWPORT = 980

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

const isPhysicalMobileDevice = () => {
  const sw = window.screen?.width || window.innerWidth
  const sh = window.screen?.height || window.innerHeight
  return Math.min(sw, sh) <= 900
}

const updateHeaderLayout = () => {
  const isPhoneDevice = isPhysicalMobileDevice()
  const forcedDesktopOnMobile = isPhoneDevice && appStore.state.viewMode === 'desktop'
  isMobileLayout.value = isPhoneDevice && !forcedDesktopOnMobile
  isCompactHeader.value = window.innerWidth <= 600 && !forcedDesktopOnMobile
}

const applyViewportMode = () => {
  if (typeof document === 'undefined') return
  let viewportMeta = document.querySelector('meta[name="viewport"]')
  if (!viewportMeta) {
    viewportMeta = document.createElement('meta')
    viewportMeta.setAttribute('name', 'viewport')
    document.head.appendChild(viewportMeta)
  }

  const isPhoneDevice = isPhysicalMobileDevice()
  const forcedDesktopOnMobile = isPhoneDevice && appStore.state.viewMode === 'desktop'
  document.documentElement.setAttribute('data-physical-mobile', isPhoneDevice ? '1' : '0')
  viewportMeta.setAttribute(
    'content',
    forcedDesktopOnMobile
      ? `width=${MOBILE_DESKTOP_VIEWPORT}, initial-scale=1.0, minimum-scale=1.0`
      : 'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes, viewport-fit=cover'
  )
}

const syncLayoutAfterViewportChange = () => {
  requestAnimationFrame(() => {
    updateHeaderLayout()
    setTimeout(() => {
      updateHeaderLayout()
    }, 80)
  })
}

const handleResize = () => {
  applyViewportMode()
  updateHeaderLayout()
}

const userGreetingTitle = computed(() => (appStore.state.language === 'ru' ? 'Профиль' : 'Profile'))
const viewModeToggleTitle = computed(() => {
  if (appStore.state.language === 'ru') return isMobileLayout.value ? 'Переключить на ПК версию' : 'Переключить на мобильную версию'
  return isMobileLayout.value ? 'Switch to desktop view' : 'Switch to mobile view'
})

const toggleViewMode = () => {
  appStore.setViewMode(isMobileLayout.value ? 'desktop' : 'mobile')
  syncLayoutAfterViewportChange()
  updateHeaderLayout()
}

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
  window.removeEventListener('resize', handleResize)
  appStore.dispose()
})

onMounted(() => {
  applyViewportMode()
  updateHeaderLayout()
  window.addEventListener('resize', handleResize, { passive: true })
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

watch(
  () => appStore.state.viewMode,
  () => {
    applyViewportMode()
    updateHeaderLayout()
    syncLayoutAfterViewportChange()
  }
)
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

        <div class="header-meta">
          <div class="header-social" aria-label="Social links">
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
          <div class="header-contact">
            <a href="mailto:contact@vsemoto.club">contact@vsemoto.club</a>
            <a href="tel:+79001234567">+7 (900) 123-45-67</a>
          </div>
        </div>

        <div class="header-controls">
          <button type="button" class="view-mode-btn view-mode-icon-btn" :title="viewModeToggleTitle" @click="toggleViewMode">
            <svg v-if="isMobileLayout" class="view-mode-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path
                d="M3.5 4.5A1.5 1.5 0 0 1 5 3h14a1.5 1.5 0 0 1 1.5 1.5v10A1.5 1.5 0 0 1 19 16H5a1.5 1.5 0 0 1-1.5-1.5v-10ZM5 5v9h14V5H5Zm4 13h6a1 1 0 1 1 0 2H9a1 1 0 1 1 0-2Z"
              />
            </svg>
            <svg v-else class="view-mode-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path
                d="M8 2a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8Zm0 2h8v14H8V4Zm4 17a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5Z"
              />
            </svg>
          </button>
          <button type="button" class="user-greet user-greet-icon" :title="userGreetingTitle" @click="openProfile">
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path
                d="M12 12.5a5.25 5.25 0 1 0-5.25-5.25A5.26 5.26 0 0 0 12 12.5Zm0 2.5c-4.4 0-8 2.3-8 5.1 0 .5.4.9.9.9h14.2a.9.9 0 0 0 .9-.9C20 17.3 16.4 15 12 15Z"
              />
            </svg>
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

