import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { PatientsModule } from './patients/patient.module';
import { StaffModule } from './staff/staff.module';
import { OtherIncomesModule } from './other-incomes/other-incomes.module';
import { ExpensesModule } from './expenses/expenses.module';
import { ClinicalDocumentsModule } from './clinical-documents/clinical-documents.module';
import { PatientImagesModule } from './patient-images/patient-images.module';
import { TreatmentPlansModule } from './treatment-plans/treatment-plans.module';
import { ProceduresModule } from './procedures/procedures.module';
import { MedicalRecordsModule } from './medical-records/medical-records.module';
import { DoctorsModule } from './doctors/doctors.module';
import { AppointmentModule } from './appointments/appointments.module';
import { AuthModule } from './Auth/auth.module';
import { LoggerMiddleware } from './common/middlewares/login.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: process.env.NODE_ENV !== 'production',
      logging: false,
      extra: {
        connectionLimit: 1,
        connectTimeout: 10000,
      },
    }),
    PatientsModule,
    StaffModule,
    OtherIncomesModule,
    ExpensesModule,
    ClinicalDocumentsModule,
    PatientImagesModule,
    TreatmentPlansModule,
    ProceduresModule,
    MedicalRecordsModule,
    DoctorsModule,
    AppointmentModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
