import { Controller, Get } from '@nestjs/common';
import { Public } from '../common/decorators/public.decorator';
import { CaseStudiesService } from './case-studies.service';

@Controller('case-studies')
export class CaseStudiesController {
  constructor(private caseStudies: CaseStudiesService) {}

  @Public()
  @Get()
  list() {
    return this.caseStudies.list();
  }
}
