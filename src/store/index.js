import Vue from "vue";
import Vuex from "vuex";
import { db } from "@/firebaseconn.js";
import firebase from "firebase";
import moment from "moment";
import router from "@/router";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isAuthenticated: true,
    alertmsg: {
      snackbar: false,
      data: {},
    },
    projects: [],
    user: {
      email: null,
      role: null,
    },
    approvalItem: {},
    stageEdit: {},
    timelineEvents: [],
    totalDuration: 0,
  },
  getters: {
    xprojects(state) {
      return state.projects;
    },
    xuser(state) {
      return state.user;
    },
    xstageEdit(state) {
      return state.stageEdit;
    },
    xtimelineEvents(state) {
      return state.timelineEvents;
    },
    xalert(state) {
      return state.alertmsg;
    },
    xauth(state) {
      return state.isAuthenticated;
    },
    xtotalDuration(state) {
      return state.totalDuration;
    },
  },
  mutations: {
    SET_STAGE(state, item) {
      state.stageEdit.id = item.id;
      state.stageEdit.SerialNo = item.data.SerialNo;
      state.stageEdit.Product_Name = item.data.Product_Name;
      state.stageEdit.CurrentStage = item.data.CurrentStage + 1;
      state.stageEdit.Next_Action = item.data.CurrentStage + 2;
    },
    SET_APPROVALITEM(state, item) {
      state.approvalItem = item;
    },
    SET_PROJECTS(state, data) {
      state.projects = data;
      console.log(state.projects);
    },
    SET_USER(state, data) {
      state.user.email = data.email;
      state.user.role = data.role;
      state.isAuthenticated = true;
    },
    SIGN_OUT(state) {
      state.isAuthenticated = false;
    },
    SET_TIMELINE(state, data) {
      state.timelineEvents.push(data);
    },
    CLEAR_TIMELINE(state) {
      state.timelineEvents = [];
    },
    SET_ALERT_MSG(state, data) {
      state.alertmsg.snackbar = true;
      state.alertmsg.data = data;
    },
    SET_TOTAL_DURATION(state, data) {
      state.totalDuration = data;
    },
  },
  actions: {
    viewAlert({ commit }, msg) {
      commit("SET_ALERT_MSG", msg);
    },
    syncData({ commit }) {
      var tempProjects = [];
      db.collection("ttrnd")
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            var project = {
              id: doc.id,
              name: doc.data().Product_Name,
              data: {
                SerialNo: doc.data().SerialNo,
                Product_Name: doc.data().Product_Name,
                type: doc.data().type,
                RequestDate: doc.data().RequestDate,
                CurrentStage: doc.data().CurrentStage,
                ManagementFeedback: doc.data().ManagementFeedback,
                Next_Action: doc.data().Next_Action,
                TargetDate: doc.data().TargetDate,
                ManagementApprovals: doc.data().ManagementApprovals,
                Formula: doc.data().Formula,
                Flavor: doc.data().Flavor,
                Material_Supply: doc.data().Material_Supply,
                description: doc.data().description,
                timeline: doc.data().timeline,
                uploads: doc.data().uploads,
                rational: doc.data().rational,
              },
            };
            tempProjects.push(project);
          });
        })
        .then(() => {
          commit("SET_PROJECTS", tempProjects);
          let data = { msgtext: "Data Synced", type: "success" };
          commit("SET_ALERT_MSG", data);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    fetchUser({ commit }, user) {
      console.log(user);
      commit("SET_USER", user);
      let data = { msgtext: user.email, type: "success" };
      commit("SET_ALERT_MSG", data);
    },
    signOut({ commit }) {
      firebase
        .auth()
        .signOut()
        .then(() => {
          console.log("done");
          commit("SIGN_OUT");

          router.replace({ name: "Login" });
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    setApproval({ commit }, item) {
      commit("SET_APPROVALITEM", item);
      console.log("vuex run");
      console.log(item);
    },
    sumbitApproval({}, data) {
      db.collection("ttrnd")
        .doc(data.id)
        .update({
          CurrentStage: 4,
        })
        .then(() => {
          this.dispatch("syncData");

          console.log("Done and dusted");
        });
      db.collection("ttrnd")
        .doc(data.id)
        .update({
          ManagementApprovals: data.type,
          ManagementFeedback: data.feedback,
        })
        .then((ctx) => {
          console.log(ctx);
          let data = { msgtext: "Submit Approval", type: "success" };
          commit("SET_ALERT_MSG", data);
        });
    },
    setStage({ commit }, data) {
      commit("SET_STAGE", data);
      console.log(data);
    },
    updateStage({ state, commit }, date) {
      console.log(state.stageEdit);
      db.collection("ttrnd")
        .doc(state.stageEdit.id)
        .update({
          timeline: firebase.firestore.FieldValue.arrayUnion({
            startedAt: new Date(),
            stage: state.stageEdit.CurrentStage,
          }),
          CurrentStage: state.stageEdit.CurrentStage,
          Next_Action: state.stageEdit.Next_Action,
          TargetDate: date,
        })
        .then(() => {
          let data = { msgtext: "State Changed", type: "success" };
          commit("SET_ALERT_MSG", data);
          this.dispatch("syncData");
          console.log("Success timeline");
        });
    },
    viewTimeline({ commit, state }, id) {
      let item = state.projects.find((project) => project.id === id);
      let strDate = moment(new Date().now);
      let totalD = strDate.diff(moment(item.data.RequestDate), "days");
      console.log(totalD);
      commit("SET_TOTAL_DURATION", totalD);
      var x;
      commit("CLEAR_TIMELINE");
      for (x = 0; x < item.data.timeline.length - 1; x++) {
        if (item.data.timeline.length > 1) {
          var dateStart = moment(item.data.timeline[x].date);
          var dateEnd = moment(item.data.timeline[x + 1].date);
          var drtn = dateEnd.diff(dateStart, "days");

          var timelineDetail = {
            start: item.data.timeline[x].date,
            end: item.data.timeline[x + 1].date,
            stage: item.data.timeline[x].stage,
            duration: drtn,
          };
          commit("SET_TIMELINE", timelineDetail);
          let data = { msgtext: "Timeline", type: "success" };

          commit("SET_ALERT_MSG", data);
        } else {
          var timelineDetail2 = {
            start: item.data.timeline[x].date,
            end: item.data.timeline[x].date,
            stage: item.data.timeline[x].stage,
          };

          commit("SET_TIMELINE", timelineDetail2);
          let data = { msgtext: "Timeline", type: "success" };
          commit("SET_ALERT_MSG", data);
        }
      }
    },
    projectDrop({}, id) {
      db.collection("ttrnd")
        .doc(id)
        .update({ CurrentStage: -1, Next_Action: -1 })
        .then(() => {
          console.log("Drop That Project");
        });
    },
  },
  modules: {},
});
