import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { StrategyName } from 'src/constants/enum.constants';
import { StaffService } from '../staff.service';

@Injectable()
export class JwtStaffStrategy extends PassportStrategy(
  Strategy,
  StrategyName.JwtStaffStrategy,
) {
  constructor(private staffService: StaffService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    //console.log('****************** JWT Staff ******************');
    const existEntity = await this.staffService.findOneByQuery({
      _id: payload._id,
      removed: false,
    });
    if (!existEntity) {
      throw new UnauthorizedException('Invalid Token');
    }
    return existEntity;
  }
}
