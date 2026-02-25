import React from 'react'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  return (
    <AppBar position="fixed" elevation={1}>
      <Toolbar sx={{ minHeight: 64 }}>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          LearnTrack
        </Typography>
        {user && (
          <>
            <Typography sx={{ mr: 2 }}>{user.name}</Typography>
            <Button color="inherit" onClick={logout}>
              Logout
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  )
}
