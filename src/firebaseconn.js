import * as firebase from "firebase/app";
import "firebase/firestore";
import "firebase/firebase-auth";

const config = {
  apiKey: "AIzaSyAMohdy_2NJ27eTbJn9HQJg5k7G72T-I4g",
  authDomain: "ttrnd-fe30e.firebaseapp.com",
  databaseURL: "https://ttrnd-fe30e.firebaseio.com",
  projectId: "ttrnd-fe30e",
  storageBucket: "ttrnd-fe30e.appspot.com",
  messagingSenderId: "266191872469",
  appId: "1:266191872469:web:1aaa0f6f90110299195d5c",
  measurementId: "G-1X2Q22LWCK",
};

const fb = firebase.initializeApp(config);
const db = firebase.firestore();
export { db, fb };
