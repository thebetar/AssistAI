import sys
import os

# The overall model
from langchain_community.document_loaders import TextLoader
from langchain_community.llms import Ollama

llm = Ollama(model="tinyllama")

# Imports to load files
from langchain_community.document_loaders import DirectoryLoader
from langchain.chains.combine_documents import create_stuff_documents_chain

# Imports to use vector store
from langchain_community.vectorstores import Redis
from langchain.chains import create_retrieval_chain
from langchain_community.embeddings.sentence_transformer import (
    SentenceTransformerEmbeddings,
)
from langchain import hub

print("Loading...")

PERSIST = True
REDIS_URL = "redis://localhost:6379"

print("1: Starting the AssistAI model")

# Initialise minimalist model
llm = Ollama(model="tinyllama")

print("2: Loading documents")

# Loading all documents

## Glob for CSV and markdown files
data_path = os.path.join(os.getcwd(), 'data')

md_glob = '**/*.md'
md_loader = DirectoryLoader(data_path, loader_cls=TextLoader, glob=md_glob)
docs = md_loader.load()

print("3: Creating the prompt")

# Create prompt
retrieval_qa_chat_prompt = hub.pull("langchain-ai/retrieval-qa-chat")

print("4: Creating the retrieval chain")

# Combine document in a chain
combine_documents_chain = create_stuff_documents_chain(llm, retrieval_qa_chat_prompt)

# Create embedding function to search for documents
embedding = SentenceTransformerEmbeddings(model_name="all-MiniLM-L6-v2")

# Load or create vectorstore for more efficient retrieval
vectorstore = Redis.from_documents(documents=docs, embedding=embedding, redis_url=REDIS_URL)

retriever = vectorstore.as_retriever(k=10)

# Use retrieval chain to only use the top 10 documents
retrieval_chain = create_retrieval_chain(retriever, combine_documents_chain)

print("5: Ready to chat")

chat_history = []
query = None

while True:
    if not query:
        query = input("What do you want to know?: ")
    
    if query in ['quit', 'q', 'exit']:
        sys.exit()
    
    result = retrieval_chain.invoke({
        "input": query
    })
    print(result.get('answer', 'I do not know'))

    chat_history.append((query, result['answer']))
    query = None