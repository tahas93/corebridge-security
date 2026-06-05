import { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import api from '../api/client';

export default function MenusPage() {
  const { data, refetch } = useQuery({
    queryKey: ['menu-header'],
    queryFn: async () => (await api.get('/menu/header')).data,
  });
  const [json, setJson] = useState('');

  if (data && !json) setJson(JSON.stringify(data.items, null, 2));

  async function save() {
    const items = JSON.parse(json);
    await api.put('/menu/header', { name: 'Header Navigation', items });
    refetch();
  }

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Menu Builder (Header)
      </Typography>
      <TextField multiline fullWidth minRows={16} value={json} onChange={(e) => setJson(e.target.value)} />
      <Box sx={{ mt: 2 }}>
        <Button variant="contained" onClick={save}>
          Save Menu
        </Button>
      </Box>
    </>
  );
}
