## Icon Usage Policy

This project uses Lucide icons exclusively for all UI iconography.

### Rules
- Do not use emojis for icons anywhere in the codebase (app UI, demos, emails).
- Use `lucide-react` for all icons.
- Prefer the shared `Icon` wrapper for consistent sizing and a11y.

### Library
- Package: `lucide-react`
- Install: `npm i lucide-react --save-exact`

### Wrapper
Use the shared wrapper to standardize size/color and accessibility:

```tsx
import { Icon } from "@/components/ui/Icon"; // or relative path from file
import { Play } from "lucide-react";

<Icon as={Play} className="h-5 w-5 text-muted-foreground" />
```

Notes:
- `Icon` sets `aria-hidden` by default unless `title` is provided.
- Prefer `className` for sizing via Tailwind.

### Migration Notes
- Core components updated: `components/testing/TestingDashboard.tsx`, `components/analytics/*`.
- Remaining places likely containing emojis: `pages/*` demo/testing pages, some admin pages, and emails.
- To scan for non-ASCII (emojis):

```bash
rg "[^\x00-\x7F]" components pages layout ui | cat
```

### Patterns
- Performance: `Zap`
- Accessibility: `Accessibility`
- Browser: `Globe`
- Mobile: `Smartphone`
- Music: `Music2`
- Sliders/Faders: `SlidersHorizontal` or `MixerVertical`
- Success/Fail/Warning: `CheckCircle2` / `XCircle` / `AlertTriangle`
- Trend: `TrendingUp` / `TrendingDown` / `ArrowRight`

### Emails
- Avoid emojis in emails. Use plain text or hosted SVG/PNG if needed. `lucide-react` SVGs inlined by React may not render in all email clients; use static assets if icons are required.


