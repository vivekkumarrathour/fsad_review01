import React from 'react'
import { Link as RouterLink } from 'react-router-dom'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import Box from '@mui/material/Box'

const drawerWidth = 240

export default function Sidebar({ items = [] }) {
  return (
    <Drawer
      variant="permanent"
      anchor="left"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box', top: 64 }
      }}
    >
      <Box sx={{ width: drawerWidth }}>
        <List>
          {items.map((it) => (
            <ListItemButton key={it.path} component={RouterLink} to={it.path}>
              <ListItemText primary={it.label} />
            </ListItemButton>
          ))}
        </List>
      </Box>
    </Drawer>
  )
}
