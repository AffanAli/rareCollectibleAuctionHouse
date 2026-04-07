import { UserRole } from 'src/database/enums/user-role.enum';

export interface JwtPayload {
  sub: number; // matches your User.id type
  email: string;
  role: UserRole;
}

export interface JwtGuardResponse {
  id: number;
  email: string;
  role: UserRole;
}
