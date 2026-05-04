#  Postman API Testing Guide

##  Cài đặt Postman

1. **Download Postman**: https://www.postman.com/downloads/
2. **Cài đặt** và **mở ứng dụng**
3. **Tạo account** hoặc **Skip** để bắt đầu

---

##  Cấu hình Environment

### **Bước 1: Tạo Environment**
1. Click **Environments** (trái sidebar)
2. Click **Create Environment**
3. Đặt tên: `TikTok Backend Local`
4. Thêm variables:

```
Variable Name          Type    Initial Value           Current Value
base_url              string  http://localhost:5000    http://localhost:5000
token                 string  (để trống)              (để trống)
user_id               string  (để trống)              (để trống)
video_id              string  (để trống)              (để trống)
```

5. Click **Save**

### **Bước 2: Chọn Environment**
- Top-right, dropdown chọn `TikTok Backend Local`

---

##  Test APIs

### **Base URL:** `{{base_url}}/api`

---

##  USER API

### **A. Register (Đăng ký)**

**Method:** `POST`  
**URL:** `{{base_url}}/api/users/register`

**Headers:**
```
Content-Type: application/json
```

**Body** (JSON):
```json
{
  "username": "testuser123",
  "email": "testuser@gmail.com",
  "password": "123456"
}
```

**Steps:**
1. Mở Postman
2. New → Request
3. Chọn **POST** method
4. Paste URL
5. Vào **Body** tab → chọn **raw** → **JSON**
6. Copy JSON body phía trên
7. Click **Send**

**Expected Response (201):**
```json
{
  "userId": "64a1b2c3d4e5f6g7h8i9j0k1"
}
```

**Save userId vào Environment:**
- Click response → ở dưới, Click **Tests** tab
- Paste code:
```javascript
var jsonData = pm.response.json();
pm.environment.set("user_id", jsonData.userId);
```
- Click **Send** lại

---

### **B. Login (Đăng nhập)**

**Method:** `POST`  
**URL:** `{{base_url}}/api/users/login`

**Headers:**
```
Content-Type: application/json
```

**Body** (JSON):
```json
{
  "email": "testuser@gmail.com",
  "password": "123456"
}
```

