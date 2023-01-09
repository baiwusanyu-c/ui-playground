import ReactDOM from 'react-dom/client'
import App from './views/App'
import './assets/scss/index.css'
import '@ui-playground/theme'
import '@ui-playground/theme/src/theme.scss'
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <App />,
)
