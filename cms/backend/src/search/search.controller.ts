import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { PERMISSIONS } from '@corebridge/shared';
import { RequirePermissions } from '../common/decorators/permissions.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { SearchService } from './search.service';

@Controller('search')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class SearchController {
  constructor(private search: SearchService) {}

  @Get()
  @RequirePermissions(PERMISSIONS.CONTENT_READ)
  query(@Query('q') q = '') {
    return this.search.search(q);
  }
}
