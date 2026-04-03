# Success Criteria

<!-- Machine-readable pass/fail criteria. CI checks these on every push. -->
<!-- Each item must be objectively verifiable (true/false). -->

## Required Files
<!-- scripts/validate-architecture.py reads this section -->
<!-- Format: `path/to/file` — description -->

- `README.md` — human-facing documentation
- `spec/GOAL.md` — goal and definition of done
- `spec/SUCCESS.md` — this file
- `spec/CONSTRAINTS.md` — hard rules
- `spec/ARCHITECTURE.md` — stack and file map
- `.github/workflows/ci.yml` — CI/CD pipeline
- `.gitignore` — ignore patterns

## CI Checks Must Pass

- [ ] validate-spec job passes
- [ ] security-scan job passes (no exposed secrets)
- [ ] build/lint job passes
- [ ] All required files from ARCHITECTURE.md exist

## Deployment (Public Repos Only)

> NOTE: GitHub Pages only works on PUBLIC repositories on the free plan.
> Private repos skip the deploy step automatically.

- [ ] GitHub Pages deployed (if public + index.html present)
- [ ] Live URL accessible and returning HTTP 200

## Notifications

- [ ] Telegram fires on push (success or failure)
- [ ] Telegram fires on new PR
- [ ] Telegram fires on new issue
