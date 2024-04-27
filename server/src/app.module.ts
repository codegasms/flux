import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';

import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth/auth.guard';
import { RolesGuard } from './auth/roles.guard';

import { ServeStaticModule } from '@nestjs/serve-static';
import { fileStorageRootDir } from './spaces/constants';
import { ModsModule } from './mods/mods.module';
import { SpacesModule } from './spaces/spaces.module';
import { OauthModule } from './oauth/oauth.module';
import { OrdersModule } from './orders/orders.module';
import { appConfig } from './config';

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
    MongooseModule.forRoot(appConfig.mongoConStr),
    ServeStaticModule.forRoot({
      rootPath: fileStorageRootDir,
      serveRoot: '/files',
    }),
    AuthModule,
    OauthModule,
    UsersModule,
    ModsModule,
    SpacesModule,
    OrdersModule,
  ],
})
export class AppModule {}
