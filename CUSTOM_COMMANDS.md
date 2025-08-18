# Custom Project Commands

This document lists all custom scripts and commands available in the AudioServiceApp project, including their purpose and usage instructions.

---

## Table of Contents

1. [Documentation Consistency Check](#documentation-consistency-check)
2. [Add more custom commands here as you create them]

---

## 1. Documentation Consistency Check

**Script:** `check-docs-styleguide.js`

**Purpose:**
Ensures every markdown file in the `/docs` folder references the style guide as the UI/UX source of truth, maintaining documentation consistency.

**How to Run:**

```sh
node check-docs-styleguide.js
```

**What it does:**
- Scans all `.md` files in `/docs`.
- Reports any file missing a reference to the style guide for UI/UX.
- Exits with code 0 if all pass, 1 if any fail.

---

## 2. Adding New Custom Commands

When you add a new custom script or command to the project, document it here with:
- **Script/Command name**
- **Purpose**
- **How to run**
- **Expected output/behavior**

---

**Note:**
For all UI/UX, visual, and design decisions, the [Style Guide](./docs/style_guide.md) is the single source of truth. All custom commands that affect documentation or code style should reference or align with the style guide as needed.
