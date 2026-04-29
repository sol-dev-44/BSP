import { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import { BUSINESS_INFO } from '@/config/business';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

// Rate limiting
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 10;
const RATE_WINDOW = 60 * 1000;

function checkRateLimit(ip: string): boolean {
    const now = Date.now();
    const userLimit = rateLimitMap.get(ip);

    if (!userLimit || now > userLimit.resetTime) {
        rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_WINDOW });
        return true;
    }

    if (userLimit.count >= RATE_LIMIT) return false;
    userLimit.count++;
    return true;
}

interface RetrievedDoc {
    id: string;
    title: string;
    content: string;
    category: string;
    similarity: number;
}

export async function POST(req: NextRequest) {
    const startTime = Date.now();
    const ip = req.headers.get('x-forwarded-for') || 'unknown';

    try {
        if (!checkRateLimit(ip)) {
            return Response.json(
                { error: 'Rate limit exceeded. Please try again later.' },
                { status: 429 }
            );
        }

        const { query, chatHistory = [], categoryFilter = null } = await req.json();

        if (!query || typeof query !== 'string') {
            return Response.json({ error: 'Query is required' }, { status: 400 });
        }

        if (query.length > 500) {
            return Response.json({ error: 'Query too long. Maximum 500 characters.' }, { status: 400 });
        }

        console.log(`[BSP RAG] Query from ${ip}: "${query.substring(0, 50)}..."`);

        // 1. Generate embedding
        let queryEmbedding: number[];
        try {
            const embeddingResponse = await openai.embeddings.create({
                model: 'text-embedding-3-small',
                input: query,
            });
            queryEmbedding = embeddingResponse.data[0].embedding;
        } catch (error) {
            console.error('[BSP RAG] Embedding error:', error);
            throw new Error('Failed to generate query embedding');
        }

        // 2. Semantic search in BSP-specific table
        let documents: RetrievedDoc[] = [];
        try {
            const { data, error: searchError } = await supabase.rpc('match_bsp_documents', {
                query_embedding: queryEmbedding,
                match_threshold: 0.1,
                match_count: 5,
                filter_category: categoryFilter,
            });

            if (searchError) {
                console.error('[BSP RAG] Search error:', searchError);
                throw searchError;
            }

            documents = (data || []) as RetrievedDoc[];
            console.log(`[BSP RAG] Retrieved ${documents.length} documents`);
        } catch (error) {
            console.error('[BSP RAG] Search error:', error);
            throw new Error('Failed to search knowledge base');
        }

        // 3. Build context
        const context = documents.length > 0
            ? documents
                .map((doc, i) => `[Source ${i + 1}: ${doc.title} - ${doc.category}]\n${doc.content}`)
                .join('\n\n---\n\n')
            : 'No relevant documents found in the knowledge base.';

        // 4. System prompt (BSP-specific)
        const systemPrompt = `You are **Jerry Bear**, the friendly, knowledgeable, and slightly groovy chat assistant for Big Sky Parasail. You're a parasailing bear with the soul of a Deadhead — steeped in the spirit, music, and lore of the Grateful Dead.

PERSONALITY & VOICE:
- You are warm, helpful, and genuinely enthusiastic about parasailing AND the Grateful Dead
- Weave in witty, natural references to Dead songs, lyrics, and culture — but keep them light and fun, never forced
- Examples of how to work them in: "What a long, strange trip it'll be — 400 feet above Flathead Lake!" or "Like the Dead said, 'once in a while you get shown the light,' and trust me, that Montana sunset from up there is IT"
- Song titles, lyrics, and band references should feel organic — like a Deadhead friend chatting, not a trivia bot
- You can reference songs like Truckin', Ripple, Sugar Magnolia, Friend of the Devil, Scarlet Begonias, Touch of Grey, Eyes of the World, Fire on the Mountain, Casey Jones, Box of Rain, Uncle John's Band, Estimated Prophet, Shakedown Street, and many more
- Keep the Dead references to maybe 1-2 per response — sprinkle, don't drench
- Your tone is laid-back but informative — like a knowledgeable friend who happens to love jam bands
- You can occasionally sign off with fun Dead-inspired phrases like "See you on the lot!" or "Keep on truckin'!"

CORE BUSINESS INFORMATION (Always use this over general knowledge):
- Business Name: ${BUSINESS_INFO.name}
- Location: ${BUSINESS_INFO.address.name}, ${BUSINESS_INFO.address.street}, ${BUSINESS_INFO.address.city}, ${BUSINESS_INFO.address.stateCode} ${BUSINESS_INFO.address.zip}
- Phone: ${BUSINESS_INFO.displayPhone}
- Email: ${BUSINESS_INFO.email}
- Website: ${BUSINESS_INFO.url}
- Season: ${BUSINESS_INFO.season.text}
- Schedule: Sat & Sun all day (10 AM - sunset), Tue/Thu/Fri afternoons (3 PM, 4 PM, sunset), Mon & Wed CLOSED
- Pricing: $${BUSINESS_INFO.pricing.parasail}/person (Standard), $${BUSINESS_INFO.pricing.earlyBird}/person (Early Bird — 10 AM Sat/Sun only), $${BUSINESS_INFO.pricing.sunsetCruise}/person (Sunset — last flight of day)
- Observer: $${BUSINESS_INFO.pricing.observer}/person (ride along, no parasailing)
- Add-ons: HD Photo Package $${BUSINESS_INFO.pricing.photos}, GoPro Rental $${BUSINESS_INFO.pricing.gopro}, Media Combo $${BUSINESS_INFO.pricing.combo}
- Vessel: Cloud Dancer - Ocean Pro 31, USCG inspected, 10-person capacity

${documents.length > 0 ? `Use the following additional information to answer questions naturally and conversationally:

${context}` : 'Answer based on the Core Business Information and general knowledge about parasailing and Flathead Lake, Montana.'}

Your role:
- Help customers understand what to expect on a parasailing trip
- Answer questions about the experience, what to bring, pricing, and booking
- Provide information about Flathead Lake, Glacier National Park, and the surrounding area
- Share tips about visiting Montana (attractions, dining, activities, weather, etc.)
- Be enthusiastic and groovy — make parasailing and Montana sound like the ultimate trip!
- Keep responses conversational and easy to understand (2-3 paragraphs max)
- Use markdown formatting for better readability
- Don't mention technical details like "sources" or "knowledge base" — just answer naturally
- If you don't know something specific, be honest but helpful
- IMPORTANT: Always be accurate with business info (pricing, hours, location). The Dead references are flavor — the facts must be solid.

Remember: You're Jerry Bear — a parasailing bear who loves the Grateful Dead. Help folks get stoked about their adventure while keeping the vibe mellow and fun!`;

        // 5. Stream Claude response
        const stream = await anthropic.messages.stream({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 1500,
            temperature: 0.7,
            messages: [
                ...chatHistory.slice(-6).map((msg: { role: string; content: string }) => ({
                    role: msg.role as 'user' | 'assistant',
                    content: msg.content,
                })),
                { role: 'user', content: query },
            ],
            system: systemPrompt,
        });

        // 6. Create streaming response
        const encoder = new TextEncoder();
        const readable = new ReadableStream({
            async start(controller) {
                try {
                    controller.enqueue(
                        encoder.encode(
                            `data: ${JSON.stringify({
                                type: 'sources',
                                sources: documents.map(doc => ({
                                    title: doc.title,
                                    category: doc.category,
                                    similarity: doc.similarity,
                                    preview: doc.content.substring(0, 150) + '...',
                                })),
                            })}\n\n`
                        )
                    );

                    let totalTokens = 0;
                    for await (const chunk of stream) {
                        if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
                            const text = chunk.delta.text;
                            totalTokens += text.length / 4;
                            controller.enqueue(
                                encoder.encode(`data: ${JSON.stringify({ type: 'text', text })}\n\n`)
                            );
                        }
                    }

                    const duration = Date.now() - startTime;
                    controller.enqueue(
                        encoder.encode(
                            `data: ${JSON.stringify({
                                type: 'done',
                                metadata: {
                                    duration_ms: duration,
                                    chunks_retrieved: documents.length,
                                    tokens_approx: totalTokens,
                                },
                            })}\n\n`
                        )
                    );

                    controller.close();
                } catch (error) {
                    console.error('[BSP RAG] Stream error:', error);
                    controller.enqueue(
                        encoder.encode(`data: ${JSON.stringify({ type: 'error', error: 'Failed to generate response' })}\n\n`)
                    );
                    controller.close();
                }
            },
        });

        return new Response(readable, {
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
                'X-Accel-Buffering': 'no',
            },
        });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Internal server error';
        console.error('[BSP RAG] API error:', error);
        return Response.json({ error: message }, { status: 500 });
    }
}

// Health check
export async function GET() {
    try {
        const { error } = await supabase.from('bsp_documents').select('id').limit(1);
        if (error) throw error;

        return Response.json({
            status: 'healthy',
            timestamp: new Date().toISOString(),
            services: {
                database: 'connected',
                embeddings: openai.apiKey ? 'configured' : 'missing',
                llm: anthropic.apiKey ? 'configured' : 'missing',
            },
        });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return Response.json({ status: 'unhealthy', error: message }, { status: 503 });
    }
}
