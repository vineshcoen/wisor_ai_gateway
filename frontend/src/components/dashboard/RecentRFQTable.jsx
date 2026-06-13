import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Skeleton,
  Box,
  Typography,
} from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';

function RecentRFQTable({ rfqs = [], loading = false }) {
  // Map API status strings to MUI Chip colors
  const getStatusChipColor = (status) => {
    switch (status) {
      case 'quoted':
        return 'success';
      case 'ready_for_quote':
        return 'info';
      case 'pending':
        return 'warning';
      case 'complete':
        default:
          return 'default';
    }
  };

  // Convert status string to readable labels
  const getStatusLabel = (status) => {
    if (!status) return 'Unknown';
    return status.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
  };

  // Format ISO timestamp to a readable local date
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }).format(date);
    } catch {
      return dateString;
    }
  };

  // Skeleton rows loader
  if (loading) {
    return (
      <TableContainer component={Paper} variant="outlined" sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>RFQ ID</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Origin</TableCell>
              <TableCell>Destination</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell><Skeleton width={80} height={20} /></TableCell>
                <TableCell><Skeleton width={140} height={20} /></TableCell>
                <TableCell><Skeleton width={120} height={20} /></TableCell>
                <TableCell><Skeleton width={120} height={20} /></TableCell>
                <TableCell><Skeleton variant="rectangular" width={90} height={24} sx={{ borderRadius: 4 }} /></TableCell>
                <TableCell><Skeleton width={100} height={20} /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

  // Empty state display
  if (!rfqs || rfqs.length === 0) {
    return (
      <Paper
        variant="outlined"
        sx={{
          mt: 3,
          p: 6,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          bgcolor: 'background.paper',
        }}
      >
        <AssignmentIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'text.primary' }}>
          No RFQs available.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Create your first RFQ to get started.
        </Typography>
      </Paper>
    );
  }

  return (
    <TableContainer component={Paper} sx={{ mt: 3, overflow: 'hidden' }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>RFQ ID</TableCell>
            <TableCell>Customer</TableCell>
            <TableCell>Origin</TableCell>
            <TableCell>Destination</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Created Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rfqs.map((rfq) => (
            <TableRow key={rfq.rfq_id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell sx={{ fontWeight: 700, color: 'primary.light' }}>
                {rfq.rfq_id}
              </TableCell>
              <TableCell sx={{ fontWeight: 500, color: 'text.primary' }}>
                {rfq.customer}
              </TableCell>
              <TableCell sx={{ color: 'text.primary' }}>{rfq.origin}</TableCell>
              <TableCell sx={{ color: 'text.primary' }}>{rfq.destination}</TableCell>
              <TableCell>
                <Chip
                  label={getStatusLabel(rfq.status)}
                  color={getStatusChipColor(rfq.status)}
                  size="small"
                  variant="outlined"
                  sx={{ fontWeight: 600 }}
                />
              </TableCell>
              <TableCell sx={{ color: 'text.secondary' }}>
                {formatDate(rfq.created_at)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default RecentRFQTable;
