# Wallet Application

Ứng dụng ví điện tử với đầy đủ tính năng quản lý tài chính, chuyển tiền và quản lý người dùng.

## 🚀 Tính năng chính

- Đăng ký và đăng nhập người dùng
- Quản lý thông tin cá nhân và avatar
- Nạp tiền vào ví
- Chuyển tiền cho người dùng khác
- Quản lý danh sách liên hệ
- Xem lịch sử giao dịch
- Hệ thống thông báo
- Quản lý người dùng (Admin)
- Thống kê và báo cáo

## 🛠 Công nghệ sử dụng

### Backend
- Node.js
- Express.js
- MongoDB
- JWT Authentication
- Multer (File Upload)
- Socket.IO (Real-time notifications)

### Frontend
- React.js
- Redux Toolkit
- Material-UI
- Axios
- React Router
- Socket.IO Client

## 📋 Yêu cầu hệ thống

- Node.js >= 14.x
- MongoDB >= 4.x
- npm hoặc yarn

## 🔧 Cài đặt

### Backend

1. Clone repository:
```bash
git clone https://github.com/your-username/wallet.git
cd wallet/backend
```

2. Cài đặt dependencies:
```bash
npm install
```


4. Khởi động server:
```bash
npm start
```

### Frontend

1. Di chuyển vào thư mục frontend:
```bash
cd ../frontend
```

2. Cài đặt dependencies:
```bash
npm install
```

4. Khởi động ứng dụng:
```bash
npm run dev
```

## 📱 Hướng dẫn sử dụng

### Đăng ký tài khoản
1. Truy cập trang đăng ký
2. Điền đầy đủ thông tin: email, mật khẩu, họ tên

### Nạp tiền
1. Đăng nhập vào tài khoản
2. Chọn "Nạp tiền"
3. Nhập số tiền cần nạp
4. Xác nhận giao dịch

### Chuyển tiền
1. Đăng nhập vào tài khoản
2. Chọn "Chuyển tiền"
3. Chọn người nhận từ danh sách liên hệ hoặc nhập email
4. Nhập số tiền và ghi chú
5. Xác nhận giao dịch

### Quản lý liên hệ
1. Vào mục "Danh bạ"
2. Chọn "Thêm liên hệ"
3. Nhập email hoặc số điện thoại của người dùng
4. Xác nhận thêm vào danh bạ

### Xem lịch sử giao dịch
1. Vào mục "Lịch sử"
2. Xem danh sách các giao dịch
3. Có thể lọc theo thời gian hoặc loại giao dịch

## 👨‍💼 Hướng dẫn tạo business

### Đăng ký tài khoản doanh nghiệp
1. Liên hệ admin để được cấp tài khoản doanh nghiệp
2. Cung cấp các giấy tờ pháp lý cần thiết
3. Được cấp quyền truy cập vào hệ thống

### Quản lý giao dịch
1. Xem báo cáo giao dịch hàng ngày
2. Xuất báo cáo theo thời gian
3. Quản lý danh sách khách hàng

### Tích hợp API
1. Đăng ký API key từ admin
2. Sử dụng API documentation để tích hợp
3. Test các giao dịch trong môi trường sandbox

## 🔒 Bảo mật

- Mã hóa dữ liệu với JWT
- Xác thực 2 yếu tố (2FA)
- Giới hạn số lần đăng nhập sai
- Mã hóa mật khẩu với bcrypt
- Rate limiting cho API
- CORS protection

## 📈 Monitoring

- Logging với Winston
- Error tracking
- Performance monitoring
- Security alerts
