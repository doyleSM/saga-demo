import { Logger } from '@nestjs/common';

export interface SagaStep<Ctx> {
  name?: string;
  execute(ctx: Ctx): Promise<void>;
  compensate?(ctx: Ctx): Promise<void>;
}

export class SagaOrchestrator<Ctx> {
  private readonly logger = new Logger(SagaOrchestrator.name);

  constructor(private readonly steps: SagaStep<Ctx>[]) {}

  async execute(ctx: Ctx): Promise<void> {
    const executed: SagaStep<Ctx>[] = [];
    this.logger.log(`Saga started with context: ${JSON.stringify(ctx)}`);

    try {
      for (const step of this.steps) {
        const stepName = step.name || step.constructor.name;
        this.logger.log(`-> Executing step: ${stepName}`);
        executed.push(step);
        await step.execute(ctx);
        this.logger.log(`✅ Step succeeded: ${stepName}`);
      }
      this.logger.log('Saga completed successfully');
    } catch (err) {
      this.logger.error(`❌ Saga failed on step "${executed.slice(-1)[0]?.name ||
        executed.slice(-1)[0]?.constructor.name}". Error: ${err.message}`);
      this.logger.log('↩️ Starting compensation');
      for (const step of executed.reverse()) {
        const stepName = step.name || step.constructor.name;
        if (step.compensate) {
          try {
            this.logger.log(`↩️ Compensating step: ${stepName}`);
            await step.compensate(ctx);
            this.logger.log(`↩️ Compensation succeeded: ${stepName}`);
          } catch (compErr) {
            this.logger.error(
              `⚠️ Compensation error on step "${stepName}": ${compErr.message}`,
            );
          }
        }
      }
      this.logger.log('↩️ Compensation completed');
      throw err;
    }
  }
}
