import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocationsController } from './locations/locations.controller';
import { Location } from './locations/location.entity';
import { LocationsService } from './locations/location.service';
import { LocationsModule } from './locations/locations.module';
import { AppService } from './app.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'admin@123',
      database: 'school_location',
      // entities: [Location],
      // synchronize: true,
    }),
    LocationsModule,
  ],
  providers: [AppService],
})
export class AppModule {}
