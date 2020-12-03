<template>
  <div id="app">
    <v-app id="inspire">
      <v-navigation-drawer v-model="drawer" app>
        <v-list dense>
          <v-list-item
            link
            v-for="(link, index) in links"
            :key="index"
            router
            :to="link.route"
          >
            <v-list-item-action>
              <v-icon>{{ link.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>{{ link.text }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item link @click="signout">
            <v-list-item-action>
              <v-icon>mdi-logout</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Log Out</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>

      <v-app-bar app color="indigo" dark>
        <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
        <v-toolbar-title>Tea Tang R&D Portal</v-toolbar-title>
      </v-app-bar>

      <v-main class="mt-0">
        <slot name="body"></slot>
      </v-main>
      <v-footer class="white--text" color="indigo" app>
        <div class="mx-auto">
          IT Department
          <span class="white--text">&copy; {{ new Date().getFullYear() }}</span>
        </div>
      </v-footer>
    </v-app>
  </div>
</template>

<script>
// @ is an alias to /src
import firebase from "firebase";
export default {
  props: {
    source: String,
  },

  data: () => ({
    links: [
      { icon: "mdi-home", text: "Home", route: "/" },
      // { icon: "mdi-file-chart", text: "Reports", route: "/detail" },
      { icon: "mdi-application", text: "Detail", route: "/detail" },
    ],
    drawer: false,
  }),
  methods: {
    signout() {
      this.$store.dispatch("signOut");
    },
  },
};
</script>
