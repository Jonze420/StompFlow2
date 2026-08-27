---
name: GitHub connector bulk writes
description: Limits encountered when migrating a complete repository through the GitHub connector.
---

The GitHub connector can remain healthy for repository reads while its gateway blocks sustained Git Data and Contents API writes with Cloudflare 403 responses. Standard repository scope may also exclude permission to create Actions workflow files.

**Why:** Multiple binary-safe, rate-limited upload strategies failed at the connector gateway without advancing the target branch, even though small reads and cleanup requests continued to work.

**How to apply:** Before a future full-repository migration, test one ordinary content write and one workflow-file write. Prefer native Git with suitable authorization for bulk pushes; keep branch updates atomic and verify temporary branches are removed after failures.