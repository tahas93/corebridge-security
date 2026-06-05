import { Controller, Get, UseGuards } from '@nestjs/common';
import { PERMISSIONS } from '@corebridge/shared';
import { RequirePermissions } from '../common/decorators/permissions.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { AuditService } from './audit.service';

@Controller('audit')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class AuditController {
  constructor(private audit: AuditService) {}

  @Get()
  @RequirePermissions(PERMISSIONS.AUDIT_READ)
  list() {
    return this.audit.recent(50);
  }
}
