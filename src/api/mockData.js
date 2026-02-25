const users = [
  { id: 1, username: 'Mr.Pavan', password: 'Pavan', role: 'teacher', name: 'Mr.Pavan' },
  { id: 2, username: 'Rajnish', password: 'Rajnish', role: 'student', name: 'Rajnish' },
  { id: 3, username: 'Vivek', password: 'Vivek', role: 'student', name: 'Vivek' },
  { id: 4, username: 'Raghuram', password: 'Raghuram', role: 'student', name: 'Raghuram' }
]

const courses = [
  { id: 1, code: 'FSAD', name: 'Full Stack Application Development' },
  { id: 2, code: 'AIML', name: 'Artificial Intelligence & Machine Learning' },
  { id: 3, code: 'NLP', name: 'Natural Language Processing' },
  { id: 4, code: 'OS', name: 'Operating Systems' }
]

const assessments = [
  { id: 1, title: 'FSAD - Midterm', courseId: 1, term: 'Insem-1', date: '2026-02-10', maxScore: 100, weight: 30, learningOutcome: 'Web Development', scores: [{ studentId: 2, score: 85 }, { studentId: 3, score: 88 }, { studentId: 4, score: 92 }] },
  { id: 2, title: 'AIML - Quiz 1', courseId: 2, term: 'Insem-1', date: '2026-02-17', maxScore: 50, weight: 10, learningOutcome: 'Machine Learning', scores: [{ studentId: 2, score: 45 }, { studentId: 3, score: 46 }, { studentId: 4, score: 48 }] },
  { id: 3, title: 'NLP - Assignment', courseId: 3, term: 'Insem-2', date: '2026-02-20', maxScore: 100, weight: 20, learningOutcome: 'Text Processing', scores: [{ studentId: 2, score: 90 }, { studentId: 3, score: 92 }, { studentId: 4, score: 88 }] },
  { id: 4, title: 'OS - Final', courseId: 4, term: 'Endsem', date: '2026-03-01', maxScore: 100, weight: 40, learningOutcome: 'Process Management', scores: [{ studentId: 2, score: 88 }, { studentId: 3, score: 85 }, { studentId: 4, score: 91 }] }
]

const students = [
  { id: 2, name: 'Rajnish', major: 'Computer Science' },
  { id: 3, name: 'Vivek', major: 'Computer Science' },
  { id: 4, name: 'Raghuram', major: 'Computer Science' }
]

export { users, assessments, students, courses }