**Expected Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "64a1b2c3d4e5f6g7h8i9j0k1",
    "username": "testuser123",
    "email": "testuser@gmail.com"
  }
}
```

**Save token vào Environment:**
- Click **Tests** tab
- Paste code:
```javascript
var jsonData = pm.response.json();
pm.environment.set("token", jsonData.token);
```
- Click **Send** lại

---

### **C. Get Profile (Lấy Thông Tin Profile)**

**Method:** `GET`  
**URL:** `{{base_url}}/api/users/profile`

**Headers:**
```
Authorization: Bearer {{token}}
```

**Body:** (không cần)

**Expected Response (200):**
```json
{
  "user": {
    "_id": "64a1b2c3d4e5f6g7h8i9j0k1",
    "username": "testuser123",
    "email": "testuser@gmail.com",
    "avatar": "",
    "bio": "",
    "followers": [],
    "following": [],
    "createdAt": "2024-01-15T10:20:30.000Z",
    "updatedAt": "2024-01-15T10:20:30.000Z"
  }
}
```

---

##  VIDEO API

### **A. Upload Video**

**Method:** `POST`  
**URL:** `{{base_url}}/api/videos`

**Headers:**
```
Authorization: Bearer {{token}}
```

**Body:** chọn **form-data**
```
Key          Type     Value
title        text     My Awesome Video
description  text     This is my first video
video        file     (chọn file video từ máy)
```

**Steps:**
1. Method: **POST**
2. URL: `{{base_url}}/api/videos`
3. **Headers** tab → thêm:
   - Key: `Authorization`
   - Value: `Bearer {{token}}`
4. **Body** tab → chọn **form-data**
5. Thêm fields (see trên)
6. Click **Send**

**Expected Response (201):**
```json
{
  "message": "Video uploaded successfully",
  "video": {
    "_id": "64a1b2c3d4e5f6g7h8i9j0k1",
    "title": "My Awesome Video",
    "description": "This is my first video",
    "videoUrl": "/uploads/1234567890-video.mp4",
    "user": "64a1b2c3d4e5f6g7h8i9j0k2",
    "views": 0,
    "createdAt": "2024-01-15T10:20:30.000Z"
  }
}
```

**Save videoId:**
- Vào **Tests** tab, paste:
```javascript
var jsonData = pm.response.json();
pm.environment.set("video_id", jsonData.video._id);
```

---

### **B. Get All Videos**

**Method:** `GET`  
**URL:** `{{base_url}}/api/videos`

**Headers:** (không cần Authorization)

**Expected Response (200):**
```json
{
  "videos": [
    {
      "_id": "64a1b2c3d4e5f6g7h8i9j0k1",
      "title": "My Awesome Video",
      "description": "This is my first video",
      "videoUrl": "/uploads/1234567890-video.mp4",
      "user": {
        "_id": "64a1b2c3d4e5f6g7h8i9j0k2",
        "username": "testuser123"
      },
      "views": 0,
      "createdAt": "2024-01-15T10:20:30.000Z"
    }
  ]
}
```

---

### **C. Get Video By ID**

**Method:** `GET`  
**URL:** `{{base_url}}/api/videos/{{video_id}}`

**Expected Response (200):**
```json
{
  "video": {
    "_id": "64a1b2c3d4e5f6g7h8i9j0k1",
    "title": "My Awesome Video",
    "description": "This is my first video",
    "videoUrl": "/uploads/1234567890-video.mp4",
    "user": {
      "_id": "64a1b2c3d4e5f6g7h8i9j0k2",
      "username": "testuser123"
    },
    "views": 0,
    "createdAt": "2024-01-15T10:20:30.000Z"
  }
}
```

---

### **D. Delete Video**

**Method:** `DELETE`  
**URL:** `{{base_url}}/api/videos/{{video_id}}`

**Headers:**
```
Authorization: Bearer {{token}}
```

**Expected Response (200):**
```json
{
  "message": "Video deleted successfully"
}
```

---

##  COMMENT API

### **A. Add Comment**

**Method:** `POST`  
**URL:** `{{base_url}}/api/comments/{{video_id}}`

**Headers:**
```
Authorization: Bearer {{token}}
Content-Type: application/json
```

**Body:**
```json
{
  "content": "Great video! 🎉"
}
```

**Expected Response (201):**
```json
{
  "_id": "64a1b2c3d4e5f6g7h8i9j0k1",
  "content": "Great video! 🎉",
  "video": "64a1b2c3d4e5f6g7h8i9j0k0",
  "user": {
    "_id": "64a1b2c3d4e5f6g7h8i9j0k2",
    "username": "testuser123"
  },
  "createdAt": "2024-01-15T10:20:30.000Z"
}
```

---

### **B. Get Comments of Video**

**Method:** `GET`  
**URL:** `{{base_url}}/api/comments/{{video_id}}`

**Expected Response (200):**
```json
[
  {
    "_id": "64a1b2c3d4e5f6g7h8i9j0k1",
    "content": "Great video! 🎉",
    "video": "64a1b2c3d4e5f6g7h8i9j0k0",
    "user": {
      "_id": "64a1b2c3d4e5f6g7h8i9j0k2",
      "username": "testuser123"
    },
    "createdAt": "2024-01-15T10:20:30.000Z"
  }
]
```

---

### **C. Delete Comment**

**Method:** `DELETE`  
**URL:** `{{base_url}}/api/comments/<comment_id>`

**Headers:**
```
Authorization: Bearer {{token}}
```

**Expected Response (200):**
```json
{
  "message": "Comment deleted"
}
```

---

##  LIKE API

### **A. Toggle Like (Thích/Bỏ Thích)**

**Method:** `POST`  
**URL:** `{{base_url}}/api/likes/{{video_id}}`

**Headers:**
```
Authorization: Bearer {{token}}
```

**Expected Response (200):**
```json
{
  "message": "Video liked"
}
// Lần thứ 2 sẽ return:
{
  "message": "Video unliked"
}
```

---

### **B. Get Likes Count**

**Method:** `GET`  
**URL:** `{{base_url}}/api/likes/{{video_id}}`

**Expected Response (200):**
```json
{
  "likesCount": 42
}
```

---

##  Tạo Collection (Tùy chọn)

### **Bước 1: Create Collection**
1. Click **Collections** (sidebar trái)
2. Click **+ Create Collection**
3. Đặt tên: `TikTok Backend`
4. Click **Create**

### **Bước 2: Add Requests**
1. Mở Collection vừa tạo
2. Click **+** để thêm request
3. Đặt tên từng request:
   - Register User
   - Login User
   - Get Profile
   - Upload Video
   - Get All Videos
   - Get Video By ID
   - Delete Video
   - Add Comment
   - Get Comments
   - Delete Comment
   - Toggle Like
   - Get Likes Count

### **Bước 3: Folder Organization**
Tạo folders con:
- Users
  - Register
  - Login
  - Get Profile
- Videos
  - Upload
  - Get All
  - Get By ID
  - Delete
- Comments
  - Add
  - Get All
  - Delete
- Likes
  - Toggle
  - Get Count

---

##  Test Sequence

**Thứ tự test từ trên xuống:**

```
1. Register User
   ↓ (lưu userId)
