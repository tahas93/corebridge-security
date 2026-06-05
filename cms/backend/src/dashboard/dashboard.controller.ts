import { Controller, Get, UseGuards } from '@nestjs/common';
import { PERMISSIONS } from '@corebridge/shared';
import { RequirePermissions } from '../common/decorators/permissions.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class DashboardController {
  constructor(private dashboard: DashboardService) {}

  @Get('stats')
  @RequirePermissions(PERMISSIONS.CONTENT_READ)
  stats() {
    return this.dashboard.stats();
  }
}
