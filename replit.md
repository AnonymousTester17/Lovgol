# LOVGOL - Digital Agency Platform

## Overview

LOVGOL is a modern digital agency website built as a full-stack web application. The platform showcases services across web development, mobile app development, and automation solutions. It features a responsive frontend with service galleries, client testimonials, contact forms, and an admin panel for content management. The application uses a modern tech stack with React/TypeScript frontend, Express backend, and PostgreSQL database for scalable service delivery.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite for fast development and building
- **Routing**: Wouter for lightweight client-side routing
- **UI Components**: Shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom CSS variables for theming and responsive design
- **State Management**: TanStack Query (React Query) for server state management and API data fetching
- **Forms**: React Hook Form with Zod validation for type-safe form handling
- **Animations**: Framer Motion for smooth animations and transitions

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API with JSON responses
- **Request Handling**: Express middleware for JSON parsing, URL encoding, and request logging
- **Error Handling**: Centralized error handling middleware with proper HTTP status codes
- **Development**: Vite integration for hot module replacement in development mode

### Data Layer
- **Database**: PostgreSQL with connection pooling
- **ORM**: Drizzle ORM for type-safe database operations and migrations
- **Schema Management**: Drizzle Kit for database migrations and schema synchronization
- **Validation**: Zod schemas for runtime type validation and API input validation
- **Storage Pattern**: Repository pattern with both in-memory and database implementations

### Database Schema Design
- **Service Previews**: Portfolio items with categories (web/app/automation), technologies, tags, and media
- **Contact Submissions**: Contact form submissions with service interest and budget information
- **Inquiry Submissions**: Detailed project inquiry forms with service-specific requirements
- **Audit Fields**: Created/updated timestamps for data tracking

### Authentication & Security
- **Session Management**: Express sessions with PostgreSQL session store using connect-pg-simple
- **Input Validation**: Zod schemas for all API endpoints to prevent malicious input
- **Environment Security**: Environment variables for sensitive configuration

## External Dependencies

### Database Services
- **Neon Database**: Serverless PostgreSQL database hosting via @neondatabase/serverless
- **Connection**: PostgreSQL connection via DATABASE_URL environment variable

### UI Component Libraries
- **Radix UI**: Comprehensive set of accessible, unstyled UI primitives including dialogs, forms, navigation, and data display components
- **Shadcn/ui**: Pre-built component system using Radix UI with Tailwind CSS styling

### Development Tools
- **Vite**: Frontend build tool with React plugin and development server
- **TypeScript**: Static type checking across frontend, backend, and shared code
- **Tailwind CSS**: Utility-first CSS framework with PostCSS processing
- **ESBuild**: Fast bundling for production server builds

### External Integrations
- **WhatsApp Business**: Direct messaging integration for customer communication
- **Google Fonts**: Web fonts (Inter, DM Sans, Fira Code, Geist Mono, Architects Daughter)
- **Unsplash/Pixabay**: Image hosting for service previews and testimonials

### Replit-Specific Features
- **Development Plugins**: Cartographer for project mapping and dev banner for development environment
- **Error Handling**: Runtime error modal overlay for improved debugging experience