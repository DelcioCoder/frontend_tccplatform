import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get('access')?.value;
  
  if (!token) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }
  
  return NextResponse.json({ token });
}