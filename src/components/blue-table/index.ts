import { styled } from '@mui/material/styles'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'

export const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: 'none'
  },
  '&:nth-of-type(even)': {
    backgroundColor: 'rgba(2, 41, 79, 0.1)'
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0
  }
}))

export const StyledTableCell = styled(TableCell)(({ theme }) => ({
  borderBottom: '1px solid #485880'
}))

export const BlueTable = {
  Row: StyledTableRow,
  Cell: StyledTableCell
}
