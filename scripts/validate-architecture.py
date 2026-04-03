#!/usr/bin/env python3
"""
validate-architecture.py

Reads spec/ARCHITECTURE.md and verifies every file listed under
the "## Required Files" section actually exists in the repo.

CI runs this as part of the validate-spec job (runs FIRST before
build, test, or deploy). Fails immediately if any listed file is missing.
"""

import re
import sys
from pathlib import Path

ARCHITECTURE_FILE = Path("spec/ARCHITECTURE.md")
REPO_ROOT = Path(".")

def parse_required_files(content: str) -> list[str]:
    """Extract file paths from the Required Files section."""
    in_section = False
    files = []
    for line in content.splitlines():
        if line.strip() == "## Required Files":
            in_section = True
            continue
        # Stop at next ## section
        if in_section and line.startswith("## "):
            break
        if in_section:
            # Match lines like: - `path/to/file` — description
            # or: <!-- - `path/to/file` — description -->  (commented out = skip)
            if line.strip().startswith("<!--"):
                continue
            match = re.search(r"`([^`]+)`", line)
            if match:
                files.append(match.group(1))
    return files

def main():
    if not ARCHITECTURE_FILE.exists():
        print("❌ spec/ARCHITECTURE.md missing — cannot validate architecture")
        sys.exit(1)

    content = ARCHITECTURE_FILE.read_text(encoding="utf-8")
    required_files = parse_required_files(content)

    if not required_files:
        print("⚠️  No files listed under '## Required Files' in spec/ARCHITECTURE.md")
        print("   Add file paths in the format: - `path/to/file` — description")
        sys.exit(0)  # Warn but don't fail the template itself

    print(f"🔍 Checking {len(required_files)} required file(s) from spec/ARCHITECTURE.md...\n")

    missing = []
    for path_str in required_files:
        path = REPO_ROOT / path_str
        if path.exists():
            print(f"  ✅ {path_str}")
        else:
            print(f"  ❌ {path_str}  ← MISSING")
            missing.append(path_str)

    print()
    if missing:
        print(f"❌ Architecture validation FAILED — {len(missing)} file(s) missing:")
        for f in missing:
            print(f"   - {f}")
        print("\nFix: create the missing files or update spec/ARCHITECTURE.md")
        sys.exit(1)
    else:
        print(f"✅ Architecture validation passed — all {len(required_files)} required files present")

if __name__ == "__main__":
    main()
