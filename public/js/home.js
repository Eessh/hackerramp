import { initializeApp } from "https://www.gstatic.com/firebasejs/9.2.0/firebase-app.js";
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/9.2.0/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc, collection, addDoc } from "https://www.gstatic.com/firebasejs/9.2.0/firebase-firestore.js";


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

const getCurrentUser = () => {
    const user = auth.currentUser;
    if (user) {
        console.log(auth.currentUser);
    }
    else {
        console.log("not user detected !!!");
    }
}

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

const form = document.getElementById("form");
form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const bill = form["bill"].value;
    console.log("bill", bill);

    // const coins = {
    //     silver: 0,
    //     gold: 0,
    //     platinum: 0
    // }
    let fetchedCoins;
    let coins;

    const userCoinsdocRef = doc(db, "users", currentUser.email);
    const snapshot = await getDoc(userCoinsdocRef);

    if (snapshot.exists()) {
        console.log("Document data:", snapshot.data());
        fetchedCoins = snapshot.data().coins;

        coins = getCoins(fetchedCoins, bill);

        // fetchedCoins = {
        //     silver: 100,
        //     gold: 70,
        //     platinum: 30
        // }

        // coins.silver += fetchedCoins.silver != NaN ? fetchedCoins.silver : 0;
        // coins.gold += fetchedCoins.gold != NaN ? fetchedCoins.gold : 0;
        // coins.platinum += fetchedCoins.platinum != NaN ? fetchedCoins.platinum : 0;
        // console.log("coins: ", coins);
        // console.log("fetchedCoins: ", fetchedCoins);

    }
    else {
        // doc.data() will be undefined in this case
        console.log("User has no billing done before");
        coins = getCoins({silver: 0, gold: 0, platinum: 0}, bill);
    }


    // if (100 <= bill && bill < 500) {
    //     fetchedCoins.silver += bill/10;
    // } 
    // else if (bill = 2000) {
    //     fetchedCoins.silver += ((5/8)*(bill/10))
    //     fetchedCoins.gold += (3/8)*(bill/30)
    // }  
    // else if (bill < 5999) {
    //     fetchedCoins.silver += (4/9)*(bill/10)
    //     fetchedCoins.gold += (3/9)*(bill/30)
    //     fetchedCoins.platinum += (2/9)*(bill/60)
    // }  
    // else {
    //     fetchedCoins.gold += (5/8)*(bill/30)
    //     fetchedCoins.platinum += (3/8)*(bill/60)
    // }

    // fetchedCoins.silver = Math.floor(fetchedCoins.silver);
    // fetchedCoins.gold = Math.floor(fetchedCoins.gold);
    // fetchedCoins.platinum = Math.floor(fetchedCoins.platinum);

    document.getElementById("silver-coins").innerHTML = coins.silver;
    document.getElementById("gold-coins").innerHTML = coins.gold;
    document.getElementById("platinum-coins").innerHTML = coins.platinum;

    await setDoc(doc(db, "users", currentUser.email), {
        coins: coins,
    });
})



const getCoins = (fetchedCoins, bill) => {
    const z = getSilverCoins(bill);
    let silver = fetchedCoins.silver;
    let gold = fetchedCoins.gold;
    let platinum = fetchedCoins.platinum;
    if (100 <= z && z <= 499) {
        silver += z;
    }
    else if (500 <= z && z <= 1999) {
        silver += (5/14)*z;
        gold += (3/14)*z
    }
    else if (2000 <= z && z <= 5999) {
        silver += (4/25)*z
        gold += (3/25)*z
        platinum += (2/25)*z
    }
    else if (6000 <= z && z <= 14999) {
        gold += (5/33)*z
        platinum += (3/33)*z
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
    const silver = 0
    if (100 <= bill && bill < 500) {
        silver = bill/10
    }
    else if (500 <= bill && bill < 2000) {
        silver = bill/10 + (bill-500)/20;
    }
    else if (2000 <= bill && bill < 6000) {
        silver = bill/10 + (bill-500)/35 + (bill-2000)/30;
    }
    else if (6000 <= bill && bill < 15000) {
        silver = bill/10 + (bill-500)/35 + (bill-2000)/30 + (bill-6000)/25;
    }
    else {
        silver = bill/10 + (bill-500)/35 + (bill-2000)/30 + (bill-6000)/25 + (bill-15000)/20;
    }
    return Math.floor(silver);
}