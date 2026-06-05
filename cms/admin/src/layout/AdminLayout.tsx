import {
  AppBar,
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ArticleIcon from '@mui/icons-material/Article';
import MenuIcon from '@mui/icons-material/Menu';
import PermMediaIcon from '@mui/icons-material/PermMedia';
import LogoutIcon from '@mui/icons-material/Logout';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

const drawerWidth = 240;

const nav = [
  { label: 'Dashboard', path: '/', icon: <DashboardIcon /> },
  { label: 'Pages', path: '/pages', icon: <ArticleIcon /> },
  { label: 'Menus', path: '/menus', icon: <MenuIcon /> },
  { label: 'Media', path: '/media', icon: <PermMediaIcon /> },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ zIndex: (t) => t.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            CoreBridge CMS
          </Typography>
          <Typography variant="body2" sx={{ mr: 2 }}>
            {user?.name}
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box', mt: 8 },
        }}
      >
        <List>
          {nav.map((item) => (
            <ListItemButton
              key={item.path}
              selected={location.pathname === item.path}
              onClick={() => navigate(item.path)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          ))}
          <ListItemButton onClick={logout}>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8, ml: `${drawerWidth}px` }}>
        <Outlet />
      </Box>
    </Box>
  );
}
