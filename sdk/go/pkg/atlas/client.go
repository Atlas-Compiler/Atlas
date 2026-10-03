// Code generated from backend/openapi/atlas.openapi.json. DO NOT EDIT.
package atlas

import (
	"bytes"
	"context"
	"crypto/rand"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"os"
	"strconv"
	"strings"
	"time"
)

type ExecutionResultArtifactIrContentGraphNodesValueType string

const (
	ExecutionResultArtifactIrContentGraphNodesValueTypeSection        ExecutionResultArtifactIrContentGraphNodesValueType = "section"
	ExecutionResultArtifactIrContentGraphNodesValueTypeHeading        ExecutionResultArtifactIrContentGraphNodesValueType = "heading"
	ExecutionResultArtifactIrContentGraphNodesValueTypeParagraph      ExecutionResultArtifactIrContentGraphNodesValueType = "paragraph"
	ExecutionResultArtifactIrContentGraphNodesValueTypeList           ExecutionResultArtifactIrContentGraphNodesValueType = "list"
	ExecutionResultArtifactIrContentGraphNodesValueTypeListItem       ExecutionResultArtifactIrContentGraphNodesValueType = "list-item"
	ExecutionResultArtifactIrContentGraphNodesValueTypeTable          ExecutionResultArtifactIrContentGraphNodesValueType = "table"
	ExecutionResultArtifactIrContentGraphNodesValueTypeTableRow       ExecutionResultArtifactIrContentGraphNodesValueType = "table-row"
	ExecutionResultArtifactIrContentGraphNodesValueTypeTableCell      ExecutionResultArtifactIrContentGraphNodesValueType = "table-cell"
	ExecutionResultArtifactIrContentGraphNodesValueTypeCode           ExecutionResultArtifactIrContentGraphNodesValueType = "code"
	ExecutionResultArtifactIrContentGraphNodesValueTypeCodeInline     ExecutionResultArtifactIrContentGraphNodesValueType = "code-inline"
	ExecutionResultArtifactIrContentGraphNodesValueTypeText           ExecutionResultArtifactIrContentGraphNodesValueType = "text"
	ExecutionResultArtifactIrContentGraphNodesValueTypeMetadata       ExecutionResultArtifactIrContentGraphNodesValueType = "metadata"
	ExecutionResultArtifactIrContentGraphNodesValueTypeLink           ExecutionResultArtifactIrContentGraphNodesValueType = "link"
	ExecutionResultArtifactIrContentGraphNodesValueTypeImage          ExecutionResultArtifactIrContentGraphNodesValueType = "image"
	ExecutionResultArtifactIrContentGraphNodesValueTypeStrong         ExecutionResultArtifactIrContentGraphNodesValueType = "strong"
	ExecutionResultArtifactIrContentGraphNodesValueTypeEmphasis       ExecutionResultArtifactIrContentGraphNodesValueType = "emphasis"
	ExecutionResultArtifactIrContentGraphNodesValueTypeNav            ExecutionResultArtifactIrContentGraphNodesValueType = "nav"
	ExecutionResultArtifactIrContentGraphNodesValueTypeSeparator      ExecutionResultArtifactIrContentGraphNodesValueType = "separator"
	ExecutionResultArtifactIrContentGraphNodesValueTypeButton         ExecutionResultArtifactIrContentGraphNodesValueType = "button"
	ExecutionResultArtifactIrContentGraphNodesValueTypeSearchInput    ExecutionResultArtifactIrContentGraphNodesValueType = "search-input"
	ExecutionResultArtifactIrContentGraphNodesValueTypeBlockquote     ExecutionResultArtifactIrContentGraphNodesValueType = "blockquote"
	ExecutionResultArtifactIrContentGraphNodesValueTypeFigure         ExecutionResultArtifactIrContentGraphNodesValueType = "figure"
	ExecutionResultArtifactIrContentGraphNodesValueTypeCaption        ExecutionResultArtifactIrContentGraphNodesValueType = "caption"
	ExecutionResultArtifactIrContentGraphNodesValueTypeMath           ExecutionResultArtifactIrContentGraphNodesValueType = "math"
	ExecutionResultArtifactIrContentGraphNodesValueTypeDefinitionList ExecutionResultArtifactIrContentGraphNodesValueType = "definition-list"
	ExecutionResultArtifactIrContentGraphNodesValueTypeDefinitionTerm ExecutionResultArtifactIrContentGraphNodesValueType = "definition-term"
	ExecutionResultArtifactIrContentGraphNodesValueTypeDefinitionDesc ExecutionResultArtifactIrContentGraphNodesValueType = "definition-desc"
)

type HealthResponseService string

const (
	HealthResponseServiceAtlasBackend HealthResponseService = "atlas-backend"
)

type HealthResponseStatus string

const (
	HealthResponseStatusOk HealthResponseStatus = "ok"
)

type HealthResponseVersion string

const (
	HealthResponseVersion1 HealthResponseVersion = "1"
)

type CreateBatchRequestFormatsItem string

const (
	CreateBatchRequestFormatsItemMarkdown CreateBatchRequestFormatsItem = "markdown"
	CreateBatchRequestFormatsItemLinks    CreateBatchRequestFormatsItem = "links"
	CreateBatchRequestFormatsItemIr       CreateBatchRequestFormatsItem = "ir"
)

type CreateBatchResponse202ArtifactState string

const (
	CreateBatchResponse202ArtifactStateNotApplicable CreateBatchResponse202ArtifactState = "not_applicable"
	CreateBatchResponse202ArtifactStatePending       CreateBatchResponse202ArtifactState = "pending"
	CreateBatchResponse202ArtifactStateIngesting     CreateBatchResponse202ArtifactState = "ingesting"
	CreateBatchResponse202ArtifactStateComplete      CreateBatchResponse202ArtifactState = "complete"
	CreateBatchResponse202ArtifactStateExpired       CreateBatchResponse202ArtifactState = "expired"
	CreateBatchResponse202ArtifactStateReview        CreateBatchResponse202ArtifactState = "review"
)

type CreateBatchResponse202Kind string

const (
	CreateBatchResponse202KindCompile CreateBatchResponse202Kind = "compile"
	CreateBatchResponse202KindCrawl   CreateBatchResponse202Kind = "crawl"
	CreateBatchResponse202KindBatch   CreateBatchResponse202Kind = "batch"
)

type CreateBatchResponse202Status string

const (
	CreateBatchResponse202StatusQueued    CreateBatchResponse202Status = "queued"
	CreateBatchResponse202StatusRunning   CreateBatchResponse202Status = "running"
	CreateBatchResponse202StatusIngesting CreateBatchResponse202Status = "ingesting"
	CreateBatchResponse202StatusReady     CreateBatchResponse202Status = "ready"
	CreateBatchResponse202StatusFailed    CreateBatchResponse202Status = "failed"
	CreateBatchResponse202StatusCancelled CreateBatchResponse202Status = "cancelled"
)

type GetWorkspaceBootstrapResponse200ContractVersion string

const (
	GetWorkspaceBootstrapResponse200ContractVersionPhase1WorkspaceV1 GetWorkspaceBootstrapResponse200ContractVersion = "phase1-workspace-v1"
)

type GetWorkspaceBootstrapResponse200WorkspaceRole string

const (
	GetWorkspaceBootstrapResponse200WorkspaceRoleOwner     GetWorkspaceBootstrapResponse200WorkspaceRole = "owner"
	GetWorkspaceBootstrapResponse200WorkspaceRoleAdmin     GetWorkspaceBootstrapResponse200WorkspaceRole = "admin"
	GetWorkspaceBootstrapResponse200WorkspaceRoleDeveloper GetWorkspaceBootstrapResponse200WorkspaceRole = "developer"
	GetWorkspaceBootstrapResponse200WorkspaceRoleViewer    GetWorkspaceBootstrapResponse200WorkspaceRole = "viewer"
)

type GetWorkspaceBootstrapResponse200WorkspaceStatus string

const (
	GetWorkspaceBootstrapResponse200WorkspaceStatusActive    GetWorkspaceBootstrapResponse200WorkspaceStatus = "active"
	GetWorkspaceBootstrapResponse200WorkspaceStatusSuspended GetWorkspaceBootstrapResponse200WorkspaceStatus = "suspended"
	GetWorkspaceBootstrapResponse200WorkspaceStatusDeleting  GetWorkspaceBootstrapResponse200WorkspaceStatus = "deleting"
)

type CompileUrlResponse200IrContentGraphNodesValueType string

const (
	CompileUrlResponse200IrContentGraphNodesValueTypeSection        CompileUrlResponse200IrContentGraphNodesValueType = "section"
	CompileUrlResponse200IrContentGraphNodesValueTypeHeading        CompileUrlResponse200IrContentGraphNodesValueType = "heading"
	CompileUrlResponse200IrContentGraphNodesValueTypeParagraph      CompileUrlResponse200IrContentGraphNodesValueType = "paragraph"
	CompileUrlResponse200IrContentGraphNodesValueTypeList           CompileUrlResponse200IrContentGraphNodesValueType = "list"
	CompileUrlResponse200IrContentGraphNodesValueTypeListItem       CompileUrlResponse200IrContentGraphNodesValueType = "list-item"
	CompileUrlResponse200IrContentGraphNodesValueTypeTable          CompileUrlResponse200IrContentGraphNodesValueType = "table"
	CompileUrlResponse200IrContentGraphNodesValueTypeTableRow       CompileUrlResponse200IrContentGraphNodesValueType = "table-row"
	CompileUrlResponse200IrContentGraphNodesValueTypeTableCell      CompileUrlResponse200IrContentGraphNodesValueType = "table-cell"
	CompileUrlResponse200IrContentGraphNodesValueTypeCode           CompileUrlResponse200IrContentGraphNodesValueType = "code"
	CompileUrlResponse200IrContentGraphNodesValueTypeCodeInline     CompileUrlResponse200IrContentGraphNodesValueType = "code-inline"
	CompileUrlResponse200IrContentGraphNodesValueTypeText           CompileUrlResponse200IrContentGraphNodesValueType = "text"
	CompileUrlResponse200IrContentGraphNodesValueTypeMetadata       CompileUrlResponse200IrContentGraphNodesValueType = "metadata"
	CompileUrlResponse200IrContentGraphNodesValueTypeLink           CompileUrlResponse200IrContentGraphNodesValueType = "link"
	CompileUrlResponse200IrContentGraphNodesValueTypeImage          CompileUrlResponse200IrContentGraphNodesValueType = "image"
	CompileUrlResponse200IrContentGraphNodesValueTypeStrong         CompileUrlResponse200IrContentGraphNodesValueType = "strong"
	CompileUrlResponse200IrContentGraphNodesValueTypeEmphasis       CompileUrlResponse200IrContentGraphNodesValueType = "emphasis"
	CompileUrlResponse200IrContentGraphNodesValueTypeNav            CompileUrlResponse200IrContentGraphNodesValueType = "nav"
	CompileUrlResponse200IrContentGraphNodesValueTypeSeparator      CompileUrlResponse200IrContentGraphNodesValueType = "separator"
	CompileUrlResponse200IrContentGraphNodesValueTypeButton         CompileUrlResponse200IrContentGraphNodesValueType = "button"
	CompileUrlResponse200IrContentGraphNodesValueTypeSearchInput    CompileUrlResponse200IrContentGraphNodesValueType = "search-input"
	CompileUrlResponse200IrContentGraphNodesValueTypeBlockquote     CompileUrlResponse200IrContentGraphNodesValueType = "blockquote"
	CompileUrlResponse200IrContentGraphNodesValueTypeFigure         CompileUrlResponse200IrContentGraphNodesValueType = "figure"
	CompileUrlResponse200IrContentGraphNodesValueTypeCaption        CompileUrlResponse200IrContentGraphNodesValueType = "caption"
	CompileUrlResponse200IrContentGraphNodesValueTypeMath           CompileUrlResponse200IrContentGraphNodesValueType = "math"
	CompileUrlResponse200IrContentGraphNodesValueTypeDefinitionList CompileUrlResponse200IrContentGraphNodesValueType = "definition-list"
	CompileUrlResponse200IrContentGraphNodesValueTypeDefinitionTerm CompileUrlResponse200IrContentGraphNodesValueType = "definition-term"
	CompileUrlResponse200IrContentGraphNodesValueTypeDefinitionDesc CompileUrlResponse200IrContentGraphNodesValueType = "definition-desc"
)

type CompileUrlResponse202ArtifactState string

const (
	CompileUrlResponse202ArtifactStateNotApplicable CompileUrlResponse202ArtifactState = "not_applicable"
	CompileUrlResponse202ArtifactStatePending       CompileUrlResponse202ArtifactState = "pending"
	CompileUrlResponse202ArtifactStateIngesting     CompileUrlResponse202ArtifactState = "ingesting"
	CompileUrlResponse202ArtifactStateComplete      CompileUrlResponse202ArtifactState = "complete"
	CompileUrlResponse202ArtifactStateExpired       CompileUrlResponse202ArtifactState = "expired"
	CompileUrlResponse202ArtifactStateReview        CompileUrlResponse202ArtifactState = "review"
)

type CompileUrlResponse202Kind string

const (
	CompileUrlResponse202KindCompile CompileUrlResponse202Kind = "compile"
	CompileUrlResponse202KindCrawl   CompileUrlResponse202Kind = "crawl"
	CompileUrlResponse202KindBatch   CompileUrlResponse202Kind = "batch"
)

type CompileUrlResponse202Status string

const (
	CompileUrlResponse202StatusQueued    CompileUrlResponse202Status = "queued"
	CompileUrlResponse202StatusRunning   CompileUrlResponse202Status = "running"
	CompileUrlResponse202StatusIngesting CompileUrlResponse202Status = "ingesting"
	CompileUrlResponse202StatusReady     CompileUrlResponse202Status = "ready"
	CompileUrlResponse202StatusFailed    CompileUrlResponse202Status = "failed"
	CompileUrlResponse202StatusCancelled CompileUrlResponse202Status = "cancelled"
)

type CreateCrawlRequestFormatsItem string

const (
	CreateCrawlRequestFormatsItemMarkdown CreateCrawlRequestFormatsItem = "markdown"
	CreateCrawlRequestFormatsItemLinks    CreateCrawlRequestFormatsItem = "links"
	CreateCrawlRequestFormatsItemIr       CreateCrawlRequestFormatsItem = "ir"
)

type CreateCrawlRequestSitemap string

const (
	CreateCrawlRequestSitemapInclude CreateCrawlRequestSitemap = "include"
	CreateCrawlRequestSitemapSkip    CreateCrawlRequestSitemap = "skip"
	CreateCrawlRequestSitemapOnly    CreateCrawlRequestSitemap = "only"
)

type CreateCrawlResponse202ArtifactState string

const (
	CreateCrawlResponse202ArtifactStateNotApplicable CreateCrawlResponse202ArtifactState = "not_applicable"
	CreateCrawlResponse202ArtifactStatePending       CreateCrawlResponse202ArtifactState = "pending"
	CreateCrawlResponse202ArtifactStateIngesting     CreateCrawlResponse202ArtifactState = "ingesting"
	CreateCrawlResponse202ArtifactStateComplete      CreateCrawlResponse202ArtifactState = "complete"
	CreateCrawlResponse202ArtifactStateExpired       CreateCrawlResponse202ArtifactState = "expired"
	CreateCrawlResponse202ArtifactStateReview        CreateCrawlResponse202ArtifactState = "review"
)

type CreateCrawlResponse202Kind string

const (
	CreateCrawlResponse202KindCompile CreateCrawlResponse202Kind = "compile"
	CreateCrawlResponse202KindCrawl   CreateCrawlResponse202Kind = "crawl"
	CreateCrawlResponse202KindBatch   CreateCrawlResponse202Kind = "batch"
)

type CreateCrawlResponse202Status string

const (
	CreateCrawlResponse202StatusQueued    CreateCrawlResponse202Status = "queued"
	CreateCrawlResponse202StatusRunning   CreateCrawlResponse202Status = "running"
	CreateCrawlResponse202StatusIngesting CreateCrawlResponse202Status = "ingesting"
	CreateCrawlResponse202StatusReady     CreateCrawlResponse202Status = "ready"
	CreateCrawlResponse202StatusFailed    CreateCrawlResponse202Status = "failed"
	CreateCrawlResponse202StatusCancelled CreateCrawlResponse202Status = "cancelled"
)

type AcceptInvitationResponse200Role string

const (
	AcceptInvitationResponse200RoleAdmin     AcceptInvitationResponse200Role = "admin"
	AcceptInvitationResponse200RoleDeveloper AcceptInvitationResponse200Role = "developer"
	AcceptInvitationResponse200RoleViewer    AcceptInvitationResponse200Role = "viewer"
)

type AcceptInvitationResponse200Status string

const (
	AcceptInvitationResponse200StatusPending  AcceptInvitationResponse200Status = "pending"
	AcceptInvitationResponse200StatusAccepted AcceptInvitationResponse200Status = "accepted"
	AcceptInvitationResponse200StatusRevoked  AcceptInvitationResponse200Status = "revoked"
	AcceptInvitationResponse200StatusExpired  AcceptInvitationResponse200Status = "expired"
)

type ListJobsResponse200DataItemArtifactState string

const (
	ListJobsResponse200DataItemArtifactStateNotApplicable ListJobsResponse200DataItemArtifactState = "not_applicable"
	ListJobsResponse200DataItemArtifactStatePending       ListJobsResponse200DataItemArtifactState = "pending"
	ListJobsResponse200DataItemArtifactStateIngesting     ListJobsResponse200DataItemArtifactState = "ingesting"
	ListJobsResponse200DataItemArtifactStateComplete      ListJobsResponse200DataItemArtifactState = "complete"
	ListJobsResponse200DataItemArtifactStateExpired       ListJobsResponse200DataItemArtifactState = "expired"
	ListJobsResponse200DataItemArtifactStateReview        ListJobsResponse200DataItemArtifactState = "review"
)

type ListJobsResponse200DataItemKind string

const (
	ListJobsResponse200DataItemKindCompile ListJobsResponse200DataItemKind = "compile"
	ListJobsResponse200DataItemKindCrawl   ListJobsResponse200DataItemKind = "crawl"
	ListJobsResponse200DataItemKindBatch   ListJobsResponse200DataItemKind = "batch"
)

type ListJobsResponse200DataItemStatus string

const (
	ListJobsResponse200DataItemStatusQueued    ListJobsResponse200DataItemStatus = "queued"
	ListJobsResponse200DataItemStatusRunning   ListJobsResponse200DataItemStatus = "running"
	ListJobsResponse200DataItemStatusIngesting ListJobsResponse200DataItemStatus = "ingesting"
	ListJobsResponse200DataItemStatusReady     ListJobsResponse200DataItemStatus = "ready"
	ListJobsResponse200DataItemStatusFailed    ListJobsResponse200DataItemStatus = "failed"
	ListJobsResponse200DataItemStatusCancelled ListJobsResponse200DataItemStatus = "cancelled"
)

type BulkCancelJobsRequestStatusItem string

const (
	BulkCancelJobsRequestStatusItemQueued    BulkCancelJobsRequestStatusItem = "queued"
	BulkCancelJobsRequestStatusItemRunning   BulkCancelJobsRequestStatusItem = "running"
	BulkCancelJobsRequestStatusItemIngesting BulkCancelJobsRequestStatusItem = "ingesting"
	BulkCancelJobsRequestStatusItemReady     BulkCancelJobsRequestStatusItem = "ready"
	BulkCancelJobsRequestStatusItemFailed    BulkCancelJobsRequestStatusItem = "failed"
	BulkCancelJobsRequestStatusItemCancelled BulkCancelJobsRequestStatusItem = "cancelled"
)

type BulkCancelJobsResponse200ResultsItemJobArtifactState string

const (
	BulkCancelJobsResponse200ResultsItemJobArtifactStateNotApplicable BulkCancelJobsResponse200ResultsItemJobArtifactState = "not_applicable"
	BulkCancelJobsResponse200ResultsItemJobArtifactStatePending       BulkCancelJobsResponse200ResultsItemJobArtifactState = "pending"
	BulkCancelJobsResponse200ResultsItemJobArtifactStateIngesting     BulkCancelJobsResponse200ResultsItemJobArtifactState = "ingesting"
	BulkCancelJobsResponse200ResultsItemJobArtifactStateComplete      BulkCancelJobsResponse200ResultsItemJobArtifactState = "complete"
	BulkCancelJobsResponse200ResultsItemJobArtifactStateExpired       BulkCancelJobsResponse200ResultsItemJobArtifactState = "expired"
	BulkCancelJobsResponse200ResultsItemJobArtifactStateReview        BulkCancelJobsResponse200ResultsItemJobArtifactState = "review"
)

type BulkCancelJobsResponse200ResultsItemJobKind string

const (
	BulkCancelJobsResponse200ResultsItemJobKindCompile BulkCancelJobsResponse200ResultsItemJobKind = "compile"
	BulkCancelJobsResponse200ResultsItemJobKindCrawl   BulkCancelJobsResponse200ResultsItemJobKind = "crawl"
	BulkCancelJobsResponse200ResultsItemJobKindBatch   BulkCancelJobsResponse200ResultsItemJobKind = "batch"
)

type BulkCancelJobsResponse200ResultsItemJobStatus string

const (
	BulkCancelJobsResponse200ResultsItemJobStatusQueued    BulkCancelJobsResponse200ResultsItemJobStatus = "queued"
	BulkCancelJobsResponse200ResultsItemJobStatusRunning   BulkCancelJobsResponse200ResultsItemJobStatus = "running"
	BulkCancelJobsResponse200ResultsItemJobStatusIngesting BulkCancelJobsResponse200ResultsItemJobStatus = "ingesting"
	BulkCancelJobsResponse200ResultsItemJobStatusReady     BulkCancelJobsResponse200ResultsItemJobStatus = "ready"
	BulkCancelJobsResponse200ResultsItemJobStatusFailed    BulkCancelJobsResponse200ResultsItemJobStatus = "failed"
	BulkCancelJobsResponse200ResultsItemJobStatusCancelled BulkCancelJobsResponse200ResultsItemJobStatus = "cancelled"
)

type BulkCancelJobsResponse200ResultsItemStatus string

const (
	BulkCancelJobsResponse200ResultsItemStatusAccepted BulkCancelJobsResponse200ResultsItemStatus = "accepted"
	BulkCancelJobsResponse200ResultsItemStatusTerminal BulkCancelJobsResponse200ResultsItemStatus = "terminal"
	BulkCancelJobsResponse200ResultsItemStatusNotFound BulkCancelJobsResponse200ResultsItemStatus = "not_found"
)

type GetJobResponse200ArtifactState string

