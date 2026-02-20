# Shree Ravirandaldham Backend API Documentation

This directory contains the Express.js server and API routes for managing site content, SEO metadata, and translations.

## Setup

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Environment Configuration**:
   Create a `.env` file in this directory with the following variables:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/shree-ravirandaldham
   ```

3. **Start Server**:
   ```bash
   npm start
   ```
   The server will run on `http://localhost:5000`.

## Interactive API Documentation (Swagger)

You can access the interactive API documentation at:
[http://localhost:5000/api-docs](http://localhost:5000/api-docs)

This documentation is automatically generated from JSDoc comments in the `routes/api.js` file and allows you to test the API endpoints directly from the browser.

## API Endpoints

### SEO Metadata

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/seo` | Fetch SEO data for a specific route and locale. |
| `POST` | `/api/admin/seo` | Create or update SEO data (Upsert). |

**GET /api/seo**
- **Query Parameters**:
  - `route` (string): The page route (e.g., `/`, `/ravirandaldham/itihas`).
  - `locale` (string): 'en', 'hi', or 'gu'.
- **Response**: `200 OK` with JSON object or `404 Not Found`.

**POST /api/admin/seo**
- **Body** (JSON):
  ```json
  {
    "route": "/path",
    "locale": "en",
    "title": "Page Title",
    "description": "Meta description",
    "keywords": "k1, k2",
    "ogImage": "url_to_image"
  }
  ```

---

### Translations

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/translations` | Returns all translations in a nested object structure. |
| `GET` | `/api/translations/flat` | Returns all translations as a flat array (for admin tables). |
| `POST` | `/api/admin/translations` | Create or update a translation (Upsert). |
| `DELETE` | `/api/admin/translations/:id` | Delete a translation by ID. |

**GET /api/translations**
- **Response**: Nested JSON object grouped by `section` and `key`.
  ```json
  {
    "HomePage": {
      "title": { "en": "...", "hi": "...", "gu": "..." }
    }
  }
  ```

**POST /api/admin/translations**
- **Body** (JSON):
  ```json
  {
    "section": "Common",
    "key": "save_button",
    "en": "Save",
    "hi": "सहेजें",
    "gu": "સાચવો"
  }
  ```

## Models

- **SeoMeta**: Handles metadata for social sharing and search engines.
- **Translation**: Stores multi-language strings indexed by a section-key unique pair.
