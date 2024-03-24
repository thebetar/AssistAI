# AssistAI

This project aims to create a small but efficient LLM that can be run locally on open source software using your own files to help you with remembering and finding things.

Notes should be stored in the `data/files` folder in a textual format like `.txt` or `.md`.

Both ways of running this application require `ollama` with the models `llama3.2:1b` for the chat and `mxbai-embed-large` for the embeddings

## Frontend

This application has a simple frontend build in Electron that can be used to input questions and easily manage documents that are used for context.

1. Navigate to `client` folder with `cd client`
2. To install all depencencies run `npm install`
3. To run the application `npm start`

## CLI

This application also contains a CLI tool using python.

1. To create a virtual environment run `python3 -m venv .venv`
2. To run the virtual environment run `source .venv/bin/activate`
3. To install all dependencies run `pip install -r ./requirements.txt`
4. To initially build the model `python3 ./src/main.py`
5. To run the FastAPi server `fastapi dev src/main.py --port 12345` (fastapi\[standard\] might have to be installed using `pip install fastapi[standard]`)
6. Use the shell script to send a question `./assist-ai.zsh "{QUESTION}"` (might not have executions permissions, use `chmod u+x ./assist.zsh` to give execution permissions)

When using this method it is wise to also configure it in a way that your `zsh` or `bash` configuration knows where to find this file. For instance

```bash
assist-ai() {
    python3 ~/PATH/AssistAI/main.py "$@"
}
```

https://docs.llamaindex.ai/en/stable/getting_started/starter_example_local/
