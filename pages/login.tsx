import React, { useEffect } from 'react';
import LoginForm from '../components/Form/LoginForm';
import { useRouter } from 'next/router';
import { auth } from '../lib/firebaseClient'; // Make sure this exports your Firebase Auth instance
import { onAuthStateChanged } from 'firebase/auth';

const Login = () => {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push('/');
      }
    });
    return () => unsubscribe();
  }, [router]);

  return <LoginForm />;
};

export default Login;
