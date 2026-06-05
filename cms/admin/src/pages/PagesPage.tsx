import { Button, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import api from '../api/client';

export default function PagesPage() {
  const { data } = useQuery({
    queryKey: ['pages-admin'],
    queryFn: async () => (await api.get('/pages/admin/all')).data,
  });

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Pages
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Slug</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(data?.data ?? []).map((p: { id: string; name: string; slug: string; status: string }) => (
            <TableRow key={p.id}>
              <TableCell>{p.name}</TableCell>
              <TableCell>/{p.slug}</TableCell>
              <TableCell>{p.status}</TableCell>
              <TableCell>
                <Button component={Link} to={`/pages/${p.id}`} size="small">
                  Edit
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
