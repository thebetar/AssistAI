# AssistAI

This project aims to create a small but efficient LLM that can be run locally on open source software using your own files to help you with remembering and finding things.

Notes should be stored in the `data/files` folder in a textual format like `.txt` or `.md`.

Both ways of running this application require `ollama` with the models `gemma3:1b` for the chat and `mxbai-embed-large` for the embeddings

## How to run

This application also contains a CLI tool using python.

1. This project requires both `Docker` and `Ollama` to be installed. Be sure to have both installed and for Ollama also install `gemma3:1b` and `mxbai-embed-large` which are the two models used to run this program
2. Build the dockerfile and run it simply by running `docker compose up -d --build` this will build the images and run it in detached mode.
3. Use the CLI tool that can be found in `assist-as.zsh` or use the web interface at `localhost:12345`

When using this method it is wise to also configure it in a way that your `zsh` or `bash` configuration knows where to find this file. For instance

```bash
echo alias assist-ai='$HOME/AssistAI/assist-ai.zsh'
```

Assuming that AssistAI was installed in the home directory.

https://docs.llamaindex.ai/en/stable/getting_started/starter_example_local/
