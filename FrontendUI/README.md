# Multivendor Adapter - Frontend UI

This React + TypeScript app provides the UI for:
- Authentication (login/logout)
- Uploading NB/SB models (multipart)
- Configuring mappings (JSON)
- Provisioning services (JSON)
- Viewing status, versioning, and audit logs

## Setup

1) Configure API base URL
Copy `.env.example` to `.env` and set your backend URL:
```
REACT_APP_API_BASE_URL=http://localhost:5000/api
```

2) Install dependencies
```
npm install
```

3) Run
```
npm start
```
The app runs on http://localhost:3000

## Notes

- JWT is stored in memory and localStorage, and attached as `Authorization: Bearer <token>` automatically to API requests.
- 401 errors trigger a redirect to the login page.
- Upload model uses multipart/form-data with fields: `modelType` and `file`.
- Mapping and Provision pages accept JSON via a textarea editor and validate before submitting.
