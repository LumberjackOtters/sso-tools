<template>
  <div>
    <v-container grid-list-lg>
      <h3>Manage Identity Provider</h3>
      <h1 style="margin-bottom:30px">{{idp && idp.name}}</h1>

      <v-layout wrap>
        <v-flex md4 xs12>
          <v-card>
              <v-list>
                <v-list-tile exact :to="`/idps/${idp._id}`">
                  <v-list-tile-action>
                    <v-icon>home</v-icon>
                  </v-list-tile-action>
                  <v-list-tile-content>
                    <v-list-tile-title>Overview</v-list-tile-title>
                  </v-list-tile-content>
                </v-list-tile>

                <v-list-tile :to="`/idps/${idp._id}/settings`">
                  <v-list-tile-action>
                    <v-icon>settings</v-icon>
                  </v-list-tile-action>
                  <v-list-tile-content>
                    <v-list-tile-title>Settings</v-list-tile-title>
                  </v-list-tile-content>
                </v-list-tile>

                <v-list-tile :to="`/idps/${idp._id}/users`">
                  <v-list-tile-action>
                    <v-icon>people</v-icon>
                  </v-list-tile-action>
                  <v-list-tile-content>
                    <v-list-tile-title>Users</v-list-tile-title>
                  </v-list-tile-content>
                </v-list-tile>

                <v-list-tile :to="`/idps/${idp._id}/sps`">
                  <v-list-tile-action>
                    <v-icon>extension</v-icon>
                  </v-list-tile-action>
                  <v-list-tile-content>
                    <v-list-tile-title>Connected apps</v-list-tile-title>
                  </v-list-tile-content>
                </v-list-tile>

                <v-divider></v-divider>

                <v-list-tile :to="`/idps/${idp._id}/saml`">
                  <v-list-tile-action>
                    <v-icon>compare_arrows</v-icon>
                  </v-list-tile-action>
                  <v-list-tile-content>
                    <v-list-tile-title>SAML2 Configuration</v-list-tile-title>
                  </v-list-tile-content>
                </v-list-tile>
              </v-list>
          </v-card>

          <v-btn block color='secondary' style="margin-top: 15px;" :href="`https://idp.sso.tools/${idp.code}`" target="_blank"><v-icon>open_in_new</v-icon> Open IdP dashboard</v-btn>
        </v-flex>

        <v-flex md8>
          <div v-if="idp">
            <router-view :idp="idp"/>
          </div>
        </v-flex>
      </v-layout>

    </v-container>
  </div>
</template>

<script>
import api from '../api';

export default {
  name: 'IDP',
  data() {
    return {
      idp: null,
    }
  },
  created (){
    const id = this.$route.params.id;
    api.req('GET', `/idps/${id}`, null, resp => {
      this.idp = resp;
    });
  },
  methods: {
    
  },
}
</script>

<style scoped>

</style>
