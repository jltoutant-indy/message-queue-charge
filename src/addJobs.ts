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

const queues: Queue[] = [];
for (let i = 0; i < 250; i++) {
  queues.push(new Queue(`test-queue-${i}`, { connection }));
}

console.log(`Starting jobs every ${intervalInMs}ms...`);

async function addJob() {
  const queue = queues[Math.floor(Math.random() * queues.length)];
  await queue.add(
    'aJobWithAQuiteLongNameSuchInRealLife',
    { 
      userId: 'nvD354ssxGayR46K2',
      bankAccountId: 'nvD354ssxGayR46K2',
      bankAuthId: 'nvD354ssxGayR46K2',
      amountInCents: Math.round(Math.random() * 100_000),
      s3Url: 'scans/nvD354ssxGayR46K2/2024/scans/2024-06-07_08:32:37-a60f3f26-7e16-439a-8c8a-5b80b60f4a16/7C08A0B2-EABE-4704-861A-6F0B03810F21.jpg',
    });
}

// Launch the loop
setInterval(addJob, intervalInMs);