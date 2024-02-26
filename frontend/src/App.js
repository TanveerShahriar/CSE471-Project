import { Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './Pages/Home/Home/Home';
import Header from './Pages/Shared/Header/Header';
import Login from './Pages/Login/Login/Login';
import Register from './Pages/Login/Register/Register';
import ForgotPass from './Pages/Login/ForgotPass/ForgotPass';
import ResetPass from './Pages/Login/ResetPass/ResetPass';
import RequireAuth from './Pages/Login/RequireAuth/RequireAuth';
import Admin from './Pages/Admin/Admin';
import RequireAdmin from './Pages/Login/RequireAdmin/RequireAdmin';

function App() {
  return (
    <div className="App">
      <Header></Header>

      <Routes> 
        <Route path='/' element={
          <RequireAuth>
            <Home></Home>
          </RequireAuth>
        }></Route>

        <Route path='/home' element={
          <RequireAuth>
            <Home></Home>
          </RequireAuth>
        }></Route>

        <Route path='/admin' element={
          <RequireAuth>
            <RequireAdmin>
              <Admin></Admin>
            </RequireAdmin>
          </RequireAuth>
        }></Route>

        <Route path='/login' element={
          <Login></Login>
        }></Route>

        <Route path='/register' element={
          <Register></Register>
        }></Route>

        <Route path='/forgotpass' element={
          <ForgotPass></ForgotPass>
        }></Route>

        <Route path='/resetpass/:userId' element={
          <ResetPass></ResetPass>
        }></Route>
        
      </Routes>
    </div>
  );
}

export default App;
