import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { StrategyName } from 'src/constants/enum.constants';

@Injectable()
export class StaffAuthGuard extends AuthGuard(StrategyName.JwtStaffStrategy) { }
