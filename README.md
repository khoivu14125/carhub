# CarHub Project

Clone ve la chay duoc voi du lieu mau (MySQL).

## 1) Yeu cau

- Node.js 18+ (khuyen nghi 20+)
- MySQL 8.x

## 2) Cai dat nhanh

```bash
git clone https://github.com/khoivu14125/carhub.git
cd carhub
```

### Backend

```bash
cd backend
npm install
copy .env.example .env
```

Sau do import data mau:

- Mo MySQL Workbench (hoac cong cu SQL bat ky)
- Chay file `backend/database/carhub_seed.sql`

### Frontend

```bash
cd ..\frontend
npm install
```

## 3) Chay du an

Mo 2 terminal:

```bash
# Terminal 1
cd backend
npm run dev
```

```bash
# Terminal 2
cd frontend
npm run dev
```

- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:5000`

## 4) Tai khoan demo (mat khau: 123456)

- Admin: `admin@carhub.com`
- Seller: `seller@carhub.com`
- Buyer: `buyer@carhub.com`

## 5) Luu y bao mat

Khong commit `backend/.env` len git vi file nay chua secret that (JWT, email, cloudinary...).
