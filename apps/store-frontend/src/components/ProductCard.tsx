'use client'

import Image from 'next/image'
import Link from 'next/link'
import { FiShoppingCart } from 'react-icons/fi'

interface ProductCardProps {
  product: {
    id: string
    name: string
    description: string
    price: number
    compare_at_price?: number
    image_url?: string
    category?: string
  }
}

export default function ProductCard({ product }: ProductCardProps) {
  const discount = product.compare_at_price
    ? Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)
    : 0

  return (
    <div className="group bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-700">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <FiShoppingCart className="text-6xl text-gray-300 dark:text-gray-600" />
          </div>
        )}
        {discount > 0 && (
          <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
            -{discount}%
          </div>
        )}
        {product.category && (
          <div className="absolute top-3 left-3 bg-primary-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
            {product.category}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 min-h-[3.5rem]">
          {product.name}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
          {product.description}
        </p>

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
            R$ {product.price.toFixed(2)}
          </span>
          {product.compare_at_price && (
            <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
              R$ {product.compare_at_price.toFixed(2)}
            </span>
          )}
        </div>

        {/* Button */}
        <Link
          href={`/products/${product.id}`}
          className="w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-3 rounded-lg font-semibold transition-colors"
        >
          <FiShoppingCart />
          Ver Detalhes
        </Link>
      </div>
    </div>
  )
}