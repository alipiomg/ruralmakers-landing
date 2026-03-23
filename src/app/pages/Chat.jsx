import { useState, useRef, useEffect } from 'react'
import { chatResponses } from '../data/mockData'

const WELCOME_MESSAGE = {
  role: 'assistant',
  text: 'Hola! Soy el asistente IA de Rural Makers. Preguntame sobre facenderas, personas, proyectos o tramites rurales.',
}

const SUGGESTIONS = [
  'Que facenderas hay?',
  'Quien sabe de apicultura?',
  'Como organizar una facendera?',
]

const DEFAULT_RESPONSE = 'Puedo ayudarte con facenderas, personas, saberes y tramites rurales.'

function findResponse(query) {
  const normalized = query.toLowerCase()
  const match = chatResponses.find(cr => {
    const keywords = cr.q.toLowerCase().split(' ')
    return keywords.some(keyword => keyword.length > 3 && normalized.includes(keyword))
  })
  return match ? match.a : DEFAULT_RESPONSE
}

export default function Chat() {
  const [messages, setMessages] = useState([WELCOME_MESSAGE])
  const [input, setInput] = useState('')
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = (text) => {
    const query = text || input
    if (!query.trim()) return

    const userMsg = { role: 'user', text: query.trim() }
    const assistantMsg = { role: 'assistant', text: findResponse(query) }

    setMessages(prev => [...prev, userMsg, assistantMsg])
    setInput('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    handleSend(input)
  }

  const showSuggestions = messages.length === 1

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-rural-green text-white rounded-br-md'
                  : 'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-bl-md'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {/* Quick suggestions after welcome */}
        {showSuggestions && (
          <div className="flex flex-wrap gap-2 mt-2">
            {SUGGESTIONS.map(s => (
              <button
                key={s}
                onClick={() => handleSend(s)}
                className="px-3 py-1.5 bg-rural-green/10 text-rural-green text-sm font-medium rounded-full hover:bg-rural-green/20 transition"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-3 border-t border-gray-200 bg-white">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Escribe tu pregunta..."
            className="flex-1 px-4 py-2.5 border border-gray-200 rounded-full text-sm focus:outline-none focus:border-rural-green focus:ring-1 focus:ring-rural-green"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="px-4 py-2.5 bg-rural-green text-white rounded-full text-sm font-medium disabled:opacity-40 hover:bg-rural-green/90 transition"
          >
            Enviar
          </button>
        </div>
      </form>
    </div>
  )
}
