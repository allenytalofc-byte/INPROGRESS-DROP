'use client'

import { ShoppingBag, Truck, Shield, Headphones } from 'lucide-react'

export function Hero() {
  return (
    <section className="relative bg-gradient-to-r from-primary-600 to-primary-800 dark:from-primary-700 dark:to-primary-900 text-white">
      <div className="container-custom py-24">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
            Welcome to DropStore
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-primary-100 animate-slide-up">
            Discover amazing products at unbeatable prices. 
            Quality guaranteed, delivered to your door.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
            <button className="btn-primary bg-white text-primary-600 hover:bg-gray-100 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700">
              Shop Now
            </button>
            <button className="btn-outline border-white text-white hover:bg-white hover:text-primary-600 dark:border-gray-300 dark:text-gray-300 dark:hover:bg-gray-300 dark:hover:text-primary-600">
              Learn More
            </button>
          </div>
        </div>
      </div>
      
      {/* Features */}
      <div className="container-custom pb-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="bg-white/10 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <ShoppingBag className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Wide Selection</h3>
            <p className="text-primary-100 text-sm">
              Thousands of products across multiple categories
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-white/10 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Truck className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Fast Delivery</h3>
            <p className="text-primary-100 text-sm">
              Quick and reliable shipping worldwide
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-white/10 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Shield className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Secure Payment</h3>
            <p className="text-primary-100 text-sm">
              Your payment information is always protected
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-white/10 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Headphones className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-semibold mb-2">24/7 Support</h3>
            <p className="text-primary-100 text-sm">
              Our team is here to help you anytime
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}