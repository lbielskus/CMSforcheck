import { NextRouter } from 'next/router';

const restrictAccess = (user: any, router: NextRouter) => {
  if (!user) {
    router.push('/login');
  }
};

export default restrictAccess;
