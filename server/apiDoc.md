# Weather Brew Hive

## Endpoints:

List of available endpoints:

- `POST` /login
- `POST` /register
- `POST` /login/oauth

- `POST` /donation

- `GET` /posts
- `POST` /posts
- `PUT` /posts/:id
- `DELETE` /posts/:id
- `GET` /posts/:id

- `GET` /types
- `POST` /types
- `PUT` /types/:id
- `DELETE` /types/:id

- `GET` /weathers

## 1. `POST` /login

### Request:

- body

```json
{
  "email": "string",
  "password": "string"
}
```

### response:

_response (200 - ok)_

```json
{
  "token": "String",
  "role": "String"
}
```

_response (400 - Bad request)_

```json
{
    "message": "email cannot be empty"
}
OR
{
    "message": "password cannot be empty"
}
OR
{
    "message": "email format is wrong"
}
```

_response (401 - Unauthorized)_

```json
{
    "message": "Email does not exist in the database please register first or use gmail login"
}
OR
{
   "message": "error invalid email or password"
}
```

## 2. `POST` /register

### Request:

- body

```json
{
  "email": "string",
  "password": "string"
}
```

### response:

_response (201 - Created)_

```json
"id": 4,
"email": "user12@example.com",
"oauth": false,
"role": "Users",
"createdAt": "2024-04-16T03:24:08.918Z",
"updatedAt": "2024-04-16T03:24:08.918Z"
```

_response (400 - Bad request)_

```json
{
  "message": "email format is wrong"
}
OR
{
    "message": "email cannot be empty"
}
OR
{
    "message": "password cannot be empty"
}
OR
{
    "message": "Email already exist in the database"
}
```

## 3. `POST` /login/oauth

### Request:

- header

```json
{
  "google_token": "string"
}
```

### response:

