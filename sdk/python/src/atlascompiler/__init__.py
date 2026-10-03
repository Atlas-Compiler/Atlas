# Generated from backend/openapi/atlas.openapi.json. Do not edit.
from __future__ import annotations
from dataclasses import dataclass
from typing import Any, Generic, Literal, TypeAlias, TypeVar, TypedDict
from typing_extensions import NotRequired
from urllib.parse import quote
import asyncio
import httpx
import os
import time
import uuid
from .webhooks import verify_webhook_signature, WebhookVerifyResult

JsonValue: TypeAlias = None | bool | float | str | list["JsonValue"] | dict[str, "JsonValue"]
ExecutionResultArtifactIrContentGraphNodesValueProvenance = TypedDict("ExecutionResultArtifactIrContentGraphNodesValueProvenance", {"selector": str, "tag": str})

ExecutionResultArtifactIrContentGraphNodesValue = TypedDict("ExecutionResultArtifactIrContentGraphNodesValue", {"attributes": NotRequired[dict[str, str]], "children": list[str], "chunkBoundary": NotRequired[bool], "content": NotRequired[str], "contentHash": NotRequired[str], "id": str, "language": NotRequired[str], "level": NotRequired[float], "parent": str, "provenance": NotRequired[ExecutionResultArtifactIrContentGraphNodesValueProvenance], "semanticRole": NotRequired[str], "type": Literal["section", "heading", "paragraph", "list", "list-item", "table", "table-row", "table-cell", "code", "code-inline", "text", "metadata", "link", "image", "strong", "emphasis", "nav", "separator", "button", "search-input", "blockquote", "figure", "caption", "math", "definition-list", "definition-term", "definition-desc"]})

ExecutionResultArtifactIrContentGraph = TypedDict("ExecutionResultArtifactIrContentGraph", {"nodes": dict[str, ExecutionResultArtifactIrContentGraphNodesValue], "readingOrder": list[str]})

ExecutionResultArtifactIrMetadata = TypedDict("ExecutionResultArtifactIrMetadata", {"author": NotRequired[str], "canonicalUrl": str, "description": NotRequired[str], "documentHash": NotRequired[str], "extractionConfidence": NotRequired[float], "language": NotRequired[str], "publishedDate": NotRequired[str | None], "title": str})

ExecutionResultArtifactIr = TypedDict("ExecutionResultArtifactIr", {"contentGraph": ExecutionResultArtifactIrContentGraph, "metadata": ExecutionResultArtifactIrMetadata, "version": str})

ExecutionResultArtifactMetadata = TypedDict("ExecutionResultArtifactMetadata", {"author": NotRequired[str], "canonicalUrl": str, "description": NotRequired[str], "documentHash": NotRequired[str], "extractionConfidence": NotRequired[float], "language": NotRequired[str], "publishedDate": NotRequired[str | None], "title": str})

ExecutionResultArtifact = TypedDict("ExecutionResultArtifact", {"completedAt": str, "id": str, "ir": ExecutionResultArtifactIr | None, "markdown": str | None, "metadata": ExecutionResultArtifactMetadata | None, "url": str | None})

HealthResponse = TypedDict("HealthResponse", {"service": Literal["atlas-backend"], "status": Literal["ok"], "version": Literal["1"]})

PlanLimit = TypedDict("PlanLimit", {"key": str, "unit": str, "value": float | None})

PlanCatalogEntry = TypedDict("PlanCatalogEntry", {"annualAmountCents": int | None, "code": str, "currency": str, "features": list[str], "highlightBadge": NotRequired[str | None], "includedCredits": int, "limits": list[PlanLimit], "marketingBlurb": str, "monthlyAmountCents": int | None, "version": int})

ProblemInvalidParamsItem = TypedDict("ProblemInvalidParamsItem", {"name": str, "reason": str})

Problem = TypedDict("Problem", {"code": str, "detail": str, "documentationUrl": NotRequired[str], "instance": str, "invalidParams": NotRequired[list[ProblemInvalidParamsItem]], "requestId": str, "resourceId": NotRequired[str], "retryable": bool, "status": int, "title": str, "type": str})

GetHealthParameters = TypedDict("GetHealthParameters", {})

CreateBatchParameters = TypedDict("CreateBatchParameters", {"idempotency-key": NotRequired[str]})

CreateBatchRequestCache = TypedDict("CreateBatchRequestCache", {"cacheOnly": NotRequired[bool], "forceFresh": NotRequired[bool], "maxAgeSeconds": NotRequired[int]})

CreateBatchRequestWebhookOption1 = TypedDict("CreateBatchRequestWebhookOption1", {})

CreateBatchRequestWebhookOption2 = TypedDict("CreateBatchRequestWebhookOption2", {"events": NotRequired[list[Literal["job.ready", "job.failed", "job.cancelled", "crawl.page_completed"]]], "metadata": NotRequired[dict[str, str]], "url": str})

CreateBatchRequestWebhookOption3 = TypedDict("CreateBatchRequestWebhookOption3", {"endpointId": str})

CreateBatchRequest = TypedDict("CreateBatchRequest", {"cache": NotRequired[CreateBatchRequestCache], "formats": NotRequired[list[Literal["markdown", "links", "ir"]]], "metadata": NotRequired[dict[str, str]], "projectId": NotRequired[str], "urls": list[str], "webhook": NotRequired[CreateBatchRequestWebhookOption1 | CreateBatchRequestWebhookOption2 | CreateBatchRequestWebhookOption3]})

CreateBatchResponse202Progress = TypedDict("CreateBatchResponse202Progress", {"completedItems": int, "etaSeconds": int | None, "failedItems": int, "queuedItems": int, "ratePerMinute": int | None})

CreateBatchResponse202 = TypedDict("CreateBatchResponse202", {"artifactExpiresAt": str | None, "artifactState": Literal["not_applicable", "pending", "ingesting", "complete", "expired", "review"], "cancellationRequestedAt": str | None, "createdAt": str, "executionTerminalAt": str | None, "id": str, "kind": Literal["compile", "crawl", "batch"], "progress": CreateBatchResponse202Progress | None, "projectId": str | None, "readyAt": str | None, "reviewReason": str | None, "status": Literal["queued", "running", "ingesting", "ready", "failed", "cancelled"], "targetUrl": NotRequired[str | None], "updatedAt": str, "workspaceId": str})

GetWorkspaceBootstrapParameters = TypedDict("GetWorkspaceBootstrapParameters", {})

GetWorkspaceBootstrapResponse200OnboardingHints = TypedDict("GetWorkspaceBootstrapResponse200OnboardingHints", {"hasCreatedDefaultKey": bool})

GetWorkspaceBootstrapResponse200User = TypedDict("GetWorkspaceBootstrapResponse200User", {"id": str})

GetWorkspaceBootstrapResponse200WorkspaceDefaultProject = TypedDict("GetWorkspaceBootstrapResponse200WorkspaceDefaultProject", {"id": str, "name": str, "slug": str})

GetWorkspaceBootstrapResponse200WorkspacePlanSnapshotFeaturesItem = TypedDict("GetWorkspaceBootstrapResponse200WorkspacePlanSnapshotFeaturesItem", {"enabled": bool, "key": str})

GetWorkspaceBootstrapResponse200WorkspacePlanSnapshotLimitsItem = TypedDict("GetWorkspaceBootstrapResponse200WorkspacePlanSnapshotLimitsItem", {"key": str, "unit": str, "value": int | None})

GetWorkspaceBootstrapResponse200WorkspacePlanSnapshotPlan = TypedDict("GetWorkspaceBootstrapResponse200WorkspacePlanSnapshotPlan", {"code": str, "version": int})

GetWorkspaceBootstrapResponse200WorkspacePlanSnapshot = TypedDict("GetWorkspaceBootstrapResponse200WorkspacePlanSnapshot", {"features": list[GetWorkspaceBootstrapResponse200WorkspacePlanSnapshotFeaturesItem], "id": str, "limits": list[GetWorkspaceBootstrapResponse200WorkspacePlanSnapshotLimitsItem], "plan": GetWorkspaceBootstrapResponse200WorkspacePlanSnapshotPlan, "schemaVersion": Literal[1], "snapshotVersion": int})

GetWorkspaceBootstrapResponse200Workspace = TypedDict("GetWorkspaceBootstrapResponse200Workspace", {"createdAt": str, "defaultProject": GetWorkspaceBootstrapResponse200WorkspaceDefaultProject | None, "id": str, "isPrimary": bool, "name": str, "planSnapshot": GetWorkspaceBootstrapResponse200WorkspacePlanSnapshot, "role": Literal["owner", "admin", "developer", "viewer"], "slug": str, "status": Literal["active", "suspended", "deleting"], "updatedAt": str, "version": int})

GetWorkspaceBootstrapResponse200 = TypedDict("GetWorkspaceBootstrapResponse200", {"contractVersion": Literal["phase1-workspace-v1"], "defaultKeySecret": NotRequired[str | None], "onboardingHints": NotRequired[GetWorkspaceBootstrapResponse200OnboardingHints], "user": GetWorkspaceBootstrapResponse200User, "workspace": GetWorkspaceBootstrapResponse200Workspace})

CompileUrlParameters = TypedDict("CompileUrlParameters", {"idempotency-key": str})

CompileUrlRequestCache = TypedDict("CompileUrlRequestCache", {"cacheOnly": NotRequired[bool], "forceFresh": NotRequired[bool], "maxAgeSeconds": NotRequired[int]})

CompileUrlRequest = TypedDict("CompileUrlRequest", {"cache": NotRequired[CompileUrlRequestCache], "projectId": NotRequired[str], "url": str})

CompileUrlResponse200IrContentGraphNodesValueProvenance = TypedDict("CompileUrlResponse200IrContentGraphNodesValueProvenance", {"selector": str, "tag": str})

CompileUrlResponse200IrContentGraphNodesValue = TypedDict("CompileUrlResponse200IrContentGraphNodesValue", {"attributes": NotRequired[dict[str, str]], "children": list[str], "chunkBoundary": NotRequired[bool], "content": NotRequired[str], "contentHash": NotRequired[str], "id": str, "language": NotRequired[str], "level": NotRequired[float], "parent": str, "provenance": NotRequired[CompileUrlResponse200IrContentGraphNodesValueProvenance], "semanticRole": NotRequired[str], "type": Literal["section", "heading", "paragraph", "list", "list-item", "table", "table-row", "table-cell", "code", "code-inline", "text", "metadata", "link", "image", "strong", "emphasis", "nav", "separator", "button", "search-input", "blockquote", "figure", "caption", "math", "definition-list", "definition-term", "definition-desc"]})

CompileUrlResponse200IrContentGraph = TypedDict("CompileUrlResponse200IrContentGraph", {"nodes": dict[str, CompileUrlResponse200IrContentGraphNodesValue], "readingOrder": list[str]})

CompileUrlResponse200IrMetadata = TypedDict("CompileUrlResponse200IrMetadata", {"author": NotRequired[str], "canonicalUrl": str, "description": NotRequired[str], "documentHash": NotRequired[str], "extractionConfidence": NotRequired[float], "language": NotRequired[str], "publishedDate": NotRequired[str | None], "title": str})

CompileUrlResponse200Ir = TypedDict("CompileUrlResponse200Ir", {"contentGraph": CompileUrlResponse200IrContentGraph, "metadata": CompileUrlResponse200IrMetadata, "version": str})

CompileUrlResponse200Metadata = TypedDict("CompileUrlResponse200Metadata", {"author": NotRequired[str], "canonicalUrl": str, "description": NotRequired[str], "documentHash": NotRequired[str], "extractionConfidence": NotRequired[float], "language": NotRequired[str], "publishedDate": NotRequired[str | None], "title": str})

CompileUrlResponse200Usage = TypedDict("CompileUrlResponse200Usage", {"credits": int})

CompileUrlResponse200 = TypedDict("CompileUrlResponse200", {"ir": CompileUrlResponse200Ir, "markdown": str, "metadata": CompileUrlResponse200Metadata, "usage": CompileUrlResponse200Usage})

CompileUrlResponse202Progress = TypedDict("CompileUrlResponse202Progress", {"completedItems": int, "etaSeconds": int | None, "failedItems": int, "queuedItems": int, "ratePerMinute": int | None})

CompileUrlResponse202 = TypedDict("CompileUrlResponse202", {"artifactExpiresAt": str | None, "artifactState": Literal["not_applicable", "pending", "ingesting", "complete", "expired", "review"], "cancellationRequestedAt": str | None, "createdAt": str, "executionTerminalAt": str | None, "id": str, "kind": Literal["compile", "crawl", "batch"], "progress": CompileUrlResponse202Progress | None, "projectId": str | None, "readyAt": str | None, "reviewReason": str | None, "status": Literal["queued", "running", "ingesting", "ready", "failed", "cancelled"], "targetUrl": NotRequired[str | None], "updatedAt": str, "workspaceId": str})

CreateCrawlParameters = TypedDict("CreateCrawlParameters", {"idempotency-key": NotRequired[str]})

CreateCrawlRequestCache = TypedDict("CreateCrawlRequestCache", {"cacheOnly": NotRequired[bool], "forceFresh": NotRequired[bool], "maxAgeSeconds": NotRequired[int]})

