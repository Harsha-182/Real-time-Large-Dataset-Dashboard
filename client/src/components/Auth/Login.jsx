import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Box, Button, TextField, Typography, Alert, CircularProgress } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import { login } from '../actions/AuthAction/login';

const theme = createTheme({
  palette: {
    background: {
      default: '#f4f6f8',
    },
    primary: {
      main: '#1976d2',
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
    h4: {
      fontWeight: 500,
      fontFamily: 'Arial, sans-serif',
    },
  },
});

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, status, role } = useSelector(state => state.Login);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isToast, setToast] = useState(false);

  useEffect (() => {
    if(isToast){
      console.log("status", status)
      if(status && status === 'success'){
        if(role === 'super-admin'){
          navigate('/dashboard/');
        } else if(role === 'user') {
          navigate('/dashboard/user/')
        }
        else {
          toast.success('Your role not exist')
        }
        // toast.success('Login Successfull!')
      } else{
        toast.error(error)
      }
    }
  },[status])

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login({ email, password }));
    setToast(true);
  };

  return (
    <ThemeProvider theme={theme}>
      <ToastContainer/>
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          height: '100vh',
          backgroundColor: 'background.default'
        }}
      >
        <Box sx={{ maxWidth: 400, width: '100%', padding: 3, backgroundColor: '#fff', borderRadius: 2, boxShadow: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom textAlign="center" color="primary.main">
            Login
          </Typography>
          <form>
            <TextField
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              margin="normal"
              required
            />
            {loading ? (
              <Box display="flex" justifyContent="center" mt={2}>
                <CircularProgress />
              </Box>
            ) : (
              <Button variant="contained" color="primary" onClick={handleSubmit} fullWidth sx={{ marginTop: 2 }}>
                Login
              </Button>
            )}
          </form>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Login;