const (
	GetJobResponse200ArtifactStateNotApplicable GetJobResponse200ArtifactState = "not_applicable"
	GetJobResponse200ArtifactStatePending       GetJobResponse200ArtifactState = "pending"
	GetJobResponse200ArtifactStateIngesting     GetJobResponse200ArtifactState = "ingesting"
	GetJobResponse200ArtifactStateComplete      GetJobResponse200ArtifactState = "complete"
	GetJobResponse200ArtifactStateExpired       GetJobResponse200ArtifactState = "expired"
	GetJobResponse200ArtifactStateReview        GetJobResponse200ArtifactState = "review"
)

type GetJobResponse200Kind string

const (
	GetJobResponse200KindCompile GetJobResponse200Kind = "compile"
	GetJobResponse200KindCrawl   GetJobResponse200Kind = "crawl"
	GetJobResponse200KindBatch   GetJobResponse200Kind = "batch"
)

type GetJobResponse200Status string

const (
	GetJobResponse200StatusQueued    GetJobResponse200Status = "queued"
	GetJobResponse200StatusRunning   GetJobResponse200Status = "running"
	GetJobResponse200StatusIngesting GetJobResponse200Status = "ingesting"
	GetJobResponse200StatusReady     GetJobResponse200Status = "ready"
	GetJobResponse200StatusFailed    GetJobResponse200Status = "failed"
	GetJobResponse200StatusCancelled GetJobResponse200Status = "cancelled"
)

type CancelJobResponse202JobArtifactState string

const (
	CancelJobResponse202JobArtifactStateNotApplicable CancelJobResponse202JobArtifactState = "not_applicable"
	CancelJobResponse202JobArtifactStatePending       CancelJobResponse202JobArtifactState = "pending"
	CancelJobResponse202JobArtifactStateIngesting     CancelJobResponse202JobArtifactState = "ingesting"
	CancelJobResponse202JobArtifactStateComplete      CancelJobResponse202JobArtifactState = "complete"
	CancelJobResponse202JobArtifactStateExpired       CancelJobResponse202JobArtifactState = "expired"
	CancelJobResponse202JobArtifactStateReview        CancelJobResponse202JobArtifactState = "review"
)

type CancelJobResponse202JobKind string

const (
	CancelJobResponse202JobKindCompile CancelJobResponse202JobKind = "compile"
	CancelJobResponse202JobKindCrawl   CancelJobResponse202JobKind = "crawl"
	CancelJobResponse202JobKindBatch   CancelJobResponse202JobKind = "batch"
)

type CancelJobResponse202JobStatus string

const (
	CancelJobResponse202JobStatusQueued    CancelJobResponse202JobStatus = "queued"
	CancelJobResponse202JobStatusRunning   CancelJobResponse202JobStatus = "running"
	CancelJobResponse202JobStatusIngesting CancelJobResponse202JobStatus = "ingesting"
	CancelJobResponse202JobStatusReady     CancelJobResponse202JobStatus = "ready"
	CancelJobResponse202JobStatusFailed    CancelJobResponse202JobStatus = "failed"
	CancelJobResponse202JobStatusCancelled CancelJobResponse202JobStatus = "cancelled"
)

type CancelJobResponse202Reason string

const (
	CancelJobResponse202ReasonCancellationRequested CancelJobResponse202Reason = "cancellation_requested"
)

type MapUrlRequestSitemap string

const (
	MapUrlRequestSitemapInclude MapUrlRequestSitemap = "include"
	MapUrlRequestSitemapSkip    MapUrlRequestSitemap = "skip"
	MapUrlRequestSitemapOnly    MapUrlRequestSitemap = "only"
)

type MapUrlResponse200LinksItemSourcesItem string

const (
	MapUrlResponse200LinksItemSourcesItemSitemap    MapUrlResponse200LinksItemSourcesItem = "sitemap"
	MapUrlResponse200LinksItemSourcesItemHomepage   MapUrlResponse200LinksItemSourcesItem = "homepage"
	MapUrlResponse200LinksItemSourcesItemNavigation MapUrlResponse200LinksItemSourcesItem = "navigation"
	MapUrlResponse200LinksItemSourcesItemRss        MapUrlResponse200LinksItemSourcesItem = "rss"
	MapUrlResponse200LinksItemSourcesItemManifest   MapUrlResponse200LinksItemSourcesItem = "manifest"
)

type ScrapeUrlRequestFormatsItem string

const (
	ScrapeUrlRequestFormatsItemMarkdown ScrapeUrlRequestFormatsItem = "markdown"
	ScrapeUrlRequestFormatsItemLinks    ScrapeUrlRequestFormatsItem = "links"
	ScrapeUrlRequestFormatsItemIr       ScrapeUrlRequestFormatsItem = "ir"
)

type ScrapeUrlResponse200DataIrContentGraphNodesValueType string

const (
	ScrapeUrlResponse200DataIrContentGraphNodesValueTypeSection        ScrapeUrlResponse200DataIrContentGraphNodesValueType = "section"
	ScrapeUrlResponse200DataIrContentGraphNodesValueTypeHeading        ScrapeUrlResponse200DataIrContentGraphNodesValueType = "heading"
	ScrapeUrlResponse200DataIrContentGraphNodesValueTypeParagraph      ScrapeUrlResponse200DataIrContentGraphNodesValueType = "paragraph"
	ScrapeUrlResponse200DataIrContentGraphNodesValueTypeList           ScrapeUrlResponse200DataIrContentGraphNodesValueType = "list"
	ScrapeUrlResponse200DataIrContentGraphNodesValueTypeListItem       ScrapeUrlResponse200DataIrContentGraphNodesValueType = "list-item"
	ScrapeUrlResponse200DataIrContentGraphNodesValueTypeTable          ScrapeUrlResponse200DataIrContentGraphNodesValueType = "table"
	ScrapeUrlResponse200DataIrContentGraphNodesValueTypeTableRow       ScrapeUrlResponse200DataIrContentGraphNodesValueType = "table-row"
	ScrapeUrlResponse200DataIrContentGraphNodesValueTypeTableCell      ScrapeUrlResponse200DataIrContentGraphNodesValueType = "table-cell"
	ScrapeUrlResponse200DataIrContentGraphNodesValueTypeCode           ScrapeUrlResponse200DataIrContentGraphNodesValueType = "code"
	ScrapeUrlResponse200DataIrContentGraphNodesValueTypeCodeInline     ScrapeUrlResponse200DataIrContentGraphNodesValueType = "code-inline"
	ScrapeUrlResponse200DataIrContentGraphNodesValueTypeText           ScrapeUrlResponse200DataIrContentGraphNodesValueType = "text"
	ScrapeUrlResponse200DataIrContentGraphNodesValueTypeMetadata       ScrapeUrlResponse200DataIrContentGraphNodesValueType = "metadata"
	ScrapeUrlResponse200DataIrContentGraphNodesValueTypeLink           ScrapeUrlResponse200DataIrContentGraphNodesValueType = "link"
	ScrapeUrlResponse200DataIrContentGraphNodesValueTypeImage          ScrapeUrlResponse200DataIrContentGraphNodesValueType = "image"
	ScrapeUrlResponse200DataIrContentGraphNodesValueTypeStrong         ScrapeUrlResponse200DataIrContentGraphNodesValueType = "strong"
	ScrapeUrlResponse200DataIrContentGraphNodesValueTypeEmphasis       ScrapeUrlResponse200DataIrContentGraphNodesValueType = "emphasis"
	ScrapeUrlResponse200DataIrContentGraphNodesValueTypeNav            ScrapeUrlResponse200DataIrContentGraphNodesValueType = "nav"
	ScrapeUrlResponse200DataIrContentGraphNodesValueTypeSeparator      ScrapeUrlResponse200DataIrContentGraphNodesValueType = "separator"
	ScrapeUrlResponse200DataIrContentGraphNodesValueTypeButton         ScrapeUrlResponse200DataIrContentGraphNodesValueType = "button"
	ScrapeUrlResponse200DataIrContentGraphNodesValueTypeSearchInput    ScrapeUrlResponse200DataIrContentGraphNodesValueType = "search-input"
	ScrapeUrlResponse200DataIrContentGraphNodesValueTypeBlockquote     ScrapeUrlResponse200DataIrContentGraphNodesValueType = "blockquote"
	ScrapeUrlResponse200DataIrContentGraphNodesValueTypeFigure         ScrapeUrlResponse200DataIrContentGraphNodesValueType = "figure"
	ScrapeUrlResponse200DataIrContentGraphNodesValueTypeCaption        ScrapeUrlResponse200DataIrContentGraphNodesValueType = "caption"
	ScrapeUrlResponse200DataIrContentGraphNodesValueTypeMath           ScrapeUrlResponse200DataIrContentGraphNodesValueType = "math"
	ScrapeUrlResponse200DataIrContentGraphNodesValueTypeDefinitionList ScrapeUrlResponse200DataIrContentGraphNodesValueType = "definition-list"
	ScrapeUrlResponse200DataIrContentGraphNodesValueTypeDefinitionTerm ScrapeUrlResponse200DataIrContentGraphNodesValueType = "definition-term"
	ScrapeUrlResponse200DataIrContentGraphNodesValueTypeDefinitionDesc ScrapeUrlResponse200DataIrContentGraphNodesValueType = "definition-desc"
)

type ListWorkspacesResponse200DataItemRole string

const (
	ListWorkspacesResponse200DataItemRoleOwner     ListWorkspacesResponse200DataItemRole = "owner"
	ListWorkspacesResponse200DataItemRoleAdmin     ListWorkspacesResponse200DataItemRole = "admin"
	ListWorkspacesResponse200DataItemRoleDeveloper ListWorkspacesResponse200DataItemRole = "developer"
	ListWorkspacesResponse200DataItemRoleViewer    ListWorkspacesResponse200DataItemRole = "viewer"
)

type ListWorkspacesResponse200DataItemStatus string

const (
	ListWorkspacesResponse200DataItemStatusActive    ListWorkspacesResponse200DataItemStatus = "active"
	ListWorkspacesResponse200DataItemStatusSuspended ListWorkspacesResponse200DataItemStatus = "suspended"
	ListWorkspacesResponse200DataItemStatusDeleting  ListWorkspacesResponse200DataItemStatus = "deleting"
)

type CreateWorkspaceResponse201Role string

const (
	CreateWorkspaceResponse201RoleOwner     CreateWorkspaceResponse201Role = "owner"
	CreateWorkspaceResponse201RoleAdmin     CreateWorkspaceResponse201Role = "admin"
	CreateWorkspaceResponse201RoleDeveloper CreateWorkspaceResponse201Role = "developer"
	CreateWorkspaceResponse201RoleViewer    CreateWorkspaceResponse201Role = "viewer"
)

type CreateWorkspaceResponse201Status string

const (
	CreateWorkspaceResponse201StatusActive    CreateWorkspaceResponse201Status = "active"
	CreateWorkspaceResponse201StatusSuspended CreateWorkspaceResponse201Status = "suspended"
	CreateWorkspaceResponse201StatusDeleting  CreateWorkspaceResponse201Status = "deleting"
)

type ResolveWorkspaceBySlugResponse200ContractVersion string

const (
	ResolveWorkspaceBySlugResponse200ContractVersionPhase1WorkspaceV1 ResolveWorkspaceBySlugResponse200ContractVersion = "phase1-workspace-v1"
)

type ResolveWorkspaceBySlugResponse200WorkspaceRole string

const (
	ResolveWorkspaceBySlugResponse200WorkspaceRoleOwner     ResolveWorkspaceBySlugResponse200WorkspaceRole = "owner"
	ResolveWorkspaceBySlugResponse200WorkspaceRoleAdmin     ResolveWorkspaceBySlugResponse200WorkspaceRole = "admin"
	ResolveWorkspaceBySlugResponse200WorkspaceRoleDeveloper ResolveWorkspaceBySlugResponse200WorkspaceRole = "developer"
	ResolveWorkspaceBySlugResponse200WorkspaceRoleViewer    ResolveWorkspaceBySlugResponse200WorkspaceRole = "viewer"
)

type ResolveWorkspaceBySlugResponse200WorkspaceStatus string

const (
	ResolveWorkspaceBySlugResponse200WorkspaceStatusActive    ResolveWorkspaceBySlugResponse200WorkspaceStatus = "active"
	ResolveWorkspaceBySlugResponse200WorkspaceStatusSuspended ResolveWorkspaceBySlugResponse200WorkspaceStatus = "suspended"
	ResolveWorkspaceBySlugResponse200WorkspaceStatusDeleting  ResolveWorkspaceBySlugResponse200WorkspaceStatus = "deleting"
)

type GetWorkspaceResponse200Role string

const (
	GetWorkspaceResponse200RoleOwner     GetWorkspaceResponse200Role = "owner"
	GetWorkspaceResponse200RoleAdmin     GetWorkspaceResponse200Role = "admin"
	GetWorkspaceResponse200RoleDeveloper GetWorkspaceResponse200Role = "developer"
	GetWorkspaceResponse200RoleViewer    GetWorkspaceResponse200Role = "viewer"
)

type GetWorkspaceResponse200Status string

const (
	GetWorkspaceResponse200StatusActive    GetWorkspaceResponse200Status = "active"
	GetWorkspaceResponse200StatusSuspended GetWorkspaceResponse200Status = "suspended"
	GetWorkspaceResponse200StatusDeleting  GetWorkspaceResponse200Status = "deleting"
)

type DeleteWorkspaceResponse202Stage string

const (
	DeleteWorkspaceResponse202StageRequested                   DeleteWorkspaceResponse202Stage = "requested"
	DeleteWorkspaceResponse202StageExecutionStopped            DeleteWorkspaceResponse202Stage = "execution_stopped"
	DeleteWorkspaceResponse202StageWebhooksDisabled            DeleteWorkspaceResponse202Stage = "webhooks_disabled"
	DeleteWorkspaceResponse202StageBillingDetached             DeleteWorkspaceResponse202Stage = "billing_detached"
	DeleteWorkspaceResponse202StageArtifactsDeleted            DeleteWorkspaceResponse202Stage = "artifacts_deleted"
	DeleteWorkspaceResponse202StageMetadataAnonymizedOrDeleted DeleteWorkspaceResponse202Stage = "metadata_anonymized_or_deleted"
	DeleteWorkspaceResponse202StageRetentionRecordsPreserved   DeleteWorkspaceResponse202Stage = "retention_records_preserved"
	DeleteWorkspaceResponse202StageCompleted                   DeleteWorkspaceResponse202Stage = "completed"
)

type UpdateWorkspaceResponse200Role string

const (
	UpdateWorkspaceResponse200RoleOwner     UpdateWorkspaceResponse200Role = "owner"
	UpdateWorkspaceResponse200RoleAdmin     UpdateWorkspaceResponse200Role = "admin"
	UpdateWorkspaceResponse200RoleDeveloper UpdateWorkspaceResponse200Role = "developer"
	UpdateWorkspaceResponse200RoleViewer    UpdateWorkspaceResponse200Role = "viewer"
)

type UpdateWorkspaceResponse200Status string

const (
	UpdateWorkspaceResponse200StatusActive    UpdateWorkspaceResponse200Status = "active"
	UpdateWorkspaceResponse200StatusSuspended UpdateWorkspaceResponse200Status = "suspended"
	UpdateWorkspaceResponse200StatusDeleting  UpdateWorkspaceResponse200Status = "deleting"
)

type ListApiKeysResponse200DataItemKind string

const (
	ListApiKeysResponse200DataItemKindStandard ListApiKeysResponse200DataItemKind = "standard"
	ListApiKeysResponse200DataItemKindDefault  ListApiKeysResponse200DataItemKind = "default"
	ListApiKeysResponse200DataItemKindTest     ListApiKeysResponse200DataItemKind = "test"
)

type ListApiKeysResponse200DataItemScopesItem string

const (
	ListApiKeysResponse200DataItemScopesItemExecute      ListApiKeysResponse200DataItemScopesItem = "execute"
	ListApiKeysResponse200DataItemScopesItemJobsRead     ListApiKeysResponse200DataItemScopesItem = "jobs:read"
	ListApiKeysResponse200DataItemScopesItemJobsCancel   ListApiKeysResponse200DataItemScopesItem = "jobs:cancel"
	ListApiKeysResponse200DataItemScopesItemProjectsRead ListApiKeysResponse200DataItemScopesItem = "projects:read"
	ListApiKeysResponse200DataItemScopesItemUsageRead    ListApiKeysResponse200DataItemScopesItem = "usage:read"
)

type CreateApiKeyRequestScopesItem string

const (
	CreateApiKeyRequestScopesItemExecute      CreateApiKeyRequestScopesItem = "execute"
	CreateApiKeyRequestScopesItemJobsRead     CreateApiKeyRequestScopesItem = "jobs:read"
	CreateApiKeyRequestScopesItemJobsCancel   CreateApiKeyRequestScopesItem = "jobs:cancel"
	CreateApiKeyRequestScopesItemProjectsRead CreateApiKeyRequestScopesItem = "projects:read"
	CreateApiKeyRequestScopesItemUsageRead    CreateApiKeyRequestScopesItem = "usage:read"
)

type CreateApiKeyResponse201Kind string

const (
	CreateApiKeyResponse201KindStandard CreateApiKeyResponse201Kind = "standard"
	CreateApiKeyResponse201KindDefault  CreateApiKeyResponse201Kind = "default"
	CreateApiKeyResponse201KindTest     CreateApiKeyResponse201Kind = "test"
)

type CreateApiKeyResponse201ScopesItem string

const (
	CreateApiKeyResponse201ScopesItemExecute      CreateApiKeyResponse201ScopesItem = "execute"
	CreateApiKeyResponse201ScopesItemJobsRead     CreateApiKeyResponse201ScopesItem = "jobs:read"
	CreateApiKeyResponse201ScopesItemJobsCancel   CreateApiKeyResponse201ScopesItem = "jobs:cancel"
	CreateApiKeyResponse201ScopesItemProjectsRead CreateApiKeyResponse201ScopesItem = "projects:read"
	CreateApiKeyResponse201ScopesItemUsageRead    CreateApiKeyResponse201ScopesItem = "usage:read"
)

type GetApiKeyResponse200Kind string

const (
	GetApiKeyResponse200KindStandard GetApiKeyResponse200Kind = "standard"
	GetApiKeyResponse200KindDefault  GetApiKeyResponse200Kind = "default"
	GetApiKeyResponse200KindTest     GetApiKeyResponse200Kind = "test"
)

type GetApiKeyResponse200ScopesItem string

const (
	GetApiKeyResponse200ScopesItemExecute      GetApiKeyResponse200ScopesItem = "execute"
	GetApiKeyResponse200ScopesItemJobsRead     GetApiKeyResponse200ScopesItem = "jobs:read"
	GetApiKeyResponse200ScopesItemJobsCancel   GetApiKeyResponse200ScopesItem = "jobs:cancel"
	GetApiKeyResponse200ScopesItemProjectsRead GetApiKeyResponse200ScopesItem = "projects:read"
	GetApiKeyResponse200ScopesItemUsageRead    GetApiKeyResponse200ScopesItem = "usage:read"
)

type RegenerateApiKeyResponse200Kind string

const (
	RegenerateApiKeyResponse200KindStandard RegenerateApiKeyResponse200Kind = "standard"
	RegenerateApiKeyResponse200KindDefault  RegenerateApiKeyResponse200Kind = "default"
	RegenerateApiKeyResponse200KindTest     RegenerateApiKeyResponse200Kind = "test"
)

type RegenerateApiKeyResponse200ScopesItem string

const (
	RegenerateApiKeyResponse200ScopesItemExecute      RegenerateApiKeyResponse200ScopesItem = "execute"
	RegenerateApiKeyResponse200ScopesItemJobsRead     RegenerateApiKeyResponse200ScopesItem = "jobs:read"
	RegenerateApiKeyResponse200ScopesItemJobsCancel   RegenerateApiKeyResponse200ScopesItem = "jobs:cancel"
	RegenerateApiKeyResponse200ScopesItemProjectsRead RegenerateApiKeyResponse200ScopesItem = "projects:read"
	RegenerateApiKeyResponse200ScopesItemUsageRead    RegenerateApiKeyResponse200ScopesItem = "usage:read"
)

type RollApiKeyResponse200Kind string

const (
	RollApiKeyResponse200KindStandard RollApiKeyResponse200Kind = "standard"
	RollApiKeyResponse200KindDefault  RollApiKeyResponse200Kind = "default"
	RollApiKeyResponse200KindTest     RollApiKeyResponse200Kind = "test"
)

type RollApiKeyResponse200ScopesItem string

const (
	RollApiKeyResponse200ScopesItemExecute      RollApiKeyResponse200ScopesItem = "execute"
	RollApiKeyResponse200ScopesItemJobsRead     RollApiKeyResponse200ScopesItem = "jobs:read"
	RollApiKeyResponse200ScopesItemJobsCancel   RollApiKeyResponse200ScopesItem = "jobs:cancel"
	RollApiKeyResponse200ScopesItemProjectsRead RollApiKeyResponse200ScopesItem = "projects:read"
	RollApiKeyResponse200ScopesItemUsageRead    RollApiKeyResponse200ScopesItem = "usage:read"
)

type RotateApiKeyResponse200Kind string

const (
	RotateApiKeyResponse200KindStandard RotateApiKeyResponse200Kind = "standard"
	RotateApiKeyResponse200KindDefault  RotateApiKeyResponse200Kind = "default"
	RotateApiKeyResponse200KindTest     RotateApiKeyResponse200Kind = "test"
)

type RotateApiKeyResponse200ScopesItem string

const (
	RotateApiKeyResponse200ScopesItemExecute      RotateApiKeyResponse200ScopesItem = "execute"
	RotateApiKeyResponse200ScopesItemJobsRead     RotateApiKeyResponse200ScopesItem = "jobs:read"
	RotateApiKeyResponse200ScopesItemJobsCancel   RotateApiKeyResponse200ScopesItem = "jobs:cancel"
	RotateApiKeyResponse200ScopesItemProjectsRead RotateApiKeyResponse200ScopesItem = "projects:read"
	RotateApiKeyResponse200ScopesItemUsageRead    RotateApiKeyResponse200ScopesItem = "usage:read"
)

type CreateBillingCheckoutRequestBillingCycle string

const (
	CreateBillingCheckoutRequestBillingCycleMonthly CreateBillingCheckoutRequestBillingCycle = "monthly"
	CreateBillingCheckoutRequestBillingCycleAnnual  CreateBillingCheckoutRequestBillingCycle = "annual"
)

type ReconcileBillingCheckoutResponse200Status string

const (
	ReconcileBillingCheckoutResponse200StatusActive    ReconcileBillingCheckoutResponse200Status = "active"
	ReconcileBillingCheckoutResponse200StatusPending   ReconcileBillingCheckoutResponse200Status = "pending"
	ReconcileBillingCheckoutResponse200StatusFailed    ReconcileBillingCheckoutResponse200Status = "failed"
	ReconcileBillingCheckoutResponse200StatusCanceled  ReconcileBillingCheckoutResponse200Status = "canceled"
	ReconcileBillingCheckoutResponse200StatusPastDue   ReconcileBillingCheckoutResponse200Status = "past_due"
	ReconcileBillingCheckoutResponse200StatusSucceeded ReconcileBillingCheckoutResponse200Status = "succeeded"
	ReconcileBillingCheckoutResponse200StatusPaid      ReconcileBillingCheckoutResponse200Status = "paid"
)

