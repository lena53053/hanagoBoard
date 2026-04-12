# Hanago Skill Board — Product Requirements Document

## Overview

The Hanago Skill Board is an interactive drag-and-drop board for planning and simulating flower skill builds. Users place flowers onto a central board and surround them with element items to level up skills and calculate final stats.

---

## Data Model

### Flowers (`flowersData.js`)

- **16 flowers** total: 12 Gen 1, 4 Gen 2
- Each flower has:
  - `name` — Chinese display name
  - `generation` — 1 or 2
  - `magicSkillElements` — array of `{ name, type }` (2 skills, for magic-type players)
  - `physicSkillElements` — array of `{ name, type }` (2 skills, for physic-type players)
  - `mainElements` — array of element type IDs (1 or 2 elements); determines stat highlight
  - `subInheritanceLevel` — multiplier for non-center flowers' main element stats
    - Flowers with 1 main element: `0.65`
    - Flowers with 2 main elements: `0.50`
  - `image` — URL to flower image
  - `stats` — array of level 1–13 stat objects: `{ level, wisdom, spirit, strength, agility, endurance }`

### Elements (`elementsData.js`)

- **10 elements**: 5 base types × 2 generations
- Base types (ID 1–5): 耐力 (Endurance), 力量 (Strength), 智慧 (Wisdom), 靈巧 (Agility), 精神 (Spirit)
- Gen 2 (ID 6–10): Same types with "II" suffix
- Each element has: `id`, `name`, `image`, `level` (1 or 2)

### Element-to-Stat Mapping

| Element Type ID | Element Name | Stat Key |
|---|---|---|
| 1 | 耐力 | endurance |
| 2 | 力量 | strength |
| 3 | 智慧 | wisdom |
| 4 | 靈巧 | agility |
| 5 | 精神 | spirit |

### Score Data (`scoreData.js`)

Scoring multipliers by grade (0–9) for elements placed in small slots:

- `gen1Single` — single Gen 1 element: [20, 40, 60, 80, 110, 130, 150, 190, 250, 340]
- `gen2Single` — single Gen 2 element: [30, 60, 90, 120, 170, 200, 230, 290, 390, 520]
- `gen1Pair` — paired Gen 1 elements: [12, 24, 36, 48, 66, 78, 90, 114, 144, 189]
- `gen2Pair` — paired Gen 2 elements: [18, 36, 54, 72, 102, 120, 138, 174, 224, 289]

### Skills Data (`skillsData.js`)

Skills start at **level 0** and level up when the total score of matching element types in surrounding slots meets the threshold.

**Skill 1** (first skill element):
- Gen 1 thresholds: [75, 190, 380, 605, 910, 1215, 1520, 1650, 1800] → max Lv9
- Gen 2 thresholds: [75, 190, 380, 605, 910, 1215, 1520, 1650, 1800, 2060, 2320, 2520, 2760] → max Lv13
- Gen 1 locks: Lv8 and Lv9 require flower Lv10
- Gen 2 locks: Lv12 and Lv13 require flower Lv10

**Skill 2** (second skill element):
- Gen 1 thresholds: [75, 190, 380, 605, 910, 1140, 1365] → max Lv7
- Gen 2 thresholds: [75, 190, 380, 605, 910, 1140, 1365, 1565, 1740, 1910, 2085] → max Lv11
- Gen 1 locks: Lv6 requires flower Lv11, Lv7 requires flower Lv13
- Gen 2 locks: Lv10 requires flower Lv11, Lv11 requires flower Lv13

---

## Board Layout

### Structure (left to right)

1. **Left column** (850px fixed width):
   - Element item tray (top) — 5-column table of draggable element icons
   - Mode buttons — "Free Style" / "Max Advantage" toggle
   - Game board (850×850px) — 9 large slots + surrounding small slots
   - Flower image grid (bottom) — 2-row scrollable grid of 16 draggable flower images

2. **Right column** (340px):
   - Flower detail table — cards for flowers currently placed on the board

### Game Board Geometry

- **9 large slots** arranged in an octagonal pattern around a center point (425, 425)
  - 1 center slot (L1, 90×90px) — special: center flower gets 100% stats
  - 1 highlighted slot (L2, top, 80×80px)
  - 7 regular large slots (L3–L9, 80×80px)
- **Small slots** (54×54px, dashed border) surround each large slot in 8 directions
  - Each small slot can hold up to 2 elements (no duplicate types, same generation only)
  - Each small slot has a grade (0–9) that determines score multiplier

### Slot Activation by Flower Level

Not all surrounding small slots contribute to a flower's skill calculation. Slots activate based on flower level:

| Slot Direction | Required Flower Level |
|---|---|
| Top, Right, Bottom, Left | Always active |
| Top-Left | Lv3+ |
| Top-Right | Lv5+ |
| Bottom-Left | Lv7+ |
| Bottom-Right | Lv9+ |

Inactive slots appear dimmed (25% opacity) on the board.

---

## Flower Detail Cards (Right Panel)

Each card for a placed flower shows:

### Card Content
- **Flower image** (72×72px) with level badge (green, top-right) and generation badge (yellow, bottom-left for Gen 2+)
- **Flower name** (15px, bold, green)
- **Physic skill elements** (currently showing physic-type only):
  - Element icon (20px) + skill name (13px) + skill level label
  - Progress bar below showing `totalScore/threshold`
  - Bar shows "MAX" when maxed, or locked state with required flower level
- **Stats** (in a bordered rounded box, 3-column × 2-row grid):
  - Element icon (20px) + stat value (12px)
  - Main elements are highlighted (green tint background, bright green text)

### Stat Calculation

**Center flower (L1 slot):**
- `displayStat = baseStat + skillElementScore`
- All stats at 100%

**Non-center flowers:**
- Main element stats: `displayStat = floor((baseStat + skillElementScore) × subInheritanceLevel)`
- Non-main element stats: `displayStat = floor((baseStat + skillElementScore) × 0.30)`

Where `skillElementScore` = total score of matching element type in the flower's active surrounding slots.

---

## Interactions

### Drag and Drop
- **Elements** drag from the tray to small slots (max 2 per slot, no duplicate types, same gen only)
- **Flowers** drag from the bottom grid to large slots (one per slot, no duplicates on board)
- Click a placed element row to remove it from its slot
- Click a placed flower image to return it to the grid

### Level Controls
- Click the **level badge** on a placed flower to cycle through levels 1–13
- Click the **grade badge** on a small slot to cycle grades 0–9

### Live Updates
- Flower cards update in real-time when:
  - Elements are placed/removed in surrounding slots
  - Flower level is changed (affects stats, skill thresholds, slot activation)
  - Grade is changed on surrounding slots

---

## Visual Theme

- Dark background: `#0a161f` (body), `#0c1a24` (components)
- Primary accent: `#55ffaa` (bright green — highlights, active states)
- Secondary accent: `#2ed488` (medium green — borders)
- Badge yellow: `#F5C518` (level/generation badges)
- Text: green-tinted semi-transparent (`rgba(180,230,200,*)`)

---

## Files

| File | Purpose |
|---|---|
| `index.html` | Main HTML, CSS, and JS — board layout, rendering, interactions |
| `flowersData.js` | Flower definitions (16 flowers with stats, skills, elements) |
| `elementsData.js` | Element definitions (10 elements) |
| `scoreData.js` | Score multiplier tables by grade and generation |
| `skillsData.js` | Skill level thresholds and flower level locks |
| `Source/flowers/` | Local flower images (1.png–16.png) |
| `Source/elements/` | Local element images (a.png–e.png) |
