import React, { useState, useEffect } from 'react';
import { Box, Grid, Card, CardContent, Typography, Button, Stack } from '@mui/material';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import ScheduleIcon from '@mui/icons-material/Schedule';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ErrorIcon from '@mui/icons-material/Error';
import RefreshIcon from '@mui/icons-material/Refresh';

import api from '../services/api';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import StatCard from '../components/dashboard/StatCard';
import RecentRFQTable from '../components/dashboard/RecentRFQTable';
import CreateRFQDialog from '../components/rfq/CreateRFQDialog';

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [rfqs, setRfqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCreateRFQOpen, setIsCreateRFQOpen] = useState(false);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsRes, rfqRes] = await Promise.all([
        api.get('/api/dashboard/stats'),
        api.get('/api/rfq'),
      ]);
      setStats(statsRes.data);
      setRfqs(rfqRes.data);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
      setError('Unable to load dashboard data. Try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const formatRevenue = (value) => {
    if (value === undefined || value === null) return '$0';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value);
  };

  // After a new RFQ is created from the dashboard, refresh the table
  const handleRFQCreated = () => {
    fetchDashboardData();
  };

  return (
    <Box sx={{ py: 2 }}>
      {/* 1. Dashboard Page Header */}
      <DashboardHeader onCreateRFQ={() => setIsCreateRFQOpen(true)} />

      {/* 2. Error Fallback UI */}
      {error ? (
        <Card
          variant="outlined"
          sx={{
            p: 4,
            borderColor: 'error.main',
            bgcolor: 'rgba(231, 76, 60, 0.05)',
            textAlign: 'center',
            mb: 4,
          }}
        >
          <CardContent>
            <Stack spacing={2} alignItems="center">
              <ErrorIcon color="error" sx={{ fontSize: 48 }} />
              <Typography variant="h6" color="error" sx={{ fontWeight: 600 }}>
                {error}
              </Typography>
              <Button
                variant="outlined"
                color="error"
                startIcon={<RefreshIcon />}
                onClick={fetchDashboardData}
                sx={{ mt: 1 }}
              >
                Try Again
              </Button>
            </Stack>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* 3. KPI Statistics Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="RFQs Today"
                value={stats?.rfqs_today ?? '0'}
                icon={<LocalShippingIcon />}
                description="RFQs created today"
                color="primary"
                loading={loading}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Quotes Generated"
                value={stats?.quotes_generated ?? '0'}
                icon={<ReceiptLongIcon />}
                description="Total quotes ever generated"
                color="secondary"
                loading={loading}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Pending Review"
                value={stats?.pending_review ?? '0'}
                icon={<ScheduleIcon />}
                description="Awaiting quote processing"
                color="warning"
                loading={loading}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Revenue"
                value={formatRevenue(stats?.revenue)}
                icon={<AttachMoneyIcon />}
                description="Sum of all quote totals"
                color="success"
                loading={loading}
              />
            </Grid>
          </Grid>

          {/* 4. Recent RFQs Table */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: 'text.primary' }}>
              Recent RFQs
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Latest incoming freight requests requiring manual reviews or quote generation.
            </Typography>
          </Box>
          <RecentRFQTable rfqs={rfqs} loading={loading} />
        </>
      )}

      {/* Create RFQ Dialog — accessible from this page */}
      <CreateRFQDialog
        open={isCreateRFQOpen}
        onClose={() => setIsCreateRFQOpen(false)}
        onSuccess={handleRFQCreated}
      />
    </Box>
  );
}

export default Dashboard;
