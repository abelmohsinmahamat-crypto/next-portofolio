# Task: Integrate React Bits FluxLines as the Home Page Background

I want you to integrate the **FluxLines** background component from React Bits into my existing project.

## 1. Component documentation

- Official documentation: https://reactbits.dev/backgrounds/flux-lines
- Registry JSON: https://reactbits.dev/r/FluxLines-JS-CSS.json
- Full component library: https://reactbits.dev/llms.txt

Use the **JS-CSS variant (JavaScript + plain CSS)**.

## 2. Installation

First, inspect my existing project structure and identify the framework, styling system, and Home page implementation.

Install the component using:

```bash
npx shadcn@latest add @react-bits/FluxLines-JS-CSS
```

Fetch and inspect the registry JSON to obtain the exact component source and dependencies.

Install any missing dependencies listed in the registry.

Do not recreate the component manually if the official source is available.

## 3. Component configuration

Use the following configuration:

```jsx
import FluxLines from './FluxLines';

<div style={{ width: '100%', height: '600px', position: 'relative' }}>
  <FluxLines
    colors={['#ffffff', '#ffffff', '#ffffff']}
    glow={2}
    rimWidth={0.2}
    lineWidth={1}
    flowDirection="down"
    mouseInteraction
    clickSwirl
  />
</div>
```

## 4. Integration into the Home page

My main objective is to use FluxLines as an animated background for the entire Hero section of my Home page.

Requirements:

- Place FluxLines behind the Hero content.
- Make the animation cover the full Hero section.
- Use absolute positioning for the background layer.
- Keep the Hero content in a higher z-index.
- Ensure all text, headings, buttons, navigation and other interactive elements remain readable and clickable.
- Keep the animation responsive on desktop, tablet and mobile.
- Avoid horizontal or vertical overflow.
- Make sure the background does not interfere with existing animations or interactions.

## 5. Design expectations

I want a professional, modern and futuristic portfolio aesthetic.

The desired appearance:

- Dark background.
- Elegant white animated flux lines.
- Smooth flowing animation.
- Subtle glow effects.
- Interactive mouse movement.
- Click interaction using `clickSwirl`.
- Beautiful contrast between the background and Hero content.

The animation should enhance the design rather than distract visitors from the main content.

## 6. Important implementation rules

- Preserve my existing Home page content and design.
- Do not remove existing components or sections.
- Do not unnecessarily modify the global CSS.
- Avoid duplicate CSS or dependencies.
- Keep the component reusable and maintainable.
- Respect my existing project architecture.
- If the project uses Next.js App Router, handle browser-only animation requirements with a Client Component (`'use client'`) where necessary.
- Ensure proper cleanup of animation loops and event listeners.
- Respect reduced-motion accessibility preferences where possible.

## 7. Final verification

After implementation:

1. Verify that the component is correctly installed.
2. Check that all dependencies are available.
3. Run the project.
4. Fix any import, CSS, rendering or console errors.
5. Run the production build.
6. Confirm that FluxLines appears behind the Home page Hero content.
7. Ensure the rest of the website remains unchanged.

**Final objective:** Give my portfolio Home page a beautiful, futuristic animated background using the official React Bits FluxLines component, without compromising performance, accessibility or the existing design.