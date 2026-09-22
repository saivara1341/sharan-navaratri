import { Helmet } from 'react-helmet-async';

const SITE_NAME = 'Siddhi Dynamics LLP';
const SITE_URL = 'https://siddhidynamics.in';
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;
const DEFAULT_TWITTER_HANDLE = '@siddhidynamics';

interface SeoHeadProps {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  schema?: object | object[];
  noIndex?: boolean;
  keywords?: string;
}

export function SeoHead({
  title,
  description,
  canonical,
  ogImage = DEFAULT_OG_IMAGE,
  schema,
  noIndex = false,
  keywords,
}: SeoHeadProps) {
  const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
  const canonicalUrl = canonical ? `${SITE_URL}${canonical}` : undefined;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      {noIndex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      )}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:locale" content="en_IN" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={DEFAULT_TWITTER_HANDLE} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(Array.isArray(schema) ? schema : [schema])}
        </script>
      )}
    </Helmet>
  );
}

export const orgSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Siddhi Dynamics LLP',
  alternateName: ['Siddhi Dynamics', 'Siddhi AI'],
  url: SITE_URL,
  logo: `${SITE_URL}/og-image.png`,
  foundingDate: '2024',
  description: 'Deep-tech AI innovation firm specializing in Agentic AI, Generative AI, business automation, SaaS platforms, and ERP solutions for Indian businesses.',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '3-5-260/2, Shivajinagar Road, Kotagally',
    addressLocality: 'Nizamabad',
    addressRegion: 'Telangana',
    postalCode: '503001',
    addressCountry: 'IN',
  },
  contactPoint: [
    { '@type': 'ContactPoint', telephone: '+91-6303602743', contactType: 'customer service', availableLanguage: ['English', 'Hindi', 'Telugu'] },
    { '@type': 'ContactPoint', email: 'careers@siddhidynamics.in', contactType: 'HR / Careers' },
  ],
  sameAs: [
    'https://www.linkedin.com/company/siddhi-dynamics-llp',
    'https://www.instagram.com/siddhidynamics/',
  ],
};

export function jobPostingSchema(opts: {
  title: string;
  description: string;
  responsibilities: string[];
  skills: string[];
  datePosted?: string;
  validThrough?: string;
  employmentType?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: opts.title,
    description: opts.description + '\n\nKey Responsibilities:\n' + opts.responsibilities.map(r => '• ' + r).join('\n') + '\n\nSkills & Requirements:\n' + opts.skills.map(s => '• ' + s).join('\n'),
    datePosted: opts.datePosted || '2026-09-01',
    validThrough: opts.validThrough || '2026-12-31T23:59:59',
    employmentType: opts.employmentType || 'INTERN',
    hiringOrganization: {
      '@type': 'Organization',
      name: 'Siddhi Dynamics LLP',
      sameAs: SITE_URL,
      logo: `${SITE_URL}/og-image.png`,
    },
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Nizamabad',
        addressRegion: 'Telangana',
        addressCountry: 'IN',
      },
    },
    jobLocationType: 'TELECOMMUTE',
    applicantLocationRequirements: {
      '@type': 'Country',
      name: 'India',
    },
    url: `${SITE_URL}/careers`,
    directApply: true,
  };
}
