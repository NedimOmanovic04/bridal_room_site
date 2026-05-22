'use client';

import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import type { Dress, Category } from '@/lib/types';
import { LogOut, Plus, Pencil, Trash2, Check, X, Upload } from 'lucide-react';

const ADMIN_USER = 'admin';
const ADMIN_PASS = 'bridalroom2025';

const EMPTY_DRESS_FORM = {
  name: '',
  description: '',
  category: 'a_line',
  price_range: '',
  available: true,
  featured: false,
  cover_image: '',
  sort_order: 0,
};

const EMPTY_CAT_FORM = { value: '', label: '', sort_order: 0 };

type DressForm = typeof EMPTY_DRESS_FORM;
type CatForm   = typeof EMPTY_CAT_FORM;
type Tab       = 'haljine' | 'kategorije';

function slugify(str: string) {
  return str.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
}

export default function AdminClient() {
  const [loggedIn,    setLoggedIn]    = useState(false);
  const [username,    setUsername]    = useState('');
  const [password,    setPassword]    = useState('');
  const [loginError,  setLoginError]  = useState('');
  const [activeTab,   setActiveTab]   = useState<Tab>('haljine');

  // Dresses state
  const [dresses,    setDresses]    = useState<Dress[]>([]);
  const [loadingD,   setLoadingD]   = useState(false);
  const [editingId,  setEditingId]  = useState<string | null>(null);
  const [isAddingD,  setIsAddingD]  = useState(false);
  const [dressForm,  setDressForm]  = useState<DressForm>(EMPTY_DRESS_FORM);
  const [uploading,  setUploading]  = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // Categories state
  const [categories,  setCategories]  = useState<Category[]>([]);
  const [loadingC,    setLoadingC]    = useState(false);
  const [editingCatId, setEditingCatId] = useState<number | null>(null);
  const [isAddingC,   setIsAddingC]   = useState(false);
  const [catForm,     setCatForm]     = useState<CatForm>(EMPTY_CAT_FORM);

  useEffect(() => {
    if (localStorage.getItem('bridal_admin') === '1') setLoggedIn(true);
  }, []);

  useEffect(() => {
    if (!loggedIn) return;
    fetchDresses();
    fetchCategories();
  }, [loggedIn]);

  // ── Auth ────────────────────────────────────────────────────────────────────

  function login(e: React.FormEvent) {
    e.preventDefault();
    if (username.trim() === ADMIN_USER && password === ADMIN_PASS) {
      localStorage.setItem('bridal_admin', '1');
      setLoggedIn(true);
      setLoginError('');
    } else {
      setLoginError('Pogrešno korisničko ime ili lozinka.');
    }
  }

  function logout() {
    localStorage.removeItem('bridal_admin');
    setLoggedIn(false);
    setUsername('');
    setPassword('');
  }

  // ── Dresses ─────────────────────────────────────────────────────────────────

  async function fetchDresses() {
    if (!supabase) return;
    setLoadingD(true);
    const { data } = await supabase.from('dresses').select('*').order('sort_order');
    if (data) setDresses(data as Dress[]);
    setLoadingD(false);
  }

  function startEditDress(dress: Dress) {
    setEditingId(String(dress.id));
    setIsAddingD(false);
    setDressForm({
      name:        dress.name,
      description: dress.description ?? '',
      category:    dress.category,
      price_range: dress.price_range ?? '',
      available:   dress.available,
      featured:    dress.featured,
      cover_image: dress.cover_image,
      sort_order:  dress.sort_order,
    });
  }

  async function saveDress() {
    if (!supabase) return;
    const payload = {
      ...dressForm,
      description: dressForm.description || null,
      price_range: dressForm.price_range || null,
    };
    if (editingId) {
      await supabase.from('dresses').update(payload).eq('id', editingId);
    } else {
      await supabase.from('dresses').insert({ ...payload, image_urls: dressForm.cover_image ? [dressForm.cover_image] : [] });
    }
    await fetchDresses();
    setEditingId(null);
    setIsAddingD(false);
  }

  async function toggleAvailable(dress: Dress) {
    if (!supabase) return;
    await supabase.from('dresses').update({ available: !dress.available }).eq('id', dress.id);
    setDresses(prev => prev.map(d => d.id === dress.id ? { ...d, available: !d.available } : d));
  }

  async function deleteDress(id: string) {
    if (!supabase || !confirm('Obrisati ovu haljinu?')) return;
    await supabase.from('dresses').delete().eq('id', id);
    setDresses(prev => prev.filter(d => String(d.id) !== id));
  }

  async function uploadImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !supabase) return;
    setUploading(true);
    const ext = file.name.split('.').pop();
    const fileName = `haljina_${Date.now()}.${ext}`;
    const { data, error } = await supabase.storage.from('dresses').upload(fileName, file);
    if (data && !error) {
      const { data: urlData } = supabase.storage.from('dresses').getPublicUrl(data.path);
      setDressForm(f => ({ ...f, cover_image: urlData.publicUrl }));
    } else {
      alert('Upload nije uspio. Provjeri storage policy u Supabase.');
    }
    setUploading(false);
    if (fileRef.current) fileRef.current.value = '';
  }

  // ── Categories ───────────────────────────────────────────────────────────────

  async function fetchCategories() {
    if (!supabase) return;
    setLoadingC(true);
    const { data } = await supabase.from('categories').select('*').order('sort_order');
    if (data) setCategories(data as Category[]);
    setLoadingC(false);
  }

  function startEditCat(cat: Category) {
    setEditingCatId(cat.id);
    setIsAddingC(false);
    setCatForm({ value: cat.value, label: cat.label, sort_order: cat.sort_order });
  }

  async function saveCat() {
    if (!supabase) return;
    const payload = {
      value:      catForm.value || slugify(catForm.label),
      label:      catForm.label,
      sort_order: catForm.sort_order,
    };
    if (editingCatId !== null) {
      await supabase.from('categories').update(payload).eq('id', editingCatId);
    } else {
      await supabase.from('categories').insert(payload);
    }
    await fetchCategories();
    setEditingCatId(null);
    setIsAddingC(false);
  }

  async function deleteCat(id: number) {
    if (!supabase || !confirm('Obrisati ovu kategoriju?')) return;
    await supabase.from('categories').delete().eq('id', id);
    setCategories(prev => prev.filter(c => c.id !== id));
  }

  // ── Login screen ─────────────────────────────────────────────────────────────

  if (!loggedIn) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-10">
            <h1 className="font-serif text-3xl text-brown font-light italic">Admin Panel</h1>
            <p className="font-sans text-[11px] tracking-[0.3em] text-muted uppercase mt-2">The Bridal Room</p>
            <div className="w-12 h-px bg-gold mx-auto mt-5" />
          </div>
          <form onSubmit={login} className="flex flex-col gap-4">
            <div>
              <label className="font-sans text-[10px] tracking-[0.2em] text-muted uppercase block mb-1.5">Korisničko ime</label>
              <input type="text" value={username} onChange={e => setUsername(e.target.value)}
                className="w-full bg-white border border-gold-light px-4 py-3 font-sans text-sm text-brown focus:outline-none focus:border-gold" />
            </div>
            <div>
              <label className="font-sans text-[10px] tracking-[0.2em] text-muted uppercase block mb-1.5">Lozinka</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                className="w-full bg-white border border-gold-light px-4 py-3 font-sans text-sm text-brown focus:outline-none focus:border-gold" />
            </div>
            {loginError && <p className="font-sans text-xs text-red-500 text-center">{loginError}</p>}
            <button type="submit"
              className="bg-gold text-ivory font-sans text-[11px] tracking-[0.3em] uppercase py-3 hover:bg-gold-dark transition-colors mt-1">
              Prijavi se
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ── Dashboard ─────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <header className="bg-white border-b border-gold-light px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div>
          <h1 className="font-serif text-xl text-brown font-light italic">Admin Panel</h1>
          <p className="font-sans text-[10px] tracking-[0.25em] text-muted uppercase">The Bridal Room</p>
        </div>
        <button onClick={logout}
          className="flex items-center gap-2 font-sans text-[11px] tracking-[0.2em] uppercase text-muted hover:text-brown transition-colors">
          <LogOut size={14} />
          Odjavi se
        </button>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b border-gold-light">
        <div className="max-w-5xl mx-auto px-6 flex gap-0">
          {(['haljine', 'kategorije'] as Tab[]).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`font-sans text-[11px] tracking-[0.22em] uppercase px-6 py-4 border-b-2 transition-colors ${
                activeTab === tab
                  ? 'border-gold text-gold'
                  : 'border-transparent text-muted hover:text-brown'
              }`}>
              {tab === 'haljine' ? `Haljine (${dresses.length})` : `Kategorije (${categories.length})`}
            </button>
          ))}
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-6 py-10">

        {/* ── HALJINE TAB ──────────────────────────────────────────── */}
        {activeTab === 'haljine' && (
          <>
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-serif text-2xl text-brown font-light">Haljine</h2>
              <button onClick={() => { setIsAddingD(true); setEditingId(null); setDressForm(EMPTY_DRESS_FORM); }}
                className="flex items-center gap-2 bg-gold text-ivory font-sans text-[11px] tracking-[0.2em] uppercase px-5 py-2.5 hover:bg-gold-dark transition-colors">
                <Plus size={14} />
                Dodaj haljinu
              </button>
            </div>

            {isAddingD && (
              <DressFormPanel
                form={dressForm} setForm={setDressForm}
                categories={categories}
                onSave={saveDress}
                onCancel={() => setIsAddingD(false)}
                uploading={uploading} onUpload={uploadImage} fileRef={fileRef}
                title="Nova haljina"
              />
            )}

            {loadingD ? (
              <p className="text-center py-20 font-sans text-sm text-muted">Učitavanje...</p>
            ) : (
              <div className="flex flex-col gap-3">
                {dresses.map(dress => (
                  <div key={dress.id}>
                    {editingId === String(dress.id) ? (
                      <DressFormPanel
                        form={dressForm} setForm={setDressForm}
                        categories={categories}
                        onSave={saveDress}
                        onCancel={() => setEditingId(null)}
                        uploading={uploading} onUpload={uploadImage} fileRef={fileRef}
                        title={`Uredi: ${dress.name}`}
                      />
                    ) : (
                      <DressRow
                        dress={dress}
                        catLabel={categories.find(c => c.value === dress.category)?.label ?? dress.category}
                        onEdit={() => startEditDress(dress)}
                        onDelete={() => deleteDress(String(dress.id))}
                        onToggle={() => toggleAvailable(dress)}
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ── KATEGORIJE TAB ───────────────────────────────────────── */}
        {activeTab === 'kategorije' && (
          <>
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-serif text-2xl text-brown font-light">Kategorije</h2>
              <button onClick={() => { setIsAddingC(true); setEditingCatId(null); setCatForm(EMPTY_CAT_FORM); }}
                className="flex items-center gap-2 bg-gold text-ivory font-sans text-[11px] tracking-[0.2em] uppercase px-5 py-2.5 hover:bg-gold-dark transition-colors">
                <Plus size={14} />
                Dodaj kategoriju
              </button>
            </div>

            {isAddingC && (
              <CatFormPanel
                form={catForm} setForm={setCatForm}
                onSave={saveCat}
                onCancel={() => setIsAddingC(false)}
                title="Nova kategorija"
              />
            )}

            {loadingC ? (
              <p className="text-center py-20 font-sans text-sm text-muted">Učitavanje...</p>
            ) : (
              <div className="flex flex-col gap-3">
                {categories.map(cat => (
                  <div key={cat.id}>
                    {editingCatId === cat.id ? (
                      <CatFormPanel
                        form={catForm} setForm={setCatForm}
                        onSave={saveCat}
                        onCancel={() => setEditingCatId(null)}
                        title={`Uredi: ${cat.label}`}
                      />
                    ) : (
                      <div className="bg-white border border-gold-light/60 flex items-center gap-4 px-5 py-4 hover:border-gold-light transition-colors">
                        <div className="flex-1">
                          <span className="font-serif text-lg text-brown">{cat.label}</span>
                          <span className="font-sans text-[10px] text-muted tracking-[0.15em] ml-3">
                            value: {cat.value} · redosljed: {cat.sort_order}
                          </span>
                        </div>
                        <button onClick={() => startEditCat(cat)}
                          className="p-2 text-muted hover:text-gold transition-colors">
                          <Pencil size={15} />
                        </button>
                        <button onClick={() => deleteCat(cat.id)}
                          className="p-2 text-muted hover:text-red-500 transition-colors">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            <p className="font-sans text-[11px] text-muted mt-6 leading-relaxed">
              * <strong>value</strong> je interna oznaka kategorije (npr. <em>ball_gown</em>). Automatski se generira iz naziva.
              Ako postavljaš categoriju za haljine ručno u bazi, koristi taj <em>value</em>.
            </p>
          </>
        )}
      </main>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function DressRow({ dress, catLabel, onEdit, onDelete, onToggle }: {
  dress: Dress; catLabel: string;
  onEdit: () => void; onDelete: () => void; onToggle: () => void;
}) {
  return (
    <div className="bg-white border border-gold-light/60 flex items-center gap-4 p-4 hover:border-gold-light transition-colors">
      <img src={dress.cover_image} alt={dress.name}
        className="w-14 h-[72px] object-cover flex-shrink-0 bg-cream-dark" />
      <div className="flex-1 min-w-0">
        <h3 className="font-serif text-lg text-brown leading-tight">{dress.name}</h3>
        <p className="font-sans text-[10px] tracking-[0.15em] text-muted uppercase mt-0.5">
          {catLabel}
          {dress.price_range && <> · <span className="text-gold">{dress.price_range}</span></>}
        </p>
        {dress.description && (
          <p className="font-sans text-xs text-muted mt-1 truncate max-w-md">{dress.description}</p>
        )}
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <button onClick={onToggle}
          className={`font-sans text-[10px] tracking-[0.12em] uppercase px-3 py-1.5 border transition-colors ${
            dress.available
              ? 'border-green-400 text-green-700 hover:bg-green-50'
              : 'border-red-300 text-red-500 hover:bg-red-50'
          }`}>
          {dress.available ? 'Dostupna' : 'Nedostupna'}
        </button>
        <button onClick={onEdit} className="p-2 text-muted hover:text-gold transition-colors">
          <Pencil size={15} />
        </button>
        <button onClick={onDelete} className="p-2 text-muted hover:text-red-500 transition-colors">
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );
}

function DressFormPanel({ form, setForm, categories, onSave, onCancel, uploading, onUpload, fileRef, title }: {
  form: DressForm; setForm: React.Dispatch<React.SetStateAction<DressForm>>;
  categories: Category[];
  onSave: () => void; onCancel: () => void;
  uploading: boolean; onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fileRef: React.RefObject<HTMLInputElement>; title: string;
}) {
  return (
    <div className="bg-white border border-gold p-6 mb-4">
      <h3 className="font-serif text-xl text-brown font-light mb-6">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        <Field label="Naziv *">
          <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            className={input} />
        </Field>

        <Field label="Kategorija">
          <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
            className={`${input} bg-white`}>
            {categories.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
        </Field>

        <Field label="Cijena (npr. 500-800 KM)">
          <input value={form.price_range} onChange={e => setForm(f => ({ ...f, price_range: e.target.value }))}
            placeholder="npr. 500-800 KM" className={`${input} placeholder:text-muted/40`} />
        </Field>

        <Field label="Redosljed">
          <input type="number" value={form.sort_order}
            onChange={e => setForm(f => ({ ...f, sort_order: Number(e.target.value) }))}
            className={input} />
        </Field>

        <div className="md:col-span-2">
          <Field label="Opis">
            <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              rows={3} className={`${input} resize-none`} />
          </Field>
        </div>

        <div className="md:col-span-2">
          <Field label="Slika">
            <div className="flex gap-3 items-center">
              <input value={form.cover_image} onChange={e => setForm(f => ({ ...f, cover_image: e.target.value }))}
                placeholder="URL ili uploadaj desno" className={`${input} flex-1 placeholder:text-muted/40`} />
              <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading}
                className="flex items-center gap-1.5 border border-gold text-gold font-sans text-[10px] tracking-[0.15em] uppercase px-4 py-2.5 hover:bg-gold hover:text-ivory transition-colors disabled:opacity-50 whitespace-nowrap">
                <Upload size={12} />
                {uploading ? 'Uploading...' : 'Upload'}
              </button>
              <input ref={fileRef} type="file" accept="image/*,.jfif" onChange={onUpload} className="hidden" />
            </div>
            {form.cover_image && (
              <img src={form.cover_image} alt="Preview" className="mt-3 h-28 w-auto object-cover" />
            )}
          </Field>
        </div>

        <div className="flex items-center gap-6">
          {([['available', 'Dostupna'], ['featured', 'Featured (homepage)']] as const).map(([key, lbl]) => (
            <label key={key} className="flex items-center gap-2 cursor-pointer select-none">
              <input type="checkbox" checked={form[key as keyof DressForm] as boolean}
                onChange={e => setForm(f => ({ ...f, [key]: e.target.checked }))}
                className="accent-gold w-4 h-4" />
              <span className="font-sans text-sm text-brown">{lbl}</span>
            </label>
          ))}
        </div>
      </div>

      <FormActions onSave={onSave} onCancel={onCancel} />
    </div>
  );
}

function CatFormPanel({ form, setForm, onSave, onCancel, title }: {
  form: CatForm; setForm: React.Dispatch<React.SetStateAction<CatForm>>;
  onSave: () => void; onCancel: () => void; title: string;
}) {
  return (
    <div className="bg-white border border-gold p-6 mb-4">
      <h3 className="font-serif text-xl text-brown font-light mb-6">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Field label="Naziv kategorije *">
          <input value={form.label} onChange={e => setCatLabel(e, form, setForm)}
            className={input} />
        </Field>
        <Field label="Value (auto)">
          <input value={form.value || slugify(form.label)} readOnly
            className={`${input} bg-cream-dark text-muted cursor-default`} />
        </Field>
        <Field label="Redosljed">
          <input type="number" value={form.sort_order}
            onChange={e => setForm(f => ({ ...f, sort_order: Number(e.target.value) }))}
            className={input} />
        </Field>
      </div>
      <FormActions onSave={onSave} onCancel={onCancel} />
    </div>
  );
}

function setCatLabel(
  e: React.ChangeEvent<HTMLInputElement>,
  form: CatForm,
  setForm: React.Dispatch<React.SetStateAction<CatForm>>,
) {
  const label = e.target.value;
  setForm(f => ({ ...f, label, value: slugify(label) }));
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="font-sans text-[10px] tracking-[0.2em] text-muted uppercase block mb-1.5">{label}</label>
      {children}
    </div>
  );
}

function FormActions({ onSave, onCancel }: { onSave: () => void; onCancel: () => void }) {
  return (
    <div className="flex gap-3 mt-6 pt-5 border-t border-gold-light">
      <button onClick={onSave}
        className="flex items-center gap-1.5 bg-gold text-ivory font-sans text-[11px] tracking-[0.2em] uppercase px-6 py-2.5 hover:bg-gold-dark transition-colors">
        <Check size={13} />
        Sačuvaj
      </button>
      <button onClick={onCancel}
        className="flex items-center gap-1.5 border border-gold-light text-muted font-sans text-[11px] tracking-[0.2em] uppercase px-6 py-2.5 hover:border-brown hover:text-brown transition-colors">
        <X size={13} />
        Otkaži
      </button>
    </div>
  );
}

const input = 'w-full border border-gold-light px-3 py-2.5 font-sans text-sm text-brown focus:outline-none focus:border-gold';
