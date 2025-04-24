
# 📸 NexSnap Backend

**NexSnap** is an **AI-powered image-to-action system** that allows users to upload a photo (of a document, receipt, note, etc.) and automatically **extract, classify, and convert** the content into structured actions — such as **tasks, events, expenses, or notes**.

This backend is designed for **scalability**, **cloud readiness**, and **modular integration** with any frontend (mobile/web) and supports dynamic real-time updates using WebSockets.

---

## 🚀 Features

- 🔐 **JWT-Based Authentication**
- 📤 **Image Upload to Firebase Cloud Storage**
- 🧠 **OCR Processing via Tesseract.js**
- 🤖 **AI Classification using OpenAI (GPT-3.5)**
- 🧱 **MongoDB Replica Set (Master-Slave) Setup**
- 📊 **Redis Queue Management via BullMQ**
- 🛠️ **Async Processing with Dedicated Worker**
- 📡 **Real-time Updates via Socket.IO**
- ⚙️ **Rate Limiting to Protect API Usage**
- 🧩 **Modular MVC + Service Architecture**

---

## 🧱 Tech Stack

| Layer        | Tech Stack                                                                 |
|--------------|-----------------------------------------------------------------------------|
| Server       | Node.js, Express.js                                                        |
| Auth         | JWT-based secure authentication                                            |
| Database     | MongoDB with Master-Slave replica setup using Mongoose                    |
| OCR          | Tesseract.js                                                               |
| AI/LLM       | OpenAI GPT-3.5 for classification                                          |
| Storage      | Firebase Cloud Storage for storing user-uploaded images                   |
| Queue        | Redis + BullMQ for background OCR + AI processing                         |
| Realtime     | Socket.IO for live updates when a Snap is processed                       |
| DevOps       | Docker, dotenv, Render/Vercel deployment ready                            |

---

## 📂 Folder Structure

```
src/
│
├── auth/              # JWT logic (login/signup)
│   ├── controller/
│   └── routes/
│
├── core/
│   ├── data/
│   │   ├── models/    # Mongoose models
│   │   ├── helper/    # BaseResponse
│   │   └── sockets/   # Socket.IO server
│
├── jobs/              # Worker and BullMQ processor
├── services/
│   ├── ai/            # OpenAI classification
│   └── ocr/           # OCR logic
│
├── snap/              # Snap endpoints
│   ├── controller/
│   └── routes/
│
├── utils/             # Firebase, Redis, JWT utilities
├── app.js             # App entry point
└── .env               # Secrets (ignored by git)
```

---

## ⚙️ How It Works

1. User uploads an image via `/api/snap/upload`.
2. Image is stored in Firebase and a new `SnapItem` is created with status: `pending`.
3. A job is added to Redis using BullMQ.
4. Worker script:
    - Downloads image from Firebase.
    - Runs OCR via Tesseract.js.
    - Classifies the text using OpenAI GPT-3.5.
    - Saves result as `processed`.
    - Emits a WebSocket event (`snapDone:<snap_id>`) with processed result.

---

## 🧪 API Endpoints

### 🔐 Auth

```http
POST   /api/auth/signup      # Signup user
POST   /api/auth/login       # Login user and get JWT
```

### 🖼️ Snap

```http
POST   /api/snap/upload          # Upload snap (image + queue)
GET    /api/snap/                # Get all snaps of current user
GET    /api/snap/processed       # Only processed snaps
GET    /api/snap/pending         # Only pending snaps
POST   /api/snap/:id/action      # Convert snap to action
```

---

## 📡 Socket.IO

### Client-Side Flow:

- Connect and emit to `joinSnapRoom`:

```json
{ "snapId": "<snap_id>" }
```

- Server emits to `snapDone:<snap_id>`:

```json
{
  "message": "Snap processed",
  "data": { ...full SnapItem document... }
}
```

---

## 📌 Rate Limiting

- Using `express-rate-limit` to restrict frequency of requests per user.
- Prevents OpenAI misuse on free/limited plans.

---

## 🛠️ Dev Tips

- Add your credentials in `.env`:
```env
MONGODB_CONNECT_URI=...
REDIS_URL=...
OPENAI_API_KEY=...
FIREBASE_STORAGE_BUCKET=...
SECRET_KEY=...
```

- Start the server:
```bash
npm install
npm run dev
```

- Start the Redis Worker:
```bash
npm run worker
```

---