type ReconcileBillingCheckoutResponse200Type string

const (
	ReconcileBillingCheckoutResponse200TypeSubscription ReconcileBillingCheckoutResponse200Type = "subscription"
	ReconcileBillingCheckoutResponse200TypeTopup        ReconcileBillingCheckoutResponse200Type = "topup"
)

type GetBillingInvoicesResponse200InvoicesItemStatus string

const (
	GetBillingInvoicesResponse200InvoicesItemStatusPaid          GetBillingInvoicesResponse200InvoicesItemStatus = "paid"
	GetBillingInvoicesResponse200InvoicesItemStatusSucceeded     GetBillingInvoicesResponse200InvoicesItemStatus = "succeeded"
	GetBillingInvoicesResponse200InvoicesItemStatusOpen          GetBillingInvoicesResponse200InvoicesItemStatus = "open"
	GetBillingInvoicesResponse200InvoicesItemStatusFailed        GetBillingInvoicesResponse200InvoicesItemStatus = "failed"
	GetBillingInvoicesResponse200InvoicesItemStatusRefunded      GetBillingInvoicesResponse200InvoicesItemStatus = "refunded"
	GetBillingInvoicesResponse200InvoicesItemStatusVoid          GetBillingInvoicesResponse200InvoicesItemStatus = "void"
	GetBillingInvoicesResponse200InvoicesItemStatusUncollectible GetBillingInvoicesResponse200InvoicesItemStatus = "uncollectible"
)

type PreviewBillingRequestBillingCycle string

const (
	PreviewBillingRequestBillingCycleMonthly PreviewBillingRequestBillingCycle = "monthly"
	PreviewBillingRequestBillingCycleAnnual  PreviewBillingRequestBillingCycle = "annual"
)

type PreviewBillingResponse200BillingCycle string

const (
	PreviewBillingResponse200BillingCycleMonthly PreviewBillingResponse200BillingCycle = "monthly"
	PreviewBillingResponse200BillingCycleAnnual  PreviewBillingResponse200BillingCycle = "annual"
)

type GetBillingSubscriptionResponse200Status string

const (
	GetBillingSubscriptionResponse200StatusNone              GetBillingSubscriptionResponse200Status = "none"
	GetBillingSubscriptionResponse200StatusIncomplete        GetBillingSubscriptionResponse200Status = "incomplete"
	GetBillingSubscriptionResponse200StatusIncompleteExpired GetBillingSubscriptionResponse200Status = "incomplete_expired"
	GetBillingSubscriptionResponse200StatusTrialing          GetBillingSubscriptionResponse200Status = "trialing"
	GetBillingSubscriptionResponse200StatusActive            GetBillingSubscriptionResponse200Status = "active"
	GetBillingSubscriptionResponse200StatusPastDue           GetBillingSubscriptionResponse200Status = "past_due"
	GetBillingSubscriptionResponse200StatusCanceled          GetBillingSubscriptionResponse200Status = "canceled"
	GetBillingSubscriptionResponse200StatusUnpaid            GetBillingSubscriptionResponse200Status = "unpaid"
	GetBillingSubscriptionResponse200StatusPaused            GetBillingSubscriptionResponse200Status = "paused"
)

type CreateBillingTopupCheckoutRequestBoostCode string

const (
	CreateBillingTopupCheckoutRequestBoostCode5k   CreateBillingTopupCheckoutRequestBoostCode = "5k"
	CreateBillingTopupCheckoutRequestBoostCode25k  CreateBillingTopupCheckoutRequestBoostCode = "25k"
	CreateBillingTopupCheckoutRequestBoostCode100k CreateBillingTopupCheckoutRequestBoostCode = "100k"
	CreateBillingTopupCheckoutRequestBoostCode500k CreateBillingTopupCheckoutRequestBoostCode = "500k"
	CreateBillingTopupCheckoutRequestBoostCode1m   CreateBillingTopupCheckoutRequestBoostCode = "1m"
)

type GetBillingTopupCatalogResponse200TiersItemBoostCode string

const (
	GetBillingTopupCatalogResponse200TiersItemBoostCode5k   GetBillingTopupCatalogResponse200TiersItemBoostCode = "5k"
	GetBillingTopupCatalogResponse200TiersItemBoostCode25k  GetBillingTopupCatalogResponse200TiersItemBoostCode = "25k"
	GetBillingTopupCatalogResponse200TiersItemBoostCode100k GetBillingTopupCatalogResponse200TiersItemBoostCode = "100k"
	GetBillingTopupCatalogResponse200TiersItemBoostCode500k GetBillingTopupCatalogResponse200TiersItemBoostCode = "500k"
	GetBillingTopupCatalogResponse200TiersItemBoostCode1m   GetBillingTopupCatalogResponse200TiersItemBoostCode = "1m"
)

type GetWorkspaceDeletionResponse200Stage string

const (
	GetWorkspaceDeletionResponse200StageRequested                   GetWorkspaceDeletionResponse200Stage = "requested"
	GetWorkspaceDeletionResponse200StageExecutionStopped            GetWorkspaceDeletionResponse200Stage = "execution_stopped"
	GetWorkspaceDeletionResponse200StageWebhooksDisabled            GetWorkspaceDeletionResponse200Stage = "webhooks_disabled"
	GetWorkspaceDeletionResponse200StageBillingDetached             GetWorkspaceDeletionResponse200Stage = "billing_detached"
	GetWorkspaceDeletionResponse200StageArtifactsDeleted            GetWorkspaceDeletionResponse200Stage = "artifacts_deleted"
	GetWorkspaceDeletionResponse200StageMetadataAnonymizedOrDeleted GetWorkspaceDeletionResponse200Stage = "metadata_anonymized_or_deleted"
	GetWorkspaceDeletionResponse200StageRetentionRecordsPreserved   GetWorkspaceDeletionResponse200Stage = "retention_records_preserved"
	GetWorkspaceDeletionResponse200StageCompleted                   GetWorkspaceDeletionResponse200Stage = "completed"
)

type ListWorkspaceInvitationsResponse200DataItemRole string

const (
	ListWorkspaceInvitationsResponse200DataItemRoleAdmin     ListWorkspaceInvitationsResponse200DataItemRole = "admin"
	ListWorkspaceInvitationsResponse200DataItemRoleDeveloper ListWorkspaceInvitationsResponse200DataItemRole = "developer"
	ListWorkspaceInvitationsResponse200DataItemRoleViewer    ListWorkspaceInvitationsResponse200DataItemRole = "viewer"
)

type ListWorkspaceInvitationsResponse200DataItemStatus string

const (
	ListWorkspaceInvitationsResponse200DataItemStatusPending  ListWorkspaceInvitationsResponse200DataItemStatus = "pending"
	ListWorkspaceInvitationsResponse200DataItemStatusAccepted ListWorkspaceInvitationsResponse200DataItemStatus = "accepted"
	ListWorkspaceInvitationsResponse200DataItemStatusRevoked  ListWorkspaceInvitationsResponse200DataItemStatus = "revoked"
	ListWorkspaceInvitationsResponse200DataItemStatusExpired  ListWorkspaceInvitationsResponse200DataItemStatus = "expired"
)

type CreateWorkspaceInvitationRequestRole string

const (
	CreateWorkspaceInvitationRequestRoleAdmin     CreateWorkspaceInvitationRequestRole = "admin"
	CreateWorkspaceInvitationRequestRoleDeveloper CreateWorkspaceInvitationRequestRole = "developer"
	CreateWorkspaceInvitationRequestRoleViewer    CreateWorkspaceInvitationRequestRole = "viewer"
)

type CreateWorkspaceInvitationResponse201Role string

const (
	CreateWorkspaceInvitationResponse201RoleAdmin     CreateWorkspaceInvitationResponse201Role = "admin"
	CreateWorkspaceInvitationResponse201RoleDeveloper CreateWorkspaceInvitationResponse201Role = "developer"
	CreateWorkspaceInvitationResponse201RoleViewer    CreateWorkspaceInvitationResponse201Role = "viewer"
)

type CreateWorkspaceInvitationResponse201Status string

const (
	CreateWorkspaceInvitationResponse201StatusPending  CreateWorkspaceInvitationResponse201Status = "pending"
	CreateWorkspaceInvitationResponse201StatusAccepted CreateWorkspaceInvitationResponse201Status = "accepted"
	CreateWorkspaceInvitationResponse201StatusRevoked  CreateWorkspaceInvitationResponse201Status = "revoked"
	CreateWorkspaceInvitationResponse201StatusExpired  CreateWorkspaceInvitationResponse201Status = "expired"
)

type AcceptWorkspaceInvitationResponse200Role string

const (
	AcceptWorkspaceInvitationResponse200RoleAdmin     AcceptWorkspaceInvitationResponse200Role = "admin"
	AcceptWorkspaceInvitationResponse200RoleDeveloper AcceptWorkspaceInvitationResponse200Role = "developer"
	AcceptWorkspaceInvitationResponse200RoleViewer    AcceptWorkspaceInvitationResponse200Role = "viewer"
)

type AcceptWorkspaceInvitationResponse200Status string

const (
	AcceptWorkspaceInvitationResponse200StatusPending  AcceptWorkspaceInvitationResponse200Status = "pending"
	AcceptWorkspaceInvitationResponse200StatusAccepted AcceptWorkspaceInvitationResponse200Status = "accepted"
	AcceptWorkspaceInvitationResponse200StatusRevoked  AcceptWorkspaceInvitationResponse200Status = "revoked"
	AcceptWorkspaceInvitationResponse200StatusExpired  AcceptWorkspaceInvitationResponse200Status = "expired"
)

type ListWorkspaceMembersResponse200DataItemRole string

const (
	ListWorkspaceMembersResponse200DataItemRoleOwner     ListWorkspaceMembersResponse200DataItemRole = "owner"
	ListWorkspaceMembersResponse200DataItemRoleAdmin     ListWorkspaceMembersResponse200DataItemRole = "admin"
	ListWorkspaceMembersResponse200DataItemRoleDeveloper ListWorkspaceMembersResponse200DataItemRole = "developer"
	ListWorkspaceMembersResponse200DataItemRoleViewer    ListWorkspaceMembersResponse200DataItemRole = "viewer"
)

type UpdateWorkspaceMemberRequestRole string

const (
	UpdateWorkspaceMemberRequestRoleAdmin     UpdateWorkspaceMemberRequestRole = "admin"
	UpdateWorkspaceMemberRequestRoleDeveloper UpdateWorkspaceMemberRequestRole = "developer"
	UpdateWorkspaceMemberRequestRoleViewer    UpdateWorkspaceMemberRequestRole = "viewer"
)

type UpdateWorkspaceMemberResponse200Role string

const (
	UpdateWorkspaceMemberResponse200RoleOwner     UpdateWorkspaceMemberResponse200Role = "owner"
	UpdateWorkspaceMemberResponse200RoleAdmin     UpdateWorkspaceMemberResponse200Role = "admin"
	UpdateWorkspaceMemberResponse200RoleDeveloper UpdateWorkspaceMemberResponse200Role = "developer"
	UpdateWorkspaceMemberResponse200RoleViewer    UpdateWorkspaceMemberResponse200Role = "viewer"
)

type TransferWorkspaceOwnershipResponse200Role string

const (
	TransferWorkspaceOwnershipResponse200RoleOwner     TransferWorkspaceOwnershipResponse200Role = "owner"
	TransferWorkspaceOwnershipResponse200RoleAdmin     TransferWorkspaceOwnershipResponse200Role = "admin"
	TransferWorkspaceOwnershipResponse200RoleDeveloper TransferWorkspaceOwnershipResponse200Role = "developer"
	TransferWorkspaceOwnershipResponse200RoleViewer    TransferWorkspaceOwnershipResponse200Role = "viewer"
)

type GetWorkspaceOverviewResponse200ActiveJobsItemArtifactState string

const (
	GetWorkspaceOverviewResponse200ActiveJobsItemArtifactStateNotApplicable GetWorkspaceOverviewResponse200ActiveJobsItemArtifactState = "not_applicable"
	GetWorkspaceOverviewResponse200ActiveJobsItemArtifactStatePending       GetWorkspaceOverviewResponse200ActiveJobsItemArtifactState = "pending"
	GetWorkspaceOverviewResponse200ActiveJobsItemArtifactStateIngesting     GetWorkspaceOverviewResponse200ActiveJobsItemArtifactState = "ingesting"
	GetWorkspaceOverviewResponse200ActiveJobsItemArtifactStateComplete      GetWorkspaceOverviewResponse200ActiveJobsItemArtifactState = "complete"
	GetWorkspaceOverviewResponse200ActiveJobsItemArtifactStateExpired       GetWorkspaceOverviewResponse200ActiveJobsItemArtifactState = "expired"
	GetWorkspaceOverviewResponse200ActiveJobsItemArtifactStateReview        GetWorkspaceOverviewResponse200ActiveJobsItemArtifactState = "review"
)

type GetWorkspaceOverviewResponse200ActiveJobsItemKind string

const (
	GetWorkspaceOverviewResponse200ActiveJobsItemKindCompile GetWorkspaceOverviewResponse200ActiveJobsItemKind = "compile"
	GetWorkspaceOverviewResponse200ActiveJobsItemKindCrawl   GetWorkspaceOverviewResponse200ActiveJobsItemKind = "crawl"
	GetWorkspaceOverviewResponse200ActiveJobsItemKindBatch   GetWorkspaceOverviewResponse200ActiveJobsItemKind = "batch"
)

type GetWorkspaceOverviewResponse200ActiveJobsItemStatus string

const (
	GetWorkspaceOverviewResponse200ActiveJobsItemStatusQueued    GetWorkspaceOverviewResponse200ActiveJobsItemStatus = "queued"
	GetWorkspaceOverviewResponse200ActiveJobsItemStatusRunning   GetWorkspaceOverviewResponse200ActiveJobsItemStatus = "running"
	GetWorkspaceOverviewResponse200ActiveJobsItemStatusIngesting GetWorkspaceOverviewResponse200ActiveJobsItemStatus = "ingesting"
	GetWorkspaceOverviewResponse200ActiveJobsItemStatusReady     GetWorkspaceOverviewResponse200ActiveJobsItemStatus = "ready"
	GetWorkspaceOverviewResponse200ActiveJobsItemStatusFailed    GetWorkspaceOverviewResponse200ActiveJobsItemStatus = "failed"
	GetWorkspaceOverviewResponse200ActiveJobsItemStatusCancelled GetWorkspaceOverviewResponse200ActiveJobsItemStatus = "cancelled"
)

type GetWorkspaceOverviewResponse200RecentErrorsItemArtifactState string

const (
	GetWorkspaceOverviewResponse200RecentErrorsItemArtifactStateNotApplicable GetWorkspaceOverviewResponse200RecentErrorsItemArtifactState = "not_applicable"
	GetWorkspaceOverviewResponse200RecentErrorsItemArtifactStatePending       GetWorkspaceOverviewResponse200RecentErrorsItemArtifactState = "pending"
	GetWorkspaceOverviewResponse200RecentErrorsItemArtifactStateIngesting     GetWorkspaceOverviewResponse200RecentErrorsItemArtifactState = "ingesting"
	GetWorkspaceOverviewResponse200RecentErrorsItemArtifactStateComplete      GetWorkspaceOverviewResponse200RecentErrorsItemArtifactState = "complete"
	GetWorkspaceOverviewResponse200RecentErrorsItemArtifactStateExpired       GetWorkspaceOverviewResponse200RecentErrorsItemArtifactState = "expired"
	GetWorkspaceOverviewResponse200RecentErrorsItemArtifactStateReview        GetWorkspaceOverviewResponse200RecentErrorsItemArtifactState = "review"
)

type GetWorkspaceOverviewResponse200RecentErrorsItemKind string

const (
	GetWorkspaceOverviewResponse200RecentErrorsItemKindCompile GetWorkspaceOverviewResponse200RecentErrorsItemKind = "compile"
	GetWorkspaceOverviewResponse200RecentErrorsItemKindCrawl   GetWorkspaceOverviewResponse200RecentErrorsItemKind = "crawl"
	GetWorkspaceOverviewResponse200RecentErrorsItemKindBatch   GetWorkspaceOverviewResponse200RecentErrorsItemKind = "batch"
)

type GetWorkspaceOverviewResponse200RecentErrorsItemStatus string

const (
	GetWorkspaceOverviewResponse200RecentErrorsItemStatusQueued    GetWorkspaceOverviewResponse200RecentErrorsItemStatus = "queued"
	GetWorkspaceOverviewResponse200RecentErrorsItemStatusRunning   GetWorkspaceOverviewResponse200RecentErrorsItemStatus = "running"
	GetWorkspaceOverviewResponse200RecentErrorsItemStatusIngesting GetWorkspaceOverviewResponse200RecentErrorsItemStatus = "ingesting"
	GetWorkspaceOverviewResponse200RecentErrorsItemStatusReady     GetWorkspaceOverviewResponse200RecentErrorsItemStatus = "ready"
	GetWorkspaceOverviewResponse200RecentErrorsItemStatusFailed    GetWorkspaceOverviewResponse200RecentErrorsItemStatus = "failed"
	GetWorkspaceOverviewResponse200RecentErrorsItemStatusCancelled GetWorkspaceOverviewResponse200RecentErrorsItemStatus = "cancelled"
)

type GetWorkspaceOverviewResponse200RecentJobsItemArtifactState string

const (
	GetWorkspaceOverviewResponse200RecentJobsItemArtifactStateNotApplicable GetWorkspaceOverviewResponse200RecentJobsItemArtifactState = "not_applicable"
	GetWorkspaceOverviewResponse200RecentJobsItemArtifactStatePending       GetWorkspaceOverviewResponse200RecentJobsItemArtifactState = "pending"
	GetWorkspaceOverviewResponse200RecentJobsItemArtifactStateIngesting     GetWorkspaceOverviewResponse200RecentJobsItemArtifactState = "ingesting"
	GetWorkspaceOverviewResponse200RecentJobsItemArtifactStateComplete      GetWorkspaceOverviewResponse200RecentJobsItemArtifactState = "complete"
	GetWorkspaceOverviewResponse200RecentJobsItemArtifactStateExpired       GetWorkspaceOverviewResponse200RecentJobsItemArtifactState = "expired"
	GetWorkspaceOverviewResponse200RecentJobsItemArtifactStateReview        GetWorkspaceOverviewResponse200RecentJobsItemArtifactState = "review"
)

type GetWorkspaceOverviewResponse200RecentJobsItemKind string

const (
	GetWorkspaceOverviewResponse200RecentJobsItemKindCompile GetWorkspaceOverviewResponse200RecentJobsItemKind = "compile"
	GetWorkspaceOverviewResponse200RecentJobsItemKindCrawl   GetWorkspaceOverviewResponse200RecentJobsItemKind = "crawl"
	GetWorkspaceOverviewResponse200RecentJobsItemKindBatch   GetWorkspaceOverviewResponse200RecentJobsItemKind = "batch"
)

type GetWorkspaceOverviewResponse200RecentJobsItemStatus string

const (
	GetWorkspaceOverviewResponse200RecentJobsItemStatusQueued    GetWorkspaceOverviewResponse200RecentJobsItemStatus = "queued"
	GetWorkspaceOverviewResponse200RecentJobsItemStatusRunning   GetWorkspaceOverviewResponse200RecentJobsItemStatus = "running"
	GetWorkspaceOverviewResponse200RecentJobsItemStatusIngesting GetWorkspaceOverviewResponse200RecentJobsItemStatus = "ingesting"
	GetWorkspaceOverviewResponse200RecentJobsItemStatusReady     GetWorkspaceOverviewResponse200RecentJobsItemStatus = "ready"
	GetWorkspaceOverviewResponse200RecentJobsItemStatusFailed    GetWorkspaceOverviewResponse200RecentJobsItemStatus = "failed"
	GetWorkspaceOverviewResponse200RecentJobsItemStatusCancelled GetWorkspaceOverviewResponse200RecentJobsItemStatus = "cancelled"
)

type ListProjectsResponse200DataItemStatus string

const (
	ListProjectsResponse200DataItemStatusActive  ListProjectsResponse200DataItemStatus = "active"
	ListProjectsResponse200DataItemStatusDeleted ListProjectsResponse200DataItemStatus = "deleted"
)

type CreateProjectResponse201Status string

const (
	CreateProjectResponse201StatusActive  CreateProjectResponse201Status = "active"
	CreateProjectResponse201StatusDeleted CreateProjectResponse201Status = "deleted"
)

type GetProjectResponse200Status string

const (
	GetProjectResponse200StatusActive  GetProjectResponse200Status = "active"
	GetProjectResponse200StatusDeleted GetProjectResponse200Status = "deleted"
)

type UpdateProjectResponse200Status string

const (
	UpdateProjectResponse200StatusActive  UpdateProjectResponse200Status = "active"
	UpdateProjectResponse200StatusDeleted UpdateProjectResponse200Status = "deleted"
)

type GetUsageResponse200AccountsItemMetric string

const (
	GetUsageResponse200AccountsItemMetricCredits GetUsageResponse200AccountsItemMetric = "credits"
)

type GetUsageResponse200GrantsItemMetric string

const (
	GetUsageResponse200GrantsItemMetricCredits GetUsageResponse200GrantsItemMetric = "credits"
)

type ListUsageLedgerResponse200DataItemEntryType string

const (
	ListUsageLedgerResponse200DataItemEntryTypeReserve    ListUsageLedgerResponse200DataItemEntryType = "reserve"
	ListUsageLedgerResponse200DataItemEntryTypeSettle     ListUsageLedgerResponse200DataItemEntryType = "settle"
	ListUsageLedgerResponse200DataItemEntryTypeRelease    ListUsageLedgerResponse200DataItemEntryType = "release"
	ListUsageLedgerResponse200DataItemEntryTypeAdjustment ListUsageLedgerResponse200DataItemEntryType = "adjustment"
	ListUsageLedgerResponse200DataItemEntryTypeCredit     ListUsageLedgerResponse200DataItemEntryType = "credit"
)

type ListUsageLedgerResponse200DataItemMetric string

const (
	ListUsageLedgerResponse200DataItemMetricCredits ListUsageLedgerResponse200DataItemMetric = "credits"
)

type ListWorkspaceWebhookDeliveriesResponse200DataItemEventType string

