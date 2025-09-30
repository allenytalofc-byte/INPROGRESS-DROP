'use client'

import { useEffect } from 'react'

export function AccessibilityEnhancer() {
  useEffect(() => {
    // Add skip to main content link
    const skipLink = document.createElement('a')
    skipLink.href = '#main-content'
    skipLink.textContent = 'Skip to main content'
    skipLink.className = 'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary-600 text-white px-4 py-2 rounded z-50'
    skipLink.setAttribute('aria-label', 'Skip to main content')
    document.body.insertBefore(skipLink, document.body.firstChild)

    // Add focus indicators for keyboard navigation
    const style = document.createElement('style')
    style.textContent = `
      .focus-visible {
        outline: 2px solid #3b82f6;
        outline-offset: 2px;
      }
      
      .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
      }
      
      .focus\\:not-sr-only:focus {
        position: static;
        width: auto;
        height: auto;
        padding: 0.5rem 1rem;
        margin: 0;
        overflow: visible;
        clip: auto;
        white-space: normal;
      }
      
      /* High contrast mode support */
      @media (prefers-contrast: high) {
        .card {
          border: 2px solid;
        }
        
        .btn-primary {
          border: 2px solid;
        }
      }
      
      /* Reduced motion support */
      @media (prefers-reduced-motion: reduce) {
        * {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
        }
      }
      
      /* Dark mode support */
      @media (prefers-color-scheme: dark) {
        :root {
          color-scheme: dark;
        }
      }
    `
    document.head.appendChild(style)

    // Add ARIA landmarks
    const main = document.querySelector('main')
    if (main && !main.getAttribute('role')) {
      main.setAttribute('role', 'main')
      main.setAttribute('id', 'main-content')
    }

    const nav = document.querySelector('nav')
    if (nav && !nav.getAttribute('role')) {
      nav.setAttribute('role', 'navigation')
    }

    const header = document.querySelector('header')
    if (header && !header.getAttribute('role')) {
      header.setAttribute('role', 'banner')
    }

    const footer = document.querySelector('footer')
    if (footer && !footer.getAttribute('role')) {
      footer.setAttribute('role', 'contentinfo')
    }

    // Add live region for dynamic content updates
    const liveRegion = document.createElement('div')
    liveRegion.setAttribute('aria-live', 'polite')
    liveRegion.setAttribute('aria-atomic', 'true')
    liveRegion.className = 'sr-only'
    liveRegion.id = 'live-region'
    document.body.appendChild(liveRegion)

    // Announce page changes
    const announcePageChange = (message: string) => {
      const liveRegion = document.getElementById('live-region')
      if (liveRegion) {
        liveRegion.textContent = message
      }
    }

    // Listen for route changes (Next.js)
    const originalPushState = history.pushState
    history.pushState = function(...args) {
      originalPushState.apply(history, args)
      announcePageChange('Page changed')
    }

    const originalReplaceState = history.replaceState
    history.replaceState = function(...args) {
      originalReplaceState.apply(history, args)
      announcePageChange('Page changed')
    }

    // Add keyboard navigation support
    document.addEventListener('keydown', (e) => {
      // Escape key to close modals
      if (e.key === 'Escape') {
        const modals = document.querySelectorAll('[role="dialog"]')
        modals.forEach(modal => {
          const closeButton = modal.querySelector('[aria-label="Close"]')
          if (closeButton) {
            (closeButton as HTMLElement).click()
          }
        })
      }
    })

    // Cleanup function
    return () => {
      document.head.removeChild(style)
      document.body.removeChild(skipLink)
      const liveRegion = document.getElementById('live-region')
      if (liveRegion) {
        document.body.removeChild(liveRegion)
      }
    }
  }, [])

  return null
}

// Utility function to announce messages to screen readers
export function announceToScreenReader(message: string) {
  const liveRegion = document.getElementById('live-region')
  if (liveRegion) {
    liveRegion.textContent = message
  }
}

// Utility function to manage focus
export function manageFocus(element: HTMLElement | null) {
  if (element) {
    element.focus()
    element.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }
}