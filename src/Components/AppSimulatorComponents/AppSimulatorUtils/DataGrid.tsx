import { DataGrid } from '@mui/x-data-grid';
import { Typography, Button, Autocomplete, TextField } from '@mui/material';

const rows = [
  { id: 1, name: 'John Doe', action: 'Edit', options: ['Option 1', 'Option 2'] },
  { id: 2, name: 'Jane Smith', action: 'Delete', options: ['Option A', 'Option B'] },
];

const columns = [
  {
    field: 'name',
    headerName: 'Name',
    flex: 1,
    renderCell: () => (
      <Typography> Set value manual
      </Typography>
    ),
  },
  {
    field: 'action',
    headerName: 'Action',
    flex: 1,
    renderCell: () => (
      <Button>

      </Button>
    ),
  },
  {
    field: 'options',
    headerName: 'Options',
    flex: 1,
    renderCell: () => (
      <Autocomplete disablePortal options={[]} renderInput={(params) => <TextField {...params} label="0" />}/>
    ),
  },
];

export default function App() {
  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid rows={rows} columns={columns} />
    </div>
  );
}