const (
	ListWorkspaceWebhookDeliveriesResponse200DataItemEventTypeJobCreated                 ListWorkspaceWebhookDeliveriesResponse200DataItemEventType = "job.created"
	ListWorkspaceWebhookDeliveriesResponse200DataItemEventTypeJobStarted                 ListWorkspaceWebhookDeliveriesResponse200DataItemEventType = "job.started"
	ListWorkspaceWebhookDeliveriesResponse200DataItemEventTypeJobReady                   ListWorkspaceWebhookDeliveriesResponse200DataItemEventType = "job.ready"
	ListWorkspaceWebhookDeliveriesResponse200DataItemEventTypeJobFailed                  ListWorkspaceWebhookDeliveriesResponse200DataItemEventType = "job.failed"
	ListWorkspaceWebhookDeliveriesResponse200DataItemEventTypeJobCancelled               ListWorkspaceWebhookDeliveriesResponse200DataItemEventType = "job.cancelled"
	ListWorkspaceWebhookDeliveriesResponse200DataItemEventTypeJobResultsReady            ListWorkspaceWebhookDeliveriesResponse200DataItemEventType = "job.results_ready"
	ListWorkspaceWebhookDeliveriesResponse200DataItemEventTypeCrawlPageCompleted         ListWorkspaceWebhookDeliveriesResponse200DataItemEventType = "crawl.page_completed"
	ListWorkspaceWebhookDeliveriesResponse200DataItemEventTypeApiKeyCreated              ListWorkspaceWebhookDeliveriesResponse200DataItemEventType = "api_key.created"
	ListWorkspaceWebhookDeliveriesResponse200DataItemEventTypeApiKeyRevoked              ListWorkspaceWebhookDeliveriesResponse200DataItemEventType = "api_key.revoked"
	ListWorkspaceWebhookDeliveriesResponse200DataItemEventTypeWorkspaceMemberInvited     ListWorkspaceWebhookDeliveriesResponse200DataItemEventType = "workspace.member.invited"
	ListWorkspaceWebhookDeliveriesResponse200DataItemEventTypeWorkspaceMemberRemoved     ListWorkspaceWebhookDeliveriesResponse200DataItemEventType = "workspace.member.removed"
	ListWorkspaceWebhookDeliveriesResponse200DataItemEventTypeBillingSubscriptionUpdated ListWorkspaceWebhookDeliveriesResponse200DataItemEventType = "billing.subscription.updated"
	ListWorkspaceWebhookDeliveriesResponse200DataItemEventTypeWebhookTest                ListWorkspaceWebhookDeliveriesResponse200DataItemEventType = "webhook.test"
)

type ListWorkspaceWebhookDeliveriesResponse200DataItemSourceType string

const (
	ListWorkspaceWebhookDeliveriesResponse200DataItemSourceTypeEndpoint ListWorkspaceWebhookDeliveriesResponse200DataItemSourceType = "endpoint"
	ListWorkspaceWebhookDeliveriesResponse200DataItemSourceTypeInline   ListWorkspaceWebhookDeliveriesResponse200DataItemSourceType = "inline"
)

type ListWorkspaceWebhookDeliveriesResponse200DataItemStatus string

const (
	ListWorkspaceWebhookDeliveriesResponse200DataItemStatusPending   ListWorkspaceWebhookDeliveriesResponse200DataItemStatus = "pending"
	ListWorkspaceWebhookDeliveriesResponse200DataItemStatusRetrying  ListWorkspaceWebhookDeliveriesResponse200DataItemStatus = "retrying"
	ListWorkspaceWebhookDeliveriesResponse200DataItemStatusSucceeded ListWorkspaceWebhookDeliveriesResponse200DataItemStatus = "succeeded"
	ListWorkspaceWebhookDeliveriesResponse200DataItemStatusDead      ListWorkspaceWebhookDeliveriesResponse200DataItemStatus = "dead"
)

type GetWorkspaceWebhookDeliveryResponse200EventType string

const (
	GetWorkspaceWebhookDeliveryResponse200EventTypeJobCreated                 GetWorkspaceWebhookDeliveryResponse200EventType = "job.created"
	GetWorkspaceWebhookDeliveryResponse200EventTypeJobStarted                 GetWorkspaceWebhookDeliveryResponse200EventType = "job.started"
	GetWorkspaceWebhookDeliveryResponse200EventTypeJobReady                   GetWorkspaceWebhookDeliveryResponse200EventType = "job.ready"
	GetWorkspaceWebhookDeliveryResponse200EventTypeJobFailed                  GetWorkspaceWebhookDeliveryResponse200EventType = "job.failed"
	GetWorkspaceWebhookDeliveryResponse200EventTypeJobCancelled               GetWorkspaceWebhookDeliveryResponse200EventType = "job.cancelled"
	GetWorkspaceWebhookDeliveryResponse200EventTypeJobResultsReady            GetWorkspaceWebhookDeliveryResponse200EventType = "job.results_ready"
	GetWorkspaceWebhookDeliveryResponse200EventTypeCrawlPageCompleted         GetWorkspaceWebhookDeliveryResponse200EventType = "crawl.page_completed"
	GetWorkspaceWebhookDeliveryResponse200EventTypeApiKeyCreated              GetWorkspaceWebhookDeliveryResponse200EventType = "api_key.created"
	GetWorkspaceWebhookDeliveryResponse200EventTypeApiKeyRevoked              GetWorkspaceWebhookDeliveryResponse200EventType = "api_key.revoked"
	GetWorkspaceWebhookDeliveryResponse200EventTypeWorkspaceMemberInvited     GetWorkspaceWebhookDeliveryResponse200EventType = "workspace.member.invited"
	GetWorkspaceWebhookDeliveryResponse200EventTypeWorkspaceMemberRemoved     GetWorkspaceWebhookDeliveryResponse200EventType = "workspace.member.removed"
	GetWorkspaceWebhookDeliveryResponse200EventTypeBillingSubscriptionUpdated GetWorkspaceWebhookDeliveryResponse200EventType = "billing.subscription.updated"
	GetWorkspaceWebhookDeliveryResponse200EventTypeWebhookTest                GetWorkspaceWebhookDeliveryResponse200EventType = "webhook.test"
)

type GetWorkspaceWebhookDeliveryResponse200SourceType string

const (
	GetWorkspaceWebhookDeliveryResponse200SourceTypeEndpoint GetWorkspaceWebhookDeliveryResponse200SourceType = "endpoint"
	GetWorkspaceWebhookDeliveryResponse200SourceTypeInline   GetWorkspaceWebhookDeliveryResponse200SourceType = "inline"
)

type GetWorkspaceWebhookDeliveryResponse200Status string

const (
	GetWorkspaceWebhookDeliveryResponse200StatusPending   GetWorkspaceWebhookDeliveryResponse200Status = "pending"
	GetWorkspaceWebhookDeliveryResponse200StatusRetrying  GetWorkspaceWebhookDeliveryResponse200Status = "retrying"
	GetWorkspaceWebhookDeliveryResponse200StatusSucceeded GetWorkspaceWebhookDeliveryResponse200Status = "succeeded"
	GetWorkspaceWebhookDeliveryResponse200StatusDead      GetWorkspaceWebhookDeliveryResponse200Status = "dead"
)

type ListWebhookEndpointsResponse200DataItemEventsItem string

const (
	ListWebhookEndpointsResponse200DataItemEventsItemJobCreated                 ListWebhookEndpointsResponse200DataItemEventsItem = "job.created"
	ListWebhookEndpointsResponse200DataItemEventsItemJobStarted                 ListWebhookEndpointsResponse200DataItemEventsItem = "job.started"
	ListWebhookEndpointsResponse200DataItemEventsItemJobReady                   ListWebhookEndpointsResponse200DataItemEventsItem = "job.ready"
	ListWebhookEndpointsResponse200DataItemEventsItemJobFailed                  ListWebhookEndpointsResponse200DataItemEventsItem = "job.failed"
	ListWebhookEndpointsResponse200DataItemEventsItemJobCancelled               ListWebhookEndpointsResponse200DataItemEventsItem = "job.cancelled"
	ListWebhookEndpointsResponse200DataItemEventsItemJobResultsReady            ListWebhookEndpointsResponse200DataItemEventsItem = "job.results_ready"
	ListWebhookEndpointsResponse200DataItemEventsItemCrawlPageCompleted         ListWebhookEndpointsResponse200DataItemEventsItem = "crawl.page_completed"
	ListWebhookEndpointsResponse200DataItemEventsItemApiKeyCreated              ListWebhookEndpointsResponse200DataItemEventsItem = "api_key.created"
	ListWebhookEndpointsResponse200DataItemEventsItemApiKeyRevoked              ListWebhookEndpointsResponse200DataItemEventsItem = "api_key.revoked"
	ListWebhookEndpointsResponse200DataItemEventsItemWorkspaceMemberInvited     ListWebhookEndpointsResponse200DataItemEventsItem = "workspace.member.invited"
	ListWebhookEndpointsResponse200DataItemEventsItemWorkspaceMemberRemoved     ListWebhookEndpointsResponse200DataItemEventsItem = "workspace.member.removed"
	ListWebhookEndpointsResponse200DataItemEventsItemBillingSubscriptionUpdated ListWebhookEndpointsResponse200DataItemEventsItem = "billing.subscription.updated"
	ListWebhookEndpointsResponse200DataItemEventsItemWebhookTest                ListWebhookEndpointsResponse200DataItemEventsItem = "webhook.test"
)

type ListWebhookEndpointsResponse200DataItemStatus string

const (
	ListWebhookEndpointsResponse200DataItemStatusActive   ListWebhookEndpointsResponse200DataItemStatus = "active"
	ListWebhookEndpointsResponse200DataItemStatusDisabled ListWebhookEndpointsResponse200DataItemStatus = "disabled"
)

type CreateWebhookEndpointRequestEventsItem string

const (
	CreateWebhookEndpointRequestEventsItemJobCreated                 CreateWebhookEndpointRequestEventsItem = "job.created"
	CreateWebhookEndpointRequestEventsItemJobStarted                 CreateWebhookEndpointRequestEventsItem = "job.started"
	CreateWebhookEndpointRequestEventsItemJobReady                   CreateWebhookEndpointRequestEventsItem = "job.ready"
	CreateWebhookEndpointRequestEventsItemJobFailed                  CreateWebhookEndpointRequestEventsItem = "job.failed"
	CreateWebhookEndpointRequestEventsItemJobCancelled               CreateWebhookEndpointRequestEventsItem = "job.cancelled"
	CreateWebhookEndpointRequestEventsItemJobResultsReady            CreateWebhookEndpointRequestEventsItem = "job.results_ready"
	CreateWebhookEndpointRequestEventsItemCrawlPageCompleted         CreateWebhookEndpointRequestEventsItem = "crawl.page_completed"
	CreateWebhookEndpointRequestEventsItemApiKeyCreated              CreateWebhookEndpointRequestEventsItem = "api_key.created"
	CreateWebhookEndpointRequestEventsItemApiKeyRevoked              CreateWebhookEndpointRequestEventsItem = "api_key.revoked"
	CreateWebhookEndpointRequestEventsItemWorkspaceMemberInvited     CreateWebhookEndpointRequestEventsItem = "workspace.member.invited"
	CreateWebhookEndpointRequestEventsItemWorkspaceMemberRemoved     CreateWebhookEndpointRequestEventsItem = "workspace.member.removed"
	CreateWebhookEndpointRequestEventsItemBillingSubscriptionUpdated CreateWebhookEndpointRequestEventsItem = "billing.subscription.updated"
	CreateWebhookEndpointRequestEventsItemWebhookTest                CreateWebhookEndpointRequestEventsItem = "webhook.test"
)

type CreateWebhookEndpointResponse201EventsItem string

const (
	CreateWebhookEndpointResponse201EventsItemJobCreated                 CreateWebhookEndpointResponse201EventsItem = "job.created"
	CreateWebhookEndpointResponse201EventsItemJobStarted                 CreateWebhookEndpointResponse201EventsItem = "job.started"
	CreateWebhookEndpointResponse201EventsItemJobReady                   CreateWebhookEndpointResponse201EventsItem = "job.ready"
	CreateWebhookEndpointResponse201EventsItemJobFailed                  CreateWebhookEndpointResponse201EventsItem = "job.failed"
	CreateWebhookEndpointResponse201EventsItemJobCancelled               CreateWebhookEndpointResponse201EventsItem = "job.cancelled"
	CreateWebhookEndpointResponse201EventsItemJobResultsReady            CreateWebhookEndpointResponse201EventsItem = "job.results_ready"
	CreateWebhookEndpointResponse201EventsItemCrawlPageCompleted         CreateWebhookEndpointResponse201EventsItem = "crawl.page_completed"
	CreateWebhookEndpointResponse201EventsItemApiKeyCreated              CreateWebhookEndpointResponse201EventsItem = "api_key.created"
	CreateWebhookEndpointResponse201EventsItemApiKeyRevoked              CreateWebhookEndpointResponse201EventsItem = "api_key.revoked"
	CreateWebhookEndpointResponse201EventsItemWorkspaceMemberInvited     CreateWebhookEndpointResponse201EventsItem = "workspace.member.invited"
	CreateWebhookEndpointResponse201EventsItemWorkspaceMemberRemoved     CreateWebhookEndpointResponse201EventsItem = "workspace.member.removed"
	CreateWebhookEndpointResponse201EventsItemBillingSubscriptionUpdated CreateWebhookEndpointResponse201EventsItem = "billing.subscription.updated"
	CreateWebhookEndpointResponse201EventsItemWebhookTest                CreateWebhookEndpointResponse201EventsItem = "webhook.test"
)

type CreateWebhookEndpointResponse201Status string

const (
	CreateWebhookEndpointResponse201StatusActive   CreateWebhookEndpointResponse201Status = "active"
	CreateWebhookEndpointResponse201StatusDisabled CreateWebhookEndpointResponse201Status = "disabled"
)

type GetWebhookEndpointResponse200EventsItem string

const (
	GetWebhookEndpointResponse200EventsItemJobCreated                 GetWebhookEndpointResponse200EventsItem = "job.created"
	GetWebhookEndpointResponse200EventsItemJobStarted                 GetWebhookEndpointResponse200EventsItem = "job.started"
	GetWebhookEndpointResponse200EventsItemJobReady                   GetWebhookEndpointResponse200EventsItem = "job.ready"
	GetWebhookEndpointResponse200EventsItemJobFailed                  GetWebhookEndpointResponse200EventsItem = "job.failed"
	GetWebhookEndpointResponse200EventsItemJobCancelled               GetWebhookEndpointResponse200EventsItem = "job.cancelled"
	GetWebhookEndpointResponse200EventsItemJobResultsReady            GetWebhookEndpointResponse200EventsItem = "job.results_ready"
	GetWebhookEndpointResponse200EventsItemCrawlPageCompleted         GetWebhookEndpointResponse200EventsItem = "crawl.page_completed"
	GetWebhookEndpointResponse200EventsItemApiKeyCreated              GetWebhookEndpointResponse200EventsItem = "api_key.created"
	GetWebhookEndpointResponse200EventsItemApiKeyRevoked              GetWebhookEndpointResponse200EventsItem = "api_key.revoked"
	GetWebhookEndpointResponse200EventsItemWorkspaceMemberInvited     GetWebhookEndpointResponse200EventsItem = "workspace.member.invited"
	GetWebhookEndpointResponse200EventsItemWorkspaceMemberRemoved     GetWebhookEndpointResponse200EventsItem = "workspace.member.removed"
	GetWebhookEndpointResponse200EventsItemBillingSubscriptionUpdated GetWebhookEndpointResponse200EventsItem = "billing.subscription.updated"
	GetWebhookEndpointResponse200EventsItemWebhookTest                GetWebhookEndpointResponse200EventsItem = "webhook.test"
)

type GetWebhookEndpointResponse200Status string

const (
	GetWebhookEndpointResponse200StatusActive   GetWebhookEndpointResponse200Status = "active"
	GetWebhookEndpointResponse200StatusDisabled GetWebhookEndpointResponse200Status = "disabled"
)

type UpdateWebhookEndpointRequestEventsItem string

const (
	UpdateWebhookEndpointRequestEventsItemJobCreated                 UpdateWebhookEndpointRequestEventsItem = "job.created"
	UpdateWebhookEndpointRequestEventsItemJobStarted                 UpdateWebhookEndpointRequestEventsItem = "job.started"
	UpdateWebhookEndpointRequestEventsItemJobReady                   UpdateWebhookEndpointRequestEventsItem = "job.ready"
	UpdateWebhookEndpointRequestEventsItemJobFailed                  UpdateWebhookEndpointRequestEventsItem = "job.failed"
	UpdateWebhookEndpointRequestEventsItemJobCancelled               UpdateWebhookEndpointRequestEventsItem = "job.cancelled"
	UpdateWebhookEndpointRequestEventsItemJobResultsReady            UpdateWebhookEndpointRequestEventsItem = "job.results_ready"
	UpdateWebhookEndpointRequestEventsItemCrawlPageCompleted         UpdateWebhookEndpointRequestEventsItem = "crawl.page_completed"
	UpdateWebhookEndpointRequestEventsItemApiKeyCreated              UpdateWebhookEndpointRequestEventsItem = "api_key.created"
	UpdateWebhookEndpointRequestEventsItemApiKeyRevoked              UpdateWebhookEndpointRequestEventsItem = "api_key.revoked"
	UpdateWebhookEndpointRequestEventsItemWorkspaceMemberInvited     UpdateWebhookEndpointRequestEventsItem = "workspace.member.invited"
	UpdateWebhookEndpointRequestEventsItemWorkspaceMemberRemoved     UpdateWebhookEndpointRequestEventsItem = "workspace.member.removed"
	UpdateWebhookEndpointRequestEventsItemBillingSubscriptionUpdated UpdateWebhookEndpointRequestEventsItem = "billing.subscription.updated"
	UpdateWebhookEndpointRequestEventsItemWebhookTest                UpdateWebhookEndpointRequestEventsItem = "webhook.test"
)

type UpdateWebhookEndpointRequestStatus string

const (
	UpdateWebhookEndpointRequestStatusActive   UpdateWebhookEndpointRequestStatus = "active"
	UpdateWebhookEndpointRequestStatusDisabled UpdateWebhookEndpointRequestStatus = "disabled"
)

type UpdateWebhookEndpointResponse200EventsItem string

const (
	UpdateWebhookEndpointResponse200EventsItemJobCreated                 UpdateWebhookEndpointResponse200EventsItem = "job.created"
	UpdateWebhookEndpointResponse200EventsItemJobStarted                 UpdateWebhookEndpointResponse200EventsItem = "job.started"
	UpdateWebhookEndpointResponse200EventsItemJobReady                   UpdateWebhookEndpointResponse200EventsItem = "job.ready"
	UpdateWebhookEndpointResponse200EventsItemJobFailed                  UpdateWebhookEndpointResponse200EventsItem = "job.failed"
	UpdateWebhookEndpointResponse200EventsItemJobCancelled               UpdateWebhookEndpointResponse200EventsItem = "job.cancelled"
	UpdateWebhookEndpointResponse200EventsItemJobResultsReady            UpdateWebhookEndpointResponse200EventsItem = "job.results_ready"
	UpdateWebhookEndpointResponse200EventsItemCrawlPageCompleted         UpdateWebhookEndpointResponse200EventsItem = "crawl.page_completed"
	UpdateWebhookEndpointResponse200EventsItemApiKeyCreated              UpdateWebhookEndpointResponse200EventsItem = "api_key.created"
	UpdateWebhookEndpointResponse200EventsItemApiKeyRevoked              UpdateWebhookEndpointResponse200EventsItem = "api_key.revoked"
	UpdateWebhookEndpointResponse200EventsItemWorkspaceMemberInvited     UpdateWebhookEndpointResponse200EventsItem = "workspace.member.invited"
	UpdateWebhookEndpointResponse200EventsItemWorkspaceMemberRemoved     UpdateWebhookEndpointResponse200EventsItem = "workspace.member.removed"
	UpdateWebhookEndpointResponse200EventsItemBillingSubscriptionUpdated UpdateWebhookEndpointResponse200EventsItem = "billing.subscription.updated"
	UpdateWebhookEndpointResponse200EventsItemWebhookTest                UpdateWebhookEndpointResponse200EventsItem = "webhook.test"
)

type UpdateWebhookEndpointResponse200Status string

const (
	UpdateWebhookEndpointResponse200StatusActive   UpdateWebhookEndpointResponse200Status = "active"
	UpdateWebhookEndpointResponse200StatusDisabled UpdateWebhookEndpointResponse200Status = "disabled"
)

type ListWebhookDeliveriesResponse200DataItemEventType string

const (
	ListWebhookDeliveriesResponse200DataItemEventTypeJobCreated                 ListWebhookDeliveriesResponse200DataItemEventType = "job.created"
	ListWebhookDeliveriesResponse200DataItemEventTypeJobStarted                 ListWebhookDeliveriesResponse200DataItemEventType = "job.started"
	ListWebhookDeliveriesResponse200DataItemEventTypeJobReady                   ListWebhookDeliveriesResponse200DataItemEventType = "job.ready"
	ListWebhookDeliveriesResponse200DataItemEventTypeJobFailed                  ListWebhookDeliveriesResponse200DataItemEventType = "job.failed"
	ListWebhookDeliveriesResponse200DataItemEventTypeJobCancelled               ListWebhookDeliveriesResponse200DataItemEventType = "job.cancelled"
	ListWebhookDeliveriesResponse200DataItemEventTypeJobResultsReady            ListWebhookDeliveriesResponse200DataItemEventType = "job.results_ready"
	ListWebhookDeliveriesResponse200DataItemEventTypeCrawlPageCompleted         ListWebhookDeliveriesResponse200DataItemEventType = "crawl.page_completed"
	ListWebhookDeliveriesResponse200DataItemEventTypeApiKeyCreated              ListWebhookDeliveriesResponse200DataItemEventType = "api_key.created"
	ListWebhookDeliveriesResponse200DataItemEventTypeApiKeyRevoked              ListWebhookDeliveriesResponse200DataItemEventType = "api_key.revoked"
	ListWebhookDeliveriesResponse200DataItemEventTypeWorkspaceMemberInvited     ListWebhookDeliveriesResponse200DataItemEventType = "workspace.member.invited"
	ListWebhookDeliveriesResponse200DataItemEventTypeWorkspaceMemberRemoved     ListWebhookDeliveriesResponse200DataItemEventType = "workspace.member.removed"
	ListWebhookDeliveriesResponse200DataItemEventTypeBillingSubscriptionUpdated ListWebhookDeliveriesResponse200DataItemEventType = "billing.subscription.updated"
	ListWebhookDeliveriesResponse200DataItemEventTypeWebhookTest                ListWebhookDeliveriesResponse200DataItemEventType = "webhook.test"
)

type ListWebhookDeliveriesResponse200DataItemSourceType string

const (
	ListWebhookDeliveriesResponse200DataItemSourceTypeEndpoint ListWebhookDeliveriesResponse200DataItemSourceType = "endpoint"
	ListWebhookDeliveriesResponse200DataItemSourceTypeInline   ListWebhookDeliveriesResponse200DataItemSourceType = "inline"
)

type ListWebhookDeliveriesResponse200DataItemStatus string

