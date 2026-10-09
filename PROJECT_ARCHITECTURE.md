# Project Overview

This is an Astro website starter with reusable sections, a blog powered by Astro Content Collections, Decap CMS for editing posts, image optimization, SEO helpers, dark mode, and Netlify build settings.

Think of the project as layers:

```txt
Browser URL
    v
src/pages/*.astro
    v
src/layouts/*.astro
    v
src/components/**/*.astro
    v
src/data, src/content, src/assets, src/js, src/styles
```

The pages decide what appears on each route. Layouts provide the shared page shell. Components render reusable blocks. Data, content, images, scripts, and styles support those pieces.

# How Astro Works

Astro turns files in `src/pages/` into website routes.

Examples:

```txt
src/pages/index.astro          -> /
src/pages/about.astro          -> /about/
src/pages/reviews.astro        -> /reviews/
src/pages/blog/index.astro     -> /blog/
src/pages/blog/[post].astro    -> /blog/some-post/
```

An `.astro` file usually has two parts:

```astro
---
// JavaScript/TypeScript setup
import BaseLayout from "@layouts/BaseLayout.astro";
---

<!-- HTML/component markup -->
<BaseLayout title="Page Title" description="Meta description">
  Page content goes here
</BaseLayout>
```

The top `---` block prepares imports, data, images, and props. The markup below renders the page.

# Project Structure

The important folders connect like this:

```txt
src/pages/
    creates routes

src/layouts/
    wraps pages with shared structure

src/components/
    reusable visual sections

src/data/
    global site, business, and navigation data

src/content/
    markdown blog posts

src/assets/
    images processed by Astro

public/
    static files copied as-is

src/js/
    browser/helper scripts

src/styles/
    global Less styles
```

The key idea: pages compose layouts and components. Layouts centralize repeated structure. Components receive data through props or import shared data.

# Data Flow

Most pages follow this pattern:

```txt
Page imports data/image/component
    v
Page prepares values
    v
Page passes values as props
    v
Layout/component renders HTML
```

Real example from `src/pages/reviews.astro`:

```astro
import { getImage } from "astro:assets";
import BaseLayout from "@layouts/BaseLayout.astro";
import Banner from "@components/Banner/Banner.astro";
import landingImage from "@assets/images/landing.jpg";

const optimizedImage = await getImage({ src: landingImage, format: "webp" });
```

Then the page passes the optimized image forward:

```astro
<BaseLayout title="Reviews" description="Meta description for the page" heroImage={optimizedImage}>
  <Banner title="Reviews" image={optimizedImage} />
</BaseLayout>
```

Flow:

```txt
src/assets/images/landing.jpg
    v getImage()
optimizedImage
    v
BaseLayout heroImage prop
    v
Meta social image + preload

optimizedImage
    v
Banner image prop
    v
Picture component
```

# Layout System

`src/layouts/BaseLayout.astro` is the main layout for normal pages.

It receives these props:

```astro
interface Props {
  title: string;
  description: string;
  heroImage?: HeroImage;
}
```

It centralizes the repeated page structure:

```txt
BaseLayout.astro
    +-- <head>
    |   +-- ClientRouter
    |   +-- Meta
    |   +-- Font
    |   +-- optional hero image preload
    |   +-- nav.js
    +-- <body>
        +-- DynamicHeader
        +-- <main><slot /></main>
        +-- Footer
```

The `<slot />` is where the page content appears.

Real flow from `src/pages/about.astro`:

```txt
about.astro
    v
BaseLayout.astro
    v
DynamicHeader
    v
Banner + SideBySide + FAQ + CTA
    v
Footer
```

Blog posts use `src/layouts/BlogPostLayout.astro`, but that layout also uses `BaseLayout` inside it:

```txt
blog/[post].astro
    v
BlogPostLayout.astro
    v
BaseLayout.astro
    v
article content + sidebar + CTA
```

# Component System

Components are reusable pieces of UI. This project uses a component-per-folder pattern:

```txt
src/components/Banner/Banner.astro
src/components/Hero/Hero.astro
src/components/Header/DynamicHeader.astro
src/components/CTA/CTASimple.astro
```

Components receive props through `Astro.props`.

Real example from `src/components/Banner/Banner.astro`:

```astro
interface Props {
  title: string;
  image: GetImageResult;
}

const { title, image } = Astro.props;
```

The page sends values:

```astro
<Banner title="Reviews" image={optimizedImage} />
```

The component uses them:

```astro
<h1 id="home-h">{title}</h1>
<Picture src={image.src} width={image.attributes.width} height={image.attributes.height} />
```

Flow:

```txt
reviews.astro
    v passes title + image
Banner.astro
    v reads Astro.props
HTML + Picture
```

# Reusing Components

The same component can appear on many pages.

Examples:

