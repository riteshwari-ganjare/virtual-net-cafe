# Virtual Net Cafe

## Backend
```
cd backend
npm install
# update .env with real ImageKit keys and JWT_SECRET
npm run dev
# seed admin: node src/seed.js
```
Admin default: admin@virtualcafe.com / admin123

## Frontend
```
cd frontend/frontend
npm install
npm run dev
```
Set NEXT_PUBLIC_API_URL in .env.local (default http://localhost:5000).