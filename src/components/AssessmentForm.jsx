import React, { useEffect, useState } from 'react'
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button, Box, MenuItem, Grid } from '@mui/material'
import { useAuth } from '../context/AuthContext'

export default function AssessmentForm({ open = false, onClose = () => {}, editing = null }) {
  const { addAssessment, updateAssessment, students } = useAuth()
  const [title, setTitle] = useState('')
  const [date, setDate] = useState('')
  const [maxScore, setMaxScore] = useState(100)
  const [weight, setWeight] = useState(10)
  const [learningOutcome, setLearningOutcome] = useState('Problem Solving')
  const [term, setTerm] = useState('Insem-1')
  const [courseId, setCourseId] = useState(1)

  useEffect(() => {
    if (editing) {
      setTitle(editing.title || '')
      setDate(editing.date || '')
      setMaxScore(editing.maxScore || 100)
      setWeight(editing.weight || 10)
      setLearningOutcome(editing.learningOutcome || 'Problem Solving')
      setTerm(editing.term || 'Insem-1')
      setCourseId(editing.courseId || 1)
    } else {
      setTitle('')
      setDate('')
      setMaxScore(100)
      setWeight(10)
      setLearningOutcome('Problem Solving')
      setTerm('Insem-1')
      setCourseId(1)
    }
  }, [editing, open])

  function handleSave() {
    const payload = { 
      title, 
      date, 
      maxScore: Number(maxScore), 
      weight: Number(weight),
      learningOutcome,
      term,
      courseId: Number(courseId),
      scores: editing?.scores || [] 
    }
    if (editing) updateAssessment(editing.id, payload)
    else addAssessment(payload)
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle sx={{ fontWeight: 600, fontSize: 20 }}>{editing ? '✏️ Edit Assessment' : '➕ Add Assessment'}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 0.5 }}>
          <Grid item xs={12}>
            <TextField label="Assessment Title" fullWidth value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., CS101 - Midterm Exam" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Date" type="date" fullWidth value={date} onChange={(e) => setDate(e.target.value)} InputLabelProps={{ shrink: true }} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Term" select fullWidth value={term} onChange={(e) => setTerm(e.target.value)}>
              <MenuItem value="Insem-1">Insem-1</MenuItem>
              <MenuItem value="Insem-2">Insem-2</MenuItem>
              <MenuItem value="Endsem">Endsem</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField label="Max Score" type="number" fullWidth value={maxScore} onChange={(e) => setMaxScore(e.target.value)} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField label="Weight (%)" type="number" fullWidth value={weight} onChange={(e) => setWeight(e.target.value)} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField label="Course" select fullWidth value={courseId} onChange={(e) => setCourseId(e.target.value)}>
              <MenuItem value={1}>FSAD</MenuItem>
              <MenuItem value={2}>AIML</MenuItem>
              <MenuItem value={3}>NLP</MenuItem>
              <MenuItem value={4}>OS</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <TextField label="Learning Outcome" select fullWidth value={learningOutcome} onChange={(e) => setLearningOutcome(e.target.value)}>
              <MenuItem value="Problem Solving">Problem Solving</MenuItem>
              <MenuItem value="Critical Thinking">Critical Thinking</MenuItem>
              <MenuItem value="Algorithms">Algorithms</MenuItem>
              <MenuItem value="Integration">Integration</MenuItem>
              <MenuItem value="Data Structures">Data Structures</MenuItem>
            </TextField>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} variant="outlined">Cancel</Button>
        <Button variant="contained" onClick={handleSave} disabled={!title || !date}>Save Assessment</Button>
      </DialogActions>
    </Dialog>
  )
}
