package atlas

import (
	"context"
	"encoding/json"
	"errors"
	"net/http"
	"net/http/httptest"
	"os"
	"testing"
	"time"
)

func TestSharedProblemFixture(t *testing.T) {
	content, err := os.ReadFile("../../contracts/fixtures/v1-conformance.json")
	if err != nil {
		t.Fatal(err)
	}
	var fixture struct {
		Problem             Problem                             `json:"problem"`
		Job                 GetJobResponse200                   `json:"job"`
		Cancellation        CancelJobResponse202                `json:"cancellation"`
		ResultPage          ListJobResultsResponse200           `json:"resultPage"`
		ErrorPage           ListJobErrorsResponse200            `json:"errorPage"`
		CompileRequest      CompileUrlRequest                   `json:"compileRequest"`
		User                GetCurrentUserResponse200           `json:"user"`
		WorkspaceBootstrap  GetWorkspaceBootstrapResponse200    `json:"workspaceBootstrap"`
		ResolvedWorkspace   ResolveWorkspaceBySlugResponse200   `json:"resolvedWorkspace"`
		WorkspaceDeletion   GetWorkspaceDeletionResponse200     `json:"workspaceDeletion"`
		WorkspacePage       ListWorkspacesResponse200           `json:"workspacePage"`
		MemberPage          ListWorkspaceMembersResponse200     `json:"memberPage"`
		InvitationPage      ListWorkspaceInvitationsResponse200 `json:"invitationPage"`
		ProjectPage         ListProjectsResponse200             `json:"projectPage"`
		APIKeyPage          ListApiKeysResponse200              `json:"apiKeyPage"`
		Usage               GetUsageResponse200                 `json:"usage"`
		LedgerPage          ListUsageLedgerResponse200          `json:"ledgerPage"`
		Subscription        GetBillingSubscriptionResponse200   `json:"subscription"`
		WebhookEndpointPage ListWebhookEndpointsResponse200     `json:"webhookEndpointPage"`
		WebhookDeliveryPage ListWebhookDeliveriesResponse200    `json:"webhookDeliveryPage"`
		ApiKey              GetApiKeyResponse200                `json:"apiKey"`
		WebhookEndpoint     GetWebhookEndpointResponse200       `json:"webhookEndpoint"`
	}
	if err := json.Unmarshal(content, &fixture); err != nil {
		t.Fatal(err)
	}
	if fixture.Problem.Code != "validation_failed" || fixture.Problem.Status != 400 {
		t.Fatalf("unexpected Problem: %+v", fixture.Problem)
	}
	if len(Operations) != 17 || fixture.Job.Status != "ready" || fixture.Cancellation.Job.Status != "cancelled" || len(fixture.ResultPage.Data) != 1 || len(fixture.ErrorPage.Data) != 1 {
		t.Fatal("shared conformance fixtures did not decode into generated models")
	}
	if fixture.ResultPage.Data[0].Ir == nil || len(fixture.ResultPage.Data[0].Ir.ContentGraph.Nodes) != 2 {
		t.Fatal("nonempty IR node map did not decode")
	}
	if fixture.CompileRequest.Cache == nil || fixture.CompileRequest.Cache.ForceFresh == nil || *fixture.CompileRequest.Cache.ForceFresh || fixture.CompileRequest.Cache.MaxAgeSeconds == nil || *fixture.CompileRequest.Cache.MaxAgeSeconds != 60 {
		t.Fatal("optional nested cache fields did not decode")
	}
	if len(fixture.WorkspacePage.Data) != 1 || len(fixture.MemberPage.Data) != 1 || len(fixture.InvitationPage.Data) != 1 || len(fixture.ProjectPage.Data) != 1 || len(fixture.APIKeyPage.Data) != 1 || len(fixture.Usage.Accounts) != 1 || len(fixture.LedgerPage.Data) != 1 || fixture.Subscription.Status != "active" || len(fixture.WebhookEndpointPage.Data) != 1 || len(fixture.WebhookDeliveryPage.Data) != 1 || fixture.User.Email == nil || fixture.ApiKey.Id != "key_01J00000000000000000000000" || fixture.WebhookEndpoint.Id != "whk_01J00000000000000000000000" {
		t.Fatal("one or more shared fixture sections did not decode")
	}
	if !fixture.WorkspaceBootstrap.Workspace.IsPrimary || fixture.ResolvedWorkspace.Workspace.Role != ResolveWorkspaceBySlugResponse200WorkspaceRoleOwner || fixture.WorkspaceDeletion.Stage != GetWorkspaceDeletionResponse200StageRequested {
		t.Fatal("workspace lifecycle fixtures did not decode")
	}
	if fixture.LedgerPage.Data[0].Metadata == nil || len(*fixture.LedgerPage.Data[0].Metadata) != 4 {
		t.Fatal("recursive JSON metadata did not decode")
	}
}

