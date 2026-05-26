import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const settings = await prisma.integrationSettings.findMany();
    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { provider, apiKey } = body;

    const existingSetting = await prisma.integrationSettings.findFirst({
      where: { provider }
    });

    let setting;
    if (existingSetting) {
      setting = await prisma.integrationSettings.update({
        where: { id: existingSetting.id },
        data: { apiKey }
      });
    } else {
      setting = await prisma.integrationSettings.create({
        data: { provider, apiKey }
      });
    }

    return NextResponse.json({ message: "Settings saved successfully.", setting });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
  }
}
