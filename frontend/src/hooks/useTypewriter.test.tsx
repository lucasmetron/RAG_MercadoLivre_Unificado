import { act, renderHook } from '@testing-library/react'
import { useTypewriter } from './useTypewriter'

describe('useTypewriter', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('reveals text word by word when enabled', async () => {
    const { result } = renderHook(() => useTypewriter('ola mercado livre', true, 10))

    expect(result.current.displayedText).toBe('')
    expect(result.current.isTyping).toBe(true)

    await act(async () => {
      await vi.advanceTimersByTimeAsync(10)
    })
    expect(result.current.displayedText).toBe('ola ')

    await act(async () => {
      await vi.advanceTimersByTimeAsync(10)
    })
    await act(async () => {
      await vi.advanceTimersByTimeAsync(10)
    })
    expect(result.current.displayedText).toBe('ola mercado livre')
    expect(result.current.isTyping).toBe(false)
  })

  it('returns the full text when animation is disabled', () => {
    const { result } = renderHook(() => useTypewriter('resposta pronta', false))

    expect(result.current.displayedText).toBe('resposta pronta')
    expect(result.current.isTyping).toBe(false)
  })
})
