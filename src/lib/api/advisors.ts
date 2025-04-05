"use server";
import { Advisor } from "@/types/advisor";
import { cookies } from "next/headers";

export async function getAdvisors(): Promise<Advisor[]> {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('access')?.value;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const response = await fetch(`${apiUrl}/profiles/advisors`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        }
    })

    if (!response.ok) {
        throw new Error('Failed to fetch advisors');
    }

    return response.json();
}