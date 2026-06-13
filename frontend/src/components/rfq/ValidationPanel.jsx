import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from '@mui/material';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';

function ValidationPanel({ validation = [] }) {
  // Map status -> chip label, color, and row tint (Green = found, Yellow = warning, Red = missing)
  const getStatusMeta = (status) => {
    switch (status) {
      case 'ok':
        return { label: 'Found', color: 'success', bg: 'rgba(46, 204, 113, 0.04)' };
      case 'warning':
        return { label: 'Warning', color: 'warning', bg: 'rgba(243, 156, 18, 0.04)' };
      case 'missing':
        return { label: 'Missing', color: 'error', bg: 'rgba(231, 76, 60, 0.04)' };
      default:
        return { label: status || 'Unknown', color: 'default', bg: 'transparent' };
    }
  };

  const formatField = (field) => {
    if (!field) return '-';
    return field.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
  };

  return (
    <Card sx={{ borderRadius: '16px', height: '100%' }}>
      <Box sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.02)', display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <VerifiedUserIcon color="primary" sx={{ fontSize: 18 }} />
        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.primary', fontSize: '0.8rem' }}>
          Validation Results
        </Typography>
      </Box>
      <Divider />
      <CardContent sx={{ p: 0 }}>
        {!validation || validation.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>
            No validation checks run.
          </Typography>
        ) : (
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.7rem', color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.04em', py: 1 }}>
                    Field
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.7rem', color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.04em', py: 1 }}>
                    Status
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.7rem', color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.04em', py: 1 }}>
                    Message
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {validation.map((check, index) => {
                  const meta = getStatusMeta(check.status);
                  return (
                    <TableRow
                      key={index}
                      sx={{
                        bgcolor: meta.bg,
                        '&:last-child td': { borderBottom: 0 },
                        '&:hover': { bgcolor: 'rgba(255,255,255,0.03)' },
                      }}
                    >
                      <TableCell sx={{ fontWeight: 600, fontSize: '0.8125rem', color: 'text.primary', py: 0.75 }}>
                        {formatField(check.field)}
                      </TableCell>
                      <TableCell sx={{ py: 0.75 }}>
                        <Chip
                          label={meta.label}
                          color={meta.color}
                          size="small"
                          variant="outlined"
                          sx={{ fontWeight: 700, fontSize: '0.7rem', height: 22 }}
                        />
                      </TableCell>
                      <TableCell sx={{ fontSize: '0.8125rem', color: 'text.secondary', py: 0.75 }}>
                        {check.message}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </CardContent>
    </Card>
  );
}

export default ValidationPanel;