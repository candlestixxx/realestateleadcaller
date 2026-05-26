import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: "Mock settings API endpoint." });
}

export async function POST() {
  return NextResponse.json({ message: "Settings saved successfully." });
}
