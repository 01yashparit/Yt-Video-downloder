# Design Specification

## 1. Design Philosophy
Modern, minimal, developer-tool aesthetic focused on clarity and fast interaction.

The UI should make the primary task obvious:
Paste URL → Fetch → Select → Download.

## 2. Color Palette
Dark-first theme.

Suggested tokens:
- Background: near-black neutral.
- Surface: dark neutral.
- Surface elevated: slightly lighter neutral.
- Text primary: high-contrast light neutral.
- Text secondary: muted neutral.
- Border: subtle neutral.
- Primary action: one consistent accent.
- Success: reserved for successful operations.
- Error: reserved for errors.
- Warning: reserved for warnings.

Avoid excessive gradients and decorative colors.

## 3. Theme
Primary theme: dark.

Optional future light theme may reuse the same semantic design tokens.

## 4. Typography
Recommended:
- UI font: Inter or system sans-serif.
- Code/technical text: system monospace or a suitable monospace font.

## 5. Typography Scale
- Page title: 28–36px.
- Section title: 18–22px.
- Body: 14–16px.
- Secondary text: 12–14px.
- Button text: 14–16px.
- Metadata: 12–14px.

Use consistent font weights rather than many variations.

## 6. Spacing
Use a consistent spacing scale based on 4px/8px increments.

## 7. Border Radius
Use moderate rounded corners:
- Inputs/buttons: 8–10px.
- Cards: 12–16px.
- Large containers: 16–20px.

## 8. Buttons
Primary button should be visually prominent.

States:
- Default.
- Hover.
- Active.
- Disabled.
- Loading.

Avoid having multiple competing primary actions.

## 9. Inputs
URL input should be the primary element on the page.

Requirements:
- Clear label/placeholder.
- Visible focus state.
- Validation feedback.
- Easy paste interaction.

## 10. Cards
Use cards for:
- Video information.
- Format selection.
- Download status.

Cards should have subtle borders and limited visual decoration.

## 11. Progress Bar
Display:
- Current state.
- Percentage where available.
- Downloaded amount/speed where useful.
- Completion state.

Do not show misleading progress when the backend cannot determine accurate progress.

## 12. Status Messages
Use clear language:
- Fetching information…
- Ready to download.
- Downloading…
- Processing…
- Completed.
- Download failed.

## 13. Error Messages
Errors should explain:
1. What happened.
2. Whether the user can retry.
3. What action may resolve it.

Avoid raw stack traces.

## 14. Video Preview
Display thumbnail, title, duration, and relevant metadata after successful information retrieval.

## 15. Quality Selector
Use a clear select/dropdown or compact list showing:
- Resolution.
- Format/container.
- Audio availability where relevant.
- Approximate file size only when reliable.

## 16. Download Section
The download action should be visually clear and placed near the format selector.

## 17. Responsive Behavior
Although primarily desktop-oriented, the interface should remain usable on smaller screens.

## 18. Accessibility
- Keyboard navigation.
- Visible focus indicators.
- Semantic HTML.
- Sufficient contrast.
- Accessible labels.
- Do not rely on color alone to communicate status.

## 19. Dark Mode
Dark mode is the default. Keep semantic colors consistent across future themes.

## 20. UI Principles
- Minimal.
- Fast.
- Predictable.
- No unnecessary animations.
- No clutter.
- No advertising.
- No tracking.
