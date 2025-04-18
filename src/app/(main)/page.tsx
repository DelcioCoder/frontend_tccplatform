import { Metadata } from 'next';

export const metadata: Metadata = {
    title: { absolute: 'TCCLink' },
    robots: {
        index: true,
        follow: true,
        nocache: true,
        googleBot: {
            index: true,
            follow: true,
            nocache: true,
        },
    },
};

import Hero from "@/components/Hero"
import FeaturedMentors from "@/components/FeaturedMentors"
import UnauthenticatedHome from "@/components/UnauthenticatedHome"
import { cookies } from "next/headers"

export default async function Home() {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('access')?.value;
    const isAuthenticated = !!accessToken;

    return (
        <div>
            {isAuthenticated ? (
                <>
                    <Hero />
                    <FeaturedMentors />
                </>
            ) : (
                <UnauthenticatedHome />
            )}
        </div>
    )
}