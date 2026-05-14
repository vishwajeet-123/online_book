import { initializeApp, getApp, getApps, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore, collection, getDocs } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import config from '../../../firebase-applet-config.json';

class FirebaseConnection {
  private static instance: FirebaseConnection;
  private app: FirebaseApp;
  private db: Firestore;
  private auth: Auth;

  private constructor() {
    if (!getApps().length) {
      this.app = initializeApp(config);
    } else {
      this.app = getApp();
    }
    
    this.db = getFirestore(this.app, config.firestoreDatabaseId || undefined);
    this.auth = getAuth(this.app);
    
    console.log("Firebase Singleton (Client SDK): Database connection initialized.");
  }

  public static getInstance(): FirebaseConnection {
    if (!FirebaseConnection.instance) {
      FirebaseConnection.instance = new FirebaseConnection();
    }
    return FirebaseConnection.instance;
  }

  public getDb(): Firestore {
    return this.db;
  }

  public getAuth(): Auth {
    return this.auth;
  }
}

export const firebaseAdmin = FirebaseConnection.getInstance();
export const db = firebaseAdmin.getDb();
export const auth = firebaseAdmin.getAuth();
