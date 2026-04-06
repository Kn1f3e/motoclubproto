<script setup>
import { computed, onMounted, ref } from 'vue'
import { appStore } from '../state/AppStore'

const pageVisible = ref(false)
const adminAuthorized = computed({
  get: () => appStore.state.isAdminAuthorized,
  set: (value) => appStore.setAdminAuthorized(value)
})
const adminLogin = ref('')
const adminPassword = ref('')
const authError = ref('')
const activeBlock = ref('patches')

const selectedUserId = ref('')
const selectedPatchId = ref('p1')
const userRoleTargetId = ref('')
const roleDraft = ref(appStore.state.userRole)

const contentMode = ref('hero')
const homeTitleDraft = ref(appStore.getSiteContent('homeTitle', ''))
const homeSubtitleDraft = ref(appStore.getSiteContent('homeSubtitle', ''))
const sectionDrafts = ref([])
const selectedSectionId = ref('')
const sectionTitleDraft = ref('')
const sectionDescDraft = ref('')
const sectionRouteDraft = ref('/home')
const selectedCardsRoute = ref('/events')
const cardDrafts = ref([])
const selectedCardId = ref('__new__')
const cardTitleDraft = ref('')
const cardSubtitleDraft = ref('')
const cardBodyDraft = ref('')
const confirmVisible = ref(false)
const confirmMessage = ref('')
let confirmAction = null

const ADMIN_CREDENTIALS = {
  login: 'admin',
  password: 'admin123'
}

