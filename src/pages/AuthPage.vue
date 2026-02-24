<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { appStore } from '../state/AppStore'

const router = useRouter()

const panelMode = ref('register')
const authVisible = ref(false)

const name = ref('')
const email = ref('')
const password = ref('')
const registerSubmitted = ref(false)

const loginEmail = ref('')
const loginPassword = ref('')
const loginSubmitted = ref(false)

const resetEmail = ref('')
const resetSubmitted = ref(false)
const resetSuccess = ref(false)

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const passwordRegex = /^[A-Za-z0-9]+$/

const registerEmailError = computed(() => {
  if (!registerSubmitted.value) return ''
  if (!email.value.trim()) return appStore.t('auth.errEmailRequired')
  if (!emailRegex.test(email.value)) return appStore.t('auth.errEmailInvalid')
  return ''
})

const registerPasswordError = computed(() => {
  if (!registerSubmitted.value) return ''
  if (!password.value) return appStore.t('auth.errPasswordRequired')
  if (!passwordRegex.test(password.value)) return appStore.t('auth.errPasswordInvalid')
  if (password.value.length < 8) return appStore.t('auth.errPasswordLen')
  return ''
})

const loginEmailError = computed(() => {
  if (!loginSubmitted.value) return ''
  if (!loginEmail.value.trim()) return appStore.t('auth.errEmailRequired')
  if (!emailRegex.test(loginEmail.value)) return appStore.t('auth.errEmailInvalid')
  return ''
})

const loginPasswordError = computed(() => {
  if (!loginSubmitted.value) return ''
  if (!loginPassword.value) return appStore.t('auth.errPasswordRequired')
  if (!passwordRegex.test(loginPassword.value)) return appStore.t('auth.errPasswordInvalid')
  return ''
})

const resetEmailError = computed(() => {
  if (!resetSubmitted.value) return ''
  if (!resetEmail.value.trim()) return appStore.t('auth.errEmailRequired')
  if (!emailRegex.test(resetEmail.value)) return appStore.t('auth.errEmailInvalid')
  return ''
})

const switchMode = (mode) => {
  panelMode.value = mode
  resetSuccess.value = false
}

const handleRegister = () => {
  registerSubmitted.value = true
  const isValid = !registerEmailError.value && !registerPasswordError.value
  if (!isValid) return

  appStore.login({ fallbackName: appStore.t('auth.fallbackNew'), firstName: name.value, isRegistration: true })
  router.push('/home')
}

const handleLogin = () => {
  loginSubmitted.value = true
  const isValid = !loginEmailError.value && !loginPasswordError.value
  if (!isValid) return

  appStore.login({ fallbackName: appStore.t('auth.fallbackMember'), firstName: '' })
  router.push('/home')
}

const handleReset = () => {
  resetSubmitted.value = true
  resetSuccess.value = !resetEmailError.value
}

const triggerAuthIntro = () => {
  authVisible.value = false
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      setTimeout(() => {
        authVisible.value = true
      }, 40)
    })
  })
}

onMounted(triggerAuthIntro)
</script>

