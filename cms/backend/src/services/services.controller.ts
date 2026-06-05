import { Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { PERMISSIONS } from '@corebridge/shared';
import { Public } from '../common/decorators/public.decorator';
import { RequirePermissions } from '../common/decorators/permissions.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { ServicesService } from './services.service';

@Controller('services')
export class ServicesController {
  constructor(private services: ServicesService) {}

  @Public()
  @Get()
  list() {
    return this.services.list(true);
  }

  @Post()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions(PERMISSIONS.CONTENT_WRITE)
  create(@Body() body: Record<string, unknown>) {
    return this.services.upsert(undefined, body);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions(PERMISSIONS.CONTENT_WRITE)
  update(@Param('id') id: string, @Body() body: Record<string, unknown>) {
    return this.services.upsert(id, body);
  }
}
