import { Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './Pages/Home/Home/Home';
import Header from './Pages/Shared/Header/Header';
import Login from './Pages/Login/Login/Login';
import Register from './Pages/Login/Register/Register';
import ForgotPass from './Pages/Login/ForgotPass/ForgotPass';
import ResetPass from './Pages/Login/ResetPass/ResetPass';
import RequireAuth from './Pages/Login/RequireAuth/RequireAuth';
import Admin from './Pages/Admin/Admin/Admin';
import AddBus from './Pages/Admin/AddBus/AddBus';
import RequireAdmin from './Pages/Login/RequireAdmin/RequireAdmin';
import AddRoute from './Pages/Admin/AddRoute/AddRoute';
import AddSchedule from './Pages/Admin/AddSchedule/AddSchedule';
import Verify from './Pages/Login/Verify/Verify';

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

        <Route path='/addbus' element={
          <RequireAuth>
            <RequireAdmin>
              <AddBus></AddBus>
            </RequireAdmin>
          </RequireAuth>
        }></Route>

        <Route path='/addroute' element={
          <RequireAuth>
            <RequireAdmin>
              <AddRoute></AddRoute>
            </RequireAdmin>
          </RequireAuth>
        }></Route>

        <Route path='/addschedule' element={
          <RequireAuth>
            <RequireAdmin>
              <AddSchedule></AddSchedule>
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

        <Route path='/verify/:userId' element={
          <Verify></Verify>
        }></Route>
        
      </Routes>
    </div>
  );
}

export default App;