CreateCrawlRequestWebhookOption1 = TypedDict("CreateCrawlRequestWebhookOption1", {})

CreateCrawlRequestWebhookOption2 = TypedDict("CreateCrawlRequestWebhookOption2", {"events": NotRequired[list[Literal["job.ready", "job.failed", "job.cancelled", "crawl.page_completed"]]], "metadata": NotRequired[dict[str, str]], "url": str})

CreateCrawlRequestWebhookOption3 = TypedDict("CreateCrawlRequestWebhookOption3", {"endpointId": str})

CreateCrawlRequest = TypedDict("CreateCrawlRequest", {"cache": NotRequired[CreateCrawlRequestCache], "excludePaths": NotRequired[list[str]], "formats": NotRequired[list[Literal["markdown", "links", "ir"]]], "ignoreQueryParameters": NotRequired[bool], "includePaths": NotRequired[list[str]], "includeSubdomains": NotRequired[bool], "maxDepth": NotRequired[int], "maxPages": NotRequired[int], "metadata": NotRequired[dict[str, str]], "projectId": NotRequired[str], "sitemap": NotRequired[Literal["include", "skip", "only"]], "url": str, "webhook": NotRequired[CreateCrawlRequestWebhookOption1 | CreateCrawlRequestWebhookOption2 | CreateCrawlRequestWebhookOption3]})

CreateCrawlResponse202Progress = TypedDict("CreateCrawlResponse202Progress", {"completedItems": int, "etaSeconds": int | None, "failedItems": int, "queuedItems": int, "ratePerMinute": int | None})

CreateCrawlResponse202 = TypedDict("CreateCrawlResponse202", {"artifactExpiresAt": str | None, "artifactState": Literal["not_applicable", "pending", "ingesting", "complete", "expired", "review"], "cancellationRequestedAt": str | None, "createdAt": str, "executionTerminalAt": str | None, "id": str, "kind": Literal["compile", "crawl", "batch"], "progress": CreateCrawlResponse202Progress | None, "projectId": str | None, "readyAt": str | None, "reviewReason": str | None, "status": Literal["queued", "running", "ingesting", "ready", "failed", "cancelled"], "targetUrl": NotRequired[str | None], "updatedAt": str, "workspaceId": str})

AcceptInvitationParameters = TypedDict("AcceptInvitationParameters", {"idempotency-key": str})

AcceptInvitationRequest = TypedDict("AcceptInvitationRequest", {"token": str})

AcceptInvitationResponse200 = TypedDict("AcceptInvitationResponse200", {"createdAt": str, "email": str, "expiresAt": str | None, "id": str, "role": Literal["admin", "developer", "viewer"], "status": Literal["pending", "accepted", "revoked", "expired"], "updatedAt": str})

ListJobsParameters = TypedDict("ListJobsParameters", {"limit": NotRequired[int], "cursor": NotRequired[str], "status": NotRequired[Literal["queued", "running", "ingesting", "ready", "failed", "cancelled"]], "kind": NotRequired[Literal["compile", "crawl", "batch"]], "projectId": NotRequired[str]})

ListJobsResponse200DataItemProgress = TypedDict("ListJobsResponse200DataItemProgress", {"completedItems": int, "etaSeconds": int | None, "failedItems": int, "queuedItems": int, "ratePerMinute": int | None})

ListJobsResponse200DataItem = TypedDict("ListJobsResponse200DataItem", {"artifactExpiresAt": str | None, "artifactState": Literal["not_applicable", "pending", "ingesting", "complete", "expired", "review"], "cancellationRequestedAt": str | None, "createdAt": str, "executionTerminalAt": str | None, "id": str, "kind": Literal["compile", "crawl", "batch"], "progress": ListJobsResponse200DataItemProgress | None, "projectId": str | None, "readyAt": str | None, "reviewReason": str | None, "status": Literal["queued", "running", "ingesting", "ready", "failed", "cancelled"], "targetUrl": NotRequired[str | None], "updatedAt": str, "workspaceId": str})

ListJobsResponse200 = TypedDict("ListJobsResponse200", {"data": list[ListJobsResponse200DataItem], "nextCursor": str | None})

BulkCancelJobsParameters = TypedDict("BulkCancelJobsParameters", {"idempotency-key": str})

BulkCancelJobsRequest = TypedDict("BulkCancelJobsRequest", {"jobIds": NotRequired[list[str]], "projectId": NotRequired[str], "status": NotRequired[list[Literal["queued", "running", "ingesting", "ready", "failed", "cancelled"]]]})

BulkCancelJobsResponse200ResultsItemJobProgress = TypedDict("BulkCancelJobsResponse200ResultsItemJobProgress", {"completedItems": int, "etaSeconds": int | None, "failedItems": int, "queuedItems": int, "ratePerMinute": int | None})

BulkCancelJobsResponse200ResultsItemJob = TypedDict("BulkCancelJobsResponse200ResultsItemJob", {"artifactExpiresAt": str | None, "artifactState": Literal["not_applicable", "pending", "ingesting", "complete", "expired", "review"], "cancellationRequestedAt": str | None, "createdAt": str, "executionTerminalAt": str | None, "id": str, "kind": Literal["compile", "crawl", "batch"], "progress": BulkCancelJobsResponse200ResultsItemJobProgress | None, "projectId": str | None, "readyAt": str | None, "reviewReason": str | None, "status": Literal["queued", "running", "ingesting", "ready", "failed", "cancelled"], "targetUrl": NotRequired[str | None], "updatedAt": str, "workspaceId": str})

BulkCancelJobsResponse200ResultsItem = TypedDict("BulkCancelJobsResponse200ResultsItem", {"job": NotRequired[BulkCancelJobsResponse200ResultsItemJob], "jobId": str, "status": Literal["accepted", "terminal", "not_found"]})

BulkCancelJobsResponse200 = TypedDict("BulkCancelJobsResponse200", {"results": list[BulkCancelJobsResponse200ResultsItem]})

GetJobParameters = TypedDict("GetJobParameters", {"jobId": str})

GetJobResponse200Progress = TypedDict("GetJobResponse200Progress", {"completedItems": int, "etaSeconds": int | None, "failedItems": int, "queuedItems": int, "ratePerMinute": int | None})

GetJobResponse200 = TypedDict("GetJobResponse200", {"artifactExpiresAt": str | None, "artifactState": Literal["not_applicable", "pending", "ingesting", "complete", "expired", "review"], "cancellationRequestedAt": str | None, "createdAt": str, "executionTerminalAt": str | None, "id": str, "kind": Literal["compile", "crawl", "batch"], "progress": GetJobResponse200Progress | None, "projectId": str | None, "readyAt": str | None, "reviewReason": str | None, "status": Literal["queued", "running", "ingesting", "ready", "failed", "cancelled"], "targetUrl": NotRequired[str | None], "updatedAt": str, "workspaceId": str})

CancelJobParameters = TypedDict("CancelJobParameters", {"jobId": str, "idempotency-key": str})

CancelJobResponse202JobProgress = TypedDict("CancelJobResponse202JobProgress", {"completedItems": int, "etaSeconds": int | None, "failedItems": int, "queuedItems": int, "ratePerMinute": int | None})

CancelJobResponse202Job = TypedDict("CancelJobResponse202Job", {"artifactExpiresAt": str | None, "artifactState": Literal["not_applicable", "pending", "ingesting", "complete", "expired", "review"], "cancellationRequestedAt": str | None, "createdAt": str, "executionTerminalAt": str | None, "id": str, "kind": Literal["compile", "crawl", "batch"], "progress": CancelJobResponse202JobProgress | None, "projectId": str | None, "readyAt": str | None, "reviewReason": str | None, "status": Literal["queued", "running", "ingesting", "ready", "failed", "cancelled"], "targetUrl": NotRequired[str | None], "updatedAt": str, "workspaceId": str})

CancelJobResponse202 = TypedDict("CancelJobResponse202", {"accepted": Literal[True], "job": CancelJobResponse202Job, "reason": Literal["cancellation_requested"]})

ListJobErrorsParameters = TypedDict("ListJobErrorsParameters", {"jobId": str, "limit": NotRequired[int], "cursor": NotRequired[str]})

ListJobErrorsResponse200DataItem = TypedDict("ListJobErrorsResponse200DataItem", {"code": str, "detail": str, "id": str, "occurredAt": str, "url": str | None})

ListJobErrorsResponse200 = TypedDict("ListJobErrorsResponse200", {"data": list[ListJobErrorsResponse200DataItem], "nextCursor": str | None})

ListJobResultsParameters = TypedDict("ListJobResultsParameters", {"jobId": str, "limit": NotRequired[int], "cursor": NotRequired[str]})

ListJobResultsResponse200 = TypedDict("ListJobResultsResponse200", {"data": list[ExecutionResultArtifact], "nextCursor": str | None})

MapUrlParameters = TypedDict("MapUrlParameters", {"idempotency-key": NotRequired[str]})

MapUrlRequestCache = TypedDict("MapUrlRequestCache", {"cacheOnly": NotRequired[bool], "forceFresh": NotRequired[bool], "maxAgeSeconds": NotRequired[int]})

MapUrlRequest = TypedDict("MapUrlRequest", {"cache": NotRequired[MapUrlRequestCache], "exhaustive": NotRequired[bool], "ignoreQueryParameters": NotRequired[bool], "includeSubdomains": NotRequired[bool], "limit": NotRequired[int], "projectId": NotRequired[str], "sitemap": NotRequired[Literal["include", "skip", "only"]], "timeout": NotRequired[int], "url": str})

MapUrlResponse200LinksItem = TypedDict("MapUrlResponse200LinksItem", {"confidence": float, "depth": int, "description": str | None, "estimatedContent": str, "incomingLinks": int, "lastModified": str | None, "parentUrl": NotRequired[str | None], "priority": float, "recommended": bool, "sources": list[Literal["sitemap", "homepage", "navigation", "rss", "manifest"]], "title": str | None, "url": str})

MapUrlResponse200Summary = TypedDict("MapUrlResponse200Summary", {"discoveryConfidence": float, "estimatedCompileTime": str, "estimatedPages": int, "estimatedTokens": str, "framework": str | None, "language": str, "recommendedDepth": int, "recommendedEntryPoint": str, "sitemapCoverage": float, "websiteType": str})

MapUrlResponse200Usage = TypedDict("MapUrlResponse200Usage", {"credits": int})

MapUrlResponse200 = TypedDict("MapUrlResponse200", {"links": list[MapUrlResponse200LinksItem], "success": bool, "summary": MapUrlResponse200Summary, "usage": MapUrlResponse200Usage})

GetCurrentUserParameters = TypedDict("GetCurrentUserParameters", {})

GetCurrentUserResponse200 = TypedDict("GetCurrentUserResponse200", {"createdAt": str, "displayName": str | None, "email": str | None, "id": str, "updatedAt": str})

ListPlansParameters = TypedDict("ListPlansParameters", {})

ScrapeUrlParameters = TypedDict("ScrapeUrlParameters", {"idempotency-key": NotRequired[str]})

ScrapeUrlRequestCache = TypedDict("ScrapeUrlRequestCache", {"cacheOnly": NotRequired[bool], "forceFresh": NotRequired[bool], "maxAgeSeconds": NotRequired[int]})

ScrapeUrlRequest = TypedDict("ScrapeUrlRequest", {"cache": NotRequired[ScrapeUrlRequestCache], "formats": NotRequired[list[Literal["markdown", "links", "ir"]]], "projectId": NotRequired[str], "url": str})

ScrapeUrlResponse200DataIrContentGraphNodesValueProvenance = TypedDict("ScrapeUrlResponse200DataIrContentGraphNodesValueProvenance", {"selector": str, "tag": str})

ScrapeUrlResponse200DataIrContentGraphNodesValue = TypedDict("ScrapeUrlResponse200DataIrContentGraphNodesValue", {"attributes": NotRequired[dict[str, str]], "children": list[str], "chunkBoundary": NotRequired[bool], "content": NotRequired[str], "contentHash": NotRequired[str], "id": str, "language": NotRequired[str], "level": NotRequired[float], "parent": str, "provenance": NotRequired[ScrapeUrlResponse200DataIrContentGraphNodesValueProvenance], "semanticRole": NotRequired[str], "type": Literal["section", "heading", "paragraph", "list", "list-item", "table", "table-row", "table-cell", "code", "code-inline", "text", "metadata", "link", "image", "strong", "emphasis", "nav", "separator", "button", "search-input", "blockquote", "figure", "caption", "math", "definition-list", "definition-term", "definition-desc"]})

ScrapeUrlResponse200DataIrContentGraph = TypedDict("ScrapeUrlResponse200DataIrContentGraph", {"nodes": dict[str, ScrapeUrlResponse200DataIrContentGraphNodesValue], "readingOrder": list[str]})

ScrapeUrlResponse200DataIrMetadata = TypedDict("ScrapeUrlResponse200DataIrMetadata", {"author": NotRequired[str], "canonicalUrl": str, "description": NotRequired[str], "documentHash": NotRequired[str], "extractionConfidence": NotRequired[float], "language": NotRequired[str], "publishedDate": NotRequired[str | None], "title": str})

