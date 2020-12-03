<template>
  <div>
    <v-card max-width="400px">
      <v-container>
        <v-card-title>
          <h2>Management Approvals</h2>
        </v-card-title>
        <v-card-text>
          <FormulateForm>
            <FormulateInput
              type="select"
              name="approval"
              label="Approval"
              validation="required"
              :options="{ 1: 'Approved', 2: 'Rejected', 0: 'Pending' }"
            ></FormulateInput>
            <FormulateInput
              name="feedback"
              label="Feedback"
              type="textarea"
            ></FormulateInput>

            <FormulateInput type="submit" name="Submit" />
          </FormulateForm>
        </v-card-text>
        <v-card-actions> </v-card-actions>
      </v-container>
    </v-card>
  </div>
</template>
<script>
export default {
  data: () => ({
    formValues: {},
  }),
  methods: {
    handleSubmit() {},
  },
};
</script>
