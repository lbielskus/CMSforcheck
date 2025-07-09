import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { getAuth, signOut as firebaseSignOut, User } from 'firebase/auth';
import { app } from '../lib/firebaseClient'; // adjust path if needed

interface Order {
  _id: string;
  paid: boolean;
  email: string;
}

const UserProfile = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const unsubscribe = getAuth(app).onAuthStateChanged((firebaseUser) => {
      setUser(firebaseUser);
      if (!firebaseUser) {
        router.push('/login');
      }
    });
    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        if (user && user.email) {
          const res = await axios.get<Order[]>(
            `/api/user-orders?email=${user.email}`
          );
          setOrders(res.data);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, [user]);

  const handleSignOut = async () => {
    try {
      await firebaseSignOut(getAuth(app));
      router.push('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (!user) return null;

  return (
    <div className='flex justify-center items-center h-screen'>
      <div className='flex flex-col justify-center items-center w-2/5 h-full p-16'>
        <h3 className='mb-4 text-2xl'>
          Hello, {user.displayName || user.email || ''}!
        </h3>
        <h5 className='mb-4 text-slateblue'>{user.email}</h5>

        <button
          className='bg-third hover:bg-hover3 text-black font-bold py-2 px-4 rounded'
          onClick={handleSignOut}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default UserProfile;
