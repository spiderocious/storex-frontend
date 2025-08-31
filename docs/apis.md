# File Service API Documentation

Base URL: `/api/v1`

## Authentication

### Public Routes
- **No Authentication**: Some endpoints are completely public
- **Public Key Authentication**: Some endpoints require a public key via header `X-Public-Key` or query parameter `publicKey`

### App Routes  
- **Bearer Token**: User authentication via `Authorization: Bearer <token>` header

---

## Public Endpoints (No Authentication)

### 1. Get Download URL
**GET** `/public/file/download-uri/:fileId`

**Parameters:**
- `fileId` (path): MongoDB ObjectId of the file

**Response (200):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Download URL generated successfully",
  "data": {
    "uri": "https://daytrackist.6e8e80df409827e2b6b3ce1c876cf1b6.r2.cloudflarestorage.com/STOREXXXFILEXXSTOREX52E51756105864182938299073771756105864182?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=39862b515f0d502f2ab2ce3375112ecb%2F20250831%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=20250831T005645Z&X-Amz-Expires=520000&X-Amz-Signature=aa463c6aa930f496a26c9d03aca755626f92cb411c246406525d22a708788252&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject",
    "type": "jpg",
    "file": {
      "id": "STOREXXXFILEXXSTOREX52E51756105864182938299073771756105864182",
      "name": "1756105864179_me.jpg",
      "originalName": "me.jpg",
      "type": "jpg",
      "size": 2638793,
      "downloads": 8
    },
    "download": {
      "url": "https://daytrackist.6e8e80df409827e2b6b3ce1c876cf1b6.r2.cloudflarestorage.com/STOREXXXFILEXXSTOREX52E51756105864182938299073771756105864182?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=39862b515f0d502f2ab2ce3375112ecb%2F20250831%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=20250831T005645Z&X-Amz-Expires=520000&X-Amz-Signature=aa463c6aa930f496a26c9d03aca755626f92cb411c246406525d22a708788252&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject",
      "expiresIn": 3600,
      "method": "GET",
      "cached": true
    }
  },
  "timestamp": "2025-08-31T01:02:07.433Z"
}
```

**Error Responses:**
- `400`: Invalid file ID format
- `404`: File not found

### 2. Download File
**GET** `/public/file/download/:fileId`

**Parameters:**
- `fileId` (path): MongoDB ObjectId of the file

**Response (200):** 
Binary file stream with headers:
- `Content-Type`: File MIME type
- `Content-Disposition`: attachment; filename="original_name"
- `Content-Length`: File size in bytes
- `Cache-Control`: private, max-age=3600

**Error Responses:**
- `400`: Invalid file ID format
- `404`: File not found
- `404`: File not found in storage
- `500`: Error streaming file

### 3. Get File Info
**GET** `/public/file/info`

**Parameters:**
- `fileId` (query): MongoDB ObjectId of the file (required)

**Response (200):**
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
      "metadata": {},
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z"
    },
    "r2": {
      "key": "file_id",
      "exists": true
    }
  }
}
```

**Error Responses:**
- `400`: fileId query parameter is required
- `400`: Invalid file ID format
- `404`: File not found

---

## Public Endpoints (Require Public Key)

### 4. Get Upload URL
**POST** `/public/file/upload-uri`

**Headers:**
- `X-Public-Key`: Your bucket's public key

**Request Body:**
```json
{
  "fileName": "example.png", // optional, 1-255 chars, alphanumeric + ._-
  "fileType": "image/png", // required, valid MIME type
  "fileSize": 1024, // required, number, max 100MB (104857600 bytes)
  "originalName": "original.png", // optional, 1-255 chars
  "metadata": {} // optional object
}
```

**Response (200):**
```json
{
  "message": "Upload URI generated successfully",
  "data": {
    "file": {
      "id": "generated_file_id",
      "name": "final_filename.png",
      "originalName": "original.png",
      "type": "image/png",
      "size": 1024
    },
    "bucket": {
      "id": "bucket_id",
      "name": "bucket_name"
    },
    "upload": {
      "url": "https://presigned-upload-url...",
      "key": "file_id",
      "expiresIn": 3600,
      "method": "PUT",
      "headers": {
        "Content-Type": "image/png"
      }
    }
  }
}
```

**Error Responses:**
- `400`: fileType and fileSize are required
- `400`: File name validation errors
- `400`: File size exceeds 100MB limit
- `401`: Invalid or missing public key
- `404`: Bucket not found

### 5. Upload File
**POST** `/public/file/upload`

**Headers:**
- `X-Public-Key`: Your bucket's public key
- `Content-Type`: multipart/form-data

**Request Body (Form Data):**
- `file`: File (required, max 100MB)
- `fileName`: string (optional, 1-255 chars, alphanumeric + ._-)
- `metadata`: JSON string (optional)

