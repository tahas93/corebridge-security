import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PageStatus } from '@prisma/client';
import { PERMISSIONS } from '@corebridge/shared';
import { Public } from '../common/decorators/public.decorator';
import { RequirePermissions } from '../common/decorators/permissions.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { PagesService } from './pages.service';

@Controller('pages')
export class PagesController {
  constructor(private pages: PagesService) {}

  @Public()
  @Get()
  listPublic(@Query('status') status?: PageStatus) {
    return this.pages.findAll({
      status: status ?? PageStatus.PUBLISHED,
      pageSize: 100,
    });
  }

  @Get('admin/all')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions(PERMISSIONS.PAGES_MANAGE)
  listAdmin(@Query('status') status?: PageStatus, @Query('page') page?: string) {
    return this.pages.findAll({
      status,
      page: page ? parseInt(page, 10) : 1,
    });
  }

  @Public()
  @Get('slug/*')
  getBySlug(@Param('0') slugPath: string, @Query('preview') preview?: string, @Query('id') id?: string) {
    const slug = slugPath ?? 'home';
    return this.pages.findBySlug(slug, {
      preview: preview === 'true',
      pageId: id,
    });
  }

  @Post()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions(PERMISSIONS.PAGES_MANAGE)
  create(@Body() body: Record<string, unknown>, @Req() req: { user: { id: string } }) {
    return this.pages.create(body as never, req.user.id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions(PERMISSIONS.PAGES_MANAGE)
  update(@Param('id') id: string, @Body() body: Record<string, unknown>, @Req() req: { user: { id: string } }) {
    return this.pages.update(id, body as never, req.user.id);
  }

  @Put(':id/sections')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions(PERMISSIONS.PAGES_MANAGE)
  saveSections(
    @Param('id') id: string,
    @Body() body: { sections: { type: string; order: number; data: Record<string, unknown> }[] },
    @Req() req: { user: { id: string } },
  ) {
    return this.pages.saveSections(id, body.sections, req.user.id);
  }

  @Post(':id/publish')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions(PERMISSIONS.CONTENT_PUBLISH)
  publish(@Param('id') id: string, @Req() req: { user: { id: string } }) {
    return this.pages.publish(id, req.user.id);
  }

  @Post(':id/unpublish')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions(PERMISSIONS.CONTENT_PUBLISH)
  unpublish(@Param('id') id: string, @Req() req: { user: { id: string } }) {
    return this.pages.unpublish(id, req.user.id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions(PERMISSIONS.PAGES_MANAGE)
  remove(@Param('id') id: string, @Req() req: { user: { id: string } }) {
    return this.pages.delete(id, req.user.id);
  }

  @Get(':id/revisions')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions(PERMISSIONS.PAGES_MANAGE)
  revisions(@Param('id') id: string) {
    return this.pages.revisions(id);
  }

  @Post(':id/revisions/:version/restore')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions(PERMISSIONS.PAGES_MANAGE)
  restore(
    @Param('id') id: string,
    @Param('version') version: string,
    @Req() req: { user: { id: string } },
  ) {
    return this.pages.restoreRevision(id, parseInt(version, 10), req.user.id);
  }
}
