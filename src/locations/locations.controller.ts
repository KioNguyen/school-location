import {
  Controller,
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
  @UseInterceptors(FileInterceptor('file'))
  async import(@UploadedFile() file): Promise<void> {
    console.log(
      '🚀 ~ file: locations.controller.ts:17 ~ LocationsController ~ import ~ file:',
      file,
    );
    return this.locationsService.importCsv(file);
  }
  // async import(): Promise<string> {
  //   return Promise.resolve('Hello!');
  // }
}
