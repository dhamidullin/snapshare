import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import { fileService } from '@/app/services/fileService';
import mime from 'mime-types';
import fs from 'fs';

type Props = { params: Promise<{ filename: string }> }

export async function GET(request: NextRequest, props: Props): Promise<NextResponse> {
  try {
    const filename = (await props.params).filename;

    if (!filename) {
      return NextResponse.json(
        { error: 'No filename provided' },
        { status: 400 }
      );
    }

    // Resolve the complete file path
    const filePath = path.resolve(path.join(fileService.dataPath, filename));
    
    // Ensure the file is within the data directory
    if (!filePath.startsWith(path.resolve(fileService.dataPath))) {
      console.error('Attempted path traversal:', filePath);

      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      );
    }

    const contentType = mime.lookup(filename) || 'application/octet-stream';

    // Create a readable stream from the file
    const fileStream = fs.createReadStream(filePath);
    
    // Create a response with the file stream
    return new NextResponse(fileStream as unknown as ReadableStream, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': 'inline',
      },
    });
  } catch (error) {
    console.error('File retrieval error:', error);
    return NextResponse.json(
      { error: 'Error retrieving file' },
      { status: 500 }
    );
  }
}
