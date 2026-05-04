# 📦 Database Migrations Guide

## Giới thiệu

Hệ thống migration giúp bạn:
- ✅ Tự động update database schema
- ✅ Theo dõi các thay đổi database
- ✅ Dễ dàng rollback nếu có lỗi
- ✅ Quản lý version database

---

## 📁 Cấu trúc

```
migrations/
├── runMigration.js              # Migration runner (chạy migrations)
├── TEMPLATE.js                  # Template để tạo migration mới
├── 001_add_avatar_bio_fields.js # Migration 1
├── 002_add_followers_following.js # Migration 2
└── 003_add_video_indexes.js      # Migration 3
```

---

## 🚀 Cách sử dụng

### **1. Chạy tất cả migrations chưa thực hiện**
```powershell
npm run migrate:up
# hoặc
node migrations/runMigration.js up
```

### **2. Chạy một migration cụ thể**
```powershell
node migrations/runMigration.js up 001
```

### **3. Xem trạng thái migrations**
```powershell
npm run migrate:status
# hoặc
node migrations/runMigration.js status
```

**Output:**
```
📋 Migration Status

────────────────────────────────────────────────────────
Migration Name                          Status
────────────────────────────────────────────────────────
001_add_avatar_bio_fields               ✅ Executed
002_add_followers_following             ✅ Executed
003_add_video_indexes                   ⏳ Pending
────────────────────────────────────────────────────────
Total: 3 | Executed: 2 | Pending: 1
```

### **4. Rollback tất cả migrations**
```powershell
npm run migrate:down
# hoặc
node migrations/runMigration.js down
```

### **5. Rollback một migration cụ thể**
```powershell
node migrations/runMigration.js down 001
```

---

## ✏️ Tạo Migration Mới

### **Bước 1: Tạo file migration**

Tạo file mới với tên: `XXX_description_migration.js` 
(XXX là số thứ tự)

```javascript
// migrations/004_add_verified_field.js
const mongoose = require('mongoose');

module.exports = {
  name: '004_add_verified_field',
  description: 'Add verified field to User collection',
  
  up: async () => {
    try {
      const User = mongoose.model('User');
      
      // Update all users
      await User.updateMany(
        {},
        {
          $set: {
            isVerified: false
          }
        }
      );
      
      console.log('✓ Migration 004: Added isVerified field');
      return true;
    } catch (error) {
      console.error('✗ Migration 004 failed:', error);
      throw error;
    }
  },

  down: async () => {
    try {
      const User = mongoose.model('User');
      
      // Remove field
      await User.updateMany(
        {},
        {
          $unset: {
            isVerified: ''
          }
        }
      );
      
      console.log('✓ Migration 004 rolled back');
      return true;
    } catch (error) {
      console.error('✗ Migration 004 rollback failed:', error);
      throw error;
    }
  }
};
```

### **Bước 2: Chạy migration**
```powershell
npm run migrate:up
```

---

## 📚 Ví dụ Migrations

### **Thêm Field Mới**
```javascript
up: async () => {
  const User = mongoose.model('User');
  await User.updateMany({}, { $set: { newField: 'default' } });
}
```

### **Xóa Field**
```javascript
down: async () => {
  const User = mongoose.model('User');
  await User.updateMany({}, { $unset: { newField: '' } });
}
```

### **Cập nhật Giá Trị Existing**
```javascript
up: async () => {
  const Video = mongoose.model('Video');
  await Video.updateMany(
    { views: { $exists: false } },
    { $set: { views: 0 } }
  );
}
```

### **Tạo Index**
```javascript
up: async () => {
  const User = mongoose.model('User');
  await User.collection.createIndex({ email: 1 });
}
```

### **Xóa Index**
```javascript
down: async () => {
  const User = mongoose.model('User');
  await User.collection.dropIndex('email_1');
}
```

### **Bulk Update**
```javascript
up: async () => {
  const User = mongoose.model('User');
  await User.updateMany(
    { role: { $exists: false } },
    { 
      $set: { 
        role: 'user',
        status: 'active'
      } 
    }
  );
}
```

---

## 🗄️ Migrations Được Cung Cấp

### **001_add_avatar_bio_fields.js**
- Thêm fields `avatar` và `bio` vào User collection
- Default: `avatar = ''`, `bio = ''`

### **002_add_followers_following.js**
- Thêm fields `followers` và `following` vào User collection
- Default: `followers = []`, `following = []`

### **003_add_video_indexes.js**
- Tạo indexes cho Video collection:
  - Index trên `user + createdAt` (tìm videos của user)
  - Index trên `createdAt` (sắp xếp mới nhất)
  - Index trên `views` (videos được xem nhiều nhất)

---

## ✅ Best Practices

1. **Đặt tên migration rõ ràng**
   ```
   ❌ Bad: 001_update.js
   ✅ Good: 001_add_verified_field_to_users.js
   ```

2. **Luôn viết cả up và down**
   ```javascript
   up: async () => { /* add */ },
   down: async () => { /* remove */ }
   ```

3. **Test migration trước khi commit**
   ```powershell
   npm run migrate:status
   npm run migrate:up
   # kiểm tra database
   npm run migrate:down
   npm run migrate:up
   ```

4. **Commit migrations cùng code changes**
   ```powershell
   git add migrations/
   git commit -m "Add migration 004: verify field"
   ```

5. **Đọc logs kỹ lưỡng**
   ```
   ✓ Migration executed
   ✗ Migration failed
   ⏳ Pending
   ```

---

## 🐛 Troubleshooting

### **Migration không chạy**
1. Kiểm tra MongoDB connection string trong `.env`
2. Đảm bảo MongoDB server đang chạy
3. Kiểm tra syntax file migration

### **Nhầm tên migration**
Không thể đổi tên migration đã chạy rồi vì nó đã được lưu trong database.
Giải pháp:
1. Rollback migration: `npm run migrate:down <name>`
2. Xóa file
3. Tạo migration mới với tên đúng
4. Chạy lại

### **Migration bị stuck**
- Check process đang chạy: `npm run migrate:status`
- Kill process: `Ctrl+C`
- Rollback: `npm run migrate:down`
- Fix code migration
- Chạy lại

---

## 📝 npm Scripts

Thêm vào `package.json`:
```json
"scripts": {
  "migrate:up": "node migrations/runMigration.js up",
  "migrate:down": "node migrations/runMigration.js down",
  "migrate:status": "node migrations/runMigration.js status"
}
```

---

## 🔗 References

- [Mongoose Documentation](https://mongoosejs.com/)
- [MongoDB Updates](https://docs.mongodb.com/manual/reference/operator/update/)
- [Database Migrations Best Practices](https://en.wikipedia.org/wiki/Schema_migration)
