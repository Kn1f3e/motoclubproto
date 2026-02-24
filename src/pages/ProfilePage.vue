<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { appStore } from '../state/AppStore'

const router = useRouter()

const firstName = ref(appStore.state.firstName)
const lastName = ref(appStore.state.lastName)
const middleName = ref(appStore.state.middleName)
const birthDate = ref(appStore.state.birthDate)
const nickname = ref(appStore.state.nickname)
const avatarMenuOpen = ref(false)
const profileSaved = ref(false)
const avatarError = ref('')
const pageVisible = ref(false)
const activeTab = ref('profile')
const mobileSidebarOpen = ref(false)
const notificationsRide = ref(true)
const notificationsEvents = ref(true)
const notificationsNews = ref(false)
let profileSavedTimer = null

const isRu = computed(() => appStore.state.language === 'ru')

const safeUi = computed(() => {
  if (!isRu.value) {
    return {
      menu: 'Menu',
      account: 'Account',
      tabs: {
        profile: 'Profile',
        settings: 'Settings',
        notifications: 'Notifications'
      },
      panelTitle: {
        settings: 'Account settings',
        notifications: 'Notifications'
      },
      settings: {
        themeTitle: 'Theme',
        themeDesc: 'Choose the interface color palette.',
        dark: 'Dark',
        light: 'Light',
        languageTitle: 'Language',
        languageDesc: 'Switch app language.'
      },
      notifications: {
        title: 'Notification preferences',
        desc: 'Choose which notifications you want to see in your account.',
        rides: 'New rides and routes',
        events: 'Club events',
        news: 'News and announcements'
      }
    }
  }

  return {
    menu: '\u041c\u0435\u043d\u044e',
    account: '\u041b\u0438\u0447\u043d\u044b\u0439 \u043a\u0430\u0431\u0438\u043d\u0435\u0442',
    tabs: {
      profile: '\u041f\u0440\u043e\u0444\u0438\u043b\u044c',
      settings: '\u041d\u0430\u0441\u0442\u0440\u043e\u0439\u043a\u0438',
      notifications: '\u0423\u0432\u0435\u0434\u043e\u043c\u043b\u0435\u043d\u0438\u044f'
    },
    panelTitle: {
      settings: '\u041d\u0430\u0441\u0442\u0440\u043e\u0439\u043a\u0438 \u0430\u043a\u043a\u0430\u0443\u043d\u0442\u0430',
      notifications: '\u0423\u0432\u0435\u0434\u043e\u043c\u043b\u0435\u043d\u0438\u044f'
    },
    settings: {
      themeTitle: '\u0422\u0435\u043c\u0430 \u043e\u0444\u043e\u0440\u043c\u043b\u0435\u043d\u0438\u044f',
      themeDesc: '\u0412\u044b\u0431\u0435\u0440\u0438\u0442\u0435 \u0446\u0432\u0435\u0442\u043e\u0432\u0443\u044e \u043f\u0430\u043b\u0438\u0442\u0440\u0443 \u0438\u043d\u0442\u0435\u0440\u0444\u0435\u0439\u0441\u0430.',
      dark: '\u0422\u0451\u043c\u043d\u0430\u044f',
      light: '\u0421\u0432\u0435\u0442\u043b\u0430\u044f',
      languageTitle: '\u042f\u0437\u044b\u043a \u0438\u043d\u0442\u0435\u0440\u0444\u0435\u0439\u0441\u0430',
      languageDesc: '\u041f\u0435\u0440\u0435\u043a\u043b\u044e\u0447\u0435\u043d\u0438\u0435 \u044f\u0437\u044b\u043a\u0430 \u043f\u0440\u0438\u043b\u043e\u0436\u0435\u043d\u0438\u044f.'
    },
    notifications: {
      title: '\u041f\u0440\u0435\u0434\u043f\u043e\u0447\u0442\u0435\u043d\u0438\u044f \u0443\u0432\u0435\u0434\u043e\u043c\u043b\u0435\u043d\u0438\u0439',
      desc: '\u0412\u044b\u0431\u0435\u0440\u0438\u0442\u0435, \u043a\u0430\u043a\u0438\u0435 \u0443\u0432\u0435\u0434\u043e\u043c\u043b\u0435\u043d\u0438\u044f \u0432\u044b \u0445\u043e\u0442\u0438\u0442\u0435 \u0432\u0438\u0434\u0435\u0442\u044c \u0432 \u043b\u0438\u0447\u043d\u043e\u043c \u043a\u0430\u0431\u0438\u043d\u0435\u0442\u0435.',
      rides: '\u041d\u043e\u0432\u044b\u0435 \u0432\u044b\u0435\u0437\u0434\u044b \u0438 \u043c\u0430\u0440\u0448\u0440\u0443\u0442\u044b',
      events: '\u041a\u043b\u0443\u0431\u043d\u044b\u0435 \u0441\u043e\u0431\u044b\u0442\u0438\u044f',
      news: '\u041d\u043e\u0432\u043e\u0441\u0442\u0438 \u0438 \u043e\u0431\u044a\u044f\u0432\u043b\u0435\u043d\u0438\u044f'
    }
  }
})

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

