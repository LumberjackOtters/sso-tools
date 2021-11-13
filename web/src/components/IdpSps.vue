<template>
  <div>
    <h2>Apps connected to your IdP</h2>
    <p>If you are creating a single sign-on facility in your application you can register it as a service provider here in order to test the connection.</p>

    <v-alert :value="true" type="info">Users registered with this IdP will only be able to access the apps regisered below.</v-alert>

    <v-btn color='primary' style="float:right;" v-on:click="openDialog"><v-icon>add</v-icon> Register a new SP</v-btn>
    <div style="clear:both;margin-bottom: 20px;" />

    <v-data-table :loading="loadingSps" hide-actions class="elevation-1" :headers="tableHeaders" :items="sps">
      <template v-slot:items="props">
        <td>{{props.item.name}}</td>
        <td>
        EntityID: {{props.item.entityId}}<br />
        Service: {{props.item.serviceUrl}}<br />
        Consumer: {{props.item.callbackUrl}}<br />
        Logout: {{props.item.logoutUrl}}<br />
        Logout callback: {{props.item.logoutCallbackUrl}}
        </td>
        <td>
	  <v-menu offset-y transition="slide-y-transition">
	    <template v-slot:activator="{ on }">
              <v-icon small class="mr-2" v-on="on">settings</v-icon>
	    </template>
	    <v-list>
	      <v-list-tile v-on:click="e => editSp(props.item)">
		<v-list-tile-title><v-icon>edit</v-icon> Update</v-list-tile-title>
	      </v-list-tile>
              <v-list-tile v-on:click="e => deleteSp(props.item._id)">
		<v-list-tile-title><v-icon>delete</v-icon> Delete</v-list-tile-title>
	      </v-list-tile>
	    </v-list>
	  </v-menu>  
        </td>
      </template>
    </v-data-table>

    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">{{editing ? 'Edit Service Provider': 'Register a Service Provider for use with this IDP'}}</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12 sm6>
                <v-text-field label="Friendly name" required autofocus v-model="newSP.name" hint="To help you identify this SP." placeholder="My Service"/>
              </v-flex>
              <v-flex xs12 sm6>
                <v-text-field label="Service URL" v-model="newSP.serviceUrl" hint="The URL used to access your service. For example, for a webapp, you can just use your website URL." placeholder="https://sp.example.com"/>
              </v-flex>
              <v-flex xs12 sm6>
                <v-text-field label="EntityID" v-model="newSP.entityId" hint="This is a URL to uniquely identify your service. It is sometimes the same as the metadata URL." placeholder="https://sp.example.com/metdadata"/>
              </v-flex>
              <v-flex xs12 sm6>
                <v-text-field label="ACS URL" v-model="newSP.callbackUrl" hint="Assertion Consumer Service, or callback URL using the HTTP POST binding." placeholder="https://sp.example.com/callback"/>
              </v-flex>
              <v-flex xs12 sm6>
                <v-text-field label="Logout URL (optional)" v-model="newSP.logoutUrl" hint="The URL we will redirect IDP-initiated logout requests to." placeholder="https://sp.example.com/logout"/>
              </v-flex>
              <v-flex xs12 sm6>
                <v-text-field label="Logout callback URL (optional)" v-model="newSP.logoutCallbackUrl" hint="The URL we will redirect users to after an SP-initiated logout." placeholder="https://sp.example.com/logout/callback"/>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click="dialog = false">Cancel</v-btn>
          <v-btn color="blue darken-1" flat @click="create">{{editing ? 'Save': 'Create'}}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </div>
</template>

<script>
import api from '../api';

export default {
  name: 'IDPSPs',
  props: ['idp'],
  data() {
    return {
      sps: [],
      loadingSps: false,
      tableHeaders: [{ text: 'Name' }, { text: 'URLs' }, { text: '' }],
      newSP: { name: '', entityId: '', serviceUrl: '', callbackUrl: '', logoutUrl: '', logoutCallbackUrl: '' },
      dialog: false,
      editing: false,
    }
  },
  created () {
    this.loadingSps = true;
    api.req('GET', `/idps/${this.idp._id}/sps`, null, resp => {
      this.sps = resp.sps;
      this.loadingSps = false;
    }, err => console.log(err));
  },
  methods: {
    openDialog (event) {
      this.dialog = true;
      this.editing = false;
      this.newSP = { name: '', entityId: '', serviceUrl: '', callbackUrl: '', logoutUrl: '', logoutCallbackUrl: '' };
    },
    create (event) {
      const { _id, name, entityId, serviceUrl, callbackUrl, logoutUrl, logoutCallbackUrl } = this.newSP;
      const data = {name, entityId, serviceUrl, callbackUrl, logoutUrl, logoutCallbackUrl};
      if (_id && this.editing) {
        api.req('PUT', `/idps/${this.idp._id}/sps/${_id}`, data, resp => {
          this.sps.map(s => {
            if (s._id === _id) return resp;
            return s;
          });
          this.dialog = false;
          this.editing = false;
        }, err => console.log(err));
      } else {
        api.req('POST', `/idps/${this.idp._id}/sps`, data, resp => {
          this.sps.push(resp);
          this.dialog = false;
        }, err => console.log(err));
      }
    },
    editSp(sp) {
      this.dialog = true;
      this.editing = true;
      this.newSP = sp;
    },
    deleteSp(id) {
      api.req('DELETE', `/idps/${this.idp._id}/sps/${id}`, null, resp => {
        this.sps = this.sps.filter(u => u._id !== id);
      }, err => console.log(err));
    },
  },
}
</script>

<style scoped>

</style>
