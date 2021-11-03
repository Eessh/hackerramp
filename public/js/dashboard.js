import { initializeApp } from "https://www.gstatic.com/firebasejs/9.2.0/firebase-app.js";
import {
    getAuth,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/9.2.0/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/9.2.0/firebase-firestore.js"

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCvoDiUSNynP1odAewxDf9n3EKhWjhgmFQ",
    authDomain: "hackerramp-5a473.firebaseapp.com",
    projectId: "hackerramp-5a473",
    storageBucket: "hackerramp-5a473.appspot.com",
    messagingSenderId: "112582439018",
    appId: "1:112582439018:web:7c6e421a375ec97b981a13"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();
let currentUser;

onAuthStateChanged(auth, async (user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User
    //   const uid = user.uid;
      console.log("user: ", user);
      console.log("email: ", user.email);
      currentUser = user;

      const userGenderdocRef = doc(db, "gender", user.email);
      const sanpshot = await getDoc(userGenderdocRef);

      const fetchedCoins = await fetchCoins();
      setCoins(fetchedCoins);

      if (sanpshot.exists()) {
        console.log("Document data:", sanpshot.data());
      }
      else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
      // ...
    } else {
      // User is signed out
      // ...
      console.log("unable to retireve user");
    }
})();

const setCoins = (coins) => {
    document.getElementById("silver-coins").innerHTML = coins.silver;
    document.getElementById("gold-coins").innerHTML = coins.gold;
    document.getElementById("platinum-coins").innerHTML = coins.platinum;
}

async function fetchCoins() {
    console.log("currentUser: ", currentUser)
    const userCoinsdocRef = doc(db, "users", currentUser.email);
    const snapshot = await getDoc(userCoinsdocRef);

    if (snapshot.exists()) {
        console.log(snapshot.data().coins)
        return snapshot.data().coins
    }
    else {
        console.log("User has not done any billing yet!");
        return null;
    }
};

const convertCoins = (initCoins, from, to) => {
    if (from === "platinum") {
        if (to === "gold") {
            initCoins.gold += Math.floor(initCoins.platinum*1.5)
            initCoins.platinum = 0;
        }
        else {
            initCoins.silver += Math.floor(initCoins.platinum*4)
            initCoins.platinum = 0;
        }
    }
    else {
        initCoins.silver += initCoins.gold*2
        initCoins.gold = 0;
    }
    return initCoins;
}