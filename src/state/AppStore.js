import { reactive } from 'vue'

const STORAGE_KEY = 'vse_app_state_v1'

const MESSAGES = {
  ru: {
    common: { appTitle: 'VSE Moto Club' },
    header: {
      greeting: 'Здравствуйте',
      themeDark: 'Тёмная',
      themeLight: 'Светлая',
      langRu: 'RU',
      langEn: 'EN'
    },
    toast: {
      morning: 'Доброе утро',
      day: 'Добрый день',
      evening: 'Добрый вечер',
      night: 'Доброй ночи'
    },
    auth: {
      title: 'Платформа для мототуризма',
      lead1: 'VSE объединяет райдеров для маршрутов, событий и безопасного планирования поездок.',
      lead2: 'Создайте профиль, вступайте в клуб и следите за ближайшими выездами.',
      b1: 'Анонсы поездок и событий',
      b2: 'Карточки маршрутов с уровнем сложности',
      b3: 'Новости сообщества и планирование',
      registerTitle: 'Регистрация',
      loginTitle: 'Вход в аккаунт',
      forgotTitle: 'Восстановление пароля',
      registerNote: 'Создайте аккаунт и присоединяйтесь к VSE.',
      loginNote: 'Введите учетные данные для входа.',
      forgotNote: 'Введите email для получения инструкций.',
      name: 'Имя',
      email: 'Email',
      password: 'Пароль',
      namePh: 'Ваше имя',
      passwordPh: 'A-z и 0-9',
      createAccount: 'Создать аккаунт',
      signIn: 'Войти',
      sendInstructions: 'Отправить инструкции',
      hasAccount: 'Уже есть аккаунт?',
      forgot: 'Забыли пароль?',
      or: 'или',
      noAccount: 'Нет аккаунта? Регистрация',
      backToLogin: 'Назад ко входу',
      createNew: 'Создать новый аккаунт',
      resetSent: 'Инструкции отправлены на вашу почту.',
      errEmailRequired: 'Введите email.',
      errEmailInvalid: 'Некорректный формат email.',
      errPasswordRequired: 'Введите пароль.',
      errPasswordInvalid: 'Пароль: только A-z и 0-9.',
      errPasswordLen: 'Длина пароля: минимум 8 символов.',
      fallbackNew: 'Новый участник',
      fallbackMember: 'Участник клуба'
    },
    home: {
      title: 'О мотоклубе и путешествиях',
      subtitle: 'Здесь вы найдете события, маршруты и планы ближайших поездок.',
      clubTitle: 'О клубе',
      clubDesc: 'Сообщество, участники и ключевые принципы.',
      eventsTitle: 'Ближайшие события',
      eventsDesc: 'Встречи, выезды выходного дня и подготовка маршрутов.',
      routesTitle: 'Маршруты',
      routesDesc: 'Подборки направлений с уровнем сложности и точками пути.'
    },
    profile: {
      title: 'Профиль пользователя',
      photo: 'Фото',
      upload: 'Загрузить новое фото',
      remove: 'Удалить фото',
      firstName: 'Имя',
      lastName: 'Фамилия',
      middleName: 'Отчество',
      birthDate: 'Дата рождения',
      nickname: 'Прозвище',
      nicknamePh: 'Например: RoadFox',
      role: 'Роль',
      roleValue: 'Участник мотоклуба',
      accountId: 'ID аккаунта',
      accountIdEmpty: 'Еще не присвоен',
      save: 'Сохранить изменения',
      saved: 'Профиль обновлен.',
      backHome: 'Вернуться на главную',
      signOut: 'Выйти из аккаунта',
      avatarTooLarge: 'Максимальный размер изображения: 512x512 пикселей.',
      avatarReadError: 'Не удалось прочитать изображение.'
    },
    club: {
      tag: 'VSE Moto Club',
      title: 'О клубе',
      body: 'VSE - это мотосообщество, в котором ценят безопасные поездки, взаимовыручку и новые открытия на маршрутах.'
    },
    events: {
      tag: 'Календарь клуба',
      title: 'Ближайшие события',
      body: 'Ближайшие выезды клуба, weekend-туры и встречи по планированию маршрутов.'
    },
    routes: {
      tag: 'Маршруты VSE',
      title: 'Маршруты',
      body: 'Подборки маршрутов с дистанцией, сложностью и ключевыми точками пути.'
    }
  },
  en: {
    common: { appTitle: 'VSE Moto Club' },
    header: {
      greeting: 'Hello',
      themeDark: 'Dark',
      themeLight: 'Light',
      langRu: 'RU',
      langEn: 'EN'
    },
    toast: {
      morning: 'Good morning',
      day: 'Good afternoon',
      evening: 'Good evening',
      night: 'Good night'
    },
    auth: {
      title: 'Platform for moto tourism',
      lead1: 'VSE brings riders together for routes, events, and safe travel planning.',
      lead2: 'Build your profile, join the club, and follow upcoming rides.',
      b1: 'Ride announcements and events',
      b2: 'Route cards with difficulty level',
      b3: 'Community updates and planning',
      registerTitle: 'Registration',
      loginTitle: 'Sign in',
      forgotTitle: 'Password reset',
      registerNote: 'Create account and join VSE.',
      loginNote: 'Enter your credentials.',
      forgotNote: 'Enter email for reset instructions.',
      name: 'Name',
      email: 'Email',
      password: 'Password',
      namePh: 'Your name',
      passwordPh: 'A-z and 0-9',
      createAccount: 'Create account',
      signIn: 'Sign in',
      sendInstructions: 'Send instructions',
      hasAccount: 'Already have account?',
      forgot: 'Forgot password?',
      or: 'or',
      noAccount: 'No account? Register',
      backToLogin: 'Back to sign in',
      createNew: 'Create new account',
      resetSent: 'Instructions were sent to your email.',
      errEmailRequired: 'Enter email.',
      errEmailInvalid: 'Invalid email format.',
      errPasswordRequired: 'Enter password.',
      errPasswordInvalid: 'Password: only A-z and 0-9.',
      errPasswordLen: 'Password must be at least 8 chars.',
      fallbackNew: 'New member',
      fallbackMember: 'Club member'
    },
    home: {
      title: 'About moto club and travel',
      subtitle: 'Find events, routes, and plans for upcoming rides.',
      clubTitle: 'About club',
      clubDesc: 'Community, members, and core principles.',
      eventsTitle: 'Upcoming events',
      eventsDesc: 'Meetups, weekend rides, and prep sessions.',
      routesTitle: 'Routes',
      routesDesc: 'Route cards with difficulty and checkpoints.'
    },
    profile: {
      title: 'User profile',
      photo: 'Photo',
      upload: 'Upload new photo',
      remove: 'Delete photo',
      firstName: 'First name',
      lastName: 'Last name',
      middleName: 'Middle name',
      birthDate: 'Birth date',
      nickname: 'Nickname',
      nicknamePh: 'Example: RoadFox',
      role: 'Role',
      roleValue: 'Moto club member',
      accountId: 'Account ID',
      accountIdEmpty: 'Not assigned yet',
      save: 'Save changes',
      saved: 'Profile updated.',
      backHome: 'Back to home',
      signOut: 'Sign out',
      avatarTooLarge: 'Max image size is 512x512 pixels.',
      avatarReadError: 'Could not read image file.'
    },
    club: {
      tag: 'VSE Moto Club',
      title: 'About club',
      body: 'VSE is a riding community focused on safe travel, teamwork, and new route discovery.'
    },
    events: {
      tag: 'Club calendar',
      title: 'Upcoming events',
      body: 'Upcoming club rides, weekend trips, and route planning meetings.'
    },
    routes: {
      tag: 'VSE routes',
      title: 'Routes',
      body: 'Curated routes with distance, complexity, and checkpoints.'
    }
  }
}

