import { AtlasClient, AtlasError } from '@atlascompiler/sdk';

const client = new AtlasClient();

async function main() {
  const urls = [
    'https://example.com',
    'https://httpbin.org/html',
  ];

  console.log(`Submitting batch job for ${urls.length} URLs...`);

  try {
    const batchRes = await client.createBatch({
      urls,
      options: {
        cssSelector: 'body',
      },
    });

    const jobId = batchRes.value.id;
    console.log(`Batch job queued with ID: ${jobId}`);

    console.log('Waiting for batch execution to complete...');
    const job = await client.waitForJob(jobId, 1500, 120000);
    console.log(`Job finished with status: ${job.status}`);

    const results = await client.listJobResults(jobId);
    console.log(`\nRetrieved ${results.value.data.length} compiled result(s):`);

    for (const item of results.value.data) {
      console.log(`\n========================================`);
      console.log(`URL: ${item.url}`);
      console.log(`Status: ${item.status}`);
      console.log(`Markdown snippet:\n${item.markdown?.slice(0, 200)}...`);
    }
  } catch (err) {
    if (err instanceof AtlasError) {
      console.error(`Atlas Error [${err.status}] ${err.code}: ${err.message}`);
    } else {
      console.error('Unexpected error:', err);
    }
    process.exit(1);
  }
}

main();
