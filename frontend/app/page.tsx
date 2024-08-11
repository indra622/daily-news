"use client";

import React, { useState, useEffect } from 'react';
import Article from './components/Article';

type ArticleType = {
    title: string;
    link: string;
    summary: string;
};

const fetchWithTimeout = (url: string, options: any = {}, timeout = 20000) => {
    return new Promise<Response>((resolve, reject) => {
        const timer = setTimeout(() => {
            reject(new Error('Request timed out'));
        }, timeout);

        fetch(url, options)
            .then(response => {
                clearTimeout(timer);
                resolve(response);
            })
            .catch(err => {
                clearTimeout(timer);
                reject(err);
            });
    });
};

export default function Home() {
    const [articles, setArticles] = useState<ArticleType[]>([]);
    const [selectedSummaries, setSelectedSummaries] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchArticles = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await fetchWithTimeout('http://backend:8000/api/articles', {}, 10000);
                if (!res.ok) {
                    throw new Error('Failed to fetch articles');
                }
                const data = await res.json();
                setArticles(data.articles);
            } catch (error) {
                setError(error instanceof Error ? error.message : 'An unknown error occurred');
                console.error('Failed to fetch articles:', error);
            } finally {
                setLoading(false);
            }
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

    const handleGenerateSummary = (summary?: string) => {
        const combinedSummary = summary
            ? summary
            : selectedSummaries.join('\n\n');
        const chatGptUrl = `https://chat.openai.com/chat?prompt=${encodeURIComponent(
            `Here are the summarized articles:\n${combinedSummary}`
        )}`;
        window.open(chatGptUrl, '_blank');
    };

    return (
        <div>
            <h1>Daily AI News Summary</h1>
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p>Error: {error}</p>
            ) : (
                <>
                    {selectedSummaries.length > 0 && (
                        <button onClick={() => handleGenerateSummary()}>
                            Generate Combined Daily Summary
                        </button>
                    )}
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
                            <button onClick={() => handleGenerateSummary(article.summary)}>
                                Generate Summary for This Article
                            </button>
                        </div>
                    ))}
                </>
            )}
        </div>
    );
}
