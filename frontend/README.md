<h1 align="center">Mercado Livre RAG Chat</h1>

<p align="center">
  Frontend em React para uma API de RAG com experiencia de chat estilo IA.
</p>

<p align="center">
  <img alt="React" src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=111" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-6-3178C6?style=for-the-badge&logo=typescript&logoColor=fff" />
  <img alt="Vite" src="https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=fff" />
  <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?style=for-the-badge&logo=tailwindcss&logoColor=fff" />
  <img alt="Vitest" src="https://img.shields.io/badge/Vitest-4-6E9F18?style=for-the-badge&logo=vitest&logoColor=fff" />
</p>

## Sobre o Projeto

Este projeto e uma interface web para consumir uma API de RAG sobre regras, atendimento e contexto do Mercado Livre.

O usuario digita uma pergunta, o frontend envia a requisicao para o backend `/ask`, recebe a resposta gerada pela IA e exibe tudo em formato de conversa, com historico e efeito de digitacao palavra por palavra.

## Funcionalidades

- Chat moderno com historico de mensagens.
- Envio de pergunta pelo botao ou pela tecla `Enter`.
- `Shift + Enter` para quebrar linha sem enviar.
- Efeito de digitacao na resposta da IA.
- Estado de carregamento enquanto a API responde.
- Tratamento visual de erro caso o backend esteja indisponivel.
- Layout responsivo com Tailwind CSS.
- Identidade visual inspirada nas cores do Mercado Livre.
- Testes unitarios cobrindo API client, chat e hook de digitacao.

## Preview da Experiencia

A tela principal possui:

- Header amarelo com identidade visual do Mercado Livre.
- Area central com mensagens do usuario e da IA.
- Campo fixo de pergunta na parte inferior.
- Botao de envio com icone.
- Respostas renderizadas em formato legivel, com suporte simples a listas e negrito.

## Stack Utilizada

### Frontend

| Tecnologia | Uso |
| --- | --- |
| React 19 | Construcao da interface |
| React DOM | Renderizacao no navegador |
| TypeScript | Tipagem estatica |
| Vite | Dev server e build |
| Tailwind CSS 4 | Estilizacao |
| Lucide React | Icones da interface |

### Testes

| Biblioteca | Uso |
| --- | --- |
| Vitest | Runner de testes |
| Testing Library React | Testes de componentes |
| Testing Library User Event | Simulacao de interacoes do usuario |
| Testing Library Jest DOM | Matchers para assercoes no DOM |
| jsdom | Ambiente DOM para testes |

## Como a Integracao Funciona

O backend deve estar rodando em:

```txt
POST http://localhost:3000/ask
```

Payload enviado pelo frontend:

```json
{
  "question": "como consigo frete gratis?"
}
```

Formato de resposta esperado:

```json
{
  "question": "como consigo frete gratis?",
  "resp": {
    "choices": [
      {
        "message": {
          "content": "Resposta gerada pela IA..."
        }
      }
    ]
  },
  "context": "Contexto recuperado pelo RAG..."
}
```

O texto exibido no chat vem de:

```txt
resp.choices[0].message.content
```

Durante o desenvolvimento, o frontend chama:

```txt
/api/ask
```

E o proxy do Vite redireciona para:

```txt
http://localhost:3000/ask
```

Essa configuracao fica em `vite.config.ts` e ajuda a evitar problemas de CORS no ambiente local.

## Estrutura do Projeto

```txt
.
|-- src
|   |-- api
|   |   |-- ragClient.ts
|   |   `-- ragClient.test.ts
|   |-- components
|   |   |-- ChatMessage.tsx
|   |   `-- MarkdownText.tsx
|   |-- hooks
|   |   |-- useTypewriter.ts
|   |   `-- useTypewriter.test.tsx
|   |-- test
|   |   `-- setup.ts
|   |-- App.tsx
|   |-- App.test.tsx
|   |-- main.tsx
|   `-- styles.css
|-- index.html
|-- package.json
|-- tsconfig.json
`-- vite.config.ts
```

## Principais Arquivos

| Arquivo | Responsabilidade |
| --- | --- |
| `src/App.tsx` | Tela principal, estado do chat e envio de perguntas |
| `src/api/ragClient.ts` | Chamada para a API RAG e normalizacao da resposta |
| `src/components/ChatMessage.tsx` | Renderizacao das mensagens do usuario e da IA |
| `src/components/MarkdownText.tsx` | Renderizacao simples de texto com listas e negrito |
| `src/hooks/useTypewriter.ts` | Efeito de digitacao palavra por palavra |
| `vite.config.ts` | Configuracao do Vite, React, Tailwind, Vitest e proxy |

## Como Rodar Localmente

Clone o repositorio:

```bash
git clone https://github.com/seu-usuario/seu-repositorio.git
cd seu-repositorio
```

Instale as dependencias:

```bash
npm install
```

Inicie o backend RAG em outra janela do terminal.

Ele precisa estar disponivel em:

```txt
http://localhost:3000/ask
```

Inicie o frontend:

```bash
npm run dev
```

Acesse:

```txt
http://localhost:5173
```

## Scripts Disponiveis

| Comando | Descricao |
| --- | --- |
| `npm run dev` | Inicia o servidor de desenvolvimento |
| `npm run build` | Valida TypeScript e gera build de producao |
| `npm run preview` | Executa uma previa local da build |
| `npm test` | Roda os testes unitarios |

## Testes

Para rodar os testes:

```bash
npm test
```

Coberturas principais:

- Extracao da resposta retornada pela API.
- Envio do payload correto para `/api/ask`.
- Tratamento de erro da API.
- Renderizacao inicial do chat.
- Envio por clique no botao.
- Envio pela tecla `Enter`.
- Efeito de digitacao palavra por palavra.

## Build

Para gerar a versao de producao:

```bash
npm run build
```

O resultado sera criado na pasta:

```txt
dist
```

## Boas Praticas Aplicadas

- Componentizacao da interface.
- Separacao da camada de API.
- Hook isolado para comportamento reutilizavel.
- Testes focados no comportamento do usuario.
- Proxy local para integracao com backend.
- Estados de loading, erro e envio bloqueado.
- Layout responsivo.
- Tipagem com TypeScript.

## Melhorias Futuras

- Persistir historico da conversa.
- Exibir fontes/documentos usados pelo RAG.
- Adicionar streaming real de tokens.
- Criar modo escuro.
- Adicionar feedback de qualidade da resposta.
- Publicar o frontend em Vercel ou Netlify.

## Autor

Projeto desenvolvido como estudo pratico de frontend para APIs RAG, combinando React, Tailwind CSS, testes unitarios e integracao com backend de IA.