const (
	ListWebhookDeliveriesResponse200DataItemStatusPending   ListWebhookDeliveriesResponse200DataItemStatus = "pending"
	ListWebhookDeliveriesResponse200DataItemStatusRetrying  ListWebhookDeliveriesResponse200DataItemStatus = "retrying"
	ListWebhookDeliveriesResponse200DataItemStatusSucceeded ListWebhookDeliveriesResponse200DataItemStatus = "succeeded"
	ListWebhookDeliveriesResponse200DataItemStatusDead      ListWebhookDeliveriesResponse200DataItemStatus = "dead"
)

type SendWebhookTestEventRequestEventType string

const (
	SendWebhookTestEventRequestEventTypeJobCreated                 SendWebhookTestEventRequestEventType = "job.created"
	SendWebhookTestEventRequestEventTypeJobStarted                 SendWebhookTestEventRequestEventType = "job.started"
	SendWebhookTestEventRequestEventTypeJobReady                   SendWebhookTestEventRequestEventType = "job.ready"
	SendWebhookTestEventRequestEventTypeJobFailed                  SendWebhookTestEventRequestEventType = "job.failed"
	SendWebhookTestEventRequestEventTypeJobCancelled               SendWebhookTestEventRequestEventType = "job.cancelled"
	SendWebhookTestEventRequestEventTypeJobResultsReady            SendWebhookTestEventRequestEventType = "job.results_ready"
	SendWebhookTestEventRequestEventTypeCrawlPageCompleted         SendWebhookTestEventRequestEventType = "crawl.page_completed"
	SendWebhookTestEventRequestEventTypeApiKeyCreated              SendWebhookTestEventRequestEventType = "api_key.created"
	SendWebhookTestEventRequestEventTypeApiKeyRevoked              SendWebhookTestEventRequestEventType = "api_key.revoked"
	SendWebhookTestEventRequestEventTypeWorkspaceMemberInvited     SendWebhookTestEventRequestEventType = "workspace.member.invited"
	SendWebhookTestEventRequestEventTypeWorkspaceMemberRemoved     SendWebhookTestEventRequestEventType = "workspace.member.removed"
	SendWebhookTestEventRequestEventTypeBillingSubscriptionUpdated SendWebhookTestEventRequestEventType = "billing.subscription.updated"
	SendWebhookTestEventRequestEventTypeWebhookTest                SendWebhookTestEventRequestEventType = "webhook.test"
)

