import { useEffect, useMemo, useState } from 'react'

export function useTypewriter(text: string, enabled: boolean, speed = 55) {
  const tokens = useMemo(() => text.match(/\S+\s*/g) ?? [], [text])
  const [index, setIndex] = useState(enabled ? 0 : tokens.length)

  useEffect(() => {
    setIndex(enabled ? 0 : tokens.length)
  }, [enabled, text, tokens.length])

  useEffect(() => {
    if (!enabled || index >= tokens.length) {
      return
    }

    const timer = window.setTimeout(() => {
      setIndex((current) => Math.min(current + 1, tokens.length))
    }, speed)

    return () => window.clearTimeout(timer)
  }, [enabled, index, speed, tokens.length])

  return {
    displayedText: tokens.slice(0, index).join(''),
    isTyping: enabled && index < tokens.length,
  }
}
