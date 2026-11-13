# Task: Redesign the Projects Section with Interactive Expandable Cards

I want you to redesign ONLY the Projects section of my existing Next.js portfolio.

## Main Objective
I currently have exactly four (04) project cards. I want to transform them into modern, interactive, expandable project cards.

The main interaction should be:
- Initially, display all four project cards in a responsive 2-column grid.
- Each card should show its project image, title, and only a short preview of its description.
- Hide the remaining part of the description below the image using a subtle gradient fade or a collapsed content area.
- When the user clicks anywhere on a card, smoothly expand that card and reveal its complete description.

## Expand Interaction
When a card is clicked:
1. Expand the selected card smoothly using Framer Motion.
2. Reveal the full project description.
3. Display the technologies used as attractive badges.
4. Show the project features or key highlights.
5. Display two action buttons:
   - Live Demo
   - GitHub Repository
6. Add a clear Collapse / Show Less interaction.

When another card is opened, close the previously expanded card.

## Design Requirements
Create a premium, modern developer portfolio aesthetic.

- Dark background consistent with my existing portfolio.
- Modern glassmorphism where appropriate.
- Rounded corners (16px–24px).
- Subtle borders and elegant shadows.
- High-quality project screenshots.
- Smooth hover transitions.
- Attractive typography and spacing.
- Use a subtle image zoom effect on hover.
- Add a gradient overlay at the bottom of the image.
- The collapsed description should look partially hidden, not abruptly cut off.

## React Bits Integration
Explore React Bits components and integrate them only where useful.

Prioritize:
- AnimatedContent for revealing project information.
- TiltedCard for subtle 3D hover interactions, if compatible with the expansion behavior.
- Framer Motion AnimatePresence and layout animations for smooth expansion and collapse.

Do not add unnecessary animations.

## Technical Requirements
- Use my existing Next.js architecture and project structure.
- Use JavaScript/JSX, not TypeScript.
- Keep the existing four projects and their original information.
- Preserve existing images, project links, GitHub URLs and technologies.
- Make the cards fully responsive.
- Ensure accessibility with keyboard navigation, proper buttons and ARIA attributes.
- Respect prefers-reduced-motion.
- Avoid layout shifts and overlapping content.
- Ensure the cards work properly on mobile, tablet and desktop.
- Avoid installing unnecessary dependencies if they are already available.

## Important
Before implementing:
1. Inspect my existing Projects section and its components.
2. Identify the current styling system and installed dependencies.
3. Reuse my existing project data instead of creating fake projects.
4. Preserve the overall visual identity of my portfolio.
5. Do not modify other sections of the portfolio.

## Expected Result
A beautiful Projects section with four interactive cards, where descriptions are initially partially hidden and become fully visible through a smooth click-to-expand animation.

The final result must look like a premium developer portfolio, not a generic template.