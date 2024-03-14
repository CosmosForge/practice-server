import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ServeStaticModule } from '@nestjs/serve-static';
import { SequelizeModule } from '@nestjs/sequelize';
import { join } from 'path';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { Dialect } from 'sequelize';
import { MailerModule } from '@nestjs-modules/mailer';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import { RealEstateModule } from './real-estate/real-estate.module';
import { User } from './user/entities/user.entity';
import * as dotenv from "dotenv"
import * as path from "path"
import { RealEstate } from './real-estate/entities/real-estate.entity';
dotenv.config()
@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/static',
    }),
    SequelizeModule.forRootAsync({
      useFactory: () => ({
        dialect: process.env.DB_TYPE as Dialect,
        host:  process.env.DB_HOST as Dialect,
        username:  process.env.DB_USER as Dialect,
        password: process.env.DB_PASS as Dialect,
        database:  process.env.DB_NAME_PRODUCTION as Dialect,
        synchronize: true, 
        autoLoadModels: true,
        models: [User, RealEstate],
        sync: { force: false, alter: true }
      })
    }),
    MailerModule.forRoot({
      transport: {
        service: process.env.MAIL_SERVICE,
        port: parseInt(process.env.MAIL_PORT),
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS,
        },
      },
      defaults: {
        from: `<${process.env.MAIL_USER}>`,
      },
      template: {
        dir: path.resolve(__dirname, '../templates'),
        adapter: new EjsAdapter(),
        
      },
    }),
    UserModule,
    RealEstateModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
