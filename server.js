import express from 'express';
import bcrypt from 'bcryptjs';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());

// Serve uploads
const uploadDir = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
app.use('/uploads', express.static(uploadDir));

// ─── Multer PDF upload ────────────────────────────────────────────────────────
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const suffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, suffix + '-' + file.originalname.replace(/\s+/g, '-'));
  },
});
const upload = multer({
  storage,
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === 'application/pdf') cb(null, true);
    else cb(new Error('Seuls les fichiers PDF sont acceptés'));
  },
  limits: { fileSize: 50 * 1024 * 1024 },
});

// ─── Login route ──────────────────────────────────────────────────────────────
app.post('/auth/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const raw = await readFile(path.join(__dirname, 'db', 'db.json'), 'utf-8');
    const db = JSON.parse(raw);
    const admin = db.admin;
    if (!admin || admin.username !== username) {
      return res.status(401).json({ error: 'Identifiants invalides' });
    }
    const isValid = bcrypt.compareSync(password, admin.password);
    if (!isValid) {
      return res.status(401).json({ error: 'Identifiants invalides' });
    }
    const token = Buffer.from(`${username}:${Date.now()}`).toString('base64');
    res.json({ token, username });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ─── Upload route ─────────────────────────────────────────────────────────────
app.post('/upload', upload.single('pdf'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Aucun fichier fourni' });
  res.json({ pdfUrl: `/uploads/${req.file.filename}`, pdfName: req.file.originalname });
});

const PORT = 3002;
app.listen(PORT, () => {
  console.log(`\n✅ Auth/Upload server → http://localhost:${PORT}`);
  console.log(`🔑 POST /auth/login`);
  console.log(`📄 POST /upload\n`);
});
