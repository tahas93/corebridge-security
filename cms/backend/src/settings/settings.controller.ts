import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { PERMISSIONS } from '@corebridge/shared';
import { Public } from '../common/decorators/public.decorator';
import { RequirePermissions } from '../common/decorators/permissions.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { SettingsService } from './settings.service';

@Controller('settings')
export class SettingsController {
  constructor(private settings: SettingsService) {}

  @Public()
  @Get()
  get() {
    return this.settings.get();
  }

  @Put()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions(PERMISSIONS.SETTINGS_MANAGE)
  update(@Body() body: Record<string, unknown>) {
    return this.settings.update(body as never);
  }
}
