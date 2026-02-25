import React, { useState } from 'react'
import { Container, Typography, Paper, Table, TableBody, TableCell, TableHead, TableRow, TextField, InputAdornment, IconButton, Grid, Card, CardContent, Tabs, Tab, Chip, Button, Box } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import DownloadIcon from '@mui/icons-material/Download'
import AddIcon from '@mui/icons-material/Add'
import { useAuth } from '../context/AuthContext'
import AssessmentForm from '../components/AssessmentForm'

export default function Assessments() {
  const { assessments, students, user } = useAuth()
  const [q, setQ] = useState('')
  const [tab, setTab] = useState(0)
  const [openForm, setOpenForm] = useState(false)

  const subjects = ['All Subjects', 'FSAD', 'AIML', 'NLP', 'OS']
  
  const filtered = assessments.filter((a) => {
    const matchesSearch = a.title.toLowerCase().includes(q.toLowerCase())
    const matchesTab = tab === 0 || a.title.includes(subjects[tab])
    const matchesStudent = user?.role === 'teacher' || a.scores.some(s => s.studentId === user?.id)
    return matchesSearch && matchesTab && matchesStudent
  })

  return (
    <Container sx={{ mt: 0 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={8}>
          <Typography variant="h4">Assessment Tracker</Typography>
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField fullWidth placeholder="Search assessments" value={q} onChange={(e) => setQ(e.target.value)} InputProps={{ startAdornment: (<InputAdornment position="start"><SearchIcon /></InputAdornment>), }} />
        </Grid>
      </Grid>

      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2">Total Assessments</Typography>
              <Typography variant="h5">{assessments.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2">Filtered</Typography>
              <Typography variant="h5">{filtered.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6} sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ ml: 'auto', display: 'flex', gap: 1 }}>
            <Button variant="outlined" startIcon={<DownloadIcon />}>Export</Button>
            {user?.role === 'teacher' && (
              <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpenForm(true)}>Add Assessment</Button>
            )}
          </Box>
        </Grid>
      </Grid>

      <Paper sx={{ p: 2, mt: 2 }}>
        <Tabs value={tab} onChange={(e, v) => setTab(v)} sx={{ mb: 2 }}>
          <Tab label="All Subjects" />
          <Tab label="FSAD" />
          <Tab label="AIML" />
          <Tab label="NLP" />
          <Tab label="OS" />
        </Tabs>

        {filtered.length === 0 ? (
          <Typography sx={{ p: 2 }}>No assessments match your search.</Typography>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Student</TableCell>
                <TableCell>Subject</TableCell>
                <TableCell>Assessment</TableCell>
                <TableCell>Learning Outcome</TableCell>
                <TableCell>Score</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map((a) => (
                a.scores
                  .filter(s => user?.role === 'teacher' || s.studentId === user?.id)
                  .map((s, i) => {
                    const student = students.find(st => st.id === s.studentId)
                    return (
                      <TableRow key={`${a.id}-${i}`}>
                        <TableCell>{student?.name || `Student ${s.studentId}`}</TableCell>
                        <TableCell>{a.title.split(' ')[0]}</TableCell>
                        <TableCell>{a.title}</TableCell>
                        <TableCell><Chip label={a.learningOutcome} color="info" size="small" /></TableCell>
                        <TableCell>
                          <Box>
                            {s.score}/{a.maxScore}
                            <Typography variant="caption" color="success.main" display="block">{Math.round((s.score/a.maxScore)*100)}%</Typography>
                          </Box>
                        </TableCell>
                        <TableCell>{a.date}</TableCell>
                        <TableCell>—</TableCell>
                      </TableRow>
                    )
                  })
              ))}
            </TableBody>
          </Table>
        )}
      </Paper>

      <AssessmentForm open={openForm} onClose={() => setOpenForm(false)} editing={null} students={students} />
    </Container>
  )
}
