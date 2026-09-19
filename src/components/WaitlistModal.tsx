import { useState, useEffect } from 'react';
import { ConsentCheckbox } from '@/components/legal/ConsentCheckbox';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, Loader2, CheckCircle } from 'lucide-react';
import { useTranslation, Trans } from 'react-i18next';
import { supabaseService } from '@/services/supabaseService';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';


const emailSchema = z.string().email();

interface WaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  projectName: string;
  accentColor: 'primary' | 'accent';
}

export const WaitlistModal = ({ isOpen, onClose, projectId, projectName, accentColor }: WaitlistModalProps) => {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [consentGiven, setConsentGiven] = useState(false);

  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const isPrimary = accentColor === 'primary';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim()) {
      toast({
        title: t('waitlistModal.missingInfoTitle'),
        description: t('waitlistModal.missingInfoDesc'),
        variant: "destructive",
      });
      return;
    }

    const emailValidation = emailSchema.safeParse(email.trim());
    if (!emailValidation.success) {
      toast({
        title: t('waitlistModal.invalidEmailTitle'),
        description: t('waitlistModal.invalidEmailDesc'),
        variant: "destructive",
      });
      return;
    }

    if (!consentGiven) {
      toast({
        title: "Consent required",
        description: "Please consent to us using your details to notify you about this product.",
        variant: "destructive",
      });
      return;
    }


    setIsSubmitting(true);

    try {
      const result = await supabaseService.addToWaitlist({
        project_id: projectId,
        project_name: projectName,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        idea_rating: rating > 0 ? rating : null,
        consent_given: true,
        consent_at: new Date().toISOString(),
        comment: comment.trim() || null,
      });

      if (result.status === "already_exists") {
        toast({
          title: t('waitlistModal.alreadyJoinedTitle'),
          description: t('waitlistModal.alreadyJoinedDesc'),
          variant: "default",
        });
        setIsSubmitting(false);
        return;
      }

      setIsSuccess(true);
      toast({
        title: t('waitlistModal.successToastTitle'),
        description: t('waitlistModal.successToastDesc'),
      });

      setTimeout(() => {
        onClose();
        setIsSuccess(false);
        setName('');
        setEmail('');
        setComment('');
        setRating(0);
      }, 2000);

    } catch (error) {
      console.error('Waitlist error:', error);
      toast({
        title: t('waitlistModal.errorTitle'),
        description: t('waitlistModal.errorDesc'),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className={`relative w-full max-w-lg overflow-hidden glass-card p-8 border ${isPrimary ? 'border-primary/20' : 'border-accent/20'
              }`}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-8">
              <h2 className={`text-2xl font-bold mb-2 ${isPrimary ? 'text-primary' : 'text-accent'}`}>
                {t('waitlistModal.title')}
              </h2>
              <p className="text-muted-foreground">
                <Trans
                  i18nKey="waitlistModal.subtitle"
                  values={{ project: projectName }}
                  components={{ span: <span className="font-semibold text-foreground" /> }}
                />
              </p>
            </div>

            <AnimatePresence mode="wait">
              {isSuccess ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-12 text-center"
                >
                  <div className={`w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center ${isPrimary ? 'bg-primary/20 text-primary' : 'bg-accent/20 text-accent'
                    }`}>
                    <CheckCircle className="w-10 h-10" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{t('waitlistModal.successTitle', 'You\'re on the list!')}</h3>
                  <p className="text-muted-foreground">{t('waitlistModal.successDescription', t('waitlistModal.successDesc', 'We will notify you when this product launches.'))}</p>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  className="space-y-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t('waitlistModal.nameLabel')}</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={t('waitlistModal.namePlaceholder')}
                      className="input-premium py-3"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t('waitlistModal.emailLabel')}</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t('waitlistModal.emailPlaceholder')}
                      className="input-premium py-3"
                    />
                  </div>

                  <div className="space-y-4">
                    <label className="text-sm font-medium block">
                      {t('waitlistModal.ratingLabel')}
                    </label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onMouseEnter={() => setHoveredRating(star)}
                          onMouseLeave={() => setHoveredRating(0)}
                          onClick={() => setRating(star)}
                          className="focus:outline-none transition-transform active:scale-95"
                        >
                          <Star
                            className={`w-8 h-8 transition-colors ${star <= (hoveredRating || rating)
                                ? (isPrimary ? 'fill-primary text-primary' : 'fill-accent text-accent')
                                : 'text-muted-foreground/30'
                              }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t('waitlistModal.commentLabel')}</label>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder={t('waitlistModal.commentPlaceholder')}
                      className="input-premium py-3 min-h-[100px] resize-none"
                    />
                  </div>

                  <ConsentCheckbox
                    checked={consentGiven}
                    onChange={setConsentGiven}
                    purpose="adding me to this product waitlist and notifying me about its launch"
                    id="waitlist-consent"
                  />



                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${isPrimary
                        ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-primary/30'
                        : 'bg-accent text-accent-foreground shadow-lg shadow-accent/20 hover:shadow-accent/30'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        {t('waitlistModal.joiningButton', t('waitlistModal.submitting', 'Joining...'))}
                      </>
                    ) : (
                      t('waitlistModal.joinButton', t('waitlistModal.submitButton', 'Join Waitlist'))
                    )}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
