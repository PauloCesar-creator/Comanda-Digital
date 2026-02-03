
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

// PARE AQUI! Cole suas credenciais do Firebase abaixo:
const firebaseConfig = {
  apiKey: "AIzaSyBV_E8868Dw7Pvo41DkYmoRy55bZtW7wzU",
  authDomain: "comandadigital-e730e.firebaseapp.com",
  projectId: "comandadigital-e730e",
  storageBucket: "comandadigital-e730e.firebasestorage.app",
  messagingSenderId: "101301917939",
  appId: "1:101301917939:web:facb2d213941d4b97dff86"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
