import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

/**
 * Business logic for the cleaning-service catalog. Owns the Service table.
 * Orders reads current prices and active state only through this service.
 */
@Injectable()
export class ServicesService {
  constructor(protected readonly prisma: PrismaService) {}
}
