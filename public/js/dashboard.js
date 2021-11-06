import { initializeApp } from "https://www.gstatic.com/firebasejs/9.2.0/firebase-app.js";
import {
    getAuth,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/9.2.0/firebase-auth.js";
import { getFirestore, doc, collection, getDoc, getDocs, setDoc, updateDoc } from "https://www.gstatic.com/firebasejs/9.2.0/firebase-firestore.js"

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
    currentPopup: "popup",
    lastSelectedUpgrade: "",
}
let Info = {
    colors: {
        shirt: {
            level_0: "",
            level_1: "",
            level_2: "",
            level_3: "",
            level_4: "",
        },
        pant: {
            level_0: "",
            level_1: "",
            level_2: "",
            level_3: "",
            level_4: "",
        },
        shoes: {
            level_0: "",
            level_1: "",
            level_2: "",
            level_3: "",
        }
    },
    maxlevels: {
        shirt: 4,
        pant: 4,
        shoes: 3
    },
    rewards: {
        level_1: {
            title: "Yay! You have cleared Level 1",
            desc: "",
            coupon: 1
        },
        level_2: {
            title: "Yay! You have cleared Level 2",
            desc: "",
            coupon: 2
        },
        level3: {
            title: "Yay! You have cleared Level 3",
            desc: "",
            coupon: 3
        },
        level_4: {
            title: "Congrats! You have completed the game",
            desc: "",
            coupon: 4
        }
    },
    upgrades: {
        shirt: {
            level_0_to_1: {
                silver: 30,
                gold: 10,
                platinum: 5
            },
            level_1_to_2: {
                silver: 60,
                gold: 20,
                platinum: 10
            },
            level_2_to_3: {
                silver: 100,
                gold: 34,
                platinum: 17
            },
            level_3_to_4: {
                silver: 150,
                gold: 50,
                platinum: 25
            },
        },
        pant: {
            level_0_to_1: {
                silver: 30,
                gold: 10,
                platinum: 5
            },
            level_1_to_2: {
                silver: 60,
                gold: 20,
                platinum: 10
            },
            level_2_to_3: {
                silver: 100,
                gold: 34,
                platinum: 17
            },
            level_3_to_4: {
                silver: 150,
                gold: 50,
                platinum: 25
            },
        },
        shoes: {
            level_0_to_1: {
                silver: 30,
                gold: 10,
                platinum: 5
            },
            level_1_to_2: {
                silver: 60,
                gold: 20,
                platinum: 10
            },
            level_2_to_3: {
                silver: 100,
                gold: 34,
                platinum: 17
            },
        }
    }
}
const l1 = [1, 1, 1];
const l2 = [2, 2, 2];
const l3 = [3, 3, 3];
const l4 = [4, 4, 3];

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
        updateCoinsForNextLevel();
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

        // const infoCollectionRef = collection(db, "info");
        // const infoSnapshot = await getDocs(infoCollectionRef);
        // Info = infoSnapshot.data();
        // infoSnapshot.forEach((doc) => {
        //     console.log(doc.id, " => ", doc.data());
        // })
        
        // console.log("Info Data: ", infoSnapshot.data());

        console.log("CurrentUser: ", CurrentUser);
        console.log("Info: ", Info);

      // ...
    } else {
      // User is signed out
      // ...
      console.log("unable to retireve user");
    }
})();

const homeBtn = document.querySelector(".home");
homeBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    window.location.replace("../home.html");
})

