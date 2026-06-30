
import { createRoot } from 'react-dom/client'
import { Capacitor } from '@capacitor/core'
import { StatusBar, Style } from '@capacitor/status-bar'
import App from './App.tsx'
import './index.css'

const isIOSLikeBrowser = () =>
  /iPad|iPhone|iPod/.test(window.navigator.userAgent) ||
  (window.navigator.platform === 'MacIntel' && window.navigator.maxTouchPoints > 1)

const configureNativeChrome = async () => {
  const isNativeIOS = Capacitor.getPlatform() === 'ios'
  if (!isNativeIOS && !isIOSLikeBrowser()) return

  document.documentElement.classList.add('capacitor-ios')

  if (!isNativeIOS) {
    document.documentElement.classList.add('statusbar-overlay-guard')
    return
  }

  try {
    await StatusBar.setOverlaysWebView({ overlay: false })
    await StatusBar.setStyle({ style: Style.Dark })
    await StatusBar.setBackgroundColor({ color: '#050816' })
    await StatusBar.show()
    document.documentElement.classList.add('statusbar-contained')
  } catch {
    document.documentElement.classList.add('statusbar-overlay-guard')
    // Web builds and very early native startup can ignore this; CSS keeps a safe fallback.
  }
}

void configureNativeChrome()

// Remove dark mode class addition
createRoot(document.getElementById("root")!).render(<App />);