```txt
Banner.astro
    used by about.astro
    used by contact.astro
    used by projects.astro
    used by reviews.astro
    used by blog/index.astro

CTASimple.astro
    used by index.astro
    used by about.astro
    used by projects.astro
    used by reviews.astro
    used by blog pages
```

This means one component file controls repeated design. If you edit `CTASimple.astro`, every page using it changes.

# Navigation Architecture

Navigation is data-driven. The links live in `src/data/navData.json`.

Example:

```json
{
  "key": "Projetos",
  "url": "/projects/",
  "children": [
    { "key": "Projeto 1", "url": "/projects/project-1/" },
    { "key": "Projeto 2", "url": "/projects/project-2/" }
  ]
}
```

`DynamicHeader.astro` imports that JSON:

```astro
import navData from "@data/navData.json";
```

Then it loops over it:

```astro
navData.map((entry) => (...))
```

Flow:

```txt
src/data/navData.json
    v
DynamicHeader.astro
    v
Navigation links and dropdowns
    v
src/js/nav.js
    v
Mobile menu + dropdown behavior
```

`src/js/utils.js` helps the header mark the current page and generate dropdown IDs:

```txt
isCurrentPage()
getDropdownId()
```

`Footer.astro` also imports `navData.json`, so the same navigation data can feed both header and footer.

# Image Optimization

Astro optimizes images when they are imported from `src/assets/` and used with Astro image tools.

Common tools in this project:

```txt
getImage()
Picture
Image
```

Real homepage flow:

```astro
import heroImage from "@assets/images/hero/hero.jpg";
const optimizedHeroImage = await getImage({ src: heroImage, format: "webp" });
```

Then:

```astro
<Hero image={optimizedHeroImage} />
```

Inside `Hero.astro`:

```astro
<Picture
  src={image.src}
  width={image.attributes.width}
  height={image.attributes.height}
  formats={["avif", "webp"]}
/>
```

Flow:

```txt
src/assets/images/hero/hero.jpg
    v imported by page
getImage()
    v
optimizedHeroImage
    v
Hero image prop
    v
Picture creates optimized image markup
```

`CSPicture.astro` is a custom art-direction component. It accepts separate mobile and desktop images:

```txt
CTAArtDirection.astro
    v passes mobileImgUrl + desktopImgUrl + fallbackImgUrl
CSPicture.astro
    v getImage() creates separate optimized versions
<picture><source media=...><img ...>
```

# public/assets vs src/assets

These folders are different on purpose.

`src/assets/` is for files Astro should process:

```txt
src/assets/images/hero/hero.jpg
src/assets/images/landing.jpg
src/assets/images/blog/placeholder.jpg
```

Use this when you want optimization through `getImage`, `Image`, or `Picture`.

`public/assets/` is for static files copied directly to the final site:

```txt
public/assets/social.jpg
public/assets/favicons/favicon-32x32.png
public/assets/fonts/*.woff2
```

Use this when the file should be available by URL exactly as written:

```txt
/assets/social.jpg
/assets/favicons/favicon-32x32.png
```

Important rule:

```txt
src/assets   -> Astro can optimize
public       -> copied as-is, no Astro image optimization
```

# Blog System

The blog is based on Astro Content Collections.

Posts live here:

```txt
src/content/blog/*.md
```

The collection schema lives in `src/content.config.ts`:

```ts
const blogsCollection = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: "./src/content/blog" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      author: z.string(),
      date: z.date(),
      image: image(),
      imageAlt: z.string(),
      isFeatured: z.boolean().optional().default(false),
    }),
});
```

That schema says every blog post needs title, description, author, date, image, imageAlt, and optional featured status.

Blog index flow:

```txt
src/pages/blog/index.astro
    v getCollection("blog")
all markdown posts
    v sorted by date
BlogRecentArticlesWithSidebar posts={posts}
    v
cards + FeaturedPost sidebar
```

Individual blog post flow:

```txt
src/pages/blog/[post].astro
    v getStaticPaths()
one route per markdown post
    v
BlogPostLayout post={post}
    v
render(post)
    v
article content + TableOfContents + FeaturedPost + CTA
```

`FeaturedPost.astro` also reads the blog collection:

```txt
getCollection("blog")
    v
filter isFeatured === true
    v
sidebar featured links
```

# SEO Architecture

SEO is centralized in `src/components/Meta/Meta.astro`.

Pages pass SEO values into `BaseLayout`:

```astro
<BaseLayout title="Reviews" description="Meta description for the page" heroImage={optimizedImage}>
```

`BaseLayout` passes them into `Meta`:

```astro
<Meta title={title} description={description} heroImage={heroImage}>
```

`Meta.astro` creates:

```txt
title tag
description
canonical URL
Open Graph tags
Twitter card tags
favicons
LocalBusiness JSON-LD
```

Flow:

```txt
page title/description/heroImage
    v
BaseLayout
    v
Meta.astro
    v
HTML <head>
```

