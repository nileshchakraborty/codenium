import { AIService } from '../../../domain/ports/AIService';
import axios, { AxiosInstance } from 'axios';
import axiosRetry from 'axios-retry';

export class OllamaService implements AIService {
    private baseUrl: string;
    private model: string;
    private apiKey?: string;
    private client: AxiosInstance;

    constructor() {
        this.baseUrl = process.env.OLLAMA_BASE_URL || 'http://127.0.0.1:11434';
        this.model = process.env.OLLAMA_MODEL || 'deepseek-coder';
        this.apiKey = process.env.OLLAMA_API_KEY;

        console.log(`OllamaService initialized with model: ${this.model} at ${this.baseUrl}`);

        const timeout = parseInt(process.env.AI_TIMEOUT || '60') * 1000;
        this.client = axios.create({
            timeout: timeout, 
        });

        axiosRetry(this.client, {
            retries: 3,
            retryDelay: axiosRetry.exponentialDelay, // 1s, 2s, 4s...
            retryCondition: (error) => {
                // Retry on network errors or 5xx status codes
                return axiosRetry.isNetworkOrIdempotentRequestError(error) ||
                    (error.response?.status ? error.response.status >= 500 : false);
            }
        });
    }

    private async chat(messages: any[], format?: string): Promise<string> {
        try {
            const headers: Record<string, string> = { 'Content-Type': 'application/json' };
            if (this.apiKey) {
                headers['Authorization'] = `Bearer ${this.apiKey}`;
            }

            const normalizedBaseUrl = this.baseUrl.replace(/\/+$/, '');
            let url = '';
            
            // If the URL already looks like a full endpoint, use it directly
            if (normalizedBaseUrl.endsWith('/api/chat') || normalizedBaseUrl.endsWith('/chat')) {
                url = normalizedBaseUrl;
            } else if (normalizedBaseUrl.endsWith('/api')) {
                url = `${normalizedBaseUrl}/chat`;
            } else {
                url = `${normalizedBaseUrl}/api/chat`;
            }

            console.log(`OllamaService calling: ${url}`);

            const response = await this.client.post(url, {
                model: this.model,
                messages,
                stream: false,
                format: format
            }, {
                headers
            });

            return response.data.message.content;
        } catch (error: any) {
            console.error("Ollama Service Error:", error.message);
            // Axios error handling
            if (error.response) {
                console.error("Ollama Status:", error.response.status);
                console.error("Ollama Data:", error.response.data);
            }
            throw error;
        }
    }

    async generateHint(problem: string, code: string): Promise<any> {
        try {
            const content = await this.chat([
                { role: "system", content: "You are a helpful coding assistant. Provide a short, cryptic but helpful hint for the user's current code state. Do not give the answer." },
                { role: "user", content: `Problem: ${problem}\n\nCurrent Code:\n${code}` }
            ]);
            return { hint: content };
        } catch (error: any) {
            return { error: error.message };
        }
    }

    async explainSolution(code: string, title: string): Promise<any> {
        try {
            const content = await this.chat([
                { role: "system", content: "Explain this solution code step-by-step. specific focus on time and space complexity." },
                { role: "user", content: `Problem: ${title}\n\nCode:\n${code}` }
            ]);
            return { explanation: content };
        } catch (error: any) {
            return { error: error.message };
        }
    }

    async answerQuestion(problemTitle: string, problemDesc: string, chatHistory: any[], userMessage: string, systemPrompt?: string): Promise<any> {
        try {
            const defaultSystemPrompt = "You are a Socratic LeetCode tutor. Help the user solve the problem by asking guiding questions. Do not give the answer directly unless asked repeatedly. Keep responses concise.";
            const messages: any[] = [
                { role: "system", content: systemPrompt || defaultSystemPrompt },
                { role: "system", content: `Context: ${problemTitle}. ${problemDesc}` }
            ];

            chatHistory.forEach(msg => messages.push({ role: msg.role, content: msg.content }));
            messages.push({ role: "user", content: userMessage });

            const content = await this.chat(messages);
            return { response: content };
        } catch (error: any) {
            return { error: error.message };
        }
    }

    async generateSolution(problemTitle: string, problemDesc: string): Promise<any> {
        try {
            const content = await this.chat([
                { role: "system", content: "You are an expert algorithm engineer. Generate a solution for the given problem. Return ONLY a JSON object with keys: 'code', 'timeComplexity', 'spaceComplexity', 'explanation'. The 'code' should be a complete valid javascript/typescript function." },
                { role: "user", content: `Problem: ${problemTitle}\n${problemDesc}` }
            ], 'json');

            return JSON.parse(content);
        } catch (error: any) {
            console.error("AI Error:", error);
            return { error: error.message };
        }
    }

    async analyzeDesign(problemTitle: string, problemDesc: string, elements: string[], expectedComponents?: string[]): Promise<any> {
        try {
            const systemPrompt = `You are a System Design Interviewer. Analyze the user's architecture drawing based on the text labels provided. 
Problem: ${problemTitle}
Description: ${problemDesc}
Expected Components: ${expectedComponents?.join(', ') || 'N/A'}

Analyze if the labels provided (${elements.join(', ')}) cover the necessary components for a scalable, highly available system. 
Point out missing critical components, suggest improvements, and give a brief overall feedback. Keep it constructive and concise.`;

            const content = await this.chat([
                { role: "system", content: systemPrompt },
                { role: "user", content: `My architecture has these components: ${elements.join(', ')}` }
            ]);

            return { content };
        } catch (error: any) {
            return { error: error.message };
        }
    }
}
