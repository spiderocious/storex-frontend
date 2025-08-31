# File Service App - Product Requirements Document

## Product Overview
A web-based file service infrastructure that provides cloud storage capabilities through a simple interface. Users can create buckets, upload files, and manage their storage with a clean, minimalist design.

## Design System

### Color Palette
- **Primary**: White (#FFFFFF) - Main background, cards, modals
- **Secondary**: Black (#000000) - Primary text, borders, icons  
- **Accent**: Deep Grey (#1F2937) - Secondary text, disabled states, subtle backgrounds
- **Interactive States**:
  - Hover: Light grey (#F3F4F6)
  - Active: Medium grey (#6B7280)
  - Focus: Blue outline (#3B82F6)
  - Error: Red (#EF4444)
  - Success: Green (#10B981)

### Typography
- **Headers**: Black (#000000), bold weight
- **Body text**: Deep grey (#1F2937), regular weight
- **Secondary text**: Medium grey (#6B7280)
- **Error text**: Red (#EF4444)

### Responsive Design
- **Mobile**: 320px - 768px (single column layout)
- **Tablet**: 768px - 1024px (adaptive grid)
- **Desktop**: 1024px+ (full multi-column layout)

## Detailed Page Specifications

### 1. Sign Up Page (`/signup`)

#### Visual Design
- **Background**: White (#FFFFFF)
- **Container**: Centered card with light grey border (#F3F4F6)
- **Form**: Clean, minimal design with proper spacing
- **Button**: Black background (#000000), white text, hover state light grey (#F3F4F6)

#### Content & Layout
- **Header**: "Create Account" in large black text
- **Email Field**: 
  - Label: "Email Address" (deep grey #1F2937)
  - Input: White background, black border, focus blue outline
  - Validation: Real-time email format checking
- **Password Field**:
  - Label: "Password" (deep grey #1F2937)  
  - Input: Password type with show/hide toggle
  - Requirements text: "6-128 characters, must include uppercase, lowercase, and number"
- **Submit Button**: "Create Account" - full width, black background
- **Login Link**: "Already have an account? Sign in" (deep grey with black link)

#### User Actions
- Enter email address (5-100 characters)
- Enter password (6-128 characters with complexity requirements)
- Toggle password visibility
- Submit form
- Navigate to login page

#### API Integration
**Endpoint**: `POST /api/v1/signup`

**Request Payload**:
```json
{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

**Success Response (201)**:
```json
{
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "user_id",
      "email": "user@example.com", 
      "createdAt": "2023-01-01T00:00:00.000Z"
    },
    "token": "jwt_token_here"
  }
}
```

**Error Handling**:
- **400 Email validation**: Show red error text below email field
- **400 Password validation**: Show red error text below password field with specific requirements
- **409 User exists**: Show error banner "Account with this email already exists"

#### Responsive Behavior
- **Mobile**: Single column, full-width form, larger touch targets
- **Tablet**: Centered form with fixed width (400px)
- **Desktop**: Centered form with fixed width (400px), side margins

### 2. Login Page (`/login`)

#### Visual Design  
- **Background**: White (#FFFFFF)
- **Container**: Centered card matching signup design
- **Form**: Minimal design with black/grey color scheme

#### Content & Layout
- **Header**: "Sign In" in large black text
- **Email Field**: Same styling as signup
- **Password Field**: Same styling as signup (no complexity requirements shown)
- **Submit Button**: "Sign In" - full width, black background
- **Signup Link**: "Don't have an account? Create one" (deep grey with black link)

#### User Actions
- Enter email address
- Enter password
- Submit login form
- Navigate to signup page
- Access "Forgot password" (future feature)

#### API Integration
**Endpoint**: `POST /api/v1/login`

**Request Payload**:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Success Response (200)**:
```json
{
  "message": "Login successful",
  "data": {
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "createdAt": "2023-01-01T00:00:00.000Z"
    },
    "token": "jwt_token_here"
  }
}
```

**Error Handling**:
- **400 Validation**: Show field-specific red error text
- **401 Invalid credentials**: Show error banner "Invalid email or password"

#### Responsive Behavior
- **Mobile**: Full-width form with larger buttons
- **Tablet/Desktop**: Centered 400px width form

### 3. Dashboard Page (`/dashboard`)

#### Visual Design
- **Background**: White (#FFFFFF)
- **Header**: Black text on white background with deep grey navigation
- **Cards**: White background with light grey borders (#F3F4F6)
- **Icons**: Black (#000000) with hover states

#### Content & Layout
- **Top Navigation**: 
  - Logo/title (black text)
  - User email (deep grey)
  - Logout button (deep grey, hover black)
- **Welcome Section**: 
  - "Welcome back, [email]" (black header)
  - "Member since [date]" (deep grey subtext)
- **Statistics Cards** (3-column grid):
  - **Total Buckets**: Large number (black), label (deep grey)
  - **Total Files**: Large number (black), label (deep grey) 
  - **API Calls**: Large number (black), label (deep grey)
- **Recent Buckets Section**:
  - Header: "Recent Buckets" (black)
  - Cards showing: name, file count, size, last updated
  - "View all buckets" link (black)

#### User Actions
- View account statistics
- Click on recent buckets to navigate to bucket details
- Navigate to all buckets page
- Access user settings (future)
- Logout

#### API Integration
**Endpoint**: `GET /api/v1/app/dashboard`

**Request Headers**:
```
Authorization: Bearer <jwt_token>
```

**Success Response (200)**:
```json
{
  "message": "Dashboard data retrieved successfully",
  "data": {
    "user": { 
      "id": "user_id",
      "email": "user@example.com",
      "memberSince": "2023-01-01T00:00:00.000Z"
    },
    "stats": {
      "totalBuckets": 3,
      "totalFiles": 15,
      "totalApiCalls": 100
    },
    "recentBuckets": [
      {
        "id": "bucket_id",
        "name": "bucket_name",
        "fileCount": 5,
        "totalSize": 1024000,
        "lastUpdated": "2023-01-01T00:00:00.000Z"
      }
    ]
  }
}
```

**Error Handling**:
- **401 Unauthorized**: Redirect to login page
- **500 Server Error**: Show error banner "Unable to load dashboard"

#### Responsive Behavior
- **Mobile**: Single column, stacked statistics cards, simplified recent buckets list
- **Tablet**: 2-column statistics, condensed recent buckets
- **Desktop**: 3-column statistics, full recent buckets table

### 4. Buckets List Page (`/buckets`)

#### Visual Design
- **Background**: White (#FFFFFF)
- **Header**: Black title with deep grey breadcrumbs
- **Cards**: White cards with light grey borders, hover effect (light grey background)
- **Actions**: Black primary button, deep grey secondary buttons

#### Content & Layout
- **Page Header**:
  - Title: "My Buckets" (black, large)
  - Create bucket button: Black background, white text, rounded corners
- **Bucket Grid** (responsive grid):
  - **Bucket Card** (for each bucket):
    - Bucket name (black, medium font)
    - File count and total size (deep grey, small font)
    - Created date (light grey, small font)
    - Actions: View button (deep grey), settings icon (deep grey)
- **Empty State**: 
  - "No buckets yet" message (deep grey)
  - Create first bucket button (black)

#### User Actions
- View all buckets in grid/list format
- Click on bucket cards to navigate to bucket details
- Create new bucket
- Search/filter buckets (future)
- Sort buckets by name, date, size

#### API Integration
**Endpoint**: `GET /api/v1/buckets`

**Request Headers**:
```
Authorization: Bearer <jwt_token>
```

**Success Response (200)**:
```json
{
  "message": "Buckets retrieved successfully",
  "data": {
    "buckets": [
      {
        "id": "bucket_id",
        "name": "bucket_name",
        "fileCount": 5,
        "totalSize": 1024000,
        "createdAt": "2023-01-01T00:00:00.000Z"
      }
    ],
    "count": 1
  }
}
```

**Error Handling**:
- **401 Unauthorized**: Redirect to login
- **500 Server Error**: Show error banner with retry option

#### Responsive Behavior
- **Mobile**: Single column, card-based layout
- **Tablet**: 2-column grid
- **Desktop**: 3-4 column grid with more details per card

### 5. Create Bucket Page (`/buckets/create`)

#### Visual Design
- **Background**: White (#FFFFFF)
- **Form Container**: Centered white card with light grey border
- **Input**: White background, black border, focus blue outline
- **Button**: Black background, white text

#### Content & Layout
- **Page Header**: "Create New Bucket" (black, large)
- **Form Section**:
  - **Bucket Name Field**:
    - Label: "Bucket Name" (deep grey)
    - Input: Placeholder "Enter bucket name"
    - Helper text: "3-50 characters, letters, numbers, hyphens, underscores, spaces allowed" (light grey)
  - **Submit Button**: "Create Bucket" (black background, white text)
  - **Cancel Button**: "Cancel" (deep grey background, white text)

#### User Actions  
- Enter bucket name with real-time validation
- Submit form to create bucket
- Cancel and return to buckets list
- View validation errors

#### API Integration
**Endpoint**: `POST /api/v1/buckets/create`

**Request Headers**:
```
Authorization: Bearer <jwt_token>
```

**Request Payload**:
```json
{
  "name": "My New Bucket"
}
```

**Success Response (201)**:
```json
{
  "message": "Bucket created successfully",
  "data": {
    "bucket": {
      "id": "bucket_id",
      "name": "My New Bucket",
      "publicKey": "public_key_here",
      "privateKey": "private_key_here",
      "createdAt": "2023-01-01T00:00:00.000Z"
    }
  }
}
```

**Success Flow**: 
- Show success message with green background
- Display public/private keys in copyable format
- Redirect to bucket details page after 3 seconds

**Error Handling**:
- **400 Name validation**: Show red error text below input field
- **401 Unauthorized**: Redirect to login

#### Responsive Behavior
- **Mobile**: Full-width form with larger touch targets
- **Tablet/Desktop**: Fixed-width centered form (500px)

### 6. Bucket Details Page (`/buckets/:bucketId`)

#### Visual Design
- **Background**: White (#FFFFFF)
- **Header Section**: White background with black text and deep grey metadata
- **Files Table**: Alternating white/light grey row backgrounds
- **Action Buttons**: Black primary, deep grey secondary

#### Content & Layout
- **Bucket Header**:
  - Bucket name (black, large font)
  - Created date and owner (deep grey, small font)
  - File count and total size (deep grey)
  - Public key display with copy button
- **Actions Bar**:
  - Upload file button (black background, white text)
  - Bucket settings button (deep grey)
- **Files Table**:
  - **Columns**: Name, Type, Size, Downloads, Upload Date, Actions
  - **Row Design**: Hover effect (light grey background)
  - **Actions**: Download icon, details icon (deep grey, hover black)
- **Empty State**: "No files in this bucket" with upload prompt

#### User Actions
- View bucket information and statistics
- Copy public key to clipboard
- Upload new files
- View file details
- Download files
- Navigate back to buckets list
- Access bucket settings

#### API Integration
**Primary Endpoints**:

1. **Get Bucket Info**: `GET /api/v1/buckets/:bucketId`
```json
{
  "message": "Bucket retrieved successfully",
  "data": {
    "bucket": {
      "id": "bucket_id",
      "name": "bucket_name", 
      "ownerId": "user_id",
      "fileCount": 5,
      "totalSize": 1024000,
      "createdAt": "2023-01-01T00:00:00.000Z"
    }
  }
}
```

2. **List Files**: `GET /api/v1/buckets/:bucketId/files`
```json
{
  "message": "Files retrieved successfully",
  "data": {
    "files": [
      {
        "id": "file_id",
        "name": "filename.png",
        "originalName": "original.png", 
        "type": "image/png",
        "size": 1024,
        "downloads": 0,
        "createdAt": "2023-01-01T00:00:00.000Z"
      }
    ],
    "count": 1,
    "bucketId": "bucket_id"
  }
}
```

**Error Handling**:
- **400 Invalid ID**: Show error banner "Invalid bucket ID"
- **404 Not found**: Show "Bucket not found" page with back button
- **401 Unauthorized**: Redirect to login

#### Responsive Behavior
- **Mobile**: Card-based file list, collapsible bucket info, floating upload button
- **Tablet**: Condensed table view, side-by-side bucket info
- **Desktop**: Full table with all columns, detailed bucket header

### 7. File Upload Page/Modal (`/buckets/:bucketId/upload`)

#### Visual Design
- **Modal/Page**: White background with dark overlay (if modal)
- **Drop Zone**: Dashed border (deep grey), light grey background on hover
- **Progress Bar**: Black fill on light grey background
- **Buttons**: Black primary, deep grey secondary

#### Content & Layout
- **Header**: "Upload File" (black text)
- **Drop Zone**:
  - Large area with dashed border
  - "Drag and drop files here or click to browse" (deep grey text)
  - File type and size restrictions (light grey, small text)
- **File Details Section** (appears after file selection):
  - Selected file name (black)
  - File size and type (deep grey)
  - Custom filename input (optional)
  - Metadata input (JSON, optional)
- **Progress Section** (during upload):
  - Progress bar with percentage
  - Upload speed and time remaining
- **Action Buttons**:
  - Upload button (black, disabled until file selected)
  - Cancel button (deep grey)

#### User Actions
- Drag and drop files or click to browse
- Select files from file system
- Enter custom filename (optional)
- Add metadata (optional JSON)
- Monitor upload progress
- Cancel upload
- View upload results

#### API Integration
**Primary Method**: `POST /api/v1/buckets/:bucketId/upload`

**Request Headers**:
```
Authorization: Bearer <jwt_token>
```

**Request Payload**:
```json
{
  "name": "filename.png",
  "originalName": "original.png",
  "type": "image/png", 
  "size": 1024,
  "metadata": {}
}
```

**Success Response (201)**:
```json
{
  "message": "File uploaded successfully",
  "data": {
    "file": {
      "id": "file_id",
      "name": "filename.png",
      "originalName": "original.png",
      "type": "image/png",
      "size": 1024,
      "bucketId": "bucket_id",
      "createdAt": "2023-01-01T00:00:00.000Z"
    }
  }
}
```

**Alternative Method**: `POST /api/v1/public/file/upload-uri` (for presigned uploads)

**Error Handling**:
- **400 File validation**: Show red error for invalid file types/sizes
- **400 Name validation**: Show red error for invalid filenames
- **404 Bucket not found**: Show error "Bucket not accessible"
- **500 Upload failure**: Show retry option with error message

#### Responsive Behavior
- **Mobile**: Full-screen modal, larger drop zone, simplified metadata input
- **Tablet**: Modal with medium size, touch-friendly controls  
- **Desktop**: Standard modal size, full feature set

### 8. File Details Page (`/buckets/:bucketId/files/:fileId`)

#### Visual Design
- **Background**: White (#FFFFFF)
- **Info Cards**: White cards with light grey borders
- **Preview Area**: Light grey background for file previews
- **Action Buttons**: Black primary, deep grey secondary

#### Content & Layout
- **Breadcrumb Navigation**: 
  - "Buckets > [Bucket Name] > [File Name]" (deep grey with black links)
- **File Info Section**:
  - File name (black, large)
  - Original filename (deep grey, medium)
  - File type badge (deep grey background, white text)
  - Size and upload date (deep grey)
  - Download count (deep grey)
- **File Preview** (if supported):
  - Image preview for images
  - Document icon for other types
- **Metadata Section**:
  - JSON display of custom metadata (if any)
- **Actions Section**:
  - Download button (black background, white text)
  - Share button (deep grey)
  - Delete button (red background, white text)

#### User Actions
- View file information and metadata
- Download file
- Copy public share link
- View file preview (images)
- Delete file (with confirmation)
- Navigate back to bucket

#### API Integration
**Primary Endpoint**: `GET /api/v1/buckets/:bucketId/files/:fileId`

**Request Headers**:
```
Authorization: Bearer <jwt_token>
```

**Success Response (200)**:
```json
{
  "message": "File retrieved successfully",
  "data": {
    "file": {
      "id": "file_id",
      "name": "filename.png",
      "originalName": "original.png",
      "type": "image/png", 
      "size": 1024,
      "downloads": 0,
      "metadata": {},
      "bucketId": "bucket_id",
      "createdAt": "2023-01-01T00:00:00.000Z"
    }
  }
}
```

**Download URL Generation**: `GET /api/v1/public/file/download-uri/:fileId`
```json
{
  "message": "Download URL generated successfully",
  "data": {
    "uri": "https://presigned-url...",
    "download": {
      "url": "https://presigned-url...",
      "expiresIn": 3600,
      "method": "GET"
    }
  }
}
```

**Error Handling**:
- **400 Invalid ID**: Show "Invalid file ID" error page
- **404 File not found**: Show "File not found" with back button
- **401 Unauthorized**: Redirect to login

#### Responsive Behavior
- **Mobile**: Stacked layout, full-width preview, simplified metadata
- **Tablet**: Side-by-side info and preview
- **Desktop**: Three-column layout with full details

### 9. Public File Access (`/file/:fileId`)

#### Visual Design
- **Background**: White (#FFFFFF)
- **Minimal Layout**: Clean, distraction-free design
- **Download Button**: Large, prominent black button

#### Content & Layout
- **File Preview**: Large preview area (light grey background)
- **File Information**:
  - Filename (black, large)
  - File type and size (deep grey)
  - Download count (deep grey)
- **Download Section**:
  - Large download button (black background, white text)
  - File size reminder below button

#### User Actions
- View file information
- Download file directly
- No authentication required

#### API Integration
**File Info**: `GET /api/v1/public/file/info?fileId=:fileId`

**Success Response (200)**:
```json
{
  "message": "File info retrieved successfully", 
  "data": {
    "file": {
      "id": "file_id",
      "name": "filename.png",
      "originalName": "original.png",
      "type": "image/png",
      "size": 1024,
      "downloads": 5,
      "createdAt": "2023-01-01T00:00:00.000Z"
    }
  }
}
```

**Direct Download**: `GET /api/v1/public/file/download/:fileId`
- Returns binary file stream
- Headers: Content-Type, Content-Disposition, Content-Length, Cache-Control

**Error Handling**:
- **400 Invalid ID**: Show "Invalid file link" 
- **404 File not found**: Show "File not found or no longer available"

#### Responsive Behavior
- **Mobile**: Full-width layout, large download button
- **Tablet/Desktop**: Centered layout with optimal preview size

## Technical Implementation Notes

### State Management
- JWT tokens stored in secure HTTP-only cookies
- Client-side state for form validation
- Loading states for all API calls
- Error state management with user-friendly messages

### Performance
- Lazy loading for file lists
- Image optimization for previews  
- Caching for frequently accessed data
- Progressive enhancement for file uploads

### Accessibility
- ARIA labels for all interactive elements
- Keyboard navigation support
- Screen reader compatibility
- Color contrast compliance (WCAG 2.1 AA)

### Error Handling Patterns
- **Network Errors**: Retry buttons with exponential backoff
- **Validation Errors**: Inline field-level error messages
- **Authentication Errors**: Automatic redirect to login
- **Permission Errors**: Clear messaging with suggested actions

## Success Metrics
- User registration conversion rate
- File upload success rate (target: >95%)
- Page load times (target: <2 seconds)
- User session duration
- API error rates (target: <5%)