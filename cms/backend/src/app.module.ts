import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AuditModule } from './audit/audit.module';
import { AuthModule } from './auth/auth.module';
import { BlogsModule } from './blogs/blogs.module';
import { CaseStudiesModule } from './case-studies/case-studies.module';
import { ComplianceModule } from './compliance/compliance.module';
import { ContentModule } from './content/content.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { MediaModule } from './media/media.module';
import { MenusModule } from './menus/menus.module';
import { PagesModule } from './pages/pages.module';
import { PrismaModule } from './prisma/prisma.module';
import { RedisModule } from './redis/redis.module';
import { ResourcesModule } from './resources/resources.module';
import { SearchModule } from './search/search.module';
import { ServicesModule } from './services/services.module';
import { SettingsModule } from './settings/settings.module';
import { SolutionsModule } from './solutions/solutions.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 120 }]),
    PrismaModule,
    RedisModule,
    AuthModule,
    UsersModule,
    PagesModule,
    MenusModule,
    SettingsModule,
    ContentModule,
    ServicesModule,
    SolutionsModule,
    ComplianceModule,
    CaseStudiesModule,
    BlogsModule,
    ResourcesModule,
    MediaModule,
    DashboardModule,
    SearchModule,
    AuditModule,
  ],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
