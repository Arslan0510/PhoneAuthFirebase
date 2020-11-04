import * as firebase from "firebase";
import "@firebase/auth";

var FIREBASE_CONFIG = {
  apiKey: "AIzaSyDKRQLTcnoIsCLINWxZPijHVkmSveYMV9A",
  authDomain: "moviemood-6c59f.firebaseapp.com",
  databaseURL: "https://moviemood-6c59f.firebaseio.com",
  projectId: "moviemood-6c59f",
  storageBucket: "moviemood-6c59f.appspot.com",
  messagingSenderId: "697965888360",
  appId: "1:697965888360:web:5b199d71fb299981394cdd",
  measurementId: "G-86EPW9GJJY",
};
if (!firebase.apps.length) {
  firebase.initializeApp(FIREBASE_CONFIG);
}

export default FIREBASE_CONFIG;
