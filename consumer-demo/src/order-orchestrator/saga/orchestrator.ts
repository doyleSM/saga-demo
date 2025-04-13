export interface SagaStep<T> {
  execute(ctx: T): Promise<void>;
  compensate?(ctx: T): Promise<void>;
}

export class SagaOrchestrator<T> {
  constructor(private readonly steps: SagaStep<T>[]) {}

  async execute(ctx: T): Promise<void> {
    const executed: SagaStep<T>[] = [];
    try {
      for (const step of this.steps) {
        executed.push(step);
        await step.execute(ctx);
      }
    } catch (err) {
      for (const step of executed.reverse()) {
        if (step.compensate) {
          try {
            await step.compensate(ctx);
          } catch (compErr) {
            console.error('Compensation error', compErr);
          }
        }
      }
      throw err;
    }
  }
}