**Response (201):**
```json
{
  "message": "File uploaded successfully",
  "data": {
    "downloadUrl": "https://presigned-download-url...",
    "file": {
      "id": "file_id",
      "name": "filename.png",
      "originalName": "original.png",
      "type": "image/png",
      "size": 1024,
      "bucketId": "bucket_id",
      "createdAt": "2023-01-01T00:00:00.000Z"
    },
    "bucket": {
      "id": "bucket_id",
      "name": "bucket_name"
    },
    "upload": {
      "success": true
    }
  }
}
```

**Error Responses:**
- `400`: No file uploaded
- `400`: File with this name already exists in bucket
- `400`: Invalid metadata JSON
- `401`: Invalid or missing public key
- `500`: Failed to upload file to R2

---

## App Endpoints (Require User Authentication)

### 6. User Login
**POST** `/login`

**Request Body:**
```json
{
  "email": "user@example.com", // required, valid email, 5-100 chars
  "password": "password123" // required, 1-128 chars
}
```

**Response (200):**
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

**Error Responses:**
- `400`: Email validation errors
- `400`: Password validation errors
- `401`: Invalid credentials

### 6.5. User Signup
**POST** `/signup`

**Request Body:**
```json
{
  "email": "user@example.com", // required, valid email, 5-100 chars
  "password": "SecurePass123" // required, 6-128 chars, must contain uppercase, lowercase, and number
}
```

**Response (201):**
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

**Error Responses:**
- `400`: Email validation errors
- `400`: Password must contain at least one uppercase letter, one lowercase letter, and one number
- `400`: Password must be between 6 and 128 characters
- `409`: User already exists


### 7. List Buckets
**GET** `/buckets`

**Headers:**
- `Authorization`: Bearer <token>

**Response (200):**
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

**Error Responses:**
- `401`: User not authenticated

### 8. Get Bucket
**GET** `/buckets/:bucketId`

**Headers:**
- `Authorization`: Bearer <token>

**Parameters:**
- `bucketId` (path): MongoDB ObjectId of the bucket

**Response (200):**
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

**Error Responses:**
- `400`: Invalid bucket ID format
- `401`: User not authenticated
- `404`: Bucket not found or access denied

### 9. List Bucket Files
**GET** `/buckets/:bucketId/files`

**Headers:**
- `Authorization`: Bearer <token>

**Parameters:**
- `bucketId` (path): MongoDB ObjectId of the bucket

**Response (200):**
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

**Error Responses:**
- `400`: Invalid bucket ID format
- `401`: User not authenticated
- `404`: Bucket not found or access denied

### 10. Get File
**GET** `/buckets/:bucketId/files/:fileId`

**Headers:**
- `Authorization`: Bearer <token>

**Parameters:**
- `bucketId` (path): MongoDB ObjectId of the bucket
- `fileId` (path): MongoDB ObjectId of the file

**Response (200):**
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

**Error Responses:**
- `400`: Invalid bucket or file ID format
- `401`: User not authenticated
- `404`: Bucket not found or access denied
- `404`: File not found in this bucket

### 11. Create Bucket
**POST** `/buckets/create`

**Headers:**
- `Authorization`: Bearer <token>

**Request Body:**
```json
{
  "name": "My New Bucket" // required, 3-50 chars, alphanumeric + -_space
}
```

**Response (201):**
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

**Error Responses:**
- `400`: Bucket name validation errors
- `401`: User not authenticated

### 12. Upload File to Bucket
**POST** `/buckets/:bucketId/upload`

**Headers:**
- `Authorization`: Bearer <token>

**Parameters:**
- `bucketId` (path): MongoDB ObjectId of the bucket

**Request Body:**
```json
{
  "name": "filename.png", // required, 1-255 chars
  "originalName": "original.png", // required, 1-255 chars
  "type": "image/png", // required, valid MIME type
  "size": 1024, // required, number, max 100MB
  "metadata": {} // optional object
}
```

**Response (201):**
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

**Error Responses:**
- `400`: Invalid bucket ID format
- `400`: File validation errors
- `401`: User not authenticated
- `404`: Bucket not found or access denied

### 13. Get Dashboard
**GET** `/app/dashboard`

**Headers:**
- `Authorization`: Bearer <token>

**Response (200):**
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

**Error Responses:**
- `401`: User not authenticated

---

## Common Error Response Format

All error responses follow this structure:
```json
{
  "error": "Error message description",
  "status": 400
}
```

Common HTTP Status Codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request (validation errors)
- `401`: Unauthorized (authentication failed)
- `404`: Not Found
- `500`: Internal Server Error

## Rate Limits
- File size limit: 100MB (104,857,600 bytes)
- Upload URL expires: 1 hour (3600 seconds)
- Download URL expires: 144.4 hours (520,000 seconds)
- Download URL cache: 1 hour

## File Naming Rules
- File names: 1-255 characters, alphanumeric + dots, hyphens, underscores only
- Bucket names: 3-50 characters, alphanumeric + hyphens, underscores, spaces