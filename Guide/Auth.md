# 🧑‍💻 Auth API – Usage Guide

This API allows users to create a new account or log in to an existing account to receive an authentication token. All routes are public and do not require a JWT token for access.

## 🔐 Authorization

The following routes do not require an Authorization header but expect:

```http
Content-Type: application/json
```

## 📘 Sign Up

**Endpoint:**

```http
POST /api/auth/signup
```

Creates a new user account with a username, email, and password. The username must be at least 3 characters, and the password must be at least 6 characters.

### ✅ Success (201):

```json
{ "message": "User created seccessfully" }
```

### ❌ Error (e.g., 400 Bad Request):

```json
{ "message": "Username must be at least 3 characters" }
```

```json
{ "message": "Password must be at least 6 characters" }
```

```json
{ "error": "error.message" }
```

### ❌ Error (e.g., 500 Internal Server Error):

```json
{ "error": "error.message" }
```

## 📘 Login

**Endpoint:**

```http
POST /api/auth/login
```

Logs in a user with an email and password, returning a JWT token for authentication. The token expires in 2 hours.

### ✅ Success (200):

```json
{ "token": "some token..." }
```

### ❌ Error (e.g., 401 Unauthorized):

```json
{ "message": "Invalid credentials" }
```

### ❌ Error (e.g., 500 Internal Server Error):

```json
{ "error": "error.message" }
```

## 🗂️ Route Summary

| Method | Endpoint           | Description               |
| ------ | ------------------ | ------------------------- |
| POST   | `/api/auth/signup` | Create a new user account |
| POST   | `/api/auth/login`  | Log in to a user account  |