const toggleMobileSidebar = () => {
  mobileSidebarOpen.value = !mobileSidebarOpen.value
}

const closeMobileSidebar = () => {
  mobileSidebarOpen.value = false
}

const selectTab = (tabId) => {
  activeTab.value = tabId
  closeMobileSidebar()
}

const toggleAvatarMenu = () => {
  avatarMenuOpen.value = !avatarMenuOpen.value
}

const handleAvatarUpload = async (event) => {
  const [file] = event.target.files || []
  if (!file) return

  try {
    await appStore.setAvatar(file)
    avatarError.value = ''
    avatarMenuOpen.value = false
  } catch (error) {
    avatarError.value = error.message
  } finally {
    event.target.value = ''
  }
}

const removeAvatar = () => {
  appStore.removeAvatar()
  avatarError.value = ''
  avatarMenuOpen.value = false
}

const saveProfile = () => {
  appStore.saveProfile({
    firstName: firstName.value,
    lastName: lastName.value,
    middleName: middleName.value,
    birthDate: birthDate.value,
    nickname: nickname.value
  })

  if (profileSavedTimer) clearTimeout(profileSavedTimer)
  profileSaved.value = true
  profileSavedTimer = setTimeout(() => {
    profileSaved.value = false
  }, 2400)
}

const backToHome = () => {
  closeMobileSidebar()
  router.push('/home')
}

const handleLogout = () => {
  closeMobileSidebar()
  appStore.logout()
  router.push('/auth')
}

watch(mobileSidebarOpen, (open) => {
  if (typeof document === 'undefined') return
  document.body.style.overflow = open ? 'hidden' : ''
})

const tabItemsSafe = computed(() => [
  { id: 'profile', label: safeUi.value.tabs.profile },
  { id: 'settings', label: safeUi.value.tabs.settings },
  { id: 'notifications', label: safeUi.value.tabs.notifications }
])

const panelTitleSafe = computed(() => {
  if (activeTab.value === 'settings') return safeUi.value.panelTitle.settings
  if (activeTab.value === 'notifications') return safeUi.value.panelTitle.notifications
  return appStore.t('profile.title')
})

onMounted(triggerPageIntro)

onBeforeUnmount(() => {
  if (profileSavedTimer) clearTimeout(profileSavedTimer)
  if (typeof document !== 'undefined') document.body.style.overflow = ''
})
</script>

