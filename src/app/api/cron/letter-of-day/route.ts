import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  try {
    const { error } = await supabaseAdmin
      .rpc('set_letter_of_day')
    
    if (error) {
      console.error('Failed to set letter of day:', error)
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }
    
    return NextResponse.json({ 
      success: true,
      message: 'Letter of day updated successfully'
    })
  } catch (error) {
    console.error('Cron error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal error' },
      { status: 500 }
    )
  }
}
