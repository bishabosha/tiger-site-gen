# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Common Commands

This project uses Scala CLI. Always use `scala <command>` for operations.

### Build and Run
- **Generate docs site**: `scala run . -M example.makeSite`
- **Generate home site**: `scala run . -M example.makeHome` 
- **Watch for changes**: `scala run . -M example.watchSite`
- **Format code**: `scala fmt .`
- **Compile check**: `scala compile .`

### Development Workflow
- Content goes in `_docs/` directory (Markdown files with YAML frontmatter)
- Static assets in `_docs/static/` 
- Output generated to `out/` directory

## Architecture Overview

This is a Scala 3 static site generator with a sophisticated theme-based architecture:

### Core Model (`model/`)
- **Theme**: Abstract base for site themes defining layouts, site structure, and front matter schema
- **Site**: Container for document collections, static assets, and favicon
- **Context**: Runtime context providing access to site data, theme, and extras
- **DocPage**: Represents individual markdown documents with parsed frontmatter and content
- **Layout**: Type for HTML layout functions that transform documents into pages

### Theme System
The codebase supports multiple themes through composition:

- **`breeze/`**: Base theme with article and articles layouts
- **`breezeSite/`**: Extended theme adding talks, projects, and about page layouts
- **`home/`**: Simple homepage theme

Themes define:
- Site structure (which document collections exist)
- FrontMatter schema (required YAML fields)  
- Layout functions for rendering documents
- Extra functionality and assets

### Document Processing Pipeline
1. **Discovery**: Files scanned from source directory
2. **Parsing**: Markdown and HTML files split into YAML frontmatter + content
3. **Templating**: Markdown and HTML preprocessor with escapes via `{{expr}}` syntax
4. **Rendering**: Flexmark processes markdown with extensions (tables, admonitions, anchor links, etc.)
5. **Layout**: Theme layouts generate final HTML
6. **Asset handling**: Static files copied with cache-busting for CSS/JS

### Key Features
- **Smart caching**: Only rebuilds changed files based on MD5 hashes
- **Watch mode**: Automatic rebuilds on file changes
- **Asset hashing**: CSS/JS files get cache-busting hashes
- **Template interpolation**: `{{expr}}` syntax for dynamic content
- **Multi-collection support**: Articles, talks, projects, etc. as separate collections

### IO System (`io/util/`)
- **IOUtil.scala**: Core site generation, caching, file watching
- **Templates.scala**: Template interpolation system for dynamic content
- **Markdown processing**: Flexmark with multiple extensions configured

### Content Structure
- Collections end with 's' (e.g., `articles/`, `talks/`) contain multiple docs
- Individual pages (e.g., `about/`) contain single documents
- Files follow pattern: `001 - title.md` where number controls ordering
- Index files named `index.md` become collection landing pages

### Frontmatter Schema
Different themes expect different frontmatter fields. Core fields include:
- `title`, `layout`, `published`, `description`
- Theme-specific: `avatar`, `links`, `copyright`, `isIndexOnly`, `isInProgress`
