import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';
import { Public } from '../common/decorators/public.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { AuthService } from './auth.service';

class LoginDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  password!: string;

  @IsOptional()
  @IsString()
  mfaCode?: string;
}

class RefreshDto {
  @IsString()
  refreshToken!: string;
}

class MfaEnableDto {
  @IsString()
  code!: string;
}

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @Public()
  @Post('login')
  login(@Body() dto: LoginDto, @Req() req: { ip?: string; headers: Record<string, string> }) {
    return this.auth.login(dto.email, dto.password, dto.mfaCode, {
      ip: req.ip,
      ua: req.headers['user-agent'],
    });
  }

  @Public()
  @Post('refresh')
  refresh(@Body() dto: RefreshDto) {
    return this.auth.refresh(dto.refreshToken);
  }

  @Public()
  @Post('logout')
  logout(@Body() dto: RefreshDto) {
    return this.auth.logout(dto.refreshToken);
  }

  @UseGuards(JwtAuthGuard)
  @Post('mfa/setup')
  setupMfa(@Req() req: { user: { id: string } }) {
    return this.auth.setupMfa(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('mfa/enable')
  enableMfa(@Req() req: { user: { id: string } }, @Body() dto: MfaEnableDto) {
    return this.auth.enableMfa(req.user.id, dto.code);
  }
}
