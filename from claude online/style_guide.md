# Assignment Human - Style Guide

## Design Philosophy
Terminal-meets-mission-control aesthetic that makes everyday actions feel like classified operations. Serious enough to convey importance, accessible enough for anyone to use.

## Color Palette

### Primary Colors
- **Terminal Green**: `#00ff00` - Primary text, buttons, accents
- **Deep Black**: `#000000` - Background, void
- **Warning Yellow**: `#ffff00` - Status indicators, alerts
- **Matrix Green**: `#001100` - Subtle background gradients

### Secondary Colors
- **Dim Green**: `rgba(0,255,0,0.3)` - Inactive states, borders
- **Bright Green**: `rgba(0,255,0,0.8)` - Hover states
- **Glow Green**: `rgba(0,255,0,0.1)` - Background tints
- **White**: `#ffffff` - Rare accents, call-to-action buttons

### Semantic Colors
- **Success**: `#00ff00` (terminal green)
- **Warning**: `#ffff00` (bright yellow)
- **Error**: `#ff0000` (red, used sparingly)
- **Info**: `#00d4ff` (cyan blue)

## Typography

### Primary Font
**Courier New** - Monospace font for authentic terminal feel
- Use for all UI text, buttons, headers
- Maintains consistent character spacing
- Evokes command-line/hacker aesthetic

### Font Sizes
- **Hero Text**: `5rem` (80px) - Main "ASSIGNMENT HUMAN" title
- **Section Headers**: `2.5rem` (40px) - Mission briefing headers
- **Body Large**: `1.5rem` (24px) - Mission descriptions
- **Body Standard**: `1rem` (16px) - Meta information, buttons
- **Small Text**: `0.9rem` (14px) - Classifications, details

### Font Weights
- **Bold**: Mission titles, classifications, button text
- **Normal**: Body text, descriptions
- **Light**: Subtle information, metadata

## Layout & Spacing

### Grid System
- **Container Max Width**: 1400px
- **Breakpoints**: 
  - Mobile: 768px and below
  - Tablet: 769px - 1024px
  - Desktop: 1025px and above

### Spacing Scale
- **Micro**: 5px - Fine adjustments
- **Small**: 10px - Element spacing
- **Medium**: 20px - Component spacing
- **Large**: 40px - Section spacing
- **XLarge**: 60px - Page-level spacing

### Layout Principles
- **Full-screen experiences** - Each stage uses full viewport
- **Centered content** - Important elements center-aligned
- **Breathing room** - Generous spacing around key elements
- **Progressive disclosure** - Information revealed in layers

## Interactive Elements

### Buttons

#### Primary Button (Mission Accept)
```css
background: #00ff00;
color: #000000;
padding: 18px 35px;
border: none;
font-family: 'Courier New', monospace;
font-weight: bold;
letter-spacing: 1px;
text-transform: uppercase;
transition: all 0.3s ease;
box-shadow: 0 0 20px rgba(0,255,0,0.3);
```

#### Secondary Button (Duration Selection)
```css
background: transparent;
color: #00ff00;
border: 2px solid #00ff00;
padding: 20px 40px;
font-family: 'Courier New', monospace;
font-weight: bold;
letter-spacing: 2px;
text-transform: uppercase;
transition: all 0.4s ease;
```

#### Hover States
- **Scale up**: `transform: scale(1.05)` or `translateY(-2px)`
- **Glow effect**: Increase box-shadow intensity
- **Color inversion**: Background/text color swap
- **Scanning effect**: Moving gradient overlay

### Form Elements
- **Input fields**: Green border, black background, monospace font
- **Dropdowns**: Terminal-style with green highlight
- **Checkboxes**: Custom styling with green check marks
- **Radio buttons**: Circular with green selection indicator

## Animation & Effects

