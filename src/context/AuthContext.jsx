import React, { createContext, useContext, useEffect, useState } from 'react'
import { users as mockUsers, assessments as mockAssessments } from '../api/mockData'
import { getStudents } from '../api/studentApi'

const AuthContext = createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {

  // 🔹 USER STATE
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('lt_user')) || null
    } catch {
      return null
    }
  })

  // 🔹 ASSESSMENTS STATE (still mock/localStorage)
  const [assessments, setAssessments] = useState(() => {
    const saved = localStorage.getItem('lt_assessments')
    const version = localStorage.getItem('lt_version')
    if (version !== '2') {
      localStorage.setItem('lt_version', '2')
      return mockAssessments
    }
    return saved ? JSON.parse(saved) : mockAssessments
  })

  // ✅ NEW — STUDENTS STATE (from backend)
  const [students, setStudents] = useState([])

  // 🔹 FETCH STUDENTS FROM BACKEND
  useEffect(() => {
    getStudents().then(res => setStudents(res.data))
  }, [])

  // 🔹 SAVE TO LOCAL STORAGE
  useEffect(() => {
    localStorage.setItem('lt_assessments', JSON.stringify(assessments))
  }, [assessments])

  useEffect(() => {
    localStorage.setItem('lt_user', JSON.stringify(user))
  }, [user])

  // 🔹 LOGIN
  function login(username, password) {
    const found = mockUsers.find((u) => u.username === username && u.password === password)
    if (found) {
      setUser(found)
      return { ok: true, user: found }
    }
    return { ok: false }
  }

  // 🔹 LOGOUT
  function logout() {
    setUser(null)
    localStorage.removeItem('lt_user')
  }

  // 🔹 ASSESSMENT FUNCTIONS
  function addAssessment(assessment) {
    setAssessments((s) => [...s, { ...assessment, id: Date.now() }])
  }

  function updateAssessment(id, update) {
    setAssessments((s) => s.map((a) => (a.id === id ? { ...a, ...update } : a)))
  }

  function deleteAssessment(id) {
    setAssessments((s) => s.filter((a) => a.id !== id))
  }

  // ✅ FINAL VALUE OBJECT
  const value = {
    user,
    login,
    logout,
    assessments,
    addAssessment,
    updateAssessment,
    deleteAssessment,
    students   // ✅ NOW COMING FROM BACKEND
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthContext