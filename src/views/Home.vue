<template>
  <layout>
    <div slot="body" class="mx-12">
      <v-row fill-height>
        <v-flex row wrap>
          <v-col cols="3">
            <v-card flat max-width="300">
              <v-list dense class="text-left">
                <h3>Projects</h3>
                <v-list-item-group v-model="item" color="primary">
                  <v-list-item
                    @click="selectProject(item.id)"
                    v-for="(item, i) in projects"
                    :key="i"
                  >
                    <v-list-item-content>
                      <v-list-item-title>{{
                        item.data.Product_Name
                      }}</v-list-item-title>
                    </v-list-item-content>
                    <v-list-item-content class="align-end">
                      <v-chip
                        dark
                        :color="item.data.CurrentStage | stageColor"
                        x-small
                        class="mx-auto"
                        >{{ item.data.CurrentStage | stageFilter }}</v-chip
                      >
                    </v-list-item-content>
                  </v-list-item>
                </v-list-item-group>
              </v-list>
            </v-card>
          </v-col>
          <v-divider vertical></v-divider>
          <v-col cols="8.5">
            <v-row no-gutters justify="space-around">
              <v-col cols="12">
                <v-card flat outlined>
                  <v-card-text>
                    <v-row>
                      <v-col class="text-left" cols="5">
                        <table>
                          <tr>
                            <td>Serial No</td>
                            <td>
                              <h4>{{ selected.data.SerialNo }}</h4>
                            </td>
                          </tr>
                          <tr>
                            <td>Product Name</td>
                            <td>
                              <h4>{{ selected.data.Product_Name }}</h4>
                            </td>
                          </tr>
                          <tr>
                            <td>Request Date</td>
                            <td>
                              <h4>{{ selected.data.RequestDate }}</h4>
                            </td>
                          </tr>
                          <tr>
                            <td>Current Stage</td>
                            <td>
                              <v-chip
                                x-small
                                label
                                dark
                                v-bind:color="
                                  selected.data.CurrentStage | stageColor
                                "
                                >{{
                                  selected.data.CurrentStage | stageFilter
                                }}</v-chip
                              >
                            </td>
                          </tr>
                        </table>
                      </v-col>
                      <v-col class="text-left" cols="4.5">
                        <table>
                          <tr>
                            <td>Approval Status</td>
                            <td>
                              <v-chip small label class="info">{{
                                selected.data.ManagementApprovals
                                  | approvalFilter
                              }}</v-chip>
                            </td>
                          </tr>
                          <tr>
                            <td>Next Action</td>
                            <td>
                              <v-chip
                                dark
                                x-small
                                label
                                v-bind:color="
                                  selected.data.Next_Action | stageColor
                                "
                                >{{
                                  selected.data.Next_Action | stageFilter
                                }}</v-chip
                              >
                            </td>
                          </tr>
                          <tr>
                            <td>TargetDate</td>
                            <td>{{ selected.data.TargetDate }}</td>
                          </tr>
                          <tr>
                            <v-btn
                              v-if="selected.data.CurrentStage == 3"
                              @click="ManagementFeedbackDialog = true"
                              small
                              class="success mt-4"
                              >Approval</v-btn
                            >
                            <v-btn
                              v-if="selected.data.CurrentStage < 7"
                              @click="setStage(selected)"
                              small
                              class="success mt-4"
                              >Stage Upgrade</v-btn
                            >
                          </tr>
                        </table>
                      </v-col>
                      <v-col cols="2">
                        <h3>Duration</h3>
                        <h2>
                          <v-chip>
                            {{ totalDuration }}
                            <v-divider vertical class="mx-2"></v-divider>
                            <span v-if="totalDuration < 2">Day</span>
                            <span v-if="totalDuration > 2">Days</span>
                          </v-chip>
                        </h2>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
            <v-row justify="space-around">
              <v-flex row wrap>
                <v-col cols="6">
                  <v-card flat outlined>
                    <v-card-title>Product Details</v-card-title>
                    <v-card-text>
                      <v-row class="text-left" tag="v-card-text">
                        <v-flex row wrap>
                          <v-row>
                            <v-col class="text-left" cols="12">
                              <h4>Formula</h4>
                              <p>{{ selected.data.Formula }}</p>
                              <h4>Flavor</h4>
                              <p>{{ selected.data.Flavor }}</p>
                              <h4>Material Supply</h4>
                              <p>{{ selected.data.Material_Supply }}</p>
                              <h4>Description</h4>
                              <p>{{ selected.data.description }}</p>
                              <h4>Rational</h4>
                              <p>{{ selected.data.rational }}</p>
                            </v-col>
                          </v-row>
                        </v-flex>
                      </v-row>
                    </v-card-text>
                  </v-card>
                </v-col>
                <v-col cols="6">
                  <v-card flat outlined>
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
                  </v-card>
                </v-col>
                <v-col md="6" offset-md="6">
                  <v-card flat outlined>
                    <v-card-title>Attachments</v-card-title>
                    <v-card-text>
                      <v-list>
                        <v-list-item
                          v-for="(file, i) in selected.data.uploads"
                          :key="i"
                        >
                          <a :href="file.url">
                            <v-chip small label>{{ file.name }}</v-chip>
                          </a>
                        </v-list-item>
                      </v-list>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-flex>
            </v-row>
          </v-col>
        </v-flex>
      </v-row>
      <v-dialog width="600" v-model="stageUpdateDialog">
        <v-card>
          <v-card-title>Stage Update</v-card-title>
          <v-card-text>
            <table>
              <tr>
                <td>
                  <h3>Next Action</h3>
                </td>
                <td class="mx-12">
                  <v-chip
                    :color="(selected.data.CurrentStage + 2) | stageColor"
                    >{{
                      (selected.data.CurrentStage + 2) | stageFilter
                    }}</v-chip
                  >
                </td>
                <td>
                  <v-btn @click="dropRnd">Drop</v-btn>
                </td>
              </tr>
              <tr>
                <td>*Target Date</td>
                <td class="ml-4">
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
                        v-model="stageUpdateTargetDate"
                        label="Target Date"
                        prepend-icon="mdi-calendar-range"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="stageUpdateTargetDate"
                      show-current
                      @input="menu4 = false"
                    ></v-date-picker>
                  </v-menu>
                </td>
              </tr>
              <tr>
                <td>
                  <v-btn
                    v-if="stageUpdateTargetDate != 0"
                    @click="updateStage(stageUpdateTargetDate)"
                    >Update</v-btn
                  >
                </td>
                <td>
                  <v-btn @click="stageUpdateDialog = false">
                    Close
                  </v-btn>
                </td>
              </tr>
            </table>
          </v-card-text>
        </v-card>
      </v-dialog>
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
    </div>
  </layout>
