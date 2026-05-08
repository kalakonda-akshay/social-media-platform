# ConnectSphere

ConnectSphere is a production-ready beginner-friendly MERN social media platform with JWT authentication, profile editing, follows, posts, likes, comments, notifications, media uploads, and a responsive dark blue UI.

## Tech Stack

- Frontend: React, Vite, Tailwind CSS, React Router DOM, Axios, Framer Motion, React Icons
- Backend: Node.js, Express.js, MongoDB Atlas, Mongoose, JWT, bcryptjs, multer, cors, dotenv

## Project Structure

```text
root/
  client/
  server/
```

## Environment

The requested MongoDB Atlas URI is already included in `server/.env` and mirrored in `server/.env.example`.

Server:

```env
PORT=5000
MONGO_URI=mongodb+srv://akshaykalakonda9_db_user:ByyvxWx3QRDJovPE@cluster0.hq4fyvm.mongodb.net/?appName=Cluster0
JWT_SECRET=connectsphere_secret
CLIENT_URL=http://localhost:5173
```

Client:

```env
VITE_API_URL=http://localhost:5000/api
VITE_SERVER_URL=http://localhost:5000
```

## Run Locally

Install and start the backend:

```bash
cd server
npm install
npm run dev
```

Install and start the frontend in a second terminal:

```bash
cd client
npm install
npm run dev
```

Open the Vite URL shown in your terminal, usually `http://localhost:5173`.

## Seed Demo Data

After installing server dependencies, run:

```bash
cd server
npm run seed
```

Demo login:

```text
Email: aarav@connectsphere.dev
Password: password123
```

Additional demo users use the same password:

- `maya@connectsphere.dev`
- `kabir@connectsphere.dev`
- `nisha@connectsphere.dev`

## API Summary

Auth:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

Users:

- `GET /api/users?search=query`
- `GET /api/users/suggested`
- `GET /api/users/:username`
- `PUT /api/users/profile`
- `PUT /api/users/:id/follow`

Posts:

- `POST /api/posts`
- `GET /api/posts/feed`
- `GET /api/posts/explore`
- `GET /api/posts/trending`
- `GET /api/posts/user/:username`
- `PUT /api/posts/:id/like`
- `POST /api/posts/:id/comments`
- `DELETE /api/posts/:id`

Notifications:

- `GET /api/notifications`
- `PUT /api/notifications/read`

## Deployment Notes

- Vercel full-stack deployment: import this GitHub repo in Vercel using the repository root. The included root `vercel.json` builds `client`, serves the React app from `client/dist`, and sends `/api/*` requests to the Express app as a serverless function.
- Required Vercel environment variables:
  - `MONGO_URI`
  - `JWT_SECRET`
- On Vercel, uploaded images/videos are stored as MongoDB data URLs because serverless filesystems are temporary.
- Single-service full-stack deployment on Render: create a Blueprint from this GitHub repo. The included `render.yaml` installs the backend, builds the React frontend, and serves the Vite build from Express in production.
- Required Render environment variables:
  - `MONGO_URI`
  - `JWT_SECRET`
- Optional split deployment:
  - Backend on Render with root directory `server`, build command `npm install`, and start command `npm start`.
  - Frontend on Vercel with root directory `client`.
  - Set frontend `VITE_API_URL` and `VITE_SERVER_URL` to your deployed backend URL.

## Notes

- Uploaded files are saved in `server/uploads`.
- JWT is stored in browser local storage for a simple beginner-friendly local setup.
- The notifications UI is API-backed and the live pulse panel simulates real-time activity for a polished social feel.
