export interface MediaAsset {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  folderId?: string | null;
  alt?: string;
  title?: string;
  description?: string;
  tags: string[];
  createdAt: string;
}

export interface MediaFolder {
  id: string;
  name: string;
  parentId?: string | null;
}
