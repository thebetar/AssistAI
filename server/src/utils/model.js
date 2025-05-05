import path from 'path'
import fs from 'fs'
import crypto from 'crypto'
import { OllamaEmbeddings, ChatOllama } from '@langchain/ollama'
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { FaissStore } from '@langchain/community/vectorstores/faiss';
import { createRetrievalChain } from "langchain/chains/retrieval";

import { BASE_PATH } from './getPath.js'

export const DATA_DIR = path.join(BASE_PATH, '..', 'data');
export const DATA_FILES_DIR = path.join(DATA_DIR, 'files');

class CustomDocumentChatModel {
    constructor(chatModel = 'gemma3:1b', embeddingModel = "mxbai-embed-large", temperature = 0.1, silent = false, refresh = false) {
        this.logFile = path.join(DATA_DIR, 'log.txt');

        this.chatModel = chatModel;
        this.embeddingModel = embeddingModel;
        this.temperature = temperature;

        this.history = [];
        this.silent = silent;
        this.refresh = refresh;

        this.ready = false;
    }

    async init() {
        await this.loadModel();
    }

    async invoke(message, useRag = true, clear = false) {
        fs.appendFileSync(this.logFile, `question: ${message}\n`);

        if (message === 'clear' || clear) {
            this.history = [];
            return "Chat history cleared.";
        }

        const startTime = new Date().getTime();

        let answer;

        if (useRag) {
            const historyContext = this.history.slice(-5).map((h) => `Question: ${h[0]}\nAnswer: ${h[1]}`).join('\n\n')

            const response = await this.retrievalChain.invoke({
                input: message,
                chat_history: historyContext,
            });

            answer = response.answer;
        } else {
            const historyContext = this.history.map((h) => `Question: ${h[0]}\nAnswer: ${h[1]}`).join('\n\n')

            const response = await this.defaultChain.invoke({
                input: message,
                chat_history: historyContext,
            });

            answer = response;
        }

        fs.writeFileSync(this.logFile, `time: ${new Date().getTime() - startTime}\nanswer: ${answer}\n`);

        this.history.push([message, answer]);

        return answer;
    }

    __get_run_time(startTime) {
        return new Date().getTime() - startTime;
    }

    async loadModel() {
        const startTime = new Date().getTime();

        this.model = new ChatOllama({
            model: this.chatModel,
            temperature: this.temperature
        })

        if (!this.silent) {
            console.log(`[custom-chat-model] Model initialed (${this.__get_run_time(startTime)})`)
        }

        this.defaultPrompt = ChatPromptTemplate.fromMessages([
            (
                "system",
                `You are a helpful and knowledgeable assistant. 
                Use the previous chat history below to provide accurate, concise, and context-aware answers. 
                If you are unsure, say so. Do not make up information.`
            ),
            ("system", "Chat History:\n{chat_history}"),
            ("human", "{input}"),
        ]);

        this.defaultChain = this.defaultPrompt.pipe(this.model).pipe(new StringOutputParser());

        this.ragPrompt = ChatPromptTemplate.fromMessages([
            (
                "system",
                `You are an expert assistant specialized in answering questions based on provided documents. 
                Use the context and chat history below to answer. Only use this information—do not make things up.
                Start the answer with, 'According to your notes, ' and end with a summary of the answer.`
            ),
            ("system", "Context:\n{context}"),
            ("system", "Chat History:\n{chat_history}"),
            ("human", "{input}"),
        ]);

        if (!this.silent) {
            console.log(`[custom-chat-model] Prompt initialed (${this.__get_run_time(startTime)})`)
        }

        this.documentsChain = await createStuffDocumentsChain({
            llm: this.model,
            prompt: this.ragPrompt,
        })

        if (!this.silent) {
            console.log(`[custom-chat-model] Documents chain initialed (${this.__get_run_time(startTime)})`)
        }

        await this.loadDocuments();

        if (!this.silent) {
            console.log(`[custom-chat-model] Documents loaded (${this.__get_run_time(startTime)})`)
        }

        this.embeddings = new OllamaEmbeddings({
            model: this.embeddingModel,
        });

        await this.loadVectorStore(this.refresh);

        if (!this.silent) {
            console.log(`[custom-chat-model] Vector store loaded (${this.__get_run_time(startTime)})`)
        }

        this.retriever = this.vectorStore.asRetriever({
            k: 5
        });
        this.retrievalChain = await createRetrievalChain({
            retriever: this.retriever,
            combineDocsChain: this.documentsChain,
        })

        if (!this.silent) {
            console.log(`[custom-chat-model] Retrieval chain initialed (${this.__get_run_time(startTime)})`)
            console.log(`[custom-chat-model] Model loaded (${this.__get_run_time(startTime)})`)
        }

        this.ready = true;
    }