ScrapeUrlResponse200DataIr = TypedDict("ScrapeUrlResponse200DataIr", {"contentGraph": ScrapeUrlResponse200DataIrContentGraph, "metadata": ScrapeUrlResponse200DataIrMetadata, "version": str})

ScrapeUrlResponse200Data = TypedDict("ScrapeUrlResponse200Data", {"ir": NotRequired[ScrapeUrlResponse200DataIr], "links": NotRequired[list[str]], "markdown": NotRequired[str]})

ScrapeUrlResponse200Metadata = TypedDict("ScrapeUrlResponse200Metadata", {"author": NotRequired[str], "canonicalUrl": str, "description": NotRequired[str], "documentHash": NotRequired[str], "extractionConfidence": NotRequired[float], "language": NotRequired[str], "publishedDate": NotRequired[str | None], "title": str})

ScrapeUrlResponse200Usage = TypedDict("ScrapeUrlResponse200Usage", {"credits": int})

ScrapeUrlResponse200 = TypedDict("ScrapeUrlResponse200", {"data": ScrapeUrlResponse200Data, "metadata": ScrapeUrlResponse200Metadata, "usage": ScrapeUrlResponse200Usage})

ListWorkspacesParameters = TypedDict("ListWorkspacesParameters", {"limit": NotRequired[int], "cursor": NotRequired[str]})

ListWorkspacesResponse200DataItemDefaultProject = TypedDict("ListWorkspacesResponse200DataItemDefaultProject", {"id": str, "name": str, "slug": str})

ListWorkspacesResponse200DataItemPlanSnapshotFeaturesItem = TypedDict("ListWorkspacesResponse200DataItemPlanSnapshotFeaturesItem", {"enabled": bool, "key": str})

ListWorkspacesResponse200DataItemPlanSnapshotLimitsItem = TypedDict("ListWorkspacesResponse200DataItemPlanSnapshotLimitsItem", {"key": str, "unit": str, "value": int | None})

ListWorkspacesResponse200DataItemPlanSnapshotPlan = TypedDict("ListWorkspacesResponse200DataItemPlanSnapshotPlan", {"code": str, "version": int})

ListWorkspacesResponse200DataItemPlanSnapshot = TypedDict("ListWorkspacesResponse200DataItemPlanSnapshot", {"features": list[ListWorkspacesResponse200DataItemPlanSnapshotFeaturesItem], "id": str, "limits": list[ListWorkspacesResponse200DataItemPlanSnapshotLimitsItem], "plan": ListWorkspacesResponse200DataItemPlanSnapshotPlan, "schemaVersion": Literal[1], "snapshotVersion": int})

ListWorkspacesResponse200DataItem = TypedDict("ListWorkspacesResponse200DataItem", {"createdAt": str, "defaultProject": ListWorkspacesResponse200DataItemDefaultProject | None, "id": str, "isPrimary": bool, "name": str, "planSnapshot": ListWorkspacesResponse200DataItemPlanSnapshot, "role": Literal["owner", "admin", "developer", "viewer"], "slug": str, "status": Literal["active", "suspended", "deleting"], "updatedAt": str, "version": int})

ListWorkspacesResponse200 = TypedDict("ListWorkspacesResponse200", {"data": list[ListWorkspacesResponse200DataItem], "nextCursor": str | None})

CreateWorkspaceParameters = TypedDict("CreateWorkspaceParameters", {"idempotency-key": str})

CreateWorkspaceRequest = TypedDict("CreateWorkspaceRequest", {"name": str, "slug": str})

CreateWorkspaceResponse201DefaultProject = TypedDict("CreateWorkspaceResponse201DefaultProject", {"id": str, "name": str, "slug": str})

CreateWorkspaceResponse201PlanSnapshotFeaturesItem = TypedDict("CreateWorkspaceResponse201PlanSnapshotFeaturesItem", {"enabled": bool, "key": str})

CreateWorkspaceResponse201PlanSnapshotLimitsItem = TypedDict("CreateWorkspaceResponse201PlanSnapshotLimitsItem", {"key": str, "unit": str, "value": int | None})

CreateWorkspaceResponse201PlanSnapshotPlan = TypedDict("CreateWorkspaceResponse201PlanSnapshotPlan", {"code": str, "version": int})

CreateWorkspaceResponse201PlanSnapshot = TypedDict("CreateWorkspaceResponse201PlanSnapshot", {"features": list[CreateWorkspaceResponse201PlanSnapshotFeaturesItem], "id": str, "limits": list[CreateWorkspaceResponse201PlanSnapshotLimitsItem], "plan": CreateWorkspaceResponse201PlanSnapshotPlan, "schemaVersion": Literal[1], "snapshotVersion": int})

CreateWorkspaceResponse201 = TypedDict("CreateWorkspaceResponse201", {"createdAt": str, "defaultProject": CreateWorkspaceResponse201DefaultProject | None, "id": str, "isPrimary": bool, "name": str, "planSnapshot": CreateWorkspaceResponse201PlanSnapshot, "role": Literal["owner", "admin", "developer", "viewer"], "slug": str, "status": Literal["active", "suspended", "deleting"], "updatedAt": str, "version": int})

ResolveWorkspaceBySlugParameters = TypedDict("ResolveWorkspaceBySlugParameters", {"workspaceSlug": str})

ResolveWorkspaceBySlugResponse200WorkspaceDefaultProject = TypedDict("ResolveWorkspaceBySlugResponse200WorkspaceDefaultProject", {"id": str, "name": str, "slug": str})

ResolveWorkspaceBySlugResponse200WorkspacePlanSnapshotFeaturesItem = TypedDict("ResolveWorkspaceBySlugResponse200WorkspacePlanSnapshotFeaturesItem", {"enabled": bool, "key": str})

ResolveWorkspaceBySlugResponse200WorkspacePlanSnapshotLimitsItem = TypedDict("ResolveWorkspaceBySlugResponse200WorkspacePlanSnapshotLimitsItem", {"key": str, "unit": str, "value": int | None})

ResolveWorkspaceBySlugResponse200WorkspacePlanSnapshotPlan = TypedDict("ResolveWorkspaceBySlugResponse200WorkspacePlanSnapshotPlan", {"code": str, "version": int})

ResolveWorkspaceBySlugResponse200WorkspacePlanSnapshot = TypedDict("ResolveWorkspaceBySlugResponse200WorkspacePlanSnapshot", {"features": list[ResolveWorkspaceBySlugResponse200WorkspacePlanSnapshotFeaturesItem], "id": str, "limits": list[ResolveWorkspaceBySlugResponse200WorkspacePlanSnapshotLimitsItem], "plan": ResolveWorkspaceBySlugResponse200WorkspacePlanSnapshotPlan, "schemaVersion": Literal[1], "snapshotVersion": int})

ResolveWorkspaceBySlugResponse200Workspace = TypedDict("ResolveWorkspaceBySlugResponse200Workspace", {"createdAt": str, "defaultProject": ResolveWorkspaceBySlugResponse200WorkspaceDefaultProject | None, "id": str, "isPrimary": bool, "name": str, "planSnapshot": ResolveWorkspaceBySlugResponse200WorkspacePlanSnapshot, "role": Literal["owner", "admin", "developer", "viewer"], "slug": str, "status": Literal["active", "suspended", "deleting"], "updatedAt": str, "version": int})

ResolveWorkspaceBySlugResponse200 = TypedDict("ResolveWorkspaceBySlugResponse200", {"contractVersion": Literal["phase1-workspace-v1"], "workspace": ResolveWorkspaceBySlugResponse200Workspace})

GetWorkspaceParameters = TypedDict("GetWorkspaceParameters", {"workspaceId": str})

GetWorkspaceResponse200DefaultProject = TypedDict("GetWorkspaceResponse200DefaultProject", {"id": str, "name": str, "slug": str})

GetWorkspaceResponse200PlanSnapshotFeaturesItem = TypedDict("GetWorkspaceResponse200PlanSnapshotFeaturesItem", {"enabled": bool, "key": str})

GetWorkspaceResponse200PlanSnapshotLimitsItem = TypedDict("GetWorkspaceResponse200PlanSnapshotLimitsItem", {"key": str, "unit": str, "value": int | None})

GetWorkspaceResponse200PlanSnapshotPlan = TypedDict("GetWorkspaceResponse200PlanSnapshotPlan", {"code": str, "version": int})

GetWorkspaceResponse200PlanSnapshot = TypedDict("GetWorkspaceResponse200PlanSnapshot", {"features": list[GetWorkspaceResponse200PlanSnapshotFeaturesItem], "id": str, "limits": list[GetWorkspaceResponse200PlanSnapshotLimitsItem], "plan": GetWorkspaceResponse200PlanSnapshotPlan, "schemaVersion": Literal[1], "snapshotVersion": int})

GetWorkspaceResponse200 = TypedDict("GetWorkspaceResponse200", {"createdAt": str, "defaultProject": GetWorkspaceResponse200DefaultProject | None, "id": str, "isPrimary": bool, "name": str, "planSnapshot": GetWorkspaceResponse200PlanSnapshot, "role": Literal["owner", "admin", "developer", "viewer"], "slug": str, "status": Literal["active", "suspended", "deleting"], "updatedAt": str, "version": int})

DeleteWorkspaceParameters = TypedDict("DeleteWorkspaceParameters", {"workspaceId": str, "idempotency-key": str})

DeleteWorkspaceResponse202 = TypedDict("DeleteWorkspaceResponse202", {"completedAt": str | None, "id": str, "requestedAt": str, "stage": Literal["requested", "execution_stopped", "webhooks_disabled", "billing_detached", "artifacts_deleted", "metadata_anonymized_or_deleted", "retention_records_preserved", "completed"], "updatedAt": str, "workspaceId": str})

UpdateWorkspaceParameters = TypedDict("UpdateWorkspaceParameters", {"workspaceId": str, "idempotency-key": str})

UpdateWorkspaceRequest = TypedDict("UpdateWorkspaceRequest", {"name": str})

UpdateWorkspaceResponse200DefaultProject = TypedDict("UpdateWorkspaceResponse200DefaultProject", {"id": str, "name": str, "slug": str})

UpdateWorkspaceResponse200PlanSnapshotFeaturesItem = TypedDict("UpdateWorkspaceResponse200PlanSnapshotFeaturesItem", {"enabled": bool, "key": str})

UpdateWorkspaceResponse200PlanSnapshotLimitsItem = TypedDict("UpdateWorkspaceResponse200PlanSnapshotLimitsItem", {"key": str, "unit": str, "value": int | None})

UpdateWorkspaceResponse200PlanSnapshotPlan = TypedDict("UpdateWorkspaceResponse200PlanSnapshotPlan", {"code": str, "version": int})

UpdateWorkspaceResponse200PlanSnapshot = TypedDict("UpdateWorkspaceResponse200PlanSnapshot", {"features": list[UpdateWorkspaceResponse200PlanSnapshotFeaturesItem], "id": str, "limits": list[UpdateWorkspaceResponse200PlanSnapshotLimitsItem], "plan": UpdateWorkspaceResponse200PlanSnapshotPlan, "schemaVersion": Literal[1], "snapshotVersion": int})

UpdateWorkspaceResponse200 = TypedDict("UpdateWorkspaceResponse200", {"createdAt": str, "defaultProject": UpdateWorkspaceResponse200DefaultProject | None, "id": str, "isPrimary": bool, "name": str, "planSnapshot": UpdateWorkspaceResponse200PlanSnapshot, "role": Literal["owner", "admin", "developer", "viewer"], "slug": str, "status": Literal["active", "suspended", "deleting"], "updatedAt": str, "version": int})

ListApiKeysParameters = TypedDict("ListApiKeysParameters", {"workspaceId": str, "limit": NotRequired[int], "cursor": NotRequired[str]})

ListApiKeysResponse200DataItem = TypedDict("ListApiKeysResponse200DataItem", {"createdAt": str, "deprecatedAt": str | None, "expiresAt": str | None, "fingerprintSuffix": str | None, "id": str, "ipAllowlist": list[str] | None, "kind": NotRequired[Literal["standard", "default", "test"]], "lastUsedAt": str | None, "name": str, "prefix": str, "projectId": str | None, "revokedAt": str | None, "scopes": list[Literal["execute", "jobs:read", "jobs:cancel", "projects:read", "usage:read"]], "workspaceId": str})

ListApiKeysResponse200 = TypedDict("ListApiKeysResponse200", {"data": list[ListApiKeysResponse200DataItem], "nextCursor": str | None})

CreateApiKeyParameters = TypedDict("CreateApiKeyParameters", {"workspaceId": str, "idempotency-key": str})

CreateApiKeyRequest = TypedDict("CreateApiKeyRequest", {"expiresAt": NotRequired[str | None], "ipAllowlist": NotRequired[list[str] | None], "name": str, "projectId": NotRequired[str | None], "scopes": list[Literal["execute", "jobs:read", "jobs:cancel", "projects:read", "usage:read"]]})

