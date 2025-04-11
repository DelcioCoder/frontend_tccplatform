import { cookies } from "next/headers"

export async function getOrCreateConversation(advisorId: number, studentId: number) {
    const cookieStore = await cookies()
    const accessToken = cookieStore.get("access")?.value
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat/conversations/get_or_create/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
            advisor: advisorId,
            student: studentId,
        }),
    })

    if (!response.ok) {
        throw new Error("Failed to fetch conversations")
    }
    const data = await response.json()
    return data.id
}