const ui = computed(() => {
  if (appStore.state.language === 'ru') {
    return {
      title: '\u041f\u0430\u043d\u0435\u043b\u044c \u0430\u0434\u043c\u0438\u043d\u0438\u0441\u0442\u0440\u0430\u0442\u043e\u0440\u0430',
      authDesc: '\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u043b\u043e\u0433\u0438\u043d \u0438 \u043f\u0430\u0440\u043e\u043b\u044c \u0430\u0434\u043c\u0438\u043d\u0438\u0441\u0442\u0440\u0430\u0442\u043e\u0440\u0430 \u0434\u043b\u044f \u0434\u043e\u0441\u0442\u0443\u043f\u0430 \u043a \u043f\u0430\u043d\u0435\u043b\u0438.',
      login: '\u041b\u043e\u0433\u0438\u043d',
      password: '\u041f\u0430\u0440\u043e\u043b\u044c',
      loginPlaceholder: '\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u043b\u043e\u0433\u0438\u043d',
      passwordPlaceholder: '\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u043f\u0430\u0440\u043e\u043b\u044c',
      submit: '\u0412\u043e\u0439\u0442\u0438',
      invalid: '\u041d\u0435\u0432\u0435\u0440\u043d\u044b\u0439 \u043b\u043e\u0433\u0438\u043d \u0438\u043b\u0438 \u043f\u0430\u0440\u043e\u043b\u044c.',
      blocks: {
        patches: '\u0412\u044b\u0434\u0430\u0447\u0430 \u043d\u0430\u0448\u0438\u0432\u043e\u043a',
        users: '\u041f\u043e\u043b\u044c\u0437\u043e\u0432\u0430\u0442\u0435\u043b\u0438',
        content: '\u041a\u043e\u043d\u0442\u0435\u043d\u0442 \u0441\u0430\u0439\u0442\u0430'
      },
      accountId: 'ID \u0430\u043a\u043a\u0430\u0443\u043d\u0442\u0430',
      accountIdPlaceholder: '\u0412\u0432\u0435\u0434\u0438\u0442\u0435 ID \u0430\u043a\u043a\u0430\u0443\u043d\u0442\u0430',
      patch: '\u041d\u0430\u0448\u0438\u0432\u043a\u0430',
      grant: '\u0412\u044b\u0434\u0430\u0442\u044c \u043d\u0430\u0448\u0438\u0432\u043a\u0443',
      revoke: '\u0421\u043d\u044f\u0442\u044c \u043d\u0430\u0448\u0438\u0432\u043a\u0443',
      patches: {
        p1: '\u041f\u0435\u0440\u0432\u044b\u0439 \u043c\u0430\u0440\u0448\u0440\u0443\u0442',
        p2: '\u0420\u0430\u0439\u0434\u0435\u0440 \u0432\u044b\u0445\u043e\u0434\u043d\u043e\u0433\u043e \u0434\u043d\u044f',
        p3: '\u0414\u0443\u0445 \u043c\u043e\u0442\u043e\u0442\u0443\u0440\u0438\u0437\u043c\u0430'
      },
      successGranted: '\u041d\u0430\u0448\u0438\u0432\u043a\u0430 \u0432\u044b\u0434\u0430\u043d\u0430.',
      successRevoked: '\u041d\u0430\u0448\u0438\u0432\u043a\u0430 \u0441\u043d\u044f\u0442\u0430.',
      errAccountId: '\u0423\u043a\u0430\u0436\u0438\u0442\u0435 \u043a\u043e\u0440\u0440\u0435\u043a\u0442\u043d\u044b\u0439 ID \u0430\u043a\u043a\u0430\u0443\u043d\u0442\u0430.',
      errCurrentOnly: '\u0412 \u0434\u0435\u043c\u043e-\u0440\u0435\u0436\u0438\u043c\u0435 \u0434\u043e\u0441\u0442\u0443\u043f\u043d\u043e \u0443\u043f\u0440\u0430\u0432\u043b\u0435\u043d\u0438\u0435 \u0442\u043e\u043b\u044c\u043a\u043e \u0442\u0435\u043a\u0443\u0449\u0438\u043c \u0430\u043a\u043a\u0430\u0443\u043d\u0442\u043e\u043c.',
      roleLabel: '\u0420\u043e\u043b\u044c \u043f\u043e\u043b\u044c\u0437\u043e\u0432\u0430\u0442\u0435\u043b\u044f',
      rolePlaceholder: 'ID \u0434\u043b\u044f \u0441\u043c\u0435\u043d\u044b \u0440\u043e\u043b\u0438',
      roleCurrent: '\u0422\u0435\u043a\u0443\u0449\u0430\u044f \u0440\u043e\u043b\u044c',
      roleNew: '\u041d\u043e\u0432\u0430\u044f \u0440\u043e\u043b\u044c',
      roleSave: '\u0421\u043e\u0445\u0440\u0430\u043d\u0438\u0442\u044c \u0440\u043e\u043b\u044c',
      roleSaved: '\u0420\u043e\u043b\u044c \u043e\u0431\u043d\u043e\u0432\u043b\u0435\u043d\u0430.',
      roles: {
        member: '\u0423\u0447\u0430\u0441\u0442\u043d\u0438\u043a',
        moderator: '\u041c\u043e\u0434\u0435\u0440\u0430\u0442\u043e\u0440',
        admin: '\u0410\u0434\u043c\u0438\u043d\u0438\u0441\u0442\u0440\u0430\u0442\u043e\u0440'
      },
      contentArea: '\u0427\u0430\u0441\u0442\u044c \u0441\u0430\u0439\u0442\u0430',
      contentAreaHero: '\u0413\u043b\u0430\u0432\u043d\u044b\u0439 \u0431\u043b\u043e\u043a',
      contentAreaSections: '\u0411\u043b\u043e\u043a\u0438 \u0440\u0430\u0437\u0434\u0435\u043b\u043e\u0432',
      contentTitle: '\u0417\u0430\u0433\u043e\u043b\u043e\u0432\u043e\u043a \u0433\u043b\u0430\u0432\u043d\u043e\u0433\u043e \u0431\u043b\u043e\u043a\u0430',
      contentSubtitle: '\u041f\u043e\u0434\u0437\u0430\u0433\u043e\u043b\u043e\u0432\u043e\u043a \u0433\u043b\u0430\u0432\u043d\u043e\u0433\u043e \u0431\u043b\u043e\u043a\u0430',
      contentSave: '\u0421\u043e\u0445\u0440\u0430\u043d\u0438\u0442\u044c \u043a\u043e\u043d\u0442\u0435\u043d\u0442',
      contentSaved: '\u041a\u043e\u043d\u0442\u0435\u043d\u0442 \u0433\u043b\u0430\u0432\u043d\u043e\u0439 \u0441\u0442\u0440\u0430\u043d\u0438\u0446\u044b \u043e\u0431\u043d\u043e\u0432\u043b\u0435\u043d.',
      contentReset: '\u0412\u0435\u0440\u043d\u0443\u0442\u044c \u043e\u0440\u0438\u0433\u0438\u043d\u0430\u043b',
      contentResetDone: '\u041a\u043e\u043d\u0442\u0435\u043d\u0442 \u0441\u0431\u0440\u043e\u0448\u0435\u043d \u043a \u043e\u0440\u0438\u0433\u0438\u043d\u0430\u043b\u0443.',
      sectionSelect: '\u0411\u043b\u043e\u043a \u0434\u043b\u044f \u0438\u0437\u043c\u0435\u043d\u0435\u043d\u0438\u044f',
      sectionAddNewOption: '\u0414\u043e\u0431\u0430\u0432\u0438\u0442\u044c \u043d\u043e\u0432\u044b\u0439',
      sectionTitle: '\u0417\u0430\u0433\u043e\u043b\u043e\u0432\u043e\u043a \u0431\u043b\u043e\u043a\u0430',
      sectionDesc: '\u041e\u043f\u0438\u0441\u0430\u043d\u0438\u0435 \u0431\u043b\u043e\u043a\u0430',
      sectionRoute: '\u0421\u0441\u044b\u043b\u043a\u0430 \u0431\u043b\u043e\u043a\u0430',
      sectionSave: '\u0421\u043e\u0445\u0440\u0430\u043d\u0438\u0442\u044c \u0431\u043b\u043e\u043a',
      sectionDelete: '\u0423\u0434\u0430\u043b\u0438\u0442\u044c \u0431\u043b\u043e\u043a',
      sectionReset: '\u0421\u0431\u0440\u043e\u0441\u0438\u0442\u044c \u0431\u043b\u043e\u043a\u0438',
      confirmDeleteSection: '\u0423\u0432\u0435\u0440\u0435\u043d\u044b, \u0447\u0442\u043e \u0445\u043e\u0442\u0438\u0442\u0435 \u0443\u0434\u0430\u043b\u0438\u0442\u044c \u044d\u0442\u043e\u0442 \u0431\u043b\u043e\u043a?',
      confirmResetSections: '\u0423\u0432\u0435\u0440\u0435\u043d\u044b, \u0447\u0442\u043e \u0445\u043e\u0442\u0438\u0442\u0435 \u0441\u0431\u0440\u043e\u0441\u0438\u0442\u044c \u0431\u043b\u043e\u043a\u0438? \u0412\u0441\u0451 \u0432\u0435\u0440\u043d\u0435\u0442\u0441\u044f \u043a \u0441\u0442\u043e\u043a\u043e\u0432\u044b\u043c \u0440\u0430\u0437\u0434\u0435\u043b\u0430\u043c \u0438 \u0438\u043d\u0444\u043e\u0440\u043c\u0430\u0446\u0438\u0438.',
      confirmYes: '\u0414\u0430',
      confirmNo: '\u041d\u0435\u0442',
      sectionSaved: '\u0411\u043b\u043e\u043a \u043e\u0431\u043d\u043e\u0432\u043b\u0435\u043d.',
      sectionAdded: '\u0411\u043b\u043e\u043a \u0434\u043e\u0431\u0430\u0432\u043b\u0435\u043d.',
      sectionDeleted: '\u0411\u043b\u043e\u043a \u0443\u0434\u0430\u043b\u0435\u043d.',
      sectionResetDone: '\u0411\u043b\u043e\u043a\u0438 \u0441\u0431\u0440\u043e\u0448\u0435\u043d\u044b \u043a \u0441\u0442\u0430\u043d\u0434\u0430\u0440\u0442\u0443.',
      sectionNeedOne: '\u0421\u043d\u0430\u0447\u0430\u043b\u0430 \u0434\u043e\u0431\u0430\u0432\u044c\u0442\u0435 \u0431\u043b\u043e\u043a.',
      cardsRoute: '\u0420\u0430\u0437\u0434\u0435\u043b \u0434\u043b\u044f \u043a\u0430\u0440\u0442\u043e\u0447\u0435\u043a',
      cardsSelect: '\u041a\u0430\u0440\u0442\u043e\u0447\u043a\u0430 \u0434\u043b\u044f \u0438\u0437\u043c\u0435\u043d\u0435\u043d\u0438\u044f',
      cardsAddNew: '\u0414\u043e\u0431\u0430\u0432\u0438\u0442\u044c \u043d\u043e\u0432\u0443\u044e \u043a\u0430\u0440\u0442\u043e\u0447\u043a\u0443',
      cardHeading: '\u041e\u0433\u043b\u0430\u0432\u043b\u0435\u043d\u0438\u0435',
      cardSubheading: '\u041f\u043e\u0434\u0433\u043b\u0430\u0432\u0430',
      cardBody: '\u0418\u043d\u0444\u043e\u0440\u043c\u0430\u0446\u0438\u044f \u0432\u043d\u0443\u0442\u0440\u0438',
      cardSave: '\u0421\u043e\u0445\u0440\u0430\u043d\u0438\u0442\u044c \u043a\u0430\u0440\u0442\u043e\u0447\u043a\u0443',
      cardDelete: '\u0423\u0434\u0430\u043b\u0438\u0442\u044c \u043a\u0430\u0440\u0442\u043e\u0447\u043a\u0443',
      cardReset: '\u0421\u0431\u0440\u043e\u0441\u0438\u0442\u044c \u043a\u0430\u0440\u0442\u043e\u0447\u043a\u0438 \u0440\u0430\u0437\u0434\u0435\u043b\u0430',
      cardSaved: '\u041a\u0430\u0440\u0442\u043e\u0447\u043a\u0430 \u0441\u043e\u0445\u0440\u0430\u043d\u0435\u043d\u0430.',
      cardAdded: '\u041a\u0430\u0440\u0442\u043e\u0447\u043a\u0430 \u0434\u043e\u0431\u0430\u0432\u043b\u0435\u043d\u0430.',
      cardDeleted: '\u041a\u0430\u0440\u0442\u043e\u0447\u043a\u0430 \u0443\u0434\u0430\u043b\u0435\u043d\u0430.',
      cardResetDone: '\u041a\u0430\u0440\u0442\u043e\u0447\u043a\u0438 \u0440\u0430\u0437\u0434\u0435\u043b\u0430 \u0441\u0431\u0440\u043e\u0448\u0435\u043d\u044b.',
      cardNeedOne: '\u041d\u0435\u0442 \u043a\u0430\u0440\u0442\u043e\u0447\u0435\u043a \u0434\u043b\u044f \u0443\u0434\u0430\u043b\u0435\u043d\u0438\u044f.',
      confirmDeleteCard: '\u0423\u0432\u0435\u0440\u0435\u043d\u044b, \u0447\u0442\u043e \u0445\u043e\u0442\u0438\u0442\u0435 \u0443\u0434\u0430\u043b\u0438\u0442\u044c \u044d\u0442\u0443 \u043a\u0430\u0440\u0442\u043e\u0447\u043a\u0443?',
      confirmResetCards: '\u0423\u0432\u0435\u0440\u0435\u043d\u044b, \u0447\u0442\u043e \u0445\u043e\u0442\u0438\u0442\u0435 \u0441\u0431\u0440\u043e\u0441\u0438\u0442\u044c \u043a\u0430\u0440\u0442\u043e\u0447\u043a\u0438 \u044d\u0442\u043e\u0433\u043e \u0440\u0430\u0437\u0434\u0435\u043b\u0430? \u0412\u0441\u0451 \u0432\u0435\u0440\u043d\u0435\u0442\u0441\u044f \u043a \u0441\u0442\u043e\u043a\u043e\u0432\u044b\u043c \u0434\u0430\u043d\u043d\u044b\u043c.'
    }
  }

  return {
    title: 'Admin panel',
    authDesc: 'Enter administrator credentials to access this panel.',
    login: 'Login',
    password: 'Password',
    loginPlaceholder: 'Enter login',
    passwordPlaceholder: 'Enter password',
    submit: 'Sign in',
    invalid: 'Invalid login or password.',
    blocks: {
      patches: 'Patch awards',
      users: 'Users',
      content: 'Site content'
    },
    accountId: 'Account ID',
    accountIdPlaceholder: 'Enter account ID',
    patch: 'Patch',
    grant: 'Grant patch',
    revoke: 'Revoke patch',
    patches: {
      p1: 'First route',
      p2: 'Weekend rider',
      p3: 'Touring spirit'
    },
    successGranted: 'Patch granted.',
    successRevoked: 'Patch revoked.',
    errAccountId: 'Provide a valid account ID.',
    errCurrentOnly: 'Demo mode: only current account can be managed.',
    roleLabel: 'User role',
    rolePlaceholder: 'ID to update role',
    roleCurrent: 'Current role',
    roleNew: 'New role',
    roleSave: 'Save role',
    roleSaved: 'Role updated.',
    roles: {
      member: 'Member',
      moderator: 'Moderator',
      admin: 'Administrator'
    },
    contentArea: 'Site area',
    contentAreaHero: 'Hero block',
    contentAreaSections: 'Section cards',
    contentTitle: 'Home hero title',
    contentSubtitle: 'Home hero subtitle',
    contentSave: 'Save content',
    contentSaved: 'Home content updated.',
    contentReset: 'Reset to default',
    contentResetDone: 'Content reset to default.',
    sectionSelect: 'Block to edit',
    sectionAddNewOption: 'Add new',
    sectionTitle: 'Block title',
    sectionDesc: 'Block description',
    sectionRoute: 'Block route',
    sectionSave: 'Save block',
    sectionDelete: 'Delete block',
    sectionReset: 'Reset blocks',
    confirmDeleteSection: 'Are you sure you want to delete this block?',
    confirmResetSections: 'Are you sure you want to reset blocks? Everything will return to default sections and information.',
    confirmYes: 'Yes',
    confirmNo: 'No',
    sectionSaved: 'Block updated.',
    sectionAdded: 'Block added.',
    sectionDeleted: 'Block deleted.',
    sectionResetDone: 'Blocks reset to default.',
    sectionNeedOne: 'Add a block first.',
    cardsRoute: 'Section for cards',
    cardsSelect: 'Card to edit',
    cardsAddNew: 'Add new card',
    cardHeading: 'Heading',
    cardSubheading: 'Subheading',
    cardBody: 'Inside information',
    cardSave: 'Save card',
    cardDelete: 'Delete card',
    cardReset: 'Reset section cards',
    cardSaved: 'Card saved.',
    cardAdded: 'Card added.',
    cardDeleted: 'Card deleted.',
    cardResetDone: 'Section cards reset.',
    cardNeedOne: 'No cards to delete.',
    confirmDeleteCard: 'Are you sure you want to delete this card?',
    confirmResetCards: 'Are you sure you want to reset cards for this section? Everything will return to default data.'
  }
})

