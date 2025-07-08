import React, { useEffect } from 'react';
import LoginForm from '../components/Form/LoginForm';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import restrictAccess from '../utils/auth';

const Login = () => {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    restrictAccess(session, router);
  }, [session, router]);

  return <LoginForm />;
};

export default Login;
