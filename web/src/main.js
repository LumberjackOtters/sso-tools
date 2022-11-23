import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { createStore } from 'vuex'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi'

import App from './App.vue'
//import 'vuetify/dist/vuetify.min.css'
import '@mdi/font/css/materialdesignicons.css' // Ensure you are using css-loader

import Home from './components/Home.vue';
import ResetPassword from './components/ResetPassword.vue';
import Account from './components/Account.vue';
import Dashboard from './components/Dashboard.vue'
import NewIDP from './components/NewIDP.vue'
import IDP from './components/IDP.vue';
import IDPHome from './components/IdpHome.vue';
import IDPUsers from './components/IdpUsers.vue';
import IDPSettings from './components/IdpSettings.vue';
import IDPSPs from './components/IdpSps.vue';
import IDPSAML from './components/IdpSaml.vue';
import IDPLogs from './components/IdpLogs.vue';

import PrivacyPolicy from './components/legal/PrivacyPolicy.vue';
import TermsOfUse from './components/legal/TermsOfUse.vue';

const store = createStore({
  state: {
    loggedIn: false,
    user: null,
    registerOpen: false,
    loginOpen: false,
  },
  mutations: {
    login (state, loggedIn) {
      state.loggedIn = loggedIn;
    },
    setUser (state, user) {
      state.user = user;
      if (user && window.drift && window.drift.identify) {
        window.drift.identify(user._id, {
          email: user.email,
          firstName: user.firstName,
        });
      }
      if (!user && window.drift && window.drift.reset) {
        window.drift.reset();
      }
    },
    updateProfile (state, profile) {
      state.user = Object.assign({}, state.user, profile);
    },
    openRegister (state, open) {
      state.registerOpen = open;
    },
    openLogin (state, open) {
      state.loginOpen = open;
    },
  }
})

const router = createRouter({
  scrollBehavior() {
    return { left: 0, top: 0 };
  },
  history: createWebHistory(),
  routes: [
    { path: '/', component: Home },
    { path: '/privacy', component: PrivacyPolicy },
    { path: '/terms', component: TermsOfUse },
    { path: '/account', component: Account },
    { path: '/password/reset', component: ResetPassword },
    { path: '/dashboard', component: Dashboard },
    { path: '/idps/new', component: NewIDP },
    { path: '/idps/:id', component: IDP, children: [
      { path: '/', component: IDPHome },
      { path: 'users', component: IDPUsers },
      { path: 'settings', component: IDPSettings },
      { path: 'sps', component: IDPSPs },
      { path: 'saml', component: IDPSAML },
      { path: 'logs', component: IDPLogs }
    ] },
  ]
})

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    }
  },
})

const app = createApp(App)
app.use(store)
app.use(vuetify)
app.use(router)
app.mount('#app')