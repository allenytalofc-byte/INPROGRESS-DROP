'use client'

import { useState } from 'react'
import { FiBell, FiSend } from 'react-icons/fi'
import DashboardLayout from '@/components/DashboardLayout'
import { api } from '@/lib/api'

export default function NotificationsPage() {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [userIds, setUserIds] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      const userIdArray = userIds.split(',').map(id => id.trim()).filter(id => id)
      
      if (userIdArray.length === 0) {
        throw new Error('Insira pelo menos um ID de usuário')
      }

      await api.post('/notifications/broadcast', {
        user_ids: userIdArray,
        title,
        body,
      })

      setSuccess('Notificações enviadas com sucesso!')
      setTitle('')
      setBody('')
      setUserIds('')
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Erro ao enviar notificações')
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center">
            <FiBell className="text-2xl text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Enviar Notificações
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Envie notificações push para usuários
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          {success && (
            <div 
              className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 px-4 py-3 rounded-lg mb-6"
              role="alert"
            >
              {success}
            </div>
          )}

          {error && (
            <div 
              className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg mb-6"
              role="alert"
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSend} className="space-y-6">
            <div>
              <label 
                htmlFor="title" 
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Título
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Promoção especial!"
              />
            </div>

            <div>
              <label 
                htmlFor="body" 
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Mensagem
              </label>
              <textarea
                id="body"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                required
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Aproveite 50% de desconto em produtos selecionados!"
              />
            </div>

            <div>
              <label 
                htmlFor="userIds" 
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                IDs dos Usuários (separados por vírgula)
              </label>
              <textarea
                id="userIds"
                value={userIds}
                onChange={(e) => setUserIds(e.target.value)}
                required
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono text-sm"
                placeholder="uuid1, uuid2, uuid3"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Insira os UUIDs dos usuários que receberão a notificação
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition-colors"
            >
              {loading ? (
                'Enviando...'
              ) : (
                <>
                  <FiSend />
                  Enviar Notificações
                </>
              )}
            </button>
          </form>

          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <strong>Dica:</strong> Para testar, use o ID do seu próprio usuário. 
              Você pode encontrá-lo na página de perfil.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}