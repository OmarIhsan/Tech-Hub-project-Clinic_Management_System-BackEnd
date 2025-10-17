import { SetMetadata } from '@nestjs/common';
import { StaffRole } from 'src/common/enums/status.enums';

export const ROLES_KEY = 'roles';

export const Roles = (...roles: StaffRole[]) => SetMetadata('roles', roles);
