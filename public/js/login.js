import { initializeApp } from "https://www.gstatic.com/firebasejs/9.2.0/firebase-app.js";
import {
    getAuth,
    signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/9.2.0/firebase-auth.js";

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


const form = document.getElementById("form")
form.addEventListener("submit", (event) => {
    event.preventDefault();

    const email = form["email"].value;
    const password = form["password"].value;

    console.log(email);
    console.log(password);

    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        console.log("user: ", user);
        window.location.replace("../home.html");
    })
    .catch((error) => {
        console.log("errorcode: ", error.code);
        console.log("errorMessage: ", error.message);
    });
})
