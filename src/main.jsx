import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux'
import store from '../src/redux/store.js'
import setupAxios from './utils/setupAxios.js'
import ErrorBoundary from './Components/errorBoundary.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google'

setupAxios(store)
createRoot(document.getElementById('root')).render(

  <StrictMode>
    <Provider store={store}>
      <ErrorBoundary>
        <GoogleOAuthProvider clientId='521062829902-l786i25amsbnue0npub703ush4gh4b36.apps.googleusercontent.com' >
             <App />
        </GoogleOAuthProvider>
        
      </ErrorBoundary>
       
    </Provider>
    
  </StrictMode>,
)
