# resolution-voting
Resolution voting application using Spring Boot and MySQL.

## Run
- Configure database access in `src/main/resources/application.yml`
- Build with `gradle clean build`
- Start the app with `gradle bootRun`

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
