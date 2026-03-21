import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { FooterSection } from "@/components/sections/FooterSection";
import { toast } from "sonner";
import { 
  User, 
  Briefcase, 
  MapPin, 
  Link as LinkIcon, 
  Linkedin, 
  Save, 
  ChevronRight,
  ShieldCheck,
  Zap,
  Star,
  GraduationCap,
  PlusCircle,
  Building,
  Target,
  Cpu,
  CheckCircle2,
  Circle
} from "lucide-react";
import { Helmet } from "react-helmet-async";

const ROLES = [
  { id: 'founder', name: 'Visionary Founder', icon: Zap, color: 'text-orange-500', bgColor: 'bg-orange-500/10' },
  { id: 'investor', name: 'Venture Investor', icon: Star, color: 'text-yellow-500', bgColor: 'bg-yellow-500/10' },
  { id: 'developer', name: 'Tech Architect', icon: ShieldCheck, color: 'text-blue-500', bgColor: 'bg-blue-500/10' },
  { id: 'student', name: 'Student / Researcher', icon: GraduationCap, color: 'text-emerald-500', bgColor: 'bg-emerald-500/10' },
  { id: 'partner', name: 'Strategic Partner', icon: Target, color: 'text-purple-500', bgColor: 'bg-purple-500/10' },
  { id: 'other', name: 'Other Identity', icon: PlusCircle, color: 'text-rose-500', bgColor: 'bg-rose-500/10' },
];

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<any>(null);
  
  // Main identity state
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [otherRoleName, setOtherRoleName] = useState("");
  
  // All possible information fields
  const [profileData, setProfileData] = useState({
    full_name: '',
    bio: '',
    location: '',
    website: '',
    linkedin: '',
    // Role-specific fields
    university: '',
    major: '',
    graduation_year: '',
    startup_name: '',
    startup_stage: '',
    investment_focus: '',
    tech_stack: '',
    organization: '', // For Partners/Others
    custom_role: ''   // For "Other"
  });
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }
      setUser(user);
      
      const metadata = user.user_metadata || {};
      
      // Load roles (handle migration from single string to array)
      const existingRoles = Array.isArray(metadata.roles) 
        ? metadata.roles 
        : (metadata.role ? [metadata.role] : []);
      
      setSelectedRoles(existingRoles);
      setOtherRoleName(metadata.custom_role || "");
      
      setProfileData({
        full_name: metadata.full_name || user.email?.split('@')[0],
        bio: metadata.bio || '',
        location: metadata.location || '',
        website: metadata.website || '',
        linkedin: metadata.linkedin || '',
        university: metadata.university || '',
        major: metadata.major || '',
        graduation_year: metadata.graduation_year || '',
        startup_name: metadata.startup_name || '',
        startup_stage: metadata.startup_stage || '',
        investment_focus: metadata.investment_focus || '',
        tech_stack: metadata.tech_stack || '',
        organization: metadata.organization || '',
        custom_role: metadata.custom_role || ''
      });
      setLoading(false);
    };
    fetchUser();
  }, [navigate]);

  const toggleRole = (roleName: string) => {
    setSelectedRoles(prev => 
      prev.includes(roleName) 
        ? prev.filter(r => r !== roleName) 
        : [...prev, roleName]
    );
  };

  const isRoleSelected = (roleName: string) => selectedRoles.includes(roleName);

  const handleSave = async () => {
    setSaving(true);
    try {
      const updatedMetadata = {
        ...profileData,
        roles: selectedRoles,
        // Legacy support if needed
        role: selectedRoles.length > 0 ? selectedRoles[0] : ''
      };

      const { error } = await supabase.auth.updateUser({
        data: updatedMetadata
      });

      if (error) throw error;
      toast.success("Identity Matrix synchronized!");
    } catch (error: any) {
      toast.error(error.message || "Convergence failure. Please retry.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
           animate={{ rotate: 360 }}
           transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
           className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col">
      <Navbar />
      <Helmet>
        <title>Identity Matrix | Siddhi Dynamics Profile</title>
      </Helmet>

      <div className="absolute inset-0 grid-pattern opacity-10 pointer-events-none" />
      
      <div className="container relative z-10 mx-auto px-6 pt-32 pb-20 flex-grow">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-5xl mx-auto"
        >
          <div className="flex flex-col lg:flex-row gap-12">
            
            {/* Left Column: Avatar & Multi-Role Selection */}
            <div className="lg:w-1/3 space-y-8">
              <div className="relative group">
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-primary/20 to-transparent rounded-3xl blur-2xl" />
                <div className="relative glass-card p-8 rounded-3xl flex flex-col items-center justify-center text-center">
                  <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-accent p-[2px] mb-4">
                    <div className="w-full h-full rounded-2xl bg-background flex items-center justify-center overflow-hidden">
                      {user?.user_metadata?.avatar_url ? (
                        <img src={user.user_metadata.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-10 h-10 text-primary" />
                      )}
                    </div>
                  </div>
                  <h2 className="text-xl font-bold line-clamp-1">{profileData.full_name}</h2>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                  
                  <div className="flex flex-wrap justify-center gap-1 mt-4">
                    {selectedRoles.map(role => (
                      <span key={role} className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                        {role}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest block px-2">Professional Identity</label>
                <div className="grid grid-cols-1 gap-2">
                  {ROLES.map((role) => (
                    <button
                      key={role.id}
                      onClick={() => toggleRole(role.name)}
                      className={`p-4 rounded-2xl glass-card transition-all flex items-center justify-between group ${
                        isRoleSelected(role.name) ? 'electric-border bg-white/10' : 'bg-white/5 hover:bg-white/8'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl ${role.bgColor}`}>
                            <role.icon className={`w-4 h-4 ${role.color}`} />
                        </div>
                        <span className="font-semibold text-sm">{role.name}</span>
                      </div>
                      {isRoleSelected(role.name) ? (
                        <CheckCircle2 className="w-4 h-4 text-primary animate-pulse" />
                      ) : (
                        <Circle className="w-4 h-4 text-muted-foreground opacity-20 group-hover:opacity-100" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Information Fields */}
            <div className="lg:w-2/3 space-y-8">
              
              {/* Core Information */}
              <div className="glass-card p-8 rounded-3xl space-y-6 bg-white/5 border border-white/10 overflow-hidden relative">
                <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
                
                <h3 className="text-sm font-bold text-primary uppercase tracking-[0.2em] mb-8 pb-4 border-b border-white/5 flex items-center gap-2">
                  <User className="w-4 h-4" /> Core Parameters
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input 
                        type="text" 
                        value={profileData.full_name}
                        onChange={(e) => setProfileData(prev => ({ ...prev, full_name: e.target.value }))}
                        placeholder="Neural Architect Name"
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-none transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Location</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input 
                        type="text" 
                        value={profileData.location}
                        onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))}
                        placeholder="Temporal Coordinates"
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Bio / Professional Mission</label>
                  <textarea 
                    value={profileData.bio}
                    onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                    placeholder="Describe your convergence with Siddhi Dynamics..."
                    rows={3}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-none transition-all resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">LinkedIn Profile</label>
                    <div className="relative">
                      <Linkedin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input 
                        type="text" 
                        value={profileData.linkedin}
                        onChange={(e) => setProfileData(prev => ({ ...prev, linkedin: e.target.value }))}
                        placeholder="linkedin.com/in/matrix"
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-none transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Nexus Website</label>
                    <div className="relative">
                      <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input 
                        type="text" 
                        value={profileData.website}
                        onChange={(e) => setProfileData(prev => ({ ...prev, website: e.target.value }))}
                        placeholder="https://nexus.core"
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* DYNAMIC ROLE-SPECIFIC FIELDS */}
              <AnimatePresence>
                {/* 1. STUDENT SECTION */}
                {isRoleSelected('Student / Researcher') && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="glass-card p-8 rounded-3xl space-y-6 bg-emerald-500/5 border border-emerald-500/10 overflow-hidden"
                  >
                    <h3 className="text-sm font-bold text-emerald-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                      <GraduationCap className="w-5 h-5" /> Academic Matrix
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2 md:col-span-2">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">University / Institute</label>
                        <input 
                          type="text" 
                          value={profileData.university}
                          onChange={(e) => setProfileData(prev => ({ ...prev, university: e.target.value }))}
                          placeholder="Alma Mater Name"
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:border-emerald-500/50 outline-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Graduation Year</label>
                        <input 
                          type="text" 
                          value={profileData.graduation_year}
                          onChange={(e) => setProfileData(prev => ({ ...prev, graduation_year: e.target.value }))}
                          placeholder="YYYY"
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:border-emerald-500/50 outline-none"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Field of Study / Major</label>
                      <input 
                        type="text" 
                        value={profileData.major}
                        onChange={(e) => setProfileData(prev => ({ ...prev, major: e.target.value }))}
                        placeholder="e.g. Artificial Intelligence, Neural Science"
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:border-emerald-500/50 outline-none"
                      />
                    </div>
                  </motion.div>
                )}

                {/* 2. FOUNDER SECTION */}
                {isRoleSelected('Visionary Founder') && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="glass-card p-8 rounded-3xl space-y-6 bg-orange-500/5 border border-orange-500/10 overflow-hidden"
                  >
                    <h3 className="text-sm font-bold text-orange-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                      <Building className="w-5 h-5" /> Evolution Pipeline
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Project / Company Name</label>
                        <input 
                          type="text" 
                          value={profileData.startup_name}
                          onChange={(e) => setProfileData(prev => ({ ...prev, startup_name: e.target.value }))}
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:border-orange-500/50 outline-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Venture Stage</label>
                        <select 
                          value={profileData.startup_stage}
                          onChange={(e) => setProfileData(prev => ({ ...prev, startup_stage: e.target.value }))}
                          className="w-full bg-background border border-white/10 rounded-xl py-3 px-4 focus:border-orange-500/50 outline-none"
                        >
                            <option value="">Select Phase</option>
                            <option value="ideation">Neural Ideation</option>
                            <option value="mvp">Prototype (MVP)</option>
                            <option value="early">Early Convergence</option>
                            <option value="scale">Algorithmic Scaling</option>
                        </select>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* 3. ARCHITECT SECTION */}
                {isRoleSelected('Tech Architect') && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="glass-card p-8 rounded-3xl space-y-6 bg-blue-500/5 border border-blue-500/10 overflow-hidden"
                  >
                    <h3 className="text-sm font-bold text-blue-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                      <Cpu className="w-5 h-5" /> Neural Configuration
                    </h3>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Primary Tech Stack / Cognitive Toolkit</label>
                      <input 
                        type="text" 
                        value={profileData.tech_stack}
                        onChange={(e) => setProfileData(prev => ({ ...prev, tech_stack: e.target.value }))}
                        placeholder="e.g. Python, PyTorch, Agentic Frameworks"
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:border-blue-500/50 outline-none"
                      />
                    </div>
                  </motion.div>
                )}

                {/* 4. OTHER / PARTNER SECTION */}
                {(isRoleSelected('Strategic Partner') || isRoleSelected('Other Identity')) && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="glass-card p-8 rounded-3xl space-y-6 bg-purple-500/5 border border-purple-500/10 overflow-hidden"
                  >
                    <h3 className="text-sm font-bold text-purple-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                        <PlusCircle className="w-5 h-5" /> Extended Integration
                    </h3>
                    <div className="space-y-4">
                        {isRoleSelected('Other Identity') && (
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Define Your Identity</label>
                                <input 
                                    type="text" 
                                    value={profileData.custom_role}
                                    onChange={(e) => setProfileData(prev => ({ ...prev, custom_role: e.target.value }))}
                                    placeholder="Matrix Participant / Observer / Agent"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:border-purple-500/50 outline-none"
                                />
                            </div>
                        )}
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Unified Entity / Organization</label>
                            <input 
                                type="text" 
                                value={profileData.organization}
                                onChange={(e) => setProfileData(prev => ({ ...prev, organization: e.target.value }))}
                                placeholder="Collective name"
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:border-purple-500/50 outline-none"
                            />
                        </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* SAVE BUTTON */}
              <div className="pt-4">
                <button
                  onClick={handleSave}
                  disabled={saving || selectedRoles.length === 0}
                  className="w-full py-5 bg-primary text-primary-foreground rounded-2xl font-bold text-xl hover:shadow-2xl hover:shadow-primary/30 transition-all flex items-center justify-center gap-3 disabled:opacity-50 overflow-hidden relative group"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <Save className={`w-6 h-6 relative z-10 ${saving ? 'animate-spin' : ''}`} />
                  <span className="relative z-10">{saving ? "Synchronizing Matrix..." : "Update Identity Matrix"}</span>
                </button>
                {selectedRoles.length === 0 && (
                    <p className="text-center text-[10px] text-rose-400 mt-4 uppercase tracking-widest animate-pulse font-bold">
                        Warning: Must select at least one identity role to proceed.
                    </p>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      <FooterSection />
    </div>
  );
};

export default Profile;
