import {
  Controller,
  HttpException,
  HttpStatus,
  Inject,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { LocationsService } from './location.service';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

@Controller('locations')
export class LocationsController {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly locationsService: LocationsService,
  ) {}

  @Post('import')
  @UseInterceptors(
    FileInterceptor('file', {
      dest: './files',
    }),
  )
  async import(@UploadedFile() file): Promise<void> {
    this.logger.info('Importing file', file);
    if (!file) {
      this.logger.info('Request failed! File is required!');
      throw new HttpException(
        'File is required to import',
        HttpStatus.FORBIDDEN,
      );
    }
    return this.locationsService.importCsv(file.path);
  }
}