type ExecutionResultArtifact struct {
	CompletedAt string `json:"completedAt"`
	Id          string `json:"id"`
	Ir          *struct {
		ContentGraph struct {
			Nodes map[string]struct {
				Attributes    map[string]string `json:"attributes,omitempty"`
				Children      []string          `json:"children"`
				ChunkBoundary *bool             `json:"chunkBoundary,omitempty"`
				Content       *string           `json:"content,omitempty"`
				ContentHash   *string           `json:"contentHash,omitempty"`
				Id            string            `json:"id"`
				Language      *string           `json:"language,omitempty"`
				Level         *float64          `json:"level,omitempty"`
				Parent        string            `json:"parent"`
				Provenance    *struct {
					Selector string `json:"selector"`
					Tag      string `json:"tag"`
				} `json:"provenance,omitempty"`
				SemanticRole *string                                             `json:"semanticRole,omitempty"`
				Type         ExecutionResultArtifactIrContentGraphNodesValueType `json:"type"`
			} `json:"nodes"`
			ReadingOrder []string `json:"readingOrder"`
		} `json:"contentGraph"`
		Metadata struct {
			Author               *string  `json:"author,omitempty"`
			CanonicalUrl         string   `json:"canonicalUrl"`
			Description          *string  `json:"description,omitempty"`
			DocumentHash         *string  `json:"documentHash,omitempty"`
			ExtractionConfidence *float64 `json:"extractionConfidence,omitempty"`
			Language             *string  `json:"language,omitempty"`
			PublishedDate        *string  `json:"publishedDate,omitempty"`
			Title                string   `json:"title"`
		} `json:"metadata"`
		Version string `json:"version"`
	} `json:"ir"`
	Markdown *string `json:"markdown"`
	Metadata *struct {
		Author               *string  `json:"author,omitempty"`
		CanonicalUrl         string   `json:"canonicalUrl"`
		Description          *string  `json:"description,omitempty"`
		DocumentHash         *string  `json:"documentHash,omitempty"`
		ExtractionConfidence *float64 `json:"extractionConfidence,omitempty"`
		Language             *string  `json:"language,omitempty"`
		PublishedDate        *string  `json:"publishedDate,omitempty"`
		Title                string   `json:"title"`
	} `json:"metadata"`
	Url *string `json:"url"`
}
type HealthResponse struct {
	Service HealthResponseService `json:"service"`
	Status  HealthResponseStatus  `json:"status"`
	Version HealthResponseVersion `json:"version"`
}
type JsonValue any
type PlanCatalog []PlanCatalogEntry
type PlanCatalogEntry struct {
	AnnualAmountCents  *int        `json:"annualAmountCents"`
	Code               string      `json:"code"`
	Currency           string      `json:"currency"`
	Features           []string    `json:"features"`
	HighlightBadge     *string     `json:"highlightBadge,omitempty"`
	IncludedCredits    int         `json:"includedCredits"`
	Limits             []PlanLimit `json:"limits"`
	MarketingBlurb     string      `json:"marketingBlurb"`
	MonthlyAmountCents *int        `json:"monthlyAmountCents"`
	Version            int         `json:"version"`
}
type PlanLimit struct {
	Key   string   `json:"key"`
	Unit  string   `json:"unit"`
	Value *float64 `json:"value"`
}
type Problem struct {
	Code             string  `json:"code"`
	Detail           string  `json:"detail"`
	DocumentationUrl *string `json:"documentationUrl,omitempty"`
	Instance         string  `json:"instance"`
	InvalidParams    []struct {
		Name   string `json:"name"`
		Reason string `json:"reason"`
	} `json:"invalidParams,omitempty"`
	RequestId  string  `json:"requestId"`
	ResourceId *string `json:"resourceId,omitempty"`
	Retryable  bool    `json:"retryable"`
	Status     int     `json:"status"`
	Title      string  `json:"title"`
	Type       string  `json:"type"`
}
type GetHealthRequest any
type GetHealthResponse200 HealthResponse
type CreateBatchRequest struct {
	Cache *struct {
		CacheOnly     *bool `json:"cacheOnly,omitempty"`
		ForceFresh    *bool `json:"forceFresh,omitempty"`
		MaxAgeSeconds *int  `json:"maxAgeSeconds,omitempty"`
	} `json:"cache,omitempty"`
	Formats   []CreateBatchRequestFormatsItem `json:"formats,omitempty"`
	Metadata  map[string]string               `json:"metadata,omitempty"`
	ProjectId *string                         `json:"projectId,omitempty"`
	Urls      []string                        `json:"urls"`
	Webhook   any                             `json:"webhook,omitempty"`
}
type CreateBatchResponse202 struct {
	ArtifactExpiresAt       *string                             `json:"artifactExpiresAt"`
	ArtifactState           CreateBatchResponse202ArtifactState `json:"artifactState"`
	CancellationRequestedAt *string                             `json:"cancellationRequestedAt"`
	CreatedAt               string                              `json:"createdAt"`
	ExecutionTerminalAt     *string                             `json:"executionTerminalAt"`
	Id                      string                              `json:"id"`
	Kind                    CreateBatchResponse202Kind          `json:"kind"`
	Progress                *struct {
		CompletedItems int  `json:"completedItems"`
		EtaSeconds     *int `json:"etaSeconds"`
		FailedItems    int  `json:"failedItems"`
		QueuedItems    int  `json:"queuedItems"`
		RatePerMinute  *int `json:"ratePerMinute"`
	} `json:"progress"`
	ProjectId    *string                      `json:"projectId"`
	ReadyAt      *string                      `json:"readyAt"`
	ReviewReason *string                      `json:"reviewReason"`
	Status       CreateBatchResponse202Status `json:"status"`
	TargetUrl    *string                      `json:"targetUrl,omitempty"`
	UpdatedAt    string                       `json:"updatedAt"`
	WorkspaceId  string                       `json:"workspaceId"`
}
type GetWorkspaceBootstrapRequest any
type GetWorkspaceBootstrapResponse200 struct {
	ContractVersion  GetWorkspaceBootstrapResponse200ContractVersion `json:"contractVersion"`
	DefaultKeySecret *string                                         `json:"defaultKeySecret,omitempty"`
	OnboardingHints  *struct {
		HasCreatedDefaultKey bool `json:"hasCreatedDefaultKey"`
	} `json:"onboardingHints,omitempty"`
	User struct {
		Id string `json:"id"`
	} `json:"user"`
	Workspace struct {
		CreatedAt      string `json:"createdAt"`
		DefaultProject *struct {
			Id   string `json:"id"`
			Name string `json:"name"`
			Slug string `json:"slug"`
		} `json:"defaultProject"`
		Id           string `json:"id"`
		IsPrimary    bool   `json:"isPrimary"`
		Name         string `json:"name"`
		PlanSnapshot struct {
			Features []struct {
				Enabled bool   `json:"enabled"`
				Key     string `json:"key"`
			} `json:"features"`
			Id     string `json:"id"`
			Limits []struct {
				Key   string `json:"key"`
				Unit  string `json:"unit"`
				Value *int   `json:"value"`
			} `json:"limits"`
			Plan struct {
				Code    string `json:"code"`
				Version int    `json:"version"`
			} `json:"plan"`
			SchemaVersion   float64 `json:"schemaVersion"`
			SnapshotVersion int     `json:"snapshotVersion"`
		} `json:"planSnapshot"`
		Role      GetWorkspaceBootstrapResponse200WorkspaceRole   `json:"role"`
		Slug      string                                          `json:"slug"`
		Status    GetWorkspaceBootstrapResponse200WorkspaceStatus `json:"status"`
		UpdatedAt string                                          `json:"updatedAt"`
		Version   int                                             `json:"version"`
	} `json:"workspace"`
}
type CompileUrlRequest struct {
	Cache *struct {
		CacheOnly     *bool `json:"cacheOnly,omitempty"`
		ForceFresh    *bool `json:"forceFresh,omitempty"`
		MaxAgeSeconds *int  `json:"maxAgeSeconds,omitempty"`
	} `json:"cache,omitempty"`
	ProjectId *string `json:"projectId,omitempty"`
	Url       string  `json:"url"`
}
type CompileUrlResponse200 struct {
	Ir struct {
		ContentGraph struct {
			Nodes map[string]struct {
				Attributes    map[string]string `json:"attributes,omitempty"`
				Children      []string          `json:"children"`
				ChunkBoundary *bool             `json:"chunkBoundary,omitempty"`
				Content       *string           `json:"content,omitempty"`
				ContentHash   *string           `json:"contentHash,omitempty"`
				Id            string            `json:"id"`
				Language      *string           `json:"language,omitempty"`
				Level         *float64          `json:"level,omitempty"`
				Parent        string            `json:"parent"`
				Provenance    *struct {
					Selector string `json:"selector"`
					Tag      string `json:"tag"`
				} `json:"provenance,omitempty"`
				SemanticRole *string                                           `json:"semanticRole,omitempty"`
				Type         CompileUrlResponse200IrContentGraphNodesValueType `json:"type"`
			} `json:"nodes"`
			ReadingOrder []string `json:"readingOrder"`
		} `json:"contentGraph"`
		Metadata struct {
			Author               *string  `json:"author,omitempty"`
			CanonicalUrl         string   `json:"canonicalUrl"`
			Description          *string  `json:"description,omitempty"`
			DocumentHash         *string  `json:"documentHash,omitempty"`
			ExtractionConfidence *float64 `json:"extractionConfidence,omitempty"`
			Language             *string  `json:"language,omitempty"`
			PublishedDate        *string  `json:"publishedDate,omitempty"`
			Title                string   `json:"title"`
		} `json:"metadata"`
		Version string `json:"version"`
	} `json:"ir"`
	Markdown string `json:"markdown"`
	Metadata struct {
		Author               *string  `json:"author,omitempty"`
		CanonicalUrl         string   `json:"canonicalUrl"`
		Description          *string  `json:"description,omitempty"`
		DocumentHash         *string  `json:"documentHash,omitempty"`
		ExtractionConfidence *float64 `json:"extractionConfidence,omitempty"`
		Language             *string  `json:"language,omitempty"`
		PublishedDate        *string  `json:"publishedDate,omitempty"`
		Title                string   `json:"title"`
	} `json:"metadata"`
	Usage struct {
		Credits int `json:"credits"`
	} `json:"usage"`
}
type CompileUrlResponse202 struct {
	ArtifactExpiresAt       *string                            `json:"artifactExpiresAt"`
	ArtifactState           CompileUrlResponse202ArtifactState `json:"artifactState"`
	CancellationRequestedAt *string                            `json:"cancellationRequestedAt"`
	CreatedAt               string                             `json:"createdAt"`
	ExecutionTerminalAt     *string                            `json:"executionTerminalAt"`
	Id                      string                             `json:"id"`
	Kind                    CompileUrlResponse202Kind          `json:"kind"`
	Progress                *struct {
		CompletedItems int  `json:"completedItems"`
		EtaSeconds     *int `json:"etaSeconds"`
		FailedItems    int  `json:"failedItems"`
		QueuedItems    int  `json:"queuedItems"`
		RatePerMinute  *int `json:"ratePerMinute"`
	} `json:"progress"`
	ProjectId    *string                     `json:"projectId"`
	ReadyAt      *string                     `json:"readyAt"`
	ReviewReason *string                     `json:"reviewReason"`
	Status       CompileUrlResponse202Status `json:"status"`
	TargetUrl    *string                     `json:"targetUrl,omitempty"`
	UpdatedAt    string                      `json:"updatedAt"`
	WorkspaceId  string                      `json:"workspaceId"`
}
type CreateCrawlRequest struct {
	Cache *struct {
		CacheOnly     *bool `json:"cacheOnly,omitempty"`
		ForceFresh    *bool `json:"forceFresh,omitempty"`
		MaxAgeSeconds *int  `json:"maxAgeSeconds,omitempty"`
	} `json:"cache,omitempty"`
	ExcludePaths          []string                        `json:"excludePaths,omitempty"`
	Formats               []CreateCrawlRequestFormatsItem `json:"formats,omitempty"`
	IgnoreQueryParameters *bool                           `json:"ignoreQueryParameters,omitempty"`
	IncludePaths          []string                        `json:"includePaths,omitempty"`
	IncludeSubdomains     *bool                           `json:"includeSubdomains,omitempty"`
	MaxDepth              *int                            `json:"maxDepth,omitempty"`
	MaxPages              *int                            `json:"maxPages,omitempty"`
	Metadata              map[string]string               `json:"metadata,omitempty"`
	ProjectId             *string                         `json:"projectId,omitempty"`
	Sitemap               *CreateCrawlRequestSitemap      `json:"sitemap,omitempty"`
	Url                   string                          `json:"url"`
	Webhook               any                             `json:"webhook,omitempty"`
}
type CreateCrawlResponse202 struct {
	ArtifactExpiresAt       *string                             `json:"artifactExpiresAt"`
	ArtifactState           CreateCrawlResponse202ArtifactState `json:"artifactState"`
	CancellationRequestedAt *string                             `json:"cancellationRequestedAt"`
	CreatedAt               string                              `json:"createdAt"`
	ExecutionTerminalAt     *string                             `json:"executionTerminalAt"`
	Id                      string                              `json:"id"`
	Kind                    CreateCrawlResponse202Kind          `json:"kind"`
	Progress                *struct {
		CompletedItems int  `json:"completedItems"`
		EtaSeconds     *int `json:"etaSeconds"`
		FailedItems    int  `json:"failedItems"`
		QueuedItems    int  `json:"queuedItems"`
		RatePerMinute  *int `json:"ratePerMinute"`
	} `json:"progress"`
	ProjectId    *string                      `json:"projectId"`
	ReadyAt      *string                      `json:"readyAt"`
	ReviewReason *string                      `json:"reviewReason"`
	Status       CreateCrawlResponse202Status `json:"status"`
	TargetUrl    *string                      `json:"targetUrl,omitempty"`
	UpdatedAt    string                       `json:"updatedAt"`
	WorkspaceId  string                       `json:"workspaceId"`
}
type AcceptInvitationRequest struct {
	Token string `json:"token"`
}
type AcceptInvitationResponse200 struct {
	CreatedAt string                            `json:"createdAt"`
	Email     string                            `json:"email"`
	ExpiresAt *string                           `json:"expiresAt"`
	Id        string                            `json:"id"`
	Role      AcceptInvitationResponse200Role   `json:"role"`
	Status    AcceptInvitationResponse200Status `json:"status"`
	UpdatedAt string                            `json:"updatedAt"`
}
type ListJobsRequest any
type ListJobsResponse200 struct {
	Data []struct {
		ArtifactExpiresAt       *string                                  `json:"artifactExpiresAt"`
		ArtifactState           ListJobsResponse200DataItemArtifactState `json:"artifactState"`
		CancellationRequestedAt *string                                  `json:"cancellationRequestedAt"`
		CreatedAt               string                                   `json:"createdAt"`
		ExecutionTerminalAt     *string                                  `json:"executionTerminalAt"`
		Id                      string                                   `json:"id"`
		Kind                    ListJobsResponse200DataItemKind          `json:"kind"`
		Progress                *struct {
			CompletedItems int  `json:"completedItems"`
			EtaSeconds     *int `json:"etaSeconds"`
			FailedItems    int  `json:"failedItems"`
			QueuedItems    int  `json:"queuedItems"`
			RatePerMinute  *int `json:"ratePerMinute"`
		} `json:"progress"`
		ProjectId    *string                           `json:"projectId"`
		ReadyAt      *string                           `json:"readyAt"`
		ReviewReason *string                           `json:"reviewReason"`
		Status       ListJobsResponse200DataItemStatus `json:"status"`
		TargetUrl    *string                           `json:"targetUrl,omitempty"`
		UpdatedAt    string                            `json:"updatedAt"`
		WorkspaceId  string                            `json:"workspaceId"`
	} `json:"data"`
	NextCursor *string `json:"nextCursor"`
}
type BulkCancelJobsRequest struct {
	JobIds    []string                          `json:"jobIds,omitempty"`
	ProjectId *string                           `json:"projectId,omitempty"`
	Status    []BulkCancelJobsRequestStatusItem `json:"status,omitempty"`
}
type BulkCancelJobsResponse200 struct {
	Results []struct {
		Job *struct {
			ArtifactExpiresAt       *string                                              `json:"artifactExpiresAt"`
			ArtifactState           BulkCancelJobsResponse200ResultsItemJobArtifactState `json:"artifactState"`
			CancellationRequestedAt *string                                              `json:"cancellationRequestedAt"`
			CreatedAt               string                                               `json:"createdAt"`
			ExecutionTerminalAt     *string                                              `json:"executionTerminalAt"`
			Id                      string                                               `json:"id"`
			Kind                    BulkCancelJobsResponse200ResultsItemJobKind          `json:"kind"`
			Progress                *struct {
				CompletedItems int  `json:"completedItems"`
				EtaSeconds     *int `json:"etaSeconds"`
				FailedItems    int  `json:"failedItems"`
				QueuedItems    int  `json:"queuedItems"`
				RatePerMinute  *int `json:"ratePerMinute"`
			} `json:"progress"`
			ProjectId    *string                                       `json:"projectId"`
			ReadyAt      *string                                       `json:"readyAt"`
			ReviewReason *string                                       `json:"reviewReason"`
			Status       BulkCancelJobsResponse200ResultsItemJobStatus `json:"status"`
			TargetUrl    *string                                       `json:"targetUrl,omitempty"`
			UpdatedAt    string                                        `json:"updatedAt"`
			WorkspaceId  string                                        `json:"workspaceId"`
		} `json:"job,omitempty"`
		JobId  string                                     `json:"jobId"`
		Status BulkCancelJobsResponse200ResultsItemStatus `json:"status"`
	} `json:"results"`
}
type GetJobRequest any
type GetJobResponse200 struct {
	ArtifactExpiresAt       *string                        `json:"artifactExpiresAt"`
	ArtifactState           GetJobResponse200ArtifactState `json:"artifactState"`
	CancellationRequestedAt *string                        `json:"cancellationRequestedAt"`
	CreatedAt               string                         `json:"createdAt"`
	ExecutionTerminalAt     *string                        `json:"executionTerminalAt"`
	Id                      string                         `json:"id"`
	Kind                    GetJobResponse200Kind          `json:"kind"`
	Progress                *struct {
		CompletedItems int  `json:"completedItems"`
		EtaSeconds     *int `json:"etaSeconds"`
		FailedItems    int  `json:"failedItems"`
		QueuedItems    int  `json:"queuedItems"`
		RatePerMinute  *int `json:"ratePerMinute"`
	} `json:"progress"`
	ProjectId    *string                 `json:"projectId"`
	ReadyAt      *string                 `json:"readyAt"`
	ReviewReason *string                 `json:"reviewReason"`
	Status       GetJobResponse200Status `json:"status"`
	TargetUrl    *string                 `json:"targetUrl,omitempty"`
	UpdatedAt    string                  `json:"updatedAt"`
	WorkspaceId  string                  `json:"workspaceId"`
}
type CancelJobRequest any
type CancelJobResponse202 struct {
	Accepted bool `json:"accepted"`
	Job      struct {
		ArtifactExpiresAt       *string                              `json:"artifactExpiresAt"`
		ArtifactState           CancelJobResponse202JobArtifactState `json:"artifactState"`
		CancellationRequestedAt *string                              `json:"cancellationRequestedAt"`
		CreatedAt               string                               `json:"createdAt"`
		ExecutionTerminalAt     *string                              `json:"executionTerminalAt"`
		Id                      string                               `json:"id"`
		Kind                    CancelJobResponse202JobKind          `json:"kind"`
		Progress                *struct {
			CompletedItems int  `json:"completedItems"`
			EtaSeconds     *int `json:"etaSeconds"`
			FailedItems    int  `json:"failedItems"`
			QueuedItems    int  `json:"queuedItems"`
			RatePerMinute  *int `json:"ratePerMinute"`
		} `json:"progress"`
		ProjectId    *string                       `json:"projectId"`
		ReadyAt      *string                       `json:"readyAt"`
		ReviewReason *string                       `json:"reviewReason"`
		Status       CancelJobResponse202JobStatus `json:"status"`
		TargetUrl    *string                       `json:"targetUrl,omitempty"`
		UpdatedAt    string                        `json:"updatedAt"`
		WorkspaceId  string                        `json:"workspaceId"`
	} `json:"job"`
	Reason CancelJobResponse202Reason `json:"reason"`
}
type ListJobErrorsRequest any
type ListJobErrorsResponse200 struct {
	Data []struct {
		Code       string  `json:"code"`
		Detail     string  `json:"detail"`
		Id         string  `json:"id"`
		OccurredAt string  `json:"occurredAt"`
		Url        *string `json:"url"`
	} `json:"data"`
	NextCursor *string `json:"nextCursor"`
}
type ListJobResultsRequest any
type ListJobResultsResponse200 struct {
	Data       []ExecutionResultArtifact `json:"data"`
	NextCursor *string                   `json:"nextCursor"`
}
type MapUrlRequest struct {
	Cache *struct {
		CacheOnly     *bool `json:"cacheOnly,omitempty"`
		ForceFresh    *bool `json:"forceFresh,omitempty"`
		MaxAgeSeconds *int  `json:"maxAgeSeconds,omitempty"`
	} `json:"cache,omitempty"`
	Exhaustive            *bool                 `json:"exhaustive,omitempty"`
	IgnoreQueryParameters *bool                 `json:"ignoreQueryParameters,omitempty"`
	IncludeSubdomains     *bool                 `json:"includeSubdomains,omitempty"`
	Limit                 *int                  `json:"limit,omitempty"`
	ProjectId             *string               `json:"projectId,omitempty"`
	Sitemap               *MapUrlRequestSitemap `json:"sitemap,omitempty"`
	Timeout               *int                  `json:"timeout,omitempty"`
	Url                   string                `json:"url"`
}
type MapUrlResponse200 struct {
	Links []struct {
		Confidence       float64                                 `json:"confidence"`
		Depth            int                                     `json:"depth"`
		Description      *string                                 `json:"description"`
		EstimatedContent string                                  `json:"estimatedContent"`
		IncomingLinks    int                                     `json:"incomingLinks"`
		LastModified     *string                                 `json:"lastModified"`
		ParentUrl        *string                                 `json:"parentUrl,omitempty"`
		Priority         float64                                 `json:"priority"`
		Recommended      bool                                    `json:"recommended"`
		Sources          []MapUrlResponse200LinksItemSourcesItem `json:"sources"`
		Title            *string                                 `json:"title"`
		Url              string                                  `json:"url"`
	} `json:"links"`
	Success bool `json:"success"`
	Summary struct {
		DiscoveryConfidence   float64 `json:"discoveryConfidence"`
		EstimatedCompileTime  string  `json:"estimatedCompileTime"`
		EstimatedPages        int     `json:"estimatedPages"`
		EstimatedTokens       string  `json:"estimatedTokens"`
		Framework             *string `json:"framework"`
		Language              string  `json:"language"`
		RecommendedDepth      int     `json:"recommendedDepth"`
		RecommendedEntryPoint string  `json:"recommendedEntryPoint"`
		SitemapCoverage       float64 `json:"sitemapCoverage"`
		WebsiteType           string  `json:"websiteType"`
	} `json:"summary"`
	Usage struct {
		Credits int `json:"credits"`
	} `json:"usage"`
}
type GetCurrentUserRequest any
type GetCurrentUserResponse200 struct {
	CreatedAt   string  `json:"createdAt"`
	DisplayName *string `json:"displayName"`
	Email       *string `json:"email"`
	Id          string  `json:"id"`
	UpdatedAt   string  `json:"updatedAt"`
}
type ListPlansRequest any
type ListPlansResponse200 PlanCatalog
type ScrapeUrlRequest struct {
	Cache *struct {
		CacheOnly     *bool `json:"cacheOnly,omitempty"`
		ForceFresh    *bool `json:"forceFresh,omitempty"`
		MaxAgeSeconds *int  `json:"maxAgeSeconds,omitempty"`
	} `json:"cache,omitempty"`
	Formats   []ScrapeUrlRequestFormatsItem `json:"formats,omitempty"`
	ProjectId *string                       `json:"projectId,omitempty"`
	Url       string                        `json:"url"`
}
type ScrapeUrlResponse200 struct {
	Data struct {
		Ir *struct {
			ContentGraph struct {
				Nodes map[string]struct {
					Attributes    map[string]string `json:"attributes,omitempty"`
					Children      []string          `json:"children"`
					ChunkBoundary *bool             `json:"chunkBoundary,omitempty"`
					Content       *string           `json:"content,omitempty"`
					ContentHash   *string           `json:"contentHash,omitempty"`
					Id            string            `json:"id"`
					Language      *string           `json:"language,omitempty"`
					Level         *float64          `json:"level,omitempty"`
					Parent        string            `json:"parent"`
					Provenance    *struct {
						Selector string `json:"selector"`
						Tag      string `json:"tag"`
					} `json:"provenance,omitempty"`
					SemanticRole *string                                              `json:"semanticRole,omitempty"`
					Type         ScrapeUrlResponse200DataIrContentGraphNodesValueType `json:"type"`
				} `json:"nodes"`
				ReadingOrder []string `json:"readingOrder"`
			} `json:"contentGraph"`
			Metadata struct {
				Author               *string  `json:"author,omitempty"`
				CanonicalUrl         string   `json:"canonicalUrl"`
				Description          *string  `json:"description,omitempty"`
				DocumentHash         *string  `json:"documentHash,omitempty"`
				ExtractionConfidence *float64 `json:"extractionConfidence,omitempty"`
				Language             *string  `json:"language,omitempty"`
				PublishedDate        *string  `json:"publishedDate,omitempty"`
				Title                string   `json:"title"`
			} `json:"metadata"`
			Version string `json:"version"`
		} `json:"ir,omitempty"`
		Links    []string `json:"links,omitempty"`
		Markdown *string  `json:"markdown,omitempty"`
	} `json:"data"`
	Metadata struct {
		Author               *string  `json:"author,omitempty"`
		CanonicalUrl         string   `json:"canonicalUrl"`
		Description          *string  `json:"description,omitempty"`
		DocumentHash         *string  `json:"documentHash,omitempty"`
		ExtractionConfidence *float64 `json:"extractionConfidence,omitempty"`
		Language             *string  `json:"language,omitempty"`
		PublishedDate        *string  `json:"publishedDate,omitempty"`
		Title                string   `json:"title"`
	} `json:"metadata"`
	Usage struct {
		Credits int `json:"credits"`
	} `json:"usage"`
}
type ListWorkspacesRequest any
type ListWorkspacesResponse200 struct {
	Data []struct {
		CreatedAt      string `json:"createdAt"`
		DefaultProject *struct {
			Id   string `json:"id"`
			Name string `json:"name"`
			Slug string `json:"slug"`
		} `json:"defaultProject"`
		Id           string `json:"id"`
		IsPrimary    bool   `json:"isPrimary"`
		Name         string `json:"name"`
		PlanSnapshot struct {
			Features []struct {
				Enabled bool   `json:"enabled"`
				Key     string `json:"key"`
			} `json:"features"`
			Id     string `json:"id"`
			Limits []struct {
				Key   string `json:"key"`
				Unit  string `json:"unit"`
				Value *int   `json:"value"`
			} `json:"limits"`
			Plan struct {
				Code    string `json:"code"`
				Version int    `json:"version"`
			} `json:"plan"`
			SchemaVersion   float64 `json:"schemaVersion"`
			SnapshotVersion int     `json:"snapshotVersion"`
		} `json:"planSnapshot"`
		Role      ListWorkspacesResponse200DataItemRole   `json:"role"`
		Slug      string                                  `json:"slug"`
		Status    ListWorkspacesResponse200DataItemStatus `json:"status"`
		UpdatedAt string                                  `json:"updatedAt"`
		Version   int                                     `json:"version"`
	} `json:"data"`
	NextCursor *string `json:"nextCursor"`
}
type CreateWorkspaceRequest struct {
	Name string `json:"name"`
	Slug string `json:"slug"`
}
type CreateWorkspaceResponse201 struct {
	CreatedAt      string `json:"createdAt"`
	DefaultProject *struct {
		Id   string `json:"id"`
		Name string `json:"name"`
		Slug string `json:"slug"`
	} `json:"defaultProject"`
	Id           string `json:"id"`
	IsPrimary    bool   `json:"isPrimary"`
	Name         string `json:"name"`
	PlanSnapshot struct {
		Features []struct {
			Enabled bool   `json:"enabled"`
			Key     string `json:"key"`
		} `json:"features"`
		Id     string `json:"id"`
		Limits []struct {
			Key   string `json:"key"`
			Unit  string `json:"unit"`
			Value *int   `json:"value"`
		} `json:"limits"`
		Plan struct {
			Code    string `json:"code"`
			Version int    `json:"version"`
		} `json:"plan"`
		SchemaVersion   float64 `json:"schemaVersion"`
		SnapshotVersion int     `json:"snapshotVersion"`
	} `json:"planSnapshot"`
	Role      CreateWorkspaceResponse201Role   `json:"role"`
	Slug      string                           `json:"slug"`
	Status    CreateWorkspaceResponse201Status `json:"status"`
	UpdatedAt string                           `json:"updatedAt"`
	Version   int                              `json:"version"`
}
type ResolveWorkspaceBySlugRequest any
type ResolveWorkspaceBySlugResponse200 struct {
	ContractVersion ResolveWorkspaceBySlugResponse200ContractVersion `json:"contractVersion"`
	Workspace       struct {
		CreatedAt      string `json:"createdAt"`
		DefaultProject *struct {
			Id   string `json:"id"`
			Name string `json:"name"`
			Slug string `json:"slug"`
		} `json:"defaultProject"`
		Id           string `json:"id"`
		IsPrimary    bool   `json:"isPrimary"`
		Name         string `json:"name"`
		PlanSnapshot struct {
			Features []struct {
				Enabled bool   `json:"enabled"`
				Key     string `json:"key"`
			} `json:"features"`
			Id     string `json:"id"`
			Limits []struct {
				Key   string `json:"key"`
				Unit  string `json:"unit"`
				Value *int   `json:"value"`
			} `json:"limits"`
			Plan struct {
				Code    string `json:"code"`
				Version int    `json:"version"`
			} `json:"plan"`
			SchemaVersion   float64 `json:"schemaVersion"`
			SnapshotVersion int     `json:"snapshotVersion"`
		} `json:"planSnapshot"`
		Role      ResolveWorkspaceBySlugResponse200WorkspaceRole   `json:"role"`
		Slug      string                                           `json:"slug"`
		Status    ResolveWorkspaceBySlugResponse200WorkspaceStatus `json:"status"`
		UpdatedAt string                                           `json:"updatedAt"`
		Version   int                                              `json:"version"`
	} `json:"workspace"`
}
type GetWorkspaceRequest any
type GetWorkspaceResponse200 struct {
	CreatedAt      string `json:"createdAt"`
	DefaultProject *struct {
		Id   string `json:"id"`
		Name string `json:"name"`
		Slug string `json:"slug"`
	} `json:"defaultProject"`
	Id           string `json:"id"`
	IsPrimary    bool   `json:"isPrimary"`
	Name         string `json:"name"`
	PlanSnapshot struct {
		Features []struct {
			Enabled bool   `json:"enabled"`
			Key     string `json:"key"`
		} `json:"features"`
		Id     string `json:"id"`
		Limits []struct {
			Key   string `json:"key"`
			Unit  string `json:"unit"`
			Value *int   `json:"value"`
		} `json:"limits"`
		Plan struct {
			Code    string `json:"code"`
			Version int    `json:"version"`
		} `json:"plan"`
		SchemaVersion   float64 `json:"schemaVersion"`
		SnapshotVersion int     `json:"snapshotVersion"`
	} `json:"planSnapshot"`
	Role      GetWorkspaceResponse200Role   `json:"role"`
	Slug      string                        `json:"slug"`
	Status    GetWorkspaceResponse200Status `json:"status"`
	UpdatedAt string                        `json:"updatedAt"`
	Version   int                           `json:"version"`
}
type DeleteWorkspaceRequest any
type DeleteWorkspaceResponse202 struct {
	CompletedAt *string                         `json:"completedAt"`
	Id          string                          `json:"id"`
	RequestedAt string                          `json:"requestedAt"`
	Stage       DeleteWorkspaceResponse202Stage `json:"stage"`
	UpdatedAt   string                          `json:"updatedAt"`
	WorkspaceId string                          `json:"workspaceId"`
}
type UpdateWorkspaceRequest struct {
	Name string `json:"name"`
}
type UpdateWorkspaceResponse200 struct {
	CreatedAt      string `json:"createdAt"`
	DefaultProject *struct {
		Id   string `json:"id"`
		Name string `json:"name"`
		Slug string `json:"slug"`
	} `json:"defaultProject"`
	Id           string `json:"id"`
	IsPrimary    bool   `json:"isPrimary"`
	Name         string `json:"name"`
	PlanSnapshot struct {
		Features []struct {
			Enabled bool   `json:"enabled"`
			Key     string `json:"key"`
		} `json:"features"`
		Id     string `json:"id"`
		Limits []struct {
			Key   string `json:"key"`
			Unit  string `json:"unit"`
			Value *int   `json:"value"`
		} `json:"limits"`
		Plan struct {
			Code    string `json:"code"`
			Version int    `json:"version"`
		} `json:"plan"`
		SchemaVersion   float64 `json:"schemaVersion"`
		SnapshotVersion int     `json:"snapshotVersion"`
	} `json:"planSnapshot"`
	Role      UpdateWorkspaceResponse200Role   `json:"role"`
	Slug      string                           `json:"slug"`
	Status    UpdateWorkspaceResponse200Status `json:"status"`
	UpdatedAt string                           `json:"updatedAt"`
	Version   int                              `json:"version"`
}
type ListApiKeysRequest any
type ListApiKeysResponse200 struct {
	Data []struct {
		CreatedAt         string                                     `json:"createdAt"`
		DeprecatedAt      *string                                    `json:"deprecatedAt"`
		ExpiresAt         *string                                    `json:"expiresAt"`
		FingerprintSuffix *string                                    `json:"fingerprintSuffix"`
		Id                string                                     `json:"id"`
		IpAllowlist       *[]string                                  `json:"ipAllowlist"`
		Kind              *ListApiKeysResponse200DataItemKind        `json:"kind,omitempty"`
		LastUsedAt        *string                                    `json:"lastUsedAt"`
		Name              string                                     `json:"name"`
		Prefix            string                                     `json:"prefix"`
		ProjectId         *string                                    `json:"projectId"`
		RevokedAt         *string                                    `json:"revokedAt"`
		Scopes            []ListApiKeysResponse200DataItemScopesItem `json:"scopes"`
		WorkspaceId       string                                     `json:"workspaceId"`
	} `json:"data"`
	NextCursor *string `json:"nextCursor"`
}
type CreateApiKeyRequest struct {
	ExpiresAt   *string                         `json:"expiresAt,omitempty"`
	IpAllowlist *[]string                       `json:"ipAllowlist,omitempty"`
	Name        string                          `json:"name"`
	ProjectId   *string                         `json:"projectId,omitempty"`
	Scopes      []CreateApiKeyRequestScopesItem `json:"scopes"`
}
type CreateApiKeyResponse201 struct {
	CreatedAt         string                              `json:"createdAt"`
	DeprecatedAt      *string                             `json:"deprecatedAt"`
	ExpiresAt         *string                             `json:"expiresAt"`
	FingerprintSuffix *string                             `json:"fingerprintSuffix"`
	Id                string                              `json:"id"`
	IpAllowlist       *[]string                           `json:"ipAllowlist"`
	Kind              *CreateApiKeyResponse201Kind        `json:"kind,omitempty"`
	LastUsedAt        *string                             `json:"lastUsedAt"`
	Name              string                              `json:"name"`
	Prefix            string                              `json:"prefix"`
	ProjectId         *string                             `json:"projectId"`
	RevokedAt         *string                             `json:"revokedAt"`
	Scopes            []CreateApiKeyResponse201ScopesItem `json:"scopes"`
	Secret            string                              `json:"secret"`
	WorkspaceId       string                              `json:"workspaceId"`
}
type GetApiKeyRequest any
type GetApiKeyResponse200 struct {
	CreatedAt         string                           `json:"createdAt"`
	DeprecatedAt      *string                          `json:"deprecatedAt"`
	ExpiresAt         *string                          `json:"expiresAt"`
	FingerprintSuffix *string                          `json:"fingerprintSuffix"`
	Id                string                           `json:"id"`
	IpAllowlist       *[]string                        `json:"ipAllowlist"`
	Kind              *GetApiKeyResponse200Kind        `json:"kind,omitempty"`
	LastUsedAt        *string                          `json:"lastUsedAt"`
	Name              string                           `json:"name"`
	Prefix            string                           `json:"prefix"`
	ProjectId         *string                          `json:"projectId"`
	RevokedAt         *string                          `json:"revokedAt"`
	Scopes            []GetApiKeyResponse200ScopesItem `json:"scopes"`
	WorkspaceId       string                           `json:"workspaceId"`
}
type RevokeApiKeyRequest any
type RevokeApiKeyResponse204 any
type RegenerateApiKeyRequest any
type RegenerateApiKeyResponse200 struct {
	CreatedAt         string                                  `json:"createdAt"`
	DeprecatedAt      *string                                 `json:"deprecatedAt"`
	ExpiresAt         *string                                 `json:"expiresAt"`
	FingerprintSuffix *string                                 `json:"fingerprintSuffix"`
	Id                string                                  `json:"id"`
	IpAllowlist       *[]string                               `json:"ipAllowlist"`
	Kind              *RegenerateApiKeyResponse200Kind        `json:"kind,omitempty"`
	LastUsedAt        *string                                 `json:"lastUsedAt"`
	Name              string                                  `json:"name"`
	Prefix            string                                  `json:"prefix"`
	ProjectId         *string                                 `json:"projectId"`
	RevokedAt         *string                                 `json:"revokedAt"`
	Scopes            []RegenerateApiKeyResponse200ScopesItem `json:"scopes"`
	Secret            string                                  `json:"secret"`
	WorkspaceId       string                                  `json:"workspaceId"`
}
type RollApiKeyRequest any
type RollApiKeyResponse200 struct {
	CreatedAt         string                            `json:"createdAt"`
	DeprecatedAt      *string                           `json:"deprecatedAt"`
	ExpiresAt         *string                           `json:"expiresAt"`
	FingerprintSuffix *string                           `json:"fingerprintSuffix"`
	Id                string                            `json:"id"`
	IpAllowlist       *[]string                         `json:"ipAllowlist"`
	Kind              *RollApiKeyResponse200Kind        `json:"kind,omitempty"`
	LastUsedAt        *string                           `json:"lastUsedAt"`
	Name              string                            `json:"name"`
	Prefix            string                            `json:"prefix"`
	ProjectId         *string                           `json:"projectId"`
	RevokedAt         *string                           `json:"revokedAt"`
	Scopes            []RollApiKeyResponse200ScopesItem `json:"scopes"`
	Secret            string                            `json:"secret"`
	WorkspaceId       string                            `json:"workspaceId"`
}
type RotateApiKeyRequest any
type RotateApiKeyResponse200 struct {
	CreatedAt         string                              `json:"createdAt"`
	DeprecatedAt      *string                             `json:"deprecatedAt"`
	ExpiresAt         *string                             `json:"expiresAt"`
	FingerprintSuffix *string                             `json:"fingerprintSuffix"`
	Id                string                              `json:"id"`
	IpAllowlist       *[]string                           `json:"ipAllowlist"`
	Kind              *RotateApiKeyResponse200Kind        `json:"kind,omitempty"`
	LastUsedAt        *string                             `json:"lastUsedAt"`
	Name              string                              `json:"name"`
	Prefix            string                              `json:"prefix"`
	ProjectId         *string                             `json:"projectId"`
	RevokedAt         *string                             `json:"revokedAt"`
	Scopes            []RotateApiKeyResponse200ScopesItem `json:"scopes"`
	Secret            string                              `json:"secret"`
	WorkspaceId       string                              `json:"workspaceId"`
}
type CreateBillingCheckoutRequest struct {
	BillingCycle *CreateBillingCheckoutRequestBillingCycle `json:"billingCycle,omitempty"`
	PlanCode     string                                    `json:"planCode"`
}
type CreateBillingCheckoutResponse200 struct {
	Url string `json:"url"`
}
type ReconcileBillingCheckoutRequest struct {
	IntentId  *string `json:"intentId,omitempty"`
	PaymentId *string `json:"paymentId,omitempty"`
	SessionId *string `json:"sessionId,omitempty"`
}
type ReconcileBillingCheckoutResponse200 struct {
	BoostCode    *string                                   `json:"boostCode,omitempty"`
	PlanCode     string                                    `json:"planCode"`
	PlanVersion  int                                       `json:"planVersion"`
	Reconciled   bool                                      `json:"reconciled"`
	Status       ReconcileBillingCheckoutResponse200Status `json:"status"`
	TopupCredits *int                                      `json:"topupCredits,omitempty"`
	Type         *ReconcileBillingCheckoutResponse200Type  `json:"type,omitempty"`
}
type GetBillingInvoicesRequest any
type GetBillingInvoicesResponse200 struct {
	Invoices []struct {
		AmountPaidCents   int                                             `json:"amountPaidCents"`
		CreatedAt         string                                          `json:"createdAt"`
		Currency          string                                          `json:"currency"`
		HostedInvoiceUrl  *string                                         `json:"hostedInvoiceUrl"`
		Id                string                                          `json:"id"`
		PaidAt            *string                                         `json:"paidAt"`
		PeriodEnd         *string                                         `json:"periodEnd"`
		PeriodStart       *string                                         `json:"periodStart"`
		ProviderInvoiceId string                                          `json:"providerInvoiceId"`
		Status            GetBillingInvoicesResponse200InvoicesItemStatus `json:"status"`
	} `json:"invoices"`
}
type CreateBillingPortalRequest any
type CreateBillingPortalResponse200 struct {
	Url string `json:"url"`
}
type PreviewBillingRequest struct {
	BillingCycle *PreviewBillingRequestBillingCycle `json:"billingCycle,omitempty"`
	PlanCode     string                             `json:"planCode"`
}
type PreviewBillingResponse200 struct {
	AmountDueNowCents    int                                   `json:"amountDueNowCents"`
	AmountDueNowCurrency string                                `json:"amountDueNowCurrency"`
	BillingCycle         PreviewBillingResponse200BillingCycle `json:"billingCycle"`
	CreditDelta          int                                   `json:"creditDelta"`
	EffectiveAt          string                                `json:"effectiveAt"`
}
type GetBillingSubscriptionRequest any
type GetBillingSubscriptionResponse200 struct {
	CancelAtPeriodEnd bool    `json:"cancelAtPeriodEnd"`
	GraceExpiresAt    *string `json:"graceExpiresAt"`
	PendingPlan       *struct {
		EffectiveAt string `json:"effectiveAt"`
		PlanCode    string `json:"planCode"`
		PlanVersion int    `json:"planVersion"`
	} `json:"pendingPlan"`
	PeriodEnd   *string                                 `json:"periodEnd"`
	PeriodStart *string                                 `json:"periodStart"`
	PlanCode    string                                  `json:"planCode"`
	PlanVersion int                                     `json:"planVersion"`
	Status      GetBillingSubscriptionResponse200Status `json:"status"`
	UpdatedAt   string                                  `json:"updatedAt"`
	WorkspaceId string                                  `json:"workspaceId"`
}
type CreateBillingTopupCheckoutRequest struct {
	BoostCode CreateBillingTopupCheckoutRequestBoostCode `json:"boostCode"`
}
type CreateBillingTopupCheckoutResponse200 struct {
	Url string `json:"url"`
}
type GetBillingTopupCatalogRequest any
type GetBillingTopupCatalogResponse200 struct {
	ActiveTopupCredits int     `json:"activeTopupCredits"`
	EarliestExpiresAt  *string `json:"earliestExpiresAt"`
	Eligible           bool    `json:"eligible"`
	IneligibleReason   *string `json:"ineligibleReason"`
	Tiers              []struct {
		AmountCents       int                                                 `json:"amountCents"`
		BoostCode         GetBillingTopupCatalogResponse200TiersItemBoostCode `json:"boostCode"`
		CostPerCredit     float64                                             `json:"costPerCredit"`
		Credits           int                                                 `json:"credits"`
		Currency          string                                              `json:"currency"`
		ProviderProductId string                                              `json:"providerProductId"`
		SavingsPercent    float64                                             `json:"savingsPercent"`
	} `json:"tiers"`
	WorkspaceId string `json:"workspaceId"`
}
type GetWorkspaceDeletionRequest any
type GetWorkspaceDeletionResponse200 struct {
	CompletedAt *string                              `json:"completedAt"`
	Id          string                               `json:"id"`
	RequestedAt string                               `json:"requestedAt"`
	Stage       GetWorkspaceDeletionResponse200Stage `json:"stage"`
	UpdatedAt   string                               `json:"updatedAt"`
	WorkspaceId string                               `json:"workspaceId"`
}
type ListWorkspaceInvitationsRequest any
type ListWorkspaceInvitationsResponse200 struct {
	Data []struct {
		CreatedAt string                                            `json:"createdAt"`
		Email     string                                            `json:"email"`
		ExpiresAt *string                                           `json:"expiresAt"`
		Id        string                                            `json:"id"`
		Role      ListWorkspaceInvitationsResponse200DataItemRole   `json:"role"`
		Status    ListWorkspaceInvitationsResponse200DataItemStatus `json:"status"`
		UpdatedAt string                                            `json:"updatedAt"`
	} `json:"data"`
	NextCursor *string `json:"nextCursor"`
}
type CreateWorkspaceInvitationRequest struct {
	Email          string                               `json:"email"`
	ExpiresInHours *int                                 `json:"expiresInHours,omitempty"`
	Role           CreateWorkspaceInvitationRequestRole `json:"role"`
}
type CreateWorkspaceInvitationResponse201 struct {
	CreatedAt string                                     `json:"createdAt"`
	Email     string                                     `json:"email"`
	ExpiresAt *string                                    `json:"expiresAt"`
	Id        string                                     `json:"id"`
	Role      CreateWorkspaceInvitationResponse201Role   `json:"role"`
	Status    CreateWorkspaceInvitationResponse201Status `json:"status"`
	Token     string                                     `json:"token"`
	UpdatedAt string                                     `json:"updatedAt"`
}
type AcceptWorkspaceInvitationRequest struct {
	Token string `json:"token"`
}
type AcceptWorkspaceInvitationResponse200 struct {
	CreatedAt string                                     `json:"createdAt"`
	Email     string                                     `json:"email"`
	ExpiresAt *string                                    `json:"expiresAt"`
	Id        string                                     `json:"id"`
	Role      AcceptWorkspaceInvitationResponse200Role   `json:"role"`
	Status    AcceptWorkspaceInvitationResponse200Status `json:"status"`
	UpdatedAt string                                     `json:"updatedAt"`
}
type RevokeWorkspaceInvitationRequest any
type RevokeWorkspaceInvitationResponse204 any
type LeaveWorkspaceRequest any
type LeaveWorkspaceResponse204 any
type ListWorkspaceMembersRequest any
type ListWorkspaceMembersResponse200 struct {
	Data []struct {
		CreatedAt   string                                      `json:"createdAt"`
		DisplayName *string                                     `json:"displayName"`
		Email       *string                                     `json:"email"`
		Role        ListWorkspaceMembersResponse200DataItemRole `json:"role"`
		UpdatedAt   string                                      `json:"updatedAt"`
		UserId      string                                      `json:"userId"`
	} `json:"data"`
	NextCursor *string `json:"nextCursor"`
}
type RemoveWorkspaceMemberRequest any
type RemoveWorkspaceMemberResponse204 any
type UpdateWorkspaceMemberRequest struct {
	Role UpdateWorkspaceMemberRequestRole `json:"role"`
}
type UpdateWorkspaceMemberResponse200 struct {
	CreatedAt   string                               `json:"createdAt"`
	DisplayName *string                              `json:"displayName"`
	Email       *string                              `json:"email"`
	Role        UpdateWorkspaceMemberResponse200Role `json:"role"`
	UpdatedAt   string                               `json:"updatedAt"`
	UserId      string                               `json:"userId"`
}
type TransferWorkspaceOwnershipRequest any
type TransferWorkspaceOwnershipResponse200 struct {
	CreatedAt   string                                    `json:"createdAt"`
	DisplayName *string                                   `json:"displayName"`
	Email       *string                                   `json:"email"`
	Role        TransferWorkspaceOwnershipResponse200Role `json:"role"`
	UpdatedAt   string                                    `json:"updatedAt"`
	UserId      string                                    `json:"userId"`
}
type GetWorkspaceOverviewRequest any
type GetWorkspaceOverviewResponse200 struct {
	ActiveJobs []struct {
		ArtifactExpiresAt       *string                                                    `json:"artifactExpiresAt"`
		ArtifactState           GetWorkspaceOverviewResponse200ActiveJobsItemArtifactState `json:"artifactState"`
		CancellationRequestedAt *string                                                    `json:"cancellationRequestedAt"`
		CreatedAt               string                                                     `json:"createdAt"`
		ExecutionTerminalAt     *string                                                    `json:"executionTerminalAt"`
		Id                      string                                                     `json:"id"`
		Kind                    GetWorkspaceOverviewResponse200ActiveJobsItemKind          `json:"kind"`
		Progress                *struct {
			CompletedItems int  `json:"completedItems"`
			EtaSeconds     *int `json:"etaSeconds"`
			FailedItems    int  `json:"failedItems"`
			QueuedItems    int  `json:"queuedItems"`
			RatePerMinute  *int `json:"ratePerMinute"`
		} `json:"progress"`
		ProjectId    *string                                             `json:"projectId"`
		ReadyAt      *string                                             `json:"readyAt"`
		ReviewReason *string                                             `json:"reviewReason"`
		Status       GetWorkspaceOverviewResponse200ActiveJobsItemStatus `json:"status"`
		TargetUrl    *string                                             `json:"targetUrl,omitempty"`
		UpdatedAt    string                                              `json:"updatedAt"`
		WorkspaceId  string                                              `json:"workspaceId"`
	} `json:"activeJobs"`
	Counts struct {
		ApiKeys  int `json:"apiKeys"`
		Projects int `json:"projects"`
		Webhooks int `json:"webhooks"`
	} `json:"counts"`
	Onboarding struct {
		HasConfiguredWebhook bool `json:"hasConfiguredWebhook"`
		HasCreatedApiKey     bool `json:"hasCreatedApiKey"`
		HasInvitedTeammate   bool `json:"hasInvitedTeammate"`
		HasRunCompile        bool `json:"hasRunCompile"`
	} `json:"onboarding"`
	Plan struct {
		CancelAtPeriodEnd *bool   `json:"cancelAtPeriodEnd"`
		Code              string  `json:"code"`
		GraceExpiresAt    *string `json:"graceExpiresAt"`
		RenewalAt         *string `json:"renewalAt"`
		Status            *string `json:"status"`
	} `json:"plan"`
	RecentErrors []struct {
		ArtifactExpiresAt       *string                                                      `json:"artifactExpiresAt"`
		ArtifactState           GetWorkspaceOverviewResponse200RecentErrorsItemArtifactState `json:"artifactState"`
		CancellationRequestedAt *string                                                      `json:"cancellationRequestedAt"`
		CreatedAt               string                                                       `json:"createdAt"`
		ExecutionTerminalAt     *string                                                      `json:"executionTerminalAt"`
		Id                      string                                                       `json:"id"`
		Kind                    GetWorkspaceOverviewResponse200RecentErrorsItemKind          `json:"kind"`
		Progress                *struct {
			CompletedItems int  `json:"completedItems"`
			EtaSeconds     *int `json:"etaSeconds"`
			FailedItems    int  `json:"failedItems"`
			QueuedItems    int  `json:"queuedItems"`
			RatePerMinute  *int `json:"ratePerMinute"`
		} `json:"progress"`
		ProjectId    *string                                               `json:"projectId"`
		ReadyAt      *string                                               `json:"readyAt"`
		ReviewReason *string                                               `json:"reviewReason"`
		Status       GetWorkspaceOverviewResponse200RecentErrorsItemStatus `json:"status"`
		TargetUrl    *string                                               `json:"targetUrl,omitempty"`
		UpdatedAt    string                                                `json:"updatedAt"`
		WorkspaceId  string                                                `json:"workspaceId"`
	} `json:"recentErrors"`
	RecentJobs []struct {
		ArtifactExpiresAt       *string                                                    `json:"artifactExpiresAt"`
		ArtifactState           GetWorkspaceOverviewResponse200RecentJobsItemArtifactState `json:"artifactState"`
		CancellationRequestedAt *string                                                    `json:"cancellationRequestedAt"`
		CreatedAt               string                                                     `json:"createdAt"`
		ExecutionTerminalAt     *string                                                    `json:"executionTerminalAt"`
		Id                      string                                                     `json:"id"`
		Kind                    GetWorkspaceOverviewResponse200RecentJobsItemKind          `json:"kind"`
		Progress                *struct {
			CompletedItems int  `json:"completedItems"`
			EtaSeconds     *int `json:"etaSeconds"`
			FailedItems    int  `json:"failedItems"`
			QueuedItems    int  `json:"queuedItems"`
			RatePerMinute  *int `json:"ratePerMinute"`
		} `json:"progress"`
		ProjectId    *string                                             `json:"projectId"`
		ReadyAt      *string                                             `json:"readyAt"`
		ReviewReason *string                                             `json:"reviewReason"`
		Status       GetWorkspaceOverviewResponse200RecentJobsItemStatus `json:"status"`
		TargetUrl    *string                                             `json:"targetUrl,omitempty"`
		UpdatedAt    string                                              `json:"updatedAt"`
		WorkspaceId  string                                              `json:"workspaceId"`
	} `json:"recentJobs"`
	Usage struct {
		Allowance     int `json:"allowance"`
		Consumed      int `json:"consumed"`
		DailyConsumed []struct {
			Consumed int `json:"consumed"`
			Day      int `json:"day"`
		} `json:"dailyConsumed"`
		GrantCreditsRemaining int    `json:"grantCreditsRemaining"`
		PeriodEnd             string `json:"periodEnd"`
		PeriodStart           string `json:"periodStart"`
		Reserved              int    `json:"reserved"`
	} `json:"usage"`
	WorkspaceId string `json:"workspaceId"`
}
type ListProjectsRequest any
type ListProjectsResponse200 struct {
	Data []struct {
		CreatedAt   string                                `json:"createdAt"`
		DeletedAt   *string                               `json:"deletedAt"`
		Id          string                                `json:"id"`
		Name        string                                `json:"name"`
		Slug        string                                `json:"slug"`
		Status      ListProjectsResponse200DataItemStatus `json:"status"`
		UpdatedAt   string                                `json:"updatedAt"`
		Version     int                                   `json:"version"`
		WorkspaceId string                                `json:"workspaceId"`
	} `json:"data"`
	NextCursor *string `json:"nextCursor"`
}
type CreateProjectRequest struct {
	Name string `json:"name"`
	Slug string `json:"slug"`
}
type CreateProjectResponse201 struct {
	CreatedAt   string                         `json:"createdAt"`
	DeletedAt   *string                        `json:"deletedAt"`
	Id          string                         `json:"id"`
	Name        string                         `json:"name"`
	Slug        string                         `json:"slug"`
	Status      CreateProjectResponse201Status `json:"status"`
	UpdatedAt   string                         `json:"updatedAt"`
	Version     int                            `json:"version"`
	WorkspaceId string                         `json:"workspaceId"`
}
type GetProjectsStatsRequest any
type GetProjectsStatsResponse200 map[string]struct {
	ActiveJobs      int     `json:"activeJobs"`
	CreditsConsumed int     `json:"creditsConsumed"`
	FailedJobs      int     `json:"failedJobs"`
	LastActivityAt  *string `json:"lastActivityAt"`
	TotalJobs       int     `json:"totalJobs"`
}
type GetProjectRequest any
type GetProjectResponse200 struct {
	CreatedAt   string                      `json:"createdAt"`
	DeletedAt   *string                     `json:"deletedAt"`
	Id          string                      `json:"id"`
	Name        string                      `json:"name"`
	Slug        string                      `json:"slug"`
	Status      GetProjectResponse200Status `json:"status"`
	UpdatedAt   string                      `json:"updatedAt"`
	Version     int                         `json:"version"`
	WorkspaceId string                      `json:"workspaceId"`
}
type DeleteProjectRequest any
type DeleteProjectResponse204 any
type UpdateProjectRequest struct {
	Name *string `json:"name,omitempty"`
	Slug *string `json:"slug,omitempty"`
}
type UpdateProjectResponse200 struct {
	CreatedAt   string                         `json:"createdAt"`
	DeletedAt   *string                        `json:"deletedAt"`
	Id          string                         `json:"id"`
	Name        string                         `json:"name"`
	Slug        string                         `json:"slug"`
	Status      UpdateProjectResponse200Status `json:"status"`
	UpdatedAt   string                         `json:"updatedAt"`
	Version     int                            `json:"version"`
	WorkspaceId string                         `json:"workspaceId"`
}
type GetUsageRequest any
type GetUsageResponse200 struct {
	Accounts []struct {
		Allowance   int                                   `json:"allowance"`
		BlockReason *string                               `json:"blockReason"`
		BlockedAt   *string                               `json:"blockedAt"`
		Consumed    int                                   `json:"consumed"`
		Metric      GetUsageResponse200AccountsItemMetric `json:"metric"`
		PeriodEnd   string                                `json:"periodEnd"`
		PeriodStart string                                `json:"periodStart"`
		Reserved    int                                   `json:"reserved"`
		UpdatedAt   string                                `json:"updatedAt"`
	} `json:"accounts"`
	Grants []struct {
		Consumed  int                                 `json:"consumed"`
		ExpiresAt *string                             `json:"expiresAt"`
		Id        *string                             `json:"id,omitempty"`
		Metric    GetUsageResponse200GrantsItemMetric `json:"metric"`
		Source    *string                             `json:"source,omitempty"`
		Units     int                                 `json:"units"`
	} `json:"grants"`
	Plan struct {
		Code    string `json:"code"`
		Version int    `json:"version"`
	} `json:"plan"`
}
type ListUsageLedgerRequest any
type ListUsageLedgerResponse200 struct {
	Data []struct {
		ConsumedDelta int                                         `json:"consumedDelta"`
		CreatedAt     string                                      `json:"createdAt"`
		EntryType     ListUsageLedgerResponse200DataItemEntryType `json:"entryType"`
		EventKey      string                                      `json:"eventKey"`
		Id            string                                      `json:"id"`
		Metadata      *map[string]JsonValue                       `json:"metadata"`
		Metric        ListUsageLedgerResponse200DataItemMetric    `json:"metric"`
		PeriodStart   string                                      `json:"periodStart"`
		ReservationId *string                                     `json:"reservationId"`
		ReservedDelta int                                         `json:"reservedDelta"`
		Source        string                                      `json:"source"`
	} `json:"data"`
	NextCursor *string `json:"nextCursor"`
}
type ListWorkspaceWebhookDeliveriesRequest any
type ListWorkspaceWebhookDeliveriesResponse200 struct {
	Data []struct {
		AttemptCount        int                                                          `json:"attemptCount"`
		CreatedAt           string                                                       `json:"createdAt"`
		DestinationUrl      *string                                                      `json:"destinationUrl,omitempty"`
		EndpointId          *string                                                      `json:"endpointId,omitempty"`
		EventId             string                                                       `json:"eventId"`
		EventType           ListWorkspaceWebhookDeliveriesResponse200DataItemEventType   `json:"eventType"`
		Id                  string                                                       `json:"id"`
		JobId               *string                                                      `json:"jobId,omitempty"`
		LastError           *string                                                      `json:"lastError"`
		LastStatusCode      *int                                                         `json:"lastStatusCode"`
		NextAttemptAt       *string                                                      `json:"nextAttemptAt"`
		ResponseCompletedAt *string                                                      `json:"responseCompletedAt"`
		SourceType          *ListWorkspaceWebhookDeliveriesResponse200DataItemSourceType `json:"sourceType,omitempty"`
		Status              ListWorkspaceWebhookDeliveriesResponse200DataItemStatus      `json:"status"`
		UpdatedAt           string                                                       `json:"updatedAt"`
	} `json:"data"`
	NextCursor *string `json:"nextCursor"`
}
type GetWorkspaceWebhookDeliveryRequest any
type GetWorkspaceWebhookDeliveryResponse200 struct {
	AttemptCount        int                                               `json:"attemptCount"`
	CreatedAt           string                                            `json:"createdAt"`
	DestinationUrl      *string                                           `json:"destinationUrl,omitempty"`
	EndpointId          *string                                           `json:"endpointId,omitempty"`
	EventId             string                                            `json:"eventId"`
	EventType           GetWorkspaceWebhookDeliveryResponse200EventType   `json:"eventType"`
	Id                  string                                            `json:"id"`
	JobId               *string                                           `json:"jobId,omitempty"`
	LastError           *string                                           `json:"lastError"`
	LastStatusCode      *int                                              `json:"lastStatusCode"`
	NextAttemptAt       *string                                           `json:"nextAttemptAt"`
	ResponseCompletedAt *string                                           `json:"responseCompletedAt"`
	SourceType          *GetWorkspaceWebhookDeliveryResponse200SourceType `json:"sourceType,omitempty"`
	Status              GetWorkspaceWebhookDeliveryResponse200Status      `json:"status"`
	UpdatedAt           string                                            `json:"updatedAt"`
}
type ListWorkspaceWebhookDeliveryAttemptsRequest any
type ListWorkspaceWebhookDeliveryAttemptsResponse200 []struct {
	AttemptNumber   int     `json:"attemptNumber"`
	CompletedAt     *string `json:"completedAt"`
	ErrorCode       *string `json:"errorCode"`
	Outcome         string  `json:"outcome"`
	ResponseExcerpt *string `json:"responseExcerpt"`
	StartedAt       string  `json:"startedAt"`
	StatusCode      *int    `json:"statusCode"`
}
type RedeliverWorkspaceWebhookDeliveryRequest any
type RedeliverWorkspaceWebhookDeliveryResponse202 struct {
	DeliveryId string `json:"deliveryId"`
}
type GetWorkspaceWebhookSecretRequest any
type GetWorkspaceWebhookSecretResponse200 struct {
	Secret  string `json:"secret"`
	Version int    `json:"version"`
}
type RotateWorkspaceWebhookSecretRequest any
type RotateWorkspaceWebhookSecretResponse200 struct {
	GracePeriodSeconds int    `json:"gracePeriodSeconds"`
	Secret             string `json:"secret"`
	Version            int    `json:"version"`
}
type ListWebhookEndpointsRequest any
type ListWebhookEndpointsResponse200 struct {
	Data []struct {
		ConfigVersion           int                                                 `json:"configVersion"`
		ConsecutiveFailureCount *int                                                `json:"consecutiveFailureCount,omitempty"`
		CreatedAt               string                                              `json:"createdAt"`
		Events                  []ListWebhookEndpointsResponse200DataItemEventsItem `json:"events"`
		Id                      string                                              `json:"id"`
		LastFailureAt           *string                                             `json:"lastFailureAt,omitempty"`
		LastSuccessAt           *string                                             `json:"lastSuccessAt,omitempty"`
		ProjectId               *string                                             `json:"projectId,omitempty"`
		SigningSecretVersion    int                                                 `json:"signingSecretVersion"`
		Status                  ListWebhookEndpointsResponse200DataItemStatus       `json:"status"`
		UpdatedAt               string                                              `json:"updatedAt"`
		Url                     string                                              `json:"url"`
		WorkspaceId             string                                              `json:"workspaceId"`
	} `json:"data"`
	NextCursor *string `json:"nextCursor"`
}
type CreateWebhookEndpointRequest struct {
	Events    []CreateWebhookEndpointRequestEventsItem `json:"events"`
	ProjectId *string                                  `json:"projectId,omitempty"`
	Url       string                                   `json:"url"`
}
type CreateWebhookEndpointResponse201 struct {
	ConfigVersion           int                                          `json:"configVersion"`
	ConsecutiveFailureCount *int                                         `json:"consecutiveFailureCount,omitempty"`
	CreatedAt               string                                       `json:"createdAt"`
	Events                  []CreateWebhookEndpointResponse201EventsItem `json:"events"`
	Id                      string                                       `json:"id"`
	LastFailureAt           *string                                      `json:"lastFailureAt,omitempty"`
	LastSuccessAt           *string                                      `json:"lastSuccessAt,omitempty"`
	ProjectId               *string                                      `json:"projectId,omitempty"`
	Secret                  string                                       `json:"secret"`
	SigningSecretVersion    int                                          `json:"signingSecretVersion"`
	Status                  CreateWebhookEndpointResponse201Status       `json:"status"`
	UpdatedAt               string                                       `json:"updatedAt"`
	Url                     string                                       `json:"url"`
	WorkspaceId             string                                       `json:"workspaceId"`
}
type GetWebhookEndpointRequest any
type GetWebhookEndpointResponse200 struct {
	ConfigVersion           int                                       `json:"configVersion"`
	ConsecutiveFailureCount *int                                      `json:"consecutiveFailureCount,omitempty"`
	CreatedAt               string                                    `json:"createdAt"`
	Events                  []GetWebhookEndpointResponse200EventsItem `json:"events"`
	Id                      string                                    `json:"id"`
	LastFailureAt           *string                                   `json:"lastFailureAt,omitempty"`
	LastSuccessAt           *string                                   `json:"lastSuccessAt,omitempty"`
	ProjectId               *string                                   `json:"projectId,omitempty"`
	SigningSecretVersion    int                                       `json:"signingSecretVersion"`
	Status                  GetWebhookEndpointResponse200Status       `json:"status"`
	UpdatedAt               string                                    `json:"updatedAt"`
	Url                     string                                    `json:"url"`
	WorkspaceId             string                                    `json:"workspaceId"`
}
type DeleteWebhookEndpointRequest any
type DeleteWebhookEndpointResponse204 any
type UpdateWebhookEndpointRequest struct {
	ConfigVersion int                                      `json:"configVersion"`
	Events        []UpdateWebhookEndpointRequestEventsItem `json:"events,omitempty"`
	RotateSecret  *bool                                    `json:"rotateSecret,omitempty"`
	Status        *UpdateWebhookEndpointRequestStatus      `json:"status,omitempty"`
	Url           *string                                  `json:"url,omitempty"`
}
type UpdateWebhookEndpointResponse200 struct {
	ConfigVersion           int                                          `json:"configVersion"`
	ConsecutiveFailureCount *int                                         `json:"consecutiveFailureCount,omitempty"`
	CreatedAt               string                                       `json:"createdAt"`
	Events                  []UpdateWebhookEndpointResponse200EventsItem `json:"events"`
	Id                      string                                       `json:"id"`
	LastFailureAt           *string                                      `json:"lastFailureAt,omitempty"`
	LastSuccessAt           *string                                      `json:"lastSuccessAt,omitempty"`
	ProjectId               *string                                      `json:"projectId,omitempty"`
	Secret                  *string                                      `json:"secret,omitempty"`
	SigningSecretVersion    int                                          `json:"signingSecretVersion"`
	Status                  UpdateWebhookEndpointResponse200Status       `json:"status"`
	UpdatedAt               string                                       `json:"updatedAt"`
	Url                     string                                       `json:"url"`
	WorkspaceId             string                                       `json:"workspaceId"`
}
type ListWebhookDeliveriesRequest any
type ListWebhookDeliveriesResponse200 struct {
	Data []struct {
		AttemptCount        int                                                 `json:"attemptCount"`
		CreatedAt           string                                              `json:"createdAt"`
		DestinationUrl      *string                                             `json:"destinationUrl,omitempty"`
		EndpointId          *string                                             `json:"endpointId,omitempty"`
		EventId             string                                              `json:"eventId"`
		EventType           ListWebhookDeliveriesResponse200DataItemEventType   `json:"eventType"`
		Id                  string                                              `json:"id"`
		JobId               *string                                             `json:"jobId,omitempty"`
		LastError           *string                                             `json:"lastError"`
		LastStatusCode      *int                                                `json:"lastStatusCode"`
		NextAttemptAt       *string                                             `json:"nextAttemptAt"`
		ResponseCompletedAt *string                                             `json:"responseCompletedAt"`
		SourceType          *ListWebhookDeliveriesResponse200DataItemSourceType `json:"sourceType,omitempty"`
		Status              ListWebhookDeliveriesResponse200DataItemStatus      `json:"status"`
		UpdatedAt           string                                              `json:"updatedAt"`
	} `json:"data"`
	NextCursor *string `json:"nextCursor"`
}
type RedeliverWebhookDeliveryRequest any
type RedeliverWebhookDeliveryResponse202 struct {
	DeliveryId string `json:"deliveryId"`
}
type SendWebhookTestEventRequest struct {
	EventType SendWebhookTestEventRequestEventType `json:"eventType"`
}
type SendWebhookTestEventResponse202 struct {
	DeliveryId string `json:"deliveryId"`
	EventId    string `json:"eventId"`
}
type OperationID string

