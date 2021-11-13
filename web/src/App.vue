<template>
  <div id="app">
    <v-app>

      <v-toolbar >
        <router-link :to="loggedIn ? '/dashboard' : '/'">
          <img :src="logo" style="height:50px;"/>
        </router-link>
        <v-spacer></v-spacer>
        <v-toolbar-items class="hidden-sm-and-down">
          <v-btn icon to="/dashboard"><v-icon>explore</v-icon></v-btn>

          <v-menu offset-y transition="slide-y-transition" v-if="user">
	    <template v-slot:activator="{ on }">
              <v-btn icon v-on="on"><v-icon>person</v-icon></v-btn>   
	    </template>
            <v-card>
              <v-list>
                <v-list-tile avatar>
                  <v-list-tile-avatar color="teal">
                    <span class="white--text headline">{{user.firstName[0].toUpperCase()}}</span>
                  </v-list-tile-avatar>

                  <v-list-tile-content>
                    <v-list-tile-title>{{user.firstName}} {{user.lastName}}</v-list-tile-title>
                    <v-list-tile-sub-title>{{user.email}}</v-list-tile-sub-title>
                  </v-list-tile-content>
                </v-list-tile>
              </v-list>

              <v-divider></v-divider>

              <v-list>
                <v-list-tile to='/account'>
                  <v-list-tile-action><v-icon>settings</v-icon></v-list-tile-action>
                  <v-list-tile-title>Account</v-list-tile-title>
                </v-list-tile>
                <v-list-tile @click="logout">
                  <v-list-tile-action>
                    <v-icon>power_settings_new</v-icon> 
                  </v-list-tile-action>
                  <v-list-tile-title>Logout</v-list-tile-title>
                </v-list-tile>
              </v-list>
            </v-card>
          </v-menu>

          <v-btn flat v-on:click="openLogin" v-if="!loggedIn">Login</v-btn>
          <v-btn color="teal" dark v-on:click="openRegister" v-if="!loggedIn">Create a free account</v-btn>
        </v-toolbar-items>
      </v-toolbar>
    
      <div style="min-height:100vh;">
        <router-view></router-view> 
      </div>

      <v-footer dark height="auto">
        <v-card class="flex" flat tile>
          <v-card-title class="teal">
            <img :src="logoLight" style="height:50px;"/>
            <v-spacer></v-spacer>
            <v-btn flat dark to='/privacy'>Privacy Policy</v-btn>
            <v-btn flat dark to="terms">Terms of Use</v-btn>
          </v-card-title>
          <v-card-actions class="grey darken-3">
            <small>&copy; {{currentYear}} Seastorm Limited</small>
          </v-card-actions>
        </v-card>
      </v-footer>

      <v-dialog v-model="registerOpen" persistent max-width="600px">
        <v-card>
          <v-card-title>
            <span class="headline">Create a free account</span>
          </v-card-title>
          <v-card-text>
            <p>Welcome to SSO Tools!</p>
            <p>Registering takes less than a minute and we'll automatically associate the IDPs and other settings you've already setup with your new account.</p>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12 sm6>
                  <v-text-field label="First name" required autofocus v-model="newUser.firstName"/>
                </v-flex>
                <v-flex xs12 sm6>
                  <v-text-field label="Last name" v-model="newUser.lastName" />
                </v-flex>
                <v-flex xs12 sm6>
                  <v-text-field type="email" label="Email address" v-model="newUser.email" />
                </v-flex>
                <v-flex xs12 sm6>
                  <v-text-field :type="showPassword ? 'text' : 'password'" label="Password" v-model="newUser.password" :append-icon="showPassword ? 'visibility' : 'visibility_off'" @click:append="toggleShowPassword"/>
                </v-flex>
              </v-layout>

              <v-card>
                <v-card-text>
                  <p>We collect this information from you for the sole purpose of creating and maintaining your account, and it will not be used for marketing purposes without your consent. Our Privacy Policy describes how we process your data in more detail.</p>
                  <v-btn to="/privacy" @click="closeRegister">Privacy Policy</v-btn>
                  <v-btn to="terms" @click="closeRegister">Terms of Use</v-btn>
                 <v-checkbox v-model="newUser.termsAgreed" label="I have read and I agree to the SSO Tools Privacy Policy and Terms of Use" required></v-checkbox> 
                </v-card-text>
              </v-card>

              <v-alert :value="registerError" type="error">
                <h4>Unable to register this account</h4>
                <p>{{registerError}}</p>
              </v-alert>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="secondary" flat @click="closeRegister">Cancel</v-btn>
            <v-btn color="primary" @click="register" :loading="registering">Register</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="loginOpen" persistent max-width="600px">
        <v-card>
          <v-card-title>
            <span class="headline">Login to your SSO Tools account</span>
          </v-card-title>
          <v-card-text>
            <p>Welcome back!</p>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12 sm6>
                  <v-text-field type="email" label="Email address" v-model="loginData.email" />
                </v-flex>
                <v-flex xs12 sm6>
                  <v-text-field type="password" label="Password" @keyup.enter="login" v-model="loginData.password" />
                </v-flex>
              </v-layout>

              <v-btn @click="forgotPassword" flat style="float:right;">Forgotten your password?</v-btn>
              <div style="clear:both;" />
              <v-alert :value="loginError" type="error">
                <h4>Unable to login</h4>
                <p>{{loginError}}</p>
              </v-alert>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="secondary" flat @click="closeLogin">Cancel</v-btn>
            <v-btn color="primary" @click="login" :loading="loggingIn">Login</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="forgottenPasswordOpen" persistent max-width="300px">
        <v-card>
          <v-card-title>
            <span class="headline">Forgotten your SSO Tools password?</span>
          </v-card-title>
          <v-card-text>
            <p>No problem. Enter the email address of your account below, and if it exists we'll send a password-reset link to you.</p>
            <v-text-field type="email" label="Email address" v-model="loginData.email" />
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="secondary" flat @click="forgottenPasswordOpen = false">Cancel</v-btn>
            <v-btn color="primary" @click="resetPassword" :loading="resettingPassword">Send me a reset link</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-app>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import logo from './assets/logo.png';
