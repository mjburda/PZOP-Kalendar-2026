import { index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.jsx"), // Domovská stránka
  route("events/new", "routes/new-event.jsx"), // Přidání
  route("events/:id", "routes/event-detail.jsx"), // Detail a editace
];