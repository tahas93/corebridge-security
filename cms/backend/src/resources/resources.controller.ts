import { Controller, Get } from '@nestjs/common';
import { Public } from '../common/decorators/public.decorator';
import { ResourcesService } from './resources.service';

@Controller('resources')
export class ResourcesController {
  constructor(private resources: ResourcesService) {}

  @Public()
  @Get()
  list() {
    return this.resources.list();
  }
}