<template>
  <main class="split">
    <section :class="['about', 'auth-appear', 'auth-info', { 'auth-visible': authVisible }]">
      <h1>{{ appStore.t('auth.title') }}</h1>
      <p class="lead">
        {{ appStore.t('auth.lead1') }}
        {{ appStore.t('auth.lead2') }}
      </p>

      <ul class="benefits">
        <li>{{ appStore.t('auth.b1') }}</li>
        <li>{{ appStore.t('auth.b2') }}</li>
        <li>{{ appStore.t('auth.b3') }}</li>
      </ul>
    </section>

    <section :class="['panel', 'auth-appear', 'auth-register', { 'auth-visible': authVisible }]">
      <Transition name="panel-swap" mode="out-in">
        <div :key="panelMode">
          <h2 v-if="panelMode === 'register'">{{ appStore.t('auth.registerTitle') }}</h2>
          <h2 v-else-if="panelMode === 'login'">{{ appStore.t('auth.loginTitle') }}</h2>
          <h2 v-else>{{ appStore.t('auth.forgotTitle') }}</h2>

          <p v-if="panelMode === 'register'" class="panel-note">{{ appStore.t('auth.registerNote') }}</p>
          <p v-else-if="panelMode === 'login'" class="panel-note">{{ appStore.t('auth.loginNote') }}</p>
          <p v-else class="panel-note">{{ appStore.t('auth.forgotNote') }}</p>

          <form v-if="panelMode === 'register'" class="form" @submit.prevent="handleRegister">
            <label class="field">
              <span>{{ appStore.t('auth.name') }}</span>
              <input v-model.trim="name" type="text" :placeholder="appStore.t('auth.namePh')" />
            </label>

            <label class="field">
              <span>{{ appStore.t('auth.email') }}</span>
              <input v-model.trim="email" :class="{ 'input-error': registerEmailError }" type="email" placeholder="name@example.com" />
              <small v-if="registerEmailError" class="error-text">{{ registerEmailError }}</small>
            </label>

            <label class="field">
              <span>{{ appStore.t('auth.password') }}</span>
              <input v-model="password" :class="{ 'input-error': registerPasswordError }" type="password" :placeholder="appStore.t('auth.passwordPh')" />
              <small v-if="registerPasswordError" class="error-text">{{ registerPasswordError }}</small>
            </label>

            <button type="submit" class="btn-primary">{{ appStore.t('auth.createAccount') }}</button>

            <div class="auth-links auth-links-inline">
              <button type="button" class="link-btn" @click="switchMode('login')">{{ appStore.t('auth.hasAccount') }}</button>
              <span class="auth-links-sep">{{ appStore.t('auth.or') }}</span>
              <button type="button" class="link-btn" @click="switchMode('forgot')">{{ appStore.t('auth.forgot') }}</button>
            </div>
          </form>

          <form v-else-if="panelMode === 'login'" class="form" @submit.prevent="handleLogin">
            <label class="field">
              <span>{{ appStore.t('auth.email') }}</span>
              <input v-model.trim="loginEmail" :class="{ 'input-error': loginEmailError }" type="email" placeholder="name@example.com" />
              <small v-if="loginEmailError" class="error-text">{{ loginEmailError }}</small>
            </label>

            <label class="field">
              <span>{{ appStore.t('auth.password') }}</span>
              <input v-model="loginPassword" :class="{ 'input-error': loginPasswordError }" type="password" :placeholder="appStore.t('auth.passwordPh')" />
              <small v-if="loginPasswordError" class="error-text">{{ loginPasswordError }}</small>
            </label>

            <button type="submit" class="btn-primary">{{ appStore.t('auth.signIn') }}</button>

            <div class="auth-links auth-links-inline">
              <span class="auth-links-sep">{{ appStore.state.language === 'ru' ? 'Нет аккаунта?' : 'No account?' }}</span>
              <button type="button" class="link-btn" @click="switchMode('register')">
                {{ appStore.state.language === 'ru' ? 'Зарегистрируйтесь!' : 'Register!' }}
              </button>
              <span class="auth-links-sep">{{ appStore.t('auth.or') }}</span>
              <button type="button" class="link-btn" @click="switchMode('forgot')">{{ appStore.t('auth.forgot') }}</button>
            </div>
          </form>

          <form v-else class="form" @submit.prevent="handleReset">
            <label class="field">
              <span>{{ appStore.t('auth.email') }}</span>
              <input v-model.trim="resetEmail" :class="{ 'input-error': resetEmailError }" type="email" placeholder="name@example.com" />
              <small v-if="resetEmailError" class="error-text">{{ resetEmailError }}</small>
            </label>

            <button type="submit" class="btn-primary">{{ appStore.t('auth.sendInstructions') }}</button>
            <p v-if="resetSuccess" class="success-text">{{ appStore.t('auth.resetSent') }}</p>

            <div class="auth-links auth-links-inline">
              <button type="button" class="link-btn" @click="switchMode('login')">
                {{ appStore.state.language === 'ru' ? 'Вернуться?' : 'Return?' }}
              </button>
              <span class="auth-links-sep">{{ appStore.t('auth.or') }}</span>
              <button type="button" class="link-btn" @click="switchMode('register')">{{ appStore.t('auth.createNew') }}</button>
            </div>
          </form>
        </div>
      </Transition>
    </section>
  </main>
</template>
