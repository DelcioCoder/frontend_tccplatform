import { Metadata } from 'next';
import Head from 'next/head';

export const metadata: Metadata = {
    title: { absolute: 'TCCLink' },
    verification: {
        google: 'RBoSJTOl7CYMp08m-MI13VeVGSHQs6K-4NDNVBLwhKU',
    },
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