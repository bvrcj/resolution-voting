# resolution-voting
Resolution voting application using Spring Boot and MySQL.

## Run
- Configure database access in `src/main/resources/application.yml`
- Build with `gradle clean build`
- Start the app with `gradle bootRun`

## Frontend (Next.js + Tailwind)
- App location: `frontend/`
- Install deps: `npm install` (inside `frontend/`)
- Run dev server: `npm run dev` (inside `frontend/`)
- Default API base URL: `http://localhost:8080` (editable in UI)
- Local temple info API: `http://localhost:3000/api/temple`

## Gradle tasks
- `gradle tasks` list available tasks
- `gradle bootRun` run the Spring Boot app
- `gradle bootTestRun` run the app with test runtime classpath
- `gradle test` run tests
- `gradle jacocoTestReport` generate test coverage report (HTML/XML)
- `gradle build` build and test
- `gradle clean` clean build outputs

## API overview
- `POST /api/rooms` create room
- `GET /api/rooms` list rooms
- `GET /api/rooms/{id}` get room
- `PUT /api/rooms/{id}` update room
- `DELETE /api/rooms/{id}` delete room
- `POST /api/users` create user
- `GET /api/users` list users
- `POST /api/resolutions` create resolution
- `GET /api/resolutions` list resolutions
- `POST /api/resolutions/{id}/publish` publish resolution
- `POST /api/resolutions/{id}/start-voting` start direct voting
- `POST /api/resolutions/{id}/end-direct-voting` end direct voting
- `POST /api/resolutions/{id}/start-proxy-voting` start proxy voting (alternative to end direct voting)
- `POST /api/resolutions/{id}/votes` cast vote with latitude/longitude (direct during VOTING, proxy during PROXY_VOTING)
- `POST /api/resolutions/{id}/end-proxy-voting` end proxy voting and close voting
- `POST /api/resolutions/{id}/publish-results` publish results
- `GET /api/resolutions/{id}/results` view results

## End-to-end flow with request/response
Base URL: `http://localhost:8080`

### 1) Create room
POST `/api/rooms`

Request:
```json
{
  "name": "Board Room A",
  "latitude": 12.9716,
  "longitude": 77.5946
}
```

Response: 201 Created
```json
{
  "id": 1,
  "name": "Board Room A",
  "latitude": 12.9716,
  "longitude": 77.5946
}
```

### 2) Create users
POST `/api/users`

Request (admin):
```json
{
  "name": "Siva Vishnu",
  "email": "SivaVishnu@lsvt.com",
  "role": "ADMIN"
}
```

Response: 201 Created
```json
{
  "id": 1,
  "name": "Siva Vishnu",
  "email": "SivaVishnu@lsvt.com",
  "role": "ADMIN"
}
```

Request (user):
```json
{
  "name": "Alan Turing",
  "email": "alan@example.com",
  "role": "USER"
}
```

Response: 201 Created
```json
{
  "id": 2,
  "name": "Alan Turing",
  "email": "alan@example.com",
  "role": "USER"
}
```

### 3) Create resolution
POST `/api/resolutions`

Request:
```json
{
  "title": "Adopt new voting policy",
  "description": "Adopt the updated voting policy for the board.",
  "roomId": 1
}
```

Response: 201 Created
```json
{
  "id": 10,
  "title": "Adopt new voting policy",
  "description": "Adopt the updated voting policy for the board.",
  "room": {
    "id": 1,
    "name": "Board Room A",
    "latitude": 12.9716,
    "longitude": 77.5946
  },
  "status": "DRAFT",
  "createdAt": "2026-01-24T01:10:00Z",
  "updatedAt": "2026-01-24T01:10:00Z",
  "votingStartedAt": null,
  "votingEndedAt": null
}
```

### 4) Publish resolution
POST `/api/resolutions/{id}/publish`

Response: 200 OK
```json
{
  "id": 10,
  "title": "Adopt new voting policy",
  "description": "Adopt the updated voting policy for the board.",
  "room": {
    "id": 1,
    "name": "Board Room A",
    "latitude": 12.9716,
    "longitude": 77.5946
  },
  "status": "PUBLISHED",
  "createdAt": "2026-01-24T01:10:00Z",
  "updatedAt": "2026-01-24T01:13:00Z",
  "votingStartedAt": null,
  "votingEndedAt": null
}
```

### 5) Start direct voting
POST `/api/resolutions/{id}/start-voting`

Response: 200 OK
```json
{
  "id": 10,
  "title": "Adopt new voting policy",
  "description": "Adopt the updated voting policy for the board.",
  "room": {
    "id": 1,
    "name": "Board Room A",
    "latitude": 12.9716,
    "longitude": 77.5946
  },
  "status": "VOTING",
  "createdAt": "2026-01-24T01:10:00Z",
  "updatedAt": "2026-01-24T01:14:00Z",
  "votingStartedAt": "2026-01-24T01:14:00Z",
  "votingEndedAt": null
}
```

### 6) Cast direct vote
POST `/api/resolutions/{id}/votes`

Request:
```json
{
  "voterId": 2,
  "proxyForUserId": null,
  "proxyForName": null,
  "choice": "FOR",
  "latitude": 12.9716,
  "longitude": 77.5946
}
```

Response: 201 Created

### 7) End direct voting (move to proxy voting)
POST `/api/resolutions/{id}/end-direct-voting`

Response: 200 OK
```json
{
  "id": 10,
  "title": "Adopt new voting policy",
  "description": "Adopt the updated voting policy for the board.",
  "room": {
    "id": 1,
    "name": "Board Room A",
    "latitude": 12.9716,
    "longitude": 77.5946
  },
  "status": "PROXY_VOTING",
  "createdAt": "2026-01-24T01:10:00Z",
  "updatedAt": "2026-01-24T01:15:00Z",
  "votingStartedAt": "2026-01-24T01:14:00Z",
  "votingEndedAt": null
}
```

