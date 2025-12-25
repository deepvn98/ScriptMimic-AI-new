
// Use standard Firebase v9+ modular imports.
// Fixed: Ensured initializeApp is correctly imported as a named member from "firebase/app".
import { initializeApp } from "firebase/app";
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  getDocs, 
  deleteDoc
} from "firebase/firestore";
import { StyleDNA, AdminLicense, GeneratedScript } from "../types";

// Firebase configuration for persistent storage
const firebaseConfig = {
  apiKey: "AIzaSyDRRwzI1vmJzJ2U_ml97XT8TlR9ZLQ2eds",
  authDomain: "scriptmimic-ai.firebaseapp.com",
  projectId: "scriptmimic-ai",
  storageBucket: "scriptmimic-ai.firebasestorage.app",
  messagingSenderId: "113827431284",
  appId: "1:113827431284:web:fa971e2554a9e886b4a221",
  measurementId: "G-X03PMZKJX2"
};

// Initialize Firebase with the provided config.
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export const firebaseService = {
  // --- System & Security ---
  async checkAdminPassword(input: string): Promise<boolean> {
    try {
      const docRef = doc(db, "system", "auth");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data().adminPass === input;
      }
      return false;
    } catch (e) {
      console.error("Admin check error:", e);
      return false;
    }
  },

  // --- License Management ---
  async validateLicense(code: string): Promise<AdminLicense | null> {
    try {
      const docRef = doc(db, "licenses", code);
      const docSnap = await getDoc(docRef);
      return docSnap.exists() ? docSnap.data() as AdminLicense : null;
    } catch (e) {
      console.error("Firebase validate error:", e);
      return null;
    }
  },

  async createLicense(userName: string, licenseCode: string): Promise<void> {
    const license: AdminLicense = {
      id: crypto.randomUUID(),
      userName,
      licenseCode,
      createdAt: Date.now()
    };
    await setDoc(doc(db, "licenses", licenseCode), license);
  },

  async getAllLicenses(): Promise<AdminLicense[]> {
    const querySnapshot = await getDocs(collection(db, "licenses"));
    return querySnapshot.docs.map(doc => doc.data() as AdminLicense);
  },

  async deleteLicense(licenseCode: string): Promise<void> {
    await deleteDoc(doc(db, "licenses", licenseCode));
  },

  // --- Style DNA Management ---
  async saveDNA(licenseCode: string, dna: StyleDNA): Promise<void> {
    await setDoc(doc(db, "licenses", licenseCode, "dnas", dna.id), dna);
  },

  async getDNAs(licenseCode: string): Promise<StyleDNA[]> {
    const querySnapshot = await getDocs(collection(db, "licenses", licenseCode, "dnas"));
    return querySnapshot.docs.map(doc => doc.data() as StyleDNA);
  },

  async deleteDNA(licenseCode: string, dnaId: string): Promise<void> {
    await deleteDoc(doc(db, "licenses", licenseCode, "dnas", dnaId));
  },

  // --- Script Management ---
  async saveScript(licenseCode: string, script: GeneratedScript): Promise<void> {
    await setDoc(doc(db, "licenses", licenseCode, "scripts", script.id), script);
  },

  async getScripts(licenseCode: string): Promise<GeneratedScript[]> {
    const querySnapshot = await getDocs(collection(db, "licenses", licenseCode, "scripts"));
    return querySnapshot.docs.map(doc => doc.data() as GeneratedScript);
  }
};
