import React, { useMemo, useState } from 'react'
import { Container, Typography, Paper, Button, Grid, Card, CardContent, TextField, Box, MenuItem } from '@mui/material'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis } from 'recharts'
import DownloadIcon from '@mui/icons-material/Download'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'
import { useAuth } from '../context/AuthContext'
import { saveAs } from 'file-saver'
import jsPDF from 'jspdf'
import PerformanceChart from '../components/Charts/PerformanceChart'

export default function Reports() {
  const { assessments, students } = useAuth()
  const [reportType, setReportType] = useState('performance')
  
  const avgData = useMemo(() => assessments.map((a) => {
    const total = a.scores.reduce((s, x) => s + x.score, 0)
    const avg = a.scores.length ? (total / a.scores.length) : 0
    const pct = a.maxScore ? Math.round((avg / a.maxScore) * 100) : 0
    return { name: a.title, score: pct }
  }), [assessments])

  const gpaDistribution = useMemo(() => {
    const ranges = { 'A (8.0-10.0)': 0, 'B (7.0-8.0)': 0, 'C (6.0-7.0)': 0, 'D (5.0-6.0)': 0, 'F (<5.0)': 0 }
    students.forEach(st => {
      const scores = []
      assessments.forEach(a => {
        const sc = a.scores.find(x => x.studentId === st.id)
        if (sc) scores.push(Math.round((sc.score / a.maxScore) * 100))
      })
      const avg = scores.length ? (scores.reduce((s, x) => s + x, 0) / scores.length) : 0
      const gpa = avg / 10
      if (gpa >= 8.0) ranges['A (8.0-10.0)']++
      else if (gpa >= 7.0) ranges['B (7.0-8.0)']++
      else if (gpa >= 6.0) ranges['C (6.0-7.0)']++
      else if (gpa >= 5.0) ranges['D (5.0-6.0)']++
      else ranges['F (<5.0)']++
    })
    return Object.entries(ranges).map(([name, value]) => ({ name, value })).filter(r => r.value > 0)
  }, [students, assessments])

  const COLORS = ['#4caf50', '#2196f3', '#ff9800', '#ff5722', '#9e9e9e']

  function downloadCSV() {
    const rows = [['Title', 'Date', 'MaxScore', 'StudentId', 'Score']]
    assessments.forEach((a) => {
      a.scores.forEach((s) => rows.push([a.title, a.date, a.maxScore, s.studentId, s.score]))
    })
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    saveAs(blob, 'assessments.csv')
  }

  function downloadPDF() {
    const doc = new jsPDF()
    doc.setFontSize(14)
    doc.text('Assessments Report', 14, 20)
    let y = 30
    assessments.forEach((a) => {
      doc.setFontSize(12)
      doc.text(`${a.title} (${a.date}) - Max: ${a.maxScore}`, 14, y)
      y += 6
      a.scores.forEach((s) => {
        doc.text(`Student ${s.studentId}: ${s.score}`, 18, y)
        y += 6
        if (y > 270) { doc.addPage(); y = 20 }
      })
      y += 4
    })
    doc.save('assessments.pdf')
  }

  return (
    <Container sx={{ mt: 0 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Reports & Analytics</Typography>
        <Typography variant="body2" color="text.secondary">Generate comprehensive performance reports with visualizations</Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <TextField select fullWidth label="Report Type" value={reportType} onChange={(e) => setReportType(e.target.value)}>
            <MenuItem value="performance">Class Performance</MenuItem>
            <MenuItem value="individual">Individual Student</MenuItem>
            <MenuItem value="outcome">Learning Outcomes</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField fullWidth placeholder="Filter by course or term" label="Filter" />
        </Grid>
        <Grid item xs={12} md={4} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Button variant="outlined" onClick={downloadCSV} startIcon={<DownloadIcon />} fullWidth>CSV</Button>
          <Button variant="contained" onClick={downloadPDF} startIcon={<PictureAsPdfIcon />} fullWidth>PDF</Button>
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, boxShadow: 2 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>📈 Subject Performance Overview</Typography>
            <Box sx={{ height: 300 }}>
              <PerformanceChart data={avgData} />
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, boxShadow: 2 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>🎯 GPA Distribution</Typography>
            <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {gpaDistribution.length === 0 ? (
                <Typography variant="body2" color="text.secondary">No data</Typography>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={gpaDistribution} cx="50%" cy="50%" labelLine={false} label={({ name, percent }) => `${name.split(' ')[0]}: ${(percent * 100).toFixed(0)}%`} outerRadius={80} fill="#8884d8" dataKey="value">
                      {gpaDistribution.map((entry, index) => (
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
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>📊 Summary Statistics</Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#fff' }}>
              <CardContent>
                <Typography variant="caption" sx={{ opacity: 0.9 }}>Average Class GPA</Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, mt: 1 }}>8.8</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: '#fff' }}>
              <CardContent>
                <Typography variant="caption" sx={{ opacity: 0.9 }}>Pass Rate</Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, mt: 1 }}>100%</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: '#fff' }}>
              <CardContent>
                <Typography variant="caption" sx={{ opacity: 0.9 }}>Honor Roll</Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, mt: 1 }}>40%</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', color: '#fff' }}>
              <CardContent>
                <Typography variant="caption" sx={{ opacity: 0.9 }}>Avg Attendance</Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, mt: 1 }}>95%</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  )
}