class AppStore {
  constructor() {
    this.state = reactive({
      isAuthenticated: false,
      currentUserName: 'Гость',
      firstName: '',
      lastName: '',
      middleName: '',
      birthDate: '',
      nickname: '',
      avatarUrl: '',
      welcomeVisible: false,
      welcomeMessage: '',
      accountId: '',
      theme: 'light',
      language: 'ru'
    })

    this._welcomeTimer = null
    this._avatarObjectUrl = null
    this._loadPersistedState()
    this.applyTheme()
  }

  get roleName() {
    return this.t('profile.roleValue')
  }

  t(path) {
    const source = MESSAGES[this.state.language] || MESSAGES.ru
    return path.split('.').reduce((acc, key) => (acc ? acc[key] : undefined), source) || path
  }

  setLanguage(language) {
    this.state.language = language === 'en' ? 'en' : 'ru'
    this._persistState()
    this.showWelcomeToast()
  }

  toggleLanguage() {
    this.setLanguage(this.state.language === 'ru' ? 'en' : 'ru')
  }

  setTheme(theme) {
    this.state.theme = theme === 'light' ? 'light' : 'dark'
    this.applyTheme()
    this._persistState()
  }

  toggleTheme() {
    this.setTheme(this.state.theme === 'dark' ? 'light' : 'dark')
  }