2. Login User
   ↓ (lưu token)
3. Get Profile
4. Upload Video
   ↓ (lưu video_id)
5. Get All Videos
6. Get Video By ID
7. Add Comment
8. Get Comments
9. Toggle Like
10. Get Likes Count
11. Delete Comment
12. Delete Video
```

---

##  Troubleshooting

### **Lỗi: "Unauthorized" (401)**
- Kiểm tra token trong Authorization header
- Đảm bảo token chưa hết hạn (1 hour)
- Login lại để lấy token mới

### **Lỗi: "Not Found" (404)**
- Kiểm tra ID có đúng không
- Video/Comment có tồn tại không

### **Lỗi: "CORS error"**
- Backend đã cấu hình CORS
- Kiểm tra server đang chạy

### **Lỗi: "Cannot find module"**
- Backend có lỗi
- Check terminal logs
- Chạy `npm install`

### **Bearer Token không hoạt động**
- Format: `Bearer <token>` (có khoảng trắng)
- Không copy dấu ngoặc kép

---

##  Tips & Tricks

### **1. Reuse Token**
```
Sau khi login, token tự động lưu trong environment.
Các request sau chỉ cần dùng {{token}} trong Authorization header.
```

### **2. Quick Test**
```
Pre-request Script: set variables
Tests: validate response, save variables
```

### **3. Batch Requests**
```
Click Runner icon (left bottom)
Select Collection → Run
Tất cả requests sẽ chạy lần lượt
```

### **4. Export Collection**
```
Collection menu → Export → Postman Collection v2.1
Dùng để share với team
```

### **5. Mock Server**
```
Postman có feature mock server (Pro feature)
Giúp frontend dev test khi backend chưa ready
```

---

##  Response Status Codes

| Code | Meaning | Example |
|------|---------|---------|
| 200 | OK | Get request success |
| 201 | Created | User registered |
| 400 | Bad Request | Sai input data |
| 401 | Unauthorized | Token invalid/missing |
| 403 | Forbidden | Không có quyền |
| 404 | Not Found | Resource không tồn tại |
| 500 | Server Error | Backend error |

---

##  Security Notes

- ⚠️ **Không commit token** vào Git
- ⚠️ **Không share token** công khai
- ⚠️ **Đổi JWT_SECRET** trước production
- ⚠️ **Kiểm tra CORS** settings

---

##  Further Reading

- [Postman Documentation](https://learning.postman.com/)
- [REST API Best Practices](https://restfulapi.net/)
- [HTTP Status Codes](https://httpwg.org/specs/rfc7231.html)