const (
	CreateBatch          OperationID = "createBatch"
	CompileUrl           OperationID = "compileUrl"
	CreateCrawl          OperationID = "createCrawl"
	ListJobs             OperationID = "listJobs"
	BulkCancelJobs       OperationID = "bulkCancelJobs"
	GetJob               OperationID = "getJob"
	CancelJob            OperationID = "cancelJob"
	ListJobErrors        OperationID = "listJobErrors"
	ListJobResults       OperationID = "listJobResults"
	MapUrl               OperationID = "mapUrl"
	ScrapeUrl            OperationID = "scrapeUrl"
	GetWorkspaceOverview OperationID = "getWorkspaceOverview"
	ListProjects         OperationID = "listProjects"
	GetProjectsStats     OperationID = "getProjectsStats"
	GetProject           OperationID = "getProject"
	GetUsage             OperationID = "getUsage"
	ListUsageLedger      OperationID = "listUsageLedger"
)

type Parameter struct {
	Name, In string
	Required bool
}
type Operation struct {
	Method, Path string
	Parameters   []Parameter
}

var Operations = map[OperationID]Operation{CreateBatch: {Method: "POST", Path: "/v1/batches", Parameters: []Parameter{{Name: "idempotency-key", In: "header", Required: false}}},
	CompileUrl:           {Method: "POST", Path: "/v1/compile", Parameters: []Parameter{{Name: "idempotency-key", In: "header", Required: true}}},
	CreateCrawl:          {Method: "POST", Path: "/v1/crawls", Parameters: []Parameter{{Name: "idempotency-key", In: "header", Required: false}}},
	ListJobs:             {Method: "GET", Path: "/v1/jobs", Parameters: []Parameter{{Name: "limit", In: "query", Required: false}, {Name: "cursor", In: "query", Required: false}, {Name: "status", In: "query", Required: false}, {Name: "kind", In: "query", Required: false}, {Name: "projectId", In: "query", Required: false}}},
	BulkCancelJobs:       {Method: "POST", Path: "/v1/jobs/cancel", Parameters: []Parameter{{Name: "idempotency-key", In: "header", Required: true}}},
	GetJob:               {Method: "GET", Path: "/v1/jobs/{jobId}", Parameters: []Parameter{{Name: "jobId", In: "path", Required: true}}},
	CancelJob:            {Method: "DELETE", Path: "/v1/jobs/{jobId}", Parameters: []Parameter{{Name: "jobId", In: "path", Required: true}, {Name: "idempotency-key", In: "header", Required: true}}},
	ListJobErrors:        {Method: "GET", Path: "/v1/jobs/{jobId}/errors", Parameters: []Parameter{{Name: "jobId", In: "path", Required: true}, {Name: "limit", In: "query", Required: false}, {Name: "cursor", In: "query", Required: false}}},
	ListJobResults:       {Method: "GET", Path: "/v1/jobs/{jobId}/results", Parameters: []Parameter{{Name: "jobId", In: "path", Required: true}, {Name: "limit", In: "query", Required: false}, {Name: "cursor", In: "query", Required: false}}},
	MapUrl:               {Method: "POST", Path: "/v1/map", Parameters: []Parameter{{Name: "idempotency-key", In: "header", Required: false}}},
	ScrapeUrl:            {Method: "POST", Path: "/v1/scrape", Parameters: []Parameter{{Name: "idempotency-key", In: "header", Required: false}}},
	GetWorkspaceOverview: {Method: "GET", Path: "/v1/workspaces/{workspaceId}/overview", Parameters: []Parameter{{Name: "workspaceId", In: "path", Required: true}}},
	ListProjects:         {Method: "GET", Path: "/v1/workspaces/{workspaceId}/projects", Parameters: []Parameter{{Name: "workspaceId", In: "path", Required: true}, {Name: "limit", In: "query", Required: false}, {Name: "cursor", In: "query", Required: false}}},
	GetProjectsStats:     {Method: "GET", Path: "/v1/workspaces/{workspaceId}/projects-stats", Parameters: []Parameter{{Name: "workspaceId", In: "path", Required: true}}},
	GetProject:           {Method: "GET", Path: "/v1/workspaces/{workspaceId}/projects/{projectId}", Parameters: []Parameter{{Name: "workspaceId", In: "path", Required: true}, {Name: "projectId", In: "path", Required: true}}},
	GetUsage:             {Method: "GET", Path: "/v1/workspaces/{workspaceId}/usage", Parameters: []Parameter{{Name: "workspaceId", In: "path", Required: true}, {Name: "periodStart", In: "query", Required: false}, {Name: "projectId", In: "query", Required: false}}},
	ListUsageLedger:      {Method: "GET", Path: "/v1/workspaces/{workspaceId}/usage/ledger", Parameters: []Parameter{{Name: "workspaceId", In: "path", Required: true}, {Name: "limit", In: "query", Required: false}, {Name: "cursor", In: "query", Required: false}, {Name: "metric", In: "query", Required: false}, {Name: "projectId", In: "query", Required: false}}}}

