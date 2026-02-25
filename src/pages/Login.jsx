import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Container, TextField, Button, Typography, Box, Paper, Avatar } from '@mui/material'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    const res = login(username, password)
    if (res.ok) {
      if (res.user.role === 'teacher') navigate('/teacher')
      else navigate('/student')
    } else {
      setError('Invalid credentials')
    }
  }

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <Container maxWidth="xs">
        <Paper sx={{ p: 4, borderRadius: 3, boxShadow: 5 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
            <Avatar sx={{ m: 1, bgcolor: '#1e88e5', width: 56, height: 56 }}>
              <LockOutlinedIcon fontSize="large" />
            </Avatar>
            <Typography variant="h4" sx={{ fontWeight: 700, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              LearnTrack
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Sign in to your account
            </Typography>
          </Box>
          
          <Box component="form" onSubmit={handleSubmit}>
            <TextField fullWidth label="Username" margin="normal" value={username} onChange={(e) => setUsername(e.target.value)} autoFocus />
            <TextField fullWidth label="Password" margin="normal" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            {error && (
              <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                {error}
              </Typography>
            )}
            <Button type="submit" fullWidth variant="contained" size="large" sx={{ mt: 3, mb: 2, py: 1.5, fontWeight: 600, boxShadow: 3 }}>
              Sign In
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  )
}
