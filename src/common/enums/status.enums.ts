/* eslint-disable prettier/prettier */
export enum AppointmentStatus {
  SCHEDULED = 'scheduled',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  NO_SHOW = 'no_show',
}

export enum TreatmentPlanStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum StaffRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  STAFF = 'staff',
  CUSTOMER = 'customer',
}

export enum Gender {
  Male = 'Male',
  Female = 'Female',

}

// Extend here for other status-based columns if needed.