_response (200 - ok)_

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTMsImlhdCI6MTcxMjg5MTYzMn0.ea3sZYoulak6j15NDaZPHdRlZanIYjgJdUQRxU0dw2A",
  "role": "Users"
}
```

## 4. `POST` /donation

### Request:

- body

```json
{
  "name": "string",
  "donation": "integer"
}
```

- headers:

```json
{
  "Authorization": "Bearer <token>"
}
```

### Response:

_response (200 - ok)_

```json
{
  "link": "https://app.sandbox.midtrans.com/snap/v4/redirection/f8d2e356-6027-4a45-ba94-74bf6e55c9dc",
  "token": "f8d2e356-6027-4a45-ba94-74bf6e55c9dc"
}
```

_response (400 - Bad request)_

```json
{
  "message": "Please input any donation amount each value will be really appreaciated by us"
}
```

_response (401 - Unauthorized)_

```json
{
  "message": "Error authentication"
}
```

## 5. `GET` /posts

### Description:

- get all posts data in the server

### Request:

- headers:

```json
{
  "Authorization": "Bearer <token>"
}
```

- params:

```json
{
  "filter": "integer"
}
OR
{
  "sort": "+" //ASCENDING
}
OR
{
  "sort": "-" //DESCENDING
}
OR
{
  "search": "string"
}
OR
{
  "page[size]": "integer"
}
OR
{
  "page[number]": "integer"
}
```

### Response:

_response (200 - ok)_

```json
{
  "page": "1",
  "data": [
    {
      "id": 5,
      "title": "Hurricane Alert: Category 3 Hurricane Approaching",
      "shortDescription": "Category 3 hurricane expected to make landfall...",
      "longDescription": "A powerful Category 3 hurricane is forecasted to strike...",
      "imgUrl": "https://example.com/hurricane-alert.jpg",
      "typeId": 4,
      "userId": 2,
      "createdAt": "2024-04-07T10:49:44.342Z",
      "updatedAt": "2024-04-07T10:49:44.342Z"
    },
    {
      "id": 4,
      "title": "Snowstorm Warning: Prepare for Heavy Snow",
      "shortDescription": "Snowstorm warning for the next 48 hours.",
      "longDescription": "A significant snowstorm is expected to impact the area...",
      "imgUrl": "https://example.com/snowstorm-warning.jpg",
      "typeId": 3,
      "userId": 2,
      "createdAt": "2024-04-07T10:49:44.342Z",
      "updatedAt": "2024-04-07T10:49:44.342Z"
    },
    {
      "id": 2,
      "title": "Upcoming Heatwave Alert",
      "shortDescription": "High temperatures forecasted for the next week.",
      "longDescription": "A prolonged period of hot and dry weather is expected to...",
      "imgUrl": "https://example.com/heatwave-image.jpg",
      "typeId": 3,
      "userId": 2,
      "createdAt": "2024-04-07T10:49:44.342Z",
      "updatedAt": "2024-04-07T10:49:44.342Z"
    },
    {
      "id": 1,
      "title": "Example Title update",
      "shortDescription": "Short description of the post",
      "longDescription": "Longer description of the post where all of this data is about weathering you about into the future problems",
      "imgUrl": "https://t4.ftcdn.net/jpg/02/66/38/15/240_F_266381525_alVrbw15u5EjhIpoqqa1eI5ghSf7hpz7.jpg",
      "typeId": 1,
      "userId": 2,
      "createdAt": "2024-04-07T10:49:44.342Z",
      "updatedAt": "2024-04-10T15:18:16.311Z"
    },
    {
      "id": 6,
      "title": "Example Title",
      "shortDescription": "Short description of the post",
      "longDescription": "Longer description of the post where all of this data is about weathering you about into the future problems",
      "imgUrl": "https://example.com/image.jpg",
      "typeId": 1,
      "userId": 13,
      "createdAt": "2024-04-08T02:41:18.632Z",
      "updatedAt": "2024-04-08T02:41:18.632Z"
    },
    {
      "id": 7,
      "title": "Example Title",
      "shortDescription": "Short description of the post",
      "longDescription": "Longer description of the post where all of this data is about weathering you about into the future problems",
      "imgUrl": "https://t4.ftcdn.net/jpg/02/66/38/15/240_F_266381525_alVrbw15u5EjhIpoqqa1eI5ghSf7hpz7.jpg",
      "typeId": 1,
      "userId": 13,
      "createdAt": "2024-04-08T02:42:11.228Z",
      "updatedAt": "2024-04-08T02:42:11.228Z"
    },
    {
      "id": 8,
      "title": "Example Title",
      "shortDescription": "Short description of the post",
      "longDescription": "Longer description of the post where all of this data is about weathering you about into the future problems",
      "imgUrl": "https://t4.ftcdn.net/jpg/02/66/38/15/240_F_266381525_alVrbw15u5EjhIpoqqa1eI5ghSf7hpz7.jpg",
      "typeId": 1,
      "userId": 13,
      "createdAt": "2024-04-08T03:02:04.965Z",
      "updatedAt": "2024-04-08T03:02:04.965Z"
    },
    {
      "id": 9,
      "title": "Example Title",
      "shortDescription": "Short description of the post",
      "longDescription": "Longer description of the post where all of this data is about weathering you about into the future problems",
      "imgUrl": "https://t4.ftcdn.net/jpg/02/66/38/15/240_F_266381525_alVrbw15u5EjhIpoqqa1eI5ghSf7hpz7.jpg",
      "typeId": 1,
      "userId": 13,
      "createdAt": "2024-04-08T03:02:23.380Z",
      "updatedAt": "2024-04-08T03:02:23.380Z"
    },
    {
      "id": 10,
      "title": "Example Title",
      "shortDescription": "Short description of the post",
      "longDescription": "Longer description of the post where all of this data is about weathering you about into the future problems",
      "imgUrl": "https://t4.ftcdn.net/jpg/02/66/38/15/240_F_266381525_alVrbw15u5EjhIpoqqa1eI5ghSf7hpz7.jpg",
      "typeId": 1,
      "userId": 13,
      "createdAt": "2024-04-08T03:03:30.780Z",
      "updatedAt": "2024-04-08T03:03:30.780Z"
    },
    {
      "id": 11,
      "title": "Example Title",
      "shortDescription": "Short description of the post",
      "longDescription": "Longer description of the post where all of this data is about weathering you about into the future problems",
      "imgUrl": "https://t4.ftcdn.net/jpg/02/66/38/15/240_F_266381525_alVrbw15u5EjhIpoqqa1eI5ghSf7hpz7.jpg",
      "typeId": 1,
      "userId": 13,
      "createdAt": "2024-04-08T03:04:03.718Z",
      "updatedAt": "2024-04-08T03:04:03.718Z"
    }
  ],
  "totalData": 25,
  "totalPage": 5,
  "dataPerPage": 5
}
```

_response (401 - Unauthorized)_

```json
{
  "message": "Error authentication"
}
```

## 6. `POST` /posts

### Request:

- body:

```json
{
  "title": "string",
  "shortDescription": "string",
  "longDescription": "string",
  "imgUrl": "string",
  "typeId": "integer
}
```

- headers:

```json
{
  "Authorization": "Bearer <token>"
}
```

### Response:

_response (201 - Created)_

```json
{
  "id": "7",
  "title": "Example Title New Post",
  "shortDescription": "Short description of the post",
  "longDescription": "Longer description of the post where all of this data is about weathering you about into the future problems",
  "imgUrl": "https://t4.ftcdn.net/jpg/02/66/38/15/240_F_266381525_alVrbw15u5EjhIpoqqa1eI5ghSf7hpz7.jpg",
  "typeId": "1",
  "userId": "2",
  "createdAt": "2024-04-16T03:24:08.918Z",
  "updatedAt": "2024-04-16T03:24:08.918Z",
  "User": {
    "email": "admin@example.com"
  },
  "Type": {
    "name": "Daily forecast"
  }
}
```

_response (400 - Bad request)_

```json
{
  "message": "Title is required"
}
OR
{
  "message" : "Short description is required"
}
OR
{
  "message" : "maximal character is 30 words for short description"
}
OR
{
  "message" : "Long description is required"
}
OR
{
  "message" : "minimal character in long description is 10 words"
}
OR
{
  "message" : "Image URL is required"
}
OR
{
  "message" : "Post type is required"
}
```

_response (401 - Unauthorized)_

```json
{
  "message": "Error authentication"
}
```

_response (403 - Forbidden)_

```json
{
  "message": "Forbidden"
}
```

## 7. `PUT` /posts/:id

### Request:

- body:

```json
{
  "title": "string",
  "shortDescription": "string",
  "longDescription": "string",
  "imgUrl": "string",
  "typeId": "integer",
  "userId": "integer"
}
```

- headers:

```json
{
  "Authorization": "Bearer <token>"
}
```

- params:

```json
{
  "id": "integer"
}
```

### Response:

_response (200 - ok)_

```json
{
  "id": "7",
  "title": "Example Title New Post Update",
  "shortDescription": "Short description of the post",
  "longDescription": "Longer description of the post where all of this data is about weathering you about into the future problems",
  "imgUrl": "https://t4.ftcdn.net/jpg/02/66/38/15/240_F_266381525_alVrbw15u5EjhIpoqqa1eI5ghSf7hpz7.jpg",
  "typeId": "1",
  "userId": "2",
  "createdAt": "2024-04-16T03:24:08.918Z",
  "updatedAt": "2024-04-16T03:24:08.918Z"
}
```

_response (400 - Bad request)_

```json
{
  "message": "Title is required"
}
OR
{
  "message" : "Short description is required"
}
OR
{
  "message" : "maximal character is 30 words for short description"
}
OR
{
  "message" : "Long description is required"
}
OR
{
  "message" : "minimal character in long description is 10 words"
}
OR
{
  "message" : "Image URL is required"
}
OR
{
  "message" : "Post type is required"
}
```

_response (401 - Unauthorized)_

```json
{
  "message": "Error authentication"
}
```

_response (403 - Forbidden)_

```json
{
  "message": "Forbidden"
}
```

_response (404 - Not found)_

```json
{
  "message": "Data not found"
}
```

## 8. `DELETE` /posts/:id

### Request:

- headers:

```json
{
  "Authorization": "Bearer <token>"
}
```

- params:

```json
{
  "id": "integer"
}
```

### Response:

_response (200 - ok)_

```json
{
  "message": "<title> has been successfully being deleted"
}
```

_response (401 - Unauthorized)_

```json
{
  "message": "Error authentication"
}
```

_response (403 - Forbidden)_

```json
{
  "message": "Forbidden"
}
```

_response (404 - Not found)_

```json
{
  "message": "Data not found"
}
```

## 9. `GET` /posts/:id

### Request:

- headers:

```json
{
  "Authorization": "Bearer <token>"
}
```

- params:

```json
{
  "id": "integer"
}
```

### Response:

_response (200 - Ok)_

```json
{
  "id": 1,
  "title": "Example Title update",
  "shortDescription": "Short description of the post",
  "longDescription": "Longer description of the post where all of this data is about weathering you about into the future problems",
  "imgUrl": "https://t4.ftcdn.net/jpg/02/66/38/15/240_F_266381525_alVrbw15u5EjhIpoqqa1eI5ghSf7hpz7.jpg",
  "typeId": 1,
  "userId": 2,
  "createdAt": "2024-04-16T10:49:44.342Z",
  "updatedAt": "2024-04-16T15:18:16.311Z"
}
```

_response (401 - Unauthorized)_

```json
{
  "message": "Error authentication"
}
```

_response (403 - Forbidden)_

```json
{
  "message": "Forbidden"
}
```

_response (404 - Not found)_

```json
{
  "message": "Data not found"
}
```

## 10. `GET` /types

- headers:

```json
{
  "Authorization": "Bearer <token>"
}
```

### Response:

_response (200 - Ok)_

```json
[
  {
    "id": 1,
    "name": "Daily forecast",
    "createdAt": "2024-04-07T10:49:44.327Z",
    "updatedAt": "2024-04-08T06:53:59.323Z"
  },
  {
    "id": 2,
    "name": "Weekly Forecast",
    "createdAt": "2024-04-07T10:49:44.327Z",
    "updatedAt": "2024-04-07T10:49:44.327Z"
  },
  {
    "id": 3,
    "name": "Emergency Forecast",
    "createdAt": "2024-04-07T10:49:44.327Z",
    "updatedAt": "2024-04-07T10:49:44.327Z"
  },
  {
    "id": 4,
    "name": "Disaster Forecast",
    "createdAt": "2024-04-07T10:49:44.327Z",
    "updatedAt": "2024-04-07T10:49:44.327Z"
  },
  {
    "id": 5,
    "name": "Special Event Forecast",
    "createdAt": "2024-04-07T10:49:44.327Z",
    "updatedAt": "2024-04-07T10:49:44.327Z"
  },
  {
    "id": 6,
    "name": "Testing Broadcast",
    "createdAt": "2024-04-08T06:51:09.624Z",
    "updatedAt": "2024-04-08T06:51:09.624Z"
  }
]
```

_response (401 - Unauthorized)_

```json
{
  "message": "Error authentication"
}
```

_response (403 - Forbidden)_

```json
{
  "message": "Forbidden"
}
```

## 11. `POST` /types

### Request:

- body:

```json
{
  "name": "string"
}
```

- headers:

```json
{
  "Authorization": "Bearer <token>"
}
```

### Response:

_response (201 - Created)_

```json
{
  "id": 8,
  "name": "Testing Broadcast4",
  "createdAt": "2024-04-16T04:08:04.804Z",
  "updatedAt": "2024-04-16T04:08:04.804Z"
}
```

_response (400 - Bad request)_

```json
{
  "message": "name is required"
}
```

_response (401 - Unauthorized)_

```json
{
  "message": "Error authentication"
}
```

_response (403 - Forbidden)_

```json
{
  "message": "Forbidden"
}
```

## 12. `PUT` /types/:id

### Request:

- body:

```json
{
  "name": "string"
}
```

- headers:

```json
{
  "Authorization": "Bearer <token>"
}
```

- params:

```json
{
  "id": "integer"
}
```

### Response:

_response (200 - Ok)_

```json
{
  "id": 8,
  "name": "Testing Broadcast4 update",
  "createdAt": "2024-04-16T04:08:04.804Z",
  "updatedAt": "2024-04-16T04:09:04.804Z"
}
```

_response (400 - Bad request)_

```json
{
  "message": "name is required"
}
```

_response (401 - Unauthorized)_

```json
{
  "message": "Error authentication"
}
```

_response (403 - Forbidden)_

```json
{
  "message": "Forbidden"
}
```

_response (404 - Not found)_

```json
{
  "message": "Data not found"
}
```

## 13. `DELETE` /types/:id

### Request:

- headers:

```json
{
  "Authorization": "Bearer <token>"
}
```

- params:

```json
{
  "id": "integer"
}
```

### Response:

_response (200 - Ok)_

```json
{
  "message": "<type name> has been successfully deleted"
}
```

_response (401 - Unauthorized)_

```json
{
  "message": "Error authentication"
}
```

_response (403 - Forbidden)_

```json
{
  "message": "Forbidden"
}
```

_response (404 - Not found)_

```json
{
  "message": "Data not found"
}
```

## 14. `GET` /weathers

### Request:

- headers:

```json
{
  "Authorization": "Bearer <token>"
}
```

- params:

```json
{
  "location": "string"
}
```

### Response:

_response (200 - Ok)_

```json
{
  "city": "Jakarta",
  "weather": [
    {
      "dateTime": "Friday 12 April 2024 at 06.00",
      "weather": {
        "description": "light rain",
        "icon": "10d"
      },
      "humidity": 74,
      "windSpeed": 0.19
    },
    {
      "dateTime": "Friday 12 April 2024 at 09.00",
      "weather": {
        "description": "light rain",
        "icon": "10d"
      },
      "humidity": 72,
      "windSpeed": 1.83
    },
    {
      "dateTime": "Friday 12 April 2024 at 12.00",
      "weather": {
        "description": "light rain",
        "icon": "10n"
      },
      "humidity": 75,
      "windSpeed": 1.85
    },
    {
      "dateTime": "Friday 12 April 2024 at 15.00",
      "weather": {
        "description": "light rain",
        "icon": "10n"
      },
      "humidity": 79,
      "windSpeed": 0.46
    },
    {
      "dateTime": "Friday 12 April 2024 at 18.00",
      "weather": {
        "description": "light rain",
        "icon": "10n"
      },
      "humidity": 81,
      "windSpeed": 1.19
    },
    {
      "dateTime": "Friday 12 April 2024 at 21.00",
      "weather": {
        "description": "light rain",
        "icon": "10n"
      },
      "humidity": 83,
      "windSpeed": 1
    },
    {
      "dateTime": "Saturday 13 April 2024 at 00.00",
      "weather": {
        "description": "light rain",
        "icon": "10d"
      },
      "humidity": 82,
      "windSpeed": 0.32
    },
    {
      "dateTime": "Saturday 13 April 2024 at 03.00",
      "weather": {
        "description": "light rain",
        "icon": "10d"
      },
      "humidity": 70,
      "windSpeed": 1.62
    },
    {
      "dateTime": "Saturday 13 April 2024 at 06.00",
      "weather": {
        "description": "light rain",
        "icon": "10d"
      },
      "humidity": 66,
      "windSpeed": 3.37
    }
  ]
}
```

_response (401 - Unauthorized)_

```json
{
  "message": "Error authentication"
}
```

## Global Error

_Response (500 - Internal Server Error)_

```JSON
{
    "message": "Internal server error"
}
```
