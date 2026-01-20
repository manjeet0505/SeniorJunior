const { NextResponse } = require('next/server');

export async function GET() {
  return NextResponse.json({ message: 'API works', timestamp: new Date() });
}
