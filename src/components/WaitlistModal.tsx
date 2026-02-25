import { useState, useEffect } from 'react';
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

    setIsSubmitting(true);

    try {
      const result = await supabaseService.addToWaitlist({
        project_id: projectId,
        project_name: projectName,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        idea_rating: rating > 0 ? rating : null,
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

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-xl cursor-pointer"
              onClick={onClose}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md glass-card p-8 overflow-hidden text-left my-8"
            >
              {/* Glow effect */}
              <div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 blur-3xl opacity-30"
                style={{
                  background: isPrimary
                    ? 'radial-gradient(circle, hsl(25 85% 55%) 0%, transparent 70%)'
                    : 'radial-gradient(circle, hsl(85 70% 45%) 0%, transparent 70%)'
                }}
              />

              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>

              {isSuccess ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-8 text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', delay: 0.1 }}
                    className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 ${isPrimary ? 'bg-primary/20 text-primary' : 'bg-accent/20 text-accent'
                      }`}
                  >
                    <CheckCircle className="w-10 h-10" />
                  </motion.div>
                  <h3 className="text-2xl font-bold font-display mb-2">{t('waitlistModal.successTitle')}</h3>
                  <p className="text-muted-foreground">
                    {t('waitlistModal.successDescription', { name: projectName })}
                  </p>
                </motion.div>
              ) : (
                <>
                  {/* Header */}
                  <div className="relative text-center mb-8">
                    <h2 className="text-2xl font-bold font-display mb-2">
                      {t('waitlistModal.title')}
                    </h2>
                    <p className="text-muted-foreground">
                      <Trans
                        i18nKey="waitlistModal.subtitle"
                        values={{ name: projectName }}
                        components={[
                          <span className={isPrimary ? 'text-primary' : 'text-accent'} />
                        ]}
                      />
                    </p>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-foreground">
                        {t('waitlistModal.nameLabel')}
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={t('waitlistModal.namePlaceholder')}
                        className="input-premium"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-foreground">
                        {t('waitlistModal.emailLabel')}
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={t('waitlistModal.emailPlaceholder')}
                        className="input-premium"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-foreground">
                        {t('waitlistModal.commentLabel')} <span className="text-muted-foreground text-xs">{t('waitlistModal.commentOptional')}</span>
                      </label>
                      <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder={t('waitlistModal.commentPlaceholder')}
                        className="input-premium resize-none min-h-[100px] border-primary/20"
                        rows={4}
                      />
                    </div>

                    {/* Rating */}
                    <div>
                      <label className="block text-sm font-medium mb-3 text-foreground">
                        {t('waitlistModal.ratingLabel')}
                      </label>
                      <div className="flex items-center justify-center gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <motion.button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHoveredRating(star)}
                            onMouseLeave={() => setHoveredRating(0)}
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-1 transition-colors"
                          >
                            <Star
                              className={`w-8 h-8 transition-all duration-200 ${star <= (hoveredRating || rating)
                                ? isPrimary
                                  ? 'fill-primary text-primary'
                                  : 'fill-accent text-accent'
                                : 'text-muted-foreground/30'
                                }`}
                            />
                          </motion.button>
                        ))}
                      </div>
                      {rating > 0 && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-center text-sm text-muted-foreground mt-2"
                        >
                          {t(`waitlistModal.ratings.${rating}`)}
                        </motion.p>
                      )}
                    </div>

                    {/* Submit button */}
                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`w-full py-4 rounded-xl font-semibold text-primary-foreground transition-all duration-300 flex items-center justify-center gap-2 ${isPrimary
                        ? 'bg-gradient-to-r from-primary to-orange-400 hover:shadow-[0_0_30px_hsl(25_85%_55%/0.4)]'
                        : 'bg-gradient-to-r from-accent to-lime-400 hover:shadow-[0_0_30px_hsl(85_70%_45%/0.4)]'
                        }`}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          {t('waitlistModal.joiningButton')}
                        </>
                      ) : (
                        t('waitlistModal.joinButton')
                      )}
                    </motion.button>
                  </form>
                </>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
