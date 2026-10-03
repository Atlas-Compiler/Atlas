import json
import asyncio
from pathlib import Path
from types import MethodType

from atlascompiler import (
    CompileUrlRequest,
    CancelJobResponse,
    GetApiKeyResponse,
    GetBillingSubscriptionResponse,
    GetCurrentUserResponse,
    GetJobResponse,
    GetUsageResponse,
    GetWebhookEndpointResponse,
    GetWorkspaceBootstrapResponse,
    GetWorkspaceDeletionResponse,
    ListApiKeysResponse,
    ListJobErrorsResponse,
    ListJobResultsResponse,
    ListProjectsResponse,
    ListUsageLedgerResponse,
    ListWebhookDeliveriesResponse,
    ListWebhookEndpointsResponse,
    ListWorkspaceInvitationsResponse,
    ListWorkspaceMembersResponse,
    ListWorkspacesResponse,
    OPERATIONS,
    Problem,
    AtlasClient,
    AsyncAtlasClient,
    SyncAtlasClient,
    Response,
    ResolveWorkspaceBySlugResponse,
    is_completed,
)


def test_all_shared_contract_fixtures():
    fixture = json.loads((Path(__file__).parents[2] / ".." / "contracts" / "fixtures" / "v1-conformance.json").read_text())
    problem: Problem = fixture["problem"]
    job: GetJobResponse = fixture["job"]
    cancellation: CancelJobResponse = fixture["cancellation"]
    results: ListJobResultsResponse = fixture["resultPage"]
    errors: ListJobErrorsResponse = fixture["errorPage"]
    compile_request: CompileUrlRequest = fixture["compileRequest"]
    user: GetCurrentUserResponse = fixture["user"]
    workspaces: ListWorkspacesResponse = fixture["workspacePage"]
    bootstrap: GetWorkspaceBootstrapResponse = fixture["workspaceBootstrap"]
    resolved: ResolveWorkspaceBySlugResponse = fixture["resolvedWorkspace"]
    deletion: GetWorkspaceDeletionResponse = fixture["workspaceDeletion"]
    members: ListWorkspaceMembersResponse = fixture["memberPage"]
    invitations: ListWorkspaceInvitationsResponse = fixture["invitationPage"]
    projects: ListProjectsResponse = fixture["projectPage"]
    api_keys: ListApiKeysResponse = fixture["apiKeyPage"]
    api_key: GetApiKeyResponse = fixture["apiKey"]
    usage: GetUsageResponse = fixture["usage"]
    ledger: ListUsageLedgerResponse = fixture["ledgerPage"]
    subscription: GetBillingSubscriptionResponse = fixture["subscription"]
    endpoints: ListWebhookEndpointsResponse = fixture["webhookEndpointPage"]
    webhook_endpoint: GetWebhookEndpointResponse = fixture["webhookEndpoint"]
    deliveries: ListWebhookDeliveriesResponse = fixture["webhookDeliveryPage"]
    assert len(OPERATIONS) == 17
    assert problem["requestId"].startswith("req_")
    assert job["status"] == "ready"
    assert cancellation["job"]["status"] == "cancelled"
    assert results["data"][0]["markdown"] == "# Result"
    assert len(results["data"][0]["ir"]["contentGraph"]["nodes"]) == 2
    assert errors["data"][0]["code"] == "fetch_failed"
    assert compile_request["cache"]["maxAgeSeconds"] == 60
    assert user["email"] == "user@example.com"
    assert workspaces["data"] and members["data"] and invitations["data"]
    assert bootstrap["workspace"]["isPrimary"] is True
    assert resolved["workspace"]["role"] == "owner"
    assert deletion["stage"] == "requested"
    assert projects["data"] and api_keys["data"] and usage["accounts"]
    assert api_key["id"] == "key_01J00000000000000000000000"
    assert ledger["data"][0]["metadata"]["nested"]["source"] == "fixture"
    assert subscription["status"] == "active"
    assert endpoints["data"] and deliveries["data"]
    assert webhook_endpoint["id"] == "whk_01J00000000000000000000000"


