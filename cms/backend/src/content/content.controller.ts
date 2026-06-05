import { Body, Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import { PERMISSIONS } from '@corebridge/shared';
import { Public } from '../common/decorators/public.decorator';
import { RequirePermissions } from '../common/decorators/permissions.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { ContentService } from './content.service';

@Controller('content')
export class ContentController {
  constructor(private content: ContentService) {}

  @Public()
  @Get('bundle')
  bundle() {
    return this.content.getBundle();
  }

  @Public()
  @Get(':key')
  get(@Param('key') key: string) {
    return this.content.getByKey(key.replace(/\//g, '.'));
  }

  @Put(':key')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions(PERMISSIONS.CONTENT_WRITE)
  upsert(@Param('key') key: string, @Body() body: { value: unknown }) {
    return this.content.upsert(key.replace(/\//g, '.'), body.value);
  }
}
