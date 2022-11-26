<template>
  <div>
    <p>You can use the details below to configure your OAuth2-compatibile service providers to use this IDP as an identity source.</p>
    <v-alert type="info" class="mt-5">To start using a service provider with this IDP you will also need to register it on the <router-link style="color:white;" :to="`/idps/${idp._id}/sps`">Connected apps</router-link> page.</v-alert>

    <div class="mt-10">
      <h4 class="mb-2">Useful URLs for this IdP</h4>
      <v-text-field readonly label="Authorization URL (where to send users to login)" :model-value="`https://idp.sso.tools/${idp.code}/oauth2/authorize`" />
      <v-text-field readonly label="Token URL (where to exchange an authorization token for an ID/access token)" :model-value="`https://idp.sso.tools/${idp.code}/oauth2/token`" />

      <h4 class="mt-5">The following scopes can be requested</h4>
      <v-list lines="two">
        <v-list-item prepend-icon="mdi-check-circle-outline"
          title="email"
          subtitle="To allow the service provider to request access to the user's email address"
        ></v-list-item>
        <v-list-item prepend-icon="mdi-check-circle-outline"
          title="profile"
          subtitle="To allow the service provider to request access to the user's name and other attributes"
        ></v-list-item>
        <v-list-item prepend-icon="mdi-check-circle-outline"
          title="openid"
          subtitle="The IdP will send an ID token, along with the access token, containing scoped profile claims"
        ></v-list-item>
      </v-list>
    </div>

  </div>
</template>

<script>
import api from '../api';

export default {
  name: 'IDPOAuth',
  props: ['idp'],
  data() {
    return {
    }
  },
  methods: {

  },
}
</script>

<style scoped>

</style>
