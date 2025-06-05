# Ragster

## Project Structure

```
chatbot-monorepo/
├── README.md
├── docker-compose.yml
├── .env.example
├── .gitignore
├── Makefile
├── pyproject.toml
│
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py
│   │   ├── config.py
│   │   ├── dependencies.py
│   │   │
│   │   ├── api/
│   │   │   ├── __init__.py
│   │   │   ├── v1/
│   │   │   │   ├── __init__.py
│   │   │   │   ├── api.py
│   │   │   │   └── endpoints/
│   │   │   │       ├── __init__.py
│   │   │   │       ├── chat.py
│   │   │   │       ├── health.py
│   │   │   │       └── websocket.py
│   │   │   └── middleware/
│   │   │       ├── __init__.py
│   │   │       ├── cors.py
│   │   │       └── auth.py
│   │   │
│   │   ├── core/
│   │   │   ├── __init__.py
│   │   │   ├── chatbot/
│   │   │   │   ├── __init__.py
│   │   │   │   ├── engine.py
│   │   │   │   ├── memory.py
│   │   │   │   └── prompts.py
│   │   │   ├── llm/
│   │   │   │   ├── __init__.py
│   │   │   │   ├── client.py
│   │   │   │   └── models.py
│   │   │   └── utils/
│   │   │       ├── __init__.py
│   │   │       ├── logger.py
│   │   │       └── helpers.py
│   │   │
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   ├── chat.py
│   │   │   ├── user.py
│   │   │   └── response.py
│   │   │
│   │   ├── schemas/
│   │   │   ├── __init__.py
│   │   │   ├── chat.py
│   │   │   ├── user.py
│   │   │   └── response.py
│   │   │
│   │   ├── database/
│   │   │   ├── __init__.py
│   │   │   ├── connection.py
│   │   │   ├── models.py
│   │   │   └── migrations/
│   │   │       └── __init__.py
│   │   │
│   │   └── services/
│   │       ├── __init__.py
│   │       ├── chat_service.py
│   │       ├── user_service.py
│   │       └── storage_service.py
│   │
│   ├── tests/
│   │   ├── __init__.py
│   │   ├── conftest.py
│   │   ├── test_main.py
│   │   ├── api/
│   │   │   ├── __init__.py
│   │   │   └── test_chat.py
│   │   └── core/
│   │       ├── __init__.py
│   │       └── test_chatbot.py
│   │
│   ├── Dockerfile
│   ├── requirements.txt
│   └── alembic.ini
│
├── frontend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py
│   │   ├── config.py
│   │   │
│   │   ├── components/
│   │   │   ├── __init__.py
│   │   │   ├── chat_interface.py
│   │   │   ├── sidebar.py
│   │   │   ├── message_display.py
│   │   │   └── input_handler.py
│   │   │
│   │   ├── pages/
│   │   │   ├── __init__.py
│   │   │   ├── chat.py
│   │   │   ├── settings.py
│   │   │   └── about.py
│   │   │
│   │   ├── services/
│   │   │   ├── __init__.py
│   │   │   ├── api_client.py
│   │   │   └── websocket_client.py
│   │   │
│   │   ├── utils/
│   │   │   ├── __init__.py
│   │   │   ├── helpers.py
│   │   │   └── session_state.py
│   │   │
│   │   └── static/
│   │       ├── css/
│   │       │   └── custom.css
│   │       └── images/
│   │           └── logo.png
│   │
│   ├── tests/
│   │   ├── __init__.py
│   │   └── test_components.py
│   │
│   ├── Dockerfile
│   └── requirements.txt
│
├── shared/
│   ├── __init__.py
│   ├── models/
│   │   ├── __init__.py
│   │   └── common.py
│   └── utils/
│       ├── __init__.py
│       └── validators.py
│
├── scripts/
│   ├── setup.sh
│   ├── deploy.sh
│   ├── test.sh
│   └── seed_data.py
│
├── docs/
│   ├── README.md
│   ├── api.md
│   ├── deployment.md
│   └── architecture.md
│
└── deployment/
    ├── docker/
    │   ├── backend.Dockerfile
    │   └── frontend.Dockerfile
    ├── kubernetes/
    │   ├── backend-deployment.yaml
    │   ├── frontend-deployment.yaml
    │   └── service.yaml
    └── nginx/
        └── nginx.conf
```

# Resources

- https://github.com/matankley/declarai-chat-fastapi-streamlit/tree/main
