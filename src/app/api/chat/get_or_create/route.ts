import { NextResponse } from "next/server";
import { getOrCreateConversation } from "@/lib/api/chat"; 

export async function POST(request: Request) {
  // Extraí os dados do body
  const body = await request.json();
  const { advisor_id, student_id } = body;
  
  try {
    const conversationId = await getOrCreateConversation(advisor_id, student_id);
  
    return NextResponse.json({ id: conversationId });
  } catch {
    return NextResponse.json({ error: "Failed to fetch conversations" }, { status: 500 });
  }
}
