export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiError {
  statusCode: number;
  message: string;
  error?: string;
}

export interface DashboardStats {
  totalPages: number;
  publishedPages: number;
  draftPages: number;
  menus: number;
  mediaFiles: number;
  blogPosts: number;
  caseStudies: number;
  securityServices: number;
  recentUpdates: { id: string; type: string; title: string; at: string }[];
  userActivity: { id: string; action: string; user: string; at: string }[];
}
