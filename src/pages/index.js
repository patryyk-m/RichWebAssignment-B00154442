'use client';

import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import TextField from '@mui/material/TextField';
import { useState, useEffect } from 'react';

export default function Home() {
  const [showAccount, setShowAccount] = useState(false);
  const [showDash, setShowDash] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [showManager, setShowManager] = useState(false);
  const [showFirstPage, setShowFirstPage] = useState(true);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [data, setData] = useState(null);
  const [cartData, setCartData] = useState(null);
  const [managerData, setManagerData] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [weather, setWeatherData] = useState(null);

  // Fetch products for dashboard
  useEffect(() => {
    if (showDash) {
      fetch('/api/getProducts')
        .then((res) => res.json())
        .then((data) => {
          setData(data);
        });
    }
  }, [showDash]);

  // Fetch cart data
  useEffect(() => {
    if (showCart) {
      fetch('/api/viewCart')
        .then((res) => {
          if (res.ok) {
            return res.json();
          }
          throw new Error('Unauthorized. Please log in.');
        })
        .then((data) => {
          setCartData(data);
        })
        .catch((error) => {
          alert(error.message);
          setCartData([]);
          setShowCart(false);
          setShowFirstPage(true);
        });
    }
  }, [showCart]);

  // Fetch manager data
  useEffect(() => {
    if (showManager) {
      fetch('/api/manager')
        .then((res) => {
          if (res.ok) {
            return res.json();
          }
          throw new Error('Unauthorized access for manager.');
        })
        .then((data) => {
          setManagerData(data);
        })
        .catch((error) => {
          alert(error.message);
          setManagerData([]);
          setShowManager(false);
          setShowFirstPage(true);
        });
    }
  }, [showManager]);

  // Fetch weather data
  useEffect(() => {
    fetch('/api/getWeather')
      .then((res) => res.json())
      .then((weather) => {
        setWeatherData(weather);
      });
  }, []);

  function runShowAccount() {
    setShowFirstPage(false);
    setShowAccount(true);
    setShowDash(false);
    setShowCart(false);
    setShowManager(false);
  }

  function runShowDash() {
    setShowFirstPage(false);
    setShowAccount(false);
    setShowDash(true);
    setShowCart(false);
    setShowManager(false);
  }

  function runShowCart() {
    if (!loggedIn) {
      alert('You need to log in to view your cart.');
      return;
    }
    setShowFirstPage(false);
    setShowAccount(false);
    setShowDash(false);
    setShowCart(true);
    setShowManager(false);
  }

  function runShowManager() {
    if (!loggedIn || userData.accType !== 'manager') {
      alert('Unauthorized access. Only managers can view this section.');
      return;
    }
    setShowFirstPage(false);
    setShowAccount(false);
    setShowDash(false);
    setShowCart(false);
    setShowManager(true);
  }

  function runShowFirst() {
    setShowFirstPage(true);
    setShowAccount(false);
    setShowDash(false);
    setShowCart(false);
    setShowManager(false);
  }

  const handleRegister = async () => {
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: email, password }),
    });

    const data = await res.json();
    if (res.ok) {
      alert('Registered successfully');
      setShowRegisterForm(false);
    } else {
      alert(data.error);
    }
  };

  const handleLogin = async () => {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: email, password }),
    });

    const data = await res.json();
    if (res.ok) {
      alert('Login successful');
      setLoggedIn(true);
      setUserData({ email, accType: data.acc_type });
      setShowRegisterForm(false);
    } else {
      alert(data.error);
    }
  };

  const handleLogout = () => {
    setLoggedIn(false);
    setUserData(null);
    setShowAccount(false);
    setShowDash(false);
    setShowCart(false);
    setShowManager(false);
    setShowFirstPage(true);
    alert('Logged out successfully');
  };

  const putInCart = async (pname) => {
    if (!loggedIn) {
      alert('You need to log in to add items to the cart.');
      return;
    }

    try {
      const res = await fetch(`/api/putInCart?pname=${pname}`);
      const data = await res.json();
      if (res.ok) {
        alert(`${data.item.pname} added to cart €${data.item.price}`);
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add to cart. Please try again.');
    }
  };

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
            Home
          </Button>
          <Button color="inherit" onClick={runShowDash}>
            Dashboard
          </Button>
          <Button color="inherit" onClick={runShowCart}>
            Cart
          </Button>
          {loggedIn && userData.accType === 'manager' && (
            <Button color="inherit" onClick={runShowManager}>
              Manager
            </Button>
          )}
          {!loggedIn && (
            <Button color="inherit" onClick={runShowAccount} sx={{ ml: 'auto' }}>
              Account
            </Button>
          )}
          {loggedIn && (
            <Button color="inherit" onClick={handleLogout} sx={{ ml: 'auto' }}>
              Log Out
            </Button>
          )}
        </Toolbar>
      </AppBar>

      {showFirstPage && (
        <Box component="section" sx={{ p: 2, border: '1px dashed grey' }}>
          <Typography variant="h5">Welcome to MyApp</Typography>
          <p></p>
          {weather ? (
            <Typography>Current temperature in Dublin: {weather.temp}°C</Typography>
          ) : (
            <Typography>Loading weather...</Typography>
          )}
        </Box>
      )}

      {showAccount && (
        <Box component="section" sx={{ p: 2, border: '1px dashed grey' }}>
          {!loggedIn ? (
            showRegisterForm ? (
              <>
                <Typography variant="h5">Register</Typography>
                <TextField label="Email" fullWidth onChange={(e) => setEmail(e.target.value)} />
                <TextField label="Password" type="password" fullWidth onChange={(e) => setPassword(e.target.value)} />
                <Button variant="contained" onClick={handleRegister} sx={{ mt: 2 }}>
                  Register
                </Button>
                <Button variant="text" onClick={() => setShowRegisterForm(false)} sx={{ mt: 2 }}>
                  Back to Login
                </Button>
              </>
            ) : (
              <>
                <Typography variant="h5">Login</Typography>
                <TextField label="Email" fullWidth onChange={(e) => setEmail(e.target.value)} />
                <TextField label="Password" type="password" fullWidth onChange={(e) => setPassword(e.target.value)} />
                <Button variant="contained" onClick={handleLogin} sx={{ mt: 2 }}>
                  Login
                </Button>
                <Button variant="text" onClick={() => setShowRegisterForm(true)} sx={{ mt: 2 }}>
                  Don't have an account? Register
                </Button>
              </>
            )
          ) : (
            <>
              <Typography variant="h5">Account Details</Typography>
              <Typography>Email: {userData.email}</Typography>
              <Typography>Account Type: {userData.accType}</Typography>
            </>
          )}
        </Box>
      )}

      {showDash && (
        <Box component="section" sx={{ p: 2, border: '1px dashed grey' }}>
          <Typography variant="h5">Dashboard</Typography>
          {data
            ? data.map((item, i) => (
                <div key={i} style={{ padding: '20px' }}>
                  Unique ID: {item._id}
                  <br />
                  {item.pname} - €{item.price}
                  <br />
                  <Button onClick={() => putInCart(item.pname)} variant="outlined">
                    Add to cart
                  </Button>
                </div>
              ))
            : 'Loading...'}
        </Box>
      )}

      {showCart && (
        <Box component="section" sx={{ p: 2, border: '1px dashed grey' }}>
          <Typography variant="h5">Cart</Typography>
          {cartData && cartData.items.length > 0 ? (
            <>
              {cartData.items.map((item, i) => (
                <div key={i} style={{ padding: '20px' }}>
                  {item.pname} - €{parseFloat(item.price).toFixed(2)}
                </div>
              ))}
              <Typography variant="h6" sx={{ mt: 2 }}>
                Total: €{cartData.total.toFixed(2)}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
                onClick={async () => {
                  const res = await fetch('/api/checkout', { method: 'POST' });
                  const data = await res.json();
                  if (res.ok) {
                    alert(data.message);
                    setCartData({ items: [], total: 0 }); // Clear cart
                  } else {
                    alert(`Error: ${data.error}`);
                  }
                }}
              >
                Checkout
              </Button>
            </>
          ) : (
            <Typography>No items in the cart.</Typography>
          )}
        </Box>
      )}

      {showManager && (
        <Box component="section" sx={{ p: 2, border: '1px dashed grey' }}>
          <Typography variant="h5">Manager Dashboard</Typography>
          {managerData && managerData.length > 0 ? (
            <>
              {managerData.map((order, i) => (
                <div key={i} style={{ padding: '20px' }}>
                  Order ID: {order._id}
                  <br />
                  Placed by: {order.email}
                  <br />
                  Time: {new Date(order.createdAt).toLocaleString()}
                  <br />
                  Products:
                  <ul>
                    {order.items.map((item, idx) => (
                      <li key={idx}>
                        {item.pname} - €{item.price}
                      </li>
                    ))}
                  </ul>
                  <Typography>Total: €{order.total} euro</Typography>
                </div>
              ))}
              <Typography variant="h6" sx={{ mt: 3 }}>
                Total Money Made: €{managerData.reduce((sum, order) => sum + parseFloat(order.total), 0).toFixed(2)}
              </Typography>
              <Typography variant="h6" sx={{ mt: 1 }}>
                Total Orders Placed: {managerData.length}
              </Typography>
            </>
          ) : (
            <Typography>No orders found.</Typography>
          )}
        </Box>
      )}
    </Box>
  );
}
