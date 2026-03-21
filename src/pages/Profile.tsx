import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
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
  Star
} from "lucide-react";
import { Helmet } from "react-helmet-async";

const ROLES = [
  { id: 'founder', name: 'Visionary Founder', icon: Zap, color: 'text-orange-500' },
  { id: 'investor', name: 'Venture Investor', icon: Star, color: 'text-yellow-500' },
  { id: 'developer', name: 'Tech Architect', icon: ShieldCheck, color: 'text-blue-500' },
  { id: 'partner', name: 'Strategic Partner', icon: User, color: 'text-purple-500' },
];

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profileData, setProfileData] = useState({
    role: '',
    bio: '',
    organization: '',
    location: '',
    website: '',
    linkedin: '',
    full_name: ''
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
      setProfileData({
        role: metadata.role || '',
        bio: metadata.bio || '',
        organization: metadata.organization || '',
        location: metadata.location || '',
        website: metadata.website || '',
        linkedin: metadata.linkedin || '',
        full_name: metadata.full_name || user.email?.split('@')[0]
      });
      setLoading(false);
    };
    fetchUser();
  }, [navigate]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: profileData
      });

      if (error) throw error;
      toast.success("Profile updated successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile");
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
          className="max-w-4xl mx-auto"
        >
          <div className="flex flex-col md:flex-row gap-12">
            {/* Left Column: Avatar & Role Selection */}
            <div className="md:w-1/3 space-y-8">
              <div className="relative group">
                <div className="absolute inset-0 bg-primary/20 rounded-3xl blur-3xl group-hover:bg-primary/30 transition-all" />
                <div className="relative glass-card p-8 aspect-square rounded-3xl flex flex-col items-center justify-center text-center">
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
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest block px-2">Professional Identity</label>
                <div className="grid grid-cols-1 gap-3">
                  {ROLES.map((role) => (
                    <button
                      key={role.id}
                      onClick={() => setProfileData(prev => ({ ...prev, role: role.name }))}
                      className={`p-4 rounded-2xl glass-card transition-all flex items-center justify-between group ${
                        profileData.role === role.name ? 'electric-border bg-white/10' : 'bg-white/5 hover:bg-white/8'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <role.icon className={`w-5 h-5 ${role.color}`} />
                        <span className="font-semibold text-sm">{role.name}</span>
                      </div>
                      <ChevronRight className={`w-4 h-4 transition-transform ${profileData.role === role.name ? 'rotate-90 text-primary' : 'text-muted-foreground'}`} />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Information Fields */}
            <div className="md:w-2/3 space-y-8">
              <div className="glass-card p-8 rounded-3xl space-y-6 bg-white/5 border border-white/10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">Full Name</label>
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
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">Organization</label>
                    <div className="relative">
                      <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input 
                        type="text" 
                        value={profileData.organization}
                        onChange={(e) => setProfileData(prev => ({ ...prev, organization: e.target.value }))}
                        placeholder="Entity or Collective"
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">Bio / Mission</label>
                  <textarea 
                    value={profileData.bio}
                    onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                    placeholder="Describe your convergence with Siddhi Dynamics..."
                    rows={4}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-none transition-all resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">Location</label>
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
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">Website</label>
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

                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">LinkedIn Profile</label>
                  <div className="relative">
                    <Linkedin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input 
                      type="text" 
                      value={profileData.linkedin}
                      onChange={(e) => setProfileData(prev => ({ ...prev, linkedin: e.target.value }))}
                      placeholder="https://linkedin.com/in/matrix-nexus"
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-none transition-all"
                    />
                  </div>
                </div>

                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="w-full py-4 bg-primary text-primary-foreground rounded-2xl font-bold text-lg hover:shadow-lg hover:shadow-primary/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-4 overflow-hidden relative group"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <Save className={`w-5 h-5 relative z-10 ${saving ? 'animate-spin' : ''}`} />
                  <span className="relative z-10">{saving ? "Synchronizing..." : "Update Identity Matrix"}</span>
                </button>
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
