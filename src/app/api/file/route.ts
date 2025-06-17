import { NextRequest, NextResponse } from 'next/server';
import { fileService } from '@/app/services/fileService';

// TODO: Temporary basic auth solution
// SECURITY: This should be replaced with proper authentication
// - Move password to environment variables
// - Implement proper session-based auth
// - Add rate limiting
const password = process.env.PASSWORD || ''

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    console.log('FormData received');

    // Temporary password check until proper auth is implemented
    const submittedPassword = formData.get('password');
    if (!submittedPassword || submittedPassword !== password) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const file = formData.get('file') as File;
    console.log('File from formData:', file?.name);

    if (!file) {
      console.log('No file in request');
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    console.log('Converting file to buffer...');
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    console.log('Buffer created, size:', buffer.length);

    // Save file using FileService
    console.log('Saving file...');
    const savedFile = await fileService.saveFile(file.name, buffer);
    console.log('File saved:', savedFile);

    return NextResponse.json({
      success: true,
      filename: savedFile.filename,
      downloadUrl: `/api/file/${savedFile.filename}`
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error uploading file' },
      { status: 500 }
    );
  }
}
