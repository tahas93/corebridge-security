import { Controller, Get } from '@nestjs/common';
import { Public } from '../common/decorators/public.decorator';
import { ComplianceService } from './compliance.service';

@Controller('compliance')
export class ComplianceController {
  constructor(private compliance: ComplianceService) {}

  @Public()
  @Get()
  list() {
    return this.compliance.list();
  }
}
