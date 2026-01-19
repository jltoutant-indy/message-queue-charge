import { Worker, Job } from 'bullmq';
import { connection } from './redis.ts';

interface JobData {
  number: number;
}
const workers: Worker[] = [];

for(let i = 0; i < 250; i++) {
  const worker = new Worker(
    `test-queue-${i}`,
    async (job: Job) => {
      console.log(`Processing job ${job.id}`, job.data);
      await new Promise(resolve => setTimeout(resolve, 100));
      return { result: job.data.number * 2 };
    },
    { connection }
  );

  worker.on('completed', job => console.log(`Job ${job?.id} completed`));
  worker.on('failed', (job, err) => console.error(`Job ${job?.id} failed`, err));
  worker.on('error', err => console.error('Worker internal error:', err));

  workers.push(worker);
}

console.log('Workers started and waiting for jobs...');