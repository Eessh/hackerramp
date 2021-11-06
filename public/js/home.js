import { initializeApp } from "https://www.gstatic.com/firebasejs/9.2.0/firebase-app.js";
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/9.2.0/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc, updateDoc, collection, addDoc } from "https://www.gstatic.com/firebasejs/9.2.0/firebase-firestore.js";


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
      const uid = user.uid;
      console.log("user: ", user);
      console.log("email: ", user.email);
      currentUser = user;

      const userGenderdocRef = doc(db, "gender", user.email);
      const sanpshot = await getDoc(userGenderdocRef);

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

document.querySelector(".logout").addEventListener("click", (e) => {
    e.preventDefault();
    console.log("loggin out ...")
    signOut(auth).then(() => {
        window.location.replace("../login.html");
        console.log("done");
        // Sign-out successful.
    }).catch((error) => {
        // An error happened.
        console.log("Error occured when sigining out");
    });
});

const form = document.getElementById("form");
form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const bill = form["bill"].value;
    console.log("bill", bill);

    let fetchedCoins;
    let coins;

    const userCoinsdocRef = doc(db, "users", currentUser.email);
    const snapshot = await getDoc(userCoinsdocRef);

    if (snapshot.exists()) {
        console.log("Document data:", snapshot.data());
        fetchedCoins = snapshot.data().coins;

        coins = getCoins(fetchedCoins, bill);

    }
    else {
        // doc.data() will be undefined in this case
        console.log("User has no billing done before");
        coins = getCoins({silver: 0, gold: 0, platinum: 0}, bill);
    }

    // document.getElementById("silver-coins").innerHTML = coins.silver;
    // document.getElementById("gold-coins").innerHTML = coins.gold;
    // document.getElementById("platinum-coins").innerHTML = coins.platinum;

    await updateDoc(doc(db, "users", currentUser.email), {
        coins: coins,
    })

    console.log("done");
    window.location.replace("../dashboard.html")

    // window.location.replace("../dashboard.html");
    // window.location.replace("../home.html");
})



const getCoins = (fetchedCoins, bill) => {
    const z = getSilverCoins(bill);
    let silver = fetchedCoins.silver;
    let gold = fetchedCoins.gold;
    let platinum = fetchedCoins.platinum;
    if (bill <= 499) {
        silver += z;
    }
    else if (500 <= bill && bill <= 1999) {
        silver += (5*z)/14;
        gold += (3*z)/14;
    }
    else if (2000 <= bill && bill <= 5999) {
        silver += (4*z)/25;
        gold += (3*z)/25;
        platinum += (2*z)/25;
    }
    else if (6000 <= bill && bill <= 14999) {
        gold += (5*z)/33;
        platinum += (3*z)/33;
    }
    else {
        platinum += z/6;
    }
    return {
        silver: Math.floor(silver), 
        gold: Math.floor(gold), 
        platinum: Math.floor(platinum)
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
    else {
        z = bill/10 + (bill-500)/35 + (bill-2000)/30 + (bill-6000)/25 + (bill-15000)/20;
    }
    return Math.floor(z);
}