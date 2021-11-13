<template>
  <div>
    <v-container grid-list-xl :fluid="true">
      <h1>Welcome back<span v-if="user">, {{user.firstName}}</span></h1>
      
      <v-layout style="margin-top:30px;">
        <v-flex xs12 sm6 md4>
          <v-alert :value="loggedIn" type="info">
            <h4>Thanks for being a member!</h4>
            <p>If you need any support with SSO Tools or with connecting applications using SAML2, please get in touch with us.</p>
          </v-alert>

          <v-alert :value="!loggedIn" type="warning" >
            <h4>Hey! Listen!</h4>
            <p>You're currently using SSO Tools in sandbox mode as a non-member.</p>
            <p>This is totally fine, but it means that you'll lose access to any IDPs, SPs, and other settings you create if and when your session ends. Login or create a new account to save your progress.</p>
            <v-btn color="teal" dark v-on:click="register">Create your free account</v-btn>
            <v-btn v-on:click="login">Login</v-btn>
          </v-alert>
        </v-flex>

        <v-flex xs12 sm6 md12>

          <v-btn style="float:right;" to='/idps/new' color="primary" v-if="idps.length">Create a new IDP</v-btn>
          <h2>Your IDPs</h2>
          <div style="clear:both;" />

          <div style="text-align:center;margin-top:50px;" v-if="loading">
            <v-progress-circular indeterminate color="primary" :size="50"></v-progress-circular>
          </div>

          <div v-if="!idps.length && !loading" style="text-align:center;margin-top:50px;">
            <v-sheet elevation="6">
              <div style="padding: 20px">
                <h4>There's nothing out there yet</h4>
                <v-btn to='/idps/new' color="primary">Get started!</v-btn>

                <img :src="emptyImage" style="width:100%;max-width:400px;display:block;margin:20px auto;" />
              </div>
            </v-sheet>
          </div>

          <v-layout row wrap>
            <v-flex xs12 sm12 md6 v-for="idp in idps" :key="idp._id" style="padding: 8px;">
            <v-card :to="`/idps/${idp._id}`">
              <v-card-title primary-title>
                <div>
                  <h3 class="headline mb-0">{{idp.name}}</h3>
                  <div>https://idp.sso.tools/{{idp.code}}</div>
                </div>
              </v-card-title>

              <v-card-actions>
                <v-btn :to="{ path: `/idps/${idp._id}`}" flat color="orange"><v-icon>settings</v-icon> Manage</v-btn>
              </v-card-actions>
            </v-card>
            </v-flex>
          </v-layout>
        </v-flex>
      </v-layout>

    </v-container>
  </div>
</template>

<script>
import api from '../api';
import emptyImage from '../assets/empty.jpg';

export default {
  name: 'HelloWorld',
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
    catch (err) {}
    this.loading = true;
    api.req('GET', `/idps${(unsavedIdps && unsavedIdps.length) ? `?include=${unsavedIdps.join(',')}` : ''}`, null, resp => {
      this.idps = resp.idps;
      this.loading = false;
    }, err => console.log(err));
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
