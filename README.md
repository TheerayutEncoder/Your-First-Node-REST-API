# Restaurant Member REST API

Software Architecture REST API assignment, adapted from
[Web Dev Simplified's sample](https://github.com/WebDevSimplified/Your-First-Node-REST-API).
Uses Node.js, Express, Mongoose, and your own MongoDB database in Docker.

## Run locally

Run commands from this project directory. You need Node.js/npm and Docker
(Colima on this machine). Start Colima if it is stopped:

```sh
colima start
```

Start the existing MongoDB container:

```sh
docker start rest-api-mongodb
```

On a new machine, create it once instead:

```sh
docker run -d --name rest-api-mongodb -p 127.0.0.1:27017:27017 -v rest-api-mongodb-data:/data/db mongo:7
```

Install dependencies with `npm install`. If `.env` does not exist, copy
`.env.example` to `.env`. The configuration is:

```dotenv
PORT=5001
DATABASE_URL=mongodb://127.0.0.1:27017/restaurant_members
```

```sh
npm start
```

Keep this terminal open to see startup and error logs. Stop with Ctrl+C.
After code or configuration changes, stop and start again; alternatively use
`npm run devStart` to reload JavaScript changes automatically.
The server starts after MongoDB connects. Port 5001 avoids the port 5000 conflict
with macOS Control Center on this machine.

## Data and endpoints

The `restaurant_members` database uses a `members` collection, created on the
first successful insert. Existing data in the `subscribers` database is preserved.
The Docker volume preserves records when the container stops.

All five fields are required for both POST and PUT:

| Field | JSON value |
| --- | --- |
| `name` | Non-empty string |
| `address` | Non-empty string |
| `telephone` | Non-empty string, preserving leading zeros |
| `email` | Email string with basic format validation |
| `memberStartDate` | Date string, for example `2026-09-13` |

MongoDB generates `_id`. Dates are returned as ISO timestamps.

| Method | Path | Success |
| --- | --- | --- |
| GET | `/members` | 200, array of members |
| GET | `/members/:id` | 200, one member |
| POST | `/members` | 201, created member |
| PUT | `/members/:id` | 200, updated member |
| DELETE | `/members/:id` | 200, deletion message |

PUT supplies all five fields and preserves the existing ID. Invalid input or ID
returns 400; a valid ID with no matching member returns 404. Unexpected server
errors return 500. This is a local coursework demo without authentication.

## Test with VS Code REST Client

1. Keep MongoDB and the API running.
2. Open `route.rest` in VS Code with the REST Client extension installed.
3. Click **Send Request** above each numbered request, from 1 through 8.
4. Inspect the status and JSON in the response panel.

If **Send Request** is missing, set the editor language mode to **HTTP**, or use
the command palette's **REST Client: Send Request** command.
Request 2 must run before the ID-based requests: its named response automatically
provides `memberId`. To repeat after deletion, run request 2 again. Each POST
creates a new member. Optional requests demonstrate validation failures.

The original subscriber model, routes, and `subscribers.http` remain as tutorial
references; the server now mounts only `/members`. Use `route.rest` for this assignment.

You can inspect stored records directly:

```sh
docker exec rest-api-mongodb mongosh restaurant_members --quiet --eval 'db.members.find().toArray()'
```

## Recording checklist (under five minutes)

- 0:00–0:30: Introduce the restaurant member API and its five fields.
- 0:30–1:00: Show startup logs and your own MongoDB database configuration.
- 1:00–2:00: Run GET all, POST, then GET the created ID in `route.rest`.
- 2:00–3:00: Run PUT and GET again, pointing out the changed details.
- 3:00–4:00: Show the stored member in MongoDB, then DELETE and verify 404
  and the updated list.
- Finish before five minutes, save/export as MP4, and submit the video to MCV.

Reference: [REST Client documentation](https://github.com/Huachao/vscode-restclient#usage).
