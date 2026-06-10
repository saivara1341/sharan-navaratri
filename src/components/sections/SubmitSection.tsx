import { motion, useInView, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation, Trans } from 'react-i18next';
import { Mic, MicOff } from 'lucide-react';
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
  const location = useLocation();

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
        setFormData(prev => ({
          ...prev,
          message: prev.message + (prev.message ? ' ' : '') + transcript
        }));
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
      const validatedData = contactSchema.parse(formData);

      await supabaseService.submitContactForm({
        name: validatedData.name.trim(),
        email: validatedData.email.trim().toLowerCase(),
        designation: validatedData.designation?.trim() || null,
        organization: validatedData.organization?.trim() || null,
        inquiry_type: validatedData.inquiryType,
        message: validatedData.message.trim(),
      });

      toast.success(t(`submit.toasts.${formData.inquiryType}Success`));
      setFormData({ name: '', email: '', designation: '', organization: '', inquiryType: 'problem', message: '' });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        toast.error(t('submit.toasts.inputError'));
      } else {
        // Detect RLS / permission errors from Supabase
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

  return (
    <section id="submit" className="py-32 relative overflow-hidden">
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
              <span className="text-sm text-muted-foreground font-medium">{t('submit.badge')}</span>
            </motion.div>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              <Trans
                i18nKey="submit.title"
                components={[
                  <span className="gradient-text glow-text" />
                ]}
              />
            </h2>
            <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto">
              {t('submit.description')}
            </p>
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
                  background: useTransform(
                    [springX, springY],
                    ([x, y]) => `radial-gradient(600px circle at ${Number(x) * 100}% ${Number(y) * 100}%, hsl(25 85% 55% / 0.1), transparent 40%)`
                  ),
                }}
              />

              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-primary/10 to-accent/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-60 h-60 bg-gradient-to-br from-accent/8 to-primary/5 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2" />

              <div className="relative z-10 space-y-8">
                {/* Inquiry Type Selector */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-foreground">
                    {t('submit.discussLabel')}
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { value: 'problem', label: t('submit.types.problem'), icon: '🎯' },
                      { value: 'requirement', label: t('submit.types.requirement'), icon: '💻' },
                      { value: 'inquiry', label: t('submit.types.inquiry'), icon: '❓' },
                      { value: 'investor', label: t('submit.types.investor'), icon: '🤝' },
                    ].map((type) => (
                      <motion.button
                        key={type.value}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, inquiryType: type.value }))}
                        className={`p-4 rounded-xl border-2 transition-all duration-300 text-left flex sm:flex-col items-center sm:items-start gap-3 sm:gap-0 ${formData.inquiryType === type.value
                          ? 'border-primary bg-primary/10 shadow-lg shadow-primary/20'
                          : 'border-border/50 hover:border-primary/50 bg-background/50'
                          }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <span className="text-2xl sm:mb-2 block shrink-0">
                          {type.icon}
                        </span>
                        <span className={`text-sm font-medium leading-tight ${formData.inquiryType === type.value ? 'text-primary' : 'text-muted-foreground'
                          }`}>
                          {type.label}
                        </span>
                      </motion.button>
                    ))}
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
              <motion.div
                key={item.step}
                className="text-center group"
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className={`text-6xl font-bold mb-4 opacity-40 group-hover:opacity-70 transition-opacity ${index % 2 === 0 ? 'gradient-text' : 'gradient-text-reverse'
                  }`}>
                  {item.step}
                </div>
                <h4 className="text-xl font-bold text-foreground mb-2">
                  {item.title}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
