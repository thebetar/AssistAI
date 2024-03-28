const path = require('path');
const fs = require('fs');

const { ChatOllama } = require('@langchain/community/chat_models/ollama');
const { DirectoryLoader } = require('langchain/document_loaders/fs/directory');
const { TextLoader } = require('langchain/document_loaders/fs/text');
const { ChatPromptTemplate } = require('@langchain/core/prompts');
const { createStuffDocumentsChain } = require('langchain/chains/combine_documents');

const filteredKeywords = require('./filteredKeywords') || [];

const logFile = path.join(__dirname, '..', 'data', 'log.txt');

const chatModel = new ChatOllama({
	baseUrl: 'http://localhost:11434',
	model: 'tinyllama',
});

const prompt =
	ChatPromptTemplate.fromTemplate(`Answer the following question based only on the provided context, keep the answer short to a max of 100 words:

<context>
{context}
</context>

Question: {input}`);

let docs;
let documentChain;

(async function () {
	const filesPath = path.join(__dirname, '..', 'data', 'files');

	const directoryLoader = new DirectoryLoader(
		filesPath,
		{
			'.md': path => new TextLoader(path),
		},
		true,
		'ignore',
	);

	docs = await directoryLoader.load();

	documentChain = await createStuffDocumentsChain({
		llm: chatModel,
		prompt,
	});
})();

function countKeywords(doc, keywords) {
	return keywords.reduce((acc, keyword) => {
		if (doc.pageContent.includes(keyword)) {
			// Gets total occurences +1 by splitting into array everytime occurence is found
			acc += doc.pageContent.split(keyword).length - 1;
		}

		return acc;
	}, 0);
}

function filterKeywords(keyword, docsContent) {
	if (filteredKeywords.includes(keyword)) {
		return false;
	}
	const occurences = docsContent.reduce((acc, content) => {
		return acc + content.split(keyword).length - 1;
	}, 0);

	// Occurs more than once and less than 200 times (to filter out common words like 'the', 'and', etc.)
	return 1 < occurences < 200;
}

function getFilteredDocuments(filter) {
	const docsContent = docs?.map(doc => doc.pageContent.toLowerCase());

	const keywords = filter
		.toLowerCase()
		.replace('?', '')
		.split(' ')
		.filter(keyword => filterKeywords(keyword, docsContent));

	fs.appendFileSync(logFile, `keywords: ${keywords.join(', ')}\n`);

	return docs
		.reduce((acc, doc) => {
			if (keywords.some(keyword => doc.pageContent.toLowerCase().includes(keyword))) {
				acc.push({
					doc,
					score: countKeywords(doc, keywords),
				});
			}

			return acc;
		}, [])
		.sort((a, b) => b.score - a.score)
		.map(doc => doc.doc)
		.slice(0, 4);
}

async function invokeModel(message) {
	fs.appendFileSync(logFile, `message: ${message}\n`);

	const documents = getFilteredDocuments(message);

	const startTime = Date.now();

	const response = await documentChain.invoke({
		input: message,
		context: documents,
	});

	fs.appendFileSync(logFile, `time: ${Date.now() - startTime}ms\n`);
	fs.appendFileSync(logFile, `response: ${response}\n`);
	fs.appendFileSync(logFile, '------------------------------------------------\n\n');

	return response;
}

module.exports = {
	invokeModel,
};
