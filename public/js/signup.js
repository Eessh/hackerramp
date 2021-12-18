import { initializeApp } from "https://www.gstatic.com/firebasejs/9.2.0/firebase-app.js";
import {
    getAuth,
    createUserWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/9.2.0/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/9.2.0/firebase-firestore.js";

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
const db = getFirestore();
const auth = getAuth();

const defaults = {
    coins: {
        silver: 0,
        gold: 0,
        platinum: 0
    },
    colors: {
        shirt: "gray",
        pant: "black",
        shoes: "black"
    },
    levels: {
        shirt: 0,
        pant: 0,
        shoes: 0
    },
    lastRewardLevel: 0
}

document.getElementById("login-btn").addEventListener("click", (e) => {
    e.preventDefault();
    window.location.replace("../login.html");
})


const form = document.getElementById("form")
form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = form["name"].value;
    const password = form["password"].value;
    const gender = form["gender"].value;

    createUserWithEmailAndPassword(auth, email, password)
    .then(async (userCredential) => {
        const user = userCredential.user;

        await setDoc(doc(db, "gender", email), {
            gender: gender
        });
        await setDoc(doc(db, "users", email), defaults);

        window.location.replace("../home.html");
    })
    .catch((error) => {
        console.log("errorcode: ", error.code);
        console.log("errorMessage: ", error.message);
    });
});