const logoutBtn = document.querySelector(".logout");
logoutBtn.addEventListener("click", async (e) => {
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
})

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
    if (CurrentUser.currentPopup === "popup") {
        popup.classList.replace("popup-show", "popup-hide")
    }
    else if (CurrentUser.currentPopup === "confirm") {
        confirmPopup.classList.replace("popup-show", "popup-hide");
    }
    else {
        upgradePopup.classList.replace("popup-show", "popup-hide");
    }
    popupBackground.classList.replace("popup-show", "popup-hide");
    console.log("clicked: popup-close");
};
const convertCoinsButton = document.getElementById("convert-coins");
const popupBackground = document.querySelector(".popup-background");
const popup = document.querySelector(".popup");
const confirmPopup = document.querySelector(".confirm-popup");
const confirmButton = document.querySelector(".confirm-button");
const upgradePopup = document.querySelector(".upgrade-popup");
const popupClose = document.querySelectorAll(".popup-close");
console.log("popupCloseArray: ", popupClose);
convertCoinsButton.addEventListener("click", showPopup);
// popupBackground.addEventListener("click", hidePopup);
popupClose[0].addEventListener("click", hidePopup);
popupClose[1].addEventListener("click", hidePopup);
popupClose[2].addEventListener("click", hidePopup);
confirmButton.addEventListener("click", async (e) => {
    e.preventDefault();
    const from = CurrentUser.lastSelectedTransaction.from;
    const to = CurrentUser.lastSelectedTransaction.to;
    console.log("converting: gold -> silver ...");
    CurrentUser.coins = convertCoins(CurrentUser.coins, from, to);
    await setDoc(doc(db, "users", CurrentUser.email), {
        coins: CurrentUser.coins
    });
    setCoins(CurrentUser.coins);
    console.log("done");
    confirmPopup.classList.replace("popup-show", "popup-hide");
    hidePopup(e);
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
    shirtProgressBar.style.width = getProgressBarWidth("shirt", CurrentUser.levels.shirt);
    pantProgressBar.style.width = getProgressBarWidth("pant", CurrentUser.levels.pant);
    shoesProgressBar.style.width = getProgressBarWidth("shoes", CurrentUser.levels.shoes);
}

const getProgressBarWidth = (component, level) => {
    if (level === 0) {
        if (component === "shoes") return "25%";
        else return "20%";
    }
    if (level === 1) {
        if (component === "shoes") return "50%";
        else return "40%";
    }
    if (level === 2) {
        if (component === "shoes") return "75%";
        else return "60%";
    }
    if (level === 3) {
        if (component === "shoes") return "100%";
        else return "80%";
    }
    else return "100%";
}

const shirtUpgradeIcon = document.getElementById("shirt-upgrade-icon");
const pantUpgradeIcon = document.getElementById("pant-upgrade-icon");
const shoesUpgradeIcon = document.getElementById("shoes-upgrade-icon");
shirtUpgradeIcon.addEventListener("click", (e) => {
    e.preventDefault();
    CurrentUser.currentPopup = "upgrade";
    showUpgradePopup("shirt");
    CurrentUser.lastSelectedUpgrade = "shirt";
});
pantUpgradeIcon.addEventListener("click", (e) => {
    e.preventDefault();
    CurrentUser.currentPopup = "upgrade";
    showUpgradePopup("pant");
    CurrentUser.lastSelectedUpgrade = "pant";
});
shoesUpgradeIcon.addEventListener("click", (e) => {
    e.preventDefault();
    CurrentUser.currentPopup = "upgrade";
    showUpgradePopup("shoes");
    CurrentUser.lastSelectedUpgrade = "shoes";
});

const showUpgradePopup = (component) => {
    popupBackground.classList.replace("popup-hide", "popup-show");
    upgradePopup.classList.replace("popup-hide", "popup-show");
    document.querySelector(".upgrade-popup-title").innerHTML = `Upgrade ${component.charAt(0).toUpperCase() + component.slice(1)}`;
    let upgradeCoins;
    if (component === "shirt") {
        upgradeCoins = getUpgradeCoins(component, CurrentUser.levels.shirt);
    }
    else if (component === "pant") {
        upgradeCoins = getUpgradeCoins(component, CurrentUser.levels.pant);
    }
    else {
        upgradeCoins = getUpgradeCoins(component, CurrentUser.levels.shoes);
    }
    if (upgradeCoins === "Reached Last Level") {
        document.getElementById("upgrade-silver-coins").innerHTML = upgradeCoins;
        document.getElementById("upgrade-gold-coins").innerHTML = upgradeCoins;
        document.getElementById("upgrade-platinum-coins").innerHTML = upgradeCoins;
    }
    else {
        document.getElementById("upgrade-silver-coins").innerHTML = upgradeCoins.silver;
        document.getElementById("upgrade-gold-coins").innerHTML = upgradeCoins.gold;
        document.getElementById("upgrade-platinum-coins").innerHTML = upgradeCoins.platinum;
    }
}
const hideUpgradePopup = () => {
    upgradePopup.classList.replace("popup-show", "popup-hide");
    popupBackground.classList.replace("popup-show", "popup-hide");
}

const upgradeComponent = async (component, coinType) => {
    console.log("recieved: component=", component, ", coinType=", coinType);
    let upgradeCoins;
    switch (component) {
        case "shirt":
            upgradeCoins = getUpgradeCoins(component, CurrentUser.levels.shirt);
            CurrentUser.levels.shirt += 1;
            // TODO: Shirt Color Upgrade
            break;
        case "pant":
            upgradeCoins = getUpgradeCoins(component, CurrentUser.levels.pant);
            CurrentUser.levels.pant += 1;
            // TODO: Pant Color Upgrade
            break;
        case "shoes":
            upgradeCoins = getUpgradeCoins(component, CurrentUser.levels.shoes);
            CurrentUser.levels.shoes += 1;
            // TODO: Shoes Color Upgrade
            break;
        default:
            break;
    }
    console.log("coins needed to upgrade: ", upgradeCoins);
    if (coinType === "silver") CurrentUser.coins.silver -= upgradeCoins.silver;
    else if (coinType === "gold") CurrentUser.coins.gold -= upgradeCoins.gold;
    else CurrentUser.coins.platinum -= upgradeCoins.platinum;
    const userDocRef = doc(db, "users", CurrentUser.email);
    await updateDoc(userDocRef, {
        coins: CurrentUser.coins,
        levels: CurrentUser.levels
    });
    setCoins();
    setAvatharColors();
    setLevels();
    setProgressBars();
    updateCoinsForNextLevel();
}

const getUpgradeCoins = (component, currentLevel) => {
    console.log("getUpgradeCoins, recieved: ", component, ", ", currentLevel);
    if (component === "shirt" || component === "pant") {
        if (currentLevel === 0) return Info.upgrades.shirt.level_0_to_1;
        if (currentLevel === 1) return Info.upgrades.shirt.level_1_to_2;
        if (currentLevel === 2) return Info.upgrades.shirt.level_2_to_3;
        if (currentLevel === 3) return Info.upgrades.shirt.level_3_to_4;
        return "Reached Last Level";
    }
    if (currentLevel === 0) return Info.upgrades.shirt.level_0_to_1;
    if (currentLevel === 1) return Info.upgrades.shirt.level_1_to_2;
    if (currentLevel === 2) return Info.upgrades.shirt.level_2_to_3;
    return "Reached Last Level";
}

const upgradeWithSilverBtn = document.getElementById("upgrade-with-silver");
const upgradeWithGoldBtn = document.getElementById("upgrade-with-gold");
const upgradeWithPlatinumBtn = document.getElementById("upgrade-with-platinum");
upgradeWithSilverBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    console.log("lastSelectedUpgrade: ", CurrentUser.lastSelectedUpgrade, ", currentLevel: ", getComponentLevel(CurrentUser.lastSelectedUpgrade));
    console.log("componentLevel: ", getComponentLevel(CurrentUser.lastSelectedUpgrade));
    const upgradeCoins = getUpgradeCoins(CurrentUser.lastSelectedUpgrade, getComponentLevel(CurrentUser.lastSelectedUpgrade));
    if (upgradeCoins !== "Reached Last Level" && CurrentUser.coins.silver >= upgradeCoins.silver) {
        await upgradeComponent(CurrentUser.lastSelectedUpgrade, "silver");
    }
    else {
        console.log("no enough coins :(");
        console.log("coins: ", CurrentUser.coins);
        console.log("upgradeCoins: ", upgradeCoins);
    }
    hideUpgradePopup();
});
upgradeWithGoldBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    console.log("lastSelectedUpgrade: ", CurrentUser.lastSelectedUpgrade, ", currentLevel: ", getComponentLevel(CurrentUser.lastSelectedUpgrade));
    console.log("lastSelectedUpgrade: ", CurrentUser.lastSelectedUpgrade);
    const upgradeCoins = getUpgradeCoins(CurrentUser.lastSelectedUpgrade, getComponentLevel(CurrentUser.lastSelectedUpgrade));
    if (upgradeCoins !== "Reached Last Level" && CurrentUser.coins.gold >= upgradeCoins.gold) {
        await upgradeComponent(CurrentUser.lastSelectedUpgrade, "gold");
    }
    else {
        console.log("no enough coins :(");
        console.log("coins: ", CurrentUser.coins);
        console.log("required gold coins: ", upgradeCoins.gold);
    }
    hideUpgradePopup();
});
upgradeWithPlatinumBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    console.log("lastSelectedUpgrade: ", CurrentUser.lastSelectedUpgrade, ", currentLevel: ", getComponentLevel(CurrentUser.lastSelectedUpgrade));
    const upgradeCoins = getUpgradeCoins(CurrentUser.lastSelectedUpgrade, getComponentLevel(CurrentUser.lastSelectedUpgrade));
    if (upgradeCoins !== "Reached Last Level" && CurrentUser.coins.platinum >= upgradeCoins.platinum) {
        await upgradeComponent(CurrentUser.lastSelectedUpgrade, "platinum");
    }
    else console.log("no enough coins :(");
    hideUpgradePopup();
});

