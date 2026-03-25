import mongoose from "mongoose";
import { NextResponse } from "next/server";

import connectDB from "@/lib/mongodb";
import Todo from "@/models/Todo";

type Params = {
  params: Promise<{ id: string }>;
};

function invalidIdResponse() {
  return NextResponse.json(
    { success: false, message: "Invalid todo id" },
    { status: 400 },
  );
}

export async function GET(_: Request, { params }: Params) {
  const { id } = await params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return invalidIdResponse();
  }

  try {
    await connectDB();
    const todo = await Todo.findById(id);

    if (!todo) {
      return NextResponse.json(
        { success: false, message: "Todo not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, data: todo }, { status: 200 });
  } catch {
    return NextResponse.json(
      { success: false, message: "Failed to fetch todo" },
      { status: 500 },
    );
  }
}

export async function PUT(req: Request, { params }: Params) {
  const { id } = await params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return invalidIdResponse();
  }

  try {
    await connectDB();
    const body = await req.json();

    if (!body?.title || String(body.title).trim().length === 0) {
      return NextResponse.json(
        { success: false, message: "Title is required" },
        { status: 400 },
      );
    }

    const todo = await Todo.findByIdAndUpdate(
      id,
      {
        title: String(body.title).trim(),
        description: body.description ? String(body.description).trim() : "",
        completed: Boolean(body.completed),
      },
      { new: true, runValidators: true },
    );

    if (!todo) {
      return NextResponse.json(
        { success: false, message: "Todo not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, data: todo }, { status: 200 });
  } catch {
    return NextResponse.json(
      { success: false, message: "Failed to update todo" },
      { status: 500 },
    );
  }
}

export async function DELETE(_: Request, { params }: Params) {
  const { id } = await params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return invalidIdResponse();
  }

  try {
    await connectDB();
    const todo = await Todo.findByIdAndDelete(id);

    if (!todo) {
      return NextResponse.json(
        { success: false, message: "Todo not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { success: true, message: "Todo deleted" },
      { status: 200 },
    );
  } catch {
    return NextResponse.json(
      { success: false, message: "Failed to delete todo" },
      { status: 500 },
    );
  }
}
