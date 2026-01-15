# UX & Design Strategy

## Design Philosophy
The UI aims for a **"Solarpunk / Sci-Fi"** aesthetic, combining deep space blacks with neon cyans and purples. The interface feels "alive" through constant, subtle motion and reactivity.

## Key UX Features

### 1. Cursor Reactivity
- **Concept**: The user should feel like they are manipulating a physical interface.
- **Implementation**: Buttons have magnetic pull (via Framer Motion), and the 3D background gently rotates based on mouse position (via Three.js `useFrame`).

### 2. Glassmorphism
- **Concept**: Depth and hierarchy without opacity.
- **Implementation**: Elements use `backdrop-filter: blur(10px)` with translucent white borders to simulate frosted glass floating in space.

### 3. Motion Language
- **Entrance**: smooth `opacity` and `y-axis` slides (0.5s - 0.8s).
- **Interaction**: Rapid scale feedback (1.05x on hover, 0.95x on tap).
- **Transitions**: Pages dissolve into each other.

## Accessibility
Despite the heavy visuals, the app maintains:
- **Contrast**: High contrast text (White on Black).
- **Keyboard Nav**: Focus states are preserved.
- **Motion**: `prefers-reduced-motion` can be hooked into Framer Motion to disable animations for sensitive users (Future enhancement).
