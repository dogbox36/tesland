'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';

interface Quote {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    model: string;
    serviceType: string;
    message: string;
    status: string;
    createdAt: string;
}

export default function QuotesPage() {
    const [quotes, setQuotes] = useState<Quote[]>([]);
    const [expandedId, setExpandedId] = useState<string | null>(null);

    useEffect(() => {
        fetchQuotes();
    }, []);

    const fetchQuotes = async () => {
        try {
            const res = await api.get('/quotes');
            setQuotes(res.data);
        } catch (err) {
            console.error('Failed to fetch quotes', err);
        }
    };

    const updateStatus = async (id: string, status: string) => {
        try {
            await api.put(`/quotes/${id}/status`, { status });
            fetchQuotes();
        } catch (err) {
            console.error('Failed to update status', err);
            alert('Failed to update status');
        }
    };

    const toggleExpand = (id: string) => {
        setExpandedId(expandedId === id ? null : id);
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">Quote Requests</h1>

            <div className="bg-gray-800 rounded-lg overflow-hidden">
                <table className="w-full text-left table-fixed">
                    <thead className="bg-gray-700 text-gray-300 uppercase text-xs">
                        <tr>
                            <th className="px-6 py-4 w-1/4">Client</th>
                            <th className="px-6 py-4 w-1/5">Vehicle</th>
                            <th className="px-6 py-4 w-1/3">Request</th>
                            <th className="px-6 py-4 w-1/12">Status</th>
                            <th className="px-6 py-4 w-1/6">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                        {quotes.map((quote) => (
                            <tr key={quote.id} className="hover:bg-gray-700/50 transition-colors">
                                <td className="px-6 py-4 align-top">
                                    <div className="font-medium text-white">{quote.name}</div>
                                    <div className="text-sm text-gray-400">{quote.email}</div>
                                    {quote.phone && <div className="text-sm text-gray-500">{quote.phone}</div>}
                                </td>
                                <td className="px-6 py-4 align-top">
                                    <div className="text-white">{quote.model}</div>
                                    <div className="text-sm text-gray-400">{quote.serviceType}</div>
                                </td>
                                <td
                                    className={`px-6 py-4 text-gray-300 cursor-pointer hover:bg-gray-700/80 transition-colors align-top ${expandedId === quote.id ? 'whitespace-pre-wrap break-words' : 'truncate'
                                        }`}
                                    onClick={() => toggleExpand(quote.id)}
                                    title={expandedId === quote.id ? '' : 'Click to expand'}
                                >
                                    {quote.message}
                                    {expandedId !== quote.id && (
                                        <span className="text-gray-500 text-xs ml-2">(more)</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 align-top">
                                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${quote.status === 'PENDING' ? 'bg-yellow-900 text-yellow-500' :
                                            quote.status === 'REPLIED' ? 'bg-green-900 text-green-500' :
                                                'bg-gray-700 text-gray-400'
                                        }`}>
                                        {quote.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 align-top">
                                    <div className="flex flex-col gap-2">
                                        {quote.status === 'PENDING' && (
                                            <button
                                                onClick={() => updateStatus(quote.id, 'REPLIED')}
                                                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs font-bold transition-colors w-full"
                                            >
                                                MARK REPLIED
                                            </button>
                                        )}
                                        {quote.status === 'REPLIED' && (
                                            <button
                                                onClick={() => updateStatus(quote.id, 'ARCHIVED')}
                                                className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-xs font-bold transition-colors w-full"
                                            >
                                                ARCHIVE
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {quotes.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">No quote requests found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
