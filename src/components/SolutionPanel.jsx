import { Box, Button, Divider, Table, TableBody, TableCell, TableRow, Typography } from '@mui/material'
import React from 'react'

function SolutionPanel({output, review}) {

  const codeAnalysis = review?.Code_Analysis;
  const qualitative = review?.Code_Quality_Qualitative;
  const quantitative = review?.Code_Quality_Quantitative;

  return (
    <Box
      sx={{
        width: '20%',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        padding: 2,
        border: '1px solid #ccc',
        borderRadius: '6px',
        backgroundColor: '#fafafa',
        height: '84%', 
        marginLeft:2,
        marginTop:2
      }}
    >
      <Box>
        <Typography variant="h6" fontWeight="bold">
          Solution
        </Typography>
        <Divider sx={{ my: 1 }} />

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 1,
          }}
        >
          <Typography variant="subtitle2">Test Cases</Typography>
          {/* <Button variant="contained" size="small" color="error">
            Failed
          </Button> */}
        </Box>

        <Typography variant="body2">Test Cases Faised</Typography>
      </Box>

      <Box
        sx={{
          flex: 1,
          border: '1px solid #ccc',
          borderRadius: '6px',
          padding: 1,
          backgroundColor: '#fff',
          overflowY: 'auto',
          marginTop:10
          
        }}
      >
        <Typography variant="subtitle2" fontWeight="bold">
          Output Console
        </Typography>
        <Divider sx={{ my: 1 }} />
       {codeAnalysis && (
          <>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <b>What worked well:</b> {codeAnalysis.What_worked_well}
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              <b>What can be improved:</b> {codeAnalysis.What_can_be_improved}
            </Typography>
          </>
        )}

        {qualitative && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <b>Correctness:</b> {qualitative.Correctness}
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <b>Readability:</b> {qualitative.Readability}
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <b>Maintainability:</b> {qualitative.Maintainability}
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <b>Design:</b> {qualitative.Design}
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <b>Scalability:</b> {qualitative.Scalability}
            </Typography>
          </Box>
        )}

        {quantitative && (
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1 }} fontWeight="bold">
              Code Quality Scores
            </Typography>
            <Table size="small">
              <TableBody>
                {Object.entries(quantitative).map(([key, val]) => (
                  <TableRow key={key}>
                    <TableCell sx={{ fontWeight: 'bold' }}>{key}</TableCell>
                    <TableCell>{val}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default SolutionPanel
