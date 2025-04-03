import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
    const accessToken = request.cookies.get('access')?.value;
    
    // Array de rotas públicas que não precisam de autenticação
    const publicRoutes = ['/', '/login', '/register'];
    const isPublicRoute = publicRoutes.includes(request.nextUrl.pathname);

    // Se não tiver token e tentar acessar uma rota protegida
    if (!accessToken && !isPublicRoute) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    // Se tiver token e tentar acessar rotas de login/registro
    if (accessToken && ['/login', '/register'].includes(request.nextUrl.pathname)) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};