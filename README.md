📸 NexSnap Backend
NexSnap is an AI-powered image-to-action system that allows users to snap a photo (of a document, receipt, note, etc.) and automatically classify, extract, and organize that content into useful actions like tasks, events, expenses, or notes.

This backend is built for scalability, reliability, and integration with modern frontend and cloud infrastructure.

🚀 Features
🔐 User Authentication (JWT based)

📁 Image Upload to Firebase Cloud Storage

🧠 OCR Processing using Tesseract.js

🤖 AI Classification via OpenAI (GPT-3.5)

💾 MongoDB Master-Slave Architecture using Mongoose

🔁 Job Queue Processing with Redis & BullMQ

⚙️ Background Workers to handle heavy async tasks

🔔 Real-time Updates via Socket.IO

📈 Rate Limiting to control API usage

🧪 Modular and extensible controller-service architecture

📦 Tech Stack

Layer	Technology
Server	Node.js + Express.js
Database	MongoDB (Replica Set)
Auth	JWT
Storage	Firebase Cloud Storage
OCR	Tesseract.js
AI	OpenAI GPT-3.5
Queue	Redis + BullMQ
Real-time	Socket.IO
Background	Worker threads
DevOps	Docker, dotenv, Vercel/Render ready
📁 Folder Structure
bash
Copy
Edit
src/
├── auth/                  # Authentication logic
│   ├── controller/
│   └── routes/
├── core/
│   └── data/
│       ├── models/        # Mongoose models
│       ├── helper/        # Base response, utilities
│       ├── sockets/       # Socket.IO server
├── services/
│   ├── ai/                # AI classification service
│   ├── ocr/               # OCR logic (tesseract)
├── snap/
│   ├── controllers/       # Snap CRUD and logic
│   └── routes/            # Snap-related endpoints
├── jobs/                 # Redis workers
├── utils/                # Firebase, JWT, Redis config
.env
app.js
⚙️ How It Works
User uploads an image → image is sent to Firebase Storage.

The image is saved in SnapItem with status: pending.

A job is added to Redis Queue for background processing.

Worker:

Fetches image URL

Runs OCR

Sends text to OpenAI API

Classifies as task, event, expense, or note

Saves SnapItem with status: processed

Sends real-time update via Socket.IO

Client listens on a WebSocket room for snap ID → gets instant updates.

🛡️ API Endpoints
🧾 Auth
http
Copy
Edit
POST /api/auth/signup
POST /api/auth/login
📸 Snap
http
Copy
Edit
POST /api/snap/upload            # Upload + queue
GET  /api/snap/                  # All snaps
GET  /api/snap/processed         # Only processed
GET  /api/snap/pending           # Only pending
POST /api/snap/:id/action        # Convert snap to action
📡 Socket.IO Events
Client Emits
joinSnapRoom → { snapId: "<snap_id>" }

Server Emits
snapDone:<snap_id> → { message, data: SnapItem }

📦 .env File (Sample)
env
Copy
Edit
PORT=3000
MONGODB_CONNECT_URI=mongodb+srv://user:pass@cluster.mongodb.net/db
JWT_SECRET=supersecurekey
OPENAI_API_KEY=sk-...
FIREBASE_STORAGE_BUCKET=nexsnap.firebasestorage.app
REDIS_URL=redis://default:...
✅ How to Run
bash
Copy
Edit
# Install dependencies
npm install

# Run main server
npm run dev

# Run Redis Worker
npm run worker
🛡️ Security & Best Practices
Redis eviction policy warning handled via logs

Rate limiting for AI-based endpoints

Snap upload restricted to image/jpeg and image/png

Background jobs run in separate processes

📄 License
This project is built with ❤️ by Majid as part of Nex-branded SaaS tools. All rights reserved.

