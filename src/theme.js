import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    primary: { main: '#1e88e5' },
    secondary: { main: '#8e24aa' },
    success: { main: '#2e7d32' },
    info: { main: '#29b6f6' }
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: { borderRadius: 12 }
      }
    }
  },
  typography: {
    h4: { fontWeight: 700 },
    h5: { fontWeight: 600 }
  }
})

export default theme