<template>
  <div>
    <v-card>
      <v-card-title primary-title><h3>Basic information</h3></v-card-title>

      <v-card-text>
        <h5>SP Tenant</h5>
        <p>{{ sp.tenant }}</p>

        <h5>SP Product</h5>
        <p>{{ sp.product }}</p>
        
        <h5>EntityId</h5>
        <p>{{ sp.value.idpMetadata && sp.value.idpMetadata.entityID }}</p>

        <h5>Provider</h5>
        <p>{{ sp.value.idpMetadata && sp.value.idpMetadata.provider }}</p>
      </v-card-text>
    </v-card>
    <div style="margin-bottom:20px;" />

    <v-card>
      <v-card-title primary-title><h3>Delete SP</h3></v-card-title>
      <v-card-text>Deleting this SP will immediately and irreversibly remove the Service Provider.</v-card-text>
      <v-card-actions>
        <v-btn v-on:click="deleteSP" color='red'>Delete</v-btn>
      </v-card-actions>
    </v-card>

    <v-dialog v-model="deleting" max-width="290">
      <v-card>
        <v-card-title class="headline">Really delete this SP?</v-card-title>
        <v-card-text>This will immediately de-register this SP's Service Provider information, users, and other settings before deleting the Identity Provider.</v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="deleting = false">Cancel</v-btn>
          <v-btn :loading="deletingProgress" dark color="green darken-1" @click="deleteConfirm">Delete SP</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import api from '../api';

export default {
  name: 'SPHome',
  props: ['sp'],
  data() {
    console.log(this.sp)
    return {
      deleting: false,
      deletingProgress: false,
    }
  },
  methods: {
    deleteSP (){
      this.deleting = true;
    },
    deleteConfirm (event) {
      this.deletingProgress = true;
      api.req('DELETE', `/sps/${this.$route.params.tenant}/${this.$route.params.product}`, null, resp => {
        this.deletingProgress = false;
        this.deleting = false;
        this.$router.push('/dashboard');
      }, err => {
        console.log(err);
        this.deletingProgress = false;
      });
    }
  },
}
</script>

<style scoped>

</style>
