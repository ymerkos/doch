//B"H

import firebaseConfig from "/config.js"
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";

import { getAuth, signOut, signInWithPopup, GoogleAuthProvider, onAuthStateChanged} 
from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

import { getFirestore, doc, getDoc } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js';
var isEditing = location.search == "?edit";
window.isEditing = isEditing;
if(isEditing) {
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);


const firestore = getFirestore(app);


const googleProvider = new GoogleAuthProvider();
var loginBtn = document.querySelector(".loginBtn");

var isAllowed = false;
onAuthStateChanged(auth, async (user) => {
    console.log("hi!");

    if (user) {
      // User is signed in
      isAllowed = await isAuthorized(user)
      window.isAllowed = isAllowed;
      window.activeUser = user;
      console.log('User is signed in:', user, isAllowed);
      loginBtn.innerText = "Log out";
      loginBtn.onclick = signOutBtn;

    } else {
      // User is signed out
      window.isAllowed = false;
      loginBtn.innerText = "Log in";
      loginBtn.onclick = signInGoogle;
      console.log('User is signed out');
    }

    // Create a custom event with some detail (data)
    var changedAuth = new CustomEvent("awtsmoosAuth", {
      detail: {
        isAllowed,
        user
      } // You can pass any data you want in the detail property
    });
    window.dispatchEvent(changedAuth);

  });

  
  loginBtn.onclick = signInGoogle;

function signOutBtn() {
    
    signOut(auth).then(() => {
        console.log('User signed out');
    }).catch((error) => {
        console.error('Sign out error:', error.message);
    });
}

function signInGoogle() {

    // Login
    
    signInWithPopup(auth, googleProvider)
    .then((result) => {
      const user = result.user;
      console.log('Google Sign-In successful:', user);
    })
    .catch((error) => {
      console.error('Google Sign-In error:', error.message);
    });
    
}

async function isAuthorized (user) {
    if (user) {
        const authorizedUsersRef = doc(firestore, 'authorized_users', user.email);

        try {
            const authorizedUserDoc = await getDoc(authorizedUsersRef);

            return authorizedUserDoc.exists()
        } catch (error) {
            return false
        }
    } else {
        resolve(false); // No user signed in
    }
  };
} else {
  window.isAllowed = false;
}