import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { MongooseModule } from '@nestjs/mongoose';
import { configDotenv } from 'dotenv';
import { UsersModule } from './users/users.module';

import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth/auth.guard';
import { RolesGuard } from './auth/roles.guard';
import { FilesModule } from './files/files.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { fileStorageRootDir } from './files/constants';
import { ModsModule } from './mods/mods.module';
import { SpacesModule } from './spaces/spaces.module';

configDotenv();

if (!process.env.MONGO_CON_STR) {
  console.error('Mongo db connection url not provided!');
}

@Module({
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
  imports: [
    MongooseModule.forRoot(process.env.MONGO_CON_STR),
    ServeStaticModule.forRoot({
      rootPath: fileStorageRootDir,
      serveRoot: '/files',
    }),
    AuthModule,
    UsersModule,
    FilesModule,
    ModsModule,
    SpacesModule,
  ],
})
export class AppModule {}