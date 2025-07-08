import { Session } from 'next-auth';
import { NextRouter } from 'next/router';

const restrictAccess = (session: Session | null, router: NextRouter) => {
  const restrictedEmail = 'kanopa@kanopa.lt';

  if (!session) {
    setTimeout(() => {
      router.push('/login');
    }, 100);
    return false;
  }

  if (session.user?.email !== restrictedEmail) {
    setTimeout(() => {
      router.push('/unauthorized');
    }, 100);
    return false;
  }

  return true;
};

export default restrictAccess;
