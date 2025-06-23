
# create-asktemp

A CLI tool to quickly scaffold Arabic RTL dashboard projects with authentication, theme system, and modern UI components.

## Features

- ✅ **Arabic RTL Support** - Complete right-to-left layout with Arabic navigation
- ✅ **Authentication System** - Ready-to-use auth with API hooks and middleware protection
- ✅ **Dark/Light Theme** - Built-in theme system with user preferences
- ✅ **ShadCN UI Components** - Modern, accessible UI component library
- ✅ **Collapsible Sidebar** - Responsive sidebar with navigation and user settings
- ✅ **Next.js 15** - Latest Next.js with App Router and TypeScript
- ✅ **Tailwind CSS v4** - Modern styling with CSS variables
- ✅ **Route Protection** - Middleware-based authentication and route guards

## Quick Start

```bash
npx create-asktemp my-dashboard
cd my-dashboard
npm run dev
```

That's it! Your Arabic RTL dashboard is ready at `http://localhost:3000`

## Usage

```bash
npx create-asktemp <project-name>
```

### Examples

```bash
# Create a new dashboard project
npx create-asktemp client-portal

# Create an admin panel
npx create-asktemp admin-dashboard

# Create a management system
npx create-asktemp inventory-system
```

## What You Get

### 🏗️ Project Structure
```
my-dashboard/
├── src/
│   ├── app/
│   │   ├── (auth)/login/          # Authentication pages
│   │   ├── (protected)/           # Protected dashboard pages
│   │   └── layout.tsx
│   ├── components/
│   │   ├── layouts/               # Sidebar, navigation, breadcrumbs
│   │   └── ui/                    # ShadCN UI components
│   ├── context/                   # Theme and navigation context
│   ├── hooks/auth/                # Authentication hooks
│   └── middleware.ts              # Route protection
├── package.json
└── tailwind.config.ts
```

### 🔐 Authentication System
- **Login page** with Arabic RTL layout
- **Route protection** with Next.js middleware
- **API hooks** for all auth endpoints
- **Token management** with automatic refresh
- **User settings** with password change and logout

### 🎨 Theme System
- **Dark/Light mode** toggle
- **System preference** detection
- **Persistent** user choices
- **Arabic labels** and RTL support

### 🧭 Navigation
- **Collapsible sidebar** with icon-only mode
- **Dynamic breadcrumbs** reflecting current page
- **Arabic navigation** labels and structure
- **User dropdown** with settings and logout

## Customization

After creating your project, you'll typically want to customize:

### 1. API Configuration
Update API endpoints in `src/hooks/auth/config.ts`:
```typescript
const apiConfig = {
  baseURL: 'http://your-api-server.com/api/',
  // ... other settings
};
```

### 2. Theme Colors
Modify colors in `src/styles/globals.css`:
```css
:root {
  --primary: 210 40% 98%;
  --primary-foreground: 222.2 84% 4.9%;
  /* ... customize your colors */
}
```

### 3. Navigation Structure
Update navigation items in `src/components/layouts/sidebar/app-sidebar.tsx`:
```typescript
const navItems = [
  {
    title: "الرئيسية",
    icon: Home,
    items: [
      { title: "لوحة التحكم", url: "/dashboard" },
      // ... add your pages
    ]
  }
];
```

### 4. Branding
- Replace logo/icons in `public/` directory
- Update app title in `src/app/layout.tsx`
- Customize sidebar header in `app-sidebar.tsx`

## Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: ShadCN UI (Radix UI primitives)
- **Icons**: Lucide React
- **Authentication**: Custom API hooks with middleware
- **State Management**: React Context
- **Layout**: Arabic RTL with responsive design

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Requirements

- Node.js 16.0 or later
- npm or yarn

## License

MIT License - feel free to use this template for your projects.

## Support

For questions about using this template:
- Check the generated project's documentation
- Review the component examples in the template
- Refer to [ShadCN UI documentation](https://ui.shadcn.com/)
- Check [Next.js documentation](https://nextjs.org/docs)

---

**Happy coding!** 🎉 Build amazing Arabic RTL dashboards with this template.
