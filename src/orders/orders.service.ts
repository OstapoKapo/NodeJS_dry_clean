import { Injectable } from '@nestjs/common';
import { CustomersService } from '../customers/customers.service';
import { PrismaService } from '../prisma/prisma.service';
import { ServicesService } from '../services/services.service';

/**
 * Business logic for orders and their items. Owns the Order and OrderItem tables;
 * order item code lives under src/orders/ (there is no OrderItemsModule).
 * Customers and services are reached only through their modules' services.
 */
@Injectable()
export class OrdersService {
  constructor(
    protected readonly prisma: PrismaService,
    protected readonly customers: CustomersService,
    protected readonly services: ServicesService,
  ) {}
}
