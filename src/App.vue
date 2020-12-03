<template>
  <v-app>
    <router-view></router-view>
  </v-app>
</template>

<script>
import layout from "@/components/layout";
export default {
  name: "App",

  components: {
    layout,
  },

  data: () => ({
    //
  }),
};
</script>
