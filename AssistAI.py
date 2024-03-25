import os
import sys

# The overall model
from langchain_community.document_loaders import TextLoader
from langchain_community.document_loaders.csv_loader import CSVLoader
from langchain_core.output_parsers import JsonOutputParser
from langchain_core.prompts import ChatPromptTemplate
from langchain_community.llms import Ollama
from langchain_community.document_loaders import DirectoryLoader
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_community.vectorstores import Chroma
from langchain.chains import create_retrieval_chain
from langchain_community.embeddings.sentence_transformer import (
    SentenceTransformerEmbeddings,
)
from langchain import hub

print("Loading...")

PERSIST = True

print("1: Starting the AssistAI model")

# Initialise minimalist model
llm = Ollama(model="tinyllama")
output_parser = JsonOutputParser()

print("2: Loading documents")

# Loading all documents

## Glob for CSV and markdown files
data_path = os.path.join(os.getcwd(), 'data')

md_glob = '**/*.md'
md_loader = DirectoryLoader(data_path, loader_cls=TextLoader, glob=md_glob)
md_docs = md_loader.load()

csv_glob = '**/*.csv'
csv_loader = DirectoryLoader(data_path, loader_cls=CSVLoader, glob=csv_glob)
csv_docs = csv_loader.load()

# Combine all documents
docs = md_docs + csv_docs

print("3: Creating the prompt")

# Create prompt
retrieval_qa_chat_prompt = hub.pull("langchain-ai/retrieval-qa-chat")

print("4: Creating the retrieval chain")

# Combine document in a chain
combine_documents_chain = create_stuff_documents_chain(llm, retrieval_qa_chat_prompt)

# Create embedding function to search for documents
embedding_function = SentenceTransformerEmbeddings(model_name="all-MiniLM-L6-v2")

# Load or create vectorstore for more efficient retrieval
if os.path.exists("persist") and PERSIST:
    vectorstore = Chroma.from_documents(docs, embedding_function, persist_directory="persist")
elif not os.path.exists("persist") and PERSIST:
    os.makedirs("persist")
    vectorstore = Chroma.from_documents(docs, embedding_function, persist_directory="persist")
else:
    vectorstore = Chroma.from_documents(docs, embedding_function)

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