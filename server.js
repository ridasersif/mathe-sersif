import express from 'express';
import bcrypt from 'bcryptjs';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { readFile, writeFile } from 'fs/promises';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const DB_PATH = path.join(__dirname, 'db', 'db.json');

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());

// ─── Helpers ──────────────────────────────────────────────────────────────────
async function readDB() {
  const raw = await readFile(DB_PATH, 'utf-8');
  return JSON.parse(raw);
}
async function writeDB(data) {
  await writeFile(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

// ─── Serve uploads ────────────────────────────────────────────────────────────
const uploadDir = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
app.use('/uploads', express.static(uploadDir));

// ─── Multer PDF upload ────────────────────────────────────────────────────────
const pdfStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const suffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, suffix + '-' + file.originalname.replace(/\s+/g, '-'));
  },
});
const uploadPDF = multer({
  storage: pdfStorage,
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === 'application/pdf') cb(null, true);
    else cb(new Error('Seuls les fichiers PDF sont acceptés'));
  },
  limits: { fileSize: 50 * 1024 * 1024 },
});

// ─── Multer Image upload ──────────────────────────────────────────────────────
const imgStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, 'profile-' + Date.now() + ext);
  },
});
const uploadImage = multer({
  storage: imgStorage,
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Seuls les fichiers image sont acceptés'));
  },
  limits: { fileSize: 5 * 1024 * 1024 },
});

// ─── Login route ──────────────────────────────────────────────────────────────
app.post('/auth/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const db = await readDB();
    const users = db.users || [];
    const user = users.find((u) => u.username === username || u.email === username);
    if (!user) {
      return res.status(401).json({ error: 'Identifiants invalides' });
    }
    const isValid = bcrypt.compareSync(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: 'Identifiants invalides' });
    }
    const token = Buffer.from(`${username}:${user.role}:${Date.now()}`).toString('base64');
    res.json({ token, username, role: user.role });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ─── Change password route ────────────────────────────────────────────────────
app.post('/auth/change-password', async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  try {
    const db = await readDB();
    const user = db.users.find((u) => u.role === 'admin'); // Assuming only one admin for now
    if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé' });

    const isValid = bcrypt.compareSync(oldPassword, user.password);
    if (!isValid) {
      return res.status(401).json({ error: 'L\'ancien mot de passe est incorrect' });
    }

    user.password = bcrypt.hashSync(newPassword, 10);
    await writeDB(db);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ─── Profile routes ───────────────────────────────────────────────────────────
app.get('/auth/profile', async (_req, res) => {
  try {
    const db = await readDB();
    res.json(db.profile || {});
  } catch {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.patch('/auth/profile', async (req, res) => {
  try {
    const db = await readDB();
    db.profile = {
      ...db.profile,
      ...req.body,
      updatedAt: new Date().toISOString(),
    };
    await writeDB(db);
    res.json(db.profile);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de la mise à jour du profil' });
  }
});

// ─── Upload profile photo ─────────────────────────────────────────────────────
app.post('/auth/upload-photo', uploadImage.single('photo'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Aucune image fournie' });
  const photoUrl = `/uploads/${req.file.filename}`;
  try {
    const db = await readDB();
    
    // Delete old photo if it exists
    if (db.profile.photo) {
      const oldPath = path.join(__dirname, 'public', db.profile.photo);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    db.profile = { ...db.profile, photo: photoUrl, updatedAt: new Date().toISOString() };
    await writeDB(db);
    res.json({ photoUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de la sauvegarde' });
  }
});

// ─── Generic Image Upload ─────────────────────────────────────────────────────
app.post('/upload-image', uploadImage.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Aucune image fournie' });
  res.json({ imageUrl: `/uploads/${req.file.filename}` });
});

// ─── Upload PDF route ─────────────────────────────────────────────────────────
app.post('/upload', uploadPDF.single('pdf'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Aucun fichier fourni' });
  res.json({ pdfUrl: `/uploads/${req.file.filename}`, pdfName: req.file.originalname });
});

const PORT = 3002;
app.listen(PORT, () => {
  console.log(`\n✅ Auth/Upload server → http://localhost:${PORT}`);
  console.log(`🔑 POST /auth/login`);
  console.log(`👤 GET  /auth/profile`);
  console.log(`✏️  PATCH /auth/profile`);
  console.log(`🖼️  POST /auth/upload-photo`);
  console.log(`🖼️  POST /upload-image`);
  console.log(`📄 POST /upload\n`);
});
