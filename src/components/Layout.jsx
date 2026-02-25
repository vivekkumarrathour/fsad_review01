import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import { Box, Container } from '@mui/material'

export default function Layout({ role = 'teacher' }) {
  const navItems = role === 'teacher'
    ? [
        { path: '/teacher', label: 'Overview' },
        { path: '/teacher/assessments', label: 'Assessments' },
        { path: '/teacher/reports', label: 'Reports' }
      ]
    : [
        { path: '/student', label: 'Overview' },
        { path: '/student/assessments', label: 'Assessments' },
        { path: '/student/reports', label: 'Reports' }
      ]

  return (
    <Box>
      <Navbar />
      <Sidebar items={navItems} />
      <Container className="lt-main" sx={{ marginLeft: '240px', paddingTop: '88px' }}>
        <Outlet />
      </Container>
    </Box>
  )
}
