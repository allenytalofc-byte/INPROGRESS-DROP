'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { FiPackage, FiShoppingCart, FiDollarSign, FiUsers, FiTrendingUp } from 'react-icons/fi'
import DashboardLayout from '@/components/DashboardLayout'
import { useAuth } from '@/contexts/AuthContext'
import { api } from '@/lib/api'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalCustomers: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    } else if (user && (user.role !== 'admin' && user.role !== 'vendor')) {
      router.push('/login')
    } else if (user) {
      loadStats()
    }
  }, [user, authLoading, router])

  const loadStats = async () => {
    try {
      const [productsRes, ordersRes] = await Promise.all([
        api.get('/products'),
        api.get('/orders'),
      ])

      const products = productsRes.data
      const orders = ordersRes.data

      setStats({
        totalProducts: products.length,
        totalOrders: orders.length,
        totalRevenue: orders.reduce((sum: number, order: any) => sum + parseFloat(order.total), 0),
        totalCustomers: new Set(orders.map((o: any) => o.customer_id)).size,
      })
    } catch (error) {
      console.error('Error loading stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const chartData = [
    { name: 'Jan', vendas: 4000 },
    { name: 'Fev', vendas: 3000 },
    { name: 'Mar', vendas: 5000 },
    { name: 'Abr', vendas: 7000 },
    { name: 'Mai', vendas: 6000 },
    { name: 'Jun', vendas: 8000 },
  ]

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <DashboardLayout>
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Dashboard
        </h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total de Produtos"
            value={stats.totalProducts}
            icon={<FiPackage className="text-3xl" />}
            color="bg-blue-500"
            trend="+12%"
          />
          <StatCard
            title="Pedidos"
            value={stats.totalOrders}
            icon={<FiShoppingCart className="text-3xl" />}
            color="bg-green-500"
            trend="+8%"
          />
          <StatCard
            title="Receita Total"
            value={`R$ ${stats.totalRevenue.toFixed(2)}`}
            icon={<FiDollarSign className="text-3xl" />}
            color="bg-yellow-500"
            trend="+15%"
          />
          <StatCard
            title="Clientes"
            value={stats.totalCustomers}
            icon={<FiUsers className="text-3xl" />}
            color="bg-purple-500"
            trend="+5%"
          />
        </div>

        {/* Charts */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
            Vendas Mensais
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: 'none', 
                  borderRadius: '8px',
                  color: '#fff'
                }} 
              />
              <Bar dataKey="vendas" fill="#22c55e" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <QuickAction
            title="Adicionar Produto"
            description="Cadastre um novo produto na loja"
            href="/dashboard/products/new"
            icon={<FiPackage className="text-2xl" />}
          />
          <QuickAction
            title="Ver Pedidos"
            description="Gerencie pedidos pendentes"
            href="/dashboard/orders"
            icon={<FiShoppingCart className="text-2xl" />}
          />
          <QuickAction
            title="Enviar Notificação"
            description="Envie notificações para clientes"
            href="/dashboard/notifications"
            icon={<FiTrendingUp className="text-2xl" />}
          />
        </div>
      </div>
    </DashboardLayout>
  )
}

function StatCard({ title, value, icon, color, trend }: any) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <div className={`${color} text-white p-3 rounded-lg`}>
          {icon}
        </div>
        <span className="text-green-500 text-sm font-semibold flex items-center gap-1">
          <FiTrendingUp />
          {trend}
        </span>
      </div>
      <h3 className="text-gray-600 dark:text-gray-400 text-sm mb-1">{title}</h3>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
    </div>
  )
}

function QuickAction({ title, description, href, icon }: any) {
  return (
    <a
      href={href}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-500 transition-all group"
    >
      <div className="flex items-center gap-4 mb-3">
        <div className="text-primary-600 dark:text-primary-400 group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
      </div>
      <p className="text-gray-600 dark:text-gray-400 text-sm">{description}</p>
    </a>
  )
}