type ResponseMetadata struct {
	StatusCode int
	Location   string
	RetryAfter time.Duration
	Replayed   bool
}
type CompileUrlResult struct {
	Response200 *CompileUrlResponse200
	Response202 *CompileUrlResponse202
}

func (r *CompileUrlResult) UnmarshalJSON(data []byte) error {
	var shape map[string]json.RawMessage
	if err := json.Unmarshal(data, &shape); err != nil {
		return err
	}
	if _, ok := shape["markdown"]; ok {
		var value CompileUrlResponse200
		if err := json.Unmarshal(data, &value); err != nil {
			return err
		}
		r.Response200 = &value
	} else {
		var value CompileUrlResponse202
		if err := json.Unmarshal(data, &value); err != nil {
			return err
		}
		r.Response202 = &value
	}
	return nil
}
func IsCompleted(job GetJobResponse200) bool {
	return string(job.Status) == "ready" || string(job.Status) == "failed" || string(job.Status) == "cancelled" || string(job.ArtifactState) == "review"
}
func randomUUID() string {
	var b [16]byte
	_, _ = rand.Read(b[:])
	b[6] = (b[6] & 0x0f) | 0x40
	b[8] = (b[8] & 0x3f) | 0x80
	return fmt.Sprintf("%x-%x-%x-%x-%x", b[0:4], b[4:6], b[6:8], b[8:10], b[10:])
}

type Client struct {
	BaseURL, APIKey, WorkspaceID string
	HTTPClient                   *http.Client
}
type Option func(*Client)

func WithWorkspaceID(workspaceID string) Option {
	return func(c *Client) { c.WorkspaceID = workspaceID }
}
func WithBaseURL(baseURL string) Option {
	return func(c *Client) { c.BaseURL = strings.TrimRight(baseURL, "/") }
}
func WithHTTPClient(httpClient *http.Client) Option {
	return func(c *Client) { c.HTTPClient = httpClient }
}
func WithTimeout(timeout time.Duration) Option {
	return func(c *Client) {
		if c.HTTPClient == nil {
			c.HTTPClient = &http.Client{Timeout: timeout}
		} else {
			c.HTTPClient.Timeout = timeout
		}
	}
}
func New(apiKey string, opts ...Option) *Client {
	resolvedKey := apiKey
	if resolvedKey == "" {
		resolvedKey = os.Getenv("ATLAS_API_KEY")
	}
	baseURL := os.Getenv("ATLAS_BASE_URL")
	if baseURL == "" {
		baseURL = "https://api.atlas-compiler.com"
	}
	c := &Client{BaseURL: strings.TrimRight(baseURL, "/"), APIKey: resolvedKey, WorkspaceID: os.Getenv("ATLAS_WORKSPACE_ID"), HTTPClient: &http.Client{Timeout: 30 * time.Second}}
	for _, opt := range opts {
		opt(c)
	}
	return c
}
func NewClient(workspaceID, apiKey string) *Client { return New(apiKey, WithWorkspaceID(workspaceID)) }
func (p *Problem) Error() string {
	if p == nil {
		return ""
	}
	if p.Detail != "" {
		return p.Detail
	}
	return p.Title
}
func (c *Client) Call(ctx context.Context, id OperationID, parameters map[string]any, body, target any) (ResponseMetadata, error) {
	operation, ok := Operations[id]
	if !ok {
		return ResponseMetadata{}, fmt.Errorf("unknown operation %q", id)
	}
	path := operation.Path
	query := url.Values{}
	headers := http.Header{}
	for _, parameter := range operation.Parameters {
		value, exists := parameters[parameter.Name]
		if !exists || value == nil {
			if parameter.Required {
				return ResponseMetadata{}, fmt.Errorf("missing required parameter %s", parameter.Name)
			}
			continue
		}
		switch parameter.In {
		case "path":
			path = strings.ReplaceAll(path, "{"+parameter.Name+"}", url.PathEscape(fmt.Sprint(value)))
		case "query":
			query.Set(parameter.Name, fmt.Sprint(value))
		case "header":
			headers.Set(parameter.Name, fmt.Sprint(value))
		}
	}
	var reader io.Reader
	if body != nil {
		encoded, err := json.Marshal(body)
		if err != nil {
			return ResponseMetadata{}, err
		}
		reader = bytes.NewReader(encoded)
		headers.Set("Content-Type", "application/json")
	}
	fullURL := strings.TrimRight(c.BaseURL, "/") + path
	if len(query) > 0 {
		fullURL += "?" + query.Encode()
	}
	request, err := http.NewRequestWithContext(ctx, operation.Method, fullURL, reader)
	if err != nil {
		return ResponseMetadata{}, err
	}
	request.Header = headers
	request.Header.Set("Accept", "application/json")
	if c.APIKey != "" {
		request.Header.Set("Authorization", "Bearer "+c.APIKey)
	}
	response, err := c.HTTPClient.Do(request)
	if err != nil {
		return ResponseMetadata{}, err
	}
	defer response.Body.Close()
	metadata := ResponseMetadata{StatusCode: response.StatusCode, Location: response.Header.Get("Location"), Replayed: response.Header.Get("Idempotent-Replayed") == "true"}
	if seconds, err := strconv.Atoi(response.Header.Get("Retry-After")); err == nil {
		metadata.RetryAfter = time.Duration(seconds) * time.Second
	}
	payload, err := io.ReadAll(response.Body)
	if err != nil {
		return metadata, err
	}
	if response.StatusCode >= 400 {
		var problem Problem
		if json.Unmarshal(payload, &problem) == nil && problem.Status != 0 {
			return metadata, &problem
		}
		return metadata, fmt.Errorf("atlas request failed with status %d: %s", response.StatusCode, strings.TrimSpace(string(payload)))
	}
	if target != nil && response.StatusCode != 204 {
		if err := json.Unmarshal(payload, target); err != nil {
			return metadata, err
		}
	}
	return metadata, nil
}
func (c *Client) Compile(ctx context.Context, body CompileUrlRequest, key ...string) (CompileUrlResult, ResponseMetadata, error) {
	idempotencyKey := ""
	if len(key) > 0 && key[0] != "" {
		idempotencyKey = key[0]
	} else {
		idempotencyKey = randomUUID()
	}
	var result CompileUrlResult
	metadata, err := c.Call(ctx, CompileUrl, map[string]any{"idempotency-key": idempotencyKey}, body, &result)
	return result, metadata, err
}
func (c *Client) Scrape(ctx context.Context, body ScrapeUrlRequest, key ...string) (ScrapeUrlResponse200, ResponseMetadata, error) {
	var result ScrapeUrlResponse200
	params := map[string]any{}
	if len(key) > 0 && key[0] != "" {
		params["idempotency-key"] = key[0]
	}
	metadata, err := c.Call(ctx, ScrapeUrl, params, body, &result)
	return result, metadata, err
}
func (c *Client) Map(ctx context.Context, body MapUrlRequest, key ...string) (MapUrlResponse200, ResponseMetadata, error) {
	var result MapUrlResponse200
	params := map[string]any{}
	if len(key) > 0 && key[0] != "" {
		params["idempotency-key"] = key[0]
	}
	metadata, err := c.Call(ctx, MapUrl, params, body, &result)
	return result, metadata, err
}
func (c *Client) CreateCrawl(ctx context.Context, body CreateCrawlRequest, key ...string) (CreateCrawlResponse202, ResponseMetadata, error) {
	var result CreateCrawlResponse202
	params := map[string]any{}
	if len(key) > 0 && key[0] != "" {
		params["idempotency-key"] = key[0]
	}
	metadata, err := c.Call(ctx, CreateCrawl, params, body, &result)
	return result, metadata, err
}
func (c *Client) CreateBatch(ctx context.Context, body CreateBatchRequest, key ...string) (CreateBatchResponse202, ResponseMetadata, error) {
	var result CreateBatchResponse202
	params := map[string]any{}
	if len(key) > 0 && key[0] != "" {
		params["idempotency-key"] = key[0]
	}
	metadata, err := c.Call(ctx, CreateBatch, params, body, &result)
	return result, metadata, err
}
func (c *Client) GetJob(ctx context.Context, id string) (GetJobResponse200, ResponseMetadata, error) {
	var result GetJobResponse200
	metadata, err := c.Call(ctx, GetJob, map[string]any{"jobId": id}, nil, &result)
	return result, metadata, err
}
func (c *Client) CancelJob(ctx context.Context, id string, key ...string) (CancelJobResponse202, ResponseMetadata, error) {
	idempotencyKey := ""
	if len(key) > 0 && key[0] != "" {
		idempotencyKey = key[0]
	} else {
		idempotencyKey = randomUUID()
	}
	var result CancelJobResponse202
	metadata, err := c.Call(ctx, CancelJob, map[string]any{"jobId": id, "idempotency-key": idempotencyKey}, nil, &result)
	return result, metadata, err
}
func (c *Client) ListJobs(ctx context.Context, cursor *string, limit *int, status *string) (ListJobsResponse200, ResponseMetadata, error) {
	var result ListJobsResponse200
	params := map[string]any{}
	if cursor != nil {
		params["cursor"] = *cursor
	}
	if limit != nil {
		params["limit"] = *limit
	}
	if status != nil {
		params["status"] = *status
	}
	metadata, err := c.Call(ctx, ListJobs, params, nil, &result)
	return result, metadata, err
}
func (c *Client) BulkCancelJobs(ctx context.Context, body BulkCancelJobsRequest, key ...string) (BulkCancelJobsResponse200, ResponseMetadata, error) {
	idempotencyKey := ""
	if len(key) > 0 && key[0] != "" {
		idempotencyKey = key[0]
	} else {
		idempotencyKey = randomUUID()
	}
	var result BulkCancelJobsResponse200
	metadata, err := c.Call(ctx, BulkCancelJobs, map[string]any{"idempotency-key": idempotencyKey}, body, &result)
	return result, metadata, err
}
func (c *Client) ListJobResults(ctx context.Context, id string, cursor *string, limit *int) (ListJobResultsResponse200, ResponseMetadata, error) {
	var result ListJobResultsResponse200
	parameters := map[string]any{"jobId": id}
	if cursor != nil {
		parameters["cursor"] = *cursor
	}
	if limit != nil {
		parameters["limit"] = *limit
	}
	metadata, err := c.Call(ctx, ListJobResults, parameters, nil, &result)
	return result, metadata, err
}
func (c *Client) ListJobErrors(ctx context.Context, id string, cursor *string, limit *int) (ListJobErrorsResponse200, ResponseMetadata, error) {
	var result ListJobErrorsResponse200
	parameters := map[string]any{"jobId": id}
	if cursor != nil {
		parameters["cursor"] = *cursor
	}
	if limit != nil {
		parameters["limit"] = *limit
	}
	metadata, err := c.Call(ctx, ListJobErrors, parameters, nil, &result)
	return result, metadata, err
}
func (c *Client) GetWorkspaceOverview(ctx context.Context, workspaceID ...string) (GetWorkspaceOverviewResponse200, ResponseMetadata, error) {
	var result GetWorkspaceOverviewResponse200
	wsID := c.WorkspaceID
	if len(workspaceID) > 0 && workspaceID[0] != "" {
		wsID = workspaceID[0]
	}
	if wsID == "" {
		return result, ResponseMetadata{}, fmt.Errorf("workspaceID is required")
	}
	metadata, err := c.Call(ctx, GetWorkspaceOverview, map[string]any{"workspaceId": wsID}, nil, &result)
	return result, metadata, err
}
func (c *Client) ListProjects(ctx context.Context, cursor *string, limit *int, workspaceID ...string) (ListProjectsResponse200, ResponseMetadata, error) {
	var result ListProjectsResponse200
	wsID := c.WorkspaceID
	if len(workspaceID) > 0 && workspaceID[0] != "" {
		wsID = workspaceID[0]
	}
	if wsID == "" {
		return result, ResponseMetadata{}, fmt.Errorf("workspaceID is required")
	}
	parameters := map[string]any{"workspaceId": wsID}
	if cursor != nil {
		parameters["cursor"] = *cursor
	}
	if limit != nil {
		parameters["limit"] = *limit
	}
	metadata, err := c.Call(ctx, ListProjects, parameters, nil, &result)
	return result, metadata, err
}
func (c *Client) GetProject(ctx context.Context, id string, workspaceID ...string) (GetProjectResponse200, ResponseMetadata, error) {
	var result GetProjectResponse200
	wsID := c.WorkspaceID
	if len(workspaceID) > 0 && workspaceID[0] != "" {
		wsID = workspaceID[0]
	}
	if wsID == "" {
		return result, ResponseMetadata{}, fmt.Errorf("workspaceID is required")
	}
	metadata, err := c.Call(ctx, GetProject, map[string]any{"workspaceId": wsID, "projectId": id}, nil, &result)
	return result, metadata, err
}
func (c *Client) GetUsage(ctx context.Context, workspaceID ...string) (GetUsageResponse200, ResponseMetadata, error) {
	var result GetUsageResponse200
	wsID := c.WorkspaceID
	if len(workspaceID) > 0 && workspaceID[0] != "" {
		wsID = workspaceID[0]
	}
	if wsID == "" {
		return result, ResponseMetadata{}, fmt.Errorf("workspaceID is required")
	}
	metadata, err := c.Call(ctx, GetUsage, map[string]any{"workspaceId": wsID}, nil, &result)
	return result, metadata, err
}
func (c *Client) ListUsageLedger(ctx context.Context, cursor *string, limit *int, workspaceID ...string) (ListUsageLedgerResponse200, ResponseMetadata, error) {
	var result ListUsageLedgerResponse200
	wsID := c.WorkspaceID
	if len(workspaceID) > 0 && workspaceID[0] != "" {
		wsID = workspaceID[0]
	}
	if wsID == "" {
		return result, ResponseMetadata{}, fmt.Errorf("workspaceID is required")
	}
	parameters := map[string]any{"workspaceId": wsID}
	if cursor != nil {
		parameters["cursor"] = *cursor
	}
	if limit != nil {
		parameters["limit"] = *limit
	}
	metadata, err := c.Call(ctx, ListUsageLedger, parameters, nil, &result)
	return result, metadata, err
}
func (c *Client) WaitForJob(ctx context.Context, jobID string, interval, maxWait time.Duration) (GetJobResponse200, ResponseMetadata, error) {
	if interval <= 0 {
		interval = 1 * time.Second
	}
	if maxWait <= 0 {
		maxWait = 60 * time.Second
	}
	deadline := time.Now().Add(maxWait)
	for {
		res, meta, err := c.GetJob(ctx, jobID)
		if err != nil {
			return res, meta, err
		}
		if IsCompleted(res) {
			return res, meta, nil
		}
		if time.Now().After(deadline) {
			return res, meta, fmt.Errorf("job %s did not complete within %v", jobID, maxWait)
		}
		sleepDuration := interval
		if meta.RetryAfter > 0 {
			sleepDuration = meta.RetryAfter
		}
		remaining := time.Until(deadline)
		if sleepDuration > remaining {
			sleepDuration = remaining
		}
		select {
		case <-ctx.Done():
			return res, meta, ctx.Err()
		case <-time.After(sleepDuration):
		}
	}
}