CreateApiKeyResponse201 = TypedDict("CreateApiKeyResponse201", {"createdAt": str, "deprecatedAt": str | None, "expiresAt": str | None, "fingerprintSuffix": str | None, "id": str, "ipAllowlist": list[str] | None, "kind": NotRequired[Literal["standard", "default", "test"]], "lastUsedAt": str | None, "name": str, "prefix": str, "projectId": str | None, "revokedAt": str | None, "scopes": list[Literal["execute", "jobs:read", "jobs:cancel", "projects:read", "usage:read"]], "secret": str, "workspaceId": str})

GetApiKeyParameters = TypedDict("GetApiKeyParameters", {"workspaceId": str, "keyId": str})

GetApiKeyResponse200 = TypedDict("GetApiKeyResponse200", {"createdAt": str, "deprecatedAt": str | None, "expiresAt": str | None, "fingerprintSuffix": str | None, "id": str, "ipAllowlist": list[str] | None, "kind": NotRequired[Literal["standard", "default", "test"]], "lastUsedAt": str | None, "name": str, "prefix": str, "projectId": str | None, "revokedAt": str | None, "scopes": list[Literal["execute", "jobs:read", "jobs:cancel", "projects:read", "usage:read"]], "workspaceId": str})

RevokeApiKeyParameters = TypedDict("RevokeApiKeyParameters", {"workspaceId": str, "keyId": str, "idempotency-key": str})

RegenerateApiKeyParameters = TypedDict("RegenerateApiKeyParameters", {"workspaceId": str, "keyId": str, "idempotency-key": str})

RegenerateApiKeyResponse200 = TypedDict("RegenerateApiKeyResponse200", {"createdAt": str, "deprecatedAt": str | None, "expiresAt": str | None, "fingerprintSuffix": str | None, "id": str, "ipAllowlist": list[str] | None, "kind": NotRequired[Literal["standard", "default", "test"]], "lastUsedAt": str | None, "name": str, "prefix": str, "projectId": str | None, "revokedAt": str | None, "scopes": list[Literal["execute", "jobs:read", "jobs:cancel", "projects:read", "usage:read"]], "secret": str, "workspaceId": str})

RollApiKeyParameters = TypedDict("RollApiKeyParameters", {"workspaceId": str, "keyId": str, "idempotency-key": str})

RollApiKeyResponse200 = TypedDict("RollApiKeyResponse200", {"createdAt": str, "deprecatedAt": str | None, "expiresAt": str | None, "fingerprintSuffix": str | None, "id": str, "ipAllowlist": list[str] | None, "kind": NotRequired[Literal["standard", "default", "test"]], "lastUsedAt": str | None, "name": str, "prefix": str, "projectId": str | None, "revokedAt": str | None, "scopes": list[Literal["execute", "jobs:read", "jobs:cancel", "projects:read", "usage:read"]], "secret": str, "workspaceId": str})

RotateApiKeyParameters = TypedDict("RotateApiKeyParameters", {"workspaceId": str, "keyId": str, "idempotency-key": str})

RotateApiKeyResponse200 = TypedDict("RotateApiKeyResponse200", {"createdAt": str, "deprecatedAt": str | None, "expiresAt": str | None, "fingerprintSuffix": str | None, "id": str, "ipAllowlist": list[str] | None, "kind": NotRequired[Literal["standard", "default", "test"]], "lastUsedAt": str | None, "name": str, "prefix": str, "projectId": str | None, "revokedAt": str | None, "scopes": list[Literal["execute", "jobs:read", "jobs:cancel", "projects:read", "usage:read"]], "secret": str, "workspaceId": str})

CreateBillingCheckoutParameters = TypedDict("CreateBillingCheckoutParameters", {"workspaceId": str, "idempotency-key": str})

CreateBillingCheckoutRequest = TypedDict("CreateBillingCheckoutRequest", {"billingCycle": NotRequired[Literal["monthly", "annual"]], "planCode": str})

CreateBillingCheckoutResponse200 = TypedDict("CreateBillingCheckoutResponse200", {"url": str})

ReconcileBillingCheckoutParameters = TypedDict("ReconcileBillingCheckoutParameters", {"workspaceId": str, "idempotency-key": str})

ReconcileBillingCheckoutRequest = TypedDict("ReconcileBillingCheckoutRequest", {"intentId": NotRequired[str], "paymentId": NotRequired[str], "sessionId": NotRequired[str]})

ReconcileBillingCheckoutResponse200 = TypedDict("ReconcileBillingCheckoutResponse200", {"boostCode": NotRequired[str], "planCode": str, "planVersion": int, "reconciled": bool, "status": Literal["active", "pending", "failed", "canceled", "past_due", "succeeded", "paid"], "topupCredits": NotRequired[int], "type": NotRequired[Literal["subscription", "topup"]]})

GetBillingInvoicesParameters = TypedDict("GetBillingInvoicesParameters", {"workspaceId": str})

GetBillingInvoicesResponse200InvoicesItem = TypedDict("GetBillingInvoicesResponse200InvoicesItem", {"amountPaidCents": int, "createdAt": str, "currency": str, "hostedInvoiceUrl": str | None, "id": str, "paidAt": str | None, "periodEnd": str | None, "periodStart": str | None, "providerInvoiceId": str, "status": Literal["paid", "succeeded", "open", "failed", "refunded", "void", "uncollectible"]})

GetBillingInvoicesResponse200 = TypedDict("GetBillingInvoicesResponse200", {"invoices": list[GetBillingInvoicesResponse200InvoicesItem]})

CreateBillingPortalParameters = TypedDict("CreateBillingPortalParameters", {"workspaceId": str, "idempotency-key": str})

CreateBillingPortalResponse200 = TypedDict("CreateBillingPortalResponse200", {"url": str})

PreviewBillingParameters = TypedDict("PreviewBillingParameters", {"workspaceId": str, "idempotency-key": str})

PreviewBillingRequest = TypedDict("PreviewBillingRequest", {"billingCycle": NotRequired[Literal["monthly", "annual"]], "planCode": str})

PreviewBillingResponse200 = TypedDict("PreviewBillingResponse200", {"amountDueNowCents": int, "amountDueNowCurrency": str, "billingCycle": Literal["monthly", "annual"], "creditDelta": int, "effectiveAt": str})

GetBillingSubscriptionParameters = TypedDict("GetBillingSubscriptionParameters", {"workspaceId": str, "sync": NotRequired[Literal["true", "false"]]})

GetBillingSubscriptionResponse200PendingPlan = TypedDict("GetBillingSubscriptionResponse200PendingPlan", {"effectiveAt": str, "planCode": str, "planVersion": int})

GetBillingSubscriptionResponse200 = TypedDict("GetBillingSubscriptionResponse200", {"cancelAtPeriodEnd": bool, "graceExpiresAt": str | None, "pendingPlan": GetBillingSubscriptionResponse200PendingPlan | None, "periodEnd": str | None, "periodStart": str | None, "planCode": str, "planVersion": int, "status": Literal["none", "incomplete", "incomplete_expired", "trialing", "active", "past_due", "canceled", "unpaid", "paused"], "updatedAt": str, "workspaceId": str})

CreateBillingTopupCheckoutParameters = TypedDict("CreateBillingTopupCheckoutParameters", {"workspaceId": str, "idempotency-key": str})

CreateBillingTopupCheckoutRequest = TypedDict("CreateBillingTopupCheckoutRequest", {"boostCode": Literal["5k", "25k", "100k", "500k", "1m"]})

CreateBillingTopupCheckoutResponse200 = TypedDict("CreateBillingTopupCheckoutResponse200", {"url": str})

GetBillingTopupCatalogParameters = TypedDict("GetBillingTopupCatalogParameters", {"workspaceId": str})

GetBillingTopupCatalogResponse200TiersItem = TypedDict("GetBillingTopupCatalogResponse200TiersItem", {"amountCents": int, "boostCode": Literal["5k", "25k", "100k", "500k", "1m"], "costPerCredit": float, "credits": int, "currency": str, "providerProductId": str, "savingsPercent": float})

GetBillingTopupCatalogResponse200 = TypedDict("GetBillingTopupCatalogResponse200", {"activeTopupCredits": int, "earliestExpiresAt": str | None, "eligible": bool, "ineligibleReason": str | None, "tiers": list[GetBillingTopupCatalogResponse200TiersItem], "workspaceId": str})

GetWorkspaceDeletionParameters = TypedDict("GetWorkspaceDeletionParameters", {"workspaceId": str})

GetWorkspaceDeletionResponse200 = TypedDict("GetWorkspaceDeletionResponse200", {"completedAt": str | None, "id": str, "requestedAt": str, "stage": Literal["requested", "execution_stopped", "webhooks_disabled", "billing_detached", "artifacts_deleted", "metadata_anonymized_or_deleted", "retention_records_preserved", "completed"], "updatedAt": str, "workspaceId": str})

ListWorkspaceInvitationsParameters = TypedDict("ListWorkspaceInvitationsParameters", {"workspaceId": str, "limit": NotRequired[int], "cursor": NotRequired[str]})

ListWorkspaceInvitationsResponse200DataItem = TypedDict("ListWorkspaceInvitationsResponse200DataItem", {"createdAt": str, "email": str, "expiresAt": str | None, "id": str, "role": Literal["admin", "developer", "viewer"], "status": Literal["pending", "accepted", "revoked", "expired"], "updatedAt": str})

ListWorkspaceInvitationsResponse200 = TypedDict("ListWorkspaceInvitationsResponse200", {"data": list[ListWorkspaceInvitationsResponse200DataItem], "nextCursor": str | None})

CreateWorkspaceInvitationParameters = TypedDict("CreateWorkspaceInvitationParameters", {"workspaceId": str, "idempotency-key": str})

CreateWorkspaceInvitationRequest = TypedDict("CreateWorkspaceInvitationRequest", {"email": str, "expiresInHours": NotRequired[int | None], "role": Literal["admin", "developer", "viewer"]})

CreateWorkspaceInvitationResponse201 = TypedDict("CreateWorkspaceInvitationResponse201", {"createdAt": str, "email": str, "expiresAt": str | None, "id": str, "role": Literal["admin", "developer", "viewer"], "status": Literal["pending", "accepted", "revoked", "expired"], "token": str, "updatedAt": str})

AcceptWorkspaceInvitationParameters = TypedDict("AcceptWorkspaceInvitationParameters", {"workspaceId": str, "idempotency-key": str})

AcceptWorkspaceInvitationRequest = TypedDict("AcceptWorkspaceInvitationRequest", {"token": str})

AcceptWorkspaceInvitationResponse200 = TypedDict("AcceptWorkspaceInvitationResponse200", {"createdAt": str, "email": str, "expiresAt": str | None, "id": str, "role": Literal["admin", "developer", "viewer"], "status": Literal["pending", "accepted", "revoked", "expired"], "updatedAt": str})

RevokeWorkspaceInvitationParameters = TypedDict("RevokeWorkspaceInvitationParameters", {"workspaceId": str, "invitationId": str, "idempotency-key": str})

LeaveWorkspaceParameters = TypedDict("LeaveWorkspaceParameters", {"workspaceId": str, "idempotency-key": str})

ListWorkspaceMembersParameters = TypedDict("ListWorkspaceMembersParameters", {"workspaceId": str, "limit": NotRequired[int], "cursor": NotRequired[str]})

ListWorkspaceMembersResponse200DataItem = TypedDict("ListWorkspaceMembersResponse200DataItem", {"createdAt": str, "displayName": str | None, "email": str | None, "role": Literal["owner", "admin", "developer", "viewer"], "updatedAt": str, "userId": str})

ListWorkspaceMembersResponse200 = TypedDict("ListWorkspaceMembersResponse200", {"data": list[ListWorkspaceMembersResponse200DataItem], "nextCursor": str | None})

RemoveWorkspaceMemberParameters = TypedDict("RemoveWorkspaceMemberParameters", {"workspaceId": str, "userId": str, "idempotency-key": str})

UpdateWorkspaceMemberParameters = TypedDict("UpdateWorkspaceMemberParameters", {"workspaceId": str, "userId": str, "idempotency-key": str})

UpdateWorkspaceMemberRequest = TypedDict("UpdateWorkspaceMemberRequest", {"role": Literal["admin", "developer", "viewer"]})

UpdateWorkspaceMemberResponse200 = TypedDict("UpdateWorkspaceMemberResponse200", {"createdAt": str, "displayName": str | None, "email": str | None, "role": Literal["owner", "admin", "developer", "viewer"], "updatedAt": str, "userId": str})

TransferWorkspaceOwnershipParameters = TypedDict("TransferWorkspaceOwnershipParameters", {"workspaceId": str, "userId": str, "idempotency-key": str})

TransferWorkspaceOwnershipResponse200 = TypedDict("TransferWorkspaceOwnershipResponse200", {"createdAt": str, "displayName": str | None, "email": str | None, "role": Literal["owner", "admin", "developer", "viewer"], "updatedAt": str, "userId": str})

GetWorkspaceOverviewParameters = TypedDict("GetWorkspaceOverviewParameters", {"workspaceId": str})

GetWorkspaceOverviewResponse200ActiveJobsItemProgress = TypedDict("GetWorkspaceOverviewResponse200ActiveJobsItemProgress", {"completedItems": int, "etaSeconds": int | None, "failedItems": int, "queuedItems": int, "ratePerMinute": int | None})

