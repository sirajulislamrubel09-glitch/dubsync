export const runtime = 'nodejs'
export const maxDuration = 60

import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const video = formData.get('video') as File
    const audio = formData.get('audio') as File

    if (!video || !audio) {
      return NextResponse.json({ error: 'Video and audio required!' }, { status: 400 })
    }

    const videoBuffer = Buffer.from(await video.arrayBuffer())
    const audioBuffer = Buffer.from(await audio.arrayBuffer())
    const videoBase64 = `data:video/mp4;base64,${videoBuffer.toString('base64')}`
    const audioBase64 = `data:audio/mp3;base64,${audioBuffer.toString('base64')}`

    const response = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${process.env.REPLICATE_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        version: '36e77d448cfbb56de349044b7f6ebe0e7db696332ffb219425e2a2382c7f0e74',
        input: {
          face: videoBase64,
          audio: audioBase64,
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
