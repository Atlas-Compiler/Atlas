import os
from atlascompiler import AtlasClient
from langchain_core.documents import Document

def load_atlas_document(url: str) -> Document:
    """Loads a webpage using Atlas zero-LLM deterministic web compiler and returns a LangChain Document."""
    client = AtlasClient()
    res = client.compile(url=url)
    
    if res.status != 200:
        raise RuntimeError(f"Atlas compilation returned non-200 status: {res.status}")
    
    data = res.value.get("data", {})
    markdown_content = data.get("markdown", "")
    metadata = {
        "source": url,
        "title": data.get("title", ""),
        "duration_ms": data.get("durationMs", 0),
        "links_count": len(data.get("links", [])),
    }
    
    return Document(page_content=markdown_content, metadata=metadata)

def main():
    target = "https://example.com"
    print(f"Loading {target} into LangChain Document via Atlas...")
    
    doc = load_atlas_document(target)
    print("\n--- LangChain Document Metadata ---")
    print(doc.metadata)
    print("\n--- Document Page Content Snippet ---")
    print(doc.page_content[:300])

if __name__ == "__main__":
    main()
