import { Module } from '@nestjs/common';
import { CustomersModule } from '../customers/customers.module';
import { ServicesModule } from '../services/services.module';
import { OrdersService } from './orders.service';

/** Orders → Customers, Services. The only allowed cross-feature dependency. */
@Module({
  imports: [CustomersModule, ServicesModule],
  providers: [OrdersService],
})
export class OrdersModule {}
