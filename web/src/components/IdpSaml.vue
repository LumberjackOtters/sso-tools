<template>
  <div>
    <p>You can use the details below to configure your SAML2-compatibile service providers to use this IDP as an identity source.</p> 
    <v-alert :value="true" type="info">To start using a service provider with this IDP you will also need to register it on the <router-link style="color:white;" :to="`/idps/${idp._id}/sps`">Service Providers</router-link> page.</v-alert>

    <div style="margin-top:20px;" />
    <v-text-field readonly label="Sign-on URL (single login service through the HTTP redirect binding)" :value="`https://idp.sso.tools/${idp.code}/saml/login/request`" /> 
    <v-text-field readonly label="Logout URL (single logout service through the HTTP redirect binding)" :value="`https://idp.sso.tools/${idp.code}/saml/logout/request`" /> 
    <v-textarea :value="idp.saml.certificate" label="Signing certificate" readonly rows="6" style="font-size:11px;"/>
    <v-alert :value="true" type="info">
      <h4>Self-signed certificates</h4>
      <p>Please note that SSO Tools only issues self-signed certificates. This means that you may need to turn off signature validation on your service provider.</p>
    </v-alert>
  </div>
</template>

<script>
import api from '../api';

export default {
  name: 'IDPSAML',
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
