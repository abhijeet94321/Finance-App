
import { ImageResponse } from 'next/og'

export const runtime = 'edge'

// Chrome PWA requires at least 192x192 and 512x512. 
// We generate a 512x512 icon which the browser can scale down.
export const size = {
  width: 512,
  height: 512,
}
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 280,
          background: '#9e9eff',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#0a0a1a',
          borderRadius: '112px',
          fontWeight: 'bold',
          fontFamily: 'sans-serif',
        }}
      >
        S
      </div>
    ),
    {
      ...size,
    }
  )
}
