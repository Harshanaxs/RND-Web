<template>
  <div>
    <v-card>
      <v-card-title>
        test
      </v-card-title>
      <v-card-text>
        <v-text-field v-model="name" label="name"></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-button @click="approve">Run</v-button>
      </v-card-actions>
    </v-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      name: "",
    };
  },
  methods: {
    addDate() {},
  },
};
</script>
