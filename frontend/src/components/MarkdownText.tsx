type MarkdownTextProps = {
  text: string
}

function renderInline(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)

  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={`${part}-${index}`} className="font-semibold text-zinc-950">
          {part.slice(2, -2)}
        </strong>
      )
    }

    return part
  })
}

export function MarkdownText({ text }: MarkdownTextProps) {
  const lines = text.split('\n')

  return (
    <div className="space-y-3 text-[15px] leading-7 text-zinc-700">
      {lines.map((line, index) => {
        const trimmed = line.trim()

        if (!trimmed) {
          return <div key={`blank-${index}`} className="h-1" />
        }

        const isList = /^[-*]\s+/.test(trimmed) || /^\d+\.\s+/.test(trimmed)
        const content = trimmed.replace(/^[-*]\s+/, '').replace(/^\d+\.\s+/, '')

        if (isList) {
          return (
            <p key={`${trimmed}-${index}`} className="flex gap-3">
              <span className="mt-[0.7rem] h-1.5 w-1.5 shrink-0 rounded-full bg-[#3483fa]" />
              <span>{renderInline(content)}</span>
            </p>
          )
        }

        return <p key={`${trimmed}-${index}`}>{renderInline(trimmed)}</p>
      })}
    </div>
  )
}
