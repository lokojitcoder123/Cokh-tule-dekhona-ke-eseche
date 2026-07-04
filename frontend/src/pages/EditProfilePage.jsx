import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProfile, updateProfile } from '../api/client';

export default function EditProfilePage({ profileId, onProfileUpdate }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Form State
  const [form, setForm] = useState({
    id: null,
    name: '',
    gender: 'Female',
    age: '',
    heightCm: '',
    email: '',
    district: '',
    state: '',
    regionOfOrigin: 'Kolkata',
    religion: 'Hindu',
    subCommunity: '',
    motherTongue: 'Bengali',
    englishFluency: 'Conversational',
    hindiFluency: 'Conversational',
    education: '',
    profession: '',
    income: '',
    diet: 'NonVeg',
    smoking: 'Never',
    drinking: 'Never',
    familyType: 'Nuclear',
    familyValues: 'Moderate',
    childrenPlans: 'Want children',
    relocationWillingness: 'Open to discussion',
    about: '',
    interests: '',
    lifeGoals: '',
    partnerExpectations: '',
    horoscopeMatchingEnabled: false,
    profilePicture: '',
  });

  useEffect(() => {
    loadProfile();
  }, [profileId]);

  const loadProfile = async () => {
    try {
      const data = await getProfile(profileId);
      setForm(prev => ({
        ...prev,
        ...data,
        // Fallback for nulls
        age: data.age || '',
        heightCm: data.heightCm || '',
        subCommunity: data.subCommunity || '',
        education: data.education || '',
        profession: data.profession || '',
        income: data.income || '',
        about: data.about || '',
        interests: data.interests || '',
        lifeGoals: data.lifeGoals || '',
        partnerExpectations: data.partnerExpectations || '',
        horoscopeMatchingEnabled: !!data.horoscopeMatchingEnabled,
        profilePicture: data.profilePicture || '',
      }));
    } catch (err) {
      console.error(err);
      setError('Failed to load profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleInput = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (file.size > 2 * 1024 * 1024) {
      setError('Please choose an image smaller than 2MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setForm(prev => ({
        ...prev,
        profilePicture: event.target.result,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccess('');
    setError('');
    try {
      // Prepare payload (convert empty strings to null or numbers)
      const payload = {
        ...form,
        age: form.age ? Number(form.age) : null,
        heightCm: form.heightCm ? Number(form.heightCm) : null,
      };

      const updated = await updateProfile(payload);

      // Update local storage in case name changed
      localStorage.setItem('bengali_shadi_name', updated.name);
      onProfileUpdate();
      setSuccess('Profile updated successfully! 🪔');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setError('Failed to save profile changes: ' + err.message);
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="spinner"></div>;

  return (
    <div className="fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="page-header">
        <h1 className="page-title">Edit Your Profile</h1>
        <p className="text-muted" style={{ marginTop: 'var(--space-2)' }}>
          Keep your details up to date to get highly compatible match scores
        </p>
      </div>

      {success && <div className="toast toast-success" style={{ position: 'relative', marginBottom: 'var(--space-6)' }}>{success}</div>}
      {error && <div className="toast toast-error" style={{ position: 'relative', marginBottom: 'var(--space-6)' }}>{error}</div>}

      <form onSubmit={handleSubmit}>
        {/* Section 1: Basic Details */}
        <FormSection title="Basic Details" icon="👤">
          <div style={{ display: 'flex', gap: 'var(--space-6)', marginBottom: 'var(--space-6)', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-2)', flexShrink: 0 }}>
              {form.profilePicture ? (
                <img src={form.profilePicture} alt="Profile" className="profile-photo profile-photo-lg" style={{ objectFit: 'cover' }} />
              ) : (
                <div className="profile-photo profile-photo-lg">
                  {form.name ? form.name.split(' ').map(n => n[0]).join('').toUpperCase() : '?'}
                </div>
              )}
              <label style={{ fontSize: 'var(--text-xs)', cursor: 'pointer', color: 'var(--color-primary)', fontWeight: 600 }}>
                📷 Upload Photo
                <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
              </label>
            </div>
            
            <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', minWidth: '280px' }}>
              <div>
                <label>Full Name</label>
                <input className="input" name="name" value={form.name} onChange={handleInput} required />
              </div>
              <div>
                <label>Gender</label>
                <select className="select" name="gender" value={form.gender} onChange={handleInput}>
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                </select>
              </div>
              <div>
                <label>Age</label>
                <input className="input" type="number" name="age" value={form.age} onChange={handleInput} min="18" max="70" required />
              </div>
              <div>
                <label>Height (cm)</label>
                <input className="input" type="number" name="heightCm" value={form.heightCm} onChange={handleInput} min="100" max="250" required />
              </div>
            </div>
          </div>
        </FormSection>

        {/* Section 2: Regional & Cultural Roots */}
        <FormSection title="Cultural & Regional Roots" icon="🪔">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
            <div>
              <label>Religion</label>
              <select className="select" name="religion" value={form.religion} onChange={handleInput}>
                <option value="Hindu">Hindu</option>
                <option value="Muslim">Muslim</option>
                <option value="Christian">Christian</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label>Sub-community / Caste (Optional)</label>
              <input className="input" name="subCommunity" value={form.subCommunity} onChange={handleInput} placeholder="e.g. Brahmin, Kayastha, Shia, Sunni" />
            </div>
            <div>
              <label>Mother Tongue</label>
              <input className="input" name="motherTongue" value={form.motherTongue} onChange={handleInput} />
            </div>
            <div>
              <label>Region of Origin</label>
              <select className="select" name="regionOfOrigin" value={form.regionOfOrigin} onChange={handleInput}>
                <option value="Kolkata">Kolkata</option>
                <option value="North Bengal">North Bengal</option>
                <option value="South Bengal">South Bengal</option>
                <option value="Bangladeshi-origin">Bangladeshi-origin</option>
                <option value="NRI Bengali">NRI Bengali</option>
              </select>
            </div>
            <div>
              <label>District / City</label>
              <input className="input" name="district" value={form.district} onChange={handleInput} placeholder="e.g. Kolkata, Howrah, Siliguri, Dhaka" required />
            </div>
            <div>
              <label>State</label>
              <input className="input" name="state" value={form.state} onChange={handleInput} placeholder="e.g. West Bengal, Assam, Dhaka Division" required />
            </div>
          </div>
          {form.religion === 'Hindu' && (
            <div style={{ marginTop: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <input type="checkbox" id="horoscope" name="horoscopeMatchingEnabled" checked={form.horoscopeMatchingEnabled} onChange={handleInput} />
              <label htmlFor="horoscope" style={{ margin: 0, cursor: 'pointer' }}>Enable Horoscope / Kundli matching flag</label>
            </div>
          )}
        </FormSection>

        {/* Section 3: Education & Career */}
        <FormSection title="Education & Career" icon="🎓">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
            <div>
              <label>Education / Degree</label>
              <input className="input" name="education" value={form.education} onChange={handleInput} placeholder="e.g. B.Tech, MBA, MBBS" required />
            </div>
            <div>
              <label>Profession / Job Title</label>
              <input className="input" name="profession" value={form.profession} onChange={handleInput} placeholder="e.g. Software Engineer, Doctor, Teacher" required />
            </div>
            <div>
              <label>Annual Income</label>
              <select className="select" name="income" value={form.income} onChange={handleInput}>
                <option value="Below 3 LPA">Below 3 LPA</option>
                <option value="3-5 LPA">3-5 LPA</option>
                <option value="5-10 LPA">5-10 LPA</option>
                <option value="10-20 LPA">10-20 LPA</option>
                <option value="15-25 LPA">15-25 LPA</option>
                <option value="20+ LPA">20+ LPA</option>
              </select>
            </div>
            <div>
              <label>Language Fluency</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-2)' }}>
                <div>
                  <label style={{ fontSize: '11px' }}>English</label>
                  <select className="select" name="englishFluency" value={form.englishFluency} onChange={handleInput}>
                    <option value="Fluent">Fluent</option>
                    <option value="Conversational">Conversational</option>
                    <option value="Basic">Basic</option>
                    <option value="None">None</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '11px' }}>Hindi</label>
                  <select className="select" name="hindiFluency" value={form.hindiFluency} onChange={handleInput}>
                    <option value="Fluent">Fluent</option>
                    <option value="Conversational">Conversational</option>
                    <option value="Basic">Basic</option>
                    <option value="None">None</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </FormSection>

        {/* Section 4: Lifestyle & Habits */}
        <FormSection title="Lifestyle & Habits" icon="🍽️">
          <div style={{ display: 'grid', gap: 'var(--space-4)', gridTemplateColumns: 'repeat(3, 1fr)' }}>
            <div>
              <label>Diet Type</label>
              <select className="select" name="diet" value={form.diet} onChange={handleInput}>
                <option value="Veg">Vegetarian</option>
                <option value="NonVeg">Non-Vegetarian</option>
                <option value="Eggetarian">Eggetarian</option>
              </select>
            </div>
            <div>
              <label>Smoking</label>
              <select className="select" name="smoking" value={form.smoking} onChange={handleInput}>
                <option value="Never">Never</option>
                <option value="Occasionally">Occasionally</option>
                <option value="Regularly">Regularly</option>
              </select>
            </div>
            <div>
              <label>Drinking</label>
              <select className="select" name="drinking" value={form.drinking} onChange={handleInput}>
                <option value="Never">Never</option>
                <option value="Occasionally">Occasionally</option>
                <option value="Regularly">Regularly</option>
              </select>
            </div>
          </div>
        </FormSection>

        {/* Section 5: Family & Values */}
        <FormSection title="Family & Values" icon="🏠">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
            <div>
              <label>Family Type</label>
              <select className="select" name="familyType" value={form.familyType} onChange={handleInput}>
                <option value="Nuclear">Nuclear Family</option>
                <option value="Joint">Joint Family</option>
              </select>
            </div>
            <div>
              <label>Family Values</label>
              <select className="select" name="familyValues" value={form.familyValues} onChange={handleInput}>
                <option value="Traditional">Traditional</option>
                <option value="Moderate">Moderate</option>
                <option value="Liberal">Liberal</option>
              </select>
            </div>
            <div>
              <label>Children Plans</label>
              <select className="select" name="childrenPlans" value={form.childrenPlans} onChange={handleInput}>
                <option value="Want children">Want children</option>
                <option value="Don't want">Don't want</option>
                <option value="Open to discussion">Open to discussion</option>
              </select>
            </div>
            <div>
              <label>Relocation Willingness</label>
              <select className="select" name="relocationWillingness" value={form.relocationWillingness} onChange={handleInput}>
                <option value="Willing">Willing to relocate</option>
                <option value="Not willing">Not willing to relocate</option>
                <option value="Open to discussion">Open to discussion</option>
              </select>
            </div>
          </div>
        </FormSection>

        {/* Section 6: About & Expectations */}
        <FormSection title="Self Description & Partner Expectations" icon="✍️">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div>
              <label>About Me</label>
              <textarea className="textarea" name="about" value={form.about} onChange={handleInput} placeholder="Describe yourself, your background, your personality..." required />
            </div>
            <div>
              <label>My Interests</label>
              <textarea className="textarea" name="interests" value={form.interests} onChange={handleInput} placeholder="Reading, football, cooking, classical music..." required />
            </div>
            <div>
              <label>Life Goals</label>
              <textarea className="textarea" name="lifeGoals" value={form.lifeGoals} onChange={handleInput} placeholder="What do you hope to achieve personally and professionally?" required />
            </div>
            <div>
              <label>Partner Expectations</label>
              <textarea className="textarea" name="partnerExpectations" value={form.partnerExpectations} onChange={handleInput} placeholder="Describe your ideal partner's values, education, lifestyle..." required />
            </div>
          </div>
        </FormSection>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'flex-end', marginTop: 'var(--space-6)', marginBottom: 'var(--space-12)' }}>
          <button type="button" className="btn btn-outline" onClick={() => navigate('/matches')}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary btn-lg" disabled={saving}>
            {saving ? 'Saving changes...' : 'Save Profile Details'}
          </button>
        </div>
      </form>
    </div>
  );
}

function FormSection({ title, icon, children }) {
  return (
    <div className="card card-gold" style={{ marginBottom: 'var(--space-6)' }}>
      <h3 style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-4)', borderBottom: 'var(--border-light)', paddingBottom: 'var(--space-2)' }}>
        <span>{icon}</span> {title}
      </h3>
      {children}
    </div>
  );
}
