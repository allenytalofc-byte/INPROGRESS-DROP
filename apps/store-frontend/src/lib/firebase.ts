import { initializeApp, getApps } from 'firebase/app'
import { getMessaging, getToken, onMessage, isSupported } from 'firebase/messaging'
import { api } from './api'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

let app
let messaging: any = null

if (typeof window !== 'undefined' && getApps().length === 0) {
  try {
    app = initializeApp(firebaseConfig)
  } catch (error) {
    console.error('Firebase initialization error:', error)
  }
}

export async function registerDeviceToken() {
  if (typeof window === 'undefined') return

  try {
    const supported = await isSupported()
    if (!supported) {
      console.log('Push notifications not supported')
      return
    }

    if (!messaging && app) {
      messaging = getMessaging(app)
    }

    if (!messaging) return

    const permission = await Notification.requestPermission()
    
    if (permission === 'granted') {
      const token = await getToken(messaging, {
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
      })

      if (token) {
        // Register token with backend
        await api.post('/devices/register', {
          token,
          device_type: 'web',
          device_name: navigator.userAgent,
        })
        
        console.log('✅ Device token registered')
      }
    }
  } catch (error) {
    console.error('Error registering device token:', error)
  }
}

export function onMessageListener() {
  return new Promise((resolve) => {
    if (!messaging) return

    onMessage(messaging, (payload) => {
      resolve(payload)
    })
  })
}