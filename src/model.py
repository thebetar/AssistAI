import os
import json
import hashlib
import time

from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain.chains.retrieval import create_retrieval_chain
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_core.prompts import ChatPromptTemplate
from langchain_ollama import ChatOllama, OllamaEmbeddings
from langchain_community.document_loaders import DirectoryLoader, TextLoader
from langchain_community.vectorstores.faiss import FAISS as FaissStore

OLLAMA_URL = os.getenv("OLLAMA_URL", "http://localhost:11434")


class CustomDocumentModel:
    def __init__(self, silent=False, refresh=False):
        self.log_file = os.path.join(os.path.dirname(__file__), "data", "log.txt")

        self.history = []
        self.silent = silent
        self.refresh = refresh

        self.init()

    def init(self):
        start_time = time.time()

        self.model = ChatOllama(
            model="gemma3:1b",
            temperature=0.1,
            base_url=OLLAMA_URL,
        )

        if not self.silent:
            print(
                f"[custom-chat-model] Model initiated ({self.__get_run_time(start_time)})"
            )

        # Create basic prompt
        self.default_prompt = ChatPromptTemplate.from_messages(
            [
                (
                    "system",
                    "You are a helpful and knowledgeable assistant. "
                    "Use the previous chat history below to provide accurate, concise, and context-aware answers. "
                    "If you are unsure, say so. Do not make up information.",
                ),
                ("system", "Chat History:\n{chat_history}"),
                ("human", "{input}"),
            ]
        )

        self.default_chain = self.default_prompt | self.model

        # Create basic RAG prompt
        self.rag_prompt = ChatPromptTemplate.from_messages(
            [
                (
                    "system",
                    "You are an expert assistant specialized in answering questions based on provided documents. "
                    "Use the context and chat history below to answer. Only use this information—do not make things up."
                    "Start the answer with, 'According to your notes, ' and end with a summary of the answer. ",
                ),
                ("system", "Context:\n{context}"),
                ("system", "Chat History:\n{chat_history}"),
                ("human", "{input}"),
            ]
        )

        if not self.silent:
            print(
                f"[custom-chat-model] Prompt initiated ({self.__get_run_time(start_time)})"
            )

        # Initiate chain for chat with documents
        self.documents_chain = create_stuff_documents_chain(
            llm=self.model,
            prompt=self.rag_prompt,
        )
        if not self.silent:
            print(
                f"[custom-chat-model] Documents chain initiated ({self.__get_run_time(start_time)})"
            )

        # Load documents
        self.__load_documents()
        if not self.silent:
            print(
                f"[custom-chat-model] Documents loaded ({self.__get_run_time(start_time)})"
            )

        # Create embeddings model
        self.embeddings = OllamaEmbeddings(
            model="mxbai-embed-large", base_url=OLLAMA_URL
        )

        # Store documents in database for fast search in all documents for model
        self.__load_vector_store(force=self.refresh)
        if not self.silent:
            print(
                f"[custom-chat-model] Vector store initiated ({self.__get_run_time(start_time)})"
            )

        # Get retriever from vector store
        self.retriever = self.vector_store.as_retriever(k=5)
        self.retrieval_chain = create_retrieval_chain(
            combine_docs_chain=self.documents_chain,
            retriever=self.retriever,
        )

        if not self.silent:
            print(
                f"[custom-chat-model] Retrieval chain ({self.__get_run_time(start_time)})"
            )
            print(
                f"[custom-chat-model] Model created ({self.__get_run_time(start_time)}s)"
            )

    def __get_run_time(self, start_time):
        return time.time() - start_time

    def __load_documents(self):
        files_path = os.path.join(os.path.dirname(__file__), "data", "files")
        loader = DirectoryLoader(
            path=files_path,
            loader_cls=TextLoader,
            recursive=True,
            load_hidden=False,
        )
        self.documents = loader.load()

        # Split documents for smaller context window
        splitter = RecursiveCharacterTextSplitter(
            chunk_size=1200,
            chunk_overlap=200,
        )
        self.documents = splitter.split_documents(self.documents)

        return self.documents

    def __load_vector_store(self, force=False):
        # Check if vectorstore was created at least one hour ago
        vector_store_path = os.path.join(
            os.path.dirname(__file__), "data", "vectorstore"
        )
        vector_store_created_path = os.path.join(vector_store_path, "created.json")

        if self.__new_vector_store() or force:
            BATCH_SIZE = 30

            # Load documents from class into local variable
            documents = self.documents[:]

            self.vector_store = FaissStore.from_documents(
                documents[:BATCH_SIZE], self.embeddings
            )

            # Remove first batch
            documents = documents[BATCH_SIZE:]

            print(
                f"[custom-chat-model] Adding document splits {len(documents)} left..."
            )

            while documents:
                self.vector_store.add_documents(documents[:BATCH_SIZE])
                documents = documents[BATCH_SIZE:]
                print(
                    f"[custom-chat-model] Adding document splits {len(documents)} left..."
                )

            # Saving vector store for optimisation
            self.vector_store.save_local(folder_path=vector_store_path)
            with open(vector_store_created_path, "w") as f:
                json.dump(
                    {
                        "timestamp": time.time(),
                        "documents": [d.page_content for d in self.documents],
                        "checksum": hashlib.md5(
                            " | ".join(d.page_content for d in self.documents).encode()
                        ).hexdigest(),
                    },
                    f,
                )
        else:
            self.vector_store = FaissStore.load_local(
                folder_path=vector_store_path,
                embeddings=self.embeddings,
                allow_dangerous_deserialization=True,
            )
            if not self.silent:
                print("[custom-chat-model] Vectorstore loaded from storage")

        return self.vector_store

    def __new_vector_store(self):
        vector_store_path = os.path.join(
            os.path.dirname(__file__), "data", "vectorstore"
        )
        vector_store_created_path = os.path.join(vector_store_path, "created.json")

        if os.path.exists(vector_store_created_path):
            with open(vector_store_created_path, "r") as f:
                vector_store_created = json.load(f)

            checksum = vector_store_created["checksum"]

            # Compare checksum to see if content changed
            if (
                checksum
                == hashlib.md5(
                    " | ".join(d.page_content for d in self.documents).encode()
                ).hexdigest()
            ):
                return False

        return True

    # Create function to call the chain
    def invoke(self, message, use_rag=True):
        with open(self.log_file, "a") as f:
            f.write(f"message: {message}\n")

        if message == "clear":
            self.history = []
            return "Chat history cleared"

        start_time = time.time()

        if use_rag:
            history_context = (
                "\n".join(
                    [f"Question: {h[0]}\nAnswer: {h[1]}" for h in self.history[-5:]]
                )
                if self.history
                else ""
            )

            response = self.retrieval_chain.invoke(
                {
                    "input": message,
                    "chat_history": history_context,
                }
            )
        else:
            history_context = (
                "\n".join([f"Question: {h[0]}\nAnswer: {h[1]}" for h in self.history])
                if self.history
                else ""
            )

            response = self.documents_chain.invoke(
                {
                    "input": message,
                    "chat_history": history_context,
                }
            )

        answer = response["answer"]

        with open(self.log_file, "a") as f:
            f.write(f"time: {time.time() - start_time}s\n")
            f.write(f"response: {response}\n")
            f.write("------------------------------------------------\n\n")

        self.history.append(
            (
                message,
                answer,
            )
        )

        return answer


if __name__ == "__main__":
    model = CustomDocumentModel()
    print(model.invoke("What is a checksum?"))
