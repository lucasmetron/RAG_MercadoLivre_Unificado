import { askQuestion, extractAnswer } from './ragClient'

describe('ragClient', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('extracts the assistant content from the backend response', () => {
    expect(
      extractAnswer({
        resp: {
          choices: [
            {
              message: {
                content: ' Frete gratis a partir de R$ 79. ',
              },
            },
          ],
        },
      }),
    ).toBe('Frete gratis a partir de R$ 79.')
  })

  it('posts the user question and returns the normalized answer', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        resp: {
          choices: [{ message: { content: 'Resposta da API' } }],
        },
        context: 'Contexto usado',
      }),
    })
    vi.stubGlobal('fetch', fetchMock)

    await expect(askQuestion('como consigo frete gratis?')).resolves.toEqual({
      answer: 'Resposta da API',
      context: 'Contexto usado',
    })
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/ask',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ question: 'como consigo frete gratis?' }),
      }),
    )
  })

  it('throws a friendly error when the backend fails', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        json: async () => ({}),
      }),
    )

    await expect(askQuestion('oi')).rejects.toThrow(
      'Nao foi possivel obter uma resposta agora.',
    )
  })
})
