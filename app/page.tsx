
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Dashboard } from './layout-wrapper';

export default async function LayoutWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies();
  const session = cookieStore.get('session')?.value;

  if (process.env.NEXT_PUBLIC_LOGIN_ENABLED === 'true' && !session) {
    redirect('/login');
  }

  return <Dashboard>{children}</Dashboard>;
}
