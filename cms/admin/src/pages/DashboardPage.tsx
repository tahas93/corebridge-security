import { Grid, Paper, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import api from '../api/client';

// Dashboard stats from CMS API

export default function DashboardPage() {
  const { data } = useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => (await api.get('/dashboard/stats')).data,
  });

  const cards = [
    { label: 'Total Pages', value: data?.totalPages },
    { label: 'Published', value: data?.publishedPages },
    { label: 'Drafts', value: data?.draftPages },
    { label: 'Menus', value: data?.menus },
    { label: 'Media Files', value: data?.mediaFiles },
    { label: 'Blog Posts', value: data?.blogPosts },
    { label: 'Case Studies', value: data?.caseStudies },
    { label: 'Services', value: data?.securityServices },
  ];

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={2}>
        {cards.map((c) => (
          <Grid item xs={12} sm={6} md={3} key={c.label}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="body2" color="text.secondary">
                {c.label}
              </Typography>
              <Typography variant="h4">{c.value ?? '—'}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
      <Typography variant="h6" sx={{ mt: 4 }}>
        Recent Updates
      </Typography>
      {(data?.recentUpdates ?? []).map((u: { id: string; title: string; at: string }) => (
        <Typography key={u.id} variant="body2">
          {u.title} — {new Date(u.at).toLocaleString()}
        </Typography>
      ))}
    </>
  );
}
