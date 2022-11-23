<template>
  <div>
    <v-card>
      <v-card-title primary-title><h3>User accounts</h3></v-card-title>
      <v-card-text>
        <p class="mb-2">Manage the user accounts in this IdP. These users can authenticate against this IdP as part of a single sign-on flow.</p>
        <p><small>Note that you will not be able to authenticate against this IdP using your SSO Tools account. You can safely use dummy names/emails here (e.g. "name@example.com"). Auto-generated users are given the default password <code>password</code>.</small></p>

        <v-btn color='primary' style="float:right;" v-on:click="openDialog"><v-icon>add</v-icon> Register a new user</v-btn>
        <div style="clear:both;margin-bottom: 20px;" />

        <v-data-table :loading="loadingUsers" hide-actions class="elevation-1" :headers="tableHeaders" :items="users">
          <template v-slot:items="props">
            <td>{{props.item.firstName}}</td>
            <td>{{props.item.lastName}}</td>
            <td>{{props.item.email}}</td>
            <td>
              <v-menu offset-y transition="slide-y-transition">
	        <template v-slot:activator="{ on }">
                  <v-icon small class="mr-2" v-on="on">settings</v-icon>
	        </template>
	        <v-list>
	          <v-list-tile v-on:click="e => editUser(props.item)">
		    <v-list-tile-title><v-icon>edit</v-icon> Update</v-list-tile-title>
	          </v-list-tile>
                  <v-list-tile v-on:click="e => deleteUser(props.item._id)">
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
              <span class="headline">{{editing ? 'Edit user' : 'Create a new user'}}</span>
            </v-card-title>
            <v-card-text>
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
                    <v-text-field type="password" label="Password" hint="This can be changed later." v-model="newUser.password" />
                  </v-flex>
                </v-layout>

                <div v-if="attributes.length">
                  <h3>Extra attributes</h3>
                  <p>Specifying a value for an attribute below will include that value in assertions made during the SSO process, overriding the attribute's default value. Leave values here blank to send the default attribute value instead.</p>

                  <v-layout>
                    <v-flex xs12 sm6 v-for="attribute in attributes">
                      <v-text-field :label="attribute.name" :hint="`Default value: ${attribute.defaultValue ? `'${attribute.defaultValue}'` : 'none'}`" v-model="newUser.attributes[attribute._id]" />
                    </v-flex>
                  </v-layout>
                </div>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" flat @click="dialog = false">Cancel</v-btn>
              <v-btn color="blue darken-1" dark @click="create">{{editing ? 'Save' : 'Create'}}</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-card-text>
    </v-card>

    <h2 style="margin-top:30px;">Extra attributes</h2>
    <p>Manage custom attributes that can be passed to the Service Provider during sign-on.</p>
    <v-btn color='primary' style="float:right;" v-on:click="openAttributeDialog"><v-icon>add</v-icon> New attribute</v-btn>
    <div style="clear:both;margin-bottom: 20px;" />

    <v-data-table :loading="loadingAttributes" hide-actions class="elevation-1" :headers="attributeTableHeaders" :items="attributes">
      <template v-slot:items="props">
        <td>{{props.item.name}}</td>
        <td>{{props.item.defaultValue}}</td>
        <td>{{props.item.samlMapping}}</td>
        <td>
          <v-menu offset-y transition="slide-y-transition">
	    <template v-slot:activator="{ on }">
              <v-icon small class="mr-2" v-on="on">settings</v-icon>
	    </template>
	    <v-list>
	      <v-list-tile v-on:click="e => editAttribute(props.item)">
		<v-list-tile-title><v-icon>edit</v-icon> Update</v-list-tile-title>
	      </v-list-tile>
              <v-list-tile v-on:click="e => deleteAttribute(props.item._id)">
		<v-list-tile-title><v-icon>delete</v-icon> Delete</v-list-tile-title>
	      </v-list-tile>
	    </v-list>
	  </v-menu>
        </td>
      </template>
    </v-data-table>

    <v-dialog v-model="attributeDialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">{{editingAttribute ? 'Edit attribute' : 'Create a new custom attribute'}}</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12 sm6>
                <v-text-field label="Name" required autofocus v-model="newAttribute.name" hint="We'll use this as the attribute name in the assertion unless a mapping is provided." />
              </v-flex>
              <v-flex xs12 sm6>
                <v-text-field label="Default value" v-model="newAttribute.defaultValue" hint="If not overridden in the user itself, this value will be sent as a default."/>
              </v-flex>
              <v-flex xs12 sm6>
                <v-text-field label="SAML2 mapping (optional)" v-model="newAttribute.samlMapping" hint="If provided, we'll label the attribute value with this name in SAML2 assertions." />
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click="attributeDialog = false">Cancel</v-btn>
          <v-btn color="blue darken-1" dark @click="createAttribute">{{editingAttribute ? 'Save' : 'Create'}}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>


  </div>
