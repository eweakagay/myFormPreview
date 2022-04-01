/**
 * v 0.0.2
 */

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getDatabase, get, update, child, ref, onValue } from "firebase/database";
import { myBodyOnload } from "./stat.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyALjULtFV0NZvPnGrEUQx5hm8WCOMtmQuk",
    authDomain: "myformpreview.firebaseapp.com",
    projectId: "myformpreview",
    storageBucket: "myformpreview.appspot.com",
    messagingSenderId: "322553567181",
    appId: "1:322553567181:web:217aea4b948fa1603cd684",
    measurementId: "G-PM0P98EX31"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

let uid = "", car = "", name = "";

async function myGetAuth() {
    //login
    let email = document.getElementById("email").value, password = document.getElementById("password").value;
    await signInWithEmailAndPassword(auth, email, password).then((userCredential) => {
        uid = userCredential.user.uid;
    }).catch((error) => {
        console.log(error);
    });

    get(child(ref(db, '/user/'), uid)).then((snapshot) => {
        if (snapshot.exists()) {
            document.getElementById("logInPage").style.display = "none";
            document.getElementById("showStat").style.display = "block";
            name = snapshot.child('/name').val();
            if (snapshot.child('/stat').val()) {
                document.getElementById('stat').innerText = '不可借';
                document.getElementById("submit").value = '還車';
                car = snapshot.child('/car').val();
                document.getElementById('car').innerText = car;
                document.getElementById('submit').onclick = returnCar;
                document.getElementsByTagName('section')[0].style.display = 'none';
            } else {
                document.getElementById('stat').innerText = '可借';
                displayCarAvailable();
            }
        } else {
            document.getElementById('car').innerText = "none";
        }
    }).catch((error) => {
        console.log(error);
    });
}

function displayCarAvailable() {
    let alphabet = { 0: "A", 1: "B", 2: "C", 3: "D" };
    let element = document.getElementsByTagName('select')[0]
    get(ref(db, '/car/')).then((snapshot) => {
        if (snapshot.exists()) {
            for (let i = 0; i < 4; i++) {
                if (!snapshot.child(alphabet[i] + '/stat').val()) {
                    let opt = document.createElement('option');
                    opt.value = alphabet[i];
                    opt.innerText = alphabet[i];
                    element.appendChild(opt);
                }
            }
        }
    }).catch((error) => {
        console.log(error);
    });
}

async function submit() {
    let selectRessault = document.getElementsByTagName('select')[0].value;
    await update(ref(db, '/user/' + uid), {
        "car": selectRessault,
        "stat": true
    }).catch((error) => {
        console.log(error);
    });
    await update(ref(db, '/car/' + selectRessault), {
        "lessee": name,
        "stat": true
    }).catch((error) => {
        console.log(error);
    });

    let data = {
        TIME: new Date().toLocaleString("zh-Hant-TW"),
        LESSEE: name,
        CAR: selectRessault
    };
    await signOut(auth);
    window.alert("succ!!signed out");
    location.reload();
}

async function returnCar() {
    console.log("returner in!!!");
    update(ref(db, '/car/' + car), {
        "lessee": "",
        "stat": false
    }).catch((error) => {
        console.log(error);
    });
    update(ref(db, '/user/' + uid), {
        "car": "",
        "stat": false
    }).catch((error) => {
        console.log(error);
    });

    await signOut(auth);
    window.alert("succ!!signed out");
    location.reload();
}

document.getElementById("logIn").onclick = myGetAuth;
document.getElementById("submit").onclick = submit;
document.getElementById("statBody").onload =myBodyOnload;
