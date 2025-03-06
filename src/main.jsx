import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux'
import store from './store/store.js'
import UserLogin from './pages/USERs/UserLogin.jsx'
import UserSignUp from './pages/USERs/UserSignUp.jsx'
import MenuPage from './pages/USERs/MenuPage.jsx'
import { createBrowserRouter,RouterProvider } from 'react-router-dom'
import Dashboard from './pages/Dashboard.jsx'
import Home from './pages/USERs/Home.jsx'
import MomLogin from './pages/MOMs/MomLogin.jsx'
import MomSignUp from './pages/MOMs/MomSignUp.jsx'
import MomsPage from './pages/USERs/momsPage.jsx'
import OrdersPage from './pages/USERs/OrdersPage.jsx'
import Profile from './pages/USERs/Profile.jsx'
import MomHome from './pages/MOMs/MomHome.jsx'
import MomMenus from './pages/MOMs/MomMenus.jsx'
import MomOrders from './pages/MOMs/MomOrders.jsx'
import MomPayments from './pages/MOMs/MomPayments.jsx'

const router = createBrowserRouter([
  {
    path:"/",
    element : <App/>,
    // errorElement: ,
    children:[
      {
        path:"/",
        element:<Dashboard />
      },
      {
        path:'/user/home',
        element:<Home />
      },
      {
        path:'/moms',
        element:<MomsPage />
      },
      {
        path:"/login",
        element:<UserLogin />
      },
      {
        path:"/signup",
        element:<UserSignUp/>
      },
      {
        path:"/orders",
        element:<OrdersPage/>
      },
      {
        path : "/menu",
        element: <MenuPage />
      },
      {
        path : "/user/profile",
        element: <Profile />
      },
      {
        path: "/mom/login",
        element: <MomLogin />
      },
      {
        path: "/mom/signup",
        element: <MomSignUp />
      },
      {
        path: "/mom/home",
        element: <MomHome />
      },
      {
        path:"/mom/menus",
        element: <MomMenus />
      },
      {
        path:"/mom/orders",
        element:<MomOrders />
      },
      {
        path:"/mom/payments",
        element:<MomPayments />
      },
    ]
  }
])
createRoot(document.getElementById('root')).render(

  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>,
)
