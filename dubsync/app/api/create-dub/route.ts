export const runtime = 'nodejs'
export const maxDuration = 60

import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { video, audio } = body

    if (!video || !audio) {
      return NextResponse.json({ error: 'Video and audio required!' }, { status: 400 })
    }

    const response = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${process.env.REPLICATE_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        version: '36e77d448cfbb56de349044b7f6ebe0e7db696332ffb219425e2a2382c7f0e74',
        input: {
          face: video,
          audio: audio,
        }
      })
    })

    const prediction = await response.json()

    if (prediction.error) {
      return NextResponse.json({ error: prediction.error }, { status: 500 })
    }

    return NextResponse.json({
      predictionId: prediction.id,
      status: prediction.status
    })

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
