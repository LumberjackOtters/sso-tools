<template>
  <div>
    <v-container>

      <v-layout style="margin-top: 50px;" :justify-center="true">
        <v-flex xs12 md8>

          <div v-if="page === 0">
            <div style="text-align:center; margin-bottom: 30px;">
              <h1>Create a new identity provider (IdP)</h1>
              <p>IdPs are the core of the single sign-on system. They maintain user identities (profile information and passwords) and are where the actual user authentication takes place.</p>
              <p>You can connect your apps (service providers) to your IdP in order to give them single sign-on functionality.</p>
            </div>

            <h3>Name</h3>
            <p>A human-friendly identifier you can use to recognise the IdP.</p>
            <v-text-field v-model="name" label="Friendly name" required autofocus ></v-text-field>

            <h3>Issuer &amp; IdP location</h3>
            <p>This is a URL that uniquely identifies the IdP on the Internet. We'll host it at the idp.sso.tools subdomain with a path of your choice. The path must be unique and "URL friendly" (i.e. generally letters and numbers).</p>
            <v-text-field v-model="code" label="Issuer" required placeholder="myidp" prefix="https://idp.sso.tools/" ></v-text-field>

            <v-alert type="info" :value="true" v-if="!loggedIn">
              <h3>Not logged-in</h3>
              <p>You're currently in the SSO Tools sandbox, which means that if you end your browser session you'll lose access to your IdP. If you want to come back to continue working on this IdP at a later date, we recommend creating an account to secure it and to save your progress.</p>
            </v-alert>

            <v-alert type="error" :value="error">
              <h3>Could not create IdP</h3>
              <p>{{error}}</p>
            </v-alert>
            <div style="text-align:center;margin-top:20px;">
              <v-btn :loading="creating" color='primary' v-on:click="create">Next</v-btn>
            </div>
          </div>

          <div v-if="page === 1" style="text-align:center;">

            <h4>Step 2</h4>
            <h1>Register a user</h1>
            <p>Register a user with {{name}}. This user will be able to login via your IdP and access your connected apps.</p>
            <p>You can always add more users later.</p>

            <p><strong>Note that you cannot use your normal SSO Tools account to authenticate against your IdP.</strong> You can safely use dummy information for your users, since we won't be emailing them!</p>

            <v-layout wrap style="margin: 30px auto;">
              <v-flex xs12 sm6>
                <v-text-field autofocus v-model="newUser.firstName" label="First name" required placeholder="Jane"></v-text-field>
              </v-flex>
              <v-flex xs12 sm6>
                <v-text-field v-model="newUser.lastName" label="Last name" required placeholder="Doe"></v-text-field>
              </v-flex>
              <v-flex xs12 sm6>
                <v-text-field v-model="newUser.email" label="Email address" required placeholder="jane@example.com"></v-text-field>
              </v-flex>
              <v-flex xs12 sm6>
                <v-text-field v-model="newUser.password" label="Account password" required type='password' placeholder="password"></v-text-field>
              </v-flex>
            </v-layout>

            <v-btn @click="skip">Skip this step</v-btn>

            <v-btn :loading="creating" color='primary' v-on:click="createUser">Next</v-btn>
          </div>

          <div v-if="page === 2" style="text-align:center;">
            <h4>Step 3</h4>
            <h1>Connect an app</h1>
            <p>If you know the SAML2 settings for a service provider, you can them below to connect it to this IdP.</p>
            <p>You can find this IdP's own SAML settings after this setup. You can always add more apps later too.</p>

            <v-layout wrap style="margin: 30px auto;">
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
                <v-text-field label="Logout URL (optional)" v-model="newSP.logoutUrl" hint="The URL we will redirect IdP-initiated logout requests to." placeholder="https://sp.example.com/logout"/>
              </v-flex>
              <v-flex xs12 sm6>
                <v-text-field label="Logout callback URL (optional)" v-model="newSP.logoutCallbackUrl" hint="The URL we will redirect users to after an SP-initiated logout." placeholder="https://sp.example.com/logout/callback"/>
              </v-flex>
            </v-layout>
            <v-btn @click="skip">Skip this step</v-btn>

            <v-btn :loading="creating" color='primary' v-on:click="createSP">Next</v-btn>
          </div>

          <div v-if="page === 3" style="text-align:center;">
            <h1>All done!</h1>
            <p>Your new IdP is ready.</p>

            <h3 style="margin-top: 50px;">What would you like to do now?</h3>

            <div style="margin-bottom:20px;"> <v-btn color='primary' :to="`/idps/${this._id}`">View IdP</v-btn></div>
            <div><v-btn fluid :to="`/idps/${this._id}/saml`">View SAML2 setup</v-btn></div>
            <div><v-btn :to="`/idps/${this._id}/users`">Add more users</v-btn></div>
            <div><v-btn :to="`/idps/${this._id}/sps`">Manage apps</v-btn></div>
          </div>

        </v-flex>
      </v-layout>
    </v-container>

  </div>
</template>

<script>
import api from '../api';

export default {
  name: 'NewIDP',
  data() {
    return {
      page: 0,
      _id: null,
      name: 'Untitled IdP',
      code: '',
      newUser: {firstName: '', lastName: '', email: '', password: ''},
      newSP: { name: '', entityId: '', serviceUrl: '', callbackUrl: '', logoutUrl: '', logoutCallbackUrl: '' },
      error: null,
      creating: false,
    }
  },
  computed: {
    loggedIn() { return this.$store.state.loggedIn; }
  },
  methods: {
    skip () {
      this.page = this.page + 1;
    },
    create (event) {
      if (this.name && this.code) {
        this.error = null;
        this.creating = true;
        const data = {name: this.name, code: this.code};
        api.req('POST', '/idps', data, resp => {
          //this.$router.push('/dashboard');
          this.page = this.page + 1;
          this.creating = false;
          this._id = resp._id;
          if (!this.$store.state.loggedIn) {
            const storedIdps = localStorage.getItem('idps');
            let idps = [];
            if (storedIdps) idps = JSON.parse(storedIdps);
            idps.push(resp._id);
            localStorage.setItem('idps', JSON.stringify(idps));
          }
        }, err => {
          this.error = err.message;
          this.creating = false;
        });
      }
    },
    createUser () {
      const { firstName, lastName, email, password } = this.newUser;
      const data = {firstName, lastName, email, password};
      if (firstName && lastName && email && password) {
        this.creating = true;
        api.req('POST', `/idps/${this._id}/users`, data, resp => {
          this.creating = false;
          this.page = this.page + 1;
        }, err => {
          this.creating = false;
        });
      }
    },
    createSP (event) {
      const { name, entityId, serviceUrl, callbackUrl, logoutUrl, logoutCallbackUrl } = this.newSP;
      const data = {name, entityId, serviceUrl, callbackUrl, logoutUrl, logoutCallbackUrl};
      this.creating = true;
      api.req('POST', `/idps/${this._id}/sps`, data, resp => {
        this.creating = false;
        this.page = this.page + 1;
      }, err => {
        this.creating = false;
      });
    },
  },
}
</script>

<style scoped>

</style>
