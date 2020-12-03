<template>
  <div>
    <v-container class="fill-height" fluid>
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="4">
          <v-card class="elevation-12">
            <v-toolbar color="blue darken-2" dark flat>
              <v-toolbar-title>Login form</v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <v-form>
                <v-text-field
                  label="Login"
                  name="login"
                  prepend-icon="mdi-account"
                  type="text"
                  v-model="userEmail"
                ></v-text-field>

                <v-text-field
                  id="password"
                  label="Password"
                  name="password"
                  prepend-icon="mdi-lock"
                  type="password"
                  v-model="userPassword"
                ></v-text-field>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn v-if="!isLoading" @click="login" color="primary"
                >Login</v-btn
              >
              <input v-on:keyup.enter="login()" />

              <v-progress-circular
                v-if="isLoading"
                indeterminate
                color="primary"
              ></v-progress-circular>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import firebase from "firebase";
import store from "@/store/index.js";
export default {
  data() {
    return {
      userEmail: "",
      userPassword: "",
      isLoading: false,
    };
  },
  methods: {
    login: function () {
      this.isLoading = true;
      firebase
        .auth()
        .signInWithEmailAndPassword(this.userEmail, this.userPassword)
        .then((data) => {
          data.user.getIdTokenResult().then((user) => {
            this.$router.push("/");

            // console.log(user.claims);
            // let claims = user.claims;
            //store.dispatch("fetchUser", claims);
            store.dispatch("syncData");
          });
        })
        .catch((err) => {
          this.isLoading = false;
          this.error = err.message;
        });
    },
  },
};
</script>
