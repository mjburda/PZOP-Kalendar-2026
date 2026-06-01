import { index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.jsx"),
  route("events/new", "routes/new-event.jsx"),
  route("events/:id", "routes/event-detail.jsx"),
  route("users", "routes/users.jsx"),
  route("profile", "routes/profile.jsx"),
];