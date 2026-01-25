# HomeStaff — Design Handoff

This folder contains everything needed to implement HomeStaff, a household workforce management and payroll platform.

## What's Included

**Ready-to-Use Prompts:**
- `prompts/one-shot-prompt.md` — Prompt for full implementation in one session
- `prompts/section-prompt.md` — Prompt template for section-by-section implementation

**Instructions:**
- `product-overview.md` — Product summary (always provide with instructions)
- `instructions/one-shot-instructions.md` — All milestones combined
- `instructions/incremental/` — 9 milestone instructions (foundation + 8 sections)

**Design Assets:**
- `design-system/` — Colors, fonts, design tokens
- `data-model/` — Entity types, relationships, sample data
- `shell/` — Application shell components (sidebar, nav, user menu)
- `sections/` — 8 section component packages with test instructions

## How to Use This

### Option A: Incremental (Recommended)

Build your app milestone by milestone for better control:

1. Copy the `product-plan/` folder to your implementation codebase
2. Start with Foundation (`instructions/incremental/01-foundation.md`)
3. For each section:
   - Open `prompts/section-prompt.md`
   - Fill in the section variables at the top (SECTION_NAME, SECTION_ID, NN)
   - Copy/paste into your coding agent
   - Answer questions and implement
4. Review and test after each milestone

**Milestone Order:**
1. Foundation — Design tokens, data model, routing, shell
2. Landing Page — Marketing page
3. User Authentication — Login, register, social auth
4. Staff Directory — Employee profiles and wizard
5. Attendance & Holidays — Present-by-default tracking
6. Payroll & Finance — Salary calculations and payments
7. Settings & Access — Household and member management
8. Onboarding & Setup — New user wizard
9. Employee Portal — Public staff portal

### Option B: One-Shot

Build the entire app in one session:

1. Copy the `product-plan/` folder to your implementation codebase
2. Open `prompts/one-shot-prompt.md`
3. Add any additional notes to the prompt
4. Copy/paste the prompt into your coding agent
5. Answer the agent's clarifying questions
6. Let the agent plan and implement everything

## Test-Driven Development

Each section includes a `tests.md` file with test-writing instructions. For best results:

1. Read `sections/[section-id]/tests.md` before implementing
2. Write failing tests based on the instructions
3. Implement the feature to make tests pass
4. Refactor while keeping tests green

The test instructions are **framework-agnostic** — they describe WHAT to test, not HOW. Adapt to your testing setup (Jest, Vitest, Playwright, Cypress, RSpec, Minitest, PHPUnit, etc.).

## File Structure

```
product-plan/
├── README.md                    # This file
├── product-overview.md          # Product summary
│
├── prompts/                     # Ready-to-use prompts
│   ├── one-shot-prompt.md
│   └── section-prompt.md
│
├── instructions/                # Implementation instructions
│   ├── one-shot-instructions.md
│   └── incremental/
│       ├── 01-foundation.md
│       ├── 02-landing-page.md
│       ├── 03-user-authentication.md
│       ├── 04-staff-directory.md
│       ├── 05-attendance-and-holidays.md
│       ├── 06-payroll-and-finance.md
│       ├── 07-settings-and-access.md
│       ├── 08-onboarding-and-setup.md
│       └── 09-employee-portal.md
│
├── design-system/               # Design tokens
│   ├── tokens.css
│   ├── tailwind-colors.md
│   └── fonts.md
│
├── data-model/                  # Data model
│   ├── README.md
│   ├── types.ts
│   └── sample-data.json
│
├── shell/                       # Application shell
│   ├── README.md
│   └── components/
│
└── sections/                    # Section packages
    ├── landing-page/
    ├── user-authentication/
    ├── staff-directory/
    ├── attendance-and-holidays/
    ├── payroll-and-finance/
    ├── settings-and-access/
    ├── onboarding-and-setup/
    └── employee-portal/
        ├── README.md
        ├── tests.md
        ├── types.ts
        ├── sample-data.json
        └── components/
```

## Tips

- **Use the pre-written prompts** — They include important clarifying questions about auth and data modeling.
- **Add your own notes** — Customize prompts with project-specific context when needed.
- **Build on your designs** — Use completed sections as the starting point for future feature development.
- **Review thoroughly** — Check plans and implementations carefully to catch details and inconsistencies.
- **Fill in the gaps** — Backend business logic may need manual additions. Incremental implementation helps you identify these along the way.

## Design System Summary

**Colors:**
- Primary: `amber` — Buttons, links, accents
- Secondary: `orange` — Tags, highlights
- Neutral: `stone` — Backgrounds, text, borders

**Typography:**
- Heading & Body: Nunito Sans
- Monospace: Fira Code

**Framework:**
- Tailwind CSS v4
- React components with TypeScript
- Lucide React icons

---

*Generated by Design OS*
