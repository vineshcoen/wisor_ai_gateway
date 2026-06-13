import React from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Container,
  IconButton,
  Avatar,
  Stack,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';
import HistoryIcon from '@mui/icons-material/History';
import NotificationsIcon from '@mui/icons-material/Notifications';
import BusinessIcon from '@mui/icons-material/Business';

const drawerWidth = 260;

function MainLayout() {
  const location = useLocation();

  const menuItems = [
    { text: 'Dashboard', path: '/', icon: <DashboardIcon /> },
    { text: 'RFQ Inbox', path: '/rfq', icon: <ReceiptLongIcon /> },
    { text: 'Pricing Admin', path: '/pricing', icon: <SettingsSuggestIcon /> },
    { text: 'Quote History', path: '/history', icon: <HistoryIcon /> },
  ];

  // Derive current page title from current route path
  const getPageTitle = () => {
    const activeItem = menuItems.find((item) => item.path === location.pathname);
    return activeItem ? activeItem.text : 'Wisor AI';
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* AppBar (Top Navigation Bar) */}
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', px: 3 }}>
          <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 700, color: 'text.primary' }}>
            {getPageTitle()}
          </Typography>

          <Stack direction="row" spacing={2} alignItems="center">
            <IconButton color="inherit" size="small" sx={{ border: '1px solid', borderColor: 'divider' }}>
              <NotificationsIcon size="small" />
            </IconButton>
            <Divider orientation="vertical" flexItem sx={{ my: 1 }} />
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Box sx={{ textAlign: 'right', display: { xs: 'none', md: 'block' } }}>
                <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                  Alex Mercer
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Logistics Manager
                </Typography>
              </Box>
              <Avatar
                sx={{
                  width: 36,
                  height: 36,
                  bgcolor: 'primary.main',
                  color: 'primary.contrastText',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                }}
              >
                AM
              </Avatar>
            </Stack>
          </Stack>
        </Toolbar>
      </AppBar>

      {/* Permanent Sidebar (Left Drawer) */}
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {/* Logo Brand Header */}
          <Box sx={{ height: 64, display: 'flex', alignItems: 'center', px: 3, gap: 1.5 }}>
            <BusinessIcon color="primary" sx={{ fontSize: 28 }} />
            <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: '0.05em', color: 'primary.main' }}>
              WISOR AI
            </Typography>
          </Box>
          <Divider />

          {/* Navigation Links */}
          <Box sx={{ p: 2 }}>
            <List disablePadding>
              {menuItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                    <ListItemButton
                      component={NavLink}
                      to={item.path}
                      sx={{
                        borderRadius: 1,
                        py: 1.25,
                        px: 2,
                        color: isActive ? 'primary.main' : 'text.secondary',
                        bgcolor: isActive ? 'rgba(59, 130, 246, 0.08)' : 'transparent',
                        '&:hover': {
                          bgcolor: isActive ? 'rgba(59, 130, 246, 0.12)' : 'rgba(255, 255, 255, 0.04)',
                          color: isActive ? 'primary.main' : 'text.primary',
                          '& .MuiListItemIcon-root': {
                            color: isActive ? 'primary.main' : 'text.primary',
                          },
                        },
                        '& .MuiListItemIcon-root': {
                          color: isActive ? 'primary.main' : 'text.secondary',
                          minWidth: 40,
                        },
                      }}
                    >
                      <ListItemIcon sx={{ transition: 'color 0.2s' }}>{item.icon}</ListItemIcon>
                      <ListItemText
                        primary={item.text}
                        primaryTypographyProps={{
                          fontSize: '0.875rem',
                          fontWeight: isActive ? 600 : 500,
                          letterSpacing: '0.01em',
                        }}
                      />
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          </Box>
        </Drawer>
      </Box>

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Spacer for Toolbar height */}
        <Toolbar />
        <Container maxWidth="xl" sx={{ mt: 3, mb: 4, flexGrow: 1 }}>
          <Outlet />
        </Container>
      </Box>
    </Box>
  );
}

export default MainLayout;
