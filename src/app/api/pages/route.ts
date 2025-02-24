// src/app/api/pages/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getDb, PageModel } from '@/lib/db'; // Import getDb and PageModel
import { ObjectId } from 'mongodb';

export async function GET(req: NextRequest) {
    try {
        await getDb(); // Ensure connected to the correct database
        const pages = await PageModel.find({}); // Use Mongoose model
        return NextResponse.json(pages);
    } catch (error) {
        console.error("Error fetching pages:", error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        await getDb(); // Ensure connected to the correct database
        const pageData = await req.json();

        // Create a new page using the Mongoose model
        const newPage = new PageModel({
            _id: new ObjectId(), // Generate a new ObjectId
            ...pageData, // Spread the received data
            createdAt: new Date(),
            updatedAt: new Date(),
        });


        const savedPage = await newPage.save(); // Use Mongoose's save() method

        return NextResponse.json(savedPage, { status: 201 });
    } catch (error: any) {
        console.error('Error creating page:', error);
        return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
    }
}