import { Worker, Job } from 'bullmq';
import { connection } from './redis.ts';

interface JobData {
  number: number;
}

const worker = new Worker<JobData>(
  'test-queue',
  async (job: Job<JobData>) => {
    console.log(`Processing job ${job.id}`, job.data);
    await new Promise(resolve => setTimeout(resolve, 100));
    return { result: job.data.number * 2 };
  },
  { connection }
);

worker.on('completed', job => console.log(`Job ${job?.id} completed`));
worker.on('failed', (job, err) => console.error(`Job ${job?.id} failed`, err));
worker.on('error', err => console.error('Worker internal error:', err));

console.log('Worker started and waiting for jobs...');