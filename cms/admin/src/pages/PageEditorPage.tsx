import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { PAGE_SECTION_TYPES } from '../../../../shared/constants/sections';
import api from '../api/client';

type Section = { id?: string; type: string; order: number; data: Record<string, unknown> };

function SortableSection({
  section,
  index,
  onChange,
}: {
  section: Section;
  index: number;
  onChange: (index: number, section: Section) => void;
}) {
  const id = section.id ?? `section-${index}`;
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  return (
    <Paper
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      sx={{ p: 2, mb: 1 }}
    >
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
        <Button variant="outlined" {...attributes} {...listeners}>
          Drag
        </Button>
        <TextField
          select
          label="Section Type"
          value={section.type}
          onChange={(e) => onChange(index, { ...section, type: e.target.value })}
          sx={{ minWidth: 200 }}
        >
          {PAGE_SECTION_TYPES.map((t) => (
            <MenuItem key={t} value={t}>
              {t}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="JSON Data"
          multiline
          fullWidth
          value={JSON.stringify(section.data, null, 2)}
          onChange={(e) => {
            try {
              onChange(index, { ...section, data: JSON.parse(e.target.value) });
            } catch {
              /* ignore invalid JSON while typing */
            }
          }}
        />
      </Box>
    </Paper>
  );
}

export default function PageEditorPage() {
  const { id } = useParams();
  const qc = useQueryClient();
  const { data: page } = useQuery({
    queryKey: ['page', id],
    queryFn: async () => {
      const pages = (await api.get('/pages/admin/all')).data.data as { id: string; slug: string }[];
      const found = pages.find((p) => p.id === id);
      if (!found) throw new Error('Not found');
      return (await api.get(`/pages/slug/${found.slug}`)).data;
    },
    enabled: !!id,
  });

  const [sections, setSections] = useState<Section[]>([]);

  useEffect(() => {
    if (page?.sections?.length) {
      setSections(page.sections);
    }
  }, [page]);

  const saveSections = useMutation({
    mutationFn: async () => api.put(`/pages/${id}/sections`, { sections }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['pages-admin'] }),
  });

  const publish = useMutation({
    mutationFn: async () => api.post(`/pages/${id}/publish`),
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  function onDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = sections.findIndex((s, i) => (s.id ?? `section-${i}`) === active.id);
    const newIndex = sections.findIndex((s, i) => (s.id ?? `section-${i}`) === over.id);
    setSections(arrayMove(sections, oldIndex, newIndex).map((s, order) => ({ ...s, order })));
  }

  return (
    <>
      <Typography variant="h4">{page?.name ?? 'Page Editor'}</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        /{page?.slug}
      </Typography>
      <Box sx={{ mb: 2, display: 'flex', gap: 1 }}>
        <Button variant="contained" onClick={() => saveSections.mutate()}>
          Save Sections
        </Button>
        <Button variant="outlined" onClick={() => publish.mutate()}>
          Publish
        </Button>
        <Button
          variant="text"
          href={`${import.meta.env.VITE_WEBSITE_URL ?? 'http://localhost:3000'}/preview/${id}`}
          target="_blank"
        >
          Preview
        </Button>
      </Box>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <SortableContext
          items={sections.map((s, i) => s.id ?? `section-${i}`)}
          strategy={verticalListSortingStrategy}
        >
          {sections.map((section, index) => (
            <SortableSection
              key={section.id ?? `section-${index}`}
              section={section}
              index={index}
              onChange={(i, s) => {
                const next = [...sections];
                next[i] = s;
                setSections(next);
              }}
            />
          ))}
        </SortableContext>
      </DndContext>
      <Button
        sx={{ mt: 2 }}
        onClick={() =>
          setSections([...sections, { type: 'rich_text', order: sections.length, data: { body: '' } }])
        }
      >
        Add Section
      </Button>
    </>
  );
}
