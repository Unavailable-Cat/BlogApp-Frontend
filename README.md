# Inkwell — Blogging Platform (Frontend)

A minimal, modern React frontend for **Inkwell**, a full-stack blogging platform. It talks to a Spring Boot REST API for authentication, blog CRUD, and user profiles, and supports both registered users and read-only guest browsing.

**Live demo:** [blogapp158.netlify.app](https://blogapp158.netlify.app)
**Backend repo:** (https://github.com/Unavailable-Cat/blog-app-backend)

---

## Features

- **Guest + authenticated browsing** — anyone can read posts and view profiles; writing requires an account, with clear in-app prompts guiding guests to log in or register instead of silent redirects.
- **Email/password auth** and **Google OAuth2 login**, backed by a stateless JWT issued by the backend.
- **Graceful session expiry** — an expired token drops the user back to guest mode with a clear message, instead of leaving the UI in a broken state.
- **Full post lifecycle** — create, edit (partial or full update), and delete posts, with a rich cover-image upload flow.
- **Profiles** — view your own posts and settings, or browse any other user's public profile and posts.
- **Responsive, minimalist UI** — a calm, editorial look (serif headings, restrained color palette) that works from mobile to desktop.

## Tech Stack

- **React 18** + **TypeScript**
- **Vite** — dev server and build tooling
- **React Router** — client-side routing and protected routes
- **Tailwind CSS** — utility-first styling
- **lucide-react** — icon set
- **Fetch API** — thin hand-written API client (no axios dependency)

## Project Structure

```
src/
├── components/     # Navbar, BlogCard, BlogForm, Toast, ProtectedRoute, etc.
├── pages/          # Route-level views: HomeFeed, Login, Register, MyBlogs,
│                   # UserProfile, UserBlogs, CreateBlog, EditBlog, Settings
├── lib/
│   ├── api.ts          # Fetch wrapper + typed endpoint calls
│   ├── auth-context.tsx# Auth state, JWT storage, 401 handling
│   └── config.ts        # Env-driven constants (API base URL, storage keys)
└── types.ts        # Types mirrored from the backend's OpenAPI spec
```

## Getting Started

```bash
npm install
npm run dev       # starts Vite dev server
npm run build     # production build to dist/
```

### Environment variables

Create a `.env` file in the project root:

```
VITE_API_BASE_URL=http://localhost:8080
```

Point this at your running Spring Boot backend. Google OAuth2 login uses this same base URL (`/oauth2/authorization/google`), so the backend's redirect URI must be configured to send users back to this frontend's `/oauth/callback` route.

## API Integration

This frontend is built directly against the backend's OpenAPI spec and expects the following endpoints:

| Method | Path                     | Purpose                              |
|--------|--------------------------|---------------------------------------|
| POST   | `/register`              | Create account, returns JWT           |
| POST   | `/login`                 | Authenticate, returns JWT             |
| GET    | `/user/my`                | Current user profile                  |
| GET    | `/user/username`         | Look up a user by username             |
| PATCH  | `/user/username`         | Update own username                   |
| PATCH  | `/user/description`      | Update own bio                        |
| DELETE | `/user`                   | Delete own account                    |
| GET    | `/blog`                  | List all posts                        |
| GET    | `/blog/id/{id}`          | Single post detail                    |
| GET    | `/blog/username/{u}`     | Posts by a given user                 |
| GET    | `/blog/my`               | Current user's posts                  |
| POST   | `/blog`                  | Create post (multipart, with image)   |
| PUT    | `/blog/{id}`             | Full update (title, content, image)   |
| PATCH  | `/blog/title/{id}`       | Update title only                     |
| PATCH  | `/blog/content/{id}`     | Update content only                   |
| PATCH  | `/blog/image/{id}`       | Update cover image only               |
| DELETE | `/blog/{id}`             | Delete post                           |

JWTs are sent as `Authorization: Bearer <token>` on every authenticated request. A `401` response clears the stored token, notifies the user their session expired, and redirects them to `/login`.

## A note on how this was built

This frontend's UI and UX were built with the help of AI coding tools (Claude,Bolt), used to scaffold components, refine the design system, and iterate quickly on interaction details (auth flows, empty/loading/error states, navigation). All architecture decisions, API contracts, and functional review were done by me.

## Deployment

Deployed on **Netlify** (`npm run build` → `dist/`). Set `VITE_API_BASE_URL` as a Netlify environment variable pointing at the deployed backend.
