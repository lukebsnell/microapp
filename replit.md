# FRCPath Part 2 Microbiology Revision App

## Overview

This is an educational web application designed for medical professionals studying for the FRCPath Part 2 Microbiology examination. The application provides a structured revision platform that combines PDF study materials with audio lectures, organized hierarchically by eight main categories: Laboratory, Bacteria, Fungi, Viruses, Parasites, Infection Control, Antimicrobials, and Built Environment.

The app features a collapsible sidebar navigation system for browsing topics within categories, an integrated PDF viewer for reading course materials, and an audio player for listening to lectures. It follows Material Design principles optimized for extended study sessions with support for both dark and light modes (dark mode is default).

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React 18+ with TypeScript, built using Vite as the build tool and development server.

**UI Component Library**: Shadcn/ui (Radix UI primitives) with Tailwind CSS for styling. The design system uses the "new-york" style variant with custom HSL color variables for theming.

**State Management**: 
- React Query (TanStack Query) for server state management and data fetching
- React Context for theme management (dark/light mode)
- Local component state for UI interactions

**Routing**: Wouter for lightweight client-side routing

**Key Design Decisions**:
- Dark mode as default theme for reduced eye strain during long study sessions
- Material Design principles for clear information hierarchy
- Custom color palette optimized for medical content readability (deep navy-charcoal backgrounds, medical blue accents)
- Typography: Inter font for medical terminology readability, JetBrains Mono for technical content

### Backend Architecture

**Runtime**: Node.js with Express.js framework

**API Structure**: RESTful API with three main endpoints:
- `GET /api/topics` - Retrieves all available topics organized by category
- `GET /api/topics/:categoryId/:topicId/pdf` - Serves PDF files for specific topics
- `GET /api/topics/:categoryId/:topicId/audio` - Serves audio files for specific topics

**File Storage Pattern**: Hierarchical filesystem-based storage with two-level organization:
- Category folders (laboratory, bacteria, fungi, viruses, parasites, infection-control, antimicrobials, built-environment)
- Topic folders within each category containing one PDF and one WAV file

**Storage Abstraction**: Interface-based storage pattern (`IStorage`) currently implemented with in-memory storage (`MemStorage`) for user data, with filesystem scanning for topic content. This design allows for easy migration to database-backed storage.

**Security Considerations**: Path sanitization implemented to prevent directory traversal attacks when serving files.

### Data Storage Solutions

**User Data**: Currently using in-memory storage with interface-based design ready for database migration.

**Content Storage**: Hierarchical file-based storage system where course materials are organized by category:
```
uploads/topics/
  ├── laboratory/
  ├── bacteria/
  │   ├── gram-positive-cocci/
  │   ├── gram-negative-bacilli/
  │   └── mycobacterial-infections/
  ├── fungi/
  │   ├── aspergillus-species/
  │   └── candida-species/
  ├── viruses/
  │   ├── dna-viruses/
  │   └── rna-viruses/
  ├── parasites/
  │   ├── protozoa/
  │   └── helminths/
  ├── infection-control/
  ├── antimicrobials/
  └── built-environment/
```

**Database Configuration**: Drizzle ORM configured with PostgreSQL support (via Neon Database serverless driver), though not yet actively used for content storage. Schema defines:
- Users table with authentication fields
- Topic interface for content metadata

**Design Rationale**: The filesystem approach simplifies content uploads and management for educational materials while the database infrastructure is prepared for future user progress tracking and authentication features.

### External Dependencies

**UI Component Libraries**:
- Radix UI primitives (accordion, dialog, dropdown, etc.) for accessible component foundations
- Embla Carousel for content navigation
- Lucide React for icons

**Styling & Design**:
- Tailwind CSS for utility-first styling
- Class Variance Authority (CVA) for component variants
- Custom CSS variables for theming (HSL color system)

**Forms & Validation**:
- React Hook Form for form state management
- Zod for schema validation
- @hookform/resolvers for integration

**Date Handling**: date-fns for date formatting and manipulation

**Database & ORM**:
- Drizzle ORM for type-safe database operations
- @neondatabase/serverless for PostgreSQL connectivity
- drizzle-zod for automatic Zod schema generation from database schemas

**Development Tools**:
- Vite plugins for development experience (Replit-specific tooling for runtime errors, cartographer, dev banner)
- TypeScript for type safety across the stack
- ESBuild for server-side bundling

**Audio/PDF Rendering**: Native browser capabilities (HTML5 audio element, iframe PDF embedding)

**Build & Deployment**:
- Vite for frontend bundling
- ESBuild for backend bundling
- Express for production server with static file serving