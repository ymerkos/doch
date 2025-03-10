//B"H
console.log(`B"H`)
import firebaseConfig from "/config.js"
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";

import { getAuth, signOut, signInWithPopup, GoogleAuthProvider, onAuthStateChanged} 
from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

import { getFirestore, doc, getDoc, getDocs } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js';
var isEditing = location.search == "?edit" || location.pathname == "/admin/";
window.isEditing = isEditing;

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);


const firestore = getFirestore(app);


const googleProvider = new GoogleAuthProvider();
var loginBtn = document.querySelector(".loginBtn");

var isAllowed = false;
console.log("Login file")
await checkIfLoggedin();

window.checkIfLoggedin = checkIfLoggedin;
async function checkIfLoggedin() {
  var user = auth.currentUser;
  window.user = user;


    if (user) {
      // User is signed in
      isAllowed = await isAuthorized(user)
      window.isAllowed = isAllowed;
      window.activeUser = user;
      console.log('User is signed in:', user, isAllowed);
      if(window.loginBtn ) {
        loginBtn.innerText = "Log out";
        loginBtn.onclick = signOutBtn;
        loginBtn.classList.remove("hidden")
      }

    } else {
      // User is signed out
      window.isAllowed = false;
      if(window.loginBtn ) {
        
        loginBtn.classList.remove("hidden")
        loginBtn.innerText = "Log in";
        loginBtn.onclick = signInGoogle;
      }
      console.log('User is signed out');
    }

    var logged = {
      isAllowed,
      user
    }
    // Create a custom event with some detail (data)
    var changedAuth = new CustomEvent("awtsmoosAuth", {
      detail: logged // You can pass any data you want in the detail property
    });
    window.dispatchEvent(changedAuth);
   
    
    return logged;
}
window.checkIfLoggedin = checkIfLoggedin;
if(isEditing) {
onAuthStateChanged(auth, async (user) => {
    console.log("hi!");

    if (user) {
      // User is signed in
      isAllowed = await isAuthorized(user)
      window.isAllowed = isAllowed;
      window.activeUser = user;
      console.log('User is signed in:', user, isAllowed);
      if(window.loginBtn) {
        loginBtn.innerText = "Log out";
        loginBtn.onclick = signOutBtn;
      }
    } else {
      // User is signed out
      window.isAllowed = false;
      if(window.loginBtn) {
        loginBtn.innerText = "Log in";
        loginBtn.onclick = signInGoogle;
      }
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

} else {
  window.isAllowed = false;
}

  if(window.loginBtn)
  loginBtn.onclick = signInGoogle;

function signOutBtn() {
    console.log("Signin out")
    signOut(auth).then(() => {
        console.log('User signed out');
    }).catch((error) => {
        console.error('Sign out error:', error.message);
    });
}

window.signOutBtn = signOutBtn;
async function signInGoogle() {
  console.log("Trying to sign in firebase")
    // Login
    try {
        var result = await signInWithPopup(auth, googleProvider)
        const user = result.user;
        console.log('Google Sign-In successful:', user);
        return result;
    } catch(error) {
      console.error('Google Sign-In error:', error.message);
      return null;
    }
    
}

window.signInGoogle = signInGoogle;

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
