import React from 'react';
import { Box, Typography, Card, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Button } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import SendIcon from '@mui/icons-material/Send';

function QuoteHistory() {
  const quotes = [
    { id: 'Q-8472', rfqId: 'RFQ-2026-002', client: 'Logistics Pro Ltd', route: 'INBOM → DEHAM', amount: '$3,850.00', date: '2026-06-11', status: 'Accepted' },
    { id: 'Q-8471', rfqId: 'RFQ-2026-004', client: 'Euro Distrib LLC', route: 'PLGDY → USNYC', amount: '$1,920.00', date: '2026-06-09', status: 'Sent' },
    { id: 'Q-8470', rfqId: 'RFQ-2026-003', client: 'Apex Manufacturing', route: 'CNSZX → NLRTM', amount: '$8,450.00', date: '2026-06-10', status: 'Rejected' },
    { id: 'Q-8469', rfqId: 'RFQ-2026-001', client: 'Global Traders Corp', route: 'CNSHA → USLAX', amount: '$4,100.00', date: '2026-06-08', status: 'Accepted' },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Accepted':
        return 'success';
      case 'Sent':
        return 'primary';
      case 'Rejected':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Box sx={{ py: 2 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
          Quote History
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Review past freight quotations, statuses, client approvals, and pricing audit trails.
        </Typography>
      </Box>

      <Card>
        <CardContent sx={{ p: 0 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Quote ID</TableCell>
                  <TableCell>RFQ Reference</TableCell>
                  <TableCell>Client</TableCell>
                  <TableCell>Route</TableCell>
                  <TableCell>Total Amount</TableCell>
                  <TableCell>Date Generated</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {quotes.map((quote) => (
                  <TableRow key={quote.id} hover>
                    <TableCell sx={{ fontWeight: 600 }}>{quote.id}</TableCell>
                    <TableCell>{quote.rfqId}</TableCell>
                    <TableCell>{quote.client}</TableCell>
                    <TableCell>{quote.route}</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: 'primary.light' }}>{quote.amount}</TableCell>
                    <TableCell>{quote.date}</TableCell>
                    <TableCell>
                      <Chip label={quote.status} color={getStatusColor(quote.status)} size="small" variant="outlined" />
                    </TableCell>
                    <TableCell align="right">
                      <Button variant="outlined" size="small" startIcon={<DownloadIcon />} sx={{ mr: 1 }}>
                        PDF
                      </Button>
                      <Button variant="text" size="small" startIcon={<SendIcon />}>
                        Resend
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
}

export default QuoteHistory;
