# Python Basic Compilation Example

This example demonstrates how to compile web pages into clean markdown using the official Atlas Python SDK (`atlascompiler`).

## Prerequisites

- Python 3.10+
- Atlas API Key (`export ATLAS_API_KEY="atlas_..."`)

## Setup

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

## Run

```bash
python main.py
# Or with a custom URL:
python main.py https://en.wikipedia.org/wiki/Web_crawler
```