const adminNoticeClass = computed(() => ({
  'welcome-toast-success': appStore.state.adminNoticeType === 'success',
  'welcome-toast-error': appStore.state.adminNoticeType === 'error'
}))

const blockItems = computed(() => [
  { id: 'patches', title: ui.value.blocks.patches },
  { id: 'users', title: ui.value.blocks.users },
  { id: 'content', title: ui.value.blocks.content }
])

const patchOptions = computed(() => [
  { id: 'p1', label: ui.value.patches.p1 },
  { id: 'p2', label: ui.value.patches.p2 },
  { id: 'p3', label: ui.value.patches.p3 }
])

const roleOptions = computed(() => [
  { id: 'member', label: ui.value.roles.member },
  { id: 'moderator', label: ui.value.roles.moderator },
  { id: 'admin', label: ui.value.roles.admin }
])

const sectionOptions = computed(() =>
  [
    { id: '__new__', label: ui.value.sectionAddNewOption },
    ...sectionDrafts.value.map((item, index) => ({
      id: item.id,
      label: item.title?.trim() || `${ui.value.blocks.content} ${index + 1}`
    }))
  ]
)

const editableSectionOptions = computed(() => sectionDrafts.value.filter((item) => item.to && item.to.trim()))

const cardOptions = computed(() => [
  { id: '__new__', label: ui.value.cardsAddNew },
  ...cardDrafts.value.map((card, index) => ({
    id: card.id,
    label: card.title?.trim() || `${ui.value.cardsSelect} ${index + 1}`
  }))
])

