import { Body, Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import { PERMISSIONS } from '@corebridge/shared';
import { Public } from '../common/decorators/public.decorator';
import { RequirePermissions } from '../common/decorators/permissions.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { MenusService } from './menus.service';

@Controller('menu')
export class MenusController {
  constructor(private menus: MenusService) {}

  @Public()
  @Get(':key')
  get(@Param('key') key: string) {
    return this.menus.getByKey(key);
  }

  @Put(':key')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions(PERMISSIONS.MENUS_MANAGE)
  update(@Param('key') key: string, @Body() body: { name: string; items: { label: string; href: string; description?: string; parentId?: string; order: number }[] }) {
    return this.menus.upsert(key, body.name, body.items);
  }
}
