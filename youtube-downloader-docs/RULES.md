# Development Rules

## 1. General Development Rules
- Keep the application local-first.
- Prefer simple solutions.
- Make small, reviewable changes.
- Preserve working functionality.
- Document meaningful architecture decisions.

## 2. Technology Rules
- Frontend: React + Vite + TypeScript + Tailwind CSS.
- Backend: Python + FastAPI.
- Downloader: yt-dlp.
- Media processing: FFmpeg.
- Avoid introducing alternate frameworks without a documented reason.

## 3. Library Rules
- Prefer maintained and documented libraries.
- Do not add a dependency unless necessary.
- Check whether existing dependencies already solve the requirement.
- Avoid abandoned or redundant packages.

## 4. Coding Rules
- Use clear names.
- Keep modules focused.
- Avoid duplicated logic.
- Handle expected exceptions explicitly.
- Keep configuration separate from business logic.
- Do not hard-code machine-specific paths.

## 5. Frontend Rules
- Keep components focused.
- Use TypeScript types for API data.
- Show loading states.
- Show useful success/error states.
- Do not expose backend implementation details unnecessarily.

## 6. Backend Rules
- Validate input.
- Return predictable response structures.
- Separate routes from downloader/service logic.
- Do not block unnecessarily when a background job is more appropriate.
- Sanitize filenames and filesystem paths.

## 7. Downloader Rules
- Use yt-dlp's supported/documented functionality.
- Do not implement custom security bypasses.
- Do not attempt DRM bypass.
- Do not attempt paywall bypass.
- Do not bypass authentication or access controls.

## 8. FFmpeg Rules
- Use FFmpeg only when necessary.
- Detect missing FFmpeg clearly.
- Capture process errors.
- Clean temporary outputs after completion when safe.

## 9. Error Handling Rules
- Never silently ignore errors.
- Provide actionable user-facing messages.
- Log enough information for debugging.
- Do not expose raw stack traces to normal users.
- Distinguish validation, network, downloader, processing, and filesystem errors where practical.

## 10. Security Rules
- Never construct unsafe shell commands from user input.
- Validate URLs.
- Restrict file writes to intended directories.
- Sanitize filenames.
- Avoid arbitrary command execution.
- Keep the local server bound to localhost unless explicitly required otherwise.

## 11. Privacy Rules
- No analytics.
- No telemetry.
- No unnecessary tracking.
- No cloud upload.
- Do not retain downloaded media metadata unnecessarily.

## 12. File Handling Rules
- Separate temporary files from final downloads.
- Use safe filenames.
- Avoid overwriting existing files unexpectedly.
- Clean up temporary files.

## 13. Logging Rules
- Avoid sensitive information.
- Use appropriate log levels.
- Keep normal logs concise.
- Make errors diagnosable.

## 14. Testing Rules
At minimum test:
- Valid URL.
- Invalid URL.
- Unavailable content.
- Unsupported format.
- Missing FFmpeg.
- Network failure.
- Permission failure.
- Interrupted download.
- Existing filename conflict.

## 15. AI Coding Rules
Before making changes, an AI coding agent must read:
1. PRD.md
2. ARCHITECTURE.md
3. RULES.md
4. PHASE.md
5. DESIGN.md
6. MEMORY.md

Then:
- Understand the current project state.
- Work only on the requested phase/task.
- Make the smallest reasonable change.
- Do not rewrite unrelated files.
- Test changes.
- Report what changed.
- Update MEMORY.md after meaningful completed work.

## 16. AI Boundaries
AI agents must not:
- Introduce unnecessary dependencies.
- Change architecture without approval.
- Delete working features without explanation.
- Add telemetry or analytics.
- Add authentication unless requested.
- Implement DRM, paywall, authentication, or access-control bypass.
- Implement security circumvention.
- Add unrelated functionality.
- Guess missing requirements when a clarification is necessary.

## 17. Things to Avoid
- Overengineering.
- Microservices.
- Database for the MVP.
- Cloud storage.
- Public deployment by default.
- Unnecessary background infrastructure.
- Large unreviewed code changes.
