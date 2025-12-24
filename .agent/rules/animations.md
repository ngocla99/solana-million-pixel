---
trigger: manual
---

# Animation Guidelines

## Core Rules

- Default to `ease-out` for most animations
- Duration: **0.2s - 0.3s** (never > 1s)
- Use hardware-accelerated properties: `opacity`, `transform`

## Easing Reference

### ease-out ✅ RECOMMENDED (entering elements, modals, dropdowns)

```css
--ease-out-quad: cubic-bezier(0.25, 0.46, 0.45, 0.94); /* subtle */
--ease-out-cubic: cubic-bezier(0.215, 0.61, 0.355, 1); /* moderate */
--ease-out-quint: cubic-bezier(0.23, 1, 0.32, 1); /* strong - most used */
```

### ease-in-out (moving within screen, carousels)

```css
--ease-in-out-cubic: cubic-bezier(0.645, 0.045, 0.355, 1);
--ease-in-out-quart: cubic-bezier(0.77, 0, 0.175, 1);
```

### ease-in ⚠️ Avoid (only for elements leaving)

## Timing Quick Reference

| Use Case        | Duration  | Easing                        |
| --------------- | --------- | ----------------------------- |
| Simple hover    | 200ms     | `ease`                        |
| Modal open      | 200-300ms | `ease-out-quint`              |
| Dropdown        | 150ms     | `ease-out-cubic`              |
| Page transition | 300ms     | `ease-out-quart`              |
| Drag gesture    | Spring    | `stiffness: 500, damping: 25` |

## Hover Transitions

```css
/* Simple (color, bg, opacity) */
.button {
  transition: background-color 200ms ease;
}

/* Complex (transform, shadow) */
.card {
  transition: all 300ms cubic-bezier(0.23, 1, 0.32, 1);
}
.card:hover {
  transform: translateY(-4px);
}

/* Touch devices - disable hover */
@media (hover: hover) and (pointer: fine) {
  .button {
    transition: background-color 200ms ease;
  }
}
```

## Accessibility

```css
.animated-element {
  animation: slideIn 0.3s cubic-bezier(0.23, 1, 0.32, 1);
}

@media (prefers-reduced-motion: reduce) {
  .animated-element {
    animation: none;
  }
}
```

**Disable:** transforms, parallax, infinite animations  
**Keep:** opacity fades, color transitions, loading indicators

## Framer Motion Patterns

### Modal/Dialog

```tsx
<motion.div
  initial={{ opacity: 0, scale: 0.95 }}
  animate={{ opacity: 1, scale: 1 }}
  exit={{ opacity: 0, scale: 0.95 }}
  transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
/>
```

### Dropdown (with origin)

```tsx
<motion.div
  style={{ transformOrigin: "top right" }}
  initial={{ opacity: 0, scale: 0.95, y: -10 }}
  animate={{ opacity: 1, scale: 1, y: 0 }}
  transition={{ duration: 0.15, ease: [0.23, 1, 0.32, 1] }}
/>
```

### List Stagger

```tsx
<motion.div
  variants={{
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } },
  }}
  initial="hidden"
  animate="show"
>
  {items.map((item) => (
    <motion.div
      key={item.id}
      variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
    />
  ))}
</motion.div>
```

### Spring (for interactions, drag)

```tsx
<motion.div
  animate={{ x: 100 }}
  transition={{ type: "spring", stiffness: 300, damping: 20 }}
/>
```

## Performance Rules

✅ **Animate:** `opacity`, `transform`  
❌ **Avoid:** `width`, `height`, `top`, `left`, `margin`, `padding`

```css
/* ❌ Bad */
.element {
  transition: left 0.3s;
  left: 0;
}

/* ✅ Good */
.element {
  transition: transform 0.3s;
  transform: translateX(0);
}
```

**will-change:** Only for `transform`, `opacity`. Max 5-10 elements.  
**blur:** Max 20px for animations.

## Origin-Aware Animations

| Trigger Position | Transform Origin |
| ---------------- | ---------------- |
| Top Left         | `top left`       |
| Top Right        | `top right`      |
| Bottom Left      | `bottom left`    |
| Bottom Right     | `bottom right`   |

## Spring vs Tween

| Use Case                         | Type   |
| -------------------------------- | ------ |
| User interactions, drag, modal   | Spring |
| Precise timing, sequences, fades | Tween  |
