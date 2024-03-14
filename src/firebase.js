// For Firebase JS SDK v7.20.0 and later, measurementId is optional
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getDownloadURL, getStorage, ref } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCM66wa4V4qbWBj4GUW9YTUf430SrcgKWE",
  authDomain: "lo3re-ee26a.firebaseapp.com",
  databaseURL: "https://lo3re-ee26a-default-rtdb.firebaseio.com",
  projectId: "lo3re-ee26a",
  storageBucket: "lo3re-ee26a.appspot.com",
  messagingSenderId: "727548649256",
  appId: "1:727548649256:web:80d623de58a9dad19d7a1d",
  measurementId: "G-85PEE9Q2YB",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const imageDb = getStorage(app);

export const getImage = async (location) => {
  const imgUrl = await getDownloadURL(ref(imageDb, location));
  return imgUrl;
};

// Initialize Firebase Authentication and get a reference to the service
