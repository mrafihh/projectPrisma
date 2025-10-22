"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const user_controller_1 = require("./user.controller");
const user_service_1 = require("./user.service");
const common_1 = require("@nestjs/common");
describe('UserController', () => {
    let controller;
    let service;
    const mockUserService = {
        findAll: jest.fn(),
        createUser: jest.fn(),
    };
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [user_controller_1.UserController],
            providers: [
                {
                    provide: user_service_1.UserService,
                    useValue: mockUserService,
                },
            ],
        }).compile();
        controller = module.get(user_controller_1.UserController);
        service = module.get(user_service_1.UserService);
        // Clear all mocks before each test
        jest.clearAllMocks();
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
    describe('getAll', () => {
        it('should return all users successfully', async () => {
            const mockUsers = [
                {
                    id: 1,
                    name: 'Davin',
                    email: 'davin@example.com',
                    role: 'KARYAWAN',
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
            ];
            mockUserService.findAll.mockResolvedValue(mockUsers);
            const result = await controller.getAll();
            expect(result).toEqual(mockUsers);
            expect(mockUserService.findAll).toHaveBeenCalled();
        });
        it('should handle empty user list', async () => {
            mockUserService.findAll.mockResolvedValue([]);
            const result = await controller.getAll();
            expect(result).toEqual([]);
            expect(mockUserService.findAll).toHaveBeenCalled();
        });
    });
    describe('create', () => {
        const createUserDto = {
            name: 'Davin',
            email: 'davin@example.com',
            password: '123456',
            role: 'ADMIN',
        };
        const mockCreatedUser = {
            id: 1,
            ...createUserDto,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        it('should create a new user successfully', async () => {
            mockUserService.createUser.mockResolvedValue(mockCreatedUser);
            const result = await controller.create(createUserDto);
            expect(result).toEqual(mockCreatedUser);
            expect(mockUserService.createUser).toHaveBeenCalledWith(createUserDto.name, createUserDto.email, createUserDto.password, createUserDto.role);
        });
        it('should handle duplicate email error', async () => {
            mockUserService.createUser.mockRejectedValue(new common_1.ConflictException('Email already exists'));
            await expect(controller.create(createUserDto))
                .rejects
                .toThrow(common_1.ConflictException);
            expect(mockUserService.createUser).toHaveBeenCalledWith(createUserDto.name, createUserDto.email, createUserDto.password, createUserDto.role);
        });
    });
});
