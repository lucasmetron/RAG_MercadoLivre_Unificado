import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'
import { askQuestion } from './api/ragClient'

vi.mock('./api/ragClient', () => ({
  askQuestion: vi.fn(),
}))

const askQuestionMock = vi.mocked(askQuestion)

describe('App', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('renders the chat shell and disables submit without a question', () => {
    render(<App />)

    expect(screen.getByText('Mercado Livre')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Chat de suporte' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Enviar pergunta' })).toBeDisabled()
  })

  it('sends a question and appends the API answer to the conversation', async () => {
    askQuestionMock.mockResolvedValue({
      answer: 'Para conseguir frete gratis, verifique o valor minimo.',
      context: '',
    })
    render(<App />)

    await userEvent.type(
      screen.getByLabelText('Digite sua pergunta'),
      'como consigo frete gratis?',
    )
    await userEvent.click(screen.getByRole('button', { name: 'Enviar pergunta' }))

    expect(askQuestionMock).toHaveBeenCalledWith('como consigo frete gratis?')
    expect(screen.getByText('como consigo frete gratis?')).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.getByText(/Para conseguir frete gratis/)).toBeInTheDocument()
    })
  })

  it('sends the question when Enter is pressed in the textarea', async () => {
    askQuestionMock.mockResolvedValue({
      answer: 'Resposta enviada pelo Enter.',
      context: '',
    })
    render(<App />)

    await userEvent.type(
      screen.getByLabelText('Digite sua pergunta'),
      'quais produtos tem frete gratis?{enter}',
    )

    expect(askQuestionMock).toHaveBeenCalledWith('quais produtos tem frete gratis?')
    expect(screen.getByLabelText('Digite sua pergunta')).toHaveValue('')
  })

  it('shows an error message when the API request fails', async () => {
    askQuestionMock.mockRejectedValue(new Error('API fora do ar'))
    render(<App />)

    await userEvent.type(screen.getByLabelText('Digite sua pergunta'), 'oi')
    await userEvent.click(screen.getByRole('button', { name: 'Enviar pergunta' }))

    expect(await screen.findByText('API fora do ar')).toBeInTheDocument()
  })
})
