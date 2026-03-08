import { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const CHUNK_SIZE = 500;
const CHUNK_OVERLAP = 50;

function chunkText(text: string, chunkSize: number, overlap: number): string[] {
    const words = text.split(/\s+/);
    const chunks: string[] = [];

    for (let i = 0; i < words.length; i += chunkSize - overlap) {
        const chunk = words.slice(i, i + chunkSize).join(' ');
        if (chunk.trim()) chunks.push(chunk);
    }

    return chunks.length > 0 ? chunks : [text];
}

async function extractTextFromPDF(buffer: Buffer): Promise<string> {
    try {
        const pdfParse = (await import('pdf-parse-fork')).default;
        const data = await pdfParse(buffer);
        return data.text;
    } catch (error) {
        console.error('[BSP Upload] PDF parsing error:', error);
        throw new Error('Failed to parse PDF file');
    }
}

async function generateEmbedding(text: string): Promise<number[]> {
    const response = await openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: text,
    });
    return response.data[0].embedding;
}

// POST: Upload document
export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File | null;
        const textInput = formData.get('text') as string | null;
        const title = formData.get('title') as string;
        const category = formData.get('category') as string;

        if (!title || !category) {
            return Response.json({ error: 'Title and category are required' }, { status: 400 });
        }

        const validCategories = ['safety', 'equipment', 'weather', 'emergency', 'general'];
        if (!validCategories.includes(category)) {
            return Response.json({ error: 'Invalid category' }, { status: 400 });
        }

        let text = '';
        let fileType: 'pdf' | 'txt' | 'text_input' = 'text_input';

        if (file) {
            if (file.size > MAX_FILE_SIZE) {
                return Response.json({ error: 'File too large. Maximum 10MB.' }, { status: 400 });
            }

            const buffer = Buffer.from(await file.arrayBuffer());

            if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
                fileType = 'pdf';
                text = await extractTextFromPDF(buffer);
            } else if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
                fileType = 'txt';
                text = buffer.toString('utf-8');
            } else {
                return Response.json({ error: 'Only PDF and TXT files allowed.' }, { status: 400 });
            }
        } else if (textInput) {
            text = textInput;
        } else {
            return Response.json({ error: 'File or text input required' }, { status: 400 });
        }

        if (!text.trim()) {
            return Response.json({ error: 'Document is empty' }, { status: 400 });
        }

        console.log(`[BSP Upload] Processing: "${title}" (${fileType}, ${text.length} chars)`);

        const chunks = chunkText(text, CHUNK_SIZE, CHUNK_OVERLAP);
        console.log(`[BSP Upload] Created ${chunks.length} chunks`);

        for (let i = 0; i < chunks.length; i++) {
            const embedding = await generateEmbedding(chunks[i]);

            const { error } = await supabase.from('bsp_documents').insert({
                title,
                content: chunks[i],
                category,
                file_type: fileType,
                chunk_index: i,
                total_chunks: chunks.length,
                embedding,
                metadata: {
                    original_length: text.length,
                    chunk_length: chunks[i].length,
                    uploaded_at: new Date().toISOString(),
                },
            });

            if (error) {
                console.error('[BSP Upload] Supabase error:', error);
                throw new Error('Failed to store document chunk');
            }
        }

        console.log(`[BSP Upload] Successfully uploaded ${chunks.length} chunks`);

        return Response.json({
            success: true,
            title,
            category,
            file_type: fileType,
            chunks: chunks.length,
            total_chars: text.length,
        });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Internal server error';
        console.error('[BSP Upload] Error:', error);
        return Response.json({ error: message }, { status: 500 });
    }
}

// GET: List documents
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const category = searchParams.get('category');

        let query = supabase
            .from('bsp_documents')
            .select('title, category, file_type, chunk_index, total_chunks, created_at, metadata');

        if (category) query = query.eq('category', category);

        const { data, error } = await query.order('created_at', { ascending: false });
        if (error) throw error;

        const documentsMap = new Map();
        data?.forEach((chunk: Record<string, unknown>) => {
            if (!documentsMap.has(chunk.title)) {
                documentsMap.set(chunk.title, {
                    title: chunk.title,
                    category: chunk.category,
                    file_type: chunk.file_type,
                    total_chunks: chunk.total_chunks,
                    created_at: chunk.created_at,
                    metadata: chunk.metadata,
                });
            }
        });

        return Response.json({ documents: Array.from(documentsMap.values()) });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Internal server error';
        return Response.json({ error: message }, { status: 500 });
    }
}

// DELETE: Remove document
export async function DELETE(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const title = searchParams.get('title');

        if (!title) {
            return Response.json({ error: 'Title is required' }, { status: 400 });
        }

        const { error } = await supabase
            .from('bsp_documents')
            .delete()
            .eq('title', title);

        if (error) throw error;

        console.log(`[BSP Upload] Deleted document: "${title}"`);
        return Response.json({ success: true, title });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Internal server error';
        return Response.json({ error: message }, { status: 500 });
    }
}
