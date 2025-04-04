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
import MomProfile from './pages/MOMs/MomProfile.jsx'
import Protected from './components/Protection.jsx'
import MomProtected from './components/MomProtection.jsx'

const router = createBrowserRouter([
  {
    path:"/",
    element : <App/>,
    // errorElement: ,
    children:[
      {
        path:"/",
        element: <Dashboard/>
      },
      // user routes
      {
        path:'/user/home',
        element:
        <Protected authentication={true}  >
         <Home/>
       </Protected>
      },
      {
        path:'/moms',
        element:
        <Protected authentication={true} >
         <MomsPage/>
       </Protected>
      },
      {
        path:"/login",
        element:
        <Protected authentication={false} >
         <UserLogin/>
       </Protected>
      },
      {
        path:"/signup",
        element:
        <Protected authentication={false} >
          <UserSignUp/>
        </Protected>
      },
      {
        path:"/orders",
        element:
        <Protected authentication={true} >
          <OrdersPage/>
        </Protected>
      },
      {
        path : "/menu",
        element: 
        <Protected authentication={true} >
          <MenuPage/>
        </Protected>
      },
      {
        path : "/user/profile",
        element: 
        <Protected authentication={true} >
          <Profile/>
        </Protected>
      },
      // mom routes
      {
        path: "/mom/login",
        element: 
        <MomProtected authentication={false} >
          <MomLogin/>
        </MomProtected>
      },
      {
        path: "/mom/signup",
        element: 
        <MomProtected authentication={false} >
         <MomSignUp/>
       </MomProtected>
      },
      {
        path: "/mom/home",
        element:
        <MomProtected authentication={true} >
          <MomHome/>
       </MomProtected>
      },
      {
        path:"/mom/menus",
        element: 
        <MomProtected authentication={true} >
          <MomMenus/>
        </MomProtected>
      },
      {
        path:"/mom/orders",
        element:
        <MomProtected authentication={true} >
          <MomOrders/>
        </MomProtected>
      },
      {
        path:"/mom/payments",
        element:
        <MomProtected authentication={true} >
          <MomPayments/>
        </MomProtected>
      },
      {
        path:"/mom/profile",
        element:
        <MomProtected authentication={true} >
          <MomProfile/>
        </MomProtected>
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
