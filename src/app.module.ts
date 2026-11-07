import { Module } from '@nestjs/common';
import { CustomersModule } from './customers/customers.module';
import { OrdersModule } from './orders/orders.module';
import { PrismaModule } from './prisma/prisma.module';
import { ServicesModule } from './services/services.module';
import { VersionModule } from './version/version.module';

@Module({
  imports: [PrismaModule, CustomersModule, ServicesModule, OrdersModule, VersionModule],
})
export class AppModule {}
