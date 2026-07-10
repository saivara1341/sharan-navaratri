import { motion, useInView, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation, Trans } from 'react-i18next';
import { Mic, MicOff, CheckCircle, Shield, ArrowRight, RefreshCw, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';
import { z } from 'zod';
import { supabaseService } from '@/services/supabaseService';

const contactSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Invalid email address'),
  designation: z.string().max(100).optional(),
  organization: z.string().max(100).optional(),
  inquiryType: z.enum(['problem', 'requirement', 'inquiry', 'investor']),
  message: z.string().min(10, 'Message must be at least 10 characters').max(2000),
});

const ProcessStepCard = ({ item, index, parentInView }: { item: any; index: number; parentInView: boolean }) => {
  const stepRef = useRef<HTMLDivElement>(null);
  const isStepInView = useInView(stepRef, { margin: '-35% 0px -35% 0px' });
  const isActive = parentInView && isStepInView;

  return (
    <motion.div
      ref={stepRef}
      className="text-center group"
      initial={{ opacity: 0, y: 30 }}
      animate={parentInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
      whileHover={{ y: -5 }}
    >
      <motion.div
        className={`text-6xl font-bold mb-4 transition-colors duration-300 ${
          isActive ? 'text-orange-500' : 'text-foreground/50'
        }`}
        animate={{
          scale: isActive ? 1.06 : 1,
        }}
        transition={{ duration: 0.3 }}
      >
        {item.step}
      </motion.div>
      <h4 className="text-xl font-bold text-foreground mb-2">
        {item.title}
      </h4>
      <p className="text-sm text-muted-foreground">
        {item.description}
      </p>
    </motion.div>
  );
};

export const SubmitSection = () => {
  const { t, i18n } = useTranslation();
  const ref = useRef(null);
  const formRef = useRef<HTMLFormElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    designation: '',
    organization: '',
    inquiryType: 'problem',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Requirements form state
  const [businessSector, setBusinessSector] = useState('E-commerce');
  const [otherSector, setOtherSector] = useState('');
  const [projectType, setProjectType] = useState('Static Website / Landing Page');
  const [requirementDesc, setRequirementDesc] = useState('');

  // Startup Sahayak modal state
  const [showSahayakModal, setShowSahayakModal] = useState(false);
  const [sahayakStep, setSahayakStep] = useState(0); // 0: scanning, 1: done
  const [sahayakRefCode, setSahayakRefCode] = useState('');

  // Transition timer for Startup Sahayak validation
  useEffect(() => {
    if (showSahayakModal && sahayakStep === 0) {
      const timer = setTimeout(() => {
        setSahayakStep(1);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showSahayakModal, sahayakStep]);

  useEffect(() => {
    const hash = window.location.hash;
    const search = window.location.search;
    
    if (hash.includes('type=requirement') || search.includes('type=requirement')) {
      setFormData(prev => ({ ...prev, inquiryType: 'requirement' }));
    } else if (hash.includes('type=problem') || search.includes('type=problem')) {
      setFormData(prev => ({ ...prev, inquiryType: 'problem' }));
    } else if (hash.includes('type=inquiry') || search.includes('type=inquiry')) {
      setFormData(prev => ({ ...prev, inquiryType: 'inquiry' }));
    } else if (hash.includes('type=investor') || search.includes('type=investor')) {
      setFormData(prev => ({ ...prev, inquiryType: 'investor' }));
    }
  }, [location]);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 300, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 300, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!formRef.current) return;
    const rect = formRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width);
    mouseY.set((e.clientY - rect.top) / rect.height);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const toggleListening = () => {
    if (isListening) {
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = i18n.language === 'en' ? 'en-US' : i18n.language === 'hi' ? 'hi-IN' : 'te-IN';

      recognition.onstart = () => {
        setIsListening(true);
        toast.info(t('submit.toasts.listening'), { duration: 2000 });
      };

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        if (formData.inquiryType === 'requirement') {
          setRequirementDesc(prev => prev + (prev ? ' ' : '') + transcript);
        } else {
          setFormData(prev => ({
            ...prev,
            message: prev.message + (prev.message ? ' ' : '') + transcript
          }));
        }
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        toast.error(t('submit.toasts.voiceFail'));
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } else {
      toast.error(t('submit.toasts.voiceNotSupported'));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let finalMessage = formData.message;
      if (formData.inquiryType === 'requirement') {
        const sectorStr = businessSector === 'Other' ? `Other (${otherSector})` : businessSector;
        finalMessage = `[Software Requirements Profile]\n• Business Sector: ${sectorStr}\n• Project Type: ${projectType}\n• Description: ${requirementDesc}`;
        
        if (requirementDesc.trim().length < 10) {
          toast.error("Description must be at least 10 characters.");
          setIsSubmitting(false);
          return;
        }
      }

      const payloadToValidate = {
        ...formData,
        message: finalMessage
      };

      const validatedData = contactSchema.parse(payloadToValidate);

      await supabaseService.submitContactForm({
        name: validatedData.name.trim(),
        email: validatedData.email.trim().toLowerCase(),
        designation: validatedData.designation?.trim() || null,
        organization: validatedData.organization?.trim() || null,
        inquiry_type: validatedData.inquiryType,
        message: validatedData.message.trim(),
      });

      if (formData.inquiryType === 'problem') {
        // Generate a mock DPIIT registration reference
        const randId = Math.floor(1000 + Math.random() * 9000);
        setSahayakRefCode(`SS-DPIIT-2026-${randId}`);
        setSahayakStep(0);
        setShowSahayakModal(true);
      } else {
        toast.success(t(`submit.toasts.${formData.inquiryType}Success`));
      }

      // Reset form states
      setFormData({ name: '', email: '', designation: '', organization: '', inquiryType: 'problem', message: '' });
      setRequirementDesc('');
      setOtherSector('');
      setBusinessSector('E-commerce');
      setProjectType('Static Website / Landing Page');
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        toast.error(t('submit.toasts.inputError'));
      } else {
        const code = error?.code ?? '';
        const msg: string = error?.message ?? '';
        const isRLS = code === '42501' || msg.toLowerCase().includes('rls') || msg.toLowerCase().includes('policy') || msg.toLowerCase().includes('permission denied');
        if (isRLS) {
          console.error('[SubmitSection] RLS/Permission error — check Supabase policies for contact_submissions table:', error);
          toast.error('Submission blocked by database policy. Please contact support.');
        } else {
          console.error('[SubmitSection] Contact form submission error:', error);
          toast.error(t('submit.toasts.genericError'));
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const isPortal = location.pathname.includes('/portal');

  const renderFormFields = () => {
    return (
      <div className="relative z-10 space-y-8">
        {/* Inquiry Type Selector (Dropdown) */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-foreground">
            {t('submit.discussLabel')}
          </label>
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full p-4 rounded-xl border-2 border-primary/50 bg-background/50 hover:border-primary/80 transition-all duration-300 text-left flex items-center justify-between shadow-lg shadow-primary/5 focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl block shrink-0">
                  {
                    [
                      { value: 'problem', icon: '🎯' },
                      { value: 'requirement', icon: '💻' },
                      { value: 'inquiry', icon: '❓' },
                      { value: 'investor', icon: '🤝' },
                    ].find(o => o.value === formData.inquiryType)?.icon
                  }
                </span>
                <span className="text-sm font-medium text-foreground">
                  {
                    [
                      { value: 'problem', label: t('submit.types.problem') },
                      { value: 'requirement', label: t('submit.types.requirement') },
                      { value: 'inquiry', label: t('submit.types.inquiry') },
                      { value: 'investor', label: t('submit.types.investor') },
                    ].find(o => o.value === formData.inquiryType)?.label
                  }
                </span>
              </div>
              <ChevronDown className={`w-5 h-5 text-primary transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            
            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scaleY: 0.95 }}
                  animate={{ opacity: 1, y: 0, scaleY: 1 }}
                  exit={{ opacity: 0, y: -10, scaleY: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute z-50 w-full mt-2 bg-card border-2 border-primary/30 rounded-xl shadow-2xl overflow-hidden origin-top"
                >
                  {[
                    { value: 'problem', label: t('submit.types.problem'), icon: '🎯' },
                    { value: 'requirement', label: t('submit.types.requirement'), icon: '💻' },
                    { value: 'inquiry', label: t('submit.types.inquiry'), icon: '❓' },
                    { value: 'investor', label: t('submit.types.investor'), icon: '🤝' },
                  ].map((type) => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({ ...prev, inquiryType: type.value }));
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full p-4 text-left flex items-center gap-3 transition-colors ${formData.inquiryType === type.value ? 'bg-primary/20' : 'hover:bg-primary/10'}`}
                    >
                      <span className="text-2xl shrink-0">{type.icon}</span>
                      <span className={`text-sm font-medium text-foreground`}>
                        {type.label}
                      </span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label
              htmlFor="name"
              className={`block text-sm font-medium transition-colors duration-300 ${focusedField === 'name' ? 'text-primary' : 'text-foreground'
                }`}
            >
              {t('submit.fields.name')} <span className="text-primary">*</span>
            </label>
            <motion.div
              animate={{
                boxShadow: focusedField === 'name'
                  ? '0 0 30px hsl(25 85% 55% / 0.2)'
                  : '0 0 0px transparent'
              }}
              className="rounded-xl"
            >
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                onFocus={() => setFocusedField('name')}
                onBlur={() => setFocusedField(null)}
                placeholder={t('submit.fields.namePlaceholder')}
                className="input-premium"
                required
              />
            </motion.div>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="email"
              className={`block text-sm font-medium transition-colors duration-300 ${focusedField === 'email' ? 'text-primary' : 'text-foreground'
                }`}
            >
              {t('submit.fields.email')} <span className="text-primary">*</span>
            </label>
            <motion.div
              animate={{
                boxShadow: focusedField === 'email'
                  ? '0 0 30px hsl(25 85% 55% / 0.2)'
                  : '0 0 0px transparent'
              }}
              className="rounded-xl"
            >
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
                placeholder={t('submit.fields.emailPlaceholder')}
                className="input-premium"
                required
              />
            </motion.div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label
              htmlFor="designation"
              className={`block text-sm font-medium transition-colors duration-300 ${focusedField === 'designation' ? 'text-primary' : 'text-foreground'
                }`}
            >
              {t('submit.fields.designation')} <span className="text-muted-foreground">{t('waitlistModal.commentOptional')}</span>
            </label>
            <motion.div
              animate={{
                boxShadow: focusedField === 'designation'
                  ? '0 0 30px hsl(25 85% 55% / 0.2)'
                  : '0 0 0px transparent'
              }}
              className="rounded-xl"
            >
              <input
                type="text"
                id="designation"
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                onFocus={() => setFocusedField('designation')}
                onBlur={() => setFocusedField(null)}
                placeholder={t('submit.fields.designationPlaceholder')}
                className="input-premium"
              />
            </motion.div>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="organization"
              className={`block text-sm font-medium transition-colors duration-300 ${focusedField === 'organization' ? 'text-accent' : 'text-foreground'
                }`}
            >
              {t('submit.fields.organization')} <span className="text-muted-foreground">{t('waitlistModal.commentOptional')}</span>
            </label>
            <motion.div
              animate={{
                boxShadow: focusedField === 'organization'
                  ? '0 0 30px hsl(85 70% 45% / 0.2)'
                  : '0 0 0px transparent'
              }}
              className="rounded-xl"
            >
              <input
                type="text"
                id="organization"
                name="organization"
                value={formData.organization}
                onChange={handleChange}
                onFocus={() => setFocusedField('organization')}
                onBlur={() => setFocusedField(null)}
                placeholder={t('submit.fields.organizationPlaceholder')}
                className="input-premium"
              />
            </motion.div>
          </div>
        </div>

        {formData.inquiryType === 'requirement' ? (
          <div className="space-y-8">
            {/* Business Sector Dropdown */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">
                  Business Sector <span className="text-primary">*</span>
                </label>
                <select
                  value={businessSector}
                  onChange={(e) => setBusinessSector(e.target.value)}
                  className="input-premium bg-card border border-border/50 text-foreground cursor-pointer"
                  required
                >
                  <option value="E-commerce">E-commerce</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="FinTech">FinTech</option>
                  <option value="Logistics">Logistics</option>
                  <option value="Education">Education</option>
                  <option value="Real Estate">Real Estate</option>
                  <option value="Food & Beverage">Food & Beverage</option>
                  <option value="Other">Other (Specify below)</option>
                </select>
              </div>

              <AnimatePresence mode="wait">
                {businessSector === 'Other' && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="space-y-2"
                  >
                    <label className="block text-sm font-medium text-foreground">
                      Custom Sector Name <span className="text-primary">*</span>
                    </label>
                    <input
                      type="text"
                      value={otherSector}
                      onChange={(e) => setOtherSector(e.target.value)}
                      placeholder="Specify sector (e.g. AgriTech)"
                      className="input-premium"
                      required
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Project Type Grid */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-foreground">
                Project Type <span className="text-primary">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {[
                  { value: 'Static Website / Landing Page', label: 'Static / Landing', icon: '🌐' },
                  { value: 'Full-Stack Web Application', label: 'Full-Stack App', icon: '💻' },
                  { value: 'Mobile Application', label: 'Mobile App', icon: '📱' },
                  { value: 'Mobile App & Website Combo', label: 'App + Web Combo', icon: '📱💻' },
                  { value: 'Custom Software', label: 'Custom Software', icon: '⚙️' },
                ].map((type) => (
                  <motion.button
                    key={type.value}
                    type="button"
                    onClick={() => setProjectType(type.value)}
                    className={`p-4 rounded-xl border-2 transition-all duration-300 text-center flex flex-col items-center justify-center gap-2 ${
                      projectType === type.value
                        ? 'border-primary bg-primary/10 shadow-lg shadow-primary/20'
                        : 'border-border/50 hover:border-primary/50 bg-background/50'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="text-2xl block shrink-0">{type.icon}</span>
                    <span className="text-xs font-semibold leading-tight text-foreground">
                      {type.label}
                    </span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Description Textarea */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">
                Description of Requirements <span className="text-primary">*</span>
              </label>
              <motion.div
                animate={{
                  boxShadow: focusedField === 'requirementDesc'
                    ? '0 0 30px hsl(25 85% 55% / 0.2)'
                    : '0 0 0px transparent'
                }}
                className="rounded-xl"
              >
                <div className="relative">
                  <textarea
                    id="requirementDesc"
                    value={requirementDesc}
                    onChange={(e) => setRequirementDesc(e.target.value)}
                    onFocus={() => setFocusedField('requirementDesc')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Describe timeline, features, workflows, and business goals..."
                    rows={6}
                    className="input-premium resize-none pr-14"
                    required
                  />
                  <motion.button
                    type="button"
                    onClick={toggleListening}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className={`absolute bottom-4 right-4 p-3 rounded-full transition-all duration-500 z-20 ${
                      isListening
                        ? 'bg-red-500 text-white animate-pulse shadow-[0_0_20px_rgba(239,68,68,0.5)]'
                        : 'bg-primary/10 text-primary hover:bg-primary/20'
                    }`}
                    title={isListening ? 'Stop Listening' : 'Start Voice submission'}
                  >
                    {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <label
              htmlFor="message"
              className={`block text-sm font-medium transition-colors duration-300 ${focusedField === 'message' ? 'text-primary' : 'text-foreground'
                }`}
            >
              {t(`submit.fields.message.${formData.inquiryType}`)}
              {' '}<span className="text-primary">*</span>
            </label>
            <motion.div
              animate={{
                boxShadow: focusedField === 'message'
                  ? '0 0 30px hsl(25 85% 55% / 0.2)'
                  : '0 0 0px transparent'
              }}
              className="rounded-xl"
            >
              <div className="relative">
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('message')}
                  onBlur={() => setFocusedField(null)}
                  placeholder={t(`submit.fields.message.${formData.inquiryType}Placeholder`)}
                  rows={6}
                  className="input-premium resize-none pr-14"
                  required
                />
                <motion.button
                  type="button"
                  onClick={toggleListening}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className={`absolute bottom-4 right-4 p-3 rounded-full transition-all duration-500 z-20 ${isListening
                    ? 'bg-red-500 text-white animate-pulse shadow-[0_0_20px_rgba(239,68,68,0.5)]'
                    : 'bg-primary/10 text-primary hover:bg-primary/20'
                    }`}
                  title={isListening ? "Stop Listening" : "Start Voice submission"}
                >
                  {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center gap-6 pt-4">
          <motion.button
            type="submit"
            disabled={isSubmitting}
            className="group relative px-10 py-4 rounded-xl font-semibold text-lg overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
            whileHover={!isSubmitting ? { scale: 1.02 } : {}}
            whileTap={!isSubmitting ? { scale: 0.98 } : {}}
          >
            <span className="absolute inset-0 bg-gradient-to-r from-primary via-primary to-accent opacity-90 group-hover:opacity-100 transition-opacity duration-500" />
            <span className="absolute inset-0 bg-gradient-to-r from-primary via-primary to-accent blur-xl opacity-50 group-hover:opacity-70 transition-opacity duration-500" />
            <span className="relative flex items-center justify-center gap-3 text-primary-foreground">
              {isSubmitting ? (
                <>
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  {t('submit.submitButton.submitting')}
                </>
              ) : (
                <>
                  {t(`submit.submitButton.${formData.inquiryType}`)}
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </>
              )}
            </span>
          </motion.button>

          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            {t('submit.security')}
          </p>
        </div>
      </div>
    );
  };

  const renderSahayakModal = () => {
    return (
      <AnimatePresence>
        {showSahayakModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          >
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-lg bg-card border border-border/50 rounded-3xl p-8 overflow-hidden shadow-2xl shadow-primary/10"
            >
              {/* Radial gradient background */}
              <div className="absolute top-0 left-0 w-80 h-80 bg-primary/10 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2" />
              <div className="absolute bottom-0 right-0 w-60 h-60 bg-accent/5 rounded-full blur-[80px] translate-x-1/2 translate-y-1/2" />

              <div className="relative z-10 text-center space-y-6">
                <div className="flex justify-center">
                  <div className="relative">
                    {sahayakStep === 0 ? (
                      <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center relative border border-primary/20">
                        <span className="absolute inset-0 rounded-full border border-primary animate-ping opacity-25" />
                        <RefreshCw className="w-10 h-10 text-primary animate-spin" />
                      </div>
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center relative border border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                        <CheckCircle className="w-10 h-10 text-emerald-500" />
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl font-bold">
                    {sahayakStep === 0 ? 'Startup Sahayak Gateway Active' : 'Validation Confirmed'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {sahayakStep === 0
                      ? 'Transmitting problem statement, evaluating DPIIT eligibility...'
                      : 'Concept scanned & validated successfully by Startup Sahayak.'}
                  </p>
                </div>

                {sahayakStep === 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3 text-left font-mono"
                  >
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-muted-foreground">Gateway:</span>
                      <span className="text-primary font-bold">Razorpay Startup Sahayak API</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-muted-foreground">Reference ID:</span>
                      <span className="text-foreground font-semibold">{sahayakRefCode}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-muted-foreground">Status:</span>
                      <span className="text-emerald-500 font-bold flex items-center gap-1">
                        <Shield className="w-3.5 h-3.5" /> DPIIT Eligible
                      </span>
                    </div>
                    <div className="border-t border-white/10 pt-2 text-[10px] text-muted-foreground leading-relaxed">
                      Evaluation score: 87/100. Tax exemptions, self-certification recommendations, and co-development pathways have been published to your secure dashboard.
                    </div>
                  </motion.div>
                )}

                <div className="pt-2">
                  <button
                    onClick={() => {
                      setShowSahayakModal(false);
                      navigate('/auth');
                    }}
                    disabled={sahayakStep === 0}
                    className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-2xl flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-primary/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed group"
                  >
                    <span>Proceed to Neural Hub & Login</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  };

  const bgTransform = useTransform(
    [springX, springY],
    ([x, y]) => `radial-gradient(600px circle at ${Number(x) * 100}% ${Number(y) * 100}%, hsl(25 85% 55% / 0.1), transparent 40%)`
  );

  if (isPortal) {
    return (
      <div className="relative z-10 max-w-4xl mx-auto py-8">
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="glass-card electric-border p-6 md:p-10 relative overflow-hidden bg-card/30"
        >
          {renderFormFields()}
        </form>
        {renderSahayakModal()}
      </div>
    );
  }

  return (
    <section id="submit" className="pt-4 pb-32 md:pt-8 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/5 to-background" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] bg-primary/3 rounded-full blur-[200px]" />

      {/* Grid pattern */}
      <div className="absolute inset-0 grid-pattern opacity-20" />

      <div className="container mx-auto px-6 relative z-10" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-3 px-6 py-3 rounded-full glass-card electric-border mb-8"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
              </span>
              <span className="text-sm text-muted-foreground font-medium">Free AI Discovery Call · No commitment</span>
            </motion.div>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Tell us your biggest{' '}
              <span className="gradient-text glow-text">operational headache</span>
            </h2>
            <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mb-8">
              We'll map your process and show you exactly what AI can automate — in a single conversation.
              Responses within <strong className="text-foreground">24 hours</strong>.
            </p>

            {/* Trust strip above form */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground">
              {[
                { icon: '✅', text: 'Free 30-min consultation' },
                { icon: '🔒', text: 'Your information stays private' },
                { icon: '⚡', text: 'Reply within 24 hours' },
              ].map(({ icon, text }) => (
                <span key={text} className="flex items-center gap-1.5">
                  <span>{icon}</span>
                  <span>{text}</span>
                </span>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            onMouseMove={handleMouseMove}
            className="relative"
          >
            <form
              ref={formRef}
              onSubmit={handleSubmit}
              className="glass-card electric-border p-8 md:p-12 relative overflow-hidden"
            >
              {/* Dynamic glow following mouse */}
              <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: bgTransform,
                }}
              />

              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-primary/10 to-accent/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-60 h-60 bg-gradient-to-br from-accent/8 to-primary/5 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2" />

              {renderFormFields()}
            </form>
          </motion.div>

          {/* Process explanation */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-20 grid md:grid-cols-3 gap-8"
          >
            {(t('submit.process', { returnObjects: true }) as any[]).map((item, index) => (
              <ProcessStepCard
                key={item.step}
                item={item}
                index={index}
                parentInView={isInView}
              />
            ))}
          </motion.div>
        </motion.div>
      </div>

      {renderSahayakModal()}
    </section>
  );
};
