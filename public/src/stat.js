/**
 * v 0.0.2
 */
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { ref, child, getDatabase, onValue } from "firebase/database";
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
const db = getDatabase(app);

export function myBodyOnload() {
    let alphabat = { 0: "A", 1: "B", 2: "C", 3: "D" };
    let item=document.getElementsByTagName('td');
    onValue(ref(db, '/car/'), (snapshot) => {
        for(let i=0;i<4;i++) {
            item[i*3+2].innerText=snapshot.child(alphabat[i]+'/lessee').val();
            if(!snapshot.child(alphabat[i]+'/stat').val()) {
                item[i*3+1].innerText='可借用';
                item[i*3+1].style.backgroundColor="#80ff9f";
            }
            else{
                item[i*3+1].innerText='已被借用';
                item[i*3+1].style.backgroundColor="#ff704d";
            }
        }
    });
}

document.getElementsByTagName("body")[0].onload=myBodyOnload;
