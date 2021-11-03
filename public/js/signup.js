import { initializeApp } from "https://www.gstatic.com/firebasejs/9.2.0/firebase-app.js";
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/9.2.0/firebase-auth.js";
import { getFirestore, doc, setDoc, collection, addDoc } from "https://www.gstatic.com/firebasejs/9.2.0/firebase-firestore.js";

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
const db = getFirestore();
const auth = getAuth();


const form = document.getElementById("form")
form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = form["name"].value;
    const password = form["password"].value;
    const gender = form["gender"].value;

    console.log(email);
    console.log(password);
    console.log(gender);

    createUserWithEmailAndPassword(auth, email, password)
    .then(async (userCredential) => {
        // Signed in 
        const user = userCredential.user;
        console.log("user: ", user);
        // ...

        await setDoc(doc(db, "gender", email), {
            gender: gender
        });

        await setDoc(doc(db, "users", email), {
            coins: {
                silver: 0,
                gold: 0,
                platinum: 0
            }
        });

        // try {
        //     const docRef = await addDoc(collection(db, "gender"), {
        //         "email": email,
        //         "gender": gender,
        //     });
        //     console.log("Document written with ID: ", docRef.id);
        // }
        // catch (error) {
        //     console.log("Error: ", error);
        // }

        // await addDoc(collection(db, "gender"), {
        //     email: email,
        //     gender: gender,
        // })
        // .then((docRef) => console.log("Document written with ID: ", docRef.id));

    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log("errorcode: ", errorCode);
        console.log("errorMessage: ", errorMessage);
        // ..
    });
});

const addGenderToStore = async (database, collection, document) => {
    return new Promise((resolve, reject) => {
        resolve(setDoc(doc(db, "gender", email), {
            gender: gender
        }))
    })
    // await setDoc(doc(database, collection, document.name), document.fields);
}