  applyTheme() {
    if (typeof document === 'undefined') return
    document.documentElement.setAttribute('data-theme', this.state.theme)
  }

  _displayName() {
    return this.state.nickname.trim() || this.state.firstName.trim() || this.t('auth.fallbackMember')
  }

  _timeGreeting() {
    const hour = new Date().getHours()
    if (hour >= 5 && hour < 12) return this.t('toast.morning')
    if (hour >= 12 && hour < 18) return this.t('toast.day')
    if (hour >= 18 && hour < 23) return this.t('toast.evening')
    return this.t('toast.night')
  }

  showWelcomeToast() {
    if (!this.state.isAuthenticated) return
    if (this._welcomeTimer) clearTimeout(this._welcomeTimer)
    this.state.welcomeMessage = `${this._timeGreeting()}, ${this.state.currentUserName}`
    this.state.welcomeVisible = true

    this._welcomeTimer = setTimeout(() => {
      this.state.welcomeVisible = false
    }, 3200)
  }

  login({ fallbackName, firstName = '', isRegistration = false }) {
    const resolvedName = firstName.trim() || fallbackName
    this.state.firstName = resolvedName
    this.state.currentUserName = this._displayName() || resolvedName

    if (isRegistration && !this.state.accountId) {
      this.state.accountId = this._generateAccountId()
    }

    this.state.isAuthenticated = true
    this._persistState()
    this.showWelcomeToast()
  }

  logout() {
    this.state.isAuthenticated = false
    this.state.welcomeVisible = false
    this._persistState()
  }

  saveProfile({ firstName, lastName, middleName, birthDate, nickname }) {
    this.state.firstName = firstName.trim()
    this.state.lastName = lastName.trim()
    this.state.middleName = middleName.trim()
    this.state.birthDate = birthDate
    this.state.nickname = nickname.trim()
    this.state.currentUserName = this._displayName()
    this._persistState()
  }

  setAvatar(file) {
    return new Promise((resolve, reject) => {
      const candidateUrl = URL.createObjectURL(file)
      const img = new Image()

      img.onload = () => {
        if (img.width > 512 || img.height > 512) {
          URL.revokeObjectURL(candidateUrl)
          reject(new Error(this.t('profile.avatarTooLarge')))
          return
        }

        if (this._avatarObjectUrl) URL.revokeObjectURL(this._avatarObjectUrl)
        this._avatarObjectUrl = candidateUrl
        this.state.avatarUrl = candidateUrl
        resolve()
      }

      img.onerror = () => {
        URL.revokeObjectURL(candidateUrl)
        reject(new Error(this.t('profile.avatarReadError')))
      }

      img.src = candidateUrl
    })
  }

  removeAvatar() {
    if (this._avatarObjectUrl) {
      URL.revokeObjectURL(this._avatarObjectUrl)
      this._avatarObjectUrl = null
    }
    this.state.avatarUrl = ''
  }

  _generateAccountId() {
    const ts = Date.now().toString(36).toUpperCase()
    const rnd = Math.random().toString(36).slice(2, 8).toUpperCase()
    return `VSE-${ts}-${rnd}`
  }

  _storageAvailable() {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
  }

  _persistState() {
    if (!this._storageAvailable()) return

    const payload = {
      isAuthenticated: this.state.isAuthenticated,
      currentUserName: this.state.currentUserName,
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      middleName: this.state.middleName,
      birthDate: this.state.birthDate,
      nickname: this.state.nickname,
      accountId: this.state.accountId,
      theme: this.state.theme,
      language: this.state.language
    }

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
    } catch {
      // Ignore quota or private mode issues.
    }
  }

  _loadPersistedState() {
    if (!this._storageAvailable()) return

    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (!raw) return
      const saved = JSON.parse(raw)

      this.state.isAuthenticated = Boolean(saved.isAuthenticated)
      this.state.currentUserName = saved.currentUserName || this.state.currentUserName
      this.state.firstName = saved.firstName || ''
      this.state.lastName = saved.lastName || ''
      this.state.middleName = saved.middleName || ''
      this.state.birthDate = saved.birthDate || ''
      this.state.nickname = saved.nickname || ''
      this.state.accountId = saved.accountId || ''
      this.state.theme = saved.theme === 'dark' ? 'dark' : 'light'
      this.state.language = saved.language === 'en' ? 'en' : 'ru'
    } catch {
      // Ignore invalid persisted payload.
    }
  }

  dispose() {
    if (this._welcomeTimer) clearTimeout(this._welcomeTimer)
    if (this._avatarObjectUrl) URL.revokeObjectURL(this._avatarObjectUrl)
  }
}

export const appStore = new AppStore()
