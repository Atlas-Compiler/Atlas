# LangChain Document Loader with Atlas

This example shows how to use Atlas as a deterministic web loader for LangChain RAG pipelines.

Because Atlas extracts visual markdown directly from the DOM using its zero-LLM compiler, it yields clean text with structural hierarchy (headers, tables, lists, code blocks) without hallucinations or LLM summarization noise.

## Setup

```bash
export ATLAS_API_KEY="atlas_..."
pip install -r requirements.txt
python main.py
```
