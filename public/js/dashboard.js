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
    lastRewardLevel: 0
}
let Info = {
    colors: {
        male: {
            shirt: {
                level_0: "gray",
                level_1: "#EE9B00",
                level_2: "#AE2012",
                level_3: "#85D2D0",
                level_4: "#887BB0",
            },
            pant: {
                level_0: "black",
                level_1: "#E4D4C8",
                level_2: "#D0B49F",
                level_3: "#A47551",
                level_4: "#523A28",
            },
            shoes: {
                level_0: "black",
                level_1: "#7F5539",
                level_2: "#1D3557",
                level_3: "#9B2226",
            },
        },
        female: {
            shirt: {
                level_0: "gray",
                level_1: "#EDE7DC",
                level_2: "#DCD2CC",
                level_3: "#CCAFA5",
                level_4: "#BDC3CB",
            },
            pant: {
                level_0: "black",
                level_1: "#E8B4B8",
                level_2: "#EED6D3",
                level_3: "#A49393",
                level_4: "#67595E",
            },
            shoes: {
                level_0: "black",
                level_1: "#E8B4B8",
                level_2: "#EED6D3",
                level_3: "#67595E",
            },
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
            desc: "You have recieved a Level-1 Coupon",
            coupon: 1
        },
        level_2: {
            title: "Yay! You have cleared Level 2",
            desc: "You have recieved a Level-2 Coupon",
            coupon: 2
        },
        level_3: {
            title: "Yay! You have cleared Level 3",
            desc: "You have recieved a Level-3 Coupon",
            coupon: 3
        },
        level_4: {
            title: "Congrats! You have completed the game",
            desc: "Congratulations! You have recieved a MEGA COUPON, Game will be Reset.",
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
        CurrentUser.lastRewardLevel = detailsSnapshot.data().lastRewardLevel;

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
const hidePopup = async (e) => {
    e.preventDefault();
    if (CurrentUser.currentPopup === "popup") {
        popup.classList.replace("popup-show", "popup-hide")
    }
    else if (CurrentUser.currentPopup === "confirm") {
        confirmPopup.classList.replace("popup-show", "popup-hide");
    }
    else if (CurrentUser.currentPopup === "upgrade") {
        upgradePopup.classList.replace("popup-show", "popup-hide");
    }
    else {
        rewardPopup.classList.replace("popup-show", "popup-hide");
        if (CurrentUser.lastRewardLevel === 4) {
            await resetGame();
        }
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
const rewardPopup = document.querySelector(".reward-popup")
const popupClose = document.querySelectorAll(".popup-close");
console.log("popupCloseArray: ", popupClose);
convertCoinsButton.addEventListener("click", showPopup);
// popupBackground.addEventListener("click", hidePopup);
popupClose[0].addEventListener("click", hidePopup);
popupClose[1].addEventListener("click", hidePopup);
popupClose[2].addEventListener("click", hidePopup);
popupClose[3].addEventListener("click", hidePopup);
confirmButton.addEventListener("click", async (e) => {
    e.preventDefault();
    const from = CurrentUser.lastSelectedTransaction.from;
    const to = CurrentUser.lastSelectedTransaction.to;
    console.log("converting: gold -> silver ...");
    CurrentUser.coins = convertCoins(CurrentUser.coins, from, to);
    await updateDoc(doc(db, "users", CurrentUser.email), {
        coins: CurrentUser.coins
    });
    setCoins(CurrentUser.coins);
    console.log("done");
    confirmPopup.classList.replace("popup-show", "popup-hide");
    await hidePopup(e);
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
        path.setAttribute("style", `fill: ${CurrentUser.colors.shoes}`);
    });
    pantPaths.forEach((path) => {
        path.setAttribute("style", `fill: ${CurrentUser.colors.pant}`);
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
            CurrentUser.colors.shirt = getComponentColor(component, CurrentUser.levels.shirt);
            break;
        case "pant":
            upgradeCoins = getUpgradeCoins(component, CurrentUser.levels.pant);
            CurrentUser.levels.pant += 1;
            // TODO: Pant Color Upgrade
            CurrentUser.colors.pant = getComponentColor(component, CurrentUser.levels.pant);
            break;
        case "shoes":
            upgradeCoins = getUpgradeCoins(component, CurrentUser.levels.shoes);
            CurrentUser.levels.shoes += 1;
            // TODO: Shoes Color Upgrade
            CurrentUser.colors.shoes = getComponentColor(component, CurrentUser.levels.shoes);
            break;
        default:
            break;
    }
    console.log("colors: ", CurrentUser.colors);
    if (coinType === "silver") CurrentUser.coins.silver -= upgradeCoins.silver;
    else if (coinType === "gold") CurrentUser.coins.gold -= upgradeCoins.gold;
    else CurrentUser.coins.platinum -= upgradeCoins.platinum;
    const userDocRef = doc(db, "users", CurrentUser.email);
    await updateDoc(userDocRef, {
        coins: CurrentUser.coins,
        colors: CurrentUser.colors,
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

const getComponentColor = (component, level) => {
    if (component === "shirt") {
        if (CurrentUser.gender === "male") {
            if (level === 1) return Info.colors.male.shirt.level_1;
            if (level === 2) return Info.colors.male.shirt.level_2;
            if (level === 3) return Info.colors.male.shirt.level_3;
            if (level === 4) return Info.colors.male.shirt.level_4;
        }
        else {
            if (level === 1) return Info.colors.female.shirt.level_1;
            if (level === 2) return Info.colors.female.shirt.level_2;
            if (level === 3) return Info.colors.female.shirt.level_3;
            if (level === 4) return Info.colors.female.shirt.level_4;
        }
    }
    if (component === "pant") {
        if (CurrentUser.gender === "male") {
            if (level === 1) return Info.colors.male.pant.level_1;
            if (level === 2) return Info.colors.male.pant.level_2;
            if (level === 3) return Info.colors.male.pant.level_3;
            if (level === 4) return Info.colors.male.pant.level_4;
        }
        else {
            if (level === 1) return Info.colors.female.pant.level_1;
            if (level === 2) return Info.colors.female.pant.level_2;
            if (level === 3) return Info.colors.female.pant.level_3;
            if (level === 4) return Info.colors.female.pant.level_4;
        }
    }
    else {
        if (CurrentUser.gender === "male") {
            if (level === 1) return Info.colors.male.shoes.level_1;
            if (level === 2) return Info.colors.male.shoes.level_2;
            if (level === 3) return Info.colors.male.shoes.level_3;
        }
        else {
            if (level === 1) return Info.colors.female.shoes.level_1;
            if (level === 2) return Info.colors.female.shoes.level_2;
            if (level === 3) return Info.colors.female.shoes.level_3;
        }
    }
};

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
    checkForRewards();
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
    checkForRewards();
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
    checkForRewards();
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

const checkForRewards = async () => {
    console.log("from ckeck, lastRewardLevel: ", CurrentUser.lastRewardLevel);
    const matrix = [
        [1, 1, 1],
        [2, 2, 2],
        [3, 3, 3],
        [4, 4, 3],
    ];
    let maxLeastLevel = 0;
    for (let i = 3; i >= 0; i--) {
        console.log("matrix[i]: ", matrix[i]);
        if (isGreaterThan(matrix[i])) {
            maxLeastLevel = i+1;
            break;
        }
    }
    if (maxLeastLevel > CurrentUser.lastRewardLevel) {
        CurrentUser.lastRewardLevel = maxLeastLevel;
        const userDocRef = doc(db, "users", CurrentUser.email);
        await updateDoc(userDocRef, {
            lastRewardLevel: CurrentUser.lastRewardLevel
        });
        showRewardPopup(CurrentUser.lastRewardLevel);
    }
}
const isGreaterThan = (levelArr) => {
    console.log("levelArr: ", levelArr);
    if (
        levelArr[0] <= CurrentUser.levels.shirt
        && levelArr[1] <= CurrentUser.levels.pant
        && levelArr[2] <= CurrentUser.levels.shoes
    ) {
        return true;
    }
    return false;
}

const showRewardPopup = (rewardLevel) => {
    CurrentUser.currentPopup = "reward";
    popupBackground.classList.replace("popup-hide", "popup-show");
    rewardPopup.classList.replace("popup-hide", "popup-show");
    document.querySelector(".reward-popup-title").innerHTML = rewardLevel === 1
                                                        ? Info.rewards.level_1.title
                                                        : rewardLevel === 2
                                                            ? Info.rewards.level_2.title
                                                            : rewardLevel === 3
                                                                ? Info.rewards.level_3.title
                                                                : Info.rewards.level_4.title
    document.querySelector(".reward-desc").innerHTML = rewardLevel === 1
                                                        ? Info.rewards.level_1.desc
                                                        : rewardLevel === 2
                                                            ? Info.rewards.level_2.desc
                                                            : rewardLevel === 3
                                                                ? Info.rewards.level_3.desc
                                                                : Info.rewards.level_4.desc
}

const resetGame = async () => {
    CurrentUser.colors = {
        shirt: "gray",
        pant: "black",
        shoes: "black"
    }
    CurrentUser.levels = {
        shirt: 0,
        pant: 0,
        shoes: 0,
    }
    CurrentUser.lastRewardLevel = 0
    const userDocRef = doc(db, "users", CurrentUser.email);
    await updateDoc(userDocRef, {
        colors: CurrentUser.colors,
        levels: CurrentUser.levels,
        lastRewardLevel: CurrentUser.lastRewardLevel
    });
    setCoins();
    setAvatharColors();
    setLevels();
    setProgressBars();
    updateCoinsForNextLevel();
}

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
