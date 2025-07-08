// firebase/hooks.ts
import { getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { app, auth as firebaseAuth } from './init';

const login = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      firebaseAuth,
      email,
      password
    );
    return userCredential.user;
  } catch (error) {
    console.error(error);
    return null;
  }
};
