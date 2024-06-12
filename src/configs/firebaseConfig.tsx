// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { getDatabase } from "firebase/database";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDnKtDnrupvmvKnRhmiIANKNX5wfxoEi4Q",
  authDomain: "mensajeria-movil.firebaseapp.com",
  projectId: "mensajeria-movil",
  storageBucket: "mensajeria-movil.appspot.com",
  messagingSenderId: "329835340311",
  appId: "1:329835340311:web:4cc67a93b500d8c3493252",
  databaseURL: "https://mensajeria-movil-default-rtdb.firebaseio.com/"
};

// Initialize Firebase
const firebase = initializeApp(firebaseConfig);
//Constante para obtener servicio de autenticación
//export const auth = getAuth(firebase);
export const auth = initializeAuth(firebase, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

// Initialize Realtime Database and get a reference to the service
export const dbRealTime = getDatabase(firebase);
