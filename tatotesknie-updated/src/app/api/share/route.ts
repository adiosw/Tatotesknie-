import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const letterId = searchParams.get('letterId')

    if (!letterId) {
      return NextResponse.json(
        { error: 'Missing letterId' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('letters')
      .select('*')
      .eq('id', letterId)
      .eq('approved', true)
      .single()

    if (error || !data) {
      return NextResponse.json(
        { error: 'Letter not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal error' },
      { status: 500 }
    )
  }
}
