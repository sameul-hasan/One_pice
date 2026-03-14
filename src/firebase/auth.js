import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "./firebaseConfig";
import { createUserProfile } from "./firestore";

export const registerUser = async (email, password, displayName) => {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  await createUserProfile(cred.user.uid, {
    name: displayName,
    email,
    role: "user",
    currentIsland: 1,
    points: 0,
    crewMembers: [],
    completedIslands: [],
    badges: [],
    missions: [],
  });
  return cred.user;
};

export const loginUser = (email, password) =>
  signInWithEmailAndPassword(auth, email, password);

export const logoutUser = () => signOut(auth);

export const onAuth = (cb) => onAuthStateChanged(auth, cb);
