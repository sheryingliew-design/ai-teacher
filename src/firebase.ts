import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDF2woLu-mkCRMnc4ga6eHybEmm4TB8upI",
  authDomain: "notimonkeys-ai.firebaseapp.com",
  projectId: "notimonkeys-ai",
  storageBucket: "notimonkeys-ai.firebasestorage.app",
  messagingSenderId: "952329521412",
  appId: "1:952329521412:web:40ffd59ae6e7d281cda851",
  measurementId: "G-GE0ZQQWV1K"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics conditionally to avoid errors in environments where it might not be supported (e.g., some iframes)
let analytics;
try {
  analytics = getAnalytics(app);
} catch (error) {
  console.warn("Firebase Analytics could not be initialized", error);
}

export { app, analytics };
