'use client';

import { useEffect, useRef, useState } from 'react';
import { getProfile, updateProfile, uploadProfilePhoto, Profile, changePassword, EducationItem } from '@/lib/api';
import { 
  User, 
  FileText, 
  GraduationCap, 
  BarChart3, 
  Link as LinkIcon, 
  Lock, 
  Camera, 
  Trash2, 
  Save, 
  Plus, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  MapPin,
  Sigma,
  Calendar
} from 'lucide-react';



export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'info' | 'bio' | 'education' | 'stats' | 'social' | 'security'>('info');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Password change state
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    getProfile()
      .then(setProfile)
      .catch(() => setError('Impossible de charger le profil'))
      .finally(() => setLoading(false));
  }, []);

  function showSuccess(msg: string) {
    setSuccess(msg);
    setTimeout(() => setSuccess(''), 3000);
  }

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Les nouveaux mots de passe ne correspondent pas');
      return;
    }
    setChangingPassword(true);
    setError('');
    try {
      await changePassword(oldPassword, newPassword);
      showSuccess('Mot de passe changé avec succès !');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setError(err.message || 'Erreur lors du changement de mot de passe');
    } finally {
      setChangingPassword(false);
    }
  }

  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !profile) return;
    setUploadingPhoto(true);
    setError('');
    try {
      const { photoUrl } = await uploadProfilePhoto(file);
      setProfile((p) => p ? { ...p, photo: photoUrl } : p);
      showSuccess('Photo mise à jour avec succès !');
    } catch {
      setError('Erreur lors de l\'upload de la photo');
    } finally {
      setUploadingPhoto(false);
    }
  }

  async function handleSave() {
    if (!profile) return;
    setSaving(true);
    setError('');
    try {
      const updated = await updateProfile(profile);
      setProfile(updated);
      showSuccess('Profil mis à jour avec succès !');
    } catch {
      setError('Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  }

  function setField<K extends keyof Profile>(key: K, value: Profile[K]) {
    setProfile((p) => p ? { ...p, [key]: value } : p);
  }

  function setStatField(key: keyof Profile['stats'], value: number) {
    setProfile((p) => p ? { ...p, stats: { ...p.stats, [key]: value } } : p);
  }

  function setSocialField(key: keyof Profile['socialLinks'], value: string) {
    setProfile((p) => p ? { ...p, socialLinks: { ...p.socialLinks, [key]: value } } : p);
  }

  function updateSpecialty(index: number, value: string) {
    if (!profile) return;
    const specialties = [...profile.specialties];
    specialties[index] = value;
    setField('specialties', specialties);
  }

  function addSpecialty() {
    if (!profile) return;
    setField('specialties', [...profile.specialties, '']);
  }

  function removeSpecialty(index: number) {
    if (!profile) return;
    setField('specialties', profile.specialties.filter((_, i) => i !== index));
  }

  function updateEducation(index: number, field: keyof EducationItem, value: string) {
    if (!profile) return;
    const education = profile.education.map((e: EducationItem, i: number) =>
      i === index ? { ...e, [field]: value } : e
    );
    setField('education', education);
  }

  function addEducation() {
    if (!profile) return;
    setField('education', [...profile.education, { year: '', degree: '', institution: '' }]);
  }

  function removeEducation(index: number) {
    if (!profile) return;
    setField('education', profile.education.filter((_, i) => i !== index));
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
        <div className="spinner" />
      </div>
    );
  }

  if (!profile) {
    return <div className="card" style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>Profil introuvable.</div>;
  }

  const tabs = [
    { id: 'info', label: 'Informations', icon: User },
    { id: 'bio', label: 'Biographie', icon: FileText },
    { id: 'education', label: 'Formation', icon: GraduationCap },
    { id: 'stats', label: 'Statistiques', icon: BarChart3 },
    { id: 'social', label: 'Liens', icon: LinkIcon },
    { id: 'security', label: 'Sécurité', icon: Lock },
  ] as const;

  return (
    <div>
      {/* Header */}
      <div className="dashboard-header" style={{ marginBottom: 24 }}>
        <div>
          <h1 className="title-md">Mon Profil</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: 4 }}>
            Gérez vos informations personnelles et académiques
          </p>
        </div>
        <button
          id="save-profile-btn"
          onClick={handleSave}
          disabled={saving}
          className="btn btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: 8 }}
        >
          {saving ? <span className="spinner" style={{ width: 16, height: 16 }} /> : <Save size={18} />}
          {saving ? 'Sauvegarde...' : 'Enregistrer'}
        </button>
      </div>

      {/* Alerts */}
      {success && (
        <div style={{ background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.3)', borderRadius: 10, padding: '12px 16px', marginBottom: 20, color: '#4ade80', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: 8 }}>
          <CheckCircle2 size={16} /> {success}
        </div>
      )}
      {error && (
        <div style={{ background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.3)', borderRadius: 10, padding: '12px 16px', marginBottom: 20, color: '#f87171', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: 8 }}>
          <AlertCircle size={16} /> {error}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 24, alignItems: 'start' }}>
        {/* Photo Card */}
        <div className="card" style={{ textAlign: 'center', padding: 28 }}>
          <div style={{ position: 'relative', display: 'inline-block', marginBottom: 16 }}>
            <div style={{
              width: 120, height: 120, borderRadius: '50%',
              background: profile.photo
                ? `url(${profile.photo}) center/cover`
                : 'linear-gradient(135deg, var(--accent-blue), var(--accent-gold))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '3rem', margin: '0 auto',
              border: '3px solid var(--border)',
              boxShadow: '0 0 0 4px rgba(99,102,241,0.15)',
            }}>
              {!profile.photo && <User size={60} color="#fff" strokeWidth={1} />}
            </div>
            <button
              id="upload-photo-btn"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingPhoto}
              style={{
                position: 'absolute', bottom: 0, right: 0,
                width: 34, height: 34, borderRadius: '50%',
                background: 'var(--accent-blue)', border: '2px solid var(--bg-primary)',
                color: '#fff', cursor: 'pointer', fontSize: '1rem',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
              title="Changer la photo"
            >
              {uploadingPhoto ? '⏳' : <Camera size={16} />}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handlePhotoUpload}
            />
          </div>

          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.1rem', fontWeight: 700, marginBottom: 4 }}>
            {profile.fullName || `${profile.firstName} ${profile.lastName}`}
          </h2>
          <p style={{ color: 'var(--accent-gold)', fontSize: '0.8rem', fontWeight: 500, marginBottom: 8 }}>
            {profile.title}
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            <MapPin size={12} /> {profile.location}
          </p>

          <div style={{ marginTop: 20, padding: '16px 0', borderTop: '1px solid var(--border)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[
                { label: 'Années', value: profile.stats.yearsOfExperience, color: 'var(--accent-blue)', icon: Calendar },
                { label: 'Publications', value: profile.stats.publications, color: 'var(--accent-gold)', icon: FileText },
                { label: 'Cours', value: profile.stats.courses, color: '#4ade80', icon: GraduationCap },
                { label: 'Étudiants', value: profile.stats.students + '+', color: '#c084fc', icon: User },
              ].map((s) => (
                <div key={s.label} style={{ background: 'var(--bg-primary)', borderRadius: 8, padding: '10px 8px' }}>
                  <div style={{ fontSize: '1.3rem', fontWeight: 700, color: s.color }}>{s.value}</div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                    <s.icon size={10} /> {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginTop: 16, fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            <Clock size={12} /> Mis à jour le {new Date(profile.updatedAt).toLocaleDateString('fr-FR')}
          </div>
        </div>

        {/* Form */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          {/* Tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', background: 'var(--bg-secondary)', overflowX: 'auto' }}>
            {tabs.map((tab) => {
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.id}
                  id={`tab-${tab.id}`}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    flex: 1, padding: '14px 8px', border: 'none', cursor: 'pointer',
                    background: 'transparent',
                    borderBottom: activeTab === tab.id ? '2px solid var(--accent-blue)' : '2px solid transparent',
                    color: activeTab === tab.id ? 'var(--accent-blue)' : 'var(--text-muted)',
                    fontSize: '0.78rem', fontWeight: activeTab === tab.id ? 600 : 400,
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                    transition: 'all 0.2s',
                    minWidth: 80
                  }}
                >
                  <TabIcon size={18} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div style={{ padding: 28 }}>
            {/* ── Tab: Informations ── */}
            {activeTab === 'info' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div className="form-group">
                    <label className="form-label">Prénom</label>
                    <input id="field-firstName" className="form-input" value={profile.firstName}
                      onChange={(e) => setField('firstName', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Nom</label>
                    <input id="field-lastName" className="form-input" value={profile.lastName}
                      onChange={(e) => setField('lastName', e.target.value)} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Nom complet affiché</label>
                  <input id="field-fullName" className="form-input" value={profile.fullName}
                    onChange={(e) => setField('fullName', e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Titre / Grade</label>
                  <input id="field-title" className="form-input" value={profile.title}
                    onChange={(e) => setField('title', e.target.value)} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div className="form-group">
                    <label className="form-label">Email</label>
                    <input id="field-email" className="form-input" type="email" value={profile.email}
                      onChange={(e) => setField('email', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Téléphone</label>
                    <input id="field-phone" className="form-input" value={profile.phone}
                      onChange={(e) => setField('phone', e.target.value)} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Institution</label>
                  <input id="field-institution" className="form-input" value={profile.institution}
                    onChange={(e) => setField('institution', e.target.value)} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div className="form-group">
                    <label className="form-label">Faculté</label>
                    <input id="field-faculty" className="form-input" value={profile.faculty}
                      onChange={(e) => setField('faculty', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Département</label>
                    <input id="field-department" className="form-input" value={profile.department}
                      onChange={(e) => setField('department', e.target.value)} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Localisation</label>
                  <input id="field-location" className="form-input" value={profile.location}
                    onChange={(e) => setField('location', e.target.value)} />
                </div>

                {/* Specialties */}
                <div className="form-group">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <label className="form-label" style={{ marginBottom: 0 }}>Domaines de spécialité</label>
                    <button id="add-specialty-btn" type="button" onClick={addSpecialty} className="btn btn-outline btn-sm" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Plus size={14} /> Ajouter
                    </button>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {profile.specialties.map((sp, i) => (
                      <div key={i} style={{ display: 'flex', gap: 8 }}>
                        <input
                          id={`specialty-${i}`}
                          className="form-input"
                          value={sp}
                          onChange={(e) => updateSpecialty(i, e.target.value)}
                          style={{ flex: 1 }}
                        />
                        <button
                          type="button"
                          onClick={() => removeSpecialty(i)}
                          className="btn btn-danger btn-sm"
                          title="Supprimer"
                          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 10px' }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── Tab: Biographie ── */}
            {activeTab === 'bio' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                <div className="form-group">
                  <label className="form-label">Biographie courte <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(affiché sur la page d'accueil)</span></label>
                  <textarea
                    id="field-bio"
                    className="form-input"
                    rows={3}
                    value={profile.bio}
                    onChange={(e) => setField('bio', e.target.value)}
                    style={{ resize: 'vertical' }}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Biographie complète <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(page À propos)</span></label>
                  <textarea
                    id="field-bioLong"
                    className="form-input"
                    rows={12}
                    value={profile.bioLong}
                    onChange={(e) => setField('bioLong', e.target.value)}
                    style={{ resize: 'vertical', fontFamily: 'inherit', lineHeight: 1.7 }}
                  />
                </div>
              </div>
            )}

            {/* ── Tab: Formation ── */}
            {activeTab === 'education' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Parcours académique affiché sur la page publique</p>
                  <button id="add-education-btn" type="button" onClick={addEducation} className="btn btn-outline btn-sm" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Plus size={14} /> Ajouter
                  </button>
                </div>
                {profile.education.map((edu, i) => (
                  <div key={i} className="card" style={{ padding: 18, background: 'var(--bg-primary)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Formation #{i + 1}</span>
                      <button type="button" onClick={() => removeEducation(i)} className="btn btn-danger btn-sm" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Trash2 size={14} /> Supprimer
                      </button>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 12, marginBottom: 12 }}>
                      <div className="form-group">
                        <label className="form-label">Année</label>
                        <input
                          id={`edu-year-${i}`}
                          className="form-input"
                          value={edu.year}
                          onChange={(e) => updateEducation(i, 'year', e.target.value)}
                          placeholder="2003"
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Diplôme</label>
                        <input
                          id={`edu-degree-${i}`}
                          className="form-input"
                          value={edu.degree}
                          onChange={(e) => updateEducation(i, 'degree', e.target.value)}
                          placeholder="Doctorat en Mathématiques Pures"
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Établissement</label>
                      <input
                        id={`edu-institution-${i}`}
                        className="form-input"
                        value={edu.institution}
                        onChange={(e) => updateEducation(i, 'institution', e.target.value)}
                        placeholder="Université Paris VI (Sorbonne)"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ── Tab: Statistiques ── */}
            {activeTab === 'stats' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                  Ces chiffres apparaissent sur la page d'accueil et la page À propos.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  {[
                    { key: 'yearsOfExperience' as const, label: "Années d'expérience", icon: '📅' },
                    { key: 'publications' as const, label: 'Publications', icon: '📄' },
                    { key: 'courses' as const, label: 'Cours disponibles', icon: '📚' },
                    { key: 'students' as const, label: 'Étudiants formés', icon: '🎓' },
                  ].map(({ key, label, icon }) => (
                    <div key={key} className="card" style={{ padding: 20, background: 'var(--bg-primary)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                        <span style={{ fontSize: '1.4rem' }}>{icon}</span>
                        <label className="form-label" style={{ marginBottom: 0 }}>{label}</label>
                      </div>
                      <input
                        id={`stat-${key}`}
                        type="number"
                        className="form-input"
                        value={profile.stats[key]}
                        onChange={(e) => setStatField(key, Number(e.target.value))}
                        min={0}
                        style={{ fontSize: '1.5rem', fontWeight: 700, fontFamily: 'Playfair Display, serif', color: 'var(--accent-blue)', textAlign: 'center' }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Tab: Liens sociaux ── */}
            {activeTab === 'social' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                  Liens vers vos profils académiques et réseaux sociaux.
                </p>
                {[
                  { key: 'researchGate' as const, label: 'ResearchGate', placeholder: 'https://www.researchgate.net/profile/...', icon: <Sigma size={16} /> },
                  { key: 'googleScholar' as const, label: 'Google Scholar', placeholder: 'https://scholar.google.com/citations?user=...', icon: <GraduationCap size={16} /> },
                  { key: 'linkedin' as const, label: 'LinkedIn', placeholder: 'https://linkedin.com/in/...', icon: <User size={16} /> },
                  { key: 'twitter' as const, label: 'Twitter / X', placeholder: 'https://twitter.com/...', icon: <FileText size={16} /> },
                ].map(({ key, label, placeholder, icon }) => (
                  <div key={key} className="form-group">
                    <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>{icon} {label}</label>
                    <input
                      id={`social-${key}`}
                      className="form-input"
                      type="url"
                      value={profile.socialLinks[key]}
                      onChange={(e) => setSocialField(key, e.target.value)}
                      placeholder={placeholder}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* ── Tab: Sécurité ── */}
            {activeTab === 'security' && (
              <div style={{ maxWidth: 500 }}>
                <div style={{ marginBottom: 24 }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Lock size={20} className="gold-text" /> Changer le mot de passe
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                    Pour plus de sécurité, utilisez un mot de passe complexe avec des chiffres et des caractères spéciaux.
                  </p>
                </div>

                <form onSubmit={handlePasswordChange} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                  <div className="form-group">
                    <label className="form-label">Mot de passe actuel</label>
                    <input
                      type="password"
                      className="form-input"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Nouveau mot de passe</label>
                    <input
                      type="password"
                      className="form-input"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Confirmer le nouveau mot de passe</label>
                    <input
                      type="password"
                      className="form-input"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={changingPassword}
                    style={{ marginTop: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                  >
                    {changingPassword ? <span className="spinner" style={{ width: 16, height: 16 }} /> : <CheckCircle2 size={18} />}
                    {changingPassword ? 'Modification...' : 'Changer le mot de passe'}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
