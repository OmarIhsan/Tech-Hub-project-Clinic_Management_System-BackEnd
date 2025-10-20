import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { StaffService } from 'src/staff/staff.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import * as bcrypt from 'bcrypt';
import { Staff } from 'src/staff/entities/entity.staff';

@Injectable()
export class AuthService {
  constructor(
    private staffService: StaffService,
    private jwtService: JwtService,
  ) {}

  async register(
    registerDto: RegisterDto,
  ): Promise<{ user: Partial<Staff>; access_token: string }> {
    const { email, password, full_name, phone, role } = registerDto;

    const existingUser = await this.staffService.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const user = await this.staffService.create({
      email,
      full_name,
      phone,
      password: password,
      role,
    });

    const payload = { sub: user.staff_id, email: user.email, role: user.role };
    const access_token = this.jwtService.sign(payload);

    const userWithoutPassword = this.excludePassword(user);

    return {
      user: userWithoutPassword,
      access_token,
    };
  }

  async login(
    loginDto: LoginDto,
  ): Promise<{ user: Partial<Staff>; access_token: string }> {
    const { email, password: loginPassword } = loginDto;
    // Normalize email used for lookup
    const lookupEmail = email.trim().toLowerCase();

    const user = await this.staffService.findByEmail(lookupEmail);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(loginPassword, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload = { sub: user.staff_id, email: user.email, role: user.role };
    const access_token = this.jwtService.sign(payload);

    const userWithoutPassword = this.excludePassword(user);

    return {
      user: userWithoutPassword,
      access_token,
    };
  }

  async changePassword(
    userId: number,
    changePasswordDto: ChangePasswordDto,
  ): Promise<{ message: string }> {
    const { currentPassword, newPassword } = changePasswordDto;

    const user = await this.staffService.findOne(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password,
    );
    if (!isCurrentPasswordValid) {
      throw new BadRequestException('Current password is incorrect');
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 12);

    await this.staffService.updatePassword(userId, hashedNewPassword);

    return { message: 'Password changed successfully' };
  }

  // Admin-level password reset (caller should have OWNER privileges)
  async adminResetPassword(email: string, newPassword: string): Promise<{ message: string }> {
    const lookupEmail = email.trim().toLowerCase();
    const user = await this.staffService.findByEmail(lookupEmail);
    if (!user) throw new NotFoundException('User not found');

    const hashed = await bcrypt.hash(newPassword, 12);
    await this.staffService.updatePassword(user.staff_id, hashed);
    return { message: 'Password reset successfully' };
  }

  private excludePassword(user: Staff): Partial<Staff> {
    /* eslint-disable */
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