func TestSurfaceAreaIsolation(t *testing.T) {
	if len(Operations) != 17 {
		t.Fatalf("expected exactly 17 operations, got %d", len(Operations))
	}
	expectedOps := []OperationID{
		CompileUrl, ScrapeUrl, MapUrl, CreateCrawl, CreateBatch,
		GetJob, CancelJob, ListJobs, BulkCancelJobs, ListJobResults, ListJobErrors,
		GetWorkspaceOverview, ListProjects, GetProjectsStats, GetProject, GetUsage, ListUsageLedger,
	}
	for _, op := range expectedOps {
		if _, ok := Operations[op]; !ok {
			t.Fatalf("missing expected operation %s", op)
		}
	}
	// Verify Clerk-only operations are absent
	clerkOps := []OperationID{"getApiKey", "getWebhookEndpoint", "listApiKeys", "getCurrentUser", "getBillingSubscription"}
	for _, op := range clerkOps {
		if _, ok := Operations[op]; ok {
			t.Fatalf("Clerk operation leaked into Operations: %s", op)
		}
	}
}

func TestNewConstructorAndOptions(t *testing.T) {
	c := New("key_123", WithWorkspaceID("ws_123"), WithBaseURL("https://custom.api/"), WithTimeout(15*time.Second))
	if c.APIKey != "key_123" || c.WorkspaceID != "ws_123" || c.BaseURL != "https://custom.api" || c.HTTPClient.Timeout != 15*time.Second {
		t.Fatalf("unexpected client config: %+v", c)
	}

	// Test legacy NewClient wrapper
	legacy := NewClient("ws_legacy", "key_legacy")
	if legacy.APIKey != "key_legacy" || legacy.WorkspaceID != "ws_legacy" || legacy.BaseURL != "https://api.atlas-compiler.com" {
		t.Fatalf("unexpected legacy client config: %+v", legacy)
	}

	// Test ambient env fallback
	t.Setenv("ATLAS_API_KEY", "env_key")
	t.Setenv("ATLAS_WORKSPACE_ID", "env_ws")
	t.Setenv("ATLAS_BASE_URL", "https://env.api/")
	envClient := New("")
	if envClient.APIKey != "env_key" || envClient.WorkspaceID != "env_ws" || envClient.BaseURL != "https://env.api" {
		t.Fatalf("unexpected env client config: %+v", envClient)
	}
}

func TestCompileIsWorkspaceScopedAndIdempotent(t *testing.T) {
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path != "/v1/compile" || r.Header.Get("Idempotency-Key") != "request-123" {
			t.Fatalf("unexpected request: %s %s", r.URL.Path, r.Header.Get("Idempotency-Key"))
		}
		_, _ = w.Write([]byte(`{}`))
	}))
	defer server.Close()
	client := NewClient("ws_1", "key")
	client.BaseURL = server.URL
	_, _, err := client.Compile(context.Background(), CompileUrlRequest{
		Url: "https://example.com",
	}, "request-123")
	if err != nil {
		t.Fatal(err)
	}

	projId := "prj_1"
	_, _, err = client.Compile(context.Background(), CompileUrlRequest{
		ProjectId: &projId,
		Url:       "https://example.com",
	}, "request-123")
	if err != nil {
		t.Fatal(err)
	}
}

func TestCompileAutoUUIDWhenOmitted(t *testing.T) {
	var capturedKey string
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		capturedKey = r.Header.Get("Idempotency-Key")
		_, _ = w.Write([]byte(`{}`))
	}))
	defer server.Close()

	client := New("key", WithBaseURL(server.URL))
	_, _, err := client.Compile(context.Background(), CompileUrlRequest{Url: "https://example.com"})
	if err != nil {
		t.Fatal(err)
	}
	if len(capturedKey) != 36 {
		t.Fatalf("expected 36-character UUID, got %q", capturedKey)
	}
}

func TestRFC9457ProblemErrorAs(t *testing.T) {
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/problem+json")
		w.WriteHeader(http.StatusBadRequest)
		_, _ = w.Write([]byte(`{"type":"about:blank","title":"Validation Failed","status":400,"detail":"url is invalid","code":"validation_failed"}`))
	}))
	defer server.Close()

	client := New("key", WithBaseURL(server.URL))
	_, _, err := client.GetJob(context.Background(), "job_1")
	if err == nil {
		t.Fatal("expected error, got nil")
	}

	var prob *Problem
	if !errors.As(err, &prob) {
		t.Fatalf("expected errors.As to match *Problem, got %T: %v", err, err)
	}
	if prob.Status != 400 || prob.Code != "validation_failed" || prob.Detail != "url is invalid" {
		t.Fatalf("unexpected Problem content: %+v", prob)
	}
}
