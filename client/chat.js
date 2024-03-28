const path = require('path');
const { ChatOllama } = require('@langchain/community/chat_models/ollama');
const { DirectoryLoader } = require('langchain/document_loaders/fs/directory');
const { TextLoader } = require('langchain/document_loaders/fs/text');
const { ChatPromptTemplate } = require('@langchain/core/prompts');
const { createStuffDocumentsChain } = require('langchain/chains/combine_documents');

const chatModel = new ChatOllama({
	baseUrl: 'http://localhost:11434',
	model: 'tinyllama',
});

const prompt =
	ChatPromptTemplate.fromTemplate(`Answer the following question based only on the provided context, keep the answer short to a max of 100 words.:

<context>
{context}
</context>

Question: {input}`);

let docs;
let documentChain;

(async function () {
	const filesPath = path.join(__dirname, 'data', 'files');

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
			acc++;
		}

		return acc;
	}, 0);
}

function getFilteredDocuments(filter) {
	const keywords = filter.replace('?', '').split(' ');

	return docs
		.reduce((acc, doc) => {
			if (keywords.some(keyword => doc.pageContent.includes(keyword))) {
				acc.push({
					doc,
					score: countKeywords(doc, keywords),
				});
			}

			return acc;
		}, [])
		.sort((a, b) => b.score - a.score)
		.map(doc => doc.doc)
		.slice(0, 20);
}

async function invokeModel(message) {
	const documents = getFilteredDocuments(message);

	const response = await documentChain.invoke({
		input: message,
		context: documents,
	});

	return response;
}

module.exports = {
	invokeModel,
};
