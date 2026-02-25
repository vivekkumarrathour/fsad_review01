import React, { createContext, useContext, useEffect, useState } from 'react'
import { users as mockUsers, assessments as mockAssessments, students as mockStudents } from '../api/mockData'

const AuthContext = createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('lt_user')) || null
    } catch {
      return null
    }
  })

  const [assessments, setAssessments] = useState(() => {
    const saved = localStorage.getItem('lt_assessments')
    const version = localStorage.getItem('lt_version')
    if (version !== '2') {
      localStorage.setItem('lt_version', '2')
      return mockAssessments
    }
    return saved ? JSON.parse(saved) : mockAssessments
  })

  useEffect(() => {
    localStorage.setItem('lt_assessments', JSON.stringify(assessments))
  }, [assessments])

  useEffect(() => {
    localStorage.setItem('lt_user', JSON.stringify(user))
  }, [user])

  function login(username, password) {
    const found = mockUsers.find((u) => u.username === username && u.password === password)
    if (found) {
      setUser(found)
      return { ok: true, user: found }
    }
    return { ok: false }
  }

  function logout() {
    setUser(null)
    localStorage.removeItem('lt_user')
  }

  function addAssessment(assessment) {
    setAssessments((s) => [...s, { ...assessment, id: Date.now() }])
  }

  function updateAssessment(id, update) {
    setAssessments((s) => s.map((a) => (a.id === id ? { ...a, ...update } : a)))
  }

  function deleteAssessment(id) {
    setAssessments((s) => s.filter((a) => a.id !== id))
  }

  const value = {
    user,
    login,
    logout,
    assessments,
    addAssessment,
    updateAssessment,
    deleteAssessment,
    students: mockStudents
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthContext
