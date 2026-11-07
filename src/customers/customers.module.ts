import { Module } from '@nestjs/common';
import { CustomersService } from './customers.service';

/** Independent module: must not import ServicesModule or OrdersModule. */
@Module({
  providers: [CustomersService],
  exports: [CustomersService],
})
export class CustomersModule {}
