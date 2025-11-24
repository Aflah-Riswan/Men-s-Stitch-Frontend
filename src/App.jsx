

import { BrowserRouter, Route, Routes } from 'react-router-dom'


import SignUpModal from './Signup'
import SignInModal from './Login'
import HomePage from './HomePage'


function App() {
  
  return (
    <>
     <BrowserRouter>
     
      <Routes>
        <Route path='/signup' element={<SignUpModal/>}/>
        <Route path='/login' element={<SignInModal/>}/>
        <Route path='/' element={<HomePage/>}/>
      </Routes>
      
     </BrowserRouter>
    </>
  )
}

export default App
