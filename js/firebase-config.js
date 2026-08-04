// Firebase Configuration
// تبديل هذه البيانات بـ بيانات Firebase الخاصة بك

const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "x7-organization.firebaseapp.com",
    projectId: "x7-organization",
    storageBucket: "x7-organization.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Get references
const auth = firebase.auth();
const database = firebase.database();

console.log('Firebase initialized successfully! ✅');
