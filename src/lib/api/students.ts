'use server'
import { Student } from "@/types/student";
import { cookies } from "next/headers";

export async function getStudents(): Promise<Student[]> {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('access')?.value;
    
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const response = await fetch(`${apiUrl}/profiles/students`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch students');
    }

    return response.json();
}   