import { Module } from '@nestjs/common';
import { CustomersModule } from './customers/customers.module';
import { OrdersModule } from './orders/orders.module';
import { PrismaModule } from './prisma/prisma.module';
import { ServicesModule } from './services/services.module';
import { GitShaService } from './version/git-sha.service';
import { VersionController } from './version/version.controller';

@Module({
  imports: [PrismaModule, CustomersModule, ServicesModule, OrdersModule],
  controllers: [VersionController],
  providers: [GitShaService],
})
export class AppModule {}
