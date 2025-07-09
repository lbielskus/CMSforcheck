import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAuth, signOut as firebaseSignOut, User } from 'firebase/auth';
import { app } from '../lib/firebaseClient'; // adjust path if needed

const UserProfile = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = getAuth(app).onAuthStateChanged((firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
      if (!firebaseUser) {
        router.push('/login');
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleSignOut = async () => {
    try {
      await firebaseSignOut(getAuth(app));
      router.push('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className='flex justify-center items-center h-screen w-full'>
      <div className='flex flex-col justify-center items-center w-full h-full p-16'>
        {user && (
          <>
            <h3 className='mb-4 text-2xl'>
              Sveiki, {user.displayName || user.email || ''}!
            </h3>
            <h5 className='mb-4 text-slateblue'>{user.email}</h5>
            <button
              className='bg-third hover:bg-hover3 text-white bg-purple-900 hover:bg-purple-800 font-bold py-2 px-4 rounded'
              onClick={handleSignOut}
            >
              Atsijungti
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
