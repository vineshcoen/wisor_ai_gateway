import React from 'react';
import { Card, CardContent, Typography, Box, Divider } from '@mui/material';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';

const CARD_HEIGHT = 400;

function EmailCard({ emailBody, customer }) {
  return (
    <Card sx={{ height: CARD_HEIGHT, display: 'flex', flexDirection: 'column', borderRadius: '16px' }}>
      {/* Compact header */}
      <Box sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.02)', display: 'flex', alignItems: 'center', gap: 1.5, flexShrink: 0 }}>
        <AlternateEmailIcon color="primary" sx={{ fontSize: 18 }} />
        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.primary', fontSize: '0.8rem' }}>
          Original Email
        </Typography>
      </Box>
      <Divider />

      {/* Email meta (From / Subject) - compact, fixed */}
      <Box sx={{ px: 2, py: 1, flexShrink: 0 }}>
        <Typography variant="caption" sx={{ display: 'flex', gap: 0.75, mb: 0.25 }}>
          <Box component="span" sx={{ fontWeight: 700, color: 'text.secondary', minWidth: 56 }}>From</Box>
          <Box component="span" sx={{ color: 'text.primary' }}>
            {customer || 'Unknown Sender'} &lt;shipper@exports.com&gt;
          </Box>
        </Typography>
        <Typography variant="caption" sx={{ display: 'flex', gap: 0.75 }}>
          <Box component="span" sx={{ fontWeight: 700, color: 'text.secondary', minWidth: 56 }}>Subject</Box>
          <Box component="span" sx={{ color: 'text.primary' }}>
            Freight Quotation Request
          </Box>
        </Typography>
      </Box>
      <Divider />

      {/* Scrollable body */}
      <CardContent
        sx={{
          flexGrow: 1,
          p: 2,
          overflowY: 'auto',
          '&::-webkit-scrollbar': { width: 6 },
          '&::-webkit-scrollbar-thumb': { bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 3 },
        }}
      >
        <Typography
          variant="body2"
          sx={{
            fontFamily: 'monospace',
            fontSize: '0.8125rem',
            lineHeight: 1.7,
            color: 'text.primary',
            whiteSpace: 'pre-line',
          }}
        >
          {emailBody || 'No email content provided.'}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default EmailCard;