</template>
<script>
import layout from "@/components/layout";
import moment from "moment";

import { mapGetters } from "vuex";
export default {
  components: {
    layout,
  },
  data: () => ({
    item: 1,
    stageUpdateDialog: false,
    menu4: false,
    stageUpdateTargetDate: 0,
    ManagementFeedbackDialog: false,
    selectId: 0,

    approvalStatus: [
      { value: 1, text: "Approved" },
      { value: 0, text: "Rejected" },
    ],
  }),
  filters: {
    stageColor: function(value) {
      if (value == 1) {
        return "yellow darken-1";
      } else if (value == 2) {
        return "yellow darken-4";
      } else if (value == 3) {
        return "red";
      } else if (value == 4) {
        return "green";
      } else if (value == 5) {
        return "blue";
      } else if (value == 6) {
        return "purple";
      } else if (value == 7) {
        return "grey";
      } else if (value < 1) {
        return "black";
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
      } else if (value < 1) {
        return "DROPED";
      }
    },
    approvalFilter: function(value) {
      if (value == 1) {
        return "Approved";
      } else if (value == 0) {
        return "Rejected";
      } else {
        return "Pending";
      }
    },
  },

  created() {
    console.log(this.projects);
  },
  beforeMount() {
    this.$store.dispatch("syncData");
  },
  mounted() {},
  computed: {
    ...mapGetters(["xprojects", "xtimelineEvents", "xtotalDuration"]),
    approval() {
      return {
        id: this.selectId,
        type: null,
        feedback: null,
      };
    },
    projects() {
      return this.xprojects;
    },
    timelineEvents() {
      return this.xtimelineEvents;
    },
    selected() {
      if (this.selectId == 0) {
        return this.projects[0];
      } else {
        const id = this.selectId;
        return this.projects.find((project) => project.id === id);
      }
    },
    totalDuration() {
      return this.xtotalDuration;
    },
    /*
    age() {
      if (this.selected) {
        var item = this.selected;
        var l = item.data.timeline.length;
        var dateStart = moment(item.data.timeline[x].date);
        var dateEnd = moment(item.data.timeline[l - 1].date);
        var drtn = dateEnd.diff(dateStart, "days");
        return this.drtn;
      } else {
        return 0;
      }
    },*/
  },
  methods: {
    setManagementApproval: function() {
      this.$store.dispatch("sumbitApproval", this.approval);
      this.ManagementFeedbackDialog = false;
    },
    selectProject(id) {
      this.stageUpdateTargetDate = "";
      console.log(id);
      this.selectId = id;
      this.$store.dispatch("viewTimeline", this.selectId);
    },
    dropRnd() {
      confirm("Are you sure you want to drop this item?") &&
        this.$store.dispatch("projectDrop", this.selectId);
    },
    setStage(item) {
      this.stageUpdateDialog = true;
      this.$store.dispatch("setStage", item);
    },
    updateStage(date) {
      confirm("Are you sure you want to update stage of this project ?") &&
        this.$store.dispatch("updateStage", date);
      this.stageUpdateDialog = false;
      this.stageUpdateTargetDate = 0;
    },
  },
};
</script>
