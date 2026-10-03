package main

import (
	"context"
	"errors"
	"fmt"
	"log"
	"os"
	"time"

	"go.atlas-compiler.com/sdk/pkg/atlas"
)

func main() {
	targetURL := "https://example.com"
	if len(os.Args) > 1 {
		targetURL = os.Args[1]
	}

	fmt.Printf("Compiling %s with Atlas Go SDK...\n", targetURL)

	// Automatically reads ATLAS_API_KEY from environment
	client := atlas.New(os.Getenv("ATLAS_API_KEY"), atlas.WithTimeout(30*time.Second))

	ctx := context.Background()
	res, meta, err := client.Compile(ctx, atlas.CompileUrlRequest{
		Url: targetURL,
	})
	if err != nil {
		var problem *atlas.Problem
		if errors.As(err, &problem) {
			log.Fatalf("Atlas API Error [%d] %s: %s (Request ID: %s)",
				problem.Status, problem.Code, problem.Detail, problem.RequestId)
		}
		log.Fatalf("Compile error: %v", err)
	}

	if res.Response200 != nil {
		fmt.Printf("Compiled in HTTP %d (Replayed: %t)\n", meta.StatusCode, meta.Replayed)
		fmt.Printf("Title: %s\n", res.Response200.Data.Title)
		fmt.Printf("\n--- Markdown ---\n%s\n", res.Response200.Data.Markdown)
	} else if res.Response202 != nil {
		jobID := res.Response202.Id
		fmt.Printf("Job queued with ID %s. Waiting for completion...\n", jobID)
		job, _, err := client.WaitForJob(ctx, jobID, 1*time.Second, 60*time.Second)
		if err != nil {
			log.Fatalf("WaitForJob error: %v", err)
		}
		fmt.Printf("Job status: %s\n", job.Status)
	}
}
