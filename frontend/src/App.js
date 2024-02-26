import { Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './Pages/Home/Home/Home';
import Header from './Pages/Shared/Header/Header';
import Login from './Pages/Login/Login/Login';
import Register from './Pages/Login/Register/Register';
import ForgotPass from './Pages/Login/ForgotPass/ForgotPass';
import ResetPass from './Pages/Login/ResetPass/ResetPass';

function App() {
  return (
    <div className="App">
      <Header></Header>

      <Routes> 
        <Route path='/' element={
          <Home></Home>
        }></Route>

        <Route path='/home' element={
          <Home></Home>
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
