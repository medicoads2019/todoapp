import { NextResponse } from "next/server";

import connectDB from "@/lib/mongodb";
import Todo from "@/models/Todo";

export async function GET() {
  try {
    await connectDB();
    const todos = await Todo.find().sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: todos }, { status: 200 });
  } catch {
    return NextResponse.json(
      { success: false, message: "Failed to fetch todos" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    if (!body?.title || String(body.title).trim().length === 0) {
      return NextResponse.json(
        { success: false, message: "Title is required" },
        { status: 400 },
      );
    }

    const todo = await Todo.create({
      title: String(body.title).trim(),
      description: body.description ? String(body.description).trim() : "",
      completed: Boolean(body.completed),
    });

    return NextResponse.json({ success: true, data: todo }, { status: 201 });
  } catch {
    return NextResponse.json(
      { success: false, message: "Failed to create todo" },
      { status: 500 },
    );
  }
}