### Entrance Animations
```css
@keyframes typewriter {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

### Hover Effects
```css
@keyframes scanline {
  0% { left: -100%; }
  100% { left: 100%; }
}
```

### Background Effects
- **Scanning line**: Moving horizontal line across viewport
- **Star field**: Randomly positioned, twinkling dots
- **Matrix rain**: Occasional falling character effects
- **Glitch effects**: Random position shifts for text

### Transition Timing
- **Fast interactions**: 0.2s - Button hovers, clicks
- **Medium transitions**: 0.5s - Page changes, reveals
- **Slow reveals**: 1.5s - Major content appearances
- **Animation delays**: Stagger by 0.3s - 0.5s for sequence

## UI Components

### Terminal Window
- **Border**: 2px solid green
- **Background**: Pure black with subtle gradient
- **Header bar**: Green text with status indicators
- **Scrollbar**: Custom green styling

### Mission Cards
- **Background**: `rgba(0,255,0,0.05)`
- **Border**: 1px solid green with 15px border-radius
- **Padding**: 25px
- **Backdrop filter**: `blur(15px)` for glass effect
- **Hover elevation**: 5px translateY with green glow

### Classification Tags
- **Background**: Linear gradient based on classification type
- **Padding**: 4px 12px
- **Border radius**: 15px
- **Font size**: 0.7rem
- **Letter spacing**: 1px
- **Text transform**: Uppercase

### Progress Indicators
- **Loading bars**: Green fill on black background
- **Spinners**: Rotating green elements
- **Counters**: Monospace numbers with typewriter effect
- **Status lights**: Solid green circles for active states

## Responsive Design

### Mobile Adaptations
- **Font sizes**: Scale down by 20-30%
- **Button sizes**: Maintain touch targets (44px minimum)
- **Spacing**: Reduce by 25-50%
- **Layout**: Stack elements vertically
- **Text length**: Shorter mission descriptions

### Tablet Considerations
- **Grid layouts**: 2-column instead of 3-4 column
- **Touch interactions**: Larger hover states
- **Orientation**: Landscape and portrait optimization

## Accessibility

### Color Contrast
- **Green on black**: 7:1 ratio (AAA compliant)
- **Yellow on black**: 7:1 ratio (AAA compliant)
- **Alternative**: High contrast mode with white text

### Screen Readers
- **Semantic HTML**: Proper heading hierarchy
- **Alt text**: Descriptive image alternatives
- **Focus indicators**: Visible keyboard navigation
- **ARIA labels**: Screen reader context

### Keyboard Navigation
- **Tab order**: Logical sequence through interface
- **Focus styles**: Green outline matching theme
- **Shortcuts**: Space for buttons, Enter for forms
- **Escape routes**: Easy way to exit any state

## Brand Voice in UI

### Text Tone
- **Official but approachable**: "MISSION BRIEFING" not "Assignment Details"
- **Action-oriented**: "Deploy," "Execute," "Initiate"
- **Inclusive authority**: "Agent" not "User"
- **Specific classifications**: "SOCIAL IMPACT" not "Good Deed"

### Error Messages
- **Maintain character**: "CONNECTION LOST" not "Error 404"
- **Helpful solutions**: "REQUESTING NEW MISSION..." not "Try again"
- **Stay in world**: "CLASSIFIED" not "Permission denied"

### Success States
- **Achievement language**: "MISSION ACCOMPLISHED"
- **Progress indicators**: "OBJECTIVE COMPLETE"
- **Encouragement**: "EXCELLENT WORK, AGENT"

## Implementation Notes

### CSS Custom Properties
```css
:root {
  --terminal-green: #00ff00;
  --deep-black: #000000;
  --warning-yellow: #ffff00;
  --glow-green: rgba(0,255,0,0.3);
  --font-mono: 'Courier New', monospace;
  --animation-fast: 0.2s ease;
  --animation-medium: 0.5s ease;
  --animation-slow: 1.5s ease;
}
```

### Performance Considerations
- **Minimize animations**: On mobile devices
- **Reduce transparency**: For better performance
- **Optimize fonts**: Preload Courier New
- **Image optimization**: Compress background textures

### Browser Support
- **Modern browsers**: Full feature support
- **Fallbacks**: Solid colors instead of gradients
- **Progressive enhancement**: Basic functionality first
- **Polyfills**: For CSS custom properties if needed