const getComponentLevel = (component) => {
    if (component === "shirt") return CurrentUser.levels.shirt;
    else if (component === "pant") return CurrentUser.levels.pant;
    else return CurrentUser.levels.shoes;
}

const updateCoinsForNextLevel = () => {
    const shirtSilver = document.getElementById("silver-coins-for-next-level-shirt")
    const shirtGold = document.getElementById("gold-coins-for-next-level-shirt")
    const shirtPlatinum = document.getElementById("platinum-coins-for-next-level-shirt")
    const pantSilver = document.getElementById("silver-coins-for-next-level-pant")
    const pantGold = document.getElementById("gold-coins-for-next-level-pant")
    const pantPlatinum = document.getElementById("platinum-coins-for-next-level-pant")
    const shoesSilver = document.getElementById("silver-coins-for-next-level-shoes")
    const shoesGold = document.getElementById("gold-coins-for-next-level-shoes")
    const shoesPlatinum = document.getElementById("platinum-coins-for-next-level-shoes")

    const shirtUpgradeCoins = getUpgradeCoins("shirt", CurrentUser.levels.shirt);
    shirtSilver.innerHTML = shirtUpgradeCoins.silver ? shirtUpgradeCoins.silver : "--";
    shirtGold.innerHTML = shirtUpgradeCoins.gold ? shirtUpgradeCoins.gold : "--";
    shirtPlatinum.innerHTML = shirtUpgradeCoins.platinum ? shirtUpgradeCoins.platinum : "--";

    const pantUpgradeCoins = getUpgradeCoins("pant", CurrentUser.levels.pant);
    pantSilver.innerHTML = pantUpgradeCoins.silver ? pantUpgradeCoins.silver : "--";
    pantGold.innerHTML = pantUpgradeCoins.gold ? pantUpgradeCoins.gold : "--";
    pantPlatinum.innerHTML = pantUpgradeCoins.platinum ? pantUpgradeCoins.platinum : "--";

    const shoesUpgradeCoins = getUpgradeCoins("shoes", CurrentUser.levels.shoes);
    shoesSilver.innerHTML = shoesUpgradeCoins.silver ? shoesUpgradeCoins.silver : "--";
    shoesGold.innerHTML = shoesUpgradeCoins.gold ? shoesUpgradeCoins.gold : "--";
    shoesPlatinum.innerHTML = shoesUpgradeCoins.platinum ? shoesUpgradeCoins.platinum : "--";
}

const checkForRewards = () => {}

// const getNextReward = () => {

//     shirt: 3
//     pant: 3
//     shoes: 1

//     min+1

//          shi pnat shoe   
//     a1: [1,  1,   1]
//     a2: [2,  2,   2]
//     a3: [3,  3,   3]
//     a4: [4,  4,   3]




//     min(CurrentUser.levels);
//     nextMin(CurrentUser.levels);
// }