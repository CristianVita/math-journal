import React from 'react'
import ReactDOM from 'react-dom/client'
import 'katex/dist/katex.min.css'
import './styles.css'
import App from './App'
import { loadLocal, spillLocal } from './db'

// a page closed while a save is still under way: what is left goes where it can be written at once
window.addEventListener('pagehide', spillLocal)

// the notebook and the board are read before anything is shown, so that the pages find them ready
loadLocal().finally(() =>
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  ),
)
