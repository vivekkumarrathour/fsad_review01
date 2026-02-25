import React from 'react'
import { Container, Typography, Box, Button, Paper } from '@mui/material'
import { useNavigate } from 'react-router-dom'

export default function Home() {
  const nav = useNavigate()
  return (
    <Container sx={{ mt: 12 }}>
      <Paper sx={{ p: 6, background: 'linear-gradient(135deg,#1e88e5 0%, #8e24aa 100%)', color: '#fff' }} elevation={4}>
        <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>Welcome to LearnTrack</Typography>
        <Typography variant="h6" sx={{ opacity: 0.95, mb: 3 }}>A university-grade platform to track learning outcomes, analyze student performance, and create institutional reports.</Typography>
        <Box>
          <Button variant="contained" sx={{ mr: 2 }} onClick={() => nav('/login')}>Get Started</Button>
        </Box>
      </Paper>

      <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
        <Paper sx={{ flex: 1, p: 3, background: 'linear-gradient(90deg,#fff 0%, #f3e5f5 100%)' }}>
          <Typography variant="h6">Institution Dashboard</Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>Overview of course-level KPIs, learning outcome attainment, and accreditation-ready reports.</Typography>
        </Paper>
        <Paper sx={{ flex: 1, p: 3, background: 'linear-gradient(90deg,#fff 0%, #e3f2fd 100%)' }}>
          <Typography variant="h6">Reports</Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>Export CSV and PDF reports that include performance summaries and student breakdowns for accreditation.</Typography>
        </Paper>
        <Paper sx={{ flex: 1, p: 3, background: 'linear-gradient(90deg,#fff 0%, #e8f5e9 100%)' }}>
          <Typography variant="h6">Student View</Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>Students can monitor progress, view learning outcomes, and receive targeted feedback.</Typography>
        </Paper>
      </Box>
    </Container>
  )
}
