# 📝 Note Taking App

A full-stack MERN (MongoDB, Express.js, React, Node.js) based **Note-Taking App** with secure OTP-based login, tag-based filtering, and a beautiful responsive UI.

---

## 📁 Project Structure

```

note-taking-app/
│
├── frontend/   # React + Tailwind based UI
├── backend/    # Express + MongoDB REST API
└── README.md

````

---

## ✨ Features

- 🔐 OTP-based Login (Email only)
- 🗒️ Create, Read, Update, Delete Notes
- 🏷️ Tag-based filtering & searching
- 🎨 Responsive UI with TailwindCSS
- 🧠 Notes stored securely by user
- 🔁 "Keep me logged in" session toggle

---

## 🚀 Getting Started

### 1️⃣ Clone the Repo

```bash
git clone https://github.com/your-username/note-taking-app.git
cd note-taking-app
````

---

### 2️⃣ Setup Backend

```bash
cd backend
npm install
```

#### Create `.env` file in `backend/`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/notesdb
JWT_SECRET=your_jwt_secret
```

Then run:

```bash
npm run dev
```

---

### 3️⃣ Setup Frontend

```bash
cd ../frontend
npm install
npm run dev
```

---

## 🔧 Tech Stack

* **Frontend**: React, TailwindCSS, React-Router, Axios, React-Hot-Toast
* **Backend**: Node.js, Express.js, MongoDB, Mongoose, Nodemailer, JWT
* **Auth**: OTP-based (email), Session or Local Storage token

---

## 📸 Screenshots


![Screenshot (951)](https://github.com/user-attachments/assets/b1400550-5e0a-4922-8278-77f6ca0853aa)


![Screenshot (952)](https://github.com/user-attachments/assets/7eb4e839-0959-4a93-8d29-ec7925ced2a7)

![Screenshot (953)](https://github.com/user-attachments/assets/57855fef-d522-46ab-8936-aad0d28f8d84)

![Screenshot (954)](https://github.com/user-attachments/assets/880b8d84-e0e6-48b2-acd2-f8ea116dd9fd)

---

## 🙌 Author

Made with ❤️ by [Your Name](https://github.com/your-username)


