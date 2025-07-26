
import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const contentFilePath = path.join(process.cwd(), 'content.json');

async function readContent() {
  try {
    const fileContent = await fs.readFile(contentFilePath, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error('Error reading content file:', error);
    return null;
  }
}

interface WriteContentParams {
  skills: Skills;
  // Add other properties as needed
}

async function writeContent(content: WriteContentParams): Promise<void> {
  try {
    await fs.writeFile(contentFilePath, JSON.stringify(content, null, 2));
  } catch (error) {
    console.error('Error writing content file:', error);
  }
}

export async function GET() {
  const content = await readContent();
  if (!content) {
    return NextResponse.json({ error: 'Failed to read content' }, { status: 500 });
  }
  return NextResponse.json(content.skills);
}

interface Skill {
  id: string;
  name: string;
  level: string;
  // Add other properties as needed
}

interface Skills {
  skillList: Skill[];
}

interface Content {
  skills: Skills;
  // Add other properties as needed
}

export async function POST(req: Request): Promise<Response> {
  const newSkills: Skill[] = await req.json();
  const content: Content | null = await readContent();
  if (!content) {
    return NextResponse.json({ error: 'Failed to read content' }, { status: 500 });
  }

  content.skills.skillList = newSkills;
  await writeContent(content);

  return NextResponse.json({ message: 'Skills updated successfully' });
}
