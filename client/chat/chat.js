const path = require('path');
const fs = require('fs');
const process = require('process');
const crypto = require('crypto');

const { ChatOllama, OllamaEmbeddings } = require('@langchain/ollama');
const { ChatPromptTemplate } = require('@langchain/core/prompts');
const { DirectoryLoader } = require('langchain/document_loaders/fs/directory');
const { TextLoader } = require('langchain/document_loaders/fs/text');
const { createStuffDocumentsChain } = require('langchain/chains/combine_documents');
const { RecursiveCharacterTextSplitter } = require('langchain/text_splitter');
const { FaissStore } = require('@langchain/community/vectorstores/faiss');
const { createRetrievalChain } = require('langchain/chains/retrieval');

class CustomDocumentModel {
	logFile;

	model;
	embeddings;
	prompt;
	loader;
	documents;
	vectorStore;
	documentsChain;
	retrievalChain;

	constructor() {
		this.logFile = path.join(__dirname, '..', '..', 'src', 'data', 'log.txt');
		this.init();
	}

	async init() {
		const startTime = Date.now();

		this.model = new ChatOllama({
			model: 'llama3.2:1b',
			temperature: 0.1,
		});
		console.log(`[custom-chat-model] Model initiated (${this.__getRunTime(startTime)})`);

		// Create basic prompt
		this.prompt = ChatPromptTemplate.fromTemplate(`
            You are an expert assistant specialized in answering questions based on provided documents. Use the **context** as your primary source of information, and if applicable, draw from the **chat history** for continuity. 

            - Always prioritize the **context** for your answers.
            - If the **context** is unclear or insufficient, use the **chat history** to provide continuity.
            - Respond concisely and descriptively, ensuring clarity and relevance.
            - For technical questions or code-related inquiries, provide detailed examples where appropriate.

            **Context**: {context}
            **Chat History** (if relevant): {chat_history}
            **Question**: {input}

            Your response should only answer the question and be directly based on the context or history.
		`);
		console.log(`[custom-chat-model] Prompt initiated (${this.__getRunTime(startTime)})`);

		// Initiate chain for chat with documents
		this.documentsChain = await createStuffDocumentsChain({
			llm: this.model,
			prompt: this.prompt,
		});
		console.log(`[custom-chat-model] Documents chain initiated (${this.__getRunTime(startTime)})`);

		// Load documents
		await this.__loadDocuments();
		console.log(`[custom-chat-model] Documents loaded (${this.__getRunTime(startTime)})`);

		// Create embeddings model
		this.embeddings = new OllamaEmbeddings({
			model: 'mxbai-embed-large',
		});

		// Store documents in database for fast search in all documents for model
		await this.__loadVectorStore();
		console.log(`[custom-chat-model] Vector store initiated (${this.__getRunTime(startTime)})`);

		// Get retriever from vector store
		const retriever = this.vectorStore.asRetriever({
			k: 5,
		});
		this.retrievalChain = await createRetrievalChain({
			combineDocsChain: this.documentsChain,
			retriever,
		});
		console.log(`[custom-chat-model] Retrieval chain (${this.__getRunTime(startTime)})`);

		console.log(`[custom-chat-model] Model created (${this.__getRunTime(startTime)}s)`);
	}

	__getRunTime(startTime) {
		return (Date.now() - startTime) / 1000;
	}

	async __loadDocuments() {
		const filesPath = path.join(__dirname, '..', '..', 'src', 'data', 'files');
		const loader = new DirectoryLoader(
			filesPath,
			{
				'.md': path => new TextLoader(path),
			},
			true,
			'ignore',
		);
		this.documents = await loader.load();

		// Split documents for smaller context window
		const splitter = new RecursiveCharacterTextSplitter({
			chunkSize: 1200,
			chunkOverlap: 200,
		});
		this.documents = await splitter.splitDocuments(this.documents);

		return this.documents;
	}

	async __loadVectorStore() {
		// Check if vectorstore was created at least one hour ago
		const vectorStorePath = path.join(__dirname, '..', '..', 'src', 'data', 'vectorstore');
		const vectorStoreCreatedPath = path.join(vectorStorePath, 'created.json');

		if (this.__newVectorStore()) {
			const BATCH_SIZE = 30;

			const documents = this.documents.slice();

			// Initialise vector store
			this.vectorStore = await FaissStore.fromDocuments(documents.splice(0, BATCH_SIZE), this.embeddings);

			while (documents.length) {
				await this.vectorStore.addDocuments(documents.splice(0, BATCH_SIZE));
				process.stdout.clearLine(0);
				process.stdout.cursorTo(0);
				process.stdout.write(`[custom-chat-model] Adding document splits ${documents.length} left...`);
			}

			// Saving vector store for optimisation
			this.vectorStore.save(vectorStorePath);
			fs.writeFileSync(
				vectorStoreCreatedPath,
				JSON.stringify({
					timestamp: Date.now(),
					documents: this.documents.map(d => d.pageContent),
					checksum: crypto
						.createHash('md5')
						.update(this.documents.map(d => d.pageContent).join(' | '))
						.digest('hex'),
				}),
			);
		} else {
			console.log('[custom-chat-model] Vectorstore loaded from storage');
			this.vectorStore = await FaissStore.load(vectorStorePath, this.embeddings);
		}

		return this.vectorStore;
	}

	__newVectorStore() {
		const vectorStorePath = path.join(__dirname, '..', '..', 'src', 'data', 'vectorstore');
		const vectorStoreCreatedPath = path.join(vectorStorePath, 'created.json');

		if (fs.existsSync(vectorStoreCreatedPath)) {
			const vectorStoreCreated = fs.readFileSync(vectorStoreCreatedPath);

			const { checksum } = JSON.parse(vectorStoreCreated);

			// Compare checksum to see if content changed
			if (
				checksum ===
				crypto
					.createHash('md5')
					.update(this.documents.map(d => d.pageContent).join(' | '))
					.digest('hex')
			) {
				return false;
			}
		}

		return true;
	}

	// Create function to call the chain
	async invoke(message) {
		fs.appendFileSync(this.logFile, `message: ${message}\n`);

		const startTime = Date.now();

		const response = await this.retrievalChain.invoke({
			input: message,
		});

		// Log response
		fs.appendFileSync(this.logFile, `time: ${Date.now() - startTime}ms\n`);
		fs.appendFileSync(this.logFile, `response: ${JSON.stringify(response)}\n`);
		fs.appendFileSync(this.logFile, '------------------------------------------------\n\n');

		return response.answer;
	}
}

module.exports = {
	CustomDocumentModel,
};
