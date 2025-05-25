# user-service

## Endpoints

### ✅ 1. Create a User (`POST /api/users`)

```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name": "Alice", "email": "alice@example.com"}' | jq
```

---

### ✅ 2. Get a Specific User (`GET /api/users/:id`)

Replace `<id>` with the actual user ID returned from the POST request (e.g., `1`):

```bash
curl http://localhost:3000/api/users/1 | jq
```

---

### ✅ 3. Update a User (`PUT /api/users/:id`)

```bash
curl -X PUT http://localhost:3000/api/users/3 \
  -H "Content-Type: application/json" \
  -d '{"name": "Alice Updated", "email": "alice.updated@example.com"}' | jq
```

---

### ✅ 4. Delete a User (`DELETE /api/users/:id`)

```bash
curl -X DELETE http://localhost:3000/api/users/1 | jq
```

---

### ✅ 5. Get All Users (`GET /api/users`)

```bash
curl http://localhost:3000/api/users | jq
```

