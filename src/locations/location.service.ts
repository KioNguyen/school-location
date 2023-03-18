import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Location } from './location.entity';
import * as csvParser from 'csv-parser';
import * as fs from 'fs';

@Injectable()
export class LocationsService {
  constructor(
    @InjectRepository(Location)
    private readonly locationRepository: Repository<Location>,
  ) {}

  async createLocation(address: string, parent?: Location): Promise<Location> {
    const location = new Location();
    location.address = address;
    location.parent = parent;
    return this.locationRepository.save(location);
  }

  async importCsv(file: string): Promise<void> {
    return new Promise((resolve, reject) => {
      fs.createReadStream(file)
        .pipe(csvParser())
        .on('data', async (row) => {
          const addressParts = row.address.split(':');
          let parent = null;
          for (let i = 0; i < addressParts.length; i++) {
            const addressPart = addressParts[i];
            const existingLocation = await this.locationRepository.findOne({
              where: { address: addressPart },
              relations: ['parent'],
            });
            if (existingLocation) {
              parent = existingLocation;
            } else {
              parent = await this.createLocation(addressPart, parent);
            }
          }
        })
        .on('end', () => {
          resolve();
        })
        .on('error', (error) => {
          reject(error);
        });
    });
  }
}
