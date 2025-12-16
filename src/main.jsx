import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux'
import store from '../src/redux/store.js'
import setupAxios from './utils/setupAxios.js'
import ErrorBoundary from './Components/errorBoundary.jsx'

setupAxios(store)
createRoot(document.getElementById('root')).render(

  <StrictMode>
    <Provider store={store}>
      <ErrorBoundary>
         <App />
      </ErrorBoundary>
       
    </Provider>
    
  </StrictMode>,
)
