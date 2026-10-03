import { AtlasClient, AtlasError } from '@atlascompiler/sdk';

// Client automatically reads ATLAS_API_KEY from environment
const client = new AtlasClient();

async function main() {
  const targetUrl = process.argv[2] || 'https://example.com';
  console.log(`Compiling ${targetUrl} with Atlas...`);

  try {
    const res = await client.compile({
      url: targetUrl,
      options: {
        cssSelector: 'body',
      },
    });

    if (res.status === 200) {
      console.log('\n--- Title ---');
      console.log(res.value.data.title);
      console.log('\n--- Compiled Markdown ---');
      console.log(res.value.data.markdown);
      console.log('\n--- Metadata ---');
      console.log(`Duration: ${res.value.data.durationMs}ms`);
      console.log(`Links discovered: ${res.value.data.links?.length ?? 0}`);
    } else if (res.status === 202) {
      console.log(`Job queued with ID ${res.value.id}. Waiting for completion...`);
      const job = await client.waitForJob(res.value.id);
      console.log(`Job completed with status: ${job.status}`);
      const results = await client.listJobResults(res.value.id);
      console.log(results.value.data[0]?.markdown);
    }
  } catch (err) {
    if (err instanceof AtlasError) {
      console.error(`Atlas Error [${err.status}] ${err.code}: ${err.message}`);
      if (err.invalidParams) {
        console.error('Invalid params:', err.invalidParams);
      }
    } else {
      console.error('Unexpected error:', err);
    }
    process.exit(1);
  }
}

main();
