/* eslint-disable prettier/prettier */
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { StaffService } from 'src/staff/staff.service';

export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private staffService: StaffService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'your-super-secretkey',
    });
  }

  async validate(payload: JwtPayload) {
    
    const user = await this.staffService.findOne(parseInt(payload.sub));
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return { userId: user.staff_id, email: user.email, role: user.role };
  }
}
