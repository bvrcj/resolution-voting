# Resolution Voting Database Schema

Schema name: resolution_voting

## Tables

### rooms

| Column | Type | Constraints | Notes |
| --- | --- | --- | --- |
| id | BIGINT | PRIMARY KEY, IDENTITY | |
| name | VARCHAR(255) | NOT NULL | |
| latitude | DOUBLE | NOT NULL | |
| longitude | DOUBLE | NOT NULL | |

### users

| Column | Type | Constraints | Notes |
| --- | --- | --- | --- |
| id | BIGINT | PRIMARY KEY, IDENTITY | |
| name | VARCHAR(255) | NOT NULL | |
| email | VARCHAR(255) | NOT NULL, UNIQUE | |
| role | VARCHAR(255) | NOT NULL | Enum: ADMIN, USER |

### resolutions

| Column | Type | Constraints | Notes |
| --- | --- | --- | --- |
| id | BIGINT | PRIMARY KEY, IDENTITY | |
| title | VARCHAR(255) | NOT NULL | |
| description | TEXT | | |
| room_id | BIGINT | NOT NULL | FK -> rooms.id |
| status | VARCHAR(255) | NOT NULL | Enum: DRAFT, PUBLISHED, VOTING, PROXY_VOTING, CLOSED, RESULTS_PUBLISHED |
| created_at | TIMESTAMP | NOT NULL | |
| updated_at | TIMESTAMP | NOT NULL | |
| voting_started_at | TIMESTAMP | | |
| voting_ended_at | TIMESTAMP | | |

### votes

| Column | Type | Constraints | Notes |
| --- | --- | --- | --- |
| id | BIGINT | PRIMARY KEY, IDENTITY | |
| resolution_id | BIGINT | NOT NULL | FK -> resolutions.id |
| voter_id | BIGINT | NOT NULL | FK -> users.id |
| proxy_for_user_id | BIGINT | | FK -> users.id |
| effective_voter_id | BIGINT | NOT NULL | FK -> users.id |
| choice | VARCHAR(255) | NOT NULL | Enum: FOR, AGAINST, ABSTAIN |
| created_at | TIMESTAMP | NOT NULL | |

## Constraints

- votes: UNIQUE (resolution_id, effective_voter_id)
- resolutions: FK (room_id) -> rooms.id

-- rooms
CREATE TABLE rooms (
id BIGINT AUTO_INCREMENT PRIMARY KEY,
name VARCHAR(255) NOT NULL,
latitude DOUBLE NOT NULL,
longitude DOUBLE NOT NULL
);

-- users
CREATE TABLE users (
id BIGINT AUTO_INCREMENT PRIMARY KEY,
name VARCHAR(255) NOT NULL,
email VARCHAR(255) NOT NULL UNIQUE,
role VARCHAR(255) NOT NULL -- enum: ADMIN, USER
);

-- resolutions
CREATE TABLE resolutions (
id BIGINT AUTO_INCREMENT PRIMARY KEY,
title VARCHAR(255) NOT NULL,
description TEXT,
room_id BIGINT NOT NULL,
status VARCHAR(255) NOT NULL, -- enum: DRAFT, PUBLISHED, VOTING, PROXY_VOTING, CLOSED, RESULTS_PUBLISHED
created_at TIMESTAMP NOT NULL,
updated_at TIMESTAMP NOT NULL,
voting_started_at TIMESTAMP,
voting_ended_at TIMESTAMP,
CONSTRAINT fk_resolutions_room FOREIGN KEY (room_id) REFERENCES rooms(id)
);

-- votes
CREATE TABLE votes (
id BIGINT AUTO_INCREMENT PRIMARY KEY,
resolution_id BIGINT NOT NULL,
voter_id BIGINT NOT NULL,
proxy_for_user_id BIGINT,
effective_voter_id BIGINT NOT NULL,
choice VARCHAR(255) NOT NULL, -- enum: FOR, AGAINST, ABSTAIN
created_at TIMESTAMP NOT NULL,
CONSTRAINT uq_votes_resolution_effective UNIQUE (resolution_id, effective_voter_id),
CONSTRAINT fk_votes_resolution FOREIGN KEY (resolution_id) REFERENCES resolutions(id),
CONSTRAINT fk_votes_voter FOREIGN KEY (voter_id) REFERENCES users(id),
CONSTRAINT fk_votes_proxy_for FOREIGN KEY (proxy_for_user_id) REFERENCES users(id),
CONSTRAINT fk_votes_effective_voter FOREIGN KEY (effective_voter_id) REFERENCES users(id)
);

## API Request/Response Examples

Base URL: http://localhost:8080

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

### Create user
POST /api/users

Request body:
```json
{
  "name": "Ada Lovelace",
  "email": "ada@example.com",
  "role": "ADMIN"
}
```

Response: 201 Created
```json
{
  "id": 1,
  "name": "Ada Lovelace",
  "email": "ada@example.com",
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
    "name": "Ada Lovelace",
    "email": "ada@example.com",
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
  "name": "Ada Lovelace",
  "email": "ada@example.com",
  "role": "ADMIN"
}
```

### Delete user
DELETE /api/users/{id}

Response: 204 No Content

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
