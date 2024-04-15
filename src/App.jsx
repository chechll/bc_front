import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, useNavigate, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Index from "./page/index";
import SignIn from "./page/SignIn";
import SignUp from "./page/signUp";
import Home from "./page/home";
import Rules from "./page/Rules"
import User from "./page/User";
import NoPage from "./page/NoPage";
import CreateGame from "./page/CreateGame";
import UpdateGame from "./page/UpdateGame";
import Game from "./page/Game";
import Stats from "./page/Stats";
import 'react-toastify/dist/ReactToastify.css';


function App() {
  const [operatingData, setOperatingData] = useState(() => {
    const storedData = getWithExpiry('userTokenAndData');
    return storedData || { idUser: 0, rights: 0, token: null };
  });

  useEffect(() => {
    setWithExpiry('userTokenAndData', operatingData, 6 * 60 * 60 * 1000);
  }, [operatingData]);

  const history = useNavigate();

  const handleLoginChange = (idUser, rights, token) => {
    if (idUser === 0 || idUser === undefined) {
      setOperatingData({ idUser: 0, rights: 0, token: null });
      localStorage.removeItem('userTokenAndData');
      history('/');
    } else {
      setOperatingData({ idUser: idUser, rights: rights, token: token });
      setTokenWithExpiry('userTokenAndData', token, { idUser: idUser, rights: rights }, 6 * 60 * 60 * 1000);
      history('/home');
    }
  };

  return (
    <>
      <Routes>
        <Route exact path="/" element={<Index onLoginChange={handleLoginChange} operatingData={operatingData} />} />
        <Route path="/home" element={<Home onLoginChange={handleLoginChange} operatingData={operatingData} />} />
        <Route path="/sign_up" element={<SignUp onLoginChange={handleLoginChange} operatingData={operatingData} setOperatingData={setOperatingData} />} />
        <Route path="/sign_in" element={<SignIn onLoginChange={handleLoginChange} operatingData={operatingData} setOperatingData={setOperatingData} />} />
        <Route path="/user" element={<User onLoginChange={handleLoginChange} operatingData={operatingData} />} />
        <Route path="/create_game" element={<CreateGame onLoginChange={handleLoginChange} operatingData={operatingData} />} />
        <Route path="/update_game/:idGame" element={<UpdateGame onLoginChange={handleLoginChange} operatingData={operatingData} />} />
        <Route path="/game/:idGame" element={<Game operatingData={operatingData} onLoginChange={handleLoginChange}/>} />
        <Route path="/stats/:idGame" element={<Stats onLoginChange={handleLoginChange} operatingData={operatingData} />} />
        <Route path="/rules" element={<Rules onLoginChange={handleLoginChange} operatingData={operatingData} />} />
        <Route path="*" element={<NoPage onLoginChange={handleLoginChange} operatingData={operatingData} />} />
      </Routes>
      <ToastContainer />
    </>
  )
}

export default App

function setWithExpiry(key, value, ttl) {
  const now = new Date();
  const item = {
    value: value,
    expiry: now.getTime() + ttl,
  };
  localStorage.setItem(key, JSON.stringify(item));
}

function getWithExpiry(key) {
  const itemStr = localStorage.getItem(key);
  if (!itemStr) {
    return null;
  }
  const item = JSON.parse(itemStr);
  const now = new Date();
  if (now.getTime() > item.expiry) {
    localStorage.removeItem(key);
    return null;
  }
  return item.value;
}

function setTokenWithExpiry(key, token, value, ttl) {
  const now = new Date();
  const item = {
    value: value,
    token: token,
    expiry: now.getTime() + ttl,
  };
  localStorage.setItem(key, JSON.stringify(item));
}