GetWorkspaceOverviewResponse200ActiveJobsItem = TypedDict("GetWorkspaceOverviewResponse200ActiveJobsItem", {"artifactExpiresAt": str | None, "artifactState": Literal["not_applicable", "pending", "ingesting", "complete", "expired", "review"], "cancellationRequestedAt": str | None, "createdAt": str, "executionTerminalAt": str | None, "id": str, "kind": Literal["compile", "crawl", "batch"], "progress": GetWorkspaceOverviewResponse200ActiveJobsItemProgress | None, "projectId": str | None, "readyAt": str | None, "reviewReason": str | None, "status": Literal["queued", "running", "ingesting", "ready", "failed", "cancelled"], "targetUrl": NotRequired[str | None], "updatedAt": str, "workspaceId": str})

GetWorkspaceOverviewResponse200Counts = TypedDict("GetWorkspaceOverviewResponse200Counts", {"apiKeys": int, "projects": int, "webhooks": int})

GetWorkspaceOverviewResponse200Onboarding = TypedDict("GetWorkspaceOverviewResponse200Onboarding", {"hasConfiguredWebhook": bool, "hasCreatedApiKey": bool, "hasInvitedTeammate": bool, "hasRunCompile": bool})

GetWorkspaceOverviewResponse200Plan = TypedDict("GetWorkspaceOverviewResponse200Plan", {"cancelAtPeriodEnd": bool | None, "code": str, "graceExpiresAt": str | None, "renewalAt": str | None, "status": str | None})

GetWorkspaceOverviewResponse200RecentErrorsItemProgress = TypedDict("GetWorkspaceOverviewResponse200RecentErrorsItemProgress", {"completedItems": int, "etaSeconds": int | None, "failedItems": int, "queuedItems": int, "ratePerMinute": int | None})

GetWorkspaceOverviewResponse200RecentErrorsItem = TypedDict("GetWorkspaceOverviewResponse200RecentErrorsItem", {"artifactExpiresAt": str | None, "artifactState": Literal["not_applicable", "pending", "ingesting", "complete", "expired", "review"], "cancellationRequestedAt": str | None, "createdAt": str, "executionTerminalAt": str | None, "id": str, "kind": Literal["compile", "crawl", "batch"], "progress": GetWorkspaceOverviewResponse200RecentErrorsItemProgress | None, "projectId": str | None, "readyAt": str | None, "reviewReason": str | None, "status": Literal["queued", "running", "ingesting", "ready", "failed", "cancelled"], "targetUrl": NotRequired[str | None], "updatedAt": str, "workspaceId": str})

GetWorkspaceOverviewResponse200RecentJobsItemProgress = TypedDict("GetWorkspaceOverviewResponse200RecentJobsItemProgress", {"completedItems": int, "etaSeconds": int | None, "failedItems": int, "queuedItems": int, "ratePerMinute": int | None})

GetWorkspaceOverviewResponse200RecentJobsItem = TypedDict("GetWorkspaceOverviewResponse200RecentJobsItem", {"artifactExpiresAt": str | None, "artifactState": Literal["not_applicable", "pending", "ingesting", "complete", "expired", "review"], "cancellationRequestedAt": str | None, "createdAt": str, "executionTerminalAt": str | None, "id": str, "kind": Literal["compile", "crawl", "batch"], "progress": GetWorkspaceOverviewResponse200RecentJobsItemProgress | None, "projectId": str | None, "readyAt": str | None, "reviewReason": str | None, "status": Literal["queued", "running", "ingesting", "ready", "failed", "cancelled"], "targetUrl": NotRequired[str | None], "updatedAt": str, "workspaceId": str})

GetWorkspaceOverviewResponse200UsageDailyConsumedItem = TypedDict("GetWorkspaceOverviewResponse200UsageDailyConsumedItem", {"consumed": int, "day": int})

GetWorkspaceOverviewResponse200Usage = TypedDict("GetWorkspaceOverviewResponse200Usage", {"allowance": int, "consumed": int, "dailyConsumed": list[GetWorkspaceOverviewResponse200UsageDailyConsumedItem], "grantCreditsRemaining": int, "periodEnd": str, "periodStart": str, "reserved": int})

GetWorkspaceOverviewResponse200 = TypedDict("GetWorkspaceOverviewResponse200", {"activeJobs": list[GetWorkspaceOverviewResponse200ActiveJobsItem], "counts": GetWorkspaceOverviewResponse200Counts, "onboarding": GetWorkspaceOverviewResponse200Onboarding, "plan": GetWorkspaceOverviewResponse200Plan, "recentErrors": list[GetWorkspaceOverviewResponse200RecentErrorsItem], "recentJobs": list[GetWorkspaceOverviewResponse200RecentJobsItem], "usage": GetWorkspaceOverviewResponse200Usage, "workspaceId": str})

ListProjectsParameters = TypedDict("ListProjectsParameters", {"workspaceId": str, "limit": NotRequired[int], "cursor": NotRequired[str]})

ListProjectsResponse200DataItem = TypedDict("ListProjectsResponse200DataItem", {"createdAt": str, "deletedAt": str | None, "id": str, "name": str, "slug": str, "status": Literal["active", "deleted"], "updatedAt": str, "version": int, "workspaceId": str})

ListProjectsResponse200 = TypedDict("ListProjectsResponse200", {"data": list[ListProjectsResponse200DataItem], "nextCursor": str | None})

CreateProjectParameters = TypedDict("CreateProjectParameters", {"workspaceId": str, "idempotency-key": str})

CreateProjectRequest = TypedDict("CreateProjectRequest", {"name": str, "slug": str})

CreateProjectResponse201 = TypedDict("CreateProjectResponse201", {"createdAt": str, "deletedAt": str | None, "id": str, "name": str, "slug": str, "status": Literal["active", "deleted"], "updatedAt": str, "version": int, "workspaceId": str})

GetProjectsStatsParameters = TypedDict("GetProjectsStatsParameters", {"workspaceId": str})

GetProjectsStatsResponse200Value = TypedDict("GetProjectsStatsResponse200Value", {"activeJobs": int, "creditsConsumed": int, "failedJobs": int, "lastActivityAt": str | None, "totalJobs": int})

GetProjectParameters = TypedDict("GetProjectParameters", {"workspaceId": str, "projectId": str})

GetProjectResponse200 = TypedDict("GetProjectResponse200", {"createdAt": str, "deletedAt": str | None, "id": str, "name": str, "slug": str, "status": Literal["active", "deleted"], "updatedAt": str, "version": int, "workspaceId": str})

DeleteProjectParameters = TypedDict("DeleteProjectParameters", {"workspaceId": str, "projectId": str, "idempotency-key": str})

UpdateProjectParameters = TypedDict("UpdateProjectParameters", {"workspaceId": str, "projectId": str, "idempotency-key": str})

UpdateProjectRequest = TypedDict("UpdateProjectRequest", {"name": NotRequired[str], "slug": NotRequired[str]})

UpdateProjectResponse200 = TypedDict("UpdateProjectResponse200", {"createdAt": str, "deletedAt": str | None, "id": str, "name": str, "slug": str, "status": Literal["active", "deleted"], "updatedAt": str, "version": int, "workspaceId": str})

GetUsageParameters = TypedDict("GetUsageParameters", {"workspaceId": str, "periodStart": NotRequired[str], "projectId": NotRequired[str]})

GetUsageResponse200AccountsItem = TypedDict("GetUsageResponse200AccountsItem", {"allowance": int, "blockReason": str | None, "blockedAt": str | None, "consumed": int, "metric": Literal["credits"], "periodEnd": str, "periodStart": str, "reserved": int, "updatedAt": str})

GetUsageResponse200GrantsItem = TypedDict("GetUsageResponse200GrantsItem", {"consumed": int, "expiresAt": str | None, "id": NotRequired[str], "metric": Literal["credits"], "source": NotRequired[str], "units": int})

GetUsageResponse200Plan = TypedDict("GetUsageResponse200Plan", {"code": str, "version": int})

GetUsageResponse200 = TypedDict("GetUsageResponse200", {"accounts": list[GetUsageResponse200AccountsItem], "grants": list[GetUsageResponse200GrantsItem], "plan": GetUsageResponse200Plan})

ListUsageLedgerParameters = TypedDict("ListUsageLedgerParameters", {"workspaceId": str, "limit": NotRequired[int], "cursor": NotRequired[str], "metric": NotRequired[Literal["credits"]], "projectId": NotRequired[str]})

ListUsageLedgerResponse200DataItem = TypedDict("ListUsageLedgerResponse200DataItem", {"consumedDelta": int, "createdAt": str, "entryType": Literal["reserve", "settle", "release", "adjustment", "credit"], "eventKey": str, "id": str, "metadata": dict[str, JsonValue] | None, "metric": Literal["credits"], "periodStart": str, "reservationId": str | None, "reservedDelta": int, "source": str})

ListUsageLedgerResponse200 = TypedDict("ListUsageLedgerResponse200", {"data": list[ListUsageLedgerResponse200DataItem], "nextCursor": str | None})

ListWorkspaceWebhookDeliveriesParameters = TypedDict("ListWorkspaceWebhookDeliveriesParameters", {"workspaceId": str, "limit": NotRequired[int], "cursor": NotRequired[str], "endpointId": NotRequired[str], "jobId": NotRequired[str], "status": NotRequired[Literal["pending", "retrying", "succeeded", "dead"]]})

ListWorkspaceWebhookDeliveriesResponse200DataItem = TypedDict("ListWorkspaceWebhookDeliveriesResponse200DataItem", {"attemptCount": int, "createdAt": str, "destinationUrl": NotRequired[str], "endpointId": NotRequired[str | None], "eventId": str, "eventType": Literal["job.created", "job.started", "job.ready", "job.failed", "job.cancelled", "job.results_ready", "crawl.page_completed", "api_key.created", "api_key.revoked", "workspace.member.invited", "workspace.member.removed", "billing.subscription.updated", "webhook.test"], "id": str, "jobId": NotRequired[str | None], "lastError": str | None, "lastStatusCode": int | None, "nextAttemptAt": str | None, "responseCompletedAt": str | None, "sourceType": NotRequired[Literal["endpoint", "inline"]], "status": Literal["pending", "retrying", "succeeded", "dead"], "updatedAt": str})

ListWorkspaceWebhookDeliveriesResponse200 = TypedDict("ListWorkspaceWebhookDeliveriesResponse200", {"data": list[ListWorkspaceWebhookDeliveriesResponse200DataItem], "nextCursor": str | None})

GetWorkspaceWebhookDeliveryParameters = TypedDict("GetWorkspaceWebhookDeliveryParameters", {"workspaceId": str, "deliveryId": str})

GetWorkspaceWebhookDeliveryResponse200 = TypedDict("GetWorkspaceWebhookDeliveryResponse200", {"attemptCount": int, "createdAt": str, "destinationUrl": NotRequired[str], "endpointId": NotRequired[str | None], "eventId": str, "eventType": Literal["job.created", "job.started", "job.ready", "job.failed", "job.cancelled", "job.results_ready", "crawl.page_completed", "api_key.created", "api_key.revoked", "workspace.member.invited", "workspace.member.removed", "billing.subscription.updated", "webhook.test"], "id": str, "jobId": NotRequired[str | None], "lastError": str | None, "lastStatusCode": int | None, "nextAttemptAt": str | None, "responseCompletedAt": str | None, "sourceType": NotRequired[Literal["endpoint", "inline"]], "status": Literal["pending", "retrying", "succeeded", "dead"], "updatedAt": str})

ListWorkspaceWebhookDeliveryAttemptsParameters = TypedDict("ListWorkspaceWebhookDeliveryAttemptsParameters", {"workspaceId": str, "deliveryId": str})

ListWorkspaceWebhookDeliveryAttemptsResponse200Item = TypedDict("ListWorkspaceWebhookDeliveryAttemptsResponse200Item", {"attemptNumber": int, "completedAt": str | None, "errorCode": str | None, "outcome": str, "responseExcerpt": str | None, "startedAt": str, "statusCode": int | None})

RedeliverWorkspaceWebhookDeliveryParameters = TypedDict("RedeliverWorkspaceWebhookDeliveryParameters", {"workspaceId": str, "deliveryId": str, "idempotency-key": str})

RedeliverWorkspaceWebhookDeliveryResponse202 = TypedDict("RedeliverWorkspaceWebhookDeliveryResponse202", {"deliveryId": str})

GetWorkspaceWebhookSecretParameters = TypedDict("GetWorkspaceWebhookSecretParameters", {"workspaceId": str})

GetWorkspaceWebhookSecretResponse200 = TypedDict("GetWorkspaceWebhookSecretResponse200", {"secret": str, "version": int})

RotateWorkspaceWebhookSecretParameters = TypedDict("RotateWorkspaceWebhookSecretParameters", {"workspaceId": str, "idempotency-key": str})

RotateWorkspaceWebhookSecretResponse200 = TypedDict("RotateWorkspaceWebhookSecretResponse200", {"gracePeriodSeconds": int, "secret": str, "version": int})

