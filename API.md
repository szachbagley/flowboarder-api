# Flowboarder API Documentation

Complete REST API for AI-powered storyboarding.

## Base URL

```
http://localhost:3000/api
```

## Authentication

Currently no authentication required. Will be added in future versions.

---

## Projects

Manage storyboarding projects.

### Get All Projects

```http
GET /api/projects
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "user_id": 1,
      "project_title": "My Sci-Fi Short",
      "art_style": "Cyberpunk",
      "description": "A dystopian future story",
      "created_at": "2024-12-28T...",
      "updated_at": "2024-12-28T..."
    }
  ]
}
```

### Get Projects by User ID

```http
GET /api/projects/user/:userId
```

### Get Project by ID

```http
GET /api/projects/:id
```

### Create Project

```http
POST /api/projects
Content-Type: application/json

{
  "user_id": 1,
  "project_title": "My New Project",
  "art_style": "Film Noir",
  "description": "Optional description"
}
```

**Required:** `user_id`, `project_title`
**Optional:** `art_style`, `description`

### Update Project

```http
PUT /api/projects/:id
Content-Type: application/json

{
  "project_title": "Updated Title",
  "art_style": "Updated Style"
}
```

### Delete Project

```http
DELETE /api/projects/:id
```

---

## Characters

Manage characters within projects.

### Get All Characters

```http
GET /api/characters
```

### Get Characters by Project ID

```http
GET /api/characters/project/:projectId
```

### Get Character by ID

```http
GET /api/characters/:id
```

### Create Character

```http
POST /api/characters
Content-Type: application/json

{
  "project_id": 1,
  "name": "Detective Kane",
  "description": "Hardened detective",
  "default_variant": "Casual",
  "variant": "Action",
  "reference_img": "https://example.com/image.jpg"
}
```

**Required:** `project_id`, `name`
**Optional:** `description`, `default_variant`, `variant`, `reference_img`

### Update Character

```http
PUT /api/characters/:id
```

### Delete Character

```http
DELETE /api/characters/:id
```

---

## Character Variants

Manage different versions/variants of characters.

### Get All Character Variants

```http
GET /api/character-variants
```

### Get Variants by Character ID

```http
GET /api/character-variants/character/:characterId
```

### Get Variant by ID

```http
GET /api/character-variants/:id
```

### Create Character Variant

```http
POST /api/character-variants
Content-Type: application/json

{
  "character_id": 1,
  "name": "Action Gear",
  "description": "Combat vest, weapons drawn",
  "reference_img": "https://example.com/action.jpg"
}
```

**Required:** `character_id`, `name`
**Optional:** `description`, `reference_img`

### Update Character Variant

```http
PUT /api/character-variants/:id
```

### Delete Character Variant

```http
DELETE /api/character-variants/:id
```

---

## Settings

Manage environments/settings for panels.

### Get All Settings

```http
GET /api/settings
```

### Get Settings by Project ID

```http
GET /api/settings/project/:projectId
```

### Get Setting by ID

```http
GET /api/settings/:id
```

### Create Setting

```http
POST /api/settings
Content-Type: application/json

{
  "project_id": 1,
  "name": "Neon Street",
  "description": "Rain-slicked street with neon signs",
  "reference_img": "https://example.com/street.jpg"
}
```

**Required:** `project_id`, `name`
**Optional:** `description`, `reference_img`

### Update Setting

```http
PUT /api/settings/:id
```

### Delete Setting

```http
DELETE /api/settings/:id
```

---

## Panels

Manage storyboard panels with AI-generated images.

### Get All Panels

```http
GET /api/panels
```

### Get Panels by Project ID

```http
GET /api/panels/project/:projectId
```

### Get Panel by ID

```http
GET /api/panels/:id
```

### Get Panel with Characters

Returns panel with all associated character variants.

```http
GET /api/panels/:id/characters
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "project_id": 1,
    "setting_id": 1,
    "shot_type": "Wide Shot",
    "aspect_ratio": "16:9",
    "description": "Detective walks down street",
    "image_link": "https://ai-generated.com/image.jpg",
    "characters": [
      {
        "id": 1,
        "character_id": 1,
        "name": "Action Gear",
        "character_name": "Detective Kane"
      }
    ]
  }
}
```

