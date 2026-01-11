# NEACH Shop E-Commerce

NEACH Shop is an e-commerce web application created for NEACH businesses that want to start online with minimal resources. The project focuses on simplicity, low cost, and a practical serverless-style backend approach.

## Project Description

This project is designed for businesses that want to launch an online store without maintaining a full-time backend server.

The backend is not required to run continuously. It is started only when necessary, such as during image uploads or admin-related tasks. Once the task is complete, the backend can be stopped.

This approach reduces:
- Hosting costs
- Server maintenance
- Infrastructure complexity

The backend can run locally on a computer or on a mobile device using Termux.

## Technology Stack

<div align="center">
  <img src="https://vitejs.dev/logo.svg" alt="Vite" width="60" height="60">
  &nbsp;&nbsp;&nbsp;&nbsp;
  <img src="https://github.com/user-attachments/assets/c7568160-b85b-4c49-ae86-f374a70180ab" alt="Supabase" width="60" height="60">
  &nbsp;&nbsp;&nbsp;&nbsp;
  <img src="https://github.com/user-attachments/assets/a5c4e932-e043-44e8-96e6-3812614a76d8" alt="Cloudinary" width="60" height="60">
</div>
<div align="center">
  &nbsp;&nbsp;&nbsp;&nbsp;
  <strong>Vite</strong>
  &nbsp;&nbsp;&nbsp;&nbsp;
  <strong>Supabase</strong>
  &nbsp;&nbsp;&nbsp;&nbsp;
  <strong>Cloudinary</strong>
</div>


<details>
<summary><strong>Setup for Whole Website</strong></summary>

### Requirements
- Node.js (v18 or higher)
- npm

### Installation
```bash
git clone https://github.com/your-username/neach-shop-ecommerce.git
cd neach-shop-ecommerce
npm install
```

### Development Server
```bash
npm run dev
```

Frontend will be available at: http://localhost:5173

</details>

<details>
<summary><strong>Setup for Backend Only</strong></summary>

### Download Only Backend
```bash
git clone --no-checkout https://github.com/your-username/neach-shop-ecommerce.git
cd neach-shop-ecommerce
git sparse-checkout init --cone
git sparse-checkout set backend
git checkout
```

### Backend Installation
```bash
cd backend
npm install
```

### Environment Configuration
```bash
cp .env_copy .env
```
Edit .env and add the required values.

### Start Backend Server
```bash
node server.js
```

### Running on Mobile (Termux)
```bash
pkg install nodejs git
git clone --no-checkout https://github.com/your-username/neach-shop-ecommerce.git
cd neach-shop-ecommerce
git sparse-checkout init --cone
git sparse-checkout set backend
git checkout
cd backend
npm install
node server.js
```

</details>