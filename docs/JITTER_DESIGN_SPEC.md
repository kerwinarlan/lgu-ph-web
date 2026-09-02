# Jitter.video Motion Design System Specification
## Philippine LGU Web Platform Standard (`lgu-ph-web`)

> **Executive Synthesis & Jitter.video Design Blueprint**
> Jitter.video (`https://jitter.video/`) is a world-class motion design and animation platform known for its signature dark obsidian canvas, glowing violet/indigo gradients, dark frosted glassmorphism, floating UI motion cards, and spring hover physics.
>
> This specification translates Jitter.video's visual grammar into professional web development terminology and applies it directly to the Tanza LGU digital portal (`lgu-ph-web`).

---

## 1. Terminology Translation Matrix

| Jitter.video Visual Trait | Technical Web Design Specification |
|---|---|
| **Deep Obsidian Base Canvas** | `background-color: #050811; color: #f8fafc;` with subtle radial mesh glow overlays (`#8b5cf6` / `#7c3aed`). |
| **Dark Frosted Glass Cards** | `backdrop-filter: blur(20px) saturate(190%)`, `background: rgba(15, 23, 42, 0.78)`, `border: 1px solid rgba(168, 85, 247, 0.25)`. |
| **Glowing Violet Hairline Accent** | Card hover top border sweep using `linear-gradient(90deg, #8b5cf6, #d946ef, #f59e0b)`. |
| **Floating UI Motion Badges** | Translucent pill badges (`background: rgba(139, 92, 246, 0.15)`) with animated glowing pulse ring (`#a855f7`). |
| **Mouse-Tracked Radial Spotlight** | CSS `--mouse-x` / `--mouse-y` tracking casting a `radial-gradient(600px circle at X Y, rgba(168, 85, 247, 0.18), transparent 40%)`. |
| **Spring Hover Physics** | `transition: transform 300ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 300ms ease`, lifting cards `-5px` with a violet drop glow. |

---

## 2. Design Tokens (`:root`)

```css
:root {
  /* Jitter Dark Palette */
  --bg-jitter-obsidian: #050811;
  --bg-jitter-card: rgba(15, 23, 42, 0.78);
  --bg-jitter-card-hover: rgba(30, 41, 59, 0.85);
  
  /* Violet & Gold Glow Accents */
  --color-violet-primary: #8b5cf6;
  --color-violet-glow: #a855f7;
  --color-magenta-glow: #d946ef;
  --color-gold-accent: #f59e0b;
  --color-emerald-success: #10b981;
  --color-rose-emergency: #f43f5e;

  /* Typography Scale */
  --font-sans: 'Inter', system-ui, sans-serif;
  --font-heading: 'Plus Jakarta Sans', system-ui, sans-serif;
  --text-2xl: clamp(2.25rem, 1.8rem + 1.8vw, 3.5rem);

  /* Glassmorphism & Borders */
  --border-jitter: 1px solid rgba(168, 85, 247, 0.25);
  --border-jitter-hover: 1px solid rgba(217, 70, 239, 0.5);
  --shadow-jitter-glow: 0 12px 32px -4px rgba(139, 92, 246, 0.25), 0 4px 12px -2px rgba(168, 85, 247, 0.15);
  --radius-lg: 20px;
}
```
