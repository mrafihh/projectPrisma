"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const user_service_1 = require("./user.service");
const prisma_service_1 = require("../prisma/prisma.service");
const common_1 = require("@nestjs/common");
const bcrypt = __importStar(require("bcrypt"));
jest.mock('bcrypt');
describe('UserService', () => {
    let service;
    let prisma;
    const mockPrismaService = {
        user: {
            create: jest.fn(),
            findMany: jest.fn(),
            findUnique: jest.fn(),
        },
    };
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [
                user_service_1.UserService,
                {
                    provide: prisma_service_1.PrismaService,
                    useValue: mockPrismaService,
                },
            ],
        }).compile();
        service = module.get(user_service_1.UserService);
        prisma = module.get(prisma_service_1.PrismaService);
        // Clear all mocks before each test
        jest.clearAllMocks();
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
    describe('createUser', () => {
        const mockData = {
            name: 'Davin',
            email: 'davin@example.com',
            password: '12345',
            role: 'ADMIN',
        };
        const hashedPassword = 'hashed_password';
        beforeEach(() => {
            bcrypt.hash.mockResolvedValue(hashedPassword);
        });
        it('should create a user with hashed password', async () => {
            // Setup: user does not exist
            mockPrismaService.user.findUnique.mockResolvedValue(null);
            const mockCreatedUser = {
                id: 1,
                ...mockData,
                password: hashedPassword,
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            mockPrismaService.user.create.mockResolvedValue(mockCreatedUser);
            const result = await service.createUser(mockData.name, mockData.email, mockData.password, mockData.role);
            expect(result).toEqual(mockCreatedUser);
            expect(bcrypt.hash).toHaveBeenCalledWith(mockData.password, 10);
            expect(mockPrismaService.user.create).toHaveBeenCalledWith({
                data: {
                    ...mockData,
                    password: hashedPassword,
                },
            });
        });
        it('should throw ConflictException if email already exists', async () => {
            // Setup: user already exists
            mockPrismaService.user.findUnique.mockResolvedValue({ id: 1, email: mockData.email });
            await expect(service.createUser(mockData.name, mockData.email, mockData.password, mockData.role)).rejects.toThrow(common_1.ConflictException);
            expect(mockPrismaService.user.create).not.toHaveBeenCalled();
        });
    });
    describe('findAll', () => {
        it('should return all users without passwords', async () => {
            const mockUsers = [
                {
                    id: 1,
                    name: 'User A',
                    email: 'usera@example.com',
                    role: 'KARYAWAN',
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                {
                    id: 2,
                    name: 'User B',
                    email: 'userb@example.com',
                    role: 'ADMIN',
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
            ];
            mockPrismaService.user.findMany.mockResolvedValue(mockUsers);
            const result = await service.findAll();
            expect(result).toEqual(mockUsers);
            expect(mockPrismaService.user.findMany).toHaveBeenCalledWith({
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                    createdAt: true,
                    updatedAt: true,
                },
            });
        });
    });
    describe('findByEmail', () => {
        const email = 'test@example.com';
        it('should find and return user by email without password', async () => {
            const mockUser = {
                id: 1,
                email,
                name: 'Test User',
                role: 'KARYAWAN',
                createdAt: new Date(),
                updatedAt: new Date()
            };
            mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
            const result = await service.findByEmail(email);
            expect(result).toEqual(mockUser);
            expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
                where: { email },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                    createdAt: true,
                    updatedAt: true,
                },
            });
        });
        it('should throw NotFoundException when user not found', async () => {
            mockPrismaService.user.findUnique.mockResolvedValue(null);
            await expect(service.findByEmail(email))
                .rejects
                .toThrow(common_1.NotFoundException);
        });
    });
});