const defaultCardsByRoute = computed(() => {
  if (appStore.state.language === 'ru') {
    return {
      '/events': [
        {
          id: 'events-default-1',
          title: 'Ближайший выезд',
          subtitle: 'Суббота, 09:00',
          body: 'Сбор на основной площадке клуба, маршрут средней сложности.'
        }
      ],
      '/routes': [
        {
          id: 'routes-default-1',
          title: 'Популярный маршрут',
          subtitle: '220 км',
          body: 'Покрытие смешанное, рекомендуемая группа 4-8 мотоциклов.'
        }
      ],
      '/moto-service': [
        {
          id: 'service-default-1',
          title: 'Покупка и доставка',
          subtitle: 'Япония / Китай',
          body: 'Подбор техники с аукционов, проверка, доставка и оформление.'
        }
      ],
      '/club': [
        {
          id: 'club-default-1',
          title: 'О клубе',
          subtitle: 'Основная информация',
          body: 'Участники, принципы сообщества и ближайшие инициативы клуба.'
        }
      ]
    }
  }

  return {
    '/events': [
      {
        id: 'events-default-1',
        title: 'Upcoming ride',
        subtitle: 'Saturday, 09:00',
        body: 'Meet at club point, medium-difficulty route.'
      }
    ],
    '/routes': [
      {
        id: 'routes-default-1',
        title: 'Popular route',
        subtitle: '220 km',
        body: 'Mixed surface, recommended group size 4-8 motorcycles.'
      }
    ],
    '/moto-service': [
      {
        id: 'service-default-1',
        title: 'Purchase and delivery',
        subtitle: 'Japan / China',
        body: 'Auction sourcing, checks, delivery, and documentation.'
      }
    ],
    '/club': [
      {
        id: 'club-default-1',
        title: 'About club',
        subtitle: 'Core information',
        body: 'Members, principles, and upcoming club initiatives.'
      }
    ]
  }
})

