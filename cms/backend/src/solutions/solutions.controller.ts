import { Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { PERMISSIONS } from '@corebridge/shared';
import { Public } from '../common/decorators/public.decorator';
import { RequirePermissions } from '../common/decorators/permissions.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { SolutionsService } from './solutions.service';

@Controller('solutions')
export class SolutionsController {
  constructor(private solutions: SolutionsService) {}

  @Public()
  @Get()
  list() {
    return this.solutions.list(true);
  }

  @Post()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions(PERMISSIONS.CONTENT_WRITE)
  create(@Body() body: Record<string, unknown>) {
    return this.solutions.upsert(undefined, body);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions(PERMISSIONS.CONTENT_WRITE)
  update(@Param('id') id: string, @Body() body: Record<string, unknown>) {
    return this.solutions.upsert(id, body);
  }
}