### Create Panel

```http
POST /api/panels
Content-Type: application/json

{
  "project_id": 1,
  "setting_id": 1,
  "shot_type": "Close-up",
  "aspect_ratio": "16:9",
  "description": "Detective's determined face",
  "reference_img": "https://example.com/ref.jpg"
}
```

**Required:** `project_id`
**Optional:** `setting_id`, `image_link`, `shot_type`, `aspect_ratio`, `description`, `reference_img`

### Update Panel

```http
PUT /api/panels/:id
Content-Type: application/json

{
  "image_link": "https://ai-generated.com/new-image.jpg",
  "shot_type": "Medium Shot"
}
```

### Delete Panel

```http
DELETE /api/panels/:id
```

### Add Character to Panel

```http
POST /api/panels/:id/characters
Content-Type: application/json

{
  "character_variant_id": 1
}
```

**Response:** `201 Created` or `409 Conflict` if character already in panel.

### Remove Character from Panel

```http
DELETE /api/panels/:id/characters/:variantId
```

---

## Users

Manage users (existing from initial setup).

### Get All Users

```http
GET /api/users
```

### Get User by ID

```http
GET /api/users/:id
```

### Search Users

```http
GET /api/users/search?q=john
```

### Get User Stats

```http
GET /api/users/stats
```

### Get Recent Users

```http
GET /api/users/recent?limit=10
```

### Create User

```http
POST /api/users
Content-Type: application/json

{
  "email": "user@example.com",
  "name": "John Doe"
}
```

### Update User

```http
PUT /api/users/:id
```

### Delete User

```http
DELETE /api/users/:id
```

---

## Error Responses

All endpoints return consistent error format:

```json
{
  "success": false,
  "error": "Error message describing what went wrong"
}
```

**Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `404` - Not Found
- `409` - Conflict (duplicate)
- `500` - Internal Server Error

---

## Complete Workflow Example

### 1. Create a User

```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"email":"director@example.com","name":"Film Director"}'
```

### 2. Create a Project

```bash
curl -X POST http://localhost:3000/api/projects \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": 1,
    "project_title": "Cyberpunk Short",
    "art_style": "Dark, neon-lit cyberpunk"
  }'
```

### 3. Create a Character

```bash
curl -X POST http://localhost:3000/api/characters \
  -H "Content-Type: application/json" \
  -d '{
    "project_id": 1,
    "name": "Detective Kane",
    "description": "Hardened detective in cyberpunk city"
  }'
```

### 4. Create Character Variant

```bash
curl -X POST http://localhost:3000/api/character-variants \
  -H "Content-Type: application/json" \
  -d '{
    "character_id": 1,
    "name": "Action Gear",
    "description": "Combat vest, weapons ready"
  }'
```

### 5. Create a Setting

```bash
curl -X POST http://localhost:3000/api/settings \
  -H "Content-Type: application/json" \
  -d '{
    "project_id": 1,
    "name": "Neon Street",
    "description": "Rain-slicked alley with neon signs"
  }'
```

### 6. Create a Panel

```bash
curl -X POST http://localhost:3000/api/panels \
  -H "Content-Type: application/json" \
  -d '{
    "project_id": 1,
    "setting_id": 1,
    "shot_type": "Wide Shot",
    "aspect_ratio": "16:9",
    "description": "Detective walks through neon alley"
  }'
```

### 7. Add Character to Panel

```bash
curl -X POST http://localhost:3000/api/panels/1/characters \
  -H "Content-Type: application/json" \
  -d '{"character_variant_id": 1}'
```

### 8. Get Panel with All Data

```bash
curl http://localhost:3000/api/panels/1/characters
```

---

## Data Relationships

```
User
 └─> Projects
      ├─> Characters
      │    └─> Character Variants
      │         └─> Panel Characters (junction)
      ├─> Settings
      │    └─> Panels
      └─> Panels
           └─> Panel Characters (junction)
```

---

## Next Steps

- Add authentication/authorization
- Add image upload for reference images
- Integrate AI image generation API
- Add pagination for list endpoints
- Add filtering and sorting options
- Add batch operations
