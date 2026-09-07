import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

type ConsentCheckboxProps = {
  checked: boolean;
  onChange: (value: boolean) => void;
  purpose: string;
  id?: string;
};

/**
 * DPDP Sec. 5 itemised notice + Sec. 6 consent, shown at the point of collection.
 * Never pre-ticked.
 */
export const ConsentCheckbox = ({ checked, onChange, purpose, id = "dpdp-consent" }: ConsentCheckboxProps) => {
  const { t } = useTranslation();
  return (
    <label
      htmlFor={id}
      className="flex items-start gap-2.5 sm:gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3 sm:p-4 text-[11px] sm:text-xs leading-relaxed text-muted-foreground cursor-pointer"
    >
      <input
        id={id}
        name={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 h-4 w-4 accent-primary shrink-0"
        required
        aria-required="true"
      />
      <span>
        {t('submit.consent.part1', 'I consent to Siddhi Dynamics LLP collecting and processing the personal data I provide above for the purpose of')}{" "}
        <strong className="text-foreground">{purpose}</strong>. {t('submit.consent.readNotice', 'I have read the')}{" "}
        <Link to="/privacy" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
          {t('submit.consent.privacyNotice', 'privacy notice')}
        </Link>{" "}
        {t('submit.consent.part2', 'and understand I can withdraw consent or request access, correction or erasure at any time via the')}{" "}
        <Link to="/data-rights" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
          {t('submit.consent.dataRights', 'Data Rights')}
        </Link>{" "}
        {t('submit.consent.part3', 'page.')}
      </span>
    </label>
  );
};

export default ConsentCheckbox;
