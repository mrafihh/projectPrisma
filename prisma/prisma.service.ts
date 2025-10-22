// prisma/prisma.service.ts
import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super({
      log: ['query', 'error', 'warn'],
    });
  }

  async onModuleInit() {
    await this.$connect();
    this.logger.log('Database connection established (MySQL)');
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.log('Database connection closed');
  }

  async cleanDatabase() {
    if (process.env.NODE_ENV === 'production') return;

    // Explicit model types from PrismaClient
    const modelNames: (keyof Omit<PrismaClient, '$on' | '$connect' | '$disconnect' | '$use' | '$transaction' | '$extends'>)[] = [
      'user',
      'product',
      'transaction',
      'laporanStok',
      'notifikasi'
    ];
    
    return Promise.all(
      modelNames.map(async (modelName) => {
        try {
          return await (this[modelName] as any).deleteMany();
        } catch (error) {
          this.logger.error(`Failed to clean ${String(modelName)}:`, error);
          return null;
        }
      })
    );
  }
}