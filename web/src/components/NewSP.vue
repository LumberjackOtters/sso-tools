<template>
  <div>
    <v-container class="ml-auto mr-auto" style="max-width: 600px">
          <div v-if="page === 0">
            <div style="text-align:center; margin-bottom: 30px;">
              <h1 class="mb-10">Create a new service provider (SP)</h1>
              <p>SPs are the final endpoint of the SSO. They receive user identities (profile information) and are where the user can use the application.</p>
              <p>You can connect your Idps (Identity providers) to your SP in order to test your informations.</p>
            </div>

            <h3>Tenant</h3>
            <p>The name of your tenant</p>
            <v-text-field v-model="tenant" label="Tenant" required autofocus ></v-text-field>

            <h3>Product</h3>
            <p>The name of your product</p>
            <v-text-field v-model="product" label="Product" required ></v-text-field>

            <h3>Metadata (Raw XML)</h3>
            <p></p>
            <v-textarea v-model="metadata" label="Metadata" required ></v-textarea>

            <v-alert type="info" :value="true" v-if="!loggedIn">
              <h3>Not logged-in</h3>
              <p>You're currently in the SSO Tools sandbox, which means that if you end your browser session you'll lose access to your IdP. If you want to come back to continue working on this IdP at a later date, we recommend creating an account to secure it and to save your progress.</p>
            </v-alert>

            <v-alert type="error" v-if="error">
              <h3>Could not create SP</h3>
              <p>{{error}}</p>
            </v-alert>
            <div style="text-align:center;margin-top:20px;">
              <v-btn :loading="creating" color='primary' v-on:click="create">Create</v-btn>
            </div>
          </div>

          <div v-if="page === 1" style="text-align:center;">

            <h4>Step 2</h4>
            <h1>Registered SP</h1>
            <p>A SP has been registered for {{ tenant }} {{ product }}</p>
            <p>You can always add more sps later.</p>

            <!-- <p class="mt-10"><strong>Note that you cannot use your normal SSO Tools account to authenticate against your IdP.</strong> You can safely use dummy information for your users, since we won't be emailing them!</p> -->

            <!-- <div class="d-block d-sm-flex flex-wrap mt-10 mb-10">
                <v-text-field class="mr-2" autofocus v-model="newUser.firstName" label="First name" required placeholder="Jane"></v-text-field>
                <v-text-field class="mr-2" v-model="newUser.lastName" label="Last name" required placeholder="Doe"></v-text-field>
                <v-text-field class="mr-2" v-model="newUser.email" label="Email address" required placeholder="jane@example.com"></v-text-field>
                <v-text-field class="mr-2" v-model="newUser.password" label="Account password" required type='password' placeholder="password"></v-text-field>
            </div> -->
          </div>

    </v-container>

  </div>
</template>

<script>
import spApi from '../spApi';

export default {
  name: 'NewSP',
  data() {
    return {
      page: 0,
      _id: null,
      tenant: '',
      product: '',
      metadata: '',
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
      if (this.tenant && this.product && this.metadata) {
        this.error = null;
        this.creating = true;
        const data = {tenant: this.tenant, product: this.product, rawMetadata: this.metadata };
        spApi.req('POST', '/api/config', data, resp => {
          //this.$router.push('/dashboard');
          this.page = this.page + 1;
          this.creating = false;
          this.tenant = resp.tenant;
          this.product = resp.product;
          this.metadata = resp.metadata;
        }, err => {
          console.log(err)
          this.error = err.message;
          this.creating = false;
        });
      }
    }
  },
}
</script>

<style scoped>

</style>
