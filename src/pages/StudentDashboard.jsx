import React, { useMemo } from 'react'
import { Typography, Paper, Table, TableBody, TableCell, TableHead, TableRow, Grid, Card, CardContent, Avatar, Stack, Chip, Box, LinearProgress } from '@mui/material'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis } from 'recharts'
import PersonIcon from '@mui/icons-material/Person'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import AssignmentIcon from '@mui/icons-material/Assignment'
import { useAuth } from '../context/AuthContext'
import PerformanceChart from '../components/Charts/PerformanceChart'

const navItems = [
  { path: '/student', label: 'Overview' },
  { path: '/student/assessments', label: 'Assessments' },
  { path: '/student/reports', label: 'Reports' }
]

export default function StudentDashboard() {
  const { user, assessments } = useAuth()
  const studentId = user?.id

  const myScores = []
  assessments.forEach((a) => {
    const sc = a.scores.find((s) => s.studentId === studentId)
    if (sc) myScores.push({ title: a.title, date: a.date, score: sc.score, max: a.maxScore })
  })

  const chartData = myScores.map((m) => ({ name: m.title, score: Math.round((m.score / m.max) * 100) }))

  const avgPercent = chartData.length ? Math.round(chartData.reduce((s, c) => s + c.score, 0) / chartData.length) : null
  const gpa = avgPercent !== null ? (avgPercent / 10).toFixed(2) : '0.00'
  
  const gradeDistribution = useMemo(() => {
    const grades = { A: 0, B: 0, C: 0, D: 0, F: 0 }
    chartData.forEach(d => {
      if (d.score >= 90) grades.A++
      else if (d.score >= 80) grades.B++
      else if (d.score >= 70) grades.C++
      else if (d.score >= 60) grades.D++
      else grades.F++
    })
    return Object.entries(grades).map(([name, value]) => ({ name, value })).filter(g => g.value > 0)
  }, [chartData])

  const COLORS = ['#4caf50', '#2196f3', '#ff9800', '#ff5722', '#9e9e9e']
  const subjectBreakdown = useMemo(() => {
    const map = {}
    assessments.forEach(a => {
      const sc = a.scores.find(s => s.studentId === studentId)
      if (sc) {
        const pct = Math.round((sc.score / a.maxScore) * 100)
        map[a.title.split(' ')[0]] = Math.max(map[a.title.split(' ')[0]] || 0, pct)
      }
    })
    return map
  }, [assessments, studentId])

  return (
    <>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Student Dashboard</Typography>
        <Typography variant="body2" color="text.secondary">Track your academic progress and performance</Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#fff', boxShadow: 3 }}>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.3)', width: 56, height: 56 }}><EmojiEventsIcon fontSize="large" /></Avatar>
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>Overall GPA</Typography>
                  <Typography variant="h3" sx={{ fontWeight: 700 }}>{gpa}</Typography>
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>Top 20% of class</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: '#fff', boxShadow: 3 }}>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.3)', width: 56, height: 56 }}><AssignmentIcon fontSize="large" /></Avatar>
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>Completed</Typography>
                  <Typography variant="h3" sx={{ fontWeight: 700 }}>{myScores.length}</Typography>
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>Assessments</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: '#fff', boxShadow: 3 }}>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.3)', width: 56, height: 56 }}><TrendingUpIcon fontSize="large" /></Avatar>
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>Average Score</Typography>
                  <Typography variant="h3" sx={{ fontWeight: 700 }}>{avgPercent || 0}%</Typography>
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>Class avg: 82%</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, boxShadow: 2 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>📈 Performance Trend</Typography>
            <Box sx={{ height: 280 }}>
              {chartData.length === 0 ? <Typography>No data</Typography> : <PerformanceChart data={chartData} />}
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, boxShadow: 2 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>🎯 Grade Distribution</Typography>
            <Box sx={{ height: 280, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {gradeDistribution.length === 0 ? (
                <Typography variant="body2" color="text.secondary">No data</Typography>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={gradeDistribution} cx="50%" cy="50%" labelLine={false} label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`} outerRadius={80} fill="#8884d8" dataKey="value">
                      {gradeDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Paper sx={{ p: 3, mt: 3, boxShadow: 2 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>📊 Subject Performance Breakdown</Typography>
        <Box sx={{ mt: 2 }}>
          {Object.keys(subjectBreakdown).map((k) => {
            const score = subjectBreakdown[k]
            const color = score >= 90 ? 'success' : score >= 80 ? 'info' : score >= 70 ? 'warning' : 'error'
            return (
              <Box key={k} sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>{k}</Typography>
                  <Chip label={`${score}%`} color={color} size="small" sx={{ fontWeight: 600 }} />
                </Box>
                <LinearProgress variant="determinate" value={score} sx={{ height: 10, borderRadius: 5 }} color={color} />
                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>Target: 85% {score >= 85 ? '✅' : '⚠️'}</Typography>
              </Box>
            )
          })}
        </Box>
      </Paper>

      <Paper sx={{ p: 3, mt: 3, boxShadow: 2 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>📝 Recent Assessments</Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Assessment</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Score</TableCell>
              <TableCell>Performance</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {myScores.map((m, i) => {
              const pct = Math.round((m.score / m.max) * 100)
              const color = pct >= 90 ? 'success' : pct >= 80 ? 'info' : pct >= 70 ? 'warning' : 'error'
              return (
                <TableRow key={i} hover>
                  <TableCell>
                    <Typography sx={{ fontWeight: 500 }}>{m.title}</Typography>
                  </TableCell>
                  <TableCell>{m.date}</TableCell>
                  <TableCell>
                    <Typography sx={{ fontWeight: 500 }}>{m.score}/{m.max}</Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip label={`${pct}%`} color={color} size="small" sx={{ fontWeight: 600 }} />
                      <Box sx={{ flexGrow: 1, maxWidth: 200 }}>
                        <LinearProgress variant="determinate" value={pct} sx={{ height: 6, borderRadius: 3 }} color={color} />
                      </Box>
                    </Box>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </Paper>

      <Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, boxShadow: 2, background: 'linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)' }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>🎯 Areas of Strength</Typography>
            {Object.entries(subjectBreakdown).filter(([k, v]) => v >= 85).map(([k, v]) => (
              <Chip key={k} label={`${k}: ${v}%`} color="success" sx={{ m: 0.5, fontWeight: 600 }} />
            ))}
            {Object.entries(subjectBreakdown).filter(([k, v]) => v >= 85).length === 0 && (
              <Typography variant="body2" color="text.secondary">Keep working to reach 85%+ in subjects</Typography>
            )}
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, boxShadow: 2, background: 'linear-gradient(135deg, #fff3e0 0%, #ffebee 100%)' }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>⚠️ Areas for Improvement</Typography>
            {Object.entries(subjectBreakdown).filter(([k, v]) => v < 85).map(([k, v]) => (
              <Chip key={k} label={`${k}: ${v}%`} color="warning" sx={{ m: 0.5, fontWeight: 600 }} />
            ))}
            {Object.entries(subjectBreakdown).filter(([k, v]) => v < 85).length === 0 && (
              <Typography variant="body2" color="text.secondary">Great job! All subjects above target</Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </>
  )
}
