import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { SimulatorModule } from './simulator/simulator.module';

@Module({
  imports: [HttpModule, SimulatorModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
