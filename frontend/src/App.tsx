import { useEffect, useRef, useState } from "react";
import type { FormEvent, KeyboardEvent } from "react";
import { Handshake, Loader2, SendHorizonal, Sparkles } from "lucide-react";
import { askQuestion } from "./api/ragClient";
import { ChatMessage } from "./components/ChatMessage";
import type { ChatMessageModel } from "./components/ChatMessage";

const INITIAL_MESSAGES: ChatMessageModel[] = [
  {
    id: "welcome",
    role: "assistant",
    content:
      "Oi! Sou seu assistente de ajuda do Mercado Livre. Pergunte sobre frete gratis, reputacao, envios, carrinho ou regras de compra.",
  },
];

function createId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export default function App() {
  const [messages, setMessages] =
    useState<ChatMessageModel[]>(INITIAL_MESSAGES);
  const [question, setQuestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView?.({ behavior: "smooth", block: "end" });
  }, [messages, isLoading]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await sendQuestion();
  }

  async function sendQuestion() {
    const currentQuestion = question.trim();
    if (!currentQuestion || isLoading) {
      return;
    }

    setQuestion("");
    setError("");
    setIsLoading(true);

    setMessages((current) => [
      ...current.map((message) => ({ ...message, animate: false })),
      { id: createId(), role: "user", content: currentQuestion },
    ]);

    try {
      const result = await askQuestion(currentQuestion);
      setMessages((current) => [
        ...current.map((message) => ({ ...message, animate: false })),
        {
          id: createId(),
          role: "assistant",
          content: result.answer,
          animate: true,
        },
      ]);
    } catch (requestError) {
      const message =
        requestError instanceof Error
          ? requestError.message
          : "Nao foi possivel falar com a API.";
      setError(message);
      setMessages((current) => [
        ...current,
        {
          id: createId(),
          role: "assistant",
          content:
            "Nao consegui responder agora. Confira se o backend esta rodando em http://localhost:3000/ask e tente novamente.",
          animate: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  function handleQuestionKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void sendQuestion();
    }
  }

  return (
    <main className="min-h-svh bg-[#f5f5f5] text-zinc-950">
      <header className="border-b border-[#e6d84f] bg-[#fff159]">
        <div className="mx-auto flex min-h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[#3483fa] shadow-sm">
              <Handshake size={23} aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <p className="text-xl font-semibold leading-6 text-[#2d3277]">
                Mercado Livre
              </p>
              <p className="truncate text-xs font-medium text-zinc-700">
                Atendimento RAG
              </p>
            </div>
          </div>

          <div className="hidden items-center gap-2 rounded-full bg-white/70 px-3 py-2 text-sm font-medium text-zinc-700 sm:flex">
            <Sparkles size={16} className="text-[#3483fa]" aria-hidden="true" />
            IA conectada a sua base
          </div>
        </div>
      </header>

      <section className="mx-auto flex h-[calc(100svh-65px)] w-full max-w-6xl flex-col px-4 py-4 sm:px-6">
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm">
          <div className="border-b border-zinc-200 px-4 py-3">
            <h1 className="text-base font-semibold text-zinc-950">
              Chat de suporte
            </h1>
          </div>

          <div className="min-h-0 flex-1 space-y-5 overflow-y-auto bg-[#f7f7f7] px-4 py-5 sm:px-6">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}

            {isLoading && (
              <div className="flex items-center gap-3 text-sm font-medium text-zinc-500">
                <Loader2
                  size={18}
                  className="animate-spin text-[#3483fa]"
                  aria-hidden="true"
                />
                Buscando resposta na sua base...
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <form
            onSubmit={handleSubmit}
            className="border-t border-zinc-200 bg-white p-3 sm:p-4"
          >
            {error && (
              <p className="mb-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </p>
            )}

            <div className="flex items-end gap-2 rounded-lg border border-zinc-300 bg-white p-2 focus-within:border-[#3483fa] focus-within:ring-2 focus-within:ring-[#3483fa]/20">
              <label htmlFor="question" className="sr-only">
                Digite sua pergunta
              </label>
              <textarea
                id="question"
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                onKeyDown={handleQuestionKeyDown}
                placeholder="Pergunte algo sobre Mercado Livre..."
                rows={1}
                className="max-h-32 min-h-11 flex-1 resize-none bg-transparent px-2 py-2 text-[15px] leading-6 text-zinc-900 outline-none placeholder:text-zinc-400"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!question.trim() || isLoading}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-[#3483fa] text-white transition hover:bg-[#2968c8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3483fa] disabled:cursor-not-allowed disabled:bg-zinc-300"
                aria-label="Enviar pergunta"
              >
                {isLoading ? (
                  <Loader2
                    size={19}
                    className="animate-spin"
                    aria-hidden="true"
                  />
                ) : (
                  <SendHorizonal size={19} aria-hidden="true" />
                )}
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
