# API Request/Response Examples

Base URL: http://localhost:8080

## Rooms

### Create room
POST /api/rooms

Request body:
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

### List rooms
GET /api/rooms

Response: 200 OK
```json
[
  {
    "id": 1,
    "name": "Board Room A",
    "latitude": 12.9716,
    "longitude": 77.5946
  }
]
```

### Get room
GET /api/rooms/{id}

Response: 200 OK
```json
{
  "id": 1,
  "name": "Board Room A",
  "latitude": 12.9716,
  "longitude": 77.5946
}
```

### Update room
PUT /api/rooms/{id}

Request body:
```json
{
  "name": "Board Room A",
  "latitude": 12.9716,
  "longitude": 77.5946
}
```

Response: 200 OK
```json
{
  "id": 1,
  "name": "Board Room A",
  "latitude": 12.9716,
  "longitude": 77.5946
}
```

### Delete room
DELETE /api/rooms/{id}

Response: 204 No Content

## Users

### Create user
POST /api/users

Request body:
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

### List users
GET /api/users

Response: 200 OK
```json
[
  {
    "id": 1,
    "name": "Siva Vishnu",
    "email": "SivaVishnu@lsvt.com",
    "role": "ADMIN"
  },
  {
    "id": 2,
    "name": "Alan Turing",
    "email": "alan@example.com",
    "role": "USER"
  }
]
```

### Get user
GET /api/users/{id}

Response: 200 OK
```json
{
  "id": 1,
  "name": "Siva Vishnu",
  "email": "SivaVishnu@lsvt.com",
  "role": "ADMIN"
}
```

### Delete user
DELETE /api/users/{id}

Response: 204 No Content

## Resolutions

### Create resolution
POST /api/resolutions

Request body:
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

### List resolutions
GET /api/resolutions

Response: 200 OK
```json
[
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
]
```

### Get resolution
GET /api/resolutions/{id}

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
  "status": "DRAFT",
  "createdAt": "2026-01-24T01:10:00Z",
  "updatedAt": "2026-01-24T01:10:00Z",
  "votingStartedAt": null,
  "votingEndedAt": null
}
```

### Update resolution (draft only)
PUT /api/resolutions/{id}

Request body:
```json
{
  "title": "Adopt new voting policy (revised)",
  "description": "Adopt the updated voting policy for the board.",
  "roomId": 1
}
```

Response: 200 OK
```json
{
  "id": 10,
  "title": "Adopt new voting policy (revised)",
  "description": "Adopt the updated voting policy for the board.",
  "room": {
    "id": 1,
    "name": "Board Room A",
    "latitude": 12.9716,
    "longitude": 77.5946
  },
  "status": "DRAFT",
  "createdAt": "2026-01-24T01:10:00Z",
  "updatedAt": "2026-01-24T01:12:00Z",
  "votingStartedAt": null,
  "votingEndedAt": null
}
```

### Delete resolution (draft only)
DELETE /api/resolutions/{id}

Response: 204 No Content

### Publish resolution
POST /api/resolutions/{id}/publish

Response: 200 OK
```json
{
  "id": 10,
  "title": "Adopt new voting policy (revised)",
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

### Start direct voting
POST /api/resolutions/{id}/start-voting

Response: 200 OK
```json
{
  "id": 10,
  "title": "Adopt new voting policy (revised)",
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

### Start proxy voting
POST /api/resolutions/{id}/start-proxy-voting

Response: 200 OK
```json
{
  "id": 10,
  "title": "Adopt new voting policy (revised)",
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

### Cast vote (direct during VOTING, proxy during PROXY_VOTING)
POST /api/resolutions/{id}/votes

Request body:
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

### End direct voting
POST /api/resolutions/{id}/end-direct-voting

Response: 200 OK
```json
{
  "id": 10,
  "title": "Adopt new voting policy (revised)",
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

### End proxy voting
POST /api/resolutions/{id}/end-proxy-voting

Response: 200 OK
```json
{
  "resolutionId": 10,
  "resolutionTitle": "Adopt new voting policy (revised)",
  "resolutionDescription": "Adopt the updated voting policy for the board.",
  "room": {
    "id": 1,
    "name": "Board Room A",
    "latitude": 12.9716,
    "longitude": 77.5946
  },
  "status": "CLOSED",
  "totalVotes": 3,
  "forCount": 2,
  "againstCount": 1,
  "abstainCount": 0,
  "directVotes": {
    "total": 2,
    "forCount": 2,
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

### Publish results
POST /api/resolutions/{id}/publish-results

Response: 200 OK
```json
{
  "resolutionId": 10,
  "resolutionTitle": "Adopt new voting policy (revised)",
  "resolutionDescription": "Adopt the updated voting policy for the board.",
  "room": {
    "id": 1,
    "name": "Board Room A",
    "latitude": 12.9716,
    "longitude": 77.5946
  },
  "status": "RESULTS_PUBLISHED",
  "totalVotes": 3,
  "forCount": 2,
  "againstCount": 1,
  "abstainCount": 0,
  "directVotes": {
    "total": 2,
    "forCount": 2,
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

### Get results
GET /api/resolutions/{id}/results

Response: 200 OK
```json
{
  "resolutionId": 10,
  "resolutionTitle": "Adopt new voting policy (revised)",
  "resolutionDescription": "Adopt the updated voting policy for the board.",
  "room": {
    "id": 1,
    "name": "Board Room A",
    "latitude": 12.9716,
    "longitude": 77.5946
  },
  "status": "RESULTS_PUBLISHED",
  "totalVotes": 3,
  "forCount": 2,
  "againstCount": 1,
  "abstainCount": 0,
  "directVotes": {
    "total": 2,
    "forCount": 2,
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



