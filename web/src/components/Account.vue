<template>
  <v-container>
    <h1 style="margin-bottom: 20px;">Your account</h1>

    <v-card style="margin-bottom: 20px;">
      <v-card-title><span class="headline">About you</span></v-card-title>
      <v-card-text>
        <v-container grid-list-md>
          <v-layout wrap>
            <v-flex xs12 sm6>
              <v-text-field label="First name" v-model="user.firstName" />
            </v-flex>
            <v-flex xs12 sm6>
              <v-text-field label="Last name" v-model="user.lastName" />
            </v-flex>
            <v-flex xs12 sm6>
              <v-text-field label="Email address" v-model="user.email" readonly/>
            </v-flex>
            <p>Please note that changing your email address using this page is not possible at this time. For support with this, please just <a href='https://twitter.com/willwebberley' target='_blank' rel='noopener noreferrer'>get in touch</a>.</p>
          </v-layout>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn :loading="savingProfile" color="primary" @click="saveProfile">Save changes</v-btn>
      </v-card-actions>
    </v-card>

    <v-card>
      <v-card-title><span class="headline">Password</span></v-card-title>
      <v-card-text>
        <v-container grid-list-md>
          <p>Change the password associated with your SSO Tools account. This does not affect the accounts of any IDP users you may manage.</p>
          <v-layout wrap>
            <v-flex xs12 sm6>
              <v-text-field type="password" label="Current password" v-model="currentPassword" />
            </v-flex>
            <v-flex xs12 sm6>
              <v-text-field :type="showPassword ? 'text' : 'password'" label="New password (8+ characters)" v-model="newPassword" :append-icon="showPassword ? 'visibility' : 'visibility_off'" @click:append="showPassword = !showPassword"/>
            </v-flex>
          </v-layout>
          <v-alert :value="passwordError" type="error">
            <h4>Unable to change your password</h4>
            <p>{{passwordError}}</p>
          </v-alert>
          <v-alert :value="passwordSuccess" type="success">
            <h4>Password updated successfully</h4>
            <p>Use your new password next time you login.</p>
          </v-alert>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn :loading="savingPassword" color="primary" @click="savePassword">Save password</v-btn>
      </v-card-actions>
    </v-card>

  </v-container>
</template>

<script>
import api from '../api';

export default {
  data() {
    return {
      error: null,
      savingProfile: false,
      currentPassword: '',
      newPassword: '',
      showPassword: false,
      savingPassword: false,
      passwordError: null,
      passwordSuccess: false,
      user: {},
    }
  },
  computed: {
    storedUser () {
      return this.$store.state.user;
    },
  },
  created() {
    this.user = Object.assign({}, this.$store.state.user);
  },
  methods: {
    saveProfile() {
      this.savingProfile = true;
      const { firstName, lastName } = this.user;
      api.req('PUT', `/users/${this.$store.state.user._id}`, { firstName, lastName }, (user) => {
        this.savingProfile = false;
        this.$store.commit('updateProfile', user);
      }, (err) => {
        this.savingProfile= false;
      });
    },
    savePassword() {
      this.savingPassword = true;
      this.passwordError = null;
      this.passwordSuccess = false;
      const { currentPassword, newPassword } = this;
      api.req('PUT', `/accounts/password`, { currentPassword, newPassword }, () => {
        this.savingPassword = false;
        this.currentPassword = '';
        this.newPassword = '';
        this.passwordSuccess = true;
      }, (err) => {
        this.savingPassword = false;
        this.passwordError = err.message;
      });
    },
  }
}
</script>
