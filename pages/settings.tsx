import React, { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const UserProfile = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'loading') return;
    if (status === 'unauthenticated') {
      router.push('/login');
    } else {
      setLoading(false);
    }
  }, [status, router]);

  const handleSignOut = async () => {
    try {
      await signOut();
      console.log('User signed out successfully.');
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
      <div className='flex flex-col justify-center items-center w-full  h-full p-16'>
        {session && session.user && (
          <>
            <h3 className='mb-4 text-2xl'>
              {' '}
              Sveiki, {session.user.fullName || ''} !
            </h3>
            <h5 className='mb-4 text-slateblue'>{session.user.email}</h5>

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
