import {
  Controller,
  Get,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { PERMISSIONS } from '@corebridge/shared';
import { RequirePermissions } from '../common/decorators/permissions.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { MediaService } from './media.service';

@Controller('media')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class MediaController {
  constructor(private media: MediaService) {}

  @Get()
  @RequirePermissions(PERMISSIONS.MEDIA_MANAGE)
  list(@Query('q') q?: string, @Query('mimeType') mimeType?: string, @Query('folderId') folderId?: string) {
    return this.media.list({ q, mimeType, folderId });
  }

  @Post('upload')
  @RequirePermissions(PERMISSIONS.MEDIA_MANAGE)
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
  upload(@UploadedFile() file: Express.Multer.File) {
    return this.media.upload(file);
  }
}
