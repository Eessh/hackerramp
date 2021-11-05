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


let CurrentUser = {
    email: "",
    gender: "",
    coins: {
        silver: 0,
        gold: 0,
        platinum: 0
    },
    colors: {
        shirt: "",
        pant: "",
        shoes: ""
    },
    levels: {
        shirt: 0,
        pant: 0,
        shoes: 0
    },
    lastSelectedTransaction: {
        from: "",
        to: ""
    },
    currentPopup: "popup"
}

onAuthStateChanged(auth, async (user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User
    //   const uid = user.uid;

      CurrentUser.email = user.email;

      const userLevelsDocRef = doc(db, "users", CurrentUser.email);
      const detailsSnapshot = await getDoc(userLevelsDocRef);
      if (detailsSnapshot.exists()) {
        CurrentUser.coins = detailsSnapshot.data().coins;
        CurrentUser.colors = detailsSnapshot.data().colors;
        CurrentUser.levels = detailsSnapshot.data().levels;

        setCoins();
        setAvatharColors();
        setLevels();
        setProgressBars();
      }
      else {
          console.log("No such document!");
      }

      const userGenderdocRef = doc(db, "gender", user.email);
      const sanpshot = await getDoc(userGenderdocRef);
      if (sanpshot.exists()) {
        CurrentUser.gender = sanpshot.data().gender;
        const boiSVG = document.querySelector(".boi-svg");
        const galSVG = document.querySelector(".gal-svg");
        CurrentUser.gender === "male"
        ? boiSVG.classList.replace("hide-element", "show-element")
        : galSVG.classList.replace("hide-element", "show-element");
      }
      else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }

    //   const fetchedCoins = await fetchCoins();
    //   setCoins(fetchedCoins);
    //   CurrentUser.coins = fetchedCoins;

      console.log("CurrentUser: ", CurrentUser);

      // ...
    } else {
      // User is signed out
      // ...
      console.log("unable to retireve user");
    }
})();

const setCoins = () => {
    document.getElementById("silver-coins").innerHTML = CurrentUser.coins.silver;
    document.getElementById("gold-coins").innerHTML = CurrentUser.coins.gold;
    document.getElementById("platinum-coins").innerHTML = CurrentUser.coins.platinum;
}

// async function fetchCoins() {
//     const userCoinsdocRef = doc(db, "users", CurrentUser.email);
//     const snapshot = await getDoc(userCoinsdocRef);

//     if (snapshot.exists()) {
//         console.log(snapshot.data().coins)
//         return snapshot.data().coins
//     }
//     else {
//         console.log("User has not done any billing yet!");
//         return null;
//     }
// };

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

const previewCoinConversion = (from, fromCoins, to) => {
    if (from === "platinum") {
        if (to === "gold") {
            return Math.floor(fromCoins*1.5)
        }
        else {
            return Math.floor(fromCoins*4)
        }
    }
    return fromCoins*2
}

const showPopup = (e) => {
    e.preventDefault();
    popupBackground.classList.replace("popup-hide", "popup-show");
    popup.classList.replace("popup-hide", "popup-show");
    CurrentUser.currentPopup = "popup"
    console.log("clicked: ConvertCoins");
};
const hidePopup = (e) => {
    e.preventDefault();
    // if (e.traget !== document.querySelector(".popup")) {
    //     popupBackground.classList.replace("popup-show", "popup-hide");
    //     console.log("clicked: PopupBackground");
    // }
    if (CurrentUser.currentPopup === "popup") {
        popup.classList.replace("popup-show", "popup-hide")
    }
    else {
        confirmPopup.classList.replace("popup-show", "popup-hide");
    }
    popupBackground.classList.replace("popup-show", "popup-hide");
    console.log("clicked: popup-close");
};
const convertCoinsButton = document.getElementById("convert-coins");
const popupBackground = document.querySelector(".popup-background");
const popup = document.querySelector(".popup");
const confirmPopup = document.querySelector(".confirm-popup");
const confirmButton = document.querySelector(".confirm-button");
const popupClose = document.querySelectorAll(".popup-close");
console.log("popupCloseArray: ", popupClose);
convertCoinsButton.addEventListener("click", showPopup);
// popupBackground.addEventListener("click", hidePopup);
popupClose[0].addEventListener("click", hidePopup);
popupClose[1].addEventListener("click", hidePopup);
confirmButton.addEventListener("click", async (e) => {
    e.preventDefault();
    const form = CurrentUser.lastSelectedTransaction.from;
    const to = CurrentUser.lastSelectedTransaction.to;
    console.log("converting: gold -> silver ...");
    CurrentUser.coins = convertCoins(CurrentUser.coins, from, to);
    await setDoc(doc(db, "users", CurrentUser.email), {
        coins: CurrentUser.coins
    });
    setCoins(CurrentUser.coins);
    console.log("done");
    confirmPopup.classList.replace("popup-show", "popup-hide");
    hidePopup();
})
// popup.addEventListener("click", (e) => {
//     e.preventDefault();
//     console.log("hehe: blocked event");
// });


