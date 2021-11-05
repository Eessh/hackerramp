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
let currentGender;
let currentCoins;

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
      currentCoins = fetchedCoins;
      console.log("currentCoins: ", currentCoins);

      if (sanpshot.exists()) {
        console.log("Document data:", sanpshot.data());
        currentGender = sanpshot.data().gender;
        console.log("currentGender: ", currentGender);
        // const leftpane = document.querySelector(".leftpane")
        const boiSVG = document.querySelector(".boi-svg");
        const galSVG = document.querySelector(".gal-svg");
        currentGender === "male"
        ? boiSVG.classList.replace("hide-element", "show-element")
        : galSVG.classList.replace("hide-element", "show-element");
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

// window.onload(() => {
//     const convertCoinsButton = document.getElementById("convert-coins");
//     const popupBackground = document.querySelector(".popup-background");
//     const popupVisible = false;
//     convertCoinsButton.addEventListener("click", () => {
//         if (!popupVisible) popupBackground.classList.add("popup-show");
//         console.log("clicked: ConvertCoins")
//     })
//     popupBackground.addEventListener("click", (e) => {
//         e.preventDefault();
//         if (popupVisible) popupBackground.classList.add("popup-hide");
//     });
// });


const showPopup = (e) => {
    e.preventDefault();
    popupBackground.classList.replace("popup-hide", "popup-show");
    // popup.classList.add("popup-show");
    console.log("clicked: ConvertCoins");
};
const hidePopup = (e) => {
    e.preventDefault();
    if (e.traget !== document.querySelector(".popup")) {
        popupBackground.classList.replace("popup-show", "popup-hide");
        // popup.classList.add("popup-hide");
        console.log("clicked: PopupBackground");
    }
};
const convertCoinsButton = document.getElementById("convert-coins");
const popupBackground = document.querySelector(".popup-background");
const popup = document.querySelector(".popup");
const popupClose = document.querySelector(".popup-close");
convertCoinsButton.addEventListener("click", showPopup);
// popupBackground.addEventListener("click", hidePopup);
popupClose.addEventListener("click", hidePopup);
// popup.addEventListener("click", (e) => {
//     e.preventDefault();
//     console.log("hehe: blocked event");
// });


let paths = document.querySelectorAll("paths");
const shirtPaths = document.querySelectorAll("#shirt");
const shoePaths = document.querySelectorAll("#shoes");
const pantPaths = document.querySelectorAll("#pant");
shirtPaths.forEach((path) => {
    path.setAttribute("style", "fill: cyan");
})
shoePaths.forEach((path) => {
    path.setAttribute("style", "fill: blue");
});
pantPaths.forEach((path) => {
    path.setAttribute("style", "fill: red");
});
// paths[18].setAttribute("fill", colors.shoes);

const goldToSilver = document.getElementById("gold-silver")
const platinumToSilver = document.getElementById("platinum-silver")
const platinumToGold = document.getElementById("platinum-gold")
goldToSilver.addEventListener("click", async (e) => {
    e.preventDefault();
    if (currentCoins.gold > 0) {
        console.log("converting: gold -> silver ...");
        currentCoins = convertCoins(currentCoins, "gold", "silver");
        await setDoc(doc(db, "users", currentUser.email), {
            coins: currentCoins
        });
        setCoins(currentCoins);
        console.log("done");
    }
});
platinumToSilver.addEventListener("click", async (e) => {
    e.preventDefault();
    if (currentCoins.platinum > 0) {
        console.log("converting: platinum -> silver ...");
        currentCoins = convertCoins(currentCoins, "platinum", "silver");
        await setDoc(doc(db, "users", currentUser.email), {
            coins: currentCoins
        });
        setCoins(currentCoins);
        console.log("done");
    }
});
platinumToGold.addEventListener("click", async (e) => {
    e.preventDefault();
    if (currentCoins.platinum > 0) {
        console.log("converting: platinum -> gold ...");
        currentCoins = convertCoins(currentCoins, "platinum", "gold");
        await setDoc(doc(db, "users", currentUser.email), {
            coins: currentCoins
        });
        setCoins(currentCoins);
        console.log("done");
    }
});