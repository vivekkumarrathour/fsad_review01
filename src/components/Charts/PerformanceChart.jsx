import React from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts'

export default function PerformanceChart({ data = [] }) {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="score" stroke="#1976d2" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  )
}
