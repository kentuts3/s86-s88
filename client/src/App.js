import './App.css';
import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import BlogList from './components/BlogList';
import PostDetail from './components/PostDetail';
import Login from './pages/Login';
import { UserProvider } from './context/UserContext';
import AddPost from './components/AddPost';
import Register from './pages/Register';
import AdminDashboard from './components/AdminDashboard';
import AppNavbar from './components/AppNavbar';
import Home from './pages/Home';

function App() {

  const [user, setUser] = useState({
    id: null,
    isAdmin: null
  })

  function unsetUser(){
    localStorage.clear();
  }

  useEffect(() => {
    fetch(`http://localhost:8000/users/details`, {
      headers: {
        Authorization: `Bearer ${ localStorage.getItem('token')}`
      }
    })
    .then(res => res.json())
    .then(data => {
      console.log(data)
      console.log(typeof data.access !== undefined)

      if (typeof data.access !== undefined){

        setUser({
          id: data._id,
          isAdmin: data.isAdmin
        })
      } else {
        setUser({
          id: null,
          isAdmin: null
        })
      }
    })
  }, [])



  useEffect(() => {
    console.log(user);
    console.log(localStorage);
  }, [user])


  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<BlogList />}/>
          <Route path='/home' element={<Home/>} />
          <Route path='/register' element={<Register />} />
          <Route path='/login' element={<Login />} />
          <Route path='/admin' element={<AdminDashboard/>}/>
          <Route path='/posts/:postId' element={<PostDetail />}/>
          <Route path="/addPost" element={<AddPost />} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
