import { Queue } from 'bullmq';
import { connection } from './redis.ts';

interface JobData {
  number: number;
}

const args = process.argv.slice(2);
const defaultIntervalInMs = 1_000;

function defineInterval(args: string[]): number {
  for (const argument of args) {
    if (argument.startsWith('--every=')) {
      
      const customInterval = parseInt(argument.split('=')[1]);
      if (!isNaN(customInterval)) {
        return customInterval;
      }
    }
  }

  return defaultIntervalInMs;
}

const intervalInMs = defineInterval(args);

const queue = new Queue<JobData>('test-queue', { connection });

console.log(`Starting jobs every ${intervalInMs}ms...`);

async function addJob() {
  await queue.add('example-job', { number: Math.round(Math.random() * 100) });
}

// Launch the loop
setInterval(addJob, intervalInMs);