import { NextRequest, NextResponse } from 'next/server'
import Groq from 'groq-sdk'

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!
})

export async function POST(request: NextRequest) {
  try {
    const { content } = await request.json()

    if (!content || content.length < 20) {
      return NextResponse.json(
        { tags: [] },
        { status: 400 }
      )
    }

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `Jesteś ekspertem od analizy emocjonalnej listów żałobnych. 
Generuj maksymalnie 5 tagów (pojedyncze słowa PO POLSKU) opisujących główny temat i emocje w liście.
Tagi powinny być proste, zrozumiałe, bez polskich znaków.
Format: tag1 tag2 tag3 (bez #, oddzielone spacjami, małe litery)`
        },
        {
          role: 'user',
          content: `List: "${content.substring(0, 500)}"`
        }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.3,
      max_tokens: 50,
    })

    const response = completion.choices[0]?.message?.content || ''
    const tags = response
      .toLowerCase()
      .replace(/[#,]/g, ' ')
      .split(/\s+/)
      .filter(tag => tag.length > 2 && tag.length < 20)
      .slice(0, 5)

    return NextResponse.json({ tags })
  } catch (error) {
    console.error('AI tagging error:', error)
    return NextResponse.json(
      { tags: [] },
      { status: 500 }
    )
  }
}
