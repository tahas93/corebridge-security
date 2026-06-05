import { useRef } from 'react';
import { Button, List, ListItem, ListItemText, Typography } from '@mui/material';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../api/client';

export default function MediaPage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ['media'],
    queryFn: async () => (await api.get('/media')).data,
  });

  async function onUpload(file: File) {
    const form = new FormData();
    form.append('file', file);
    await api.post('/media/upload', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    qc.invalidateQueries({ queryKey: ['media'] });
  }

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Media Library
      </Typography>
      <input
        ref={inputRef}
        type="file"
        hidden
        onChange={(e) => e.target.files?.[0] && onUpload(e.target.files[0])}
      />
      <Button variant="contained" onClick={() => inputRef.current?.click()}>
        Upload
      </Button>
      <List sx={{ mt: 2 }}>
        {(data ?? []).map((m: { id: string; originalName: string; url: string; mimeType: string }) => (
          <ListItem key={m.id}>
            <ListItemText primary={m.originalName} secondary={`${m.mimeType} — ${m.url}`} />
          </ListItem>
        ))}
      </List>
    </>
  );
}
