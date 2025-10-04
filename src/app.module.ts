import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PatientsModule } from './patients/patient.module';
import { StaffModule } from './staff/staff.module';
import { OtherIncomesModule } from './other-incomes/other-incomes.module';
import { ExpensesModule } from './expenses/expenses.module';
import { ClinicalDocumentsModule } from './clinical-documents/clinical-documents.module';
import { PatientImagesModule } from './patient-images/patient-images.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: +configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        autoLoadEntities: true,
        synchronize: true, // Set to false in production
      }),
      inject: [ConfigService],
    }),
    PatientsModule,
    StaffModule,
    OtherIncomesModule,
    ExpensesModule,
    ClinicalDocumentsModule,
    PatientImagesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
