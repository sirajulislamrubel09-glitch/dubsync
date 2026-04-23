import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const video = formData.get('video') as File
    const audio = formData.get('audio') as File

    if (!video || !audio) {
      return NextResponse.json({ error: 'Video and audio required!' }, { status: 400 })
    }

    // Convert to base64 for Replicate
    const videoBuffer = await video.arrayBuffer()
    const audioBuffer = await audio.arrayBuffer()
    const videoBase64 = `data:video/mp4;base64,${Buffer.from(videoBuffer).toString('base64')}`
    const audioBase64 = `data:audio/mp3;base64,${Buffer.from(audioBuffer).toString('base64')}`

    // Call Replicate Wav2Lip API
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

    // Poll for result
    let result = prediction
    while (result.status !== 'succeeded' && result.status !== 'failed') {
      await new Promise(r => setTimeout(r, 3000))
      const poll = await fetch(`https://api.replicate.com/v1/predictions/${result.id}`, {
        headers: { 'Authorization': `Token ${process.env.REPLICATE_API_TOKEN}` }
      })
      result = await poll.json()
    }

    if (result.status === 'failed') {
      return NextResponse.json({ error: 'Lip sync failed! Try again.' }, { status: 500 })
    }

    return NextResponse.json({ output: result.output })

  } catch (error) {
    return NextResponse.json({ error: 'Server error!' }, { status: 500 })
  }
}
