"use client";

import React, { useState, useEffect } from 'react';
import Article from './components/Article';

type ArticleType = {
    title: string;
    link: string;
    summary: string;
};

export default function Home() {
    const [articles, setArticles] = useState<ArticleType[]>([]);
    const [selectedSummaries, setSelectedSummaries] = useState<string[]>([]);

    useEffect(() => {
        const fetchArticles = async () => {
            const res = await fetch('http://localhost:8000/api/articles');
            const data = await res.json();
            setArticles(data.articles);
        };

        fetchArticles();
    }, []);

    const handleCheckboxChange = (summary: string) => {
        setSelectedSummaries((prevSelected) =>
            prevSelected.includes(summary)
                ? prevSelected.filter((item) => item !== summary)
                : [...prevSelected, summary]
        );
    };

    const handleGenerateSummary = () => {
        const combinedSummary = selectedSummaries.join('\n\n');
        const chatGptUrl = `https://chat.openai.com/chat?prompt=${encodeURIComponent(
            `Here are the summarized articles:\n${combinedSummary}`
        )}`;
        window.open(chatGptUrl, '_blank');
    };

    return (
        <div>
            <h1>Daily AI News Summary</h1>
            {articles.map((article, index) => (
                <div key={index}>
                    <input
                        type="checkbox"
                        onChange={() => handleCheckboxChange(article.summary)}
                    />
                    <Article
                        title={article.title}
                        link={article.link}
                        summary={article.summary}
                    />
                </div>
            ))}
            {selectedSummaries.length > 0 && (
                <button onClick={handleGenerateSummary}>Generate Daily Summary</button>
            )}
        </div>
    );
}
