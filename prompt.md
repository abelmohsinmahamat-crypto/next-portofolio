Integrate React Bits Lanyard into the Hero Section

I want you to integrate the Lanyard component from React Bits into my portfolio's Hero section.

1. Install the component

Use the JavaScript + CSS variant.

bash
npx shadcn@latest add @react-bits/Lanyard-JS-CSS


Documentation: https://reactbits.dev/components/lanyard

Registry source: https://reactbits.dev/r/Lanyard-JS-CSS.json

Install all required dependencies specified by the registry. Use the exact official component source.

2. Hero section layout

Create a modern, premium and visually attractive Hero section with a two-column layout:

Left column:

My name and professional title.
A short introduction.
A strong headline.
Two CTA buttons: "View My Projects" and "Contact Me".
Keep the typography clean and modern.

Right column:

Display the interactive 3D Lanyard component.
The Lanyard must be visually prominent.
Make it look like a real hanging professional ID badge.
Keep the badge naturally suspended with realistic physics and smooth interactions.
3. IMPORTANT: Use my actual photo on the badge

I already have a personal photo in my project.

Find the existing profile photo in the project assets (public, assets, images, or similar directories).

Use that exact photo as the front image of the Lanyard badge.

Do NOT generate a new portrait. Do NOT use a random stock photo. Do NOT replace my existing profile picture.

The front of the badge must display:

My actual profile photo.
My name, if available in the existing portfolio content.
My professional title.
A clean, premium ID-card design.

The back of the badge can display:

My professional email, if available.
My portfolio URL.
My social media links or a short personal tagline.

Do not invent personal information.

4. Component configuration

Use this configuration and adapt the image paths to the actual assets:

jsx
import Lanyard from './Lanyard';

<div style={{ width: '100%', height: '600px' }}>
  <Lanyard
    frontImage="/card-front.png"
    backImage="/card-back.png"
    strapImage="/band.png"
  />
</div>


Create the front and back badge designs using my actual profile information and photo. Create a matching strap design if needed.

5. Design requirements
Premium dark aesthetic.
Smooth animations.
Elegant typography.
Balanced spacing.
Subtle background gradients or glow effects.
The badge must not overlap the Hero text.
The Lanyard should attract attention without making the page feel cluttered.
6. Responsive design

Desktop:

Text on the left.
Large interactive Lanyard on the right.

Mobile:

Text first.
Lanyard underneath.
Reduce the component height appropriately.
Prevent horizontal overflow.
Ensure the badge remains fully visible and interactive.
7. Important technical requirements
Inspect the existing project structure before making changes.
Respect the existing framework, architecture, styling conventions and routing.
Do not unnecessarily rewrite existing components.
Reuse my existing profile photo.
Preserve all existing portfolio functionality.
Avoid duplicate dependencies.
Make sure the component works correctly after installation.
8. Final verification

After implementation:

Check that all imports are correct.
Verify that all image paths resolve.
Check the console for errors.
Run the project's build command.
Fix any errors caused by the integration.

Final goal: A visually impressive portfolio Hero section where my real photograph appears on a realistic, interactive 3D hanging ID badge using React Bits Lanyard.