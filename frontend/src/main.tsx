import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

declare global {
  interface Window {
    google: any;
    handleGoogleLogin: any;
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <App />
)