const setAvatharColors = () => {
    const shirtPaths = document.querySelectorAll("#shirt");
    const shoePaths = document.querySelectorAll("#shoes");
    const pantPaths = document.querySelectorAll("#pant");
    shirtPaths.forEach((path) => {
        path.setAttribute("style", `fill: ${CurrentUser.colors.shirt}`);
    })
    shoePaths.forEach((path) => {
        path.setAttribute("style", `fill: ${CurrentUser.colors.pant}`);
    });
    pantPaths.forEach((path) => {
        path.setAttribute("style", `fill: ${CurrentUser.colors.shoes}`);
    });
}

const goldToSilver = document.getElementById("gold-silver")
const platinumToSilver = document.getElementById("platinum-silver")
const platinumToGold = document.getElementById("platinum-gold")
goldToSilver.addEventListener("click", async (e) => {
    e.preventDefault();
    CurrentUser.lastSelectedTransaction = {from: "gold", to: "silver"};
    CurrentUser.currentPopup = "confirm"
    showConfirmPopup();
    // if (CurrentUser.coins.gold > 0) {
    //     console.log("converting: gold -> silver ...");
    //     CurrentUser.coins = convertCoins(CurrentUser.coins, "gold", "silver");
    //     await setDoc(doc(db, "users", CurrentUser.email), {
    //         coins: CurrentUser.coins
    //     });
    //     setCoins(CurrentUser.coins);
    //     console.log("done");
    // }
});
platinumToSilver.addEventListener("click", async (e) => {
    e.preventDefault();
    CurrentUser.lastSelectedTransaction = {from: "platinum", to: "silver"};
    CurrentUser.currentPopup = "confirm"
    showConfirmPopup();
    // if (CurrentUser.coins.platinum > 0) {
    //     console.log("converting: platinum -> silver ...");
    //     CurrentUser.coins = convertCoins(CurrentUser.coins, "platinum", "silver");
    //     await setDoc(doc(db, "users", CurrentUser.email), {
    //         coins: CurrentUser.coins
    //     });
    //     setCoins(CurrentUser.coins);
    //     console.log("done");
    // }
});
platinumToGold.addEventListener("click", async (e) => {
    e.preventDefault();
    CurrentUser.lastSelectedTransaction = {from: "platinum", to: "gold"};
    CurrentUser.currentPopup = "confirm"
    showConfirmPopup();
    // if (CurrentUser.coins.platinum > 0) {
    //     console.log("converting: platinum -> gold ...");
    //     CurrentUser.coins = convertCoins(CurrentUser.coins, "platinum", "gold");
    //     await setDoc(doc(db, "users", CurrentUser.email), {
    //         coins: CurrentUser.coins
    //     });
    //     setCoins(CurrentUser.coins);
    //     console.log("done");
    // }
});

const showConfirmPopup = () => {
    popup.classList.replace("popup-show", "popup-hide");
    confirmPopup.classList.replace("popup-hide", "popup-show");
    const from = CurrentUser.lastSelectedTransaction.from;
    const fromCoins = from === "silver"
                        ? CurrentUser.coins.silver
                        : from === "gold"
                            ? CurrentUser.coins.gold
                            : CurrentUser.coins.platinum
    const to = CurrentUser.lastSelectedTransaction.to;
    document.querySelector(".confirm-to-coins").innerHTML = to;
    document.querySelector(".confirm-to-coins-value").innerHTML = previewCoinConversion(from, fromCoins, to);
    document.querySelector(".confirm-from-coins").innerHTML = from;
    document.querySelector(".confirm-from-coins-value").innerHTML = fromCoins;
}

const setLevels = () => {
    const shirtLevelRef = document.getElementById("shirt-level");
    const pantLevelRef = document.getElementById("pant-level");
    const shoesLevelRef = document.getElementById("shoes-level");
    shirtLevelRef.innerHTML = CurrentUser.levels.shirt;
    pantLevelRef.innerHTML = CurrentUser.levels.pant;
    shoesLevelRef.innerHTML = CurrentUser.levels.shoes;
}

const setProgressBars = () => {
    const shirtProgressBar = document.getElementById("shirt-progress-bar");
    const pantProgressBar = document.getElementById("pant-progress-bar");
    const shoesProgressBar = document.getElementById("shoes-progress-bar");
    shirtProgressBar.classList.replace(shirtProgressBar.classList.value, getProgressBarClassName("shirt", CurrentUser.levels.shirt));
    pantProgressBar.classList.replace(pantProgressBar.classList.value, getProgressBarClassName("pant", CurrentUser.levels.pant));
    shoesProgressBar.classList.replace(shoesProgressBar.classList.value, getProgressBarClassName("shoes", CurrentUser.levels.shoes));
}

const getProgressBarClassName = (component, level) => {
    if (level === 0) {
        if (component === "shoes") return "shoes_level_0";
        else return "level_0"
    }
    if (level === 1) {
        if (component === "shoes") return "shoes_level_1"
        else return "level_1"
    }
    if (level === 2) {
        if (component === "shoes") return "shoes_level_2"
        else return "level_2"
    }
    if (level === 3) {
        if (component === "shoes") return "level_4"
        else return "level_3"
    }
    else return "level_4"
}