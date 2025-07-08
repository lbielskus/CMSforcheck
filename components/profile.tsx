import React, { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface Order {
  _id: string;
  paid: boolean;
  email: string;
}

const UserProfile = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (status === 'loading' || status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        if (session && session.user && session.user.email) {
          const email = session.user.email;
          const res = await axios.get<Order[]>(
            `/api/user-orders?email=${email}`
          );
          setOrders(res.data);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, [session]);

  const handleSignOut = async () => {
    try {
      await signOut();
      console.log('User signed out successfully.');
      router.push('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className='flex justify-center items-center h-screen'>
      <div className='flex flex-col justify-center items-center w-2/5 h-full p-16'>
        {session && session.user && (
          <>
            <h3 className='mb-4 text-2xl'>
              Hello, {session.user.fullName || ''} !
            </h3>
            <h5 className='mb-4 text-slateblue'>{session.user.email}</h5>

            <button
              className='bg-third hover:bg-hover3 text-black font-bold py-2 px-4 rounded'
              onClick={handleSignOut}
            >
              Logout
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
