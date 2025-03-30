import { Advisor } from "@/types/advisor";

export async function getAdvisors(): Promise<Advisor[]> {
    const response = await fetch('http://localhost:8000/api/profiles/advisors', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQzNDAzODg4LCJpYXQiOjE3NDMzMTc0ODgsImp0aSI6IjkwOGIzODJjNWEwYjRkMzk5YWQ4NDRiNjU0N2Y5ZjRiIiwidXNlcl9pZCI6MjB9.Og5Ejyq2Q0WA-y-E1sEzRfICvKrC6942mHHkRGXpzAg'
        }
    })

    if (!response.ok) {
        throw new Error('Failed to fetch advisors');
    }

    return response.json();
}