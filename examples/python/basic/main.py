import os
import sys
from atlascompiler import AtlasClient, AtlasError

def main():
    target_url = sys.argv[1] if len(sys.argv) > 1 else "https://example.com"
    print(f"Compiling {target_url} with Atlas Python SDK...")

    # Client reads ATLAS_API_KEY from environment
    client = AtlasClient()

    try:
        res = client.compile(
            url=target_url,
            options={"cssSelector": "body"}
        )

        if res.status == 200:
            print("\n--- Compiled Markdown ---")
            print(res.markdown)
            print("\n--- Metadata ---")
            print(f"Status Code: {res.status}")
            print(f"Replayed: {res.replayed}")
        elif res.status == 202:
            job_id = res.value["id"]
            print(f"Async job queued: {job_id}. Polling for completion...")
            job = client.wait_for_job(job_id)
            print(f"Job finished: {job.get('status')}")
            results = client.list_job_results(job_id)
            for item in results.value.get("data", []):
                print(item.get("markdown"))

    except AtlasError as err:
        print(f"Atlas Error [{err.status}] {err.code}: {err.detail}", file=sys.stderr)
        if err.invalid_params:
            print(f"Invalid parameters: {err.invalid_params}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()
