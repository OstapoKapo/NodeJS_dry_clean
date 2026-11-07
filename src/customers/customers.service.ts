import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

/**
 * Business logic for customers. Owns the Customer table.
 * Other modules (Orders) check customers only through this service.
 */
@Injectable()
export class CustomersService {
  constructor(protected readonly prisma: PrismaService) {}
}
