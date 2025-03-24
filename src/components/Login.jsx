import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Container, 
  Alert,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, Plane } from 'lucide-react';

const MotionBox = motion(Box);
const MotionTypography = motion(Typography);

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoginAnimating, setIsLoginAnimating] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoginAnimating(true);
    
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/users/login`, formData);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      await login(response.data.token, response.data.user);
      
      // Delay navigation to show animation
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (err) {
      setIsLoginAnimating(false);
      setError(err.response?.data?.error || 'Login failed');
      console.error('Login error:', err);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.5, type: "spring", stiffness: 120 }
    }
  };

  const airplaneVariants = {
    initial: { x: -100, y: 20, rotate: -20, opacity: 0.7 },
    animate: {
      x: 0,
      y: 0,
      rotate: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100, damping: 10 }
    },
    takeoff: {
      x: 500,
      y: -300,
      rotate: -45,
      opacity: 0,
      transition: { duration: 1.5, ease: "easeIn" }
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        // background: 'linear-gradient(to bottom right, #1a1a1a, #2d2d2d)',
        padding: 2
      }}
    >
      <Container maxWidth="sm">
        <MotionBox
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          sx={{
            bgcolor: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: 4,
            border: '1px solid rgba(255, 255, 255, 0.2)',
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'relative'
          }}
        >
          <MotionTypography
            component="h1"
            variant="h4"
            sx={{ color: 'white', mb: 4, fontWeight: 'bold' }}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            Welcome To TripBazaar
            
            <motion.div
              style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', marginTop: '8px' }}
              variants={airplaneVariants}
              initial="initial"
              animate={isLoginAnimating ? "takeoff" : "animate"}
            >
              <Plane size={40} color="#fbbf24" />
            </motion.div>
          </MotionTypography>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ width: '100%', marginBottom: '16px' }}
            >
              <Alert severity="error">{error}</Alert>
            </motion.div>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            <MotionBox
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              sx={{ mb: 2 }}
            >
              <TextField
                required
                fullWidth
                name="email"
                label="Email Address"
                value={formData.email}
                onChange={handleChange}
                disabled={isLoginAnimating}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Mail size={20} color="rgba(255,255,255,0.5)" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: 'white',
                    '& fieldset': {
                      borderColor: 'rgba(255,255,255,0.2)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(255,255,255,0.3)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#fbbf24',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: 'rgba(255,255,255,0.5)',
                  },
                }}
              />
            </MotionBox>

            <MotionBox
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              sx={{ mb: 3 }}
            >
              <TextField
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                disabled={isLoginAnimating}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock size={20} color="rgba(255,255,255,0.5)" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: 'white',
                    '& fieldset': {
                      borderColor: 'rgba(255,255,255,0.2)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(255,255,255,0.3)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#fbbf24',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: 'rgba(255,255,255,0.5)',
                  },
                }}
              />
            </MotionBox>

            <motion.div
              whileHover={!isLoginAnimating ? { scale: 1.02 } : {}}
              whileTap={!isLoginAnimating ? { scale: 0.98 } : {}}
            >
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={isLoginAnimating}
                sx={{
                  bgcolor: '#fbbf24',
                  color: 'black',
                  py: 1.5,
                  '&:hover': {
                    bgcolor: '#f59e0b',
                  },
                }}
                endIcon={<ArrowRight />}
              >
                {isLoginAnimating ? "Taking Off..." : "Login"}
              </Button>
            </motion.div>
          </Box>

          <MotionBox
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            sx={{
              mt: 3,
              display: 'flex',
              justifyContent: 'center',
              gap: 2,
              color: 'rgba(255,255,255,0.8)'
            }}
          >
            {/* <Button
              onClick={() => navigate('/forgot-password')}
              sx={{
                color: '#fbbf24',
                '&:hover': {
                  textDecoration: 'underline',
                  bgcolor: 'transparent'
                }
              }}
              disabled={isLoginAnimating}
            >
              Forgot Password?
            </Button> */}
            
            {/* <Typography sx={{ color: 'rgba(255,255,255,0.5)' }}>|</Typography> */}
            
            {/* <Button
              onClick={() => navigate('/register')}
              sx={{
                color: '#fbbf24',
                '&:hover': {
                  textDecoration: 'underline',
                  bgcolor: 'transparent'
                }
              }}
              disabled={isLoginAnimating}
            >
              Create Account
            </Button> */}
          </MotionBox>
        </MotionBox>
      </Container>
    </Box>
  );
};

export default Login;