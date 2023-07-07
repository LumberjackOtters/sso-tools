<template>
  <div>
    <v-container>
      <h3>Manage Service Provider</h3>
      <h1 class="mb-10">{{ sp && sp.tenant }} {{ sp && sp.product }}</h1>

      <div class="d-block d-sm-flex">
        <div class="mb-10">
          <v-card v-if="sp">
            <v-list>
              <v-list-item exact prepend-icon="mdi-home">
                <v-list-item-content>Overview</v-list-item-content>
              </v-list-item>

              <!-- <v-list-item :to="`/idps/${idp._id}/settings`" prepend-icon="mdi-cogs">
                <v-list-item-content>Settings</v-list-item-content>
              </v-list-item>

              <v-list-item :to="`/idps/${idp._id}/users`" prepend-icon="mdi-account-group">
                <v-list-item-content>Users</v-list-item-content>
              </v-list-item>

              <v-list-item :to="`/idps/${idp._id}/sps`" prepend-icon="mdi-power-plug">
                <v-list-item-content>Connected apps</v-list-item-content>
              </v-list-item>

              <v-divider></v-divider>

              <v-list-item :to="`/idps/${idp._id}/saml`" prepend-icon="mdi-swap-horizontal">
                <v-list-item-content>SAML2 configuration</v-list-item-content>
              </v-list-item>
              
              <v-list-item :to="`/idps/${idp._id}/saml/guide`" prepend-icon="mdi-lifebuoy">
                <v-list-item-content>SAML2 setup guide</v-list-item-content>
              </v-list-item>

              <v-list-item :to="`/idps/${idp._id}/saml/logs`" prepend-icon="mdi-format-list-bulleted">
                <v-list-item-content>SAML2 logs</v-list-item-content>
              </v-list-item>

              <v-divider></v-divider>

              <v-list-item :to="`/idps/${idp._id}/oauth`" prepend-icon="mdi-swap-horizontal">
                <v-list-item-content>OAuth2 configuration</v-list-item-content>
              </v-list-item>

              <v-list-item :to="`/idps/${idp._id}/oauth/guide`" prepend-icon="mdi-lifebuoy">
                <v-list-item-content>OAuth2 setup guide</v-list-item-content>
              </v-list-item>

              <v-list-item :to="`/idps/${idp._id}/oauth/logs`" prepend-icon="mdi-format-list-bulleted">
                <v-list-item-content>OAuth2 logs</v-list-item-content>
              </v-list-item> -->
              </v-list>
          </v-card>

          <v-btn block class="mt-5" :href="`${spUrl}/${this.$route.params.tenant}/${this.$route.params.product}/sso/authorize`" target="_blank" prepend-icon="mdi-open-in-new">Start SP Login</v-btn>
        </div>

        <div class="ml-sm-5" style="flex: 1">
          <div v-if="sp">
            <router-view :sp="sp" @onUpdateIdp="updateIdp"/>
          </div>
        </div>
      </div>

    </v-container>
  </div>
</template>

<script>
import api from '../api';

export default {
  name: 'SP',
  data() {
    return {
      sp: null
    }
  },
  computed: {
    spUrl() {
      let spUrl = '';
      spUrl += import.meta.env.VITE_SP_PROTOCOL;
      spUrl += '://';
      spUrl += import.meta.env.VITE_SP_HOST;
      if (import.meta.env.VITE_SP_PORT != null && import.meta.env.VITE_SP_PORT != '') {
        spUrl += ':';
        spUrl += import.meta.env.VITE_SP_PORT;
      }

      return spUrl
    }
  },
  created (){
    const tenant = this.$route.params.tenant;
    const product = this.$route.params.product;
    api.req('GET', `/sps/${tenant}/${product}`, null, resp => {
      this.sp = resp;
    });
  },
  methods: {
    updateIdp(upd) {
      this.sp = upd;
    },
  },
}
</script>

<style scoped>

</style>
