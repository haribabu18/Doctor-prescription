// app/lib/auth.ts
'use server';

import { cookies } from 'next/headers';

export async function isAuthenticated() {
  // Correct synchronous access
  const cookieStore = await cookies();
  const token = cookieStore.get('session')?.value;

  if (!token) return false;
  
  try {
    const { jwtVerify } = await import('jose');
    await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET!)
    );
    return true;
  } catch {
    return false;
  }
}