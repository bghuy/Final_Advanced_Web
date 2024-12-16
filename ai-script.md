

I have these feature of backend:

base backend url: http://localhost:8080/api/v1


i have these API:


# Authentication API Documentation

## Unauthenticated Endpoints

### POST - `/auth/login`
- **Description**: Authenticates a user using their email and password. If successful, it returns an access token and sets a refresh token as a cookie.
- **Input**: 
  - JSON body:
    ```json
    {
      "email": "user@example.com",
      "password": "userpassword"
    }
    ```
- **Output**: 
  - JSON response:
    ```json
    {
      "id": "user_id",
      "username": "username",
      "email": "user@example.com",
      "created_at": "2023-10-01T12:00:00Z",
      "updated_at": "2023-10-01T12:00:00Z",
      "access_token": "access_token_string"
    }
    ```
  - HTTP-only cookie: `refresh_token`

### POST - `/auth/register`
- **Description**: Registers a new user with a username, email, and password. Returns an access token and sets a refresh token as a cookie upon successful registration.
- **Input**: 
  - JSON body:
    ```json
    {
      "username": "newuser",
      "email": "newuser@example.com",
      "password": "newpassword"
    }
    ```
- **Output**: 
  - JSON response:
    ```json
    {
      "id": "user_id",
      "username": "newuser",
      "email": "newuser@example.com",
      "created_at": "2023-10-01T12:00:00Z",
      "updated_at": "2023-10-01T12:00:00Z",
      "access_token": "access_token_string"
    }
    ```
  - HTTP-only cookie: `refresh_token`

### GET - `/auth/refresh-token`
- **Description**: Refreshes the access token using the refresh token stored in the cookie. This allows the user to stay logged in without re-entering credentials.
- **Input**: 
  - Requires `refresh_token` cookie.
- **Output**: 
  - JSON response:
    ```json
    {
      "access_token": "new_access_token_string"
    }
    ```

## Authenticated Endpoints

### GET - `/auth/profile`
- **Description**: Retrieves the profile information of the authenticated user.
- **Input**: 
  - Requires `Authorization` header with `Bearer access_token`.
- **Output**: 
  - JSON response:
    ```json
    {
      "id": "user_id",
      "username": "username",
      "email": "user@example.com",
      "created_at": "2023-10-01T12:00:00Z",
      "updated_at": "2023-10-01T12:00:00Z"
    }
    ```

## Social Authentication Endpoints

### GET - `/auth/social/google/login`
- **Description**: Initiates the Google OAuth login process by redirecting the user to Google's OAuth service. When the user hit the login by google button, it will redirect to this endpoint.
- **Input**: 
  - No input required.
- **Output**: 
  - Redirects to Google OAuth login page.

The user will be redirected to google login page, and after the user login, google will redirect to the callback api endpoint in backend. then backend will handle the google login process and redirect to the frontend with the format http://localhost:3000/login/redirect?access_token=access_token_string and refresh_token in http-only cookie. Frontend will handle the redirect and set the access_token to the cookie. Then redirect to http://localhost:3000/tasks