<template>
  <Transition name="welcome-toast">
    <div v-if="profileSaved" class="welcome-toast welcome-toast-success">{{ appStore.t('profile.saved') }}</div>
  </Transition>

  <main :class="['profile', 'page-appear', 'page-delay-1', { 'page-visible': pageVisible }]">
    <section :class="['profile-card', 'page-appear', 'page-delay-2', { 'page-visible': pageVisible }]">
      <div class="profile-shell-layout">
        <button
          type="button"
          class="profile-sidebar-overlay"
          :class="{ active: mobileSidebarOpen }"
          @click="closeMobileSidebar"
          aria-label="Close profile menu"
        ></button>

        <aside class="profile-sidebar" :class="{ 'mobile-open': mobileSidebarOpen }">
          <div class="profile-sidebar-head">
            <div class="profile-sidebar-title">{{ safeUi.account }}</div>
            <button type="button" class="profile-sidebar-close" @click="closeMobileSidebar" aria-label="Close menu">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>

          <nav class="profile-sidebar-nav" aria-label="Profile sections">
            <button
              v-for="item in tabItemsSafe"
              :key="item.id"
              type="button"
              class="profile-side-tab"
              :class="{ active: activeTab === item.id }"
              @click="selectTab(item.id)"
            >
              {{ item.label }}
            </button>
          </nav>

          <div class="profile-sidebar-divider"></div>

          <button type="button" class="profile-side-logout" @click="handleLogout">
            {{ appStore.t('profile.signOut') }}
          </button>

          <button type="button" class="profile-side-tab profile-side-home" @click="backToHome">
            {{ appStore.t('profile.backHome') }}
          </button>
        </aside>

        <section class="profile-main-panel">
          <div class="profile-panel-header">
            <button type="button" class="profile-mobile-menu-btn" @click="toggleMobileSidebar">
              <span aria-hidden="true">&#9776;</span>
              <span>{{ safeUi.menu }}</span>
            </button>
            <h2 class="profile-title">{{ panelTitleSafe }}</h2>
          </div>

          <Transition name="panel-swap" mode="out-in">
            <div v-if="activeTab === 'profile'" key="profile-tab">
              <form class="profile-form" @submit.prevent="saveProfile">
                <div class="profile-layout">
                  <div class="avatar-column">
                    <button type="button" class="avatar-frame avatar-trigger" @click="toggleAvatarMenu">
                      <img v-if="appStore.state.avatarUrl" :src="appStore.state.avatarUrl" :alt="appStore.t('profile.photo')" />
                      <span v-else>{{ appStore.t('profile.photo') }}</span>
                    </button>

                    <TransitionGroup name="avatar-action" tag="div" class="avatar-actions">
                      <label v-if="avatarMenuOpen" key="upload" class="upload-btn">
                        {{ appStore.t('profile.upload') }}
                        <input type="file" accept="image/*" @change="handleAvatarUpload" />
                      </label>
                      <button
                        v-if="avatarMenuOpen && appStore.state.avatarUrl"
                        key="remove"
                        type="button"
                        class="upload-btn danger-btn"
                        @click="removeAvatar"
                      >
                        {{ appStore.t('profile.remove') }}
                      </button>
                    </TransitionGroup>

                    <p v-if="avatarError" class="error-text avatar-error">{{ avatarError }}</p>
                  </div>

                  <div class="identity-column">
                    <div class="name-grid">
                      <label class="field">
                        <span>{{ appStore.t('profile.firstName') }}</span>
                        <input v-model="firstName" type="text" :placeholder="appStore.t('profile.firstName')" />
                      </label>

                      <label class="field">
                        <span>{{ appStore.t('profile.lastName') }}</span>
                        <input v-model="lastName" type="text" :placeholder="appStore.t('profile.lastName')" />
                      </label>

                      <label class="field">
                        <span>{{ appStore.t('profile.middleName') }}</span>
                        <input v-model="middleName" type="text" :placeholder="appStore.t('profile.middleName')" />
                      </label>
                    </div>

                    <label class="field">
                      <span>{{ appStore.t('profile.birthDate') }}</span>
                      <input v-model="birthDate" type="date" />
                    </label>

                    <label class="field">
                      <span>{{ appStore.t('profile.nickname') }}</span>
                      <input v-model="nickname" type="text" :placeholder="appStore.t('profile.nicknamePh')" />
                    </label>

                    <label class="field">
                      <span>{{ appStore.t('profile.role') }}</span>
                      <input type="text" :value="appStore.roleName" disabled />
                    </label>

                    <label class="field">
                      <span>{{ appStore.t('profile.accountId') }}</span>
                      <input type="text" :value="appStore.state.accountId || appStore.t('profile.accountIdEmpty')" disabled />
                    </label>

                    <button class="btn-secondary" type="submit">{{ appStore.t('profile.save') }}</button>
                  </div>
                </div>
              </form>
            </div>

            <div v-else-if="activeTab === 'settings'" key="settings-tab" class="profile-tab-content">
              <div class="profile-settings-grid">
                <div class="profile-settings-card">
                  <h3>{{ safeUi.settings.themeTitle }}</h3>
                  <p>{{ safeUi.settings.themeDesc }}</p>
                  <div class="profile-inline-actions">
                    <button
                      type="button"
                      class="profile-nav-btn"
                      :class="{ active: appStore.state.theme === 'dark' }"
                      @click="appStore.setTheme('dark')"
                    >
                      {{ safeUi.settings.dark }}
                    </button>
                    <button
                      type="button"
                      class="profile-nav-btn"
                      :class="{ active: appStore.state.theme === 'light' }"
                      @click="appStore.setTheme('light')"
                    >
                      {{ safeUi.settings.light }}
                    </button>
                  </div>
                </div>

                <div class="profile-settings-card">
                  <h3>{{ safeUi.settings.languageTitle }}</h3>
                  <p>{{ safeUi.settings.languageDesc }}</p>
                  <select class="profile-settings-select" :value="appStore.state.language" @change="appStore.setLanguage($event.target.value)">
                    <option value="ru">RU</option>
                    <option value="en">EN</option>
                  </select>
                </div>
              </div>
            </div>

            <div v-else key="notifications-tab" class="profile-tab-content">
              <div class="profile-settings-card">
                <h3>{{ safeUi.notifications.title }}</h3>
                <p>{{ safeUi.notifications.desc }}</p>

                <label class="profile-check-row">
                  <input v-model="notificationsRide" type="checkbox" />
                  <span>{{ safeUi.notifications.rides }}</span>
                </label>

                <label class="profile-check-row">
                  <input v-model="notificationsEvents" type="checkbox" />
                  <span>{{ safeUi.notifications.events }}</span>
                </label>

                <label class="profile-check-row">
                  <input v-model="notificationsNews" type="checkbox" />
                  <span>{{ safeUi.notifications.news }}</span>
                </label>
              </div>
            </div>
          </Transition>
        </section>
      </div>
    </section>
  </main>
</template>

