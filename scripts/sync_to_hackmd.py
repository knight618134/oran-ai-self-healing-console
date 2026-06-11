#!/usr/bin/env python3
"""Sync a local Markdown file to HackMD.

Usage:
  HACKMD_API_TOKEN=... python scripts/sync_to_hackmd.py docs/file.md
  HACKMD_API_TOKEN=... python scripts/sync_to_hackmd.py docs/file.md --note-id NOTE_ID
"""

from __future__ import annotations

import argparse
import json
import os
import sys
import urllib.error
import urllib.request
from pathlib import Path


API_BASE = "https://api.hackmd.io/v1"


def request_json(method: str, path: str, token: str, payload: dict[str, object] | None = None) -> dict[str, object] | None:
    data = None
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json",
    }

    if payload is not None:
        data = json.dumps(payload).encode("utf-8")

    request = urllib.request.Request(
        f"{API_BASE}{path}",
        data=data,
        headers=headers,
        method=method,
    )

    try:
        with urllib.request.urlopen(request, timeout=30) as response:
            body = response.read().decode("utf-8")
            if not body:
                return None
            return json.loads(body)
    except urllib.error.HTTPError as error:
        body = error.read().decode("utf-8", errors="replace")
        raise RuntimeError(f"HackMD API returned HTTP {error.code}: {body}") from error
    except urllib.error.URLError as error:
        raise RuntimeError(f"Could not reach HackMD API: {error.reason}") from error


def infer_title(markdown: str, fallback: str) -> str:
    for line in markdown.splitlines():
        if line.startswith("# "):
            return line[2:].strip() or fallback
    return fallback


def main() -> int:
    parser = argparse.ArgumentParser(description="Create or update a HackMD note from a Markdown file.")
    parser.add_argument("markdown_file", type=Path, help="Markdown file to sync")
    parser.add_argument("--note-id", help="Existing HackMD note id to update")
    parser.add_argument("--read-permission", default="owner", choices=["owner", "signed_in", "guest"])
    parser.add_argument("--write-permission", default="owner", choices=["owner", "signed_in", "guest"])
    parser.add_argument("--comment-permission", default="everyone", choices=["disabled", "forbidden", "owners", "signed_in_users", "everyone"])
    args = parser.parse_args()

    token = os.environ.get("HACKMD_API_TOKEN")
    if not token:
        print("Missing HACKMD_API_TOKEN environment variable.", file=sys.stderr)
        return 2

    markdown_path = args.markdown_file
    if not markdown_path.exists():
        print(f"Markdown file not found: {markdown_path}", file=sys.stderr)
        return 2

    content = markdown_path.read_text(encoding="utf-8")

    if args.note_id:
        request_json(
            "PATCH",
            f"/notes/{args.note_id}",
            token,
            {
                "content": content,
                "readPermission": args.read_permission,
                "writePermission": args.write_permission,
            },
        )
        print(f"Updated HackMD note: https://hackmd.io/{args.note_id}")
        return 0

    response = request_json(
        "POST",
        "/notes",
        token,
        {
            "title": infer_title(content, markdown_path.stem),
            "content": content,
            "readPermission": args.read_permission,
            "writePermission": args.write_permission,
            "commentPermission": args.comment_permission,
        },
    )

    note_id = response.get("id") if response else None
    publish_link = response.get("publishLink") if response else None

    if note_id:
        print(f"Created HackMD note id: {note_id}")
    if publish_link:
        print(f"Publish link: {publish_link}")
    elif note_id:
        print(f"Edit link: https://hackmd.io/{note_id}")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