</template>

<script>
import api from '../api';

export default {
  name: 'IDPUsers',
  props: ['idp'],
  data() {
    return {
      users: [],
      loadingUsers: false,
      attributes: [],
      loadingAttributes: false,
      tableHeaders: [{ text: 'First name' }, { text: 'Last name' }, { text: 'Email' }, { text: '' }],
      attributeTableHeaders: [{ text: 'Name' }, { text: 'Default value' }, { text: 'SAML2 mapping' }, { text: '' }],
      newUser: { firstName: '', lastName: '', email: '', password: '', attributes: {}, },
      newAttribute: { name: '', defaultValue: '', samlMapping: '' },
      dialog: false,
      editing: false,
      attributeDialog: false,
      editingAttribute: false,
    }
  },
  created () {
    this.loadingUsers = true;
    this.loadingAttributes = true;
    api.req('GET', `/idps/${this.idp._id}/users`, null, resp => {
      this.users = resp.users.map(u => Object.assign({ attributes: {} }, u));
      this.loadingUsers = false;
    }, err => console.log(err));
    api.req('GET', `/idps/${this.idp._id}/attributes`, null, resp => {
      this.attributes = resp.attributes;
      this.loadingAttributes = false;
    }, err => console.log(err));
  },
  methods: {
    openDialog (event) {
      this.editing = false;
      this.dialog = true;
      this.newUser = { firstName: '', lastName: '', email: '', password: '', attributes: {} };
    },
    openAttributeDialog(event) {
      this.attributeDialog = true;
      this.editingAttribute = false;
      this.newAttribute = { name: '', defaultValue: '', samlMapping: '' };
    },
    create (event) {
      const { _id, firstName, lastName, email, password, attributes } = this.newUser;
      const data = {firstName, lastName, email, password, attributes};
      if (_id && this.editing) {
        api.req('PUT', `/idps/${this.idp._id}/users/${_id}`, data, resp => {
          this.users.map(u => {
            if (u._id === _id) return resp;
            return u;
          });
          this.dialog = false;
          this.editing = false;
        }, err => console.log(err));
      } else {
        api.req('POST', `/idps/${this.idp._id}/users`, data, resp => {
          this.users.push(resp);
          this.dialog = false;
        }, err => console.log(err));
      }
    },
    createAttribute() {
      const { _id, name, defaultValue, samlMapping } = this.newAttribute;
      const data = {name, defaultValue, samlMapping};
      if (_id && this.editingAttribute) {
        api.req('PUT', `/idps/${this.idp._id}/attributes/${_id}`, data, resp => {
          this.attributes.map(u => {
            if (u._id === _id) return resp;
            return u;
          });
          this.attributeDialog = false;
          this.editingAttribute = false;
        }, err => console.log(err));
      } else {
        api.req('POST', `/idps/${this.idp._id}/attributes`, data, resp => {
          this.attributes.push(resp);
          this.attributeDialog = false;
        }, err => console.log(err));
      }
    },
    editUser(user) {
      this.dialog = true;
      this.editing = true;
      this.newUser = user;
    },
    editAttribute(attribute) {
      this.attributeDialog = true;
      this.editingAttribute = true;
      this.newAttribute = attribute;
    },
    deleteUser(id) {
      api.req('DELETE', `/idps/${this.idp._id}/users/${id}`, null, resp => {
        this.users = this.users.filter(u => u._id !== id);
      }, err => console.log(err));
    },
    deleteAttribute(id) {
      api.req('DELETE', `/idps/${this.idp._id}/attributes/${id}`, null, resp => {
        this.attributes = this.attributes.filter(u => u._id !== id);
      }, err => console.log(err));
    },
  },
}
</script>

<style scoped>

</style>