ListWebhookEndpointsParameters = TypedDict("ListWebhookEndpointsParameters", {"workspaceId": str, "limit": NotRequired[int], "cursor": NotRequired[str]})

ListWebhookEndpointsResponse200DataItem = TypedDict("ListWebhookEndpointsResponse200DataItem", {"configVersion": int, "consecutiveFailureCount": NotRequired[int], "createdAt": str, "events": list[Literal["job.created", "job.started", "job.ready", "job.failed", "job.cancelled", "job.results_ready", "crawl.page_completed", "api_key.created", "api_key.revoked", "workspace.member.invited", "workspace.member.removed", "billing.subscription.updated", "webhook.test"]], "id": str, "lastFailureAt": NotRequired[str | None], "lastSuccessAt": NotRequired[str | None], "projectId": NotRequired[str | None], "signingSecretVersion": int, "status": Literal["active", "disabled"], "updatedAt": str, "url": str, "workspaceId": str})

ListWebhookEndpointsResponse200 = TypedDict("ListWebhookEndpointsResponse200", {"data": list[ListWebhookEndpointsResponse200DataItem], "nextCursor": str | None})

CreateWebhookEndpointParameters = TypedDict("CreateWebhookEndpointParameters", {"workspaceId": str, "idempotency-key": str})

CreateWebhookEndpointRequest = TypedDict("CreateWebhookEndpointRequest", {"events": list[Literal["job.created", "job.started", "job.ready", "job.failed", "job.cancelled", "job.results_ready", "crawl.page_completed", "api_key.created", "api_key.revoked", "workspace.member.invited", "workspace.member.removed", "billing.subscription.updated", "webhook.test"]], "projectId": NotRequired[str], "url": str})

CreateWebhookEndpointResponse201 = TypedDict("CreateWebhookEndpointResponse201", {"configVersion": int, "consecutiveFailureCount": NotRequired[int], "createdAt": str, "events": list[Literal["job.created", "job.started", "job.ready", "job.failed", "job.cancelled", "job.results_ready", "crawl.page_completed", "api_key.created", "api_key.revoked", "workspace.member.invited", "workspace.member.removed", "billing.subscription.updated", "webhook.test"]], "id": str, "lastFailureAt": NotRequired[str | None], "lastSuccessAt": NotRequired[str | None], "projectId": NotRequired[str | None], "secret": str, "signingSecretVersion": int, "status": Literal["active", "disabled"], "updatedAt": str, "url": str, "workspaceId": str})

GetWebhookEndpointParameters = TypedDict("GetWebhookEndpointParameters", {"workspaceId": str, "endpointId": str})

GetWebhookEndpointResponse200 = TypedDict("GetWebhookEndpointResponse200", {"configVersion": int, "consecutiveFailureCount": NotRequired[int], "createdAt": str, "events": list[Literal["job.created", "job.started", "job.ready", "job.failed", "job.cancelled", "job.results_ready", "crawl.page_completed", "api_key.created", "api_key.revoked", "workspace.member.invited", "workspace.member.removed", "billing.subscription.updated", "webhook.test"]], "id": str, "lastFailureAt": NotRequired[str | None], "lastSuccessAt": NotRequired[str | None], "projectId": NotRequired[str | None], "signingSecretVersion": int, "status": Literal["active", "disabled"], "updatedAt": str, "url": str, "workspaceId": str})

DeleteWebhookEndpointParameters = TypedDict("DeleteWebhookEndpointParameters", {"workspaceId": str, "endpointId": str, "idempotency-key": str})

UpdateWebhookEndpointParameters = TypedDict("UpdateWebhookEndpointParameters", {"workspaceId": str, "endpointId": str, "idempotency-key": str})

UpdateWebhookEndpointRequestOption1 = TypedDict("UpdateWebhookEndpointRequestOption1", {"configVersion": int, "events": NotRequired[list[Literal["job.created", "job.started", "job.ready", "job.failed", "job.cancelled", "job.results_ready", "crawl.page_completed", "api_key.created", "api_key.revoked", "workspace.member.invited", "workspace.member.removed", "billing.subscription.updated", "webhook.test"]]], "rotateSecret": NotRequired[bool], "status": NotRequired[Literal["active", "disabled"]], "url": str})

UpdateWebhookEndpointRequestOption2 = TypedDict("UpdateWebhookEndpointRequestOption2", {"configVersion": int, "events": list[Literal["job.created", "job.started", "job.ready", "job.failed", "job.cancelled", "job.results_ready", "crawl.page_completed", "api_key.created", "api_key.revoked", "workspace.member.invited", "workspace.member.removed", "billing.subscription.updated", "webhook.test"]], "rotateSecret": NotRequired[bool], "status": NotRequired[Literal["active", "disabled"]], "url": NotRequired[str]})

UpdateWebhookEndpointRequestOption3 = TypedDict("UpdateWebhookEndpointRequestOption3", {"configVersion": int, "events": NotRequired[list[Literal["job.created", "job.started", "job.ready", "job.failed", "job.cancelled", "job.results_ready", "crawl.page_completed", "api_key.created", "api_key.revoked", "workspace.member.invited", "workspace.member.removed", "billing.subscription.updated", "webhook.test"]]], "rotateSecret": NotRequired[bool], "status": Literal["active", "disabled"], "url": NotRequired[str]})

UpdateWebhookEndpointRequestOption4 = TypedDict("UpdateWebhookEndpointRequestOption4", {"configVersion": int, "events": NotRequired[list[Literal["job.created", "job.started", "job.ready", "job.failed", "job.cancelled", "job.results_ready", "crawl.page_completed", "api_key.created", "api_key.revoked", "workspace.member.invited", "workspace.member.removed", "billing.subscription.updated", "webhook.test"]]], "rotateSecret": Literal[True], "status": NotRequired[Literal["active", "disabled"]], "url": NotRequired[str]})

UpdateWebhookEndpointResponse200 = TypedDict("UpdateWebhookEndpointResponse200", {"configVersion": int, "consecutiveFailureCount": NotRequired[int], "createdAt": str, "events": list[Literal["job.created", "job.started", "job.ready", "job.failed", "job.cancelled", "job.results_ready", "crawl.page_completed", "api_key.created", "api_key.revoked", "workspace.member.invited", "workspace.member.removed", "billing.subscription.updated", "webhook.test"]], "id": str, "lastFailureAt": NotRequired[str | None], "lastSuccessAt": NotRequired[str | None], "projectId": NotRequired[str | None], "secret": NotRequired[str], "signingSecretVersion": int, "status": Literal["active", "disabled"], "updatedAt": str, "url": str, "workspaceId": str})

ListWebhookDeliveriesParameters = TypedDict("ListWebhookDeliveriesParameters", {"workspaceId": str, "endpointId": str, "limit": NotRequired[int], "cursor": NotRequired[str]})

ListWebhookDeliveriesResponse200DataItem = TypedDict("ListWebhookDeliveriesResponse200DataItem", {"attemptCount": int, "createdAt": str, "destinationUrl": NotRequired[str], "endpointId": NotRequired[str | None], "eventId": str, "eventType": Literal["job.created", "job.started", "job.ready", "job.failed", "job.cancelled", "job.results_ready", "crawl.page_completed", "api_key.created", "api_key.revoked", "workspace.member.invited", "workspace.member.removed", "billing.subscription.updated", "webhook.test"], "id": str, "jobId": NotRequired[str | None], "lastError": str | None, "lastStatusCode": int | None, "nextAttemptAt": str | None, "responseCompletedAt": str | None, "sourceType": NotRequired[Literal["endpoint", "inline"]], "status": Literal["pending", "retrying", "succeeded", "dead"], "updatedAt": str})

ListWebhookDeliveriesResponse200 = TypedDict("ListWebhookDeliveriesResponse200", {"data": list[ListWebhookDeliveriesResponse200DataItem], "nextCursor": str | None})

RedeliverWebhookDeliveryParameters = TypedDict("RedeliverWebhookDeliveryParameters", {"workspaceId": str, "endpointId": str, "deliveryId": str, "idempotency-key": str})

RedeliverWebhookDeliveryResponse202 = TypedDict("RedeliverWebhookDeliveryResponse202", {"deliveryId": str})

SendWebhookTestEventParameters = TypedDict("SendWebhookTestEventParameters", {"workspaceId": str, "endpointId": str, "idempotency-key": str})

SendWebhookTestEventRequest = TypedDict("SendWebhookTestEventRequest", {"eventType": Literal["job.created", "job.started", "job.ready", "job.failed", "job.cancelled", "job.results_ready", "crawl.page_completed", "api_key.created", "api_key.revoked", "workspace.member.invited", "workspace.member.removed", "billing.subscription.updated", "webhook.test"]})

