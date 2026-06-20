# Featured Posts Grid

A standalone Gutenberg block plugin for selecting published posts and displaying them in a responsive, server-rendered featured posts grid.

## Plugin Details

| Field | Value |
| --- | --- |
| Contributors | darkostojisavljevic |
| Tags | Gutenberg, block, posts, featured posts, grid |
| Requires at least | WordPress 6.4 |
| Tested up to | WordPress 7.0 |
| Requires PHP | 7.4 |
| Stable tag | 1.0.0 |
| License | GPLv2 or later |
| License URI | https://www.gnu.org/licenses/gpl-2.0.html |

## Description

Featured Posts Grid adds a native Gutenberg block called **Featured Posts Grid**.

The block allows editors to search for and select published posts, up to 6, then display them in a responsive frontend grid.

The frontend output is rendered server-side with PHP. The saved block stores selected post IDs and settings, not static frontend HTML.

This plugin was built as a standalone plugin using native Gutenberg block development with React.

No ACF, Carbon Fields, third-party block frameworks, or CSS frameworks are used.

## Task Requirements Implemented

The plugin implements the requested brief:

- Standalone WordPress plugin.
- Custom Gutenberg block called **Featured Posts Grid**.
- Native React-based editor UI.
- Search and select published posts.
- Limit selection to 6 posts.
- Sidebar setting for 2 or 3 desktop columns.
- Sidebar setting to show or hide excerpts.
- Sidebar setting to show or hide featured images.
- Live editor preview.
- Helpful empty state when no posts are selected.
- Responsive frontend grid.
- Selected desktop columns on large screens.
- 2 columns on tablet.
- 1 column on mobile.
- Card output with linked post title.
- Optional excerpt.
- Optional featured image.
- Semantic frontend HTML.
- Escaped frontend output.
- Server-side PHP rendering.

## Additional Improvements

Additional polish added beyond the required brief:

- Reorder selected posts.
- Image aspect ratio controls.
- Image size controls.
- Excerpt line clamp controls.
- Separate typography controls for post titles and excerpts.
- Card padding controls.
- Card border controls.
- Card border radius controls.
- Row gap and column gap controls.
- Default and borderless block styles.
- Lazy loading and async decoding for frontend featured images.
- Translation-ready strings.
- Optimized frontend query with `no_found_rows`.

## Installation

### Ready-to-install ZIP

1. Go to **Plugins > Add New** in WordPress admin.
2. Click **Upload Plugin**.
3. Upload the plugin ZIP file.
4. Activate **Featured Posts Grid**.
5. Add the **Featured Posts Grid** block to a page or post.

### Manual installation

1. Upload the `featured-posts-grid` folder to `/wp-content/plugins/`.
2. Activate **Featured Posts Grid** from the Plugins screen.
3. Add the **Featured Posts Grid** block inside the block editor.

## Build Instructions

For development, install dependencies:

```bash
npm install
```

Run the development build:

```bash
npm run start
```

Create a production build:

```bash
npm run build
```

The ready-to-install ZIP must include the built `build/` directory.

The ready-to-install ZIP should include:

```txt
featured-posts-grid/
├── featured-posts-grid.php
├── README.md
├── readme.txt
└── build/
```

The ready-to-install ZIP should not include:

```txt
node_modules/
src/
.git/
```

## Usage

1. Add the **Featured Posts Grid** block to a page or post.
2. Search for published posts in the block sidebar.
3. Select up to 6 posts.
4. Reorder selected posts if needed.
5. Choose 2 or 3 desktop columns.
6. Toggle featured images and excerpts as needed.
7. Adjust optional style settings.
8. Save the page and view the frontend.

## Decisions and Trade-offs

### Server-side rendering

The frontend is rendered in PHP because the task requires server-side rendering rather than saved static HTML.

This keeps selected posts up to date when titles, excerpts, permalinks, or featured images change after the block has been saved.

### Storing post IDs

The block stores selected post IDs instead of full post data.

This keeps the saved block content smaller and avoids stale copied post content.

### Custom card spacing and border controls

Native Gutenberg spacing and border supports usually target the block wrapper.

For this block, card padding and borders need to apply to each repeated post card. Because of that, these settings are handled with custom attributes and applied directly to each card in the editor preview and PHP render output.

## Future Improvements / TODO

- Drag-and-drop post reordering in the editor, in addition to the current arrow-based controls.
- Keyboard-accessible reordering controls inside the card preview itself.
- Optional post metadata settings, such as date, author, and categories.
- Optional card link mode, allowing either only the title or the whole card to be clickable.
- More design presets for common layouts.

## Changelog

### 1.0.0

- Initial release.
