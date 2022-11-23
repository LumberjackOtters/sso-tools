<template>
  <div>
    <v-container fluid="true">
      <h1>Welcome back<span v-if="user">, {{user.firstName}}</span></h1>

      <v-row class="mt-10">
        <v-col xs="12" sm="4">
          <v-alert v-if="loggedIn" color="blue-darken-1" icon="mdi-flash">
            <h3>Thanks for being a member!</h3>
            <p>If you need any support with SSO Tools, or with connecting applications using SAML2, please get in touch with us.</p>
          </v-alert>

          <v-alert v-if="!loggedIn" type="warning" >
            <h3>Hey! Listen!</h3>
            <p class="mb-4">You're currently using SSO Tools in sandbox mode as a non-member.</p>
            <p>This is totally fine, but it means that you'll lose access to any IDPs, SPs, and other settings you create if and when your session ends. Login or create a new account to save your progress.</p>
            <div class="mt-5">
              <v-btn class="mr-2" color="teal" dark v-on:click="register">Register</v-btn>
              <v-btn v-on:click="login">Login</v-btn>
            </div>
          </v-alert>
        </v-col>

        <v-col xs="12" sm="8">
          <div class="d-flex justify-space-between">
            <h2>Your IDPs</h2>
            <v-btn to='/idps/new' color="primary" v-if="idps.length">Create a new IDP</v-btn>
          </div>

          <div style="text-align:center;margin-top:50px;" v-if="loading">
            <v-progress-circular indeterminate color="primary" :size="50"></v-progress-circular>
          </div>

          <div v-if="!idps.length && !loading" class="mt-15">
            <v-sheet elevation="6">
              <div style="padding: 20px">
                <h4>There's nothing out there yet</h4>
                <v-btn to='/idps/new' color="primary">Get started!</v-btn>

                <img :src="emptyImage" style="width:100%;max-width:400px;display:block;margin:20px auto;" />
              </div>
            </v-sheet>
          </div>

          <v-layout row wrap class="mt-10">
            <v-flex xs12 sm12 md6 v-for="idp in idps" :key="idp._id" style="padding: 8px;">
            <v-card :to="`/idps/${idp._id}`">
              <v-card-title primary-title>
                <h3 class="headline mb-0">{{idp.name}}</h3>
              </v-card-title>
              <v-card-text>https://idp.sso.tools/{{idp.code}}</v-card-text>
              <v-card-actions>
                <v-btn to="{ path: `/idps/${idp._id}`}" flat color="primary" prepend-icon="mdi-cog">Manage</v-btn>
              </v-card-actions>
            </v-card>
            </v-flex>
          </v-layout>
        </v-col>
      </v-row>

    </v-container>
  </div>
</template>

<script>
import api from '../api';
import emptyImage from '../assets/empty.jpg';

export default {
  name: 'Dashboard',
  data() {
    return {
      idps: [], emptyImage, loading: false
    }
  },
  computed: {
    user () { return this.$store.state.user; },
    loggedIn () {
      return this.$store.state.loggedIn;
    }
  },
  created (){
    let unsavedIdps = [];
    try { unsavedIdps = JSON.parse(localStorage.getItem('idps')); }
    catch (err) { unsavedIdps = []; }
    this.loading = true;
    api.req('GET', `/idps${(unsavedIdps && unsavedIdps.length) ? `?include=${unsavedIdps.join(',')}` : ''}`, null, resp => {
      this.idps = resp.idps;
      this.loading = false;
    });
  },
  methods: {
    register() {
      this.$store.commit('openRegister', true);
    },
    login() {
      this.$store.commit('openLogin', true);
    },
  },
}
</script>

<style scoped>

</style>
