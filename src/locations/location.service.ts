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

  async createLocation(location: Location): Promise<Location> {
    return this.locationRepository.save(location);
  }

  async excuteCreateLocation(dataSource: Location[]): Promise<void> {
    dataSource = await dataSource.map((location: Location) => {
      const locationNumArr = location.loca_number.split(/-/);
      location.level = locationNumArr.length - 1;
      return location;
    });
    dataSource = await dataSource.sort((a: Location, b: Location) => {
      return a.level - b.level;
    });
    const execute = (i) => {
      if (i == dataSource.length) return;
      const locationNumArr = dataSource[i].loca_number.split(/-/);
      const parentLocaNum = locationNumArr.slice(0, -1).join('-');
      this.locationRepository
        .findOne({
          where: { loca_number: parentLocaNum },
          relations: ['parent'],
        })
        .then(async (data) => {
          if (data) {
            dataSource[i].parent = data;
            await this.createLocation(dataSource[i]).finally(() =>
              execute(i + 1),
            );
          } else {
            dataSource[i].parent = null;
            await this.createLocation(dataSource[i]).finally(() =>
              execute(i + 1),
            );
          }
        });
    };
    execute(0);
  }

  async importCsv(file: string): Promise<void> {
    const HeaderMap = {
      LOCATION_NUMBER: 'loca_number',
      LOCATION_NAME: 'loca_name',
      AREA: 'area',
      'DESCRIPTION_(DATABASE_IGNORE)': 'description',
      BUILDING: 'building',
    };
    // eslint-disable-next-line prefer-const
    let dataSource: Location[] = [];
    await fs
      .createReadStream(file)
      .pipe(
        csvParser({
          mapHeaders({ header }) {
            return HeaderMap[header.replace(/ /gi, '_').toUpperCase().trim()];
          },
          mapValues({ value }) {
            return value.trim();
          },
        }),
      )
      .on('data', async (location: Location) => {
        await dataSource.push(location);
      })
      .on('end', async () => {
        this.excuteCreateLocation(dataSource);
      })
      .on('error', (error) => {
        throw new Error(error.message);
      });
  }
}