`src/data/client.ts` provides global business and site data:

```txt
SITE.title
SITE.description
BUSINESS.name
BUSINESS.phoneFormatted
OG.image
```

Blog posts add another schema through a named slot:

```txt
BlogPostLayout
    v creates BlogPosting schema
<script slot="schema">
    v
BaseLayout
    v
Meta slot name="schema"
```

# Styling System

Global styles are imported once in `BaseLayout.astro`:

```astro
import "@styles/root.less";
import "@styles/dark.less";
```

`root.less` defines global resets, CSS variables, typography, and shared classes like:

```txt
--primary
--secondary
--headerColor
--sectionPadding
.cs-button-solid
.cs-title
.cs-text
```

Most components also contain their own `<style lang="less">` block. That keeps section-specific CSS near the component that uses it.

Flow:

```txt
root.less + dark.less
    v global base styles
component <style lang="less">
    v section-specific styles
final page CSS
```

# Dark Mode

Dark mode is controlled by a class on the body:

```txt
body.dark-mode
```

The logic is split across:

```txt
BaseLayout.astro
    sets initial theme from localStorage or browser preference

DarkModeToggle.astro
    toggles body.dark-mode and saves localStorage theme

src/styles/dark.less
    defines global dark styles

component styles
    define local dark-mode overrides
```

Flow:

```txt
User clicks DarkModeToggle
    v
body.classList.toggle("dark-mode")
    v
localStorage theme = dark/light
    v
dark.less + component dark styles apply
```

`BaseLayout.astro` also listens for `astro:after-swap`, so the theme survives Astro view transitions between pages.

# CMS Integration

The admin route is `src/pages/admin.astro`, which outputs the Decap CMS dashboard page.

It points Decap to:

```html
<link href="/admin/config.yml" type="text/yaml" rel="cms-config-url" />
```

The real CMS config is:

```txt
public/admin/config.yml
```

Important settings:

```txt
backend:
    name: git-gateway
    DecapBridge auth/gateway URLs

media_folder:
    src/assets/images/blog

public_folder:
    @assets/images/blog

collections:
    blog writes to src/content/blog
```

CMS flow:

```txt
/admin/
    v
Decap CMS loads public/admin/config.yml
    v
Editor creates/updates blog markdown
    v
src/content/blog/*.md
    v
uploaded images go to src/assets/images/blog
    v
Astro build reads collection and optimizes images
```

This is why CMS images are stored in `src/assets/images/blog`: blog cover images can be optimized by Astro.

# Build & Deployment

Build commands live in `package.json`:

```json
"dev": "astro dev",
"build": "astro build",
"preview": "astro preview"
```

Netlify settings live in `netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = "dist"
```

Build flow:

```txt
npm run build
    v
astro build
    v
reads src/pages routes
    v
reads src/content blog collection
    v
optimizes src/assets images
    v
copies public files
    v
outputs final site to dist/
```

`astro.config.mjs` adds:

```txt
astro-icon
sitemap
image layout: constrained
Roboto font through Astro Font API
```

The sitemap excludes `/admin`.

# Typical Page Rendering Flow

Example: `/reviews/`

```txt
Browser requests /reviews/
    v
src/pages/reviews.astro
    v
imports landing.jpg from src/assets
    v
getImage() creates optimizedImage
    v
BaseLayout receives title, description, heroImage
    v
BaseLayout renders:
    +-- Meta
    +-- DynamicHeader
    +-- page slot
    +-- Footer
    v
slot renders:
    +-- Banner title="Reviews" image={optimizedImage}
    +-- ReviewsSection
    +-- CTA
    v
final static HTML/CSS/JS
```

Example: `/blog/images-in-markdown-posts/`

```txt
src/content/blog/images-in-markdown-posts.md
    v
content.config.ts validates frontmatter
    v
blog/[post].astro creates static route
    v
BlogPostLayout receives post
    v
render(post) creates Content + headings
    v
BaseLayout adds SEO/header/footer
    v
TableOfContents uses headings
    v
FeaturedPost reads featured posts
    v
final blog post page
```

# Mental Model

Use this as the beginner-friendly map:

```txt
pages = "which route and which sections?"
layouts = "what common shell wraps the page?"
components = "what reusable visual blocks appear?"
props = "what values does the parent send to the child?"
data = "what shared config feeds components?"
content = "what markdown data creates blog pages?"
assets = "what images Astro should process?"
public = "what files should be copied directly?"
js = "what browser behavior runs after the HTML exists?"
styles = "what global and component styles shape the UI?"
```

When adding a new page, usually copy this pattern:

```txt
1. Create src/pages/new-page.astro
2. Import BaseLayout
3. Import the components needed on that page
4. Import and optimize a hero/banner image from src/assets
5. Pass title, description, and heroImage to BaseLayout
6. Pass props into child components like Banner
```

