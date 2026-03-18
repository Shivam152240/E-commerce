import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './App.jsx'
import  {CartProvider}  from './assets/context/CartContext.jsx';
import { BrowserRouter } from 'react-router-dom';
import { OrderProvider} from './assets/context/OrderContext.jsx';
import { AuthProvider } from './admin/context/AuthContext.jsx';

createRoot(document.getElementById('root')).render(
  // <StrictMode>
   <AuthProvider>
  <CartProvider>
    <OrderProvider>
      <App />
    </OrderProvider>
  </CartProvider>
  </AuthProvider>
  // </StrictMode>
)
