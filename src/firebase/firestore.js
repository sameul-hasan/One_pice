import {
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  collection,
  query,
  where,
  orderBy,
  limit,
  arrayUnion,
  increment,
  addDoc,
} from "firebase/firestore";
import { db } from "./firebaseConfig";

/* ── Users ── */
export const createUserProfile = (uid, data) =>
  setDoc(doc(db, "users", uid), { ...data, createdAt: Date.now() });

export const getUserProfile = async (uid) => {
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
};

export const updateUserProfile = (uid, data) =>
  updateDoc(doc(db, "users", uid), data);

export const addCrewMember = (uid, member) =>
  updateDoc(doc(db, "users", uid), { crewMembers: arrayUnion(member) });

export const completeIsland = (uid, islandId, bonusPoints = 0) =>
  updateDoc(doc(db, "users", uid), {
    completedIslands: arrayUnion(islandId),
    points: increment(bonusPoints),
    currentIsland: increment(1),
  });

export const addBounty = (uid, amount) =>
  updateDoc(doc(db, "users", uid), { points: increment(amount) });

export const addBadge = (uid, badge) =>
  updateDoc(doc(db, "users", uid), { badges: arrayUnion(badge) });

/* ── Leaderboard ── */
export const getLeaderboard = async (max = 10) => {
  const q = query(
    collection(db, "users"),
    orderBy("points", "desc"),
    limit(max)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

/* ── Islands ── */
export const getIslands = async () => {
  const snap = await getDocs(collection(db, "islands"));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const seedIslands = async () => {
  const islands = [
    { id: "1", name: "Foosha Village", topic: "HTML Basics", difficulty: "Easy", order: 1, crewReward: "Luffy" },
    { id: "2", name: "Baratie", topic: "CSS Styling", difficulty: "Easy", order: 2, crewReward: "Zoro" },
    { id: "3", name: "Skypiea", topic: "JavaScript Basics", difficulty: "Medium", order: 3, crewReward: "Nami" },
    { id: "4", name: "Water 7", topic: "DOM Manipulation", difficulty: "Medium", order: 4, crewReward: "Usopp" },
    { id: "5", name: "Fishman Island", topic: "API Fetching", difficulty: "Hard", order: 5, crewReward: "Sanji" },
    { id: "6", name: "Sabaody Archipelago", topic: "Debugging", difficulty: "Hard", order: 6, crewReward: "Robin" },
    { id: "7", name: "Laugh Tale", topic: "Final Project", difficulty: "Legendary", order: 7, crewReward: "One Piece" },
  ];
  for (const island of islands) {
    await setDoc(doc(db, "islands", island.id), island);
  }
};

/* ── Challenges ── */
export const getChallenges = async (islandId) => {
  const q = islandId
    ? query(collection(db, "challenges"), where("islandId", "==", islandId))
    : query(collection(db, "challenges"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const getChallenge = async (id) => {
  const snap = await getDoc(doc(db, "challenges", id));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
};

export const createChallenge = (data) =>
  addDoc(collection(db, "challenges"), data);

export const updateChallenge = (id, data) =>
  updateDoc(doc(db, "challenges", id), data);

export const deleteChallenge = (id) =>
  deleteDoc(doc(db, "challenges", id));

export const seedChallenges = async () => {
  const challenges = [
    { islandId: "1", title: "Responsive Navbar", description: "Create a responsive navigation bar using only HTML.", difficulty: "Easy", points: 100, starterCode: "<!-- Create a nav with 5 links -->\n<nav>\n  \n</nav>", hint: "Use <ul> and <li> inside <nav>" },
    { islandId: "1", title: "Semantic Page", description: "Build a page using semantic HTML elements: header, main, section, article, footer.", difficulty: "Easy", points: 80, starterCode: "<!-- Use semantic elements -->\n", hint: "Think about page structure" },
    { islandId: "2", title: "Styled Card", description: "Build a styled card component with shadow, border-radius, and hover effect.", difficulty: "Easy", points: 120, starterCode: ".card {\n  \n}", hint: "Use box-shadow and transition" },
    { islandId: "2", title: "Flexbox Layout", description: "Create a 3-column layout using CSS Flexbox.", difficulty: "Easy", points: 100, starterCode: ".container {\n  \n}", hint: "display: flex with flex: 1 on children" },
    { islandId: "3", title: "Click Counter", description: "Create a button click counter that tracks and displays the number of clicks.", difficulty: "Medium", points: 150, starterCode: "let count = 0;\n// Add click logic", hint: "addEventListener + textContent" },
    { islandId: "3", title: "Array Pirates", description: "Write functions to add, remove, and list pirate crew members from an array.", difficulty: "Medium", points: 130, starterCode: "const crew = [];\n// addMember, removeMember, listCrew", hint: "push, splice, forEach" },
    { islandId: "4", title: "Dynamic Todo List", description: "Build a dynamic to-do list that adds, checks off, and removes tasks.", difficulty: "Medium", points: 200, starterCode: "// DOM todo list\n", hint: "createElement, appendChild, remove()" },
    { islandId: "4", title: "DOM Treasure Hunt", description: "Manipulate DOM elements to reveal hidden treasure by toggling classes.", difficulty: "Medium", points: 180, starterCode: "// Toggle .hidden class on elements\n", hint: "classList.toggle" },
    { islandId: "5", title: "Pirate API", description: "Fetch pirate data from a public API and display it on the page.", difficulty: "Hard", points: 250, starterCode: "// Use fetch() to get data\n", hint: "fetch().then().then()" },
    { islandId: "5", title: "Async Treasure", description: "Use async/await to fetch and display treasure data from an API.", difficulty: "Hard", points: 230, starterCode: "async function getTreasure() {\n  \n}", hint: "try/catch with await fetch" },
    { islandId: "6", title: "Bug Squasher", description: "Find and fix 5 bugs in the provided JavaScript code.", difficulty: "Hard", points: 300, starterCode: "// Fix the bugs below\nfunction greet(name) {\n  console.log('Hello ' + nme);\n}\nconst nums = [1,2,3];\nconsole.log(nums[3].toString());", hint: "Check variable names and array bounds" },
    { islandId: "7", title: "Pirate Portfolio", description: "Build a complete responsive portfolio website as your final project.", difficulty: "Legendary", points: 500, starterCode: "<!-- Build your pirate portfolio -->\n", hint: "Combine everything you've learned!" },
  ];
  for (const c of challenges) {
    await addDoc(collection(db, "challenges"), c);
  }
};

/* ── Missions ── */
export const getMissions = async () => {
  const snap = await getDocs(collection(db, "missions"));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const seedMissions = async () => {
  const missions = [
    { title: "CSS Hover Button", type: "daily", description: "Build a button with a creative CSS hover effect.", points: 50 },
    { title: "Dark Mode Toggle", type: "daily", description: "Add a dark/light mode toggle to any page.", points: 60 },
    { title: "Responsive Layout", type: "weekly", description: "Create a fully responsive 3-section landing page.", points: 200 },
    { title: "API Dashboard", type: "weekly", description: "Build a dashboard that fetches and displays data from 2 APIs.", points: 250 },
  ];
  for (const m of missions) {
    await addDoc(collection(db, "missions"), m);
  }
};