const getDefaultSections = () => {
  if (appStore.state.language === 'ru') {
    return [
      {
        id: 'default-club',
        title: appStore.t('home.clubTitle'),
        desc: appStore.t('home.clubDesc'),
        to: '/club'
      },
      {
        id: 'default-events',
        title: appStore.t('home.eventsTitle'),
        desc: appStore.t('home.eventsDesc'),
        to: '/events'
      },
      {
        id: 'default-routes',
        title: appStore.t('home.routesTitle'),
        desc: appStore.t('home.routesDesc'),
        to: '/routes'
      },
      {
        id: 'default-moto-service',
        title: 'МотоМаркет и Сервис',
        desc: 'Доставка и покупка техники с аукционов Японии и Китая, аксессуары под заказ, ремонт и аренда.',
        to: '/moto-service'
      }
    ]
  }

  return [
    {
      id: 'default-club',
      title: appStore.t('home.clubTitle'),
      desc: appStore.t('home.clubDesc'),
      to: '/club'
    },
    {
      id: 'default-events',
      title: appStore.t('home.eventsTitle'),
      desc: appStore.t('home.eventsDesc'),
      to: '/events'
    },
    {
      id: 'default-routes',
      title: appStore.t('home.routesTitle'),
      desc: appStore.t('home.routesDesc'),
      to: '/routes'
    },
    {
      id: 'default-moto-service',
      title: 'Moto Market & Service',
      desc: 'Auction sourcing and delivery from Japan/China, custom accessories, repair, and moto rental.',
      to: '/moto-service'
    }
  ]
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

const loadSectionDrafts = () => {
  const saved = appStore.state.siteContent?.homeSections
  sectionDrafts.value = Array.isArray(saved)
    ? saved.map((item) => ({
        id: item.id,
        title: item.title || '',
        desc: item.desc || '',
        to: item.to || '/home'
      }))
    : []

  if (!sectionDrafts.value.length) {
    sectionDrafts.value = getDefaultSections()
  }

  selectedSectionId.value = sectionDrafts.value[0].id
  syncSelectedSectionFields()
}

const syncSelectedSectionFields = () => {
  if (selectedSectionId.value === '__new__') {
    sectionTitleDraft.value = ''
    sectionDescDraft.value = ''
    sectionRouteDraft.value = '/home'
    return
  }

  const section = sectionDrafts.value.find((item) => item.id === selectedSectionId.value)
  if (!section) return
  sectionTitleDraft.value = section.title
  sectionDescDraft.value = section.desc
  sectionRouteDraft.value = section.to || '/home'
}

const syncCardFields = () => {
  if (selectedCardId.value === '__new__') {
    cardTitleDraft.value = ''
    cardSubtitleDraft.value = ''
    cardBodyDraft.value = ''
    return
  }

  const selected = cardDrafts.value.find((card) => card.id === selectedCardId.value)
  if (!selected) return
  cardTitleDraft.value = selected.title || ''
  cardSubtitleDraft.value = selected.subtitle || ''
  cardBodyDraft.value = selected.body || ''
}

const loadCardDraftsForRoute = (route) => {
  const normalizedRoute = typeof route === 'string' && route.trim() ? route.trim() : ''
  if (!normalizedRoute) {
    cardDrafts.value = []
    selectedCardId.value = '__new__'
    syncCardFields()
    return
  }

  const saved = appStore.getSectionCards(normalizedRoute, [])
  const fallback = defaultCardsByRoute.value[normalizedRoute] || []
  const source = saved.length ? saved : fallback

  cardDrafts.value = source.map((card, index) => ({
    id: card.id || `card-${Date.now()}-${index}`,
    title: card.title || '',
    subtitle: card.subtitle || '',
    body: card.body || ''
  }))
  selectedCardId.value = '__new__'
  syncCardFields()
}

const initAdminWorkspace = () => {
  selectedUserId.value = appStore.state.accountId || ''
  userRoleTargetId.value = appStore.state.accountId || ''
  roleDraft.value = appStore.state.userRole
  homeTitleDraft.value = appStore.getSiteContent('homeTitle', '')
  homeSubtitleDraft.value = appStore.getSiteContent('homeSubtitle', '')
  loadSectionDrafts()
  if (editableSectionOptions.value.length) {
    selectedCardsRoute.value = editableSectionOptions.value[0].to
  }
  loadCardDraftsForRoute(selectedCardsRoute.value)
}

const openConfirm = (message, onConfirm) => {
  confirmMessage.value = message
  confirmAction = onConfirm
  confirmVisible.value = true
}

const cancelConfirm = () => {
  confirmVisible.value = false
  confirmMessage.value = ''
  confirmAction = null
}

const acceptConfirm = () => {
  const action = confirmAction
  cancelConfirm()
  if (typeof action === 'function') action()
}

const submitAdminAuth = () => {
  const login = adminLogin.value.trim()
  const password = adminPassword.value

  if (login === ADMIN_CREDENTIALS.login && password === ADMIN_CREDENTIALS.password) {
    adminAuthorized.value = true
    authError.value = ''
    initAdminWorkspace()
    activeBlock.value = 'patches'
    return
  }

  adminAuthorized.value = false
  authError.value = ui.value.invalid
}

const handlePatchAction = (mode) => {
  const accountId = selectedUserId.value.trim()
  if (!accountId) {
    appStore.showAdminNotice(ui.value.errAccountId, 'error')
    return
  }
  if (accountId !== appStore.state.accountId) {
    appStore.showAdminNotice(ui.value.errCurrentOnly, 'error')
    return
  }

  if (mode === 'grant') {
    appStore.grantPatch(selectedPatchId.value)
    appStore.showAdminNotice(ui.value.successGranted, 'success')
    return
  }

  appStore.revokePatch(selectedPatchId.value)
  appStore.showAdminNotice(ui.value.successRevoked, 'success')
}

const saveUserRole = () => {
  const accountId = userRoleTargetId.value.trim()
  if (!accountId) {
    appStore.showAdminNotice(ui.value.errAccountId, 'error')
    return
  }
  if (accountId !== appStore.state.accountId) {
    appStore.showAdminNotice(ui.value.errCurrentOnly, 'error')
    return
  }

  appStore.setUserRole(roleDraft.value)
  appStore.showAdminNotice(ui.value.roleSaved, 'success')
}

const saveHeroContent = () => {
  appStore.updateSiteContent({
    homeTitle: homeTitleDraft.value,
    homeSubtitle: homeSubtitleDraft.value
  })
  appStore.showAdminNotice(ui.value.contentSaved, 'success')
}

const resetHeroContent = () => {
  homeTitleDraft.value = ''
  homeSubtitleDraft.value = ''
  appStore.updateSiteContent({
    homeTitle: '',
    homeSubtitle: ''
  })
  appStore.showAdminNotice(ui.value.contentResetDone, 'success')
}

const persistSections = () => {
  appStore.updateSiteContent({
    homeSections: sectionDrafts.value
  })
}

const persistCardsForRoute = () => {
  const route = selectedCardsRoute.value?.trim()
  if (!route) return
  appStore.updateSiteContent({
    sectionCards: {
      ...(appStore.state.siteContent?.sectionCards || {}),
      [route]: cardDrafts.value
    }
  })
}

const saveSelectedSection = () => {
  if (selectedSectionId.value === '__new__') {
    const created = {
      id: `section-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
      title: sectionTitleDraft.value.trim(),
      desc: sectionDescDraft.value.trim(),
      to: (sectionRouteDraft.value || '/home').trim() || '/home'
    }
    sectionDrafts.value = [...sectionDrafts.value, created]
    selectedSectionId.value = created.id
    syncSelectedSectionFields()
    persistSections()
    appStore.showAdminNotice(ui.value.sectionAdded, 'success')
    return
  }

  sectionDrafts.value = sectionDrafts.value.map((item) =>
    item.id === selectedSectionId.value
      ? {
          ...item,
          title: sectionTitleDraft.value.trim(),
          desc: sectionDescDraft.value.trim(),
          to: (sectionRouteDraft.value || '/home').trim() || '/home'
        }
      : item
  )

  persistSections()
  if (editableSectionOptions.value.length && !editableSectionOptions.value.some((item) => item.to === selectedCardsRoute.value)) {
    selectedCardsRoute.value = editableSectionOptions.value[0].to
    loadCardDraftsForRoute(selectedCardsRoute.value)
  }
  appStore.showAdminNotice(ui.value.sectionSaved, 'success')
}

const deleteSelectedSection = () => {
  if (!selectedSectionId.value) {
    appStore.showAdminNotice(ui.value.sectionNeedOne, 'error')
    return
  }
  openConfirm(ui.value.confirmDeleteSection, () => {
    sectionDrafts.value = sectionDrafts.value.filter((item) => item.id !== selectedSectionId.value)
    if (sectionDrafts.value.length) {
      selectedSectionId.value = sectionDrafts.value[0].id
      syncSelectedSectionFields()
    } else {
      selectedSectionId.value = ''
      sectionTitleDraft.value = ''
      sectionDescDraft.value = ''
      sectionRouteDraft.value = '/home'
    }

    persistSections()
    if (editableSectionOptions.value.length) {
      if (!editableSectionOptions.value.some((item) => item.to === selectedCardsRoute.value)) {
        selectedCardsRoute.value = editableSectionOptions.value[0].to
        loadCardDraftsForRoute(selectedCardsRoute.value)
      }
    } else {
      selectedCardsRoute.value = ''
      loadCardDraftsForRoute('')
    }
    appStore.showAdminNotice(ui.value.sectionDeleted, 'success')
  })
}

const resetSections = () => {
  openConfirm(ui.value.confirmResetSections, () => {
    sectionDrafts.value = getDefaultSections()
    selectedSectionId.value = sectionDrafts.value[0]?.id || ''
    syncSelectedSectionFields()
    persistSections()
    selectedCardsRoute.value = sectionDrafts.value[0]?.to || ''
    loadCardDraftsForRoute(selectedCardsRoute.value)
    appStore.showAdminNotice(ui.value.sectionResetDone, 'success')
  })
}

const saveSelectedCard = () => {
  if (selectedCardId.value === '__new__') {
    const created = {
      id: `card-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
      title: cardTitleDraft.value.trim(),
      subtitle: cardSubtitleDraft.value.trim(),
      body: cardBodyDraft.value.trim()
    }
    cardDrafts.value = [...cardDrafts.value, created]
    selectedCardId.value = created.id
    syncCardFields()
    persistCardsForRoute()
    appStore.showAdminNotice(ui.value.cardAdded, 'success')
    return
  }

  cardDrafts.value = cardDrafts.value.map((card) =>
    card.id === selectedCardId.value
      ? {
          ...card,
          title: cardTitleDraft.value.trim(),
          subtitle: cardSubtitleDraft.value.trim(),
          body: cardBodyDraft.value.trim()
        }
      : card
  )
  persistCardsForRoute()
  appStore.showAdminNotice(ui.value.cardSaved, 'success')
}

const deleteSelectedCard = () => {
  if (selectedCardId.value === '__new__' || !cardDrafts.value.length) {
    appStore.showAdminNotice(ui.value.cardNeedOne, 'error')
    return
  }
  openConfirm(ui.value.confirmDeleteCard, () => {
    cardDrafts.value = cardDrafts.value.filter((card) => card.id !== selectedCardId.value)
    selectedCardId.value = '__new__'
    syncCardFields()
    persistCardsForRoute()
    appStore.showAdminNotice(ui.value.cardDeleted, 'success')
  })
}

const resetSelectedRouteCards = () => {
  const route = selectedCardsRoute.value?.trim()
  if (!route) return
  openConfirm(ui.value.confirmResetCards, () => {
    const fallback = defaultCardsByRoute.value[route] || []
    cardDrafts.value = fallback.map((card, index) => ({
      id: card.id || `card-${Date.now()}-${index}`,
      title: card.title || '',
      subtitle: card.subtitle || '',
      body: card.body || ''
    }))
    selectedCardId.value = '__new__'
    syncCardFields()
    persistCardsForRoute()
    appStore.showAdminNotice(ui.value.cardResetDone, 'success')
  })
}

onMounted(() => {
  triggerPageIntro()
  if (adminAuthorized.value) initAdminWorkspace()
})
</script>

<template>
  <Transition name="panel-swap">
    <div v-if="confirmVisible" class="confirm-overlay" @click.self="cancelConfirm">
      <div class="confirm-dialog">
        <p class="confirm-message">{{ confirmMessage }}</p>
        <div class="confirm-actions">
          <button type="button" class="btn-secondary confirm-cancel" @click="cancelConfirm">{{ ui.confirmNo }}</button>
          <button type="button" class="btn-primary confirm-accept" @click="acceptConfirm">{{ ui.confirmYes }}</button>
        </div>
      </div>
    </div>
  </Transition>

  <Transition name="welcome-toast">
    <div v-if="appStore.state.adminNoticeVisible" :class="['welcome-toast', adminNoticeClass]">
      {{ appStore.state.adminNoticeText }}
    </div>
  </Transition>

  <main :class="['detail-page', 'page-appear', 'page-delay-1', { 'page-visible': pageVisible }]">
    <section v-if="!adminAuthorized" :class="['detail-card', 'page-appear', 'page-delay-2', { 'page-visible': pageVisible, 'admin-auth-card': !adminAuthorized }]">
      <h2>{{ ui.title }}</h2>

      <form class="form" @submit.prevent="submitAdminAuth">
        <p class="panel-note">{{ ui.authDesc }}</p>

        <label class="field">
          <span>{{ ui.login }}</span>
          <input v-model="adminLogin" type="text" :placeholder="ui.loginPlaceholder" />
        </label>

        <label class="field">
          <span>{{ ui.password }}</span>
          <input v-model="adminPassword" type="password" :placeholder="ui.passwordPlaceholder" />
        </label>

        <button type="submit" class="btn-primary">{{ ui.submit }}</button>
        <p v-if="authError" class="error-text required-error admin-auth-error">{{ authError }}</p>
      </form>
    </section>

    <section v-if="adminAuthorized" :class="['detail-grid', 'admin-blocks-grid', 'page-appear', 'page-delay-3', { 'page-visible': pageVisible }]">
      <button
        v-for="item in blockItems"
        :key="item.id"
        type="button"
        class="detail-card detail-subcard admin-tile"
        :class="{ active: activeBlock === item.id }"
        @click="activeBlock = item.id"
      >
        <h3>{{ item.title }}</h3>
      </button>
    </section>

    <section v-if="adminAuthorized && activeBlock === 'patches'" :class="['detail-card', 'admin-function-card', 'page-appear', 'page-delay-4', { 'page-visible': pageVisible }]">
      <div class="admin-actions">
        <label class="field">
          <span>{{ ui.accountId }}</span>
          <input v-model="selectedUserId" type="text" :placeholder="ui.accountIdPlaceholder" />
        </label>

        <label class="field">
          <span>{{ ui.patch }}</span>
          <select v-model="selectedPatchId" class="admin-select">
            <option v-for="patch in patchOptions" :key="patch.id" :value="patch.id">{{ patch.label }}</option>
          </select>
        </label>

        <div class="admin-actions-row">
          <button type="button" class="btn-primary" @click="handlePatchAction('grant')">{{ ui.grant }}</button>
          <button type="button" class="btn-secondary" @click="handlePatchAction('revoke')">{{ ui.revoke }}</button>
        </div>
      </div>
    </section>

    <section v-if="adminAuthorized && activeBlock === 'users'" :class="['detail-card', 'admin-function-card', 'page-appear', 'page-delay-4', { 'page-visible': pageVisible }]">
      <div class="admin-actions">
        <label class="field">
          <span>{{ ui.roleLabel }}: {{ ui.roleCurrent }} - {{ appStore.roleName }}</span>
          <input v-model="userRoleTargetId" type="text" :placeholder="ui.rolePlaceholder" />
        </label>

        <label class="field">
          <span>{{ ui.roleNew }}</span>
          <select v-model="roleDraft" class="admin-select">
            <option v-for="role in roleOptions" :key="role.id" :value="role.id">{{ role.label }}</option>
          </select>
        </label>

        <button type="button" class="btn-primary admin-compact-btn" @click="saveUserRole">{{ ui.roleSave }}</button>
      </div>
    </section>

    <section v-if="adminAuthorized && activeBlock === 'content'" :class="['detail-card', 'admin-function-card', 'page-appear', 'page-delay-4', { 'page-visible': pageVisible }]">
      <div class="admin-actions">
        <label class="field">
          <span>{{ ui.contentArea }}</span>
          <select v-model="contentMode" class="admin-select">
            <option value="hero">{{ ui.contentAreaHero }}</option>
            <option value="sections">{{ ui.contentAreaSections }}</option>
          </select>
        </label>

        <template v-if="contentMode === 'hero'">
          <label class="field">
            <span>{{ ui.contentTitle }}</span>
            <input v-model="homeTitleDraft" type="text" :placeholder="ui.contentTitle" />
          </label>

          <label class="field">
            <span>{{ ui.contentSubtitle }}</span>
            <input v-model="homeSubtitleDraft" type="text" :placeholder="ui.contentSubtitle" />
          </label>

          <div class="admin-actions-row">
            <button type="button" class="btn-primary admin-compact-btn" @click="saveHeroContent">{{ ui.contentSave }}</button>
            <button type="button" class="btn-secondary admin-compact-btn" @click="resetHeroContent">{{ ui.contentReset }}</button>
          </div>
        </template>

        <template v-else>
          <label class="field">
            <span>{{ ui.sectionSelect }}</span>
            <select
              v-model="selectedSectionId"
              class="admin-select"
              @change="syncSelectedSectionFields"
            >
              <option v-if="!sectionOptions.length" value="">{{ ui.sectionNeedOne }}</option>
              <option v-for="item in sectionOptions" :key="item.id" :value="item.id">{{ item.label }}</option>
            </select>
          </label>

          <label class="field">
            <span>{{ ui.sectionTitle }}</span>
            <input v-model="sectionTitleDraft" type="text" :placeholder="ui.sectionTitle" />
          </label>

          <label class="field">
            <span>{{ ui.sectionDesc }}</span>
            <input v-model="sectionDescDraft" type="text" :placeholder="ui.sectionDesc" />
          </label>

          <label class="field">
            <span>{{ ui.sectionRoute }}</span>
            <input v-model="sectionRouteDraft" type="text" placeholder="/club" />
          </label>

          <div class="admin-actions-row">
            <button type="button" class="btn-primary admin-compact-btn admin-save-btn" @click="saveSelectedSection">{{ ui.sectionSave }}</button>
            <button type="button" class="btn-secondary admin-compact-btn admin-delete-btn" @click="deleteSelectedSection">{{ ui.sectionDelete }}</button>
            <button type="button" class="btn-secondary admin-compact-btn admin-reset-btn" @click="resetSections">{{ ui.sectionReset }}</button>
          </div>

          <div class="admin-divider"></div>

          <label class="field">
            <span>{{ ui.cardsRoute }}</span>
            <select
              v-model="selectedCardsRoute"
              class="admin-select"
              @change="loadCardDraftsForRoute(selectedCardsRoute)"
            >
              <option v-if="!editableSectionOptions.length" value="">{{ ui.sectionNeedOne }}</option>
              <option v-for="item in editableSectionOptions" :key="item.id" :value="item.to">
                {{ item.title }}
              </option>
            </select>
          </label>

          <template v-if="selectedCardsRoute">
            <label class="field">
              <span>{{ ui.cardsSelect }}</span>
              <select
                v-model="selectedCardId"
                class="admin-select"
                @change="syncCardFields"
              >
                <option v-for="item in cardOptions" :key="item.id" :value="item.id">
                  {{ item.label }}
                </option>
              </select>
            </label>

            <label class="field">
              <span>{{ ui.cardHeading }}</span>
              <input v-model="cardTitleDraft" type="text" :placeholder="ui.cardHeading" />
            </label>

            <label class="field">
              <span>{{ ui.cardSubheading }}</span>
              <input v-model="cardSubtitleDraft" type="text" :placeholder="ui.cardSubheading" />
            </label>

            <label class="field">
              <span>{{ ui.cardBody }}</span>
              <textarea v-model="cardBodyDraft" class="admin-textarea" :placeholder="ui.cardBody"></textarea>
            </label>

            <div class="admin-actions-row">
              <button type="button" class="btn-primary admin-compact-btn admin-save-btn" @click="saveSelectedCard">{{ ui.cardSave }}</button>
              <button type="button" class="btn-secondary admin-compact-btn admin-delete-btn" @click="deleteSelectedCard">{{ ui.cardDelete }}</button>
              <button type="button" class="btn-secondary admin-compact-btn admin-reset-btn" @click="resetSelectedRouteCards">{{ ui.cardReset }}</button>
            </div>
          </template>
        </template>
      </div>
    </section>
  </main>
</template>
