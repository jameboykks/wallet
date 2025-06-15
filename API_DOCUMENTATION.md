# API Documentation - Wallet Application

## Table of Contents
1. [Authentication APIs](#authentication-apis)
2. [User APIs](#user-apis)
3. [Transaction APIs](#transaction-apis)
4. [Notification APIs](#notification-apis)
5. [Admin APIs](#admin-apis)

## Authentication APIs

### Register
```http
POST /api/auth/register
```

**Request Body:**
```json
{
    "email": "user@example.com",
    "password": "your_password",
    "fullName": "Nguyen Van A"
}
```

**Response:**
```json
{
    "success": true,
    "message": "Registration successful",
    "data": {
        "id": "user_id",
        "email": "user@example.com",
        "fullName": "Nguyen Van A",
        "token": "jwt_token"
    }
}
```

### Login
```http
POST /api/auth/login
```

**Request Body:**
```json
{
    "email": "user@example.com",
    "password": "your_password"
}
```

**Response:**
```json
{
    "success": true,
    "message": "Login successful",
    "data": {
        "id": "user_id",
        "email": "user@example.com",
        "fullName": "Nguyen Van A",
        "token": "jwt_token"
    }
}
```

## User APIs

### Get Profile
```http
GET /api/users/profile
```

**Headers:**
```
Authorization: Bearer your_jwt_token
```

**Response:**
```json
{
    "success": true,
    "data": {
        "id": "user_id",
        "email": "user@example.com",
        "fullName": "Nguyen Van A",
        "phone": "0123456789",
        "address": "123 Street, City",
        "avatar": "avatar_url"
    }
}
```

### Update Profile
```http
PUT /api/users/profile
```

**Headers:**
```
Authorization: Bearer your_jwt_token
```

**Request Body:**
```json
{
    "fullName": "New Name",
    "phone": "0987654321",
    "address": "New Address"
}
```

**Response:**
```json
{
    "success": true,
    "message": "Profile updated successfully",
    "data": {
        "id": "user_id",
        "email": "user@example.com",
        "fullName": "New Name",
        "phone": "0987654321",
        "address": "New Address"
    }
}
```

### Change Password
```http
POST /api/users/change-password
```

**Headers:**
```
Authorization: Bearer your_jwt_token
```

**Request Body:**
```json
{
    "oldPassword": "current_password",
    "newPassword": "new_password"
}
```

**Response:**
```json
{
    "success": true,
    "message": "Password changed successfully"
}
```

### Get Balance
```http
GET /api/users/balance
```

**Headers:**
```
Authorization: Bearer your_jwt_token
```

**Response:**
```json
{
    "success": true,
    "data": {
        "balance": 1000000,
        "currency": "VND"
    }
}
```

### Get Contacts
```http
GET /api/users/contacts
```

**Headers:**
```
Authorization: Bearer your_jwt_token
```

**Response:**
```json
{
    "success": true,
    "data": [
        {
            "id": "contact_id",
            "userId": "user_id",
            "name": "Contact Name",
            "email": "contact@example.com"
        }
    ]
}
```

### Add Contact
```http
POST /api/users/contacts
```

**Headers:**
```
Authorization: Bearer your_jwt_token
```

**Request Body:**
```json
{
    "userId": "user_id_to_add",
    "name": "Contact Name"
}
```

**Response:**
```json
{
    "success": true,
    "message": "Contact added successfully",
    "data": {
        "id": "contact_id",
        "userId": "user_id",
        "name": "Contact Name"
    }
}
```

### Remove Contact
```http
DELETE /api/users/contacts
```

**Headers:**
```
Authorization: Bearer your_jwt_token
```

**Request Body:**
```json
{
    "contactId": "contact_id_to_remove"
}
```

**Response:**
```json
{
    "success": true,
    "message": "Contact removed successfully"
}
```

### Upload Avatar
```http
POST /api/users/avatar
```

**Headers:**
```
Authorization: Bearer your_jwt_token
Content-Type: multipart/form-data
```

**Request Body:**
```
FormData:
- avatar: file
```

**Response:**
```json
{
    "success": true,
    "data": {
        "url": "/uploads/avatar_filename.jpg"
    }
}
```

## Transaction APIs

### Deposit
```http
POST /api/transactions/deposit
```

**Headers:**
```
Authorization: Bearer your_jwt_token
```

**Request Body:**
```json
{
    "amount": 1000000
}
```

**Response:**
```json
{
    "success": true,
    "message": "Deposit successful",
    "data": {
        "transactionId": "transaction_id",
        "amount": 1000000,
        "type": "deposit",
        "status": "completed",
        "createdAt": "2024-03-20T10:00:00Z"
    }
}
```

### Transfer
```http
POST /api/transactions/transfer
```

**Headers:**
```
Authorization: Bearer your_jwt_token
```

**Request Body:**
```json
{
    "recipientId": "recipient_user_id",
    "amount": 500000,
    "note": "Transfer note"
}
```

**Response:**
```json
{
    "success": true,
    "message": "Transfer successful",
    "data": {
        "transactionId": "transaction_id",
        "amount": 500000,
        "type": "transfer",
        "status": "completed",
        "recipientId": "recipient_user_id",
        "note": "Transfer note",
        "createdAt": "2024-03-20T10:00:00Z"
    }
}
```

### Transaction History
```http
GET /api/transactions/history
```

**Headers:**
```
Authorization: Bearer your_jwt_token
```

**Query Parameters:**
```
?page=1&limit=10
```

**Response:**
```json
{
    "success": true,
    "data": {
        "transactions": [
            {
                "id": "transaction_id",
                "type": "transfer",
                "amount": 500000,
                "status": "completed",
                "createdAt": "2024-03-20T10:00:00Z"
            }
        ],
        "pagination": {
            "page": 1,
            "limit": 10,
            "total": 100
        }
    }
}
```

### Search Transactions
```http
GET /api/transactions/search
```

**Headers:**
```
Authorization: Bearer your_jwt_token
```

**Query Parameters:**
```
?keyword=search_term&startDate=2024-03-01&endDate=2024-03-20
```

**Response:**
```json
{
    "success": true,
    "data": {
        "transactions": [
            {
                "id": "transaction_id",
                "type": "transfer",
                "amount": 500000,
                "status": "completed",
                "createdAt": "2024-03-20T10:00:00Z"
            }
        ]
    }
}
```

## Notification APIs

### Get Notifications
```http
GET /api/notifications
```

**Headers:**
```
Authorization: Bearer your_jwt_token
```

**Query Parameters:**
```
?page=1&limit=10
```

**Response:**
```json
{
    "success": true,
    "data": {
        "notifications": [
            {
                "id": "notification_id",
                "type": "transaction",
                "message": "You received 500,000 VND from User A",
                "read": false,
                "createdAt": "2024-03-20T10:00:00Z"
            }
        ],
        "pagination": {
            "page": 1,
            "limit": 10,
            "total": 50
        }
    }
}
```

## Admin APIs

### Get All Users
```http
GET /api/admin/users
```

**Headers:**
```
Authorization: Bearer your_jwt_token
```

**Query Parameters:**
```
?page=1&limit=10&search=search_term
```

**Response:**
```json
{
    "success": true,
    "data": {
        "users": [
            {
                "id": "user_id",
                "email": "user@example.com",
                "fullName": "User Name",
                "status": "active",
                "createdAt": "2024-03-20T10:00:00Z"
            }
        ],
        "pagination": {
            "page": 1,
            "limit": 10,
            "total": 100
        }
    }
}
```

### Lock User
```http
PATCH /api/admin/users/:id/lock
```

**Headers:**
```
Authorization: Bearer your_jwt_token
```

**Response:**
```json
{
    "success": true,
    "message": "User locked successfully"
}
```

### Unlock User
```http
PATCH /api/admin/users/:id/unlock
```

**Headers:**
```
Authorization: Bearer your_jwt_token
```

**Response:**
```json
{
    "success": true,
    "message": "User unlocked successfully"
}
```

### Get All Transactions
```http
GET /api/admin/transactions
```

**Headers:**
```
Authorization: Bearer your_jwt_token
```

**Query Parameters:**
```
?page=1&limit=10&startDate=2024-03-01&endDate=2024-03-20
```

**Response:**
```json
{
    "success": true,
    "data": {
        "transactions": [
            {
                "id": "transaction_id",
                "userId": "user_id",
                "type": "transfer",
                "amount": 500000,
                "status": "completed",
                "createdAt": "2024-03-20T10:00:00Z"
            }
        ],
        "pagination": {
            "page": 1,
            "limit": 10,
            "total": 1000
        }
    }
}
```

### Get All Notifications
```http
GET /api/admin/notifications
```

**Headers:**
```
Authorization: Bearer your_jwt_token
```

**Query Parameters:**
```
?page=1&limit=10
```

**Response:**
```json
{
    "success": true,
    "data": {
        "notifications": [
            {
                "id": "notification_id",
                "userId": "user_id",
                "type": "transaction",
                "message": "Transaction message",
                "read": false,
                "createdAt": "2024-03-20T10:00:00Z"
            }
        ],
        "pagination": {
            "page": 1,
            "limit": 10,
            "total": 500
        }
    }
}
```

### Get Stats
```http
GET /api/admin/stats
```

**Headers:**
```
Authorization: Bearer your_jwt_token
```

**Response:**
```json
{
    "success": true,
    "data": {
        "totalUsers": 1000,
        "activeUsers": 800,
        "totalTransactions": 5000,
        "totalVolume": 1000000000,
        "todayTransactions": 100,
        "todayVolume": 20000000
    }
}
```

## Error Responses

Tất cả các API đều có thể trả về các lỗi sau:

### 400 Bad Request
```json
{
    "success": false,
    "message": "Invalid input data",
    "errors": [
        {
            "field": "email",
            "message": "Invalid email format"
        }
    ]
}
```

### 401 Unauthorized
```json
{
    "success": false,
    "message": "Unauthorized access"
}
```

### 403 Forbidden
```json
{
    "success": false,
    "message": "Access denied"
}
```

### 404 Not Found
```json
{
    "success": false,
    "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
    "success": false,
    "message": "Internal server error"
}
```

## Lưu ý quan trọng

1. Tất cả các API (trừ register và login) đều yêu cầu xác thực qua JWT token trong header
2. Token JWT có thời hạn 24 giờ
3. Các API admin yêu cầu role admin
4. Giới hạn rate: 100 requests/phút cho mỗi IP
5. Tất cả các số tiền đều được tính bằng VND
6. Kích thước file upload tối đa: 5MB
7. Các file upload chỉ chấp nhận định dạng: jpg, jpeg, png 