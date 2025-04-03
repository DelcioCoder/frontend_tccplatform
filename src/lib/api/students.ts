'use server'
import { Student } from "@/types/student";
import { cookies } from "next/headers";

export async function getStudents(): Promise<Student[]> {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('access')?.value;

    const response = await fetch('http://localhost:8000/api/profiles/students', {
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