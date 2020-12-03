<template>
  <layout>
    <div slot="body">
      <v-container>
        <v-data-table
          :headers="headers"
          :items="projects"
          sort-by="calories"
          class="elevation-1"
        >
          <template v-slot:top>
            <v-toolbar flat color="white">
              <v-toolbar-title>Editable Mode</v-toolbar-title>
              <v-divider class="mx-4" inset vertical></v-divider>
              <v-spacer></v-spacer>
              <v-dialog v-model="dialog" width="800px">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    color="primary"
                    dark
                    class="mb-2"
                    v-bind="attrs"
                    v-on="on"
                    >New Item</v-btn
                  >
                </template>

                <v-card height="800" class="fill-height">
                  <v-card-title>
                    <span class="headline">{{ formTitle }}</span>
                  </v-card-title>

                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col cols="12">
                          <v-form class :readonly="user.role > 1">
                            <v-tabs background-color="blue darken-4" dark grow>
                              <v-tab>Genaral</v-tab>
                              <v-tab>Details</v-tab>
                              <v-tab>Attachments</v-tab>
                              <v-tab
                                v-if="
                                  editedItem.data.CurrentStage > 2 ||
                                    editedItem.data.CurrentStage == 0
                                "
                                >Feedbacks</v-tab
                              >
                              <v-tab-item>
                                <v-flex row wrap>
                                  <v-col cols="12" sm="6" md="6">
                                    <v-text-field
                                      v-model="editedItem.data.SerialNo"
                                      label="Serial No"
                                    ></v-text-field>
                                  </v-col>
                                  <v-col cols="12" sm="6" md="6">
                                    <v-text-field
                                      v-model="editedItem.data.Product_Name"
                                      label="Product Name"
                                    ></v-text-field>
                                  </v-col>
                                  <v-col cols="12" sm="6" md="6">
                                    <v-text-field
                                      v-model="editedItem.data.type"
                                      label="Type"
                                    ></v-text-field>
                                  </v-col>
                                  <v-col cols="12" sm="6" md="6">
                                    <v-chip class="ma-2" label
                                      >Request Date</v-chip
                                    >
                                    {{ editedItem.data.RequestDate }}
                                  </v-col>
                                  <v-col cols="12" sm="6" md="6">
                                    <label for>Next Action</label>
                                    <v-chip
                                      class="ma-2"
                                      :color="
                                        editedItem.data.Next_Action | stageColor
                                      "
                                      label
                                      text-color="white"
                                    >
                                      <v-icon left>mdi-label</v-icon>
                                      {{
                                        editedItem.data.Next_Action
                                          | stageFilter
                                      }}
                                    </v-chip>
                                  </v-col>
                                  <v-col cols="12" sm="6" md="6">
                                    <v-menu
                                      v-model="menu3"
                                      :close-on-content-click="false"
                                      :nudge-right="40"
                                      transition="scale-transition"
                                      offset-y
                                      min-width="290px"
                                    >
                                      <template
                                        v-slot:activator="{ on, attrs }"
                                      >
                                        <v-text-field
                                          v-model="editedItem.data.TargetDate"
                                          label="Target Date"
                                          prepend-icon="mdi-calendar-range"
                                          readonly
                                          v-bind="attrs"
                                          v-on="on"
                                        ></v-text-field>
                                      </template>
                                      <v-date-picker
                                        v-model="editedItem.data.TargetDate"
                                        show-current
                                        @input="menu3 = false"
                                      ></v-date-picker>
                                    </v-menu>
                                  </v-col>
                                </v-flex>
                              </v-tab-item>
                              <v-tab-item>
                                <div class="tab-item-wrapper">
                                  <v-layout
                                    align-center
                                    justify-center
                                    column
                                    fill-height
                                  >
                                    <v-flex row wrap>
                                      <v-col cols="12" sm="6" md="6">
                                        <v-text-field
                                          v-model="editedItem.data.Formula"
                                          label="Formula"
                                        ></v-text-field>
                                      </v-col>

                                      <v-col cols="12" sm="6" md="6">
                                        <v-text-field
                                          v-model="editedItem.data.Flavor"
                                          label="Flavor"
                                        ></v-text-field>
                                      </v-col>

                                      <v-col cols="12" sm="6" md="6">
                                        <v-text-field
                                          v-model="
                                            editedItem.data.Material_Supply
                                          "
                                          label="Material Supply"
                                        ></v-text-field>
                                      </v-col>

                                      <v-col cols="12" sm="6" md="6">
                                        <v-textarea
                                          v-model="editedItem.data.description"
                                          label="Description"
                                        ></v-textarea>
                                      </v-col>
                                      <v-col cols="12" sm="6" md="6">
                                        <v-textarea
                                          v-model="editedItem.data.rational"
                                          label="Rational"
                                        ></v-textarea>
                                      </v-col>
                                    </v-flex>
                                  </v-layout>
                                </div>
                              </v-tab-item>
                              <div class="tab-item-wrapper">
                                <v-layout
                                  align-center
                                  justify-center
                                  column
                                  fill-height
                                >
                                  <v-tab-item>
                                    <v-flex row wrap>
                                      <v-col cols="12" sm="12" md="12">
                                        <h3>Attachments</h3>

                                        <div
                                          v-for="(file, index) in editedItem
                                            .data.uploads"
                                          :key="index"
                                        >
                                          <v-chip
                                            class="mt-2"
                                            @click="openUpload(file.url)"
                                            >{{ file.name }}</v-chip
                                          >
                                        </div>
                                      </v-col>
                                      <v-col cols="12" sm="12" md="12">
                                        <input
                                          type="file"
                                          multiple
                                          @change="uploadFiles($event)"
                                          label="Select Attachments"
                                        />
                                        <h2>Uploaded Files</h2>

                                        <ul>
                                          <li
                                            v-for="(file, index) in uploads"
                                            :key="index"
                                          >
                                            {{ file.name }} |
                                            {{ uploadProgress }}
                                          </li>
                                        </ul>
                                      </v-col>
                                    </v-flex>
                                  </v-tab-item>
                                </v-layout>
                              </div>
                              <v-tab-item
                                v-if="
                                  editedItem.data.CurrentStage > 2 ||
                                    editedItem.data.CurrentStage == 0
                                "
                              >
                                <div class="tab-item-wrapper">
                                  <v-layout
                                    align-center
                                    justify-center
                                    column
                                    fill-height
                                  >
                                    <v-row>
                                      <h3>Management Feedback</h3>
                                      <v-col cols="12">
                                        <v-label>
                                          Status :
                                          <v-chip>{{
                                            editedItem.data.ManagementApprovals
                                          }}</v-chip>
                                        </v-label>
                                        <p>
                                          {{
                                            editedItem.data.ManagementFeedback
                                          }}
                                        </p>
                                      </v-col>
                                    </v-row>
                                  </v-layout>
                                </div>
                              </v-tab-item>
                            </v-tabs>
                          </v-form></v-col
                        >
                      </v-row>
                    </v-container>
                  </v-card-text>

                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="close"
                      >Cancel</v-btn
                    >
                    <v-btn color="blue darken-1" text @click="save">Save</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-toolbar>
          </template>
          <template v-slot:item.actions="{ item }">
            <v-icon class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
            <v-icon
              v-if="item.data.CurrentStage < 4 && cuserRole < 2"
              @click="deleteItem(item)"
              >mdi-delete</v-icon
            >
            <v-icon v-if="cuserRole < 2" @click="stageChange(item)"
              >mdi-delta</v-icon
            >
            <v-icon @click="viewTimeline(item)">mdi-timeline</v-icon>
            <v-icon
              v-if="item.data.CurrentStage == 3 && cuserRole == 2"
              @click="viewManagementApprovals(item)"
              >mdi-account-edit</v-icon
            >
          </template>
          <template v-slot:no-data>
            <v-btn color="primary" @click="initialize">Reset</v-btn>
          </template>
          <template v-slot:item.data.CurrentStage="{ item }">
            <v-chip
              x-small
              label
              dark
              v-bind:color="item.data.CurrentStage | stageColor"
              >{{ item.data.CurrentStage | stageFilter }}</v-chip
            >
          </template>
          <template v-slot:item.data.Next_Action="{ item }">
            <v-chip
              x-small
              label
              dark
              v-bind:color="item.data.Next_Action | stageColor"
              >{{ item.data.Next_Action | stageFilter }}</v-chip
            >
          </template>
        </v-data-table>
        <v-dialog width="600" v-model="ManagementFeedbackDialog">
          <v-card>
            <v-card-title>Management Feedback</v-card-title>
            <v-card-text>
              <v-select
                v-model="approval.type"
                :items="approvalStatus"
                label="Approval"
              ></v-select>
              <v-text-field
                v-model="approval.feedback"
                label="Feedback"
              ></v-text-field>
            </v-card-text>
            <v-card-actions>
              <v-btn @click="setManagementApproval">Submit</v-btn>
              <v-btn @click="ManagementFeedbackDialog = false">Close</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <!-- timeline-->
        <v-dialog width="600" v-model="timeline">
          <v-card>
            <v-card-title>Timeline</v-card-title>
            <v-card-text>
              <v-stepper vertical value="2">
                <v-stepper-step
                  step="1"
                  complete
                  v-for="(event, i) in timelineEvents"
                  :key="i"
                  :color="event.stage | stageColor"
                >
                  {{ event.stage | stageFilter }} | Duration
                  {{ event.duration }} Days
                </v-stepper-step>
              </v-stepper>
            </v-card-text>
            <v-card-actions>
              <v-btn @click="timeline = false" outlined>Close</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <!-- Stage Edit -->
        <v-dialog v-model="stageDialog" max-width="600px">
          <v-card>
            <v-card-title>
              <h3>Stage Change | {{ stageEdit.SerialNo }}</h3>
            </v-card-title>
            <v-card-text>
              <p>
                Next Stage
                <v-chip>{{ stageEdit.Next_Action | stageFilter }}</v-chip>
              </p>
              <p>
                Target Date :
                <v-menu
                  v-model="menu4"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  transition="scale-transition"
                  offset-y
                  min-width="290px"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="stageEdit.TargetDate"
                      label="Target Date"
                      prepend-icon="mdi-calendar-range"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="stageEdit.TargetDate"
                    show-current
                    @input="menu4 = false"
                  ></v-date-picker>
                </v-menu>
              </p>
            </v-card-text>
            <v-card-actions>
              <v-btn
                @click.prevent="updateTimeline(tempItem, stageEdit.timeline)"
                >Next</v-btn
              >
              <v-btn>Drop</v-btn>
              <v-btn>Close</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <!-- End stage edit -->
        <alertmsg />
      </v-container>
    </div>
  </layout>
