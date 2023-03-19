import {
  Controller,
  HttpException,
  HttpStatus,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { LocationsService } from './location.service';

@Controller('locations')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Post('import')
  @UseInterceptors(
    FileInterceptor('file', {
      dest: './files',
    }),
  )
  async import(@UploadedFile() file): Promise<void> {
    if (!file) {
      throw new HttpException(
        'File is required to import',
        HttpStatus.FORBIDDEN,
      );
    }
    return this.locationsService.importCsv(file.path);
  }
}
