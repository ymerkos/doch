//B"H

import firebaseConfig from "./config.js"
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import {
    getFirestore,
    collection,
    query,
    where,
	addDoc,
    getDocs 
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
var db = null;
var sichaId = null;


const app = initializeApp(firebaseConfig);

db = getFirestore();

