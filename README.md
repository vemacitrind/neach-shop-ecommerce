NEACH Shop E-Commerce

NEACH Shop is an e-commerce web application created for NEACH businesses that want to start online with minimal resources.
The project focuses on simplicity, low cost, and a practical serverless-style backend approach.

This repository is suitable for startups, small shops, learning projects, and lightweight production use.

Project Description

This project is designed for businesses that want to launch an online store without maintaining a full-time backend server.

The backend is not required to run continuously. It is started only when necessary, such as during image uploads or admin-related tasks. Once the task is complete, the backend can be stopped.

This approach reduces:

Hosting costs

Server maintenance

Infrastructure complexity

The backend can run locally on a computer or on a mobile device using Termux.

Project Structure
neach-shop-ecommerce/
│
├── backend/
│   ├── server.js
│   ├── package.json
│   ├── package-lock.json
│   ├── .env
│   ├── .env_copy
│   └── frontend-examples.js
│
├── src/
├── public/
├── supabase/
├── dist/
├── index.html
├── package.json
├── vite.config.ts
├── tailwind.config.ts
├── README.md
└── .gitignore

Frontend Setup
Requirements

Node.js (v18 or higher)

npm

Installation
npm install

Development Server
npm run dev


Frontend will be available at:

http://localhost:5173

Backend Setup (On-Demand)

The backend is only needed for specific tasks such as image uploads.

Download Only the Backend Folder

If you want only the backend, use one of the following methods.

Using Git (Sparse Checkout)
git clone --no-checkout https://github.com/your-username/neach-shop-ecommerce.git
cd neach-shop-ecommerce
git sparse-checkout init --cone
git sparse-checkout set backend
git checkout


This will download only the backend folder.

Backend Folder Contents
ls -a backend
.
..
.env
.env_copy
frontend-examples.js
node_modules
package.json
package-lock.json
server.js

Backend Installation
cd backend
npm install

Environment Configuration
cp .env_copy .env


Edit .env and add the required values.

Start Backend Server (Only When Needed)
node server.js


Stop the server when uploads or admin tasks are complete.

Running Backend on Mobile (Termux)

The backend can be run on an Android device using Termux.

pkg install nodejs git
git clone --no-checkout https://github.com/your-username/neach-shop-ecommerce.git
cd neach-shop-ecommerce
git sparse-checkout init --cone
git sparse-checkout set backend
git checkout
cd backend
npm install
node server.js


This allows backend usage without a computer.

Who This Project Is For

Small businesses

Local shops

Startups with limited budget

Developers learning serverless-style architecture

College and portfolio projects

Security Notes

.env files are not committed to Git

Do not expose environment variables publicly

Backend runs locally for better control

License

This project is open-source and intended for learning and small business use.