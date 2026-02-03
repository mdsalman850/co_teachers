# COTEACHERS Landing Page - Developer Handoff

## Component Architecture

### File Structure
```
src/
├── components/
│   ├── Header.tsx          # Navigation and CTAs
│   ├── Hero.tsx            # Main hero with tree animation
│   ├── Features.tsx        # Feature highlight cards
│   ├── Subjects.tsx        # Subject selection cards
│   ├── HowItWorks.tsx      # 3-step process flow
│   ├── Testimonials.tsx    # Social proof section
│   ├── Footer.tsx          # Footer with links
│   └── CursorTrail.tsx     # Cursor effect component
├── styles/
│   └── globals.css         # Global styles and tokens
├── animations/             # Future Lottie files location
└── App.tsx                 # Main app component
```

## Design System Tokens

### Colors (CSS Variables)
```css
:root {
  --bg: #F7FBF9;              /* Primary background */
  --surface: #FFFFFF;          /* Card/surface color */
  --text: #0F1724;            /* Primary text */
  --accent-bio: #27AE60;      /* Biology green */
  --accent-chem: #6C5CE7;     /* Chemistry purple */
  --accent-phys: #2B6CB0;     /* Physics blue */
  --accent-math: #FF6B6B;     /* Math red */
  --accent-social: #F59E0B;   /* Social studies orange */
}
```

### Typography
- **Headings**: Inter (weights: 600, 700)
- **Body**: Poppins (weights: 400, 500, 600)
- **Line Heights**: 150% for body, 120% for headings

### Responsive Breakpoints
- **Mobile**: 375px
- **Tablet**: 768px  
- **Desktop**: 1200px

## Component Props

### SubjectCard Example
```tsx
interface SubjectCardProps {
  id: string;           // 'bio', 'chem', 'phys', 'math', 'social'
  title: string;        // 'Biology', 'Chemistry', etc.
  icon: React.Component; // Lucide React icon
  description: string;  // Short description
  demoProgress: number; // 0-100 percentage
  accent: string;       // CSS class for accent color
  bgGradient: string;   // Tailwind gradient classes
}
```

### FeatureCard Example
```tsx
interface FeatureCardProps {
  icon: React.Component;
  title: string;
  description: string;
  color: string;        // Accent color class
}
```

## Animation Implementation

### Tree Growth Animation
- **Location**: `Hero.tsx` 
- **Trigger**: Scroll progress (0-100% of viewport height)
- **Effect**: Scale from 0.3 to 1.0, opacity from 0.4 to 1.0
- **Fallback**: Static SVG tree at full scale

### Cursor Trail
- **Location**: `CursorTrail.tsx`
- **Behavior**: Follows mouse with trailing particles
- **Disabled**: Touch devices and `prefers-reduced-motion`

### Hover Effects
- **Cards**: Translate Y, scale, shadow changes
- **Buttons**: Scale 105%, shadow increase
- **Subject Cards**: Slight rotation (1deg) + translate Y

## Accessibility Features

### Motion Preferences
```css
@media (prefers-reduced-motion: reduce) {
  /* All animations disabled */
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Focus States
- 2px solid outline with accent-bio color
- 2px offset from element
- Applied to all interactive elements

### Keyboard Navigation
- Tab order follows logical flow
- Skip links for screen readers
- ARIA labels where appropriate

## Performance Optimizations

### Lazy Loading
- Images below fold are lazy-loaded
- Animations start only when in viewport
- Heavy components defer initial render

### Animation Performance
- Use `transform` and `opacity` only
- Hardware acceleration with `will-change`
- Cancel animations on component unmount

## Lottie Integration (Future)

### File Locations
```
src/animations/
├── tree-growth.json        # Hero tree animation
├── tree-growth-fallback.svg
├── cursor-particles.json   # Cursor trail effect
└── subject-previews/       # Per-subject micro-animations
    ├── biology-leaf.json
    ├── chemistry-molecule.json
    └── physics-energy.json
```

### Implementation Example
```tsx
import Lottie from 'lottie-react';
import treeAnimation from '../animations/tree-growth.json';

const TreeComponent = () => {
  return (
    <Lottie 
      animationData={treeAnimation}
      loop={false}
      autoplay={false}
      style={{ width: 300, height: 400 }}
    />
  );
};
```

## Tailwind Configuration Extensions

### Custom Colors in tailwind.config.js
```js
theme: {
  extend: {
    colors: {
      'primary-bg': '#F7FBF9',
      'primary-text': '#0F1724',
      'accent-bio': '#27AE60',
      'accent-chem': '#6C5CE7',
      'accent-phys': '#2B6CB0',
      'accent-math': '#FF6B6B',
      'accent-social': '#F59E0B',
    }
  }
}
```

## Content Management

### Static Content
- All text content is in components (can be extracted to JSON)
- Demo user name: "Anaya"
- Progress percentages are hardcoded demos

### Image Assets
- Logo: SVG embedded in Header component
- Subject icons: Lucide React icons
- Background elements: CSS gradients and shapes

## Testing Checklist

### Responsive Design
- [ ] Mobile (375px) layout works
- [ ] Tablet (768px) layout works  
- [ ] Desktop (1200px+) layout works
- [ ] Horizontal scroll on subjects

### Animations
- [ ] Tree grows on scroll
- [ ] Cursor trail works on desktop
- [ ] Hover effects on all interactive elements
- [ ] Respects `prefers-reduced-motion`

### Accessibility
- [ ] Keyboard navigation works
- [ ] Screen reader friendly
- [ ] WCAG AA contrast ratios
- [ ] Focus indicators visible

### Performance
- [ ] First Contentful Paint < 1.5s
- [ ] Animations run at 60fps
- [ ] No layout shifts
- [ ] Lazy loading works

## Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Future Enhancements
1. **Lottie Animation Integration**: Replace CSS animations with Lottie files
2. **i18n Support**: Multi-language content management
3. **Dark Mode**: Alternative color scheme
4. **A/B Testing**: Multiple hero variants
5. **Analytics**: Event tracking for interactions