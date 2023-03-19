import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WinstonModule } from 'nest-winston';
import { Location } from './locations/location.entity';
import { LocationsModule } from './locations/locations.module';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import loggerConfig from './loger.config';
@Module({
  imports: [
    WinstonModule.forRoot(loggerConfig),
    ConfigModule.forRoot({ envFilePath: `.env` }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: `${process.env.DB_HOST}`,
      port: +`${process.env.DB_PORT}`,
      username: `${process.env.DB_USER}`,
      password: `${process.env.DB_PASS}`,
      database: `${process.env.DB_NAME}`,
      entities: [Location],
      // synchronize: true,
    }),
    LocationsModule,
  ],
  providers: [AppService],
})
export class AppModule {}