### 8) Cast proxy vote
POST `/api/resolutions/{id}/votes`

Request:
```json
{
  "voterId": 1,
  "proxyForUserId": 2,
  "proxyForName": "Alan Turing",
  "choice": "AGAINST",
  "latitude": 12.9716,
  "longitude": 77.5946
}
```

Response: 201 Created

### 9) End proxy voting
POST `/api/resolutions/{id}/end-proxy-voting`

Response: 200 OK
```json
{
  "resolutionId": 10,
  "resolutionTitle": "Adopt new voting policy",
  "resolutionDescription": "Adopt the updated voting policy for the board.",
  "room": {
    "id": 1,
    "name": "Board Room A",
    "latitude": 12.9716,
    "longitude": 77.5946
  },
  "status": "CLOSED",
  "totalVotes": 2,
  "forCount": 1,
  "againstCount": 1,
  "abstainCount": 0,
  "directVotes": {
    "total": 1,
    "forCount": 1,
    "againstCount": 0,
    "abstainCount": 0
  },
  "proxyVotes": {
    "total": 1,
    "forCount": 0,
    "againstCount": 1,
    "abstainCount": 0
  }
}
```

### 10) Publish results
POST `/api/resolutions/{id}/publish-results`

Response: 200 OK
```json
{
  "resolutionId": 10,
  "resolutionTitle": "Adopt new voting policy",
  "resolutionDescription": "Adopt the updated voting policy for the board.",
  "room": {
    "id": 1,
    "name": "Board Room A",
    "latitude": 12.9716,
    "longitude": 77.5946
  },
  "status": "RESULTS_PUBLISHED",
  "totalVotes": 2,
  "forCount": 1,
  "againstCount": 1,
  "abstainCount": 0,
  "directVotes": {
    "total": 1,
    "forCount": 1,
    "againstCount": 0,
    "abstainCount": 0
  },
  "proxyVotes": {
    "total": 1,
    "forCount": 0,
    "againstCount": 1,
    "abstainCount": 0
  }
}
```

### 11) View results
GET `/api/resolutions/{id}/results`

Response: 200 OK
```json
{
  "resolutionId": 10,
  "resolutionTitle": "Adopt new voting policy",
  "resolutionDescription": "Adopt the updated voting policy for the board.",
  "room": {
    "id": 1,
    "name": "Board Room A",
    "latitude": 12.9716,
    "longitude": 77.5946
  },
  "status": "RESULTS_PUBLISHED",
  "totalVotes": 2,
  "forCount": 1,
  "againstCount": 1,
  "abstainCount": 0,
  "directVotes": {
    "total": 1,
    "forCount": 1,
    "againstCount": 0,
    "abstainCount": 0
  },
  "proxyVotes": {
    "total": 1,
    "forCount": 0,
    "againstCount": 1,
    "abstainCount": 0
  }
}
```

## Failure use-cases (common API errors)
All errors return `4xx` with a JSON body like:
```json
{
  "status": 400,
  "error": "Bad Request",
  "message": "Human-readable reason",
  "path": "/api/resolutions/10/votes"
}
```

### Publish a non-draft resolution
POST `/api/resolutions/{id}/publish`

Response: 400 Bad Request
```json
{
  "status": 400,
  "error": "Bad Request",
  "message": "Only draft resolutions can be published",
  "path": "/api/resolutions/10/publish"
}
```

### Start voting when not published
POST `/api/resolutions/{id}/start-voting`

Response: 400 Bad Request
```json
{
  "status": 400,
  "error": "Bad Request",
  "message": "Only published resolutions can start voting",
  "path": "/api/resolutions/10/start-voting"
}
```

### Direct vote after direct voting ended
POST `/api/resolutions/{id}/votes`

Request (direct vote while PROXY_VOTING):
```json
{
  "voterId": 2,
  "proxyForUserId": null,
  "proxyForName": null,
  "choice": "FOR",
  "latitude": 12.9716,
  "longitude": 77.5946
}
```

Response: 400 Bad Request
```json
{
  "status": 400,
  "error": "Bad Request",
  "message": "Direct voting has ended for this resolution",
  "path": "/api/resolutions/10/votes"
}
```

### Proxy vote before proxy voting starts
POST `/api/resolutions/{id}/votes`

Request (proxy vote while VOTING):
```json
{
  "voterId": 1,
  "proxyForUserId": 2,
  "proxyForName": "Alan Turing",
  "choice": "AGAINST",
  "latitude": 12.9716,
  "longitude": 77.5946
}
```

Response: 400 Bad Request
```json
{
  "status": 400,
  "error": "Bad Request",
  "message": "Proxy voting is not active for this resolution",
  "path": "/api/resolutions/10/votes"
}
```

### Vote with mismatched coordinates
POST `/api/resolutions/{id}/votes`

Request:
```json
{
  "voterId": 2,
  "proxyForUserId": null,
  "proxyForName": null,
  "choice": "FOR",
  "latitude": 12.0,
  "longitude": 77.0
}
```

Response: 400 Bad Request
```json
{
  "status": 400,
  "error": "Bad Request",
  "message": "Voting location does not match the resolution room",
  "path": "/api/resolutions/10/votes"
}
```

### Publish results before voting closes
POST `/api/resolutions/{id}/publish-results`

Response: 400 Bad Request
```json
{
  "status": 400,
  "error": "Bad Request",
  "message": "Voting must be closed to publish results",
  "path": "/api/resolutions/10/publish-results"
}
```
