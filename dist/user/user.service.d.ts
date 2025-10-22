import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';
type UserRole = 'ADMIN' | 'KARYAWAN';
export declare class UserService {
    private prisma;
    constructor(prisma: PrismaService);
    createUser(name: string, email: string, password: string, role: UserRole): Promise<User>;
    findAll(): Promise<Partial<User>[]>;
    findByEmail(email: string): Promise<Partial<User> | null>;
}
export {};
