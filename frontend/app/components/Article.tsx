import React from 'react';

type ArticleProps = {
    title: string;
    link: string;
    summary: string;
};

function Article({ title, link, summary }: ArticleProps) {
    const handleSummarize = () => {
        const chatGptUrl = `https://chat.openai.com/chat?prompt=${encodeURIComponent(
            `Summarize this article: ${summary}`
        )}`;
        window.open(chatGptUrl, '_blank');
    };

    return (
        <div>
            <h2>{title}</h2>
            <p>{summary}</p>
            <button onClick={handleSummarize}>Summarize with ChatGPT</button>
            <a href={link} target="_blank" rel="noopener noreferrer">
                Read full article
            </a>
        </div>
    );
}

export default Article;
