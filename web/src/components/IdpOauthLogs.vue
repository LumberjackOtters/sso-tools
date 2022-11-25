<template>
  <div>
    <p>Oauth logs</p>


  </div>
</template>

<script>
import api from '../api';
import moment from 'moment';

export default {
  name: 'IDPLogs',
  props: ['idp'],
  data() {
    return {
      logs: [],
      loadingLogs: false,
      tableHeaders: [{ text: 'Date and time' }, { text: 'Service' }, { text: 'Type' }, { text: 'Data' }],
    }
  },
  created () {
    this.fetchLogs();
  },
  methods: {
    fetchLogs() {
      this.loadingLogs = true;
      api.req('GET', `/idps/${this.idp._id}/logs`, null, resp => {
        this.logs = resp.logs;
        this.logs.forEach(l => l.formattedData = JSON.stringify(l.data, null, 2));
        this.loadingLogs = false;
      }, err => console.log(err));
    },
    formatDate(date) {
      return moment(date).format('L HH:mm:ss');
    }
  },
}
</script>

<style scoped>

</style>
