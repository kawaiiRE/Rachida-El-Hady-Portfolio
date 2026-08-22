# Portfolio Repository Guidance

## Vue and SCSS class naming

- Give each page or component one meaningful root class, such as `.hero`, `.experience`, or `.project-detail`.
- Keep child class names local and concise inside scoped styles: use `.title`, `.content`, `.media`, `.actions`, and similar names.
- Do not repeat the root name in every child class. Avoid BEM-style names such as `.hero__title` or `.project-detail__gallery`.
- Use SCSS nesting when a selector only makes sense inside its component root or another local element.
- Use short state and variant classes such as `.is-active`, `.is-loading`, `.primary`, or `.wide` instead of extending the full component name.
- Reserve global class names for genuinely shared utilities such as `.app-container`, `.section-title`, and `.visually-hidden`.