import logoLight from './assets/logo_light.png';
import api from './api';

export default {
  name: 'app',
  data() {
    return {
      logo, logoLight,
      currentYear: (new Date()).getFullYear(),
      newUser: {firstName: '', lastName: '', email: '', password: '', termsAgreed: false},
      loginData: {email: '', password: ''},
      registering: false,
      registerError: null,
      loggingIn: false,
      loginError: null,
      showPassword: false,
      forgottenPasswordOpen: false,
      resettingPassword: false,
    }
  },
  computed: {
    loggedIn () {
      return this.$store.state.loggedIn;
    },
    user () {
      return this.$store.state.user;
    },
    registerOpen() {
      return this.$store.state.registerOpen;
    },
    loginOpen() {
      return this.$store.state.loginOpen;
    }
  },
  created() {
    const token = localStorage.getItem('apiToken');
    if (token && token !== 'null') this.onLogin(token);
  },
  methods: {
    openRegister() {
      this.$store.commit('openRegister', true);
    },
    closeRegister() {
      this.$store.commit('openRegister', false);
    },
    openLogin() {
      this.$store.commit('openLogin', true);
    },
    closeLogin() {
      this.$store.commit('openLogin', false);
    },
    toggleShowPassword() {
      this.showPassword = !this.showPassword;
    },
    onLogin(token) {
      this.$store.commit('openLogin', false);
      this.$store.commit('openRegister', false);
      this.$store.commit('login', true);
      localStorage.setItem('apiToken', token);
      api.token = token;
      api.req('GET', '/users/me', null, u => this.$store.commit('setUser', u));
      this.$router.push('/dashboard');
    },
    login() {
      const { email, password } = this.loginData;
      this.loggingIn = true;
      this.loginError = null;
      let idpsToClaim = [];
      try { idpsToClaim = JSON.parse(localStorage.getItem('idps')); }
      catch (err) {}

      api.req('POST', '/accounts/sessions', { email, password, idpsToClaim }, ({ token }) => {
        this.loggingIn = false;
        this.onLogin(token);
        localStorage.removeItem('idps');
      }, err => {
        this.loggingIn = false;
        this.loginError = err.message;
      });
    },
    register() {
      const { firstName, lastName, email, password, termsAgreed } = this.newUser;
      if (!termsAgreed) {
        this.registerError = 'We require that you agree to the Privacy Policy and Terms of Use in order to create your account.';
        return;
      }
      this.registering = true;
      this.registerError = null
      let idpsToClaim = [];
      try { idpsToClaim = JSON.parse(localStorage.getItem('idps')); }
      catch (err) {}
      api.req('POST', '/accounts', { firstName, lastName, email, password, idpsToClaim }, ({ token }) => {
        this.registering = false;
        this.onLogin(token);
        localStorage.removeItem('idps');
      }, err => {
        this.registering = false;
        this.registerError = err.message;
      });
    },
    logout() {
      api.token = null;
      localStorage.removeItem('apiToken');
      this.$store.commit('setUser', null);
      this.$store.commit('login', false);
      this.$router.push('/');
    },
    forgotPassword() {
      this.forgottenPasswordOpen = true;
      this.closeRegister();
      this.closeLogin();
    },
    resetPassword() {
      this.resettingPassword = true;
      api.req('POST', '/accounts/password/reset', { email: this.loginData.email }, () => {
        this.resettingPassword = false; 
        this.forgottenPasswordOpen = false;
      }, err => {
        this.resettingPassword = false;
        console.log(err);
      });
    },
  }
}
</script>

<style>

</style>
