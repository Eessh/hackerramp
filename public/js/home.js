import { initializeApp } from "https://www.gstatic.com/firebasejs/9.2.0/firebase-app.js";
import {
    getAuth,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/9.2.0/firebase-auth.js";
import { getFirestore, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/9.2.0/firebase-firestore.js";

// Firebase configuration
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
let fetchedCoins;
let coins;
let diffCoins;

onAuthStateChanged(auth, async (user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User
      const uid = user.uid;
      currentUser = user;
    }
    else {
      // User is signed out
      console.log("unable to retireve user");
    }
})();

document.querySelector(".logout").addEventListener("click", (e) => {
    e.preventDefault();
    console.log("loggin out ...")
    signOut(auth).then(() => {
        window.location.replace("../login.html");
        // Sign-out successful.
    }).catch((error) => {
        console.log("Error occured when sigining out", error);
    });
});

const form = document.getElementById("form");
form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const bill = form["bill"].value;

    const userCoinsdocRef = doc(db, "users", currentUser.email);
    const snapshot = await getDoc(userCoinsdocRef);

    if (snapshot.exists()) {
        fetchedCoins = snapshot.data().coins;

        coins = getCoins(fetchedCoins, bill).finalCoins;
        diffCoins = getCoins(fetchedCoins, bill).diff;
    }
    else {
        // doc.data() will be undefined in this case
        console.log("User has no billing done before");
        coins = getCoins({silver: 0, gold: 0, platinum: 0}, bill).finalCoins;
        diffCoins = getCoins({silver: 0, gold: 0, platinum: 0}, bill).diff;
    }

    showPopup(event);

    await updateDoc(doc(db, "users", currentUser.email), {
        coins: coins,
    });
})



const getCoins = (fetchedCoins, bill) => {
    const z = getSilverCoins(bill);
    let silver = fetchedCoins.silver;
    let gold = fetchedCoins.gold;
    let platinum = fetchedCoins.platinum;
    let diff = {
        silver: 0,
        gold: 0,
        platinum: 0
    }
    if (bill <= 499) {
        silver += z;
        diff.silver = z;
    }
    else if (500 <= bill && bill <= 1999) {
        silver += (5*z)/14;
        gold += (3*z)/14;
        diff.silver = (5*z)/14;
        diff.gold = (3*z)/14;
    }
    else if (2000 <= bill && bill <= 5999) {
        silver += (4*z)/25;
        gold += (3*z)/25;
        platinum += (2*z)/25;
        diff.silver = (4*z)/25;
        diff.gold = (3*z)/25;
        diff.platinum = (2*z)/25;
    }
    else if (6000 <= bill && bill <= 14999) {
        gold += (5*z)/33;
        platinum += (3*z)/33;
        diff.gold = (5*z)/33;
        diff.platinum = (3*z)/33;
    }
    else {
        platinum += z/6;
        diff.platinum = z/6;
    }
    return {
        finalCoins: {
            silver: Math.floor(silver),
            gold: Math.floor(gold),
            platinum: Math.floor(platinum)
        },
        diff: {
            silver: Math.floor(diff.silver),
            gold: Math.floor(diff.gold),
            platinum: Math.floor(diff.platinum)
        }
    };
}


const getSilverCoins = (bill) => {
    let z = 0
    if (100 <= bill && bill < 500) {
        z = bill/10
    }
    else if (500 <= bill && bill < 2000) {
        z = bill/10 + (bill-500)/20;
    }
    else if (2000 <= bill && bill < 6000) {
        z = bill/10 + (bill-500)/35 + (bill-2000)/30;
    }
    else if (6000 <= bill && bill < 15000) {
        z = bill/10 + (bill-500)/35 + (bill-2000)/30 + (bill-6000)/25;
    }
    else if (15000 <= bill) {
        z = bill/10 + (bill-500)/35 + (bill-2000)/30 + (bill-6000)/25 + (bill-15000)/20;
    }
    return Math.floor(z);
}

const popupBackground = document.querySelector(".popup-background");
const popup = document.querySelector(".popup");
const popupClose = document.querySelector(".popup-close");
popupClose.addEventListener("click", (e) => hidePopup(e));
const showPopup = (e) => {
    e.preventDefault();
    popupBackground.classList.replace("popup-hide", "popup-show");
    popup.classList.replace("popup-hide", "popup-show");
    document.getElementById("silver-coins").innerHTML = diffCoins.silver;
    document.getElementById("gold-coins").innerHTML = diffCoins.gold;
    document.getElementById("platinum-coins").innerHTML = diffCoins.platinum;
};
const hidePopup = async (e) => {
    e.preventDefault();
    popup.classList.replace("popup-show", "popup-hide");
    popupBackground.classList.replace("popup-show", "popup-hide");
    window.location.replace("../dashboard.html")
};
