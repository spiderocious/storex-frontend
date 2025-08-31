# File Service App - Component Library Documentation

## Design System Overview

### Brand Colors
- **Primary**: White (#FFFFFF)
- **Secondary**: Black (#000000)  
- **Accent**: Deep Grey (#1F2937)
- **Interactive States**:
  - Hover: Light grey (#F3F4F6)
  - Active: Medium grey (#6B7280)
  - Focus: Blue outline (#3B82F6)
  - Error: Red (#EF4444)
  - Success: Green (#10B981)

### Typography Scale
- **H1**: 32px, Black, Bold
- **H2**: 24px, Black, Bold  
- **H3**: 20px, Black, Semi-bold
- **Body**: 16px, Deep Grey, Regular
- **Small**: 14px, Medium Grey, Regular
- **Caption**: 12px, Light Grey, Regular

## Core Components

### 1. FileViewer Component

#### Purpose
A versatile component that takes a file ID and handles displaying, previewing, or providing download options for any file type. This component abstracts file access and presentation logic.

#### Props
```typescript
interface FileViewerProps {
  fileId: string;
  mode?: 'preview' | 'download' | 'info' | 'embed';
  className?: string;
  showDetails?: boolean;
  autoDownload?: boolean;
  onError?: (error: string) => void;
  onSuccess?: (file: FileData) => void;
}
```

#### API Integration
**Primary Endpoint**: `GET /api/v1/public/file/download-uri/:fileId`

**Response Structure**:
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Download URL generated successfully",
  "data": {
    "uri": "https://presigned-download-url...",
    "type": "jpg",
    "file": {
      "id": "file_id",
      "name": "1756105864179_me.jpg",
      "originalName": "me.jpg", 
      "type": "jpg",
      "size": 2638793,
      "downloads": 8
    },
    "download": {
      "url": "https://presigned-download-url...",
      "expiresIn": 3600,
      "method": "GET",
      "cached": true
    }
  }
}
```

#### File Type Handling

**Images** (`jpg`, `jpeg`, `png`, `gif`, `webp`, `svg`):
- **Preview Mode**: Display image directly using presigned URL
- **Visual**: Image with rounded corners (8px), max width 100%, auto height
- **Actions**: Download button overlay on hover
- **Loading**: Grey skeleton with shimmer effect
- **Error**: Grey placeholder with broken image icon

**Documents** (`pdf`, `doc`, `docx`, `txt`, `rtf`):
- **Preview Mode**: Show document icon with file info
- **Visual**: Large document icon (64px) in deep grey, filename below
- **Actions**: "Open Document" button (black background) and "Download" button (deep grey)
- **PDF Special**: Embed PDF viewer if browser supports it

**Videos** (`mp4`, `avi`, `mov`, `webm`, `mkv`):
- **Preview Mode**: Video player with custom controls
- **Visual**: Video element with play button overlay
- **Controls**: Play/pause, progress bar, volume (all in black/deep grey theme)
- **Actions**: Download button below player

**Audio** (`mp3`, `wav`, `aac`, `ogg`, `flac`):
- **Preview Mode**: Audio player with waveform visualization
- **Visual**: Audio controls bar with black/deep grey styling
- **Actions**: Play/pause, scrubbing, download button

**Archives** (`zip`, `rar`, `tar`, `gz`, `7z`):
- **Preview Mode**: Archive icon with file count (if available in metadata)
- **Visual**: Folder icon (64px) in deep grey
- **Actions**: "Download Archive" button (black background)
- **Info**: File size and estimated extraction size

**Code Files** (`js`, `ts`, `py`, `java`, `cpp`, `html`, `css`, `json`):
- **Preview Mode**: Syntax-highlighted code preview (first 50 lines)
- **Visual**: Code block with syntax highlighting, line numbers
- **Actions**: "View Full File" and "Download" buttons
- **Styling**: Dark theme code block with appropriate language detection

**Unknown/Other Types**:
- **Preview Mode**: Generic file icon with type badge
- **Visual**: File icon (64px) in deep grey with file extension badge
- **Actions**: "Download File" button (black background)

#### Visual States

**Loading State**:
- Skeleton loader with shimmer animation
- Grey background (#F3F4F6)
- Pulsing effect for 2 seconds max

**Error State**:
- Red border (#EF4444)
- Error icon in red
- Error message in red text
- Retry button (deep grey background)

**Success State**:
- File content displayed according to type
- Action buttons appear
- File metadata shown (if enabled)

#### Responsive Behavior
- **Mobile**: Full-width display, stacked info, larger buttons
- **Tablet**: Optimized size with touch controls
- **Desktop**: Full feature set with hover effects

#### Usage Examples
```jsx
// Basic file preview
<FileViewer fileId="12345" mode="preview" />

// Download-only mode
<FileViewer fileId="12345" mode="download" showDetails={true} />

// Embedded in file list
<FileViewer fileId="12345" mode="embed" className="file-thumbnail" />
```

### 2. Button Component

#### Purpose
Standardized button component with consistent styling and states.

#### Props
```typescript
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'danger' | 'ghost';
  size: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  icon?: ReactNode;
  children: ReactNode;
  onClick?: () => void;
}
```

#### Variants
- **Primary**: Black background (#000000), white text, white hover background
- **Secondary**: Deep grey background (#1F2937), white text, light grey hover
- **Danger**: Red background (#EF4444), white text, darker red hover
- **Ghost**: Transparent background, black text, light grey hover

#### Sizes
- **Small**: 32px height, 12px padding, 14px font
- **Medium**: 40px height, 16px padding, 16px font
- **Large**: 48px height, 20px padding, 18px font

### 3. Input Component

#### Purpose
Standardized form input with validation states and consistent styling.

#### Props
```typescript
interface InputProps {
  type: 'text' | 'email' | 'password' | 'number';
  label?: string;
  placeholder?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
  value: string;
  onChange: (value: string) => void;
}
```

#### Visual Design
- **Normal**: White background, black border (1px), deep grey text
- **Focus**: Blue outline (#3B82F6), black border (2px)
- **Error**: Red border (#EF4444), red error text below
- **Disabled**: Light grey background (#F3F4F6), medium grey text

### 4. Card Component

#### Purpose
Container component for grouping related content with consistent styling.

#### Props
```typescript
interface CardProps {
  className?: string;
  padding?: 'small' | 'medium' | 'large';
  hoverable?: boolean;
  children: ReactNode;
}
```

#### Visual Design
- **Background**: White (#FFFFFF)
- **Border**: Light grey (#F3F4F6), 1px solid
- **Border Radius**: 8px
- **Shadow**: Subtle shadow on hover (if hoverable)
- **Hover**: Light grey background (#F3F4F6) for clickable cards

### 5. Modal Component

#### Purpose
Overlay modal for forms, file uploads, and detail views.

#### Props
```typescript
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'small' | 'medium' | 'large' | 'fullscreen';
  children: ReactNode;
}
```

#### Visual Design
- **Overlay**: Semi-transparent black (#000000CC)
- **Container**: White background, rounded corners (12px)
- **Header**: Black title, close button (deep grey, hover black)
- **Content**: White background with appropriate padding

### 6. FileUploadZone Component

#### Purpose
Drag-and-drop file upload area with progress tracking.

#### Props
```typescript
interface FileUploadZoneProps {
  bucketId: string;
  onUploadComplete: (file: FileData) => void;
  onUploadError: (error: string) => void;
  maxFileSize?: number; // default 100MB
  acceptedTypes?: string[];
  multiple?: boolean;
}
```

#### Visual Design
- **Drop Zone**: Dashed border (deep grey), light grey background on drag-over
- **Progress Bar**: Black fill on light grey background
- **File Preview**: Small thumbnail with filename
- **States**: Idle, drag-over, uploading, success, error

#### API Integration
Uses `POST /api/v1/buckets/:bucketId/upload` or `POST /api/v1/public/file/upload-uri`

### 7. BucketCard Component

#### Purpose
Display bucket information in a card format for grid layouts.

#### Props
```typescript
interface BucketCardProps {
  bucket: {
    id: string;
    name: string;
    fileCount: number;
    totalSize: number;
    createdAt: string;
  };
  onClick: (bucketId: string) => void;
}
```

#### Visual Design
- **Card**: White background, light grey border, hover effect
- **Header**: Black bucket name, medium font weight
- **Stats**: Deep grey file count and size
- **Footer**: Light grey creation date
- **Actions**: Deep grey settings icon, hover black

### 8. FileListItem Component

#### Purpose
Display file information in list/table format.

#### Props
```typescript
interface FileListItemProps {
  file: {
    id: string;
    name: string;
    originalName: string;
    type: string;
    size: number;
    downloads: number;
    createdAt: string;
  };
  onView: (fileId: string) => void;
  onDownload: (fileId: string) => void;
}
```

#### Visual Design
- **Row**: Alternating white/light grey backgrounds
- **Hover**: Light grey background
- **File Icon**: Type-specific icon in deep grey
- **Text**: Black filename, deep grey metadata
- **Actions**: Icon buttons (download, view) in deep grey, hover black

### 9. StatCard Component

#### Purpose
Display numerical statistics with labels for dashboard.

#### Props
```typescript
interface StatCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon?: ReactNode;
  trend?: 'up' | 'down' | 'neutral';
}
```

#### Visual Design
- **Card**: White background, light grey border
- **Value**: Large black number (32px)
- **Title**: Deep grey label (16px)
- **Icon**: Black icon (24px) in top-right corner

### 10. Breadcrumb Component

#### Purpose
Navigation breadcrumbs for hierarchical pages.

#### Props
```typescript
interface BreadcrumbProps {
  items: Array<{
    label: string;
    href?: string;
    active?: boolean;
  }>;
}
```

#### Visual Design
- **Links**: Deep grey text, hover black, underline on hover
- **Active**: Black text, no hover effect
- **Separator**: ">" in medium grey between items

### 11. LoadingSpinner Component

#### Purpose
Loading indicator for async operations.

#### Props
```typescript
interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: 'black' | 'grey' | 'white';
}
```

#### Visual Design
- **Spinner**: Rotating circle with black/grey colors
- **Sizes**: 16px (small), 24px (medium), 32px (large)

### 12. ErrorBanner Component

#### Purpose
Display error messages with consistent styling.

#### Props
```typescript
interface ErrorBannerProps {
  message: string;
  type?: 'error' | 'warning' | 'info';
  dismissible?: boolean;
  onDismiss?: () => void;
  retryAction?: () => void;
}
```

#### Visual Design
- **Error**: Red background (#EF4444), white text
- **Warning**: Orange background (#F59E0B), white text
- **Info**: Blue background (#3B82F6), white text
- **Border Radius**: 6px
- **Actions**: White button for retry, X button for dismiss

### 13. Navbar Component

#### Purpose
Top navigation bar with user info and main navigation.

#### Props
```typescript
interface NavbarProps {
  user?: {
    email: string;
    id: string;
  };
  currentPage?: string;
  onLogout: () => void;
}
```

#### Visual Design
- **Background**: White (#FFFFFF)
- **Border Bottom**: Light grey (#F3F4F6), 1px
- **Logo**: Black text, bold weight
- **User Info**: Deep grey email, hover black
- **Logout**: Deep grey button, hover black

### 14. FileTypeIcon Component

#### Purpose
Display appropriate icons for different file types.

#### Props
```typescript
interface FileTypeIconProps {
  fileType: string;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}
```

#### File Type Mappings
- **Images**: Photo icon (camera symbol)
- **Videos**: Video icon (play button in rectangle)
- **Audio**: Music icon (musical note)
- **Documents**: Document icon (page with lines)
- **Archives**: Archive icon (compressed folder)
- **Code**: Code icon (brackets {})
- **Unknown**: Generic file icon

#### Colors
- All icons use deep grey (#1F2937) with hover black (#000000)

### 15. ProgressBar Component

#### Purpose
Progress indicator for file uploads and operations.

#### Props
```typescript
interface ProgressBarProps {
  progress: number; // 0-100
  showPercentage?: boolean;
  color?: 'black' | 'blue' | 'green';
  size?: 'small' | 'medium' | 'large';
}
```

#### Visual Design
- **Background**: Light grey (#F3F4F6)
- **Fill**: Black (#000000) default, smooth animation
- **Height**: 4px (small), 8px (medium), 12px (large)
- **Border Radius**: 4px

### 16. CopyButton Component

#### Purpose
Button to copy text to clipboard with feedback.

#### Props
```typescript
interface CopyButtonProps {
  text: string;
  label?: string;
  size?: 'small' | 'medium';
  showFeedback?: boolean;
}
```

#### Visual Design
- **Button**: Deep grey background, white text
- **Icon**: Copy icon, changes to checkmark on success
- **Feedback**: Green success message "Copied!" appears briefly

### 17. EmptyState Component

#### Purpose
Display empty states with appropriate messaging and actions.

#### Props
```typescript
interface EmptyStateProps {
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  icon?: ReactNode;
}
```

#### Visual Design
- **Container**: Centered content with vertical spacing
- **Icon**: Large icon (64px) in medium grey
- **Title**: Black text, medium font weight
- **Description**: Deep grey text
- **Action**: Primary button styling

### 18. FileInfoCard Component

#### Purpose
Display detailed file information in a card format.

#### Props
```typescript
interface FileInfoCardProps {
  file: {
    id: string;
    name: string;
    originalName: string;
    type: string;
    size: number;
    downloads: number;
    createdAt: string;
    metadata?: object;
  };
  showActions?: boolean;
  onDownload?: () => void;
  onDelete?: () => void;
}
```

#### Visual Design
- **Card**: White background, light grey border
- **Header**: File name in black, type badge in deep grey
- **Meta**: Size, downloads, date in deep grey
- **Actions**: Icon buttons in deep grey, hover black
- **Metadata**: Expandable JSON view with syntax highlighting

### 19. SearchInput Component

#### Purpose
Search input with filtering capabilities.

#### Props
```typescript
interface SearchInputProps {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  onClear?: () => void;
  disabled?: boolean;
}
```

#### Visual Design
- **Input**: White background, black border, search icon
- **Focus**: Blue outline, search icon becomes active
- **Clear**: X button appears when text exists (deep grey, hover black)

### 20. Pagination Component

#### Purpose
Page navigation for large datasets.

#### Props
```typescript
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showInfo?: boolean;
}
```

#### Visual Design
- **Buttons**: Deep grey background, white text
- **Active**: Black background, white text
- **Disabled**: Light grey background, medium grey text
- **Info**: "Page X of Y" in deep grey

## Layout Components

### 21. PageContainer Component

#### Purpose
Main page wrapper with consistent spacing and responsive behavior.

#### Props
```typescript
interface PageContainerProps {
  title?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: ReactNode;
  children: ReactNode;
}
```

#### Visual Design
- **Container**: Max width 1200px, centered, responsive padding
- **Header**: Title and actions bar with proper spacing
- **Content**: Main content area with consistent margins

### 22. Grid Component

#### Purpose
Responsive grid system for layouts.

#### Props
```typescript
interface GridProps {
  columns?: 1 | 2 | 3 | 4 | 6 | 12;
  gap?: 'small' | 'medium' | 'large';
  responsive?: boolean;
  children: ReactNode;
}
```

#### Responsive Breakpoints
- **Mobile**: 1 column (320px-768px)
- **Tablet**: 2-3 columns (768px-1024px)  
- **Desktop**: Full columns (1024px+)

### 23. Sidebar Component

#### Purpose
Side navigation for app sections.

#### Props
```typescript
interface SidebarProps {
  items: Array<{
    label: string;
    href: string;
    icon?: ReactNode;
    active?: boolean;
  }>;
  collapsed?: boolean;
  onToggle?: () => void;
}
```

#### Visual Design
- **Background**: White with light grey border
- **Items**: Deep grey text, black on hover/active
- **Icons**: Deep grey, black on hover/active
- **Width**: 240px expanded, 60px collapsed

## Utility Components

### 24. Tooltip Component

#### Purpose
Contextual information on hover.

#### Props
```typescript
interface TooltipProps {
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  children: ReactNode;
}
```

#### Visual Design
- **Background**: Black (#000000)
- **Text**: White, 14px
- **Arrow**: Pointing to trigger element
- **Border Radius**: 4px

### 25. Badge Component

#### Purpose
Small labels for status, types, or counts.

#### Props
```typescript
interface BadgeProps {
  text: string;
  variant?: 'default' | 'success' | 'error' | 'warning';
  size?: 'small' | 'medium';
}
```

#### Visual Design
- **Default**: Deep grey background, white text
- **Success**: Green background (#10B981), white text
- **Error**: Red background (#EF4444), white text
- **Warning**: Orange background (#F59E0B), white text

### 26. ConfirmDialog Component

#### Purpose
Confirmation dialog for destructive actions.

#### Props
```typescript
interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  type?: 'danger' | 'warning' | 'info';
}
```

#### Visual Design
- **Modal**: Small size, centered
- **Icon**: Type-specific icon (warning triangle, info circle)
- **Buttons**: Danger/primary and cancel styling
- **Focus**: Auto-focus on cancel button for safety

## Component Composition Examples

### FileViewer Implementation Example
```jsx
function FileViewer({ fileId, mode = 'preview', showDetails = false }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFileInfo(fileId);
  }, [fileId]);

  const fetchFileInfo = async (id) => {
    try {
      const response = await fetch(`/api/v1/public/file/download-uri/${id}`);
      const data = await response.json();
      
      if (data.success) {
        setFile(data.data);
        setLoading(false);
      }
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const renderFilePreview = () => {
    const { file: fileInfo, download } = file;
    
    switch (fileInfo.type.toLowerCase()) {
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'webp':
        return (
          <img 
            src={download.url} 
            alt={fileInfo.originalName}
            className="max-w-full h-auto rounded-lg"
          />
        );
      
      case 'mp4':
      case 'webm':
      case 'mov':
        return (
          <video 
            controls 
            className="max-w-full rounded-lg"
            preload="metadata"
          >
            <source src={download.url} type={`video/${fileInfo.type}`} />
          </video>
        );
      
      case 'pdf':
        return (
          <embed 
            src={download.url} 
            type="application/pdf"
            className="w-full h-96 rounded-lg"
          />
        );
      
      default:
        return (
          <div className="flex flex-col items-center p-8">
            <FileTypeIcon fileType={fileInfo.type} size="large" />
            <p className="mt-2 text-black font-medium">{fileInfo.name}</p>
            <Button 
              variant="primary" 
              onClick={() => window.open(download.url, '_blank')}
            >
              Download File
            </Button>
          </div>
        );
    }
  };

  if (loading) return <LoadingSpinner size="medium" />;
  if (error) return <ErrorBanner message={error} />;

  return (
    <Card className="file-viewer">
      {renderFilePreview()}
      {showDetails && (
        <FileInfoCard 
          file={file.file} 
          showActions={true}
          onDownload={() => window.open(file.download.url, '_blank')}
        />
      )}
    </Card>
  );
}
```

## Component Library Structure

```
src/
├── components/
│   ├── ui/                     # Basic UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   ├── Modal.tsx
│   │   └── index.ts
│   ├── file/                   # File-specific components
│   │   ├── FileViewer.tsx
│   │   ├── FileUploadZone.tsx
│   │   ├── FileListItem.tsx
│   │   ├── FileInfoCard.tsx
│   │   └── FileTypeIcon.tsx
│   ├── bucket/                 # Bucket-specific components
│   │   ├── BucketCard.tsx
│   │   └── BucketHeader.tsx
│   ├── layout/                 # Layout components
│   │   ├── PageContainer.tsx
│   │   ├── Navbar.tsx
│   │   ├── Sidebar.tsx
│   │   └── Grid.tsx
│   └── common/                 # Common components
│       ├── LoadingSpinner.tsx
│       ├── ErrorBanner.tsx
│       ├── Breadcrumb.tsx
│       ├── StatCard.tsx
│       └── ConfirmDialog.tsx
```

## Development Guidelines

### Component Standards
1. **TypeScript**: All components use TypeScript with proper interfaces
2. **Accessibility**: ARIA labels, keyboard navigation, screen reader support
3. **Responsive**: Mobile-first design with responsive props
4. **Testing**: Unit tests for all components with React Testing Library
5. **Storybook**: Component documentation and visual testing

### Styling Approach
- **CSS-in-JS** or **Tailwind CSS** for styling
- **CSS Variables** for theme colors
- **Responsive utilities** for breakpoint handling
- **Animation library** for smooth transitions

### Performance Considerations
- **Lazy loading** for heavy components like FileViewer
- **Memoization** for expensive calculations
- **Virtual scrolling** for large file lists
- **Image optimization** for file previews

### Error Handling Patterns
- **Graceful degradation** for unsupported file types
- **Retry mechanisms** for network failures
- **User-friendly error messages** with actionable solutions
- **Loading states** for all async operations