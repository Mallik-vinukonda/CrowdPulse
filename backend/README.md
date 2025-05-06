# Crowd Pulse Backend

This is the backend service for the Crowd Pulse project.

## Features

- User authentication (register/login)
- Issue reporting and review
- Credit system and course unlocks
- Secure REST API with JWT authentication
- Logging enabled via Python `logging` module

## Getting Started

### Prerequisites

- Python 3.10+
- MongoDB
- pip (Python package manager)

### Setup Instructions

1. Clone the repo:

```bash
git clone https://github.com/Mallik-vinukonda/CrowdPulse.git
cd CrowdPulse/backend
```

2. Install dependencies:

```bash
pip install -r requirements.txt
```

3. Create a `.env` file:

```
JWT_SECRET=your_secret_key
MONGO_URI=your_mongodb_uri
PORT=5000
```

4. Run the server:

```bash
python app.py
```

### Logging

Logging is enabled by default. Logs are stored in `crowd_pulse.log`.

## API Endpoints

| Method | Endpoint               | Description             |
|--------|------------------------|-------------------------|
| POST   | /api/user/register     | Register a new user     |
| POST   | /api/user/login        | Login and get a token   |
| GET    | /api/user/me           | Get logged-in user info |
| POST   | /issue                 | Submit a new issue      |
| GET    | /issue/mine            | List your submitted issues |

---


