import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

export async function GET(request: NextRequest) {
  try {
    // Path to the CSV file in the public directory
    const csvFilePath = path.join(process.cwd(), 'public', 'population-and-demography.csv');
    
    // Check if file exists
    if (!fs.existsSync(csvFilePath)) {
      return NextResponse.json(
        { error: 'CSV file not found' },
        { status: 404 }
      );
    }
    
    // Read the CSV file
    const csvData = fs.readFileSync(csvFilePath, 'utf-8');
    
    // Parse CSV to JSON
    const records = parse(csvData, {
      columns: true, // Use first row as column headers
      skip_empty_lines: true,
      trim: true
    });
    
    return NextResponse.json({
      success: true,
      data: records,
      count: records.length
    });
    
  } catch (error) {
    console.error('Error processing CSV:', error);
    return NextResponse.json(
      { error: 'Failed to process CSV file' },
      { status: 500 }
    );
  }
}