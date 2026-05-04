# TikTok Backend - API Server

## 📋 Mô tả Dự án

Đây là backend API server cho ứng dụng TikTok Clone được xây dựng bằng **Node.js**, **Express**, **MongoDB** và **Mongoose**.

Backend cung cấp các API endpoints để quản lý:
- Người dùng (User) - Đăng ký, đăng nhập, lấy thông tin
- Video - Tải lên, xem, xóa video
- Bình luận (Comments) - Thêm, xem, xóa bình luận
- Like - Thích/bỏ thích video

---

## 🛠️ Yêu cầu Hệ thống

Trước khi cài đặt, bạn cần:
- **Node.js** >= 16.0.0 (Download từ [nodejs.org](https://nodejs.org))
- **npm** >= 8.0.0 (Đi kèm với Node.js)
- **MongoDB** >= 4.0 (Local hoặc MongoDB Atlas)
- **Git** (Optional, để clone repository)

**Kiểm tra phiên bản hiện tại:**
```powershell
node --version
npm --version
```

---

## 📦 Cài đặt & Khởi động

### **Bước 1: Clone Repository (nếu chưa có)**
```powershell
git clone https://github.com/tannguyen888/tiktok_be.git
cd tiktok_be
```

### **Bước 2: Cài đặt Dependencies**
```powershell
# Cài đặt toàn bộ npm packages
npm install
```

**Các package được cài đặt:**
- `express` - Framework web
- `mongoose` - ODM cho MongoDB
- `cors` - Xử lý cross-origin requests
- `dotenv` - Quản lý environment variables
- `bcryptjs` - Hash password
- `jsonwebtoken` - JWT authentication
- `multer` - Upload file video
- `nodemon` - Auto-reload khi code thay đổi (dev mode)

### **Bước 3: Tạo File .env**
Tạo file `.env` trong thư mục backend:
```env
MONGODB_URI=mongodb://localhost:27017/tiktok
JWT_SECRET=943e23d17460f919e4a43df9e172237f017b836359438f0cd9515cc111bc6dcb404d6e66164bb85cd369fe2fe6844c22427b1ef37e8c20dd48220a19425cbc17
PORT=5000
```

**Hoặc dùng MongoDB Atlas (Cloud):**
```env
MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/tiktok?retryWrites=true&w=majority
JWT_SECRET=your_secret_key_here
PORT=5000
```

### **Bước 4: Khởi động Server**

**Development Mode (tự động reload khi code thay đổi):**
```powershell
npm run dev
```

**Production Mode:**
```powershell
npm start
```

Server sẽ chạy trên: `http://localhost:5000`

---

## 📁 Cấu trúc Dự án

```
backend/
├── node_modules/              # Thư mục chứa toàn bộ npm packages
├── uploads/                   # Thư mục lưu video được tải lên
├── controllers/               # Logic xử lý business
│   ├── userController.js      # Xử lý người dùng (register, login, getProfile)
│   ├── videoController.js     # Xử lý video (upload, getVideos, delete)
│   ├── commentController.js   # Xử lý bình luận (add, get, delete)
│   └── likeController.js      # Xử lý like (toggle, getLikes)
├── models/                    # Schema MongoDB
│   ├── userModel.js           # Schema người dùng
│   ├── videoModel.js          # Schema video
│   ├── commentModel.js        # Schema bình luận
│   └── likeModel.js           # Schema like
├── routes/                    # Định nghĩa API routes
│   ├── userRoutes.js          # Route: /api/users
│   ├── videoRoutes.js         # Route: /api/videos
│   ├── commentRoutes.js       # Route: /api/comments
│   └── likeRoutes.js          # Route: /api/likes
├── middleware/                # Middleware
│   └── authMiddleware.js      # Kiểm tra JWT token
├── server.js                  # File chính, khởi động Express server
├── package.json               # Dependencies và scripts
├── package-lock.json          # Lock file cho dependencies
├── .env                       # Environment variables (không commit)
├── .gitignore                 # Các file bỏ qua khi commit
└── README.md                  # File này
```

---

## 🔌 API Endpoints

### **Base URL:** `http://localhost:5000/api`

### **1. USER ROUTES** (`/api/users`)

#### **Đăng Ký (Register)**
```
POST /api/users/register
Content-Type: application/json

Body:
{
  "username": "testuser",
  "email": "test@gmail.com",
  "password": "123456"
}

Response (201):
{
  "userId": "64a1b2c3d4e5f6g7h8i9j0k1"
}
```

#### **Đăng Nhập (Login)**
```
POST /api/users/login
Content-Type: application/json

Body:
{
  "email": "test@gmail.com",
  "password": "123456"
}

Response (200):
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "64a1b2c3d4e5f6g7h8i9j0k1",
    "username": "testuser",
    "email": "test@gmail.com"
  }
}
```

#### **Lấy Thông Tin Profile**
```
GET /api/users/profile
Authorization: Bearer <token>

Response (200):
{
  "user": {
    "_id": "64a1b2c3d4e5f6g7h8i9j0k1",
    "username": "testuser",
    "email": "test@gmail.com",
    "avatar": "",
    "bio": "",
    "followers": [],
    "following": [],
    "createdAt": "2024-01-15T10:20:30.000Z"
  }
}
```

---

### **2. VIDEO ROUTES** (`/api/videos`)

#### **Lấy Tất Cả Video**
```
GET /api/videos

Response (200):
{
  "videos": [
    {
      "_id": "64a1b2c3d4e5f6g7h8i9j0k1",
      "title": "Video 1",
      "description": "Mô tả video",
      "videoUrl": "/uploads/1234567890-video.mp4",
      "user": {
        "_id": "64a1b2c3d4e5f6g7h8i9j0k2",
        "username": "testuser"
      },
      "views": 100,
      "createdAt": "2024-01-15T10:20:30.000Z"
    }
  ]
}
```

#### **Lấy Video Theo ID**
```
GET /api/videos/:id

Response (200):
{
  "video": {
    "_id": "64a1b2c3d4e5f6g7h8i9j0k1",
    "title": "Video 1",
    "description": "Mô tả video",
    "videoUrl": "/uploads/1234567890-video.mp4",
    "user": {
      "_id": "64a1b2c3d4e5f6g7h8i9j0k2",
      "username": "testuser"
    },
    "views": 100,
    "createdAt": "2024-01-15T10:20:30.000Z"
  }
}
```

#### **Tải Lên Video**
```
POST /api/videos
Authorization: Bearer <token>
Content-Type: multipart/form-data

Body:
- title: "Video Title"
- description: "Video Description"
- video: <file.mp4>

Response (201):
{
  "message": "Video uploaded successfully",
  "video": {
    "_id": "64a1b2c3d4e5f6g7h8i9j0k1",
    "title": "Video Title",
    "description": "Video Description",
    "videoUrl": "/uploads/1234567890-video.mp4",
    "user": "64a1b2c3d4e5f6g7h8i9j0k2",
    "views": 0,
    "createdAt": "2024-01-15T10:20:30.000Z"
  }
}
```

#### **Xóa Video**
```
DELETE /api/videos/:id
Authorization: Bearer <token>

Response (200):
{
  "message": "Video deleted successfully"
}
```

---

### **3. COMMENT ROUTES** (`/api/comments`)

#### **Lấy Bình Luận của Video**
```
GET /api/comments/:videoId

Response (200):
[
  {
    "_id": "64a1b2c3d4e5f6g7h8i9j0k1",
    "content": "Great video!",
    "video": "64a1b2c3d4e5f6g7h8i9j0k0",
    "user": {
      "_id": "64a1b2c3d4e5f6g7h8i9j0k2",
      "username": "testuser"
    },
    "createdAt": "2024-01-15T10:20:30.000Z"
  }
]
```

#### **Thêm Bình Luận**
```
POST /api/comments/:videoId
Authorization: Bearer <token>
Content-Type: application/json

Body:
{
  "content": "Great video!"
}

Response (201):
{
  "_id": "64a1b2c3d4e5f6g7h8i9j0k1",
  "content": "Great video!",
  "video": "64a1b2c3d4e5f6g7h8i9j0k0",
  "user": {
    "_id": "64a1b2c3d4e5f6g7h8i9j0k2",
    "username": "testuser"
  },
  "createdAt": "2024-01-15T10:20:30.000Z"
}
```

#### **Xóa Bình Luận**
```
DELETE /api/comments/:id
Authorization: Bearer <token>

Response (200):
{
  "message": "Comment deleted"
}
```

---

### **4. LIKE ROUTES** (`/api/likes`)

#### **Toggle Like Video (Thích/Bỏ Thích)**
```
POST /api/likes/:videoId
Authorization: Bearer <token>

Response (200):
{
  "message": "Video liked"
}
// hoặc
{
  "message": "Video unliked"
}
```

#### **Lấy Số Lượng Like**
```
GET /api/likes/:videoId

Response (200):
{
  "likesCount": 42
}
```

---

## 🔐 Authentication

Tất cả các route được bảo vệ bằng JWT token phải gửi trong header:

```
Authorization: Bearer <your_jwt_token>
```

**Cách lấy token:**
1. Gọi endpoint `/api/users/login` để đăng nhập
2. Lấy token từ response
3. Gửi token trong header `Authorization: Bearer <token>` cho các request được bảo vệ

---

## 🗄️ Schema MongoDB

### **User Schema**
```javascript
{
  username: String (required, unique),
  email: String (required, unique, lowercase),
  password: String (required, hashed),
  avatar: String (default: ''),
  bio: String (default: ''),
  followers: [ObjectId ref User],
  following: [ObjectId ref User],
  createdAt: Date,
  updatedAt: Date
}
```

### **Video Schema**
```javascript
{
  title: String (required),
  description: String (default: ''),
  videoUrl: String (required),
  user: ObjectId ref User (required),
  views: Number (default: 0),
  createdAt: Date,
  updatedAt: Date
}
```

### **Comment Schema**
```javascript
{
  content: String (required),
  video: ObjectId ref Video (required),
  user: ObjectId ref User (required),
  createdAt: Date,
  updatedAt: Date
}
```

### **Like Schema**
```javascript
{
  video: ObjectId ref Video (required),
  user: ObjectId ref User (required),
  unique index on (video, user),
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🚀 Deploy lên Production

### **Deploy trên Render**

1. **Push code lên GitHub:**
```powershell
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/tannguyen888/tiktok_be.git
git branch -M main
git push -u origin main
```

2. **Truy cập [render.com](https://render.com):**
   - Click "New +" → "Web Service"
   - Kết nối GitHub repository
   - Set Build Command: `npm install`
   - Set Start Command: `npm start`
   - Add Environment Variables:
     - `MONGODB_URI`: MongoDB connection string
     - `JWT_SECRET`: Secret key
     - `PORT`: 5000

3. **Deploy!** Render sẽ tự động build và deploy

### **Deploy trên Railway**

1. Truy cập [railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub"
3. Chọn repository
4. Add environment variables
5. Deploy tự động

---

## 📝 Các Lệnh Hữu Ích

```powershell
# Cài đặt dependencies
npm install

# Chạy development server (auto-reload)
npm run dev

# Chạy production server
npm start

# Cài đặt một package mới
npm install package-name

# Xóa node_modules và cài lại
rm -r node_modules
npm install

# Kiểm tra security issues
npm audit

# Fix security issues
npm audit fix
```

---

## 🐛 Troubleshooting

### **Lỗi: "Cannot find module 'mongoose'"**
```powershell
npm install
```

### **Lỗi: "Failed to connect to MongoDB"**
- Kiểm tra MongoDB URI trong .env
- Đảm bảo MongoDB server đang chạy (nếu dùng local)
- Hoặc tạo MongoDB Atlas account và lấy connection string

### **Lỗi: "Port 5000 already in use"**
```powershell
# Đổi PORT trong .env hoặc kill process
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### **Lỗi: CORS error từ frontend**
Đã được cấu hình trong `server.js`:
```javascript
server.use(cors());
```

---

## 📚 Dependencies Chi Tiết

| Package | Phiên bản | Mục đích |
|---------|----------|---------|
| express | ^5.2.1 | Web framework |
| mongoose | ^9.6.1 | MongoDB ODM |
| cors | Latest | Cross-origin requests |
| dotenv | ^17.4.2 | Environment variables |
| bcryptjs | ^3.0.3 | Password hashing |
| jsonwebtoken | ^9.0.3 | JWT authentication |
| multer | ^2.1.1 | File upload |
| nodemon | ^3.1.14 | Development auto-reload |

---

## 📞 Contact & Support

- GitHub: [tannguyen888](https://github.com/tannguyen888)
- Email: Contact through GitHub

---

## 📄 License

MIT License - Tự do sử dụng cho mục đích cá nhân và thương mại.

---

**Tài liệu được cập nhật lần cuối: 05/2026**