def test_surface_area_isolation():
    developer_ops = [
        "compileUrl", "scrapeUrl", "mapUrl", "createCrawl", "createBatch",
        "getJob", "cancelJob", "listJobs", "bulkCancelJobs", "listJobResults", "listJobErrors",
        "getWorkspaceOverview", "listProjects", "getProjectsStats", "getProject", "getUsage", "listUsageLedger",
    ]
    assert set(OPERATIONS.keys()) == set(developer_ops)

    # Ensure Clerk operations are not in OPERATIONS
    for clerk_op in ["getApiKey", "getWebhookEndpoint", "listApiKeys", "getCurrentUser", "getBillingSubscription"]:
        assert clerk_op not in OPERATIONS

    # Verify method presence and absence on AtlasClient and AsyncAtlasClient
    expected_methods = [
        "compile", "scrape", "map", "create_crawl", "create_batch",
        "get_job", "cancel_job", "list_jobs", "bulk_cancel_jobs",
        "list_job_results", "list_job_errors", "get_workspace_overview",
        "list_projects", "get_project", "get_usage", "list_usage_ledger",
        "wait_for_job", "close",
    ]
    for method in expected_methods:
        assert hasattr(AtlasClient, method), f"AtlasClient missing {method}"
        assert hasattr(AsyncAtlasClient, method), f"AsyncAtlasClient missing {method}"

    for clerk_method in ["get_api_key", "get_webhook_endpoint", "list_api_keys", "get_current_user"]:
        assert not hasattr(AtlasClient, clerk_method), f"AtlasClient leaked {clerk_method}"
        assert not hasattr(AsyncAtlasClient, clerk_method), f"AsyncAtlasClient leaked {clerk_method}"

    assert SyncAtlasClient is AtlasClient


def test_is_completed_helper():
    assert is_completed({"status": "ready"}) is True
    assert is_completed({"status": "failed"}) is True
    assert is_completed({"status": "cancelled"}) is True
    assert is_completed({"status": "failed", "artifactState": "review"}) is True
    assert is_completed({"status": "running", "artifactState": "review"}) is True
    assert is_completed({"status": "queued"}) is False
    assert is_completed({"status": "running"}) is False
    assert is_completed({"status": "ingesting"}) is False


def test_sync_wait_for_job_polls_until_terminal():
    client = AtlasClient("atlas_fixture", workspace_id="ws_fixture")
    jobs = iter(
        [
            {"id": "job_fixture", "status": "running"},
            {"id": "job_fixture", "status": "ready"},
        ]
    )

    def get_job(_client, _job_id):
        return Response(200, next(jobs), None, None, False)

    client.get_job = MethodType(get_job, client)
    try:
        result = client.wait_for_job(
            "job_fixture", interval_seconds=0.001, max_wait_seconds=1
        )
        assert result["status"] == "ready"
    finally:
        client.close()


def test_sync_wait_for_job_polls_until_review():
    client = AtlasClient("atlas_fixture", workspace_id="ws_fixture")
    jobs = iter(
        [
            {"id": "job_fixture", "status": "running"},
            {"id": "job_fixture", "status": "failed", "artifactState": "review"},
        ]
    )

    def get_job(_client, _job_id):
        return Response(200, next(jobs), None, None, False)

    client.get_job = MethodType(get_job, client)
    try:
        result = client.wait_for_job(
            "job_fixture", interval_seconds=0.001, max_wait_seconds=1
        )
        assert result["status"] == "failed"
        assert result["artifactState"] == "review"
    finally:
        client.close()


def test_async_wait_for_job_polls_until_terminal():
    async def exercise():
        async with AsyncAtlasClient("atlas_fixture", workspace_id="ws_fixture") as client:
            jobs = iter(
                [
                    {"id": "job_fixture", "status": "running"},
                    {"id": "job_fixture", "status": "ready"},
                ]
            )

            async def get_job(_client, _job_id):
                return Response(200, next(jobs), None, None, False)

            client.get_job = MethodType(get_job, client)
            result = await client.wait_for_job(
                "job_fixture", interval_seconds=0.001, max_wait_seconds=1
            )
            assert result["status"] == "ready"

    asyncio.run(exercise())


def test_async_wait_for_job_polls_until_review():
    async def exercise():
        async with AsyncAtlasClient("atlas_fixture", workspace_id="ws_fixture") as client:
            jobs = iter(
                [
                    {"id": "job_fixture", "status": "running"},
                    {"id": "job_fixture", "status": "failed", "artifactState": "review"},
                ]
            )

            async def get_job(_client, _job_id):
                return Response(200, next(jobs), None, None, False)

            client.get_job = MethodType(get_job, client)
            result = await client.wait_for_job(
                "job_fixture", interval_seconds=0.001, max_wait_seconds=1
            )
            assert result["status"] == "failed"
            assert result["artifactState"] == "review"

    asyncio.run(exercise())


def test_client_context_managers():
    with AtlasClient("key_123") as sync_client:
        assert sync_client.api_key == "key_123"

    async def test_async_cm():
        async with AsyncAtlasClient("key_456") as async_client:
            assert async_client.api_key == "key_456"

    asyncio.run(test_async_cm())
