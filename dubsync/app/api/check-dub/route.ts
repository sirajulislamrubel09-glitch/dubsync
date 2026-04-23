export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get('id')
  
  if (!id) return NextResponse.json({ error: 'No ID!' }, { status: 400 })

  const response = await fetch(`https://api.replicate.com/v1/predictions/${id}`, {
    headers: {
      'Authorization': `Token ${process.env.REPLICATE_API_TOKEN}`,
    }
  })

  const prediction = await response.json()
  return NextResponse.json(prediction)
}
