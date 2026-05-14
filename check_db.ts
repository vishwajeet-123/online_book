import { initializeApp, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

async function check() {
  const app = getApps().length ? getApps()[0] : initializeApp();
  
  console.log("--- Testing TOTAL DEFAULT ---");
  try {
    const db = getFirestore();
    const snapshot = await db.collection("books").get();
    console.log(`SUCCESS: Found ${snapshot.size} books.`);
  } catch (err: any) {
    console.error(`FAILED:`, err.message);
  }
}

check();
