export type AskResponse = {
  question?: string
  resp?: {
    choices?: Array<{
      message?: {
        content?: string
      }
    }>
  }
  context?: string
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api'

export function extractAnswer(data: AskResponse): string {
  return data.resp?.choices?.[0]?.message?.content?.trim() || ''
}

export async function askQuestion(question: string, signal?: AbortSignal) {
  const response = await fetch(`${API_BASE_URL}/ask`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ question }),
    signal,
  })

  if (!response.ok) {
    throw new Error('Nao foi possivel obter uma resposta agora.')
  }

  const data = (await response.json()) as AskResponse
  const answer = extractAnswer(data)

  if (!answer) {
    throw new Error('A API respondeu, mas nao retornou conteudo.')
  }

  return {
    answer,
    context: data.context?.trim() || '',
  }
}
