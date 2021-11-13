import Vue from 'vue'
import Vuetify from 'vuetify'
import VueRouter from 'vue-router';
import Vuex from 'vuex';

import App from './App.vue'
import 'vuetify/dist/vuetify.min.css'

import Home from './components/Home.vue';
import ResetPassword from './components/ResetPassword.vue';
import Account from './components/Account.vue';
import HelloWorld from './components/HelloWorld.vue'
import NewIDP from './components/NewIDP.vue'
import IDP from './components/IDP.vue';
import IDPHome from './components/IdpHome.vue';
import IDPUsers from './components/IdpUsers.vue';
import IDPSettings from './components/IdpSettings.vue';
import IDPSPs from './components/IdpSps.vue';
import IDPSAML from './components/IdpSaml.vue';

import PrivacyPolicy from './components/legal/PrivacyPolicy.vue';
import TermsOfUse from './components/legal/TermsOfUse.vue';

Vue.use(Vuetify);
Vue.use(VueRouter);
Vue.use(Vuex);

const store = new Vuex.Store({
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
});

const router = new VueRouter({
  scrollBehavior() {
    return { x: 0, y: 0 };
  },
  mode: 'history',
  routes: [
    { path: '/', component: Home },
    { path: '/privacy', component: PrivacyPolicy },
    { path: '/terms', component: TermsOfUse },
    { path: '/account', component: Account },
    { path: '/password/reset', component: ResetPassword },
    { path: '/dashboard', component: HelloWorld },
    { path: '/idps/new', component: NewIDP },
    { path: '/idps/:id', component: IDP, children: [
      { path: '/', component: IDPHome },
      { path: 'users', component: IDPUsers }, 
      { path: 'settings', component: IDPSettings },
      { path: 'sps', component: IDPSPs },
      { path: 'saml', component: IDPSAML }
    ] },
  ]
})

new Vue({ store, router, render: h => h(App) }).$mount('#app')
