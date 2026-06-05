import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { PERMISSIONS } from '@corebridge/shared';
import { RequirePermissions } from '../common/decorators/permissions.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { UsersService } from './users.service';

@Controller('users')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class UsersController {
  constructor(private users: UsersService) {}

  @Get()
  @RequirePermissions(PERMISSIONS.USERS_MANAGE)
  list() {
    return this.users.list();
  }

  @Post()
  @RequirePermissions(PERMISSIONS.USERS_MANAGE)
  create(@Body() body: { email: string; name: string; password: string; roleNames: string[] }) {
    return this.users.create(body);
  }
}
