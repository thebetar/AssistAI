# AssistAI

This project aims to create a small but efficient LLM that can be run locally on open source software using your own files to help you with remembering and finding things.

Uses redis as a database to run use the following command:
`docker run -d -p 6379:6379 -p 8001:8001 --name assist-ai-redis redis/redis-stack:latest`

### Todos

-   Make model more efficient and minimal to only work on local files
-   Convert langchain to javascript
-   Create Electron app