SendWebhookTestEventResponse202 = TypedDict("SendWebhookTestEventResponse202", {"deliveryId": str, "eventId": str})
PlanCatalog: TypeAlias = list[PlanCatalogEntry]
GetHealthRequest = None
GetHealthResponse = HealthResponse
CreateBatchResponse = CreateBatchResponse202
GetWorkspaceBootstrapRequest = None
GetWorkspaceBootstrapResponse = GetWorkspaceBootstrapResponse200
CompileUrlResponse = CompileUrlResponse200 | CompileUrlResponse202
CreateCrawlResponse = CreateCrawlResponse202
AcceptInvitationResponse = AcceptInvitationResponse200
ListJobsRequest = None
ListJobsResponse = ListJobsResponse200
BulkCancelJobsResponse = BulkCancelJobsResponse200
GetJobRequest = None
GetJobResponse = GetJobResponse200
CancelJobRequest = None
CancelJobResponse = CancelJobResponse202
ListJobErrorsRequest = None
ListJobErrorsResponse = ListJobErrorsResponse200
ListJobResultsRequest = None
ListJobResultsResponse = ListJobResultsResponse200
MapUrlResponse = MapUrlResponse200
GetCurrentUserRequest = None
GetCurrentUserResponse = GetCurrentUserResponse200
ListPlansRequest = None
ListPlansResponse = PlanCatalog
ScrapeUrlResponse = ScrapeUrlResponse200
ListWorkspacesRequest = None
ListWorkspacesResponse = ListWorkspacesResponse200
CreateWorkspaceResponse = CreateWorkspaceResponse201
ResolveWorkspaceBySlugRequest = None
ResolveWorkspaceBySlugResponse = ResolveWorkspaceBySlugResponse200
GetWorkspaceRequest = None
GetWorkspaceResponse = GetWorkspaceResponse200
DeleteWorkspaceRequest = None
DeleteWorkspaceResponse = DeleteWorkspaceResponse202
UpdateWorkspaceResponse = UpdateWorkspaceResponse200
ListApiKeysRequest = None
ListApiKeysResponse = ListApiKeysResponse200
CreateApiKeyResponse = CreateApiKeyResponse201
GetApiKeyRequest = None
GetApiKeyResponse = GetApiKeyResponse200
RevokeApiKeyRequest = None
RevokeApiKeyResponse = None
RegenerateApiKeyRequest = None
RegenerateApiKeyResponse = RegenerateApiKeyResponse200
RollApiKeyRequest = None
RollApiKeyResponse = RollApiKeyResponse200
RotateApiKeyRequest = None
RotateApiKeyResponse = RotateApiKeyResponse200
CreateBillingCheckoutResponse = CreateBillingCheckoutResponse200
ReconcileBillingCheckoutResponse = ReconcileBillingCheckoutResponse200
GetBillingInvoicesRequest = None
GetBillingInvoicesResponse = GetBillingInvoicesResponse200
CreateBillingPortalRequest = None
CreateBillingPortalResponse = CreateBillingPortalResponse200
PreviewBillingResponse = PreviewBillingResponse200
GetBillingSubscriptionRequest = None
GetBillingSubscriptionResponse = GetBillingSubscriptionResponse200
CreateBillingTopupCheckoutResponse = CreateBillingTopupCheckoutResponse200
GetBillingTopupCatalogRequest = None
GetBillingTopupCatalogResponse = GetBillingTopupCatalogResponse200
GetWorkspaceDeletionRequest = None
GetWorkspaceDeletionResponse = GetWorkspaceDeletionResponse200
ListWorkspaceInvitationsRequest = None
ListWorkspaceInvitationsResponse = ListWorkspaceInvitationsResponse200
CreateWorkspaceInvitationResponse = CreateWorkspaceInvitationResponse201
AcceptWorkspaceInvitationResponse = AcceptWorkspaceInvitationResponse200
RevokeWorkspaceInvitationRequest = None
RevokeWorkspaceInvitationResponse = None
LeaveWorkspaceRequest = None
LeaveWorkspaceResponse = None
ListWorkspaceMembersRequest = None
ListWorkspaceMembersResponse = ListWorkspaceMembersResponse200
RemoveWorkspaceMemberRequest = None
RemoveWorkspaceMemberResponse = None
UpdateWorkspaceMemberResponse = UpdateWorkspaceMemberResponse200
TransferWorkspaceOwnershipRequest = None
TransferWorkspaceOwnershipResponse = TransferWorkspaceOwnershipResponse200
GetWorkspaceOverviewRequest = None
GetWorkspaceOverviewResponse = GetWorkspaceOverviewResponse200
ListProjectsRequest = None
ListProjectsResponse = ListProjectsResponse200
CreateProjectResponse = CreateProjectResponse201
GetProjectsStatsRequest = None
GetProjectsStatsResponse = dict[str, GetProjectsStatsResponse200Value]
GetProjectRequest = None
GetProjectResponse = GetProjectResponse200
DeleteProjectRequest = None
DeleteProjectResponse = None
UpdateProjectResponse = UpdateProjectResponse200
GetUsageRequest = None
GetUsageResponse = GetUsageResponse200
ListUsageLedgerRequest = None
ListUsageLedgerResponse = ListUsageLedgerResponse200
ListWorkspaceWebhookDeliveriesRequest = None
ListWorkspaceWebhookDeliveriesResponse = ListWorkspaceWebhookDeliveriesResponse200
GetWorkspaceWebhookDeliveryRequest = None
GetWorkspaceWebhookDeliveryResponse = GetWorkspaceWebhookDeliveryResponse200
ListWorkspaceWebhookDeliveryAttemptsRequest = None
ListWorkspaceWebhookDeliveryAttemptsResponse = list[ListWorkspaceWebhookDeliveryAttemptsResponse200Item]
RedeliverWorkspaceWebhookDeliveryRequest = None
RedeliverWorkspaceWebhookDeliveryResponse = RedeliverWorkspaceWebhookDeliveryResponse202
GetWorkspaceWebhookSecretRequest = None
GetWorkspaceWebhookSecretResponse = GetWorkspaceWebhookSecretResponse200
RotateWorkspaceWebhookSecretRequest = None
RotateWorkspaceWebhookSecretResponse = RotateWorkspaceWebhookSecretResponse200
ListWebhookEndpointsRequest = None
ListWebhookEndpointsResponse = ListWebhookEndpointsResponse200
CreateWebhookEndpointResponse = CreateWebhookEndpointResponse201
GetWebhookEndpointRequest = None
GetWebhookEndpointResponse = GetWebhookEndpointResponse200
DeleteWebhookEndpointRequest = None
DeleteWebhookEndpointResponse = None
UpdateWebhookEndpointRequest = UpdateWebhookEndpointRequestOption1 | UpdateWebhookEndpointRequestOption2 | UpdateWebhookEndpointRequestOption3 | UpdateWebhookEndpointRequestOption4
UpdateWebhookEndpointResponse = UpdateWebhookEndpointResponse200
ListWebhookDeliveriesRequest = None
ListWebhookDeliveriesResponse = ListWebhookDeliveriesResponse200
RedeliverWebhookDeliveryRequest = None
RedeliverWebhookDeliveryResponse = RedeliverWebhookDeliveryResponse202
SendWebhookTestEventResponse = SendWebhookTestEventResponse202
OperationId = Literal["createBatch", "compileUrl", "createCrawl", "listJobs", "bulkCancelJobs", "getJob", "cancelJob", "listJobErrors", "listJobResults", "mapUrl", "scrapeUrl", "getWorkspaceOverview", "listProjects", "getProjectsStats", "getProject", "getUsage", "listUsageLedger"]
OPERATIONS: dict[OperationId, dict[str, Any]] = {
  "createBatch": {
    "method": "POST",
    "path": "/v1/batches",
    "parameters": [
      {
        "name": "idempotency-key",
        "in": "header",
        "required": False
      }
    ]
  },
  "compileUrl": {
    "method": "POST",
    "path": "/v1/compile",
    "parameters": [
      {
        "name": "idempotency-key",
        "in": "header",
        "required": True
      }
    ]
  },
  "createCrawl": {
    "method": "POST",
    "path": "/v1/crawls",
    "parameters": [
      {
        "name": "idempotency-key",
        "in": "header",
        "required": False
      }
    ]
  },
  "listJobs": {
    "method": "GET",
    "path": "/v1/jobs",
    "parameters": [
      {
        "name": "limit",
        "in": "query",
        "required": False
      },
      {
        "name": "cursor",
        "in": "query",
        "required": False
      },
      {
        "name": "status",
        "in": "query",
        "required": False
      },
      {
        "name": "kind",
        "in": "query",
        "required": False
      },
      {
        "name": "projectId",
        "in": "query",
        "required": False
      }
    ]
  },
  "bulkCancelJobs": {
    "method": "POST",
    "path": "/v1/jobs/cancel",
    "parameters": [
      {
        "name": "idempotency-key",
        "in": "header",
        "required": True
      }
    ]
  },
  "getJob": {
    "method": "GET",
    "path": "/v1/jobs/{jobId}",
    "parameters": [
      {
        "name": "jobId",
        "in": "path",
        "required": True
      }
    ]
  },
  "cancelJob": {
    "method": "DELETE",
    "path": "/v1/jobs/{jobId}",
    "parameters": [
      {
        "name": "jobId",
        "in": "path",
        "required": True
      },
      {
        "name": "idempotency-key",
        "in": "header",
        "required": True
      }
    ]
  },
  "listJobErrors": {
    "method": "GET",
    "path": "/v1/jobs/{jobId}/errors",
    "parameters": [
      {
        "name": "jobId",
        "in": "path",
        "required": True
      },
      {
        "name": "limit",
        "in": "query",
        "required": False
      },
      {
        "name": "cursor",
        "in": "query",
        "required": False
      }
    ]
  },
  "listJobResults": {
    "method": "GET",
    "path": "/v1/jobs/{jobId}/results",
    "parameters": [
      {
        "name": "jobId",
        "in": "path",
        "required": True
      },
      {
        "name": "limit",
        "in": "query",
        "required": False
      },
      {
        "name": "cursor",
        "in": "query",
        "required": False
      }
    ]
  },
  "mapUrl": {
    "method": "POST",
    "path": "/v1/map",
    "parameters": [
      {
        "name": "idempotency-key",
        "in": "header",
        "required": False
      }
    ]
  },
  "scrapeUrl": {
    "method": "POST",
    "path": "/v1/scrape",
    "parameters": [
      {
        "name": "idempotency-key",
        "in": "header",
        "required": False
      }
    ]
  },
  "getWorkspaceOverview": {
    "method": "GET",
    "path": "/v1/workspaces/{workspaceId}/overview",
    "parameters": [
      {
        "name": "workspaceId",
        "in": "path",
        "required": True
      }
    ]
  },
  "listProjects": {
    "method": "GET",
    "path": "/v1/workspaces/{workspaceId}/projects",
    "parameters": [
      {
        "name": "workspaceId",
        "in": "path",
        "required": True
      },
      {
        "name": "limit",
        "in": "query",
        "required": False
      },
      {
        "name": "cursor",
        "in": "query",
        "required": False
      }
    ]
  },
  "getProjectsStats": {
    "method": "GET",
    "path": "/v1/workspaces/{workspaceId}/projects-stats",
    "parameters": [
      {
        "name": "workspaceId",
        "in": "path",
        "required": True
      }
    ]
  },
  "getProject": {
    "method": "GET",
    "path": "/v1/workspaces/{workspaceId}/projects/{projectId}",
    "parameters": [
      {
        "name": "workspaceId",
        "in": "path",
        "required": True
      },
      {
        "name": "projectId",
        "in": "path",
        "required": True
      }
    ]
  },
  "getUsage": {
    "method": "GET",
    "path": "/v1/workspaces/{workspaceId}/usage",
    "parameters": [
      {
        "name": "workspaceId",
        "in": "path",
        "required": True
      },
      {
        "name": "periodStart",
        "in": "query",
        "required": False
      },
      {
        "name": "projectId",
        "in": "query",
        "required": False
      }
    ]
  },
  "listUsageLedger": {
    "method": "GET",
    "path": "/v1/workspaces/{workspaceId}/usage/ledger",
    "parameters": [
      {
        "name": "workspaceId",
        "in": "path",
        "required": True
      },
      {
        "name": "limit",
        "in": "query",
        "required": False
      },
      {
        "name": "cursor",
        "in": "query",
        "required": False
      },
      {
        "name": "metric",
        "in": "query",
        "required": False
      },
      {
        "name": "projectId",
        "in": "query",
        "required": False
      }
    ]
  }
}
T = TypeVar('T')
def is_completed(job: dict[str, Any]) -> bool:
    return job.get('status') in ('ready', 'failed', 'cancelled') or job.get('artifactState') == 'review'
@dataclass
class Response(Generic[T]):
    status: int
    value: T
    location: str | None
    retry_after_seconds: int | None
    replayed: bool

    @property
    def data(self) -> Any:
        return self.value.get('data') if isinstance(self.value, dict) else getattr(self.value, 'data', None)

    @property
    def markdown(self) -> Any:
        if isinstance(self.value, dict):
            if 'markdown' in self.value:
                return self.value['markdown']
            if isinstance(self.value.get('data'), dict) and 'markdown' in self.value['data']:
                return self.value['data']['markdown']
        return getattr(self.value, 'markdown', None)

    @property
    def metadata(self) -> Any:
        return self.value.get('metadata') if isinstance(self.value, dict) else getattr(self.value, 'metadata', None)

    @property
    def links(self) -> Any:
        return self.value.get('links') if isinstance(self.value, dict) else getattr(self.value, 'links', None)

class AtlasApiError(Exception):
    def __init__(self, problem: Problem):
        super().__init__(problem.get('detail') or problem.get('title') or 'HTTP request failed')
        self.problem = problem

    @property
    def code(self) -> str:
        return str(self.problem.get('code', ''))

    @property
    def status(self) -> int:
        return int(self.problem.get('status', 0))

    @property
    def request_id(self) -> str:
        return str(self.problem.get('requestId', ''))

    @property
    def retryable(self) -> bool:
        return bool(self.problem.get('retryable', False))

    @property
    def invalid_params(self) -> list[Any] | None:
        return self.problem.get('invalidParams')

    @property
    def detail(self) -> str:
        return str(self.problem.get('detail', ''))

    @property
    def message(self) -> str:
        return str(self)

AtlasError = AtlasApiError

