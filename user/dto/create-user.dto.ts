import { IsEmail, IsString, IsEnum, IsOptional, IsBoolean, MinLength } from 'class-validator';

enum Role {
ADMIN = 'ADMIN',
KARYAWAN = 'KARYAWAN'
}

export class CreateUserDto {
@IsEmail({}, { message: 'Email tidak valid' })
email!: string;

@IsString()
@MinLength(3, { message: 'Username minimal 3 karakter' })
username!: string;

@IsString()
@MinLength(6, { message: 'Password minimal 6 karakter' })
password!: string;

@IsString()
@MinLength(3, { message: 'Nama minimal 3 karakter' })
nama!: string;

@IsEnum(Role, { message: 'Role harus ADMIN atau KARYAWAN' })
@IsOptional()
role?: Role = Role.KARYAWAN;

@IsBoolean()
@IsOptional()
aktif?: boolean = true;
}