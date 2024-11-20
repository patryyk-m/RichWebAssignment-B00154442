'use client'; 

import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { useState, useEffect } from 'react';

export default function Home() {
  const [showLogin, setShowLogin] = useState(false);
  const [showDash, setShowDash] = useState(false);
  const [showFirstPage, setShowFirstPage] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('/api/getProducts') 
      .then((res) => res.json())
      .then((data) => {
        setData(data);
      });
  }, []);

  function runShowLogin() {
    setShowFirstPage(false);
    setShowLogin(true);
    setShowDash(false);
  }

  function runShowDash() {
    setShowFirstPage(false);
    setShowLogin(false);
    setShowDash(true);
  }

  function runShowFirst() {
    setShowFirstPage(true);
    setShowLogin(false);
    setShowDash(false);
  }

  function putInCart(pname) {
    console.log("putting in cart: " + pname);
    fetch(`/api/putInCart?pname=${pname}`);
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            MyApp
          </Typography>
          <Button color="inherit" onClick={runShowFirst}>
            First
          </Button>
          <Button color="inherit" onClick={runShowLogin}>
            Login
          </Button>
          <Button color="inherit" onClick={runShowDash}>
            Dashboard
          </Button>
        </Toolbar>
      </AppBar>

      {showFirstPage && (
        <Box component="section" sx={{ p: 2, border: '1px dashed grey' }}>
          This is a very basic application. This has a bar across the top and this box! How this app
          works is by creating two boxes. They are hidden in the background of the page. It is only
          when a user clicks one of the buttons, we change the "state" from hidden (false) to show
          (true).
        </Box>
      )}

      {showLogin && (
        <Box component="section" sx={{ p: 2, border: '1px dashed grey' }}>
          This box is hidden until you click the button! Imagine this is one page in your app!
        </Box>
      )}

      {showDash && (
        <Box component="section" sx={{ p: 2, border: '1px dashed grey' }}>
          <Typography variant="h5" sx={{ mb: 2 }}>
            Dashboard
          </Typography>
          {data ? (
            data.map((item, i) => (
              <div style={{ padding: '20px' }} key={i}>
                Unique ID: {item._id}
                <br />
                {item.pname} - {item.price}
                <br />
                <Button onClick={() => putInCart(item.pname)} variant="outlined"> Add to cart </Button>
              </div>
            ))
          ) : (
            <p>Loading...</p>
          )}
        </Box>
      )}
    </Box>
  );
}
