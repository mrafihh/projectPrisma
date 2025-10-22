import { IsString, MinLength } from 'class-validator';

export class LoginUserDto {
  @IsString({ message: 'Username wajib diisi' })
  username!: string;

  @IsString({ message: 'Password wajib diisi' })
  @MinLength(6, { message: 'Password minimal 6 karakter' })
  password!: string;
}