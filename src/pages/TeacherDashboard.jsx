import React, { useState, useEffect } from 'react'
import {
  Box, Typography, Paper, Table, TableBody, TableCell,
  TableHead, TableRow, Button, Grid, Card, CardContent,
  Avatar, Stack, TextField
} from '@mui/material'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer
} from 'recharts'
import PeopleIcon from '@mui/icons-material/People'
import ScoreIcon from '@mui/icons-material/Score'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import WarningIcon from '@mui/icons-material/Warning'

// ✅ ONLY ONE IMPORT (fixed)
import { getStudents, addStudent, deleteStudent } from '../api/studentApi'

export default function TeacherDashboard() {

  const [students, setStudents] = useState([])

  // FORM
  const [name, setName] = useState('')
  const [course, setCourse] = useState('')
  const [marks, setMarks] = useState('')
  const [grade, setGrade] = useState('')

  // FETCH
  const loadStudents = () => {
    getStudents().then(res => setStudents(res.data))
  }

  useEffect(() => {
    loadStudents()
  }, [])

  // ADD
  const handleAddStudent = () => {
    const newStudent = {
      name,
      course,
      marks: Number(marks),
      grade
    }

    addStudent(newStudent).then(() => {
      loadStudents()
      setName('')
      setCourse('')
      setMarks('')
      setGrade('')
    })
  }

  // 🔥 DELETE FUNCTION
  const handleDeleteStudent = (id) => {
    if (window.confirm("Delete this student?")) {
      deleteStudent(id).then(() => {
        loadStudents()
      })
    }
  }

  // STATS
  const totalStudents = students.length

  const averageMarks = students.length
    ? Math.round(students.reduce((s, x) => s + x.marks, 0) / students.length)
    : 0

  const averageGPA = (averageMarks / 10).toFixed(2)

  const highPerformers = students.filter(s => s.marks >= 80).length
  const needSupport = students.filter(s => s.marks < 40).length

  // CHART
  const chartData = students.map(s => ({
    name: s.name,
    marks: s.marks
  }))

  return (
    <>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={700}>
          Teacher Dashboard
        </Typography>
      </Box>

      {/* CARDS */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} md={3}>
          <Card sx={{ bgcolor: '#6a5acd', color: '#fff' }}>
            <CardContent>
              <Stack direction="row" spacing={2}>
                <Avatar><PeopleIcon /></Avatar>
                <Box>
                  <Typography>Total Students</Typography>
                  <Typography variant="h4">{totalStudents}</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card sx={{ bgcolor: '#ff6f91', color: '#fff' }}>
            <CardContent>
              <Stack direction="row" spacing={2}>
                <Avatar><ScoreIcon /></Avatar>
                <Box>
                  <Typography>Average GPA</Typography>
                  <Typography variant="h4">{averageGPA}</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card sx={{ bgcolor: '#00bcd4', color: '#fff' }}>
            <CardContent>
              <Stack direction="row" spacing={2}>
                <Avatar><TrendingUpIcon /></Avatar>
                <Box>
                  <Typography>High Performers</Typography>
                  <Typography variant="h4">{highPerformers}</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card sx={{ bgcolor: '#ffa726', color: '#fff' }}>
            <CardContent>
              <Stack direction="row" spacing={2}>
                <Avatar><WarningIcon /></Avatar>
                <Box>
                  <Typography>Need Support</Typography>
                  <Typography variant="h4">{needSupport}</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* ADD STUDENT */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6">➕ Add Student</Typography>

        <Stack direction="row" spacing={2} mt={2}>
          <TextField label="Name" value={name} onChange={e => setName(e.target.value)} />
          <TextField label="Course" value={course} onChange={e => setCourse(e.target.value)} />
          <TextField label="Marks" type="number" value={marks} onChange={e => setMarks(e.target.value)} />
          <TextField label="Grade" value={grade} onChange={e => setGrade(e.target.value)} />

          <Button variant="contained" onClick={handleAddStudent}>
            Add
          </Button>
        </Stack>
      </Paper>

      {/* CHART */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6">📊 Student Performance</Typography>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="marks" />
          </BarChart>
        </ResponsiveContainer>
      </Paper>

      {/* TABLE */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6">📋 Student List</Typography>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Course</TableCell>
              <TableCell>Marks</TableCell>
              <TableCell>Grade</TableCell>
              <TableCell>Action</TableCell> {/* ✅ added */}
            </TableRow>
          </TableHead>

          <TableBody>
            {students.map(st => (
              <TableRow key={st.id}>
                <TableCell>{st.name}</TableCell>
                <TableCell>{st.course}</TableCell>
                <TableCell>{st.marks}</TableCell>
                <TableCell>{st.grade}</TableCell>

                {/* 🔥 DELETE BUTTON */}
                <TableCell>
                  <Button
                    color="error"
                    variant="contained"
                    size="small"
                    onClick={() => handleDeleteStudent(st.id)}
                  >
                    Delete
                  </Button>
                </TableCell>

              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </>
  )
}