class AtlasClient:
    def __init__(self, api_key: str | None = None, workspace_id: str | None = None, base_url: str | None = None, timeout: float = 30.0):
        if api_key and api_key.startswith("ws_") and (workspace_id is not None or "ATLAS_API_KEY" in os.environ):
            workspace_id, api_key = api_key, workspace_id
        self.api_key = api_key or os.environ.get("ATLAS_API_KEY")
        self.workspace_id = workspace_id or os.environ.get("ATLAS_WORKSPACE_ID")
        resolved_base_url = (base_url or os.environ.get("ATLAS_BASE_URL") or 'https://api.atlas-compiler.com').rstrip('/')
        headers = {'Authorization': f'Bearer {self.api_key}'} if self.api_key else {}
        self.client = httpx.Client(base_url=resolved_base_url, timeout=timeout, headers=headers)
    def __enter__(self): return self
    def __exit__(self, *_): self.close()
    def raw(self, operation_id: OperationId, parameters: dict[str, Any], body: Any = None) -> Response[Any]:
        operation = OPERATIONS[operation_id]; path = operation['path']; query, headers = {}, {}
        for parameter in operation['parameters']:
            value = parameters.get(parameter['name'])
            if value is None:
                if parameter['required']: raise ValueError(f"Missing required parameter {parameter['name']}")
                continue
            if parameter['in'] == 'path': path = path.replace('{' + parameter['name'] + '}', quote(str(value), safe=''))
            elif parameter['in'] == 'query': query[parameter['name']] = value
            elif parameter['in'] == 'header': headers[parameter['name']] = str(value)
        request = {'method': operation['method'], 'url': path, 'params': query, 'headers': headers}
        if body is not None: request['json'] = body
        response = self.client.request(**request)
        try: value = None if response.status_code == 204 else response.json()
        except ValueError: value = None
        if response.is_error:
            problem = value if isinstance(value, dict) and isinstance(value.get('type'), str) and isinstance(value.get('title'), str) and isinstance(value.get('status'), int) and isinstance(value.get('detail'), str) and isinstance(value.get('code'), str) and isinstance(value.get('instance'), str) and isinstance(value.get('requestId'), str) else {'type': 'about:blank', 'title': 'HTTP request failed', 'status': response.status_code, 'detail': response.text or response.reason_phrase, 'code': 'http_error', 'instance': '', 'requestId': ''}
            raise AtlasApiError(problem)
        if response.status_code != 204 and value is None: raise ValueError('Atlas returned a non-JSON success response')
        retry = response.headers.get('retry-after'); return Response(response.status_code, value, response.headers.get('location'), int(retry) if retry else None, response.headers.get('idempotent-replayed') == 'true')
    def compile(self, body: CompileUrlRequest | None = None, idempotency_key: str | None = None, **kwargs: Any) -> Response[CompileUrlResponse]:
        payload = dict(body) if body is not None else kwargs
        key = idempotency_key or str(uuid.uuid4())
        return self.raw('compileUrl', {'idempotency-key': key}, payload)
    def scrape(self, body: ScrapeUrlRequest | None = None, idempotency_key: str | None = None, **kwargs: Any) -> Response[ScrapeUrlResponse]:
        payload = dict(body) if body is not None else kwargs
        params = {'idempotency-key': idempotency_key} if idempotency_key else {}
        return self.raw('scrapeUrl', params, payload)
    def map(self, body: MapUrlRequest | None = None, idempotency_key: str | None = None, **kwargs: Any) -> Response[MapUrlResponse]:
        payload = dict(body) if body is not None else kwargs
        params = {'idempotency-key': idempotency_key} if idempotency_key else {}
        return self.raw('mapUrl', params, payload)
    def create_crawl(self, body: CreateCrawlRequest | None = None, idempotency_key: str | None = None, **kwargs: Any) -> Response[CreateCrawlResponse]:
        payload = dict(body) if body is not None else kwargs
        params = {'idempotency-key': idempotency_key} if idempotency_key else {}
        return self.raw('createCrawl', params, payload)
    def create_batch(self, body: CreateBatchRequest | None = None, idempotency_key: str | None = None, **kwargs: Any) -> Response[CreateBatchResponse]:
        payload = dict(body) if body is not None else kwargs
        params = {'idempotency-key': idempotency_key} if idempotency_key else {}
        return self.raw('createBatch', params, payload)
    def get_job(self, job_id: str) -> Response[GetJobResponse]:
        return self.raw('getJob', {'jobId': job_id})
    def cancel_job(self, job_id: str, idempotency_key: str | None = None) -> Response[CancelJobResponse]:
        key = idempotency_key or str(uuid.uuid4())
        return self.raw('cancelJob', {'jobId': job_id, 'idempotency-key': key})
    def list_jobs(self, cursor: str | None = None, limit: int | None = None, status: str | None = None) -> Response[ListJobsResponse]:
        params = {}
        if cursor: params['cursor'] = cursor
        if limit: params['limit'] = limit
        if status: params['status'] = status
        return self.raw('listJobs', params)
    def bulk_cancel_jobs(self, body: BulkCancelJobsRequest, idempotency_key: str | None = None) -> Response[BulkCancelJobsResponse]:
        key = idempotency_key or str(uuid.uuid4())
        return self.raw('bulkCancelJobs', {'idempotency-key': key}, body)
    def list_job_results(self, job_id: str, cursor: str | None = None, limit: int | None = None) -> Response[ListJobResultsResponse]:
        return self.raw('listJobResults', {'jobId': job_id, 'cursor': cursor, 'limit': limit})
    def list_job_errors(self, job_id: str, cursor: str | None = None, limit: int | None = None) -> Response[ListJobErrorsResponse]:
        return self.raw('listJobErrors', {'jobId': job_id, 'cursor': cursor, 'limit': limit})
    def get_workspace_overview(self, workspace_id: str | None = None) -> Response[GetWorkspaceOverviewResponse]:
        ws_id = workspace_id or self.workspace_id
        if not ws_id: raise ValueError('workspace_id is required')
        return self.raw('getWorkspaceOverview', {'workspaceId': ws_id})
    def list_projects(self, workspace_id: str | None = None, cursor: str | None = None, limit: int | None = None) -> Response[ListProjectsResponse]:
        ws_id = workspace_id or self.workspace_id
        if not ws_id: raise ValueError('workspace_id is required')
        params: dict[str, Any] = {'workspaceId': ws_id}
        if cursor: params['cursor'] = cursor
        if limit: params['limit'] = limit
        return self.raw('listProjects', params)
    def get_project(self, project_id: str, workspace_id: str | None = None) -> Response[GetProjectResponse]:
        ws_id = workspace_id or self.workspace_id
        if not ws_id: raise ValueError('workspace_id is required')
        return self.raw('getProject', {'workspaceId': ws_id, 'projectId': project_id})
    def get_usage(self, workspace_id: str | None = None) -> Response[GetUsageResponse]:
        ws_id = workspace_id or self.workspace_id
        if not ws_id: raise ValueError('workspace_id is required')
        return self.raw('getUsage', {'workspaceId': ws_id})
    def list_usage_ledger(self, workspace_id: str | None = None, cursor: str | None = None, limit: int | None = None) -> Response[ListUsageLedgerResponse]:
        ws_id = workspace_id or self.workspace_id
        if not ws_id: raise ValueError('workspace_id is required')
        params: dict[str, Any] = {'workspaceId': ws_id}
        if cursor: params['cursor'] = cursor
        if limit: params['limit'] = limit
        return self.raw('listUsageLedger', params)
    def wait_for_job(self, job_id: str, interval_seconds: float = 1, max_wait_seconds: float = 60) -> GetJobResponse:
        if interval_seconds <= 0 or max_wait_seconds <= 0: raise ValueError('Polling intervals must be positive')
        deadline = time.monotonic() + max_wait_seconds
        while True:
            result = self.get_job(job_id)
            if is_completed(result.value): return result.value
            remaining = deadline - time.monotonic()
            if remaining <= 0: raise TimeoutError(f'Job {job_id} did not complete within {max_wait_seconds}s')
            time.sleep(min(result.retry_after_seconds or interval_seconds, remaining))
    def close(self): self.client.close()

class AsyncAtlasClient:
    def __init__(self, api_key: str | None = None, workspace_id: str | None = None, base_url: str | None = None, timeout: float = 30.0):
        if api_key and api_key.startswith("ws_") and (workspace_id is not None or "ATLAS_API_KEY" in os.environ):
            workspace_id, api_key = api_key, workspace_id
        self.api_key = api_key or os.environ.get("ATLAS_API_KEY")
        self.workspace_id = workspace_id or os.environ.get("ATLAS_WORKSPACE_ID")
        resolved_base_url = (base_url or os.environ.get("ATLAS_BASE_URL") or 'https://api.atlas-compiler.com').rstrip('/')
        headers = {'Authorization': f'Bearer {self.api_key}'} if self.api_key else {}
        self.client = httpx.AsyncClient(base_url=resolved_base_url, timeout=timeout, headers=headers)
    async def __aenter__(self): return self
    async def __aexit__(self, *_): await self.close()
    async def raw(self, operation_id: OperationId, parameters: dict[str, Any], body: Any = None) -> Response[Any]:
        operation = OPERATIONS[operation_id]; path = operation['path']; query, headers = {}, {}
        for parameter in operation['parameters']:
            value = parameters.get(parameter['name'])
            if value is None:
                if parameter['required']: raise ValueError(f"Missing required parameter {parameter['name']}")
                continue
            if parameter['in'] == 'path': path = path.replace('{' + parameter['name'] + '}', quote(str(value), safe=''))
            elif parameter['in'] == 'query': query[parameter['name']] = value
            elif parameter['in'] == 'header': headers[parameter['name']] = str(value)
        request = {'method': operation['method'], 'url': path, 'params': query, 'headers': headers}
        if body is not None: request['json'] = body
        response = await self.client.request(**request)
        try: value = None if response.status_code == 204 else response.json()
        except ValueError: value = None
        if response.is_error:
            problem = value if isinstance(value, dict) and isinstance(value.get('type'), str) and isinstance(value.get('title'), str) and isinstance(value.get('status'), int) and isinstance(value.get('detail'), str) and isinstance(value.get('code'), str) and isinstance(value.get('instance'), str) and isinstance(value.get('requestId'), str) else {'type': 'about:blank', 'title': 'HTTP request failed', 'status': response.status_code, 'detail': response.text or response.reason_phrase, 'code': 'http_error', 'instance': '', 'requestId': ''}
            raise AtlasApiError(problem)
        if response.status_code != 204 and value is None: raise ValueError('Atlas returned a non-JSON success response')
        retry = response.headers.get('retry-after'); return Response(response.status_code, value, response.headers.get('location'), int(retry) if retry else None, response.headers.get('idempotent-replayed') == 'true')
    async def compile(self, body: CompileUrlRequest | None = None, idempotency_key: str | None = None, **kwargs: Any) -> Response[CompileUrlResponse]:
        payload = dict(body) if body is not None else kwargs
        key = idempotency_key or str(uuid.uuid4())
        return await self.raw('compileUrl', {'idempotency-key': key}, payload)
    async def scrape(self, body: ScrapeUrlRequest | None = None, idempotency_key: str | None = None, **kwargs: Any) -> Response[ScrapeUrlResponse]:
        payload = dict(body) if body is not None else kwargs
        params = {'idempotency-key': idempotency_key} if idempotency_key else {}
        return await self.raw('scrapeUrl', params, payload)
    async def map(self, body: MapUrlRequest | None = None, idempotency_key: str | None = None, **kwargs: Any) -> Response[MapUrlResponse]:
        payload = dict(body) if body is not None else kwargs
        params = {'idempotency-key': idempotency_key} if idempotency_key else {}
        return await self.raw('mapUrl', params, payload)
    async def create_crawl(self, body: CreateCrawlRequest | None = None, idempotency_key: str | None = None, **kwargs: Any) -> Response[CreateCrawlResponse]:
        payload = dict(body) if body is not None else kwargs
        params = {'idempotency-key': idempotency_key} if idempotency_key else {}
        return await self.raw('createCrawl', params, payload)
    async def create_batch(self, body: CreateBatchRequest | None = None, idempotency_key: str | None = None, **kwargs: Any) -> Response[CreateBatchResponse]:
        payload = dict(body) if body is not None else kwargs
        params = {'idempotency-key': idempotency_key} if idempotency_key else {}
        return await self.raw('createBatch', params, payload)
    async def get_job(self, job_id: str) -> Response[GetJobResponse]:
        return await self.raw('getJob', {'jobId': job_id})
    async def cancel_job(self, job_id: str, idempotency_key: str | None = None) -> Response[CancelJobResponse]:
        key = idempotency_key or str(uuid.uuid4())
        return await self.raw('cancelJob', {'jobId': job_id, 'idempotency-key': key})
    async def list_jobs(self, cursor: str | None = None, limit: int | None = None, status: str | None = None) -> Response[ListJobsResponse]:
        params = {}
        if cursor: params['cursor'] = cursor
        if limit: params['limit'] = limit
        if status: params['status'] = status
        return await self.raw('listJobs', params)
    async def bulk_cancel_jobs(self, body: BulkCancelJobsRequest, idempotency_key: str | None = None) -> Response[BulkCancelJobsResponse]:
        key = idempotency_key or str(uuid.uuid4())
        return await self.raw('bulkCancelJobs', {'idempotency-key': key}, body)
    async def list_job_results(self, job_id: str, cursor: str | None = None, limit: int | None = None) -> Response[ListJobResultsResponse]:
        return await self.raw('listJobResults', {'jobId': job_id, 'cursor': cursor, 'limit': limit})
    async def list_job_errors(self, job_id: str, cursor: str | None = None, limit: int | None = None) -> Response[ListJobErrorsResponse]:
        return await self.raw('listJobErrors', {'jobId': job_id, 'cursor': cursor, 'limit': limit})
    async def get_workspace_overview(self, workspace_id: str | None = None) -> Response[GetWorkspaceOverviewResponse]:
        ws_id = workspace_id or self.workspace_id
        if not ws_id: raise ValueError('workspace_id is required')
        return await self.raw('getWorkspaceOverview', {'workspaceId': ws_id})
    async def list_projects(self, workspace_id: str | None = None, cursor: str | None = None, limit: int | None = None) -> Response[ListProjectsResponse]:
        ws_id = workspace_id or self.workspace_id
        if not ws_id: raise ValueError('workspace_id is required')
        params: dict[str, Any] = {'workspaceId': ws_id}
        if cursor: params['cursor'] = cursor
        if limit: params['limit'] = limit
        return await self.raw('listProjects', params)
    async def get_project(self, project_id: str, workspace_id: str | None = None) -> Response[GetProjectResponse]:
        ws_id = workspace_id or self.workspace_id
        if not ws_id: raise ValueError('workspace_id is required')
        return await self.raw('getProject', {'workspaceId': ws_id, 'projectId': project_id})
    async def get_usage(self, workspace_id: str | None = None) -> Response[GetUsageResponse]:
        ws_id = workspace_id or self.workspace_id
        if not ws_id: raise ValueError('workspace_id is required')
        return await self.raw('getUsage', {'workspaceId': ws_id})
    async def list_usage_ledger(self, workspace_id: str | None = None, cursor: str | None = None, limit: int | None = None) -> Response[ListUsageLedgerResponse]:
        ws_id = workspace_id or self.workspace_id
        if not ws_id: raise ValueError('workspace_id is required')
        params: dict[str, Any] = {'workspaceId': ws_id}
        if cursor: params['cursor'] = cursor
        if limit: params['limit'] = limit
        return await self.raw('listUsageLedger', params)
    async def wait_for_job(self, job_id: str, interval_seconds: float = 1, max_wait_seconds: float = 60) -> GetJobResponse:
        if interval_seconds <= 0 or max_wait_seconds <= 0: raise ValueError('Polling intervals must be positive')
        deadline = time.monotonic() + max_wait_seconds
        while True:
            result = await self.get_job(job_id)
            if is_completed(result.value): return result.value
            remaining = deadline - time.monotonic()
            if remaining <= 0: raise TimeoutError(f'Job {job_id} did not complete within {max_wait_seconds}s')
            await asyncio.sleep(min(result.retry_after_seconds or interval_seconds, remaining))
    async def close(self): await self.client.aclose()

SyncAtlasClient = AtlasClient
