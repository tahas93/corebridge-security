import { BadRequestException, Injectable } from '@nestjs/common';
import { existsSync, mkdirSync } from 'fs';
import { join, extname } from 'path';
import { v4 as uuid } from 'uuid';
import { PrismaService } from '../prisma/prisma.service';

const ALLOWED_MIME = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/svg+xml',
  'image/gif',
  'application/pdf',
  'video/mp4',
  'text/plain',
]);

@Injectable()
export class MediaService {
  private uploadDir = process.env.UPLOAD_DIR ?? './uploads';

  constructor(private prisma: PrismaService) {
    if (!existsSync(this.uploadDir)) mkdirSync(this.uploadDir, { recursive: true });
  }

  list(params?: { q?: string; mimeType?: string; folderId?: string }) {
    return this.prisma.mediaAsset.findMany({
      where: {
        AND: [
          params?.q
            ? {
                OR: [
                  { originalName: { contains: params.q, mode: 'insensitive' } },
                  { title: { contains: params.q, mode: 'insensitive' } },
                ],
              }
            : {},
          params?.mimeType ? { mimeType: { startsWith: params.mimeType } } : {},
          params?.folderId ? { folderId: params.folderId } : {},
        ],
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
  }

  async upload(file: Express.Multer.File, meta?: { alt?: string; title?: string; folderId?: string }) {
    if (!ALLOWED_MIME.has(file.mimetype)) {
      throw new BadRequestException('File type not allowed');
    }
    const maxMb = parseInt(process.env.MAX_UPLOAD_MB ?? '50', 10);
    if (file.size > maxMb * 1024 * 1024) {
      throw new BadRequestException(`File exceeds ${maxMb}MB limit`);
    }

    const ext = extname(file.originalname) || '';
    const filename = `${uuid()}${ext}`;
    const filepath = join(this.uploadDir, filename);
    const { writeFileSync } = await import('fs');
    writeFileSync(filepath, file.buffer);

    const baseUrl = process.env.CMS_PUBLIC_URL ?? 'http://localhost:4000';
    return this.prisma.mediaAsset.create({
      data: {
        filename,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        url: `${baseUrl}/uploads/${filename}`,
        alt: meta?.alt,
        title: meta?.title,
        folderId: meta?.folderId,
        tags: [],
      },
    });
  }
}