    async loadDocuments() {
        const loader = new DirectoryLoader(DATA_FILES_DIR, {
            '.md': (filePath) => new TextLoader(filePath),
        });
        this.documents = await loader.load();

        const splitter = new RecursiveCharacterTextSplitter({
            chunkSize: 512,
            chunkOverlap: 50,
        })
        this.documents = await splitter.splitDocuments(this.documents);

        this.documents = this.documents.filter((doc) => doc.pageContent.trim().length);

        return this.documents;
    }

    async loadVectorStore(force = false) {
        const vectorStorePath = path.join(DATA_DIR, 'vectorstore');

        if (!fs.existsSync(vectorStorePath)) {
            fs.mkdirSync(vectorStorePath, { recursive: true });
        }

        const vectorStoreCreatedPath = path.join(vectorStorePath, 'created.json');

        if (!fs.existsSync(vectorStoreCreatedPath) || this.refresh) {
            fs.writeFileSync(vectorStoreCreatedPath, JSON.stringify({
                timestamp: new Date().getTime(),
                documents: [],
                checksum: ''
            }));
        }

        if (!this.__newVectorStore() && !force) {
            this.vectorStore = await FaissStore.load(vectorStorePath, this.embeddings);

            if (!this.silent) {
                console.log(`[custom-chat-model] Vector store loaded from storage`)
            }

            return this.vectorStore;
        }

        const BATCH_SIZE = 30;

        const documents = this.documents.slice();

        console.log(`[custom-chat-model] Adding documents splits ${documents.length} left...`);

        this.vectorStore = await FaissStore.fromDocuments(documents.splice(0, BATCH_SIZE), this.embeddings);

        while (documents.length > 0) {
            const batch = documents.splice(0, BATCH_SIZE);

            if (!this.silent) {
                console.log(`[custom-chat-model] Adding documents splits ${documents.length} left...`);
            }

            await this.vectorStore.addDocuments(batch, this.embeddings);
        }

        await this.vectorStore.save(vectorStorePath);

        fs.writeFileSync(vectorStoreCreatedPath, JSON.stringify({
            timestamp: new Date().getTime(),
            documents: this.documents.map((doc) => doc.pageContent),
            checksum: this.__getDocumentChecksum()
        }));

        return this.vectorStore;
    }

    __newVectorStore() {
        const vectorStorePath = path.join(DATA_DIR, 'vectorstore');
        const vectorStoreCreatedPath = path.join(vectorStorePath, 'created.json');

        if (fs.existsSync(vectorStoreCreatedPath)) {
            const vectorStoreCreated = JSON.parse(fs.readFileSync(vectorStoreCreatedPath, 'utf-8'));

            const createdChecksum = vectorStoreCreated.checksum;
            const documentsChecksum = this.__getDocumentChecksum();

            if (createdChecksum === documentsChecksum) {
                return false;
            }
        }

        return true;
    }

    __getDocumentChecksum() {
        const documentStr = this.documents.map((doc) => doc.pageContent).join(' | ');

        const hash = crypto.createHash('sha256');
        hash.update(documentStr);

        return hash.digest('hex');
    }
}

export default CustomDocumentChatModel;