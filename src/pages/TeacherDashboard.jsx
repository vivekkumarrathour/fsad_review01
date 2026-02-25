import React, { useState, useMemo } from 'react'
import { Box, Typography, Paper, Table, TableBody, TableCell, TableHead, TableRow, IconButton, Button, Grid, Card, CardContent, Avatar, Stack, Chip, TextField, LinearProgress } from '@mui/material'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import AssessmentIcon from '@mui/icons-material/Assessment'
import PeopleIcon from '@mui/icons-material/People'
import ScoreIcon from '@mui/icons-material/Score'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import WarningIcon from '@mui/icons-material/Warning'
import { useAuth } from '../context/AuthContext'
import PerformanceChart from '../components/Charts/PerformanceChart'
import AssessmentForm from '../components/AssessmentForm'

export default function TeacherDashboard() {
  const { assessments, deleteAssessment, students } = useAuth()
  const [editing, setEditing] = useState(null)
  const [openForm, setOpenForm] = useState(false)
  const [search, setSearch] = useState('')

  const avgData = useMemo(() => assessments.map((a) => {
    const total = a.scores.reduce((s, x) => s + x.score, 0)
    const avg = a.scores.length ? (total / a.scores.length) : 0
    const pct = a.maxScore ? Math.round((avg / a.maxScore) * 100) : 0
    return { name: a.title, score: pct }
  }), [assessments])

  const totalStudents = students.length

  const gpas = students.map(st => {
    const scores = []
    assessments.forEach(a => {
      const sc = a.scores.find(x => x.studentId === st.id)
      if (sc) scores.push(Math.round((sc.score / a.maxScore) * 100))
    })
    const avg = scores.length ? (scores.reduce((s, x) => s + x, 0) / scores.length) : 0
    return +(avg / 10).toFixed(2)
  })
  const averageGPA = gpas.length ? (gpas.reduce((s, x) => s + x, 0) / gpas.length).toFixed(2) : '0.00'
  const highPerformers = gpas.filter(g => g >= 7.0).length
  const needSupport = gpas.filter(g => g < 6.0).length

  const subjects = useMemo(() => [...new Set(avgData.map(d => d.name))], [avgData])

  const handleEdit = (assessment) => {
    setEditing(assessment)
    setOpenForm(true)
  }

  const handleDelete = (id) => {
    if (window.confirm('Delete this assessment?')) deleteAssessment(id)
  }

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, background: 'linear-gradient(135deg, #1e88e5 0%, #8e24aa 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Teacher Dashboard</Typography>
          <Typography variant="body2" color="text.secondary">Monitor student performance and analyze learning outcomes</Typography>
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#fff', boxShadow: 3 }}>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.3)', width: 56, height: 56 }}><PeopleIcon fontSize="large" /></Avatar>
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>Total Students</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>{totalStudents}</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: '#fff', boxShadow: 3 }}>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.3)', width: 56, height: 56 }}><TrendingUpIcon fontSize="large" /></Avatar>
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>Average GPA</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>{averageGPA}</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: '#fff', boxShadow: 3 }}>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.3)', width: 56, height: 56 }}><ScoreIcon fontSize="large" /></Avatar>
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>High Performers</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>{highPerformers}</Typography>
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>GPA ≥ 7.0</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', color: '#fff', boxShadow: 3 }}>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.3)', width: 56, height: 56 }}><WarningIcon fontSize="large" /></Avatar>
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>Need Support</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>{needSupport}</Typography>
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>GPA &lt; 6.0</Typography>
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
            <PerformanceChart data={avgData.length ? avgData : [{ name: 'No Data', score: 0 }]} />
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, boxShadow: 2 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>📊 Class Averages</Typography>
            <Box sx={{ height: 250 }}>
              {avgData.length === 0 ? (
                <Typography sx={{ p: 2 }}>No data</Typography>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={avgData} layout="vertical">
                    <XAxis type="number" domain={[0, 100]} />
                    <YAxis type="category" dataKey="name" width={100} style={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="score" radius={[0, 8, 8, 0]}>
                      {avgData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.score >= 85 ? '#4caf50' : entry.score >= 70 ? '#ff9800' : '#f44336'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Paper sx={{ p: 3, mt: 3, boxShadow: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>👥 Student Overview</Typography>
          <Box sx={{ ml: 'auto', display: 'flex', gap: 1 }}>
            <TextField size="small" placeholder="🔍 Search students..." value={search} onChange={(e) => setSearch(e.target.value)} sx={{ minWidth: 250 }} />
          </Box>
        </Box>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Student</TableCell>
              <TableCell>Grade</TableCell>
              {subjects.map(s => (<TableCell key={s}>{s}</TableCell>))}
              <TableCell>Overall GPA</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {students.filter(st => st.name.toLowerCase().includes(search.toLowerCase())).map(st => {
              const scoresBySubject = {}
              assessments.forEach(a => {
                const sc = a.scores.find(x => x.studentId === st.id)
                const pct = sc && a.maxScore ? Math.round((sc.score / a.maxScore) * 100) : null
                scoresBySubject[a.title] = pct
              })
              const gpa = +((Object.values(scoresBySubject).filter(v => v !== null).reduce((s, v) => s + v, 0) / Math.max(1, Object.values(scoresBySubject).filter(v => v !== null).length) / 10)).toFixed(2)
              return (
                <TableRow key={st.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar sx={{ width: 32, height: 32, bgcolor: '#1e88e5', fontSize: 14 }}>{st.name[0]}</Avatar>
                      <Box>
                        <Typography sx={{ fontWeight: 500 }}>{st.name}</Typography>
                        <Typography variant="caption" color="text.secondary">{st.major}</Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>{st.grade || '10'}</TableCell>
                  {subjects.map(sub => {
                    const pct = scoresBySubject[sub]
                    const color = pct === null ? 'default' : pct >= 90 ? 'success' : pct >= 80 ? 'info' : pct >= 70 ? 'warning' : 'error'
                    return (
                      <TableCell key={sub}>
                        {pct === null ? '—' : <Chip label={`${pct}%`} color={color} size="small" sx={{ fontWeight: 600 }} />}
                      </TableCell>
                    )
                  })}
                  <TableCell>
                    <Chip label={isNaN(gpa) ? '—' : gpa.toFixed(2)} color={gpa >= 7.0 ? 'success' : gpa >= 6.0 ? 'info' : 'warning'} sx={{ fontWeight: 600 }} />
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </Paper>

      <Paper sx={{ p: 3, mt: 3, boxShadow: 2 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>📝 Recent Assessments</Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Assessment</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Students</TableCell>
              <TableCell>Avg Score</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {assessments.slice(0, 5).map(a => {
              const avg = a.scores.length ? Math.round((a.scores.reduce((s, x) => s + x.score, 0) / a.scores.length / a.maxScore) * 100) : 0
              return (
                <TableRow key={a.id} hover>
                  <TableCell>
                    <Typography sx={{ fontWeight: 500 }}>{a.title}</Typography>
                    <Typography variant="caption" color="text.secondary">{a.learningOutcome}</Typography>
                  </TableCell>
                  <TableCell>{a.date}</TableCell>
                  <TableCell>{a.scores.length}</TableCell>
                  <TableCell>
                    <Box>
                      <Chip label={`${avg}%`} color={avg >= 85 ? 'success' : avg >= 70 ? 'warning' : 'error'} size="small" sx={{ fontWeight: 600 }} />
                      <LinearProgress variant="determinate" value={avg} sx={{ mt: 0.5, height: 6, borderRadius: 3 }} color={avg >= 85 ? 'success' : avg >= 70 ? 'warning' : 'error'} />
                    </Box>
                  </TableCell>
                  <TableCell>
                    <IconButton size="small" onClick={() => handleEdit(a)} color="primary"><EditIcon fontSize="small" /></IconButton>
                    <IconButton size="small" onClick={() => handleDelete(a.id)} color="error"><DeleteIcon fontSize="small" /></IconButton>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </Paper>

      <AssessmentForm open={openForm} onClose={() => setOpenForm(false)} editing={editing} students={students} />
    </>
  )
}
