import { Controller, Get } from '@nestjs/common';
import { Public } from '../common/decorators/public.decorator';
import { BlogsService } from './blogs.service';

@Controller('blogs')
export class BlogsController {
  constructor(private blogs: BlogsService) {}

  @Public()
  @Get()
  list() {
    return this.blogs.list();
  }
}
