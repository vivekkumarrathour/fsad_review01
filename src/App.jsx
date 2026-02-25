import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { CssBaseline, ThemeProvider } from '@mui/material'
import theme from './theme'
import { AuthProvider } from './context/AuthContext'

import Login from './pages/Login'
import Home from './pages/Home'
import TeacherDashboard from './pages/TeacherDashboard'
import StudentDashboard from './pages/StudentDashboard'
import Assessments from './pages/Assessments'
import Reports from './pages/Reports'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'

function App() {
  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Home />} />

            <Route path="/teacher" element={
              <ProtectedRoute role="teacher">
                <Layout role="teacher" />
              </ProtectedRoute>
            }>
              <Route index element={<TeacherDashboard />} />
              <Route path="assessments" element={<Assessments />} />
              <Route path="reports" element={<Reports />} />
            </Route>

            <Route path="/student" element={
              <ProtectedRoute role="student">
                <Layout role="student" />
              </ProtectedRoute>
            }>
              <Route index element={<StudentDashboard />} />
              <Route path="assessments" element={<Assessments />} />
              <Route path="reports" element={<Reports />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  )
}

export default App