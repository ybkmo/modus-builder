import { Router } from 'express';
import * as fs from 'fs';
import * as path from 'path';

export interface Project {
  id: string;
  name: string;
  userId: string;
  templateId?: string;
  blocks: any[];
  createdAt: string;
  updatedAt: string;
}

let projects: Project[] = [];
let idCounter = 1;

export function resetProjects() {
  projects = [];
  idCounter = 1;
}

const router = Router();

// GET / — list all projects
router.get('/', (req, res) => {
  res.json(projects);
});

// POST / — create a project
router.post('/', (req, res) => {
  const { name, userId, templateId } = req.body;
  if (!name || !userId) {
    return res.status(400).json({ error: 'Missing required fields: name, userId' });
  }

  let blocks: any[] = [];
  if (templateId === 'agency') {
    const templatePath = path.join(__dirname, '../data/agency-template.json');
    if (fs.existsSync(templatePath)) {
      blocks = JSON.parse(fs.readFileSync(templatePath, 'utf-8'));
    }
  }

  const project: Project = {
    id: String(idCounter++),
    name,
    userId,
    templateId,
    blocks,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  projects.push(project);
  return res.status(201).json(project);
});

// GET /:id
router.get('/:id', (req, res) => {
  const project = projects.find((p) => p.id === req.params.id);
  if (!project) {
    return res.status(404).json({ error: 'Project not found' });
  }
  return res.json(project);
});

// PUT /:id — save full blocks array
router.put('/:id', (req, res) => {
  const project = projects.find((p) => p.id === req.params.id);
  if (!project) {
    return res.status(404).json({ error: 'Project not found' });
  }
  project.blocks = req.body.blocks || [];
  project.updatedAt = new Date().toISOString();
  return res.json(project);
});

// DELETE /:id
router.delete('/:id', (req, res) => {
  const idx = projects.findIndex((p) => p.id === req.params.id);
  if (idx === -1) {
    return res.status(404).json({ error: 'Project not found' });
  }
  const removed = projects.splice(idx, 1)[0];
  return res.json(removed);
});

export default router;
