import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { generateFingerprint } from '@/lib/utils'

export async function POST(request: NextRequest) {
  try {
    const { letterId } = await request.json()

    if (!letterId) {
      return NextResponse.json(
        { success: false, error: 'Missing letterId' },
        { status: 400 }
      )
    }

    // Generate fingerprint (NO IP stored!)
    const fingerprint = generateFingerprint()

    // Call Supabase function (atomic operation)
    const { data, error } = await supabaseAdmin
      .rpc('increment_feels', {
        letter_uuid: letterId,
        fp: fingerprint
      })

    if (error) {
      console.error('Failed to increment feels:', error)
      return NextResponse.json(
        { success: false, error: 'Already felt or error' },
        { status: 400 }
      )
    }

    return NextResponse.json({ success: data })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal error' },
      { status: 500 }
    )
  }
}
