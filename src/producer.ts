import { Queue } from 'bullmq';
import { connection } from './redis.ts';

interface JobData {
  number: number;
}

const queue = new Queue<JobData>('test-queue', { connection });

async function addJobs() {
  for (let i = 1; i <= 100_000; i++) {
    await queue.add('example-job', { number: i });
    //console.log(`Job ${i} added`);
  }
  await queue.close();
  console.log('All jobs added.');
}

addJobs();