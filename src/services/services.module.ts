import { Module } from '@nestjs/common';
import { ServicesService } from './services.service';

/** Independent module: must not import CustomersModule or OrdersModule. */
@Module({
  providers: [ServicesService],
  exports: [ServicesService],
})
export class ServicesModule {}
