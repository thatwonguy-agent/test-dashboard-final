#!/usr/bin/env python3
"""
validate-constraints.py

Enforces the hard rules defined in spec/CONSTRAINTS.md:
  - No hardcoded secrets / API keys / tokens
  - No .env files committed
  - No node_modules committed
  - Required .gitignore entries present

CI runs this as part of the validate-spec job (runs FIRST before
build, test, or deploy). Fails immediately on any violation.
"""

import re
import subprocess
import sys
from pathlib import Path

REPO_ROOT = Path(".")

# Files/dirs to always skip when scanning
SKIP_PATHS = {
    "node_modules", ".git", "__pycache__", "dist", "build",
    "spec", "scripts/validate-constraints.py",
}

# Extensions to scan for secrets
SCAN_EXTENSIONS = {
    ".js", ".ts", ".py", ".json", ".yml", ".yaml",
    ".sh", ".env", ".html", ".css",
}

# Required .gitignore entries
REQUIRED_GITIGNORE_ENTRIES = [
    "node_modules/",
    ".env",
    "*.log",
    ".DS_Store",
    "dist/",
    "build/",
]

# Secret patterns: (name, regex)
SECRET_PATTERNS = [
    ("AWS access key",     r"AKIA[0-9A-Z]{16}"),
    ("GitHub token",       r"ghp_[a-zA-Z0-9]{36}"),
    ("Private key header", r"-----BEGIN (RSA |EC )?PRIVATE KEY-----"),
    ("Stripe secret key",  r"sk_live_[a-zA-Z0-9]{24,}"),
    ("Generic API key",    r"(?i)(api[_-]?key|apikey)\s*[:=]\s*['\"][a-zA-Z0-9_\-]{20,}['\"]"),
    ("Generic password",   r"(?i)password\s*[:=]\s*['\"][^'\"]{8,}['\"]"),
]

def get_tracked_files() -> list[Path]:
    """Return all git-tracked files (respects .gitignore automatically)."""
    try:
        result = subprocess.run(
            ["git", "ls-files"],
            capture_output=True, text=True, check=True
        )
        paths = []
        for line in result.stdout.splitlines():
            p = Path(line)
            # Skip paths in SKIP_PATHS
            parts = set(p.parts)
            if parts & SKIP_PATHS:
                continue
            if p.suffix in SCAN_EXTENSIONS or p.name in {".env", ".env.local"}:
                paths.append(p)
        return paths
    except subprocess.CalledProcessError:
        # Fallback: walk filesystem
        paths = []
        for p in REPO_ROOT.rglob("*"):
            if p.is_file():
                parts = set(p.parts)
                if parts & SKIP_PATHS:
                    continue
                if p.suffix in SCAN_EXTENSIONS:
                    paths.append(p)
        return paths

def check_committed_env_files() -> list[str]:
    """Check for .env files tracked by git."""
    violations = []
    try:
        result = subprocess.run(
            ["git", "ls-files", "--error-unmatch", ".env"],
            capture_output=True, text=True
        )
        if result.returncode == 0:
            violations.append(".env file is committed to the repo")
    except Exception:
        pass

    try:
        result = subprocess.run(
            ["git", "ls-files"],
            capture_output=True, text=True, check=True
        )
        for line in result.stdout.splitlines():
            if re.search(r"\.env(\.|$)", line) and not line.endswith(".example"):
                violations.append(f".env file committed: {line}")
    except Exception:
        pass
    return violations

def check_committed_node_modules() -> list[str]:
    """Check for node_modules tracked by git."""
    try:
        result = subprocess.run(
            ["git", "ls-files", "node_modules"],
            capture_output=True, text=True, check=True
        )
        if result.stdout.strip():
            return ["node_modules/ is committed to the repo (remove and add to .gitignore)"]
    except Exception:
        pass
    return []

def check_gitignore() -> list[str]:
    """Verify required entries are in .gitignore."""
    gitignore = REPO_ROOT / ".gitignore"
    if not gitignore.exists():
        return [".gitignore file is missing entirely"]

    content = gitignore.read_text(encoding="utf-8")
    missing = []
    for entry in REQUIRED_GITIGNORE_ENTRIES:
        # Accept with or without trailing slash for flexibility
        base = entry.rstrip("/")
        if base not in content and entry not in content:
            missing.append(f".gitignore missing required entry: {entry}")
    return missing

def check_secrets_in_files(files: list[Path]) -> list[str]:
    """Scan files for hardcoded secret patterns."""
    violations = []
    for path in files:
        try:
            text = path.read_text(encoding="utf-8", errors="ignore")
        except Exception:
            continue
        for name, pattern in SECRET_PATTERNS:
            for i, line in enumerate(text.splitlines(), 1):
                if re.search(pattern, line):
                    # Exclude test/mock values and comments
                    stripped = line.strip()
                    if stripped.startswith("#") or stripped.startswith("//"):
                        continue
                    if any(k in line.lower() for k in ["example", "placeholder", "your_", "<your", "xxx", "test"]):
                        continue
                    violations.append(f"{path}:{i} — {name} detected")
    return violations

def main():
    print("🔒 Running constraint validation...\n")
    all_violations = []

    # 1. Check for committed .env files
    print("  Checking for committed .env files...")
    v = check_committed_env_files()
    all_violations.extend(v)
    if not v:
        print("  ✅ No .env files committed")
    else:
        for item in v:
            print(f"  ❌ {item}")

    # 2. Check for committed node_modules
    print("  Checking for committed node_modules...")
    v = check_committed_node_modules()
    all_violations.extend(v)
    if not v:
        print("  ✅ node_modules/ not committed")
    else:
        for item in v:
            print(f"  ❌ {item}")

    # 3. Check .gitignore entries
    print("  Checking .gitignore required entries...")
    v = check_gitignore()
    all_violations.extend(v)
    if not v:
        print("  ✅ .gitignore has all required entries")
    else:
        for item in v:
            print(f"  ❌ {item}")

    # 4. Scan files for hardcoded secrets
    files = get_tracked_files()
    print(f"  Scanning {len(files)} file(s) for hardcoded secrets...")
    v = check_secrets_in_files(files)
    all_violations.extend(v)
    if not v:
        print("  ✅ No hardcoded secrets found")
    else:
        for item in v:
            print(f"  ❌ {item}")

    print()
    if all_violations:
        print(f"❌ Constraint validation FAILED — {len(all_violations)} violation(s):\n")
        for item in all_violations:
            print(f"   • {item}")
        print("\nFix violations then re-push. See spec/CONSTRAINTS.md for rules.")
        sys.exit(1)
    else:
        print("✅ All constraints satisfied")

if __name__ == "__main__":
    main()
