import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles.css'
import './registerServiceWorker' // registra el SW

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)