</template>

<script>
import layout from "@/components/layout";

import alertmsg from "@/components/alertmsg";
import firebase from "firebase";
import { db, fb } from "@/firebaseconn.js";
import { mapGetters } from "vuex";
export default {
  components: {
    alertmsg,
    layout,
  },
  data: () => ({
    menu4: false,
    uploadProgress: 0,
    uploads: [],

    ManagementFeedbackDialog: false,
    timeline: false,
    tempItem: [],

    stageDialog: false,
    approval: {
      id: null,
      type: 2,
      feedback: "",
    },
    approvalStatus: [
      { value: 1, text: "Approved" },
      { value: 0, text: "Rejected" },
    ],
    ManagementFeedbackDialog: false,
    tab: null,
    dialog: false,
    menu3: false,
    headers: [
      { text: "Serial No", value: "data.SerialNo" },
      { text: "Product Name", value: "data.Product_Name" },
      { text: "Type", value: "data.type" },
      { text: "Request Date", value: "data.RequestDate" },
      { text: "Current Stage", value: "data.CurrentStage" },
      { text: "Next Action", filterable: false, value: "data.Next_Action" },
      { text: "Target Date", value: "data.TargetDate" },
      { text: "Management Approvals", value: "data.ManagementApprovals" },
      { text: "Actions", value: "actions", sortable: false },
    ],
    editedIndex: -1,
    editedItem: {
      id: "",
      data: {
        SerialNo: null,
        Product_Name: "",
        type: "",
        RequestDate: new Date().toISOString().substr(0, 10),
        CurrentStage: 1,
        ManagementFeedback: "",
        Next_Action: 2,
        TargetDate: "",
        ManagementApprovals: "",
        Formula: "",
        Flavor: "",
        Material_Supply: "",
        description: "",
        timeline: [],
        uploads: [],
        rational: "",
      },
    },
    defaultItem: {
      id: "",
      data: {
        SerialNo: null,
        Product_Name: "",
        type: "",
        RequestDate: new Date().toISOString().substr(0, 10),
        CurrentStage: 1,
        ManagementFeedback: "",
        Next_Action: 2,
        TargetDate: "",
        ManagementApprovals: "",
        Formula: "",
        Flavor: "",
        Material_Supply: "",
        description: "",
        timeline: [],
        uploads: [],
        rational: "",
      },
    },
  }),

  computed: {
    ...mapGetters([
      "xprojects",
      "xuser",
      "xstageEdit",
      "xtimelineEvents",
      "xalert",
    ]),
    formTitle() {
      return this.editedIndex === -1 ? "New Item" : "Edit Item";
    },
    projects() {
      return this.xprojects;
    },
    cuserRole() {
      return 1;
    },
    stageEdit() {
      return this.xstageEdit;
    },
    timelineEvents() {
      return this.xtimelineEvents;
    },
    user() {
      return this.xuser;
    },

    viewAlert() {
      return this.xalert;
    },
  },
  mounted() {},
  filters: {
    durationtt: function(value) {
      return moment().duration(value.start.diff(value.end, "days", true));
    },
    getDateFromArr: function(value) {
      return value;
    },
    stageColor: function(value) {
      if (value == 1) {
        return "yellow darken-1";
      } else if (value == 2) {
        return "yellow darken-4";
      } else if (value == 3) {
        return "red";
      } else if (value == 4) {
        return "green lighten-2";
      } else if (value == 5) {
        return "blue lighten-2";
      } else if (value == 6) {
        return "purple lighten-2";
      } else if (value == 7) {
        return "grey";
      }
    },
    stageFilter: function(value) {
      if (value == 1) {
        return "IDEA GENERATION";
      } else if (value == 2) {
        return "IDEA SCREENING";
      } else if (value == 3) {
        return "PENDING APPROVAL";
      } else if (value == 4) {
        return "DEVT AND TESTING";
      } else if (value == 5) {
        return "BUSINESS ANALYSIS";
      } else if (value == 6) {
        return "EVALUATION";
      } else if (value == 7) {
        return "COMMERCIALIZATION";
      }
    },
  },
  watch: {
    dialog(val) {
      val || this.close();
    },
  },

  created() {
    this.initialize();
  },

  methods: {
    openUpload: function(url) {
      window.open(url, "_blank");
    },
    uploadFiles: function(e) {
      if (e.target.files.length > 0) {
        console.log("Huray!....");
        this.uploads = e.target.files;
        var q;
        for (q = 0; q < e.target.files.length; q++) {
          let file = e.target.files[q];
          var storageRef = fb.storage().ref("uploads/" + file.name);
          let uploadTask = storageRef.put(file);
          uploadTask.on(
            "state_changed",
            () => {
              this.uploadProgress =
                (100.0 * taskSnapshot.getBytesTransferred()) /
                taskSnapshot.getTotalByteCount();
            },
            () => {
              // Handle unsuccessful uploads
              console.log("no state change X");
            },
            () => {
              // Handle successful uploads on complete
              // For instance, get the download URL: https://firebasestorage.googleapis.com/...
              uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                console.log("File available at", downloadURL);
                let fileDetail = {
                  name: file.name,
                  url: downloadURL,
                };

                this.editedItem.data.uploads.push(fileDetail);
                console.log(this.editedItem.data.uploads);
              });
            }
          );
        }
      }
    },
    viewTimeline(item) {
      this.timeline = true;
      this.$store.dispatch("viewTimeline", item);
    },
    updateTimeline: function() {
      this.$store.dispatch("updateStage", this.stageEdit.TargetDate);
    },
    stageChange: function(item) {
      this.$store.dispatch("setStage", item);
      this.stageDialog = true;
    },
    setManagementApproval: function() {
      this.$store.dispatch("sumbitApproval", this.approval).then(() => {
        this.ManagementFeedbackDialog = false;
      });
    },
    viewManagementApprovals: function(item) {
      this.$store.dispatch("setApproval", item);
      this.ManagementFeedbackDialog = true;
    },
    fbAdd: function() {
      this.editedItem.data.timeline.push({
        date: this.editedItem.data.RequestDate,
        stage: this.editedItem.data.CurrentStage,
      });
      db.collection("ttrnd")
        .doc(this.editedItem.data.SerialNo)
        .set(this.editedItem.data)
        .then(() => {
          console.log("New project Added");
          this.initialize();

          this.close();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    fbUpdate: function() {
      db.collection("ttrnd")
        .doc(this.projects[this.editedIndex].id)
        .update(this.editedItem.data)
        .then(() => {
          this.close();
          console.log("Success");
          this.initialize();
        });
    },
    fbDelete: function(item) {
      //this.deleteData(item);
      console.log(item);
      db.collection("ttrnd")
        .doc(item)
        .delete()
        .then(() => {
          console.log("Document successfully deleted!");
          this.initialize();
        })
        .catch(function(error) {
          console.error("Error removing document: ", error);
        });
    },
    initialize() {
      this.$store.dispatch("syncData");
    },

    editItem(item) {
      this.editedIndex = this.projects.indexOf(item);
      this.editedItem = Object.assign({}, item);
      console.log(item.data.uploads);
      this.dialog = true;
    },

    deleteItem(item) {
      const index = this.projects.indexOf(item);
      confirm("Are you sure you want to delete this item?") &&
        this.fbDelete(item.id);
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    save() {
      if (this.editedIndex > -1) {
        Object.assign(this.projects[this.editedIndex], this.editedItem);
        this.fbUpdate();
      } else {
        this.fbAdd();
      }
      this.close();
    },
  },
};
</script>
<style>
.tab-item-wrapper {
  /* vuetify sets the v-tabs__container height to 48px */
  height: calc(100vh - 48px);
}
</style>
