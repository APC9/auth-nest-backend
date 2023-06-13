import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
import { envConfiguration } from './config/env.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [ envConfiguration],
      //validationSchema: joiValidationSchema,
    }),
    MongooseModule.forRoot(process.env.MONGO_URI),
    AuthModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
