import { Bot, UserRound } from 'lucide-react'
import { useTypewriter } from '../hooks/useTypewriter'
import { MarkdownText } from './MarkdownText'

export type ChatMessageModel = {
  id: string
  role: 'user' | 'assistant'
  content: string
  animate?: boolean
}

type ChatMessageProps = {
  message: ChatMessageModel
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isAssistant = message.role === 'assistant'
  const { displayedText, isTyping } = useTypewriter(
    message.content,
    Boolean(message.animate && isAssistant),
  )
  const content = isAssistant ? displayedText : message.content

  return (
    <article
      className={`flex gap-3 ${isAssistant ? 'justify-start' : 'justify-end'}`}
      aria-label={isAssistant ? 'Resposta do assistente' : 'Pergunta do usuario'}
    >
      {isAssistant && (
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#fff159] text-[#3483fa] shadow-sm">
          <Bot size={19} aria-hidden="true" />
        </div>
      )}

      <div
        className={`max-w-[82%] rounded-lg px-4 py-3 shadow-sm md:max-w-[72%] ${
          isAssistant
            ? 'border border-zinc-200 bg-white'
            : 'bg-[#3483fa] text-white'
        }`}
      >
        {isAssistant ? (
          <div>
            <MarkdownText text={content} />
            {isTyping && (
              <span
                className="ml-1 inline-block h-4 w-1 animate-pulse rounded-full bg-[#3483fa] align-middle"
                aria-label="Digitando"
              />
            )}
          </div>
        ) : (
          <p className="text-[15px] leading-7">{content}</p>
        )}
      </div>

      {!isAssistant && (
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-white shadow-sm">
          <UserRound size={18} aria-hidden="true" />
        </div>
      )}
    </article>
  )
}
