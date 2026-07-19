# OpenWolf — operating protocol (minimum setup)

This is the instruction-based minimum install: no hooks are wired up (see
`MONOREPO-ARCHITECTURE-TEMPLATE.md` §11.2–11.3 in the reference project for
what a full/automated install adds). The AI updates these files on its own
initiative each session.

## Rules
1. Before making a non-trivial change, check `anatomy.md` for a summary of
   the file(s) you're about to touch — skip a full read if the summary is
   enough.
2. Before writing code that touches a convention area (auth, service
   boundaries, error handling), check `cerebrum.md` for prior decisions and
   "Do-Not-Repeat" entries.
3. After fixing a real bug (not a style tweak), add an entry to
   `buglog.json` with `error_message`, `root_cause`, `fix`, `tags`.
4. At the end of a session with non-trivial changes, append a line to
   `memory.md` and update `cerebrum.md` if you learned something that
   should persist (a convention, a gotcha, a decision + why).

## Files
- `anatomy.md` — per-file summaries (kept short; update as files are added/changed)
- `cerebrum.md` — cross-session memory: preferences, key learnings, do-not-repeat, decisions
- `buglog.json` — structured bug/fix history
- `memory.md` — human-readable session log
