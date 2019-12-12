import firebase from 'firebase/app';

import "firebase/auth";

const config = {
    apiKey: "AIzaSyB_VXzsCizAeODL1o--Vw3FSwFR4zztlAc",
    authDomain: "superheroes-local.firebaseapp.com",
    databaseURL: "https://superheroes-local.firebaseio.com",
    projectId: "superheroes-local",
    storageBucket: "superheroes-local.appspot.com",
    messagingSenderId: "1018681143157",
    appId: "1:1018681143157:web:d65cadd54365f158972d3c"
};

// Initialize Firebase
export const firebaseApp = firebase.initializeApp(config);
// export const db = firebaseApp.firestore();
export const auth = firebase.auth();
export const authStatic = firebase.auth;
// export const storage = firebase.storage();