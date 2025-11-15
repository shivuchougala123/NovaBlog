# NovaBlog Auth Backend

Simple Express + MongoDB backend providing authentication and blog management.

Setup

1. Copy `.env.example` to `.env` and set `MONGO_URI` and `JWT_SECRET`.
2. Install dependencies: `npm install`.
3. Start server: `npm start` (or `npm run dev`).

## Auth Endpoints

**POST /signup**
- Body: { email, password, name? }
- Responses: 201 created, 400 bad request, 409 conflict

**POST /signin**
- Body: { email, password }
- Responses: 200 with { token, user }, 400 bad request, 401 unauthorized

**POST /logout**
- No authentication required (client-side token clearing)
- Responses: 200 with success message
- Client removes token from localStorage after calling this endpoint

## Blog Endpoints

**POST /create-blog** (Authenticated)
- Headers: Authorization: Bearer <token>
- Body: { title, description, thumbnailUrl?, tags? }
- Responses: 201 created with blog object, 400 bad request, 401 unauthorized, 500 error

**GET /my-blogs** (Authenticated)
- Headers: Authorization: Bearer <token>
- Responses: 200 with { blogs: [...] }, 401 unauthorized, 500 error
- Returns only blogs created by the authenticated user

**GET /blogs** (Public)
- No authentication required
- Responses: 200 with { blogs: [...] }, 500 error
- Returns all blogs from all users

**GET /blog/:id** (Public)
- No authentication required
- Responses: 200 with { blog: {...} }, 404 not found, 500 error
- Returns a single blog by ID with populated user information

**PUT /update-blog/:id** (Authenticated)
- Headers: Authorization: Bearer <token>
- Body: { title?, description?, thumbnailUrl?, tags? }
- Responses: 200 with updated blog, 403 forbidden, 404 not found, 401 unauthorized, 500 error
- Only the blog owner can update their blog

**DELETE /delete-blog/:id** (Authenticated)
- Headers: Authorization: Bearer <token>
- Responses: 200 with success message, 403 forbidden, 404 not found, 401 unauthorized, 500 error
- Only the blog owner can delete their blog

Notes

- Passwords are hashed with bcrypt.
- JWT is signed with `JWT_SECRET` and expires in 7 days.
- Protected routes require `Authorization: Bearer <token>` header.
- Blog model includes: title, thumbnailUrl, tags, description, userId, createdAt, updatedAt

