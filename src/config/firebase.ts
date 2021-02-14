import firebase from "firebase";
import "firebase/analytics";
import "firebase/storage";
import config from "./config";

export const firebaseConfig = {
	apiKey: config.firebaseApiKey,
	authDomain: config.firebaseAuthDomain,
	databaseURL: config.firebaseDatabaseURL,
	projectId: config.firebaseProjectId,
	storageBucket: config.firebaseStorageBucket,
	messagingSenderId: config.firebaseMessagingSenderId,
	appId: config.firebaseAppId,
	measurementId: config.firebaseMeasurementId,
};

console.log("@Reached FirebaseConfig");
console.log(firebaseConfig);
if (!firebase.apps.length) {
	firebase.initializeApp(firebaseConfig);
}

const app = firebase.app();
const auth = firebase.auth();
const now = firebase.firestore.Timestamp.now();
const storage = firebase.storage();
const analytics = firebase.analytics;

const firestore = firebase.firestore();
const db = {
	folders: firestore.collection("folders"),
	files: firestore.collection("files"),
};

export { app, auth, db, now, storage, analytics };
