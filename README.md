# File Service App

A React-based file service web application with cloud storage capabilities.

## Features

- 📁 File upload and storage
- 🪣 Bucket management
- 🔗 Public file sharing
- 📄 File preview for multiple formats
- 📦 API for external integrations

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **Testing**: Jest + React Testing Library
- **Architecture**: Domain-driven design with barrel exports

## Getting Started

### Prerequisites

- Node.js 18+ (recommended)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Copy environment variables:
```bash
cp .env.example .env.local
```

3. Start development server:
```bash
npm run dev
```

4. Open [http://localhost:5173](http://localhost:5173)

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript compiler

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Basic UI elements
│   ├── file/           # File-related components
│   ├── bucket/         # Bucket-related components
│   ├── layout/         # Layout components
│   └── common/         # Common components
├── pages/              # Page components
├── configs/            # Configuration files
├── routes/             # Route definitions
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
├── hooks/              # Custom React hooks
└── providers/          # Context providers
```

## Key Components

### FileViewer
A versatile component for displaying files of any type:

```jsx
import { FileViewer } from '@/components';

<FileViewer 
  fileId="your-file-id" 
  mode="preview" 
  showDetails={true}
/>
```

### API Integration
All API calls use the centralized API client:

```typescript
import { apiClient } from '@/utils';

const response = await apiClient.get('/buckets');
```

## Testing

Run the test suite:

```bash
npm run test
```

With coverage:

```bash
npm run test:coverage
```

## Architecture Decisions

- **Snake case naming**: All files use snake-case (e.g., `file-viewer/`)
- **Barrel exports**: Every folder exports through `index.ts`
- **Domain-driven structure**: Components grouped by domain
- **TypeScript strict mode**: Full type safety
- **Responsive design**: Mobile-first approach

## API Endpoints

See `docs/apis.md` for complete API documentation.

## Contributing

1. Follow the snake-case naming convention
2. Add tests for new components
3. Use barrel exports for all modules
4. Maintain TypeScript strict mode
5. Follow the existing code style

## License

MIT