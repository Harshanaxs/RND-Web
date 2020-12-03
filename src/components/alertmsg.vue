<template>
  <v-snackbar :color="viewAlert.data.type" v-model="viewAlert.snackbar">
    {{ viewAlert.data.msgtext }}

    <template v-slot:action="{ attrs }">
      <v-btn
        color="viewAlert.data.type"
        text
        v-bind="attrs"
        @click="viewAlert.snackbar = false"
      >
        Close
      </v-btn>
    </template>
  </v-snackbar>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {};
  },
  computed: {
    ...mapGetters(["xalert"]),
    viewAlert() {
      return this.xalert;
    },
  },
};
</script>
