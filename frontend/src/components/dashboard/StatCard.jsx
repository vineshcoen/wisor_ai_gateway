import React from 'react';
import { Card, CardContent, Box, Typography, Skeleton } from '@mui/material';

function StatCard({ title, value, icon, description, color = 'primary', loading = false }) {
  if (loading) {
    return (
      <Card sx={{ height: '100%' }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Skeleton variant="text" width="60%" height={24} />
            <Skeleton variant="circular" width={40} height={40} />
          </Box>
          <Skeleton variant="rectangular" width="40%" height={40} sx={{ mb: 1, borderRadius: 1 }} />
          <Skeleton variant="text" width="80%" height={20} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      sx={{
        height: '100%',
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out, border-color 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          borderColor: `${color}.main`,
          boxShadow: (theme) => `0 12px 20px -10px rgba(0, 0, 0, 0.3), 0 4px 20px 0 rgba(0, 0, 0, 0.1)`,
        },
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600 }}>
            {title}
          </Typography>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              p: 1,
              borderRadius: 2,
              bgcolor: (theme) => `rgba(${theme.palette[color].main === '#5BC0BE' ? '91, 192, 190' : theme.palette[color].main === '#3A86FF' ? '58, 134, 255' : theme.palette[color].main === '#2ECC71' ? '46, 204, 113' : '243, 156, 18'}, 0.1)`,
              color: `${color}.main`,
            }}
          >
            {icon}
          </Box>
        </Box>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, color: 'text.primary' }}>
          {value}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default StatCard;
