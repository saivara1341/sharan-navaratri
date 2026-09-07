import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  Search, 
  CheckCircle2, 
  XCircle, 
  Printer, 
  Copy, 
  ArrowLeft,
  BadgeCheck,
  Lock,
  Star
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { toast } from 'sonner';
import { Navbar } from '@/components/layout/Navbar';
import { FooterSection } from '@/components/sections/FooterSection';
import { internshipService, CertificateRecord } from '@/services/internshipService';

// ─── Grade star helper ────────────────────────────────────────────────────────
function gradeStars(grade: string): number {
  if (grade === 'Outstanding') return 5;
  if (grade === 'Exemplary') return 4;
  if (grade === 'Distinction') return 3;
  return 2;
}

// ─── Grade color ─────────────────────────────────────────────────────────────
function gradeColor(grade: string): string {
  if (grade === 'Outstanding') return '#f59e0b';
  if (grade === 'Exemplary') return '#34d399';
  if (grade === 'Distinction') return '#60a5fa';
  return '#a78bfa';
}

// ─── Certificate Template Component ──────────────────────────────────────────
function CertificateTemplate({ cert }: { cert: CertificateRecord }) {
  const stars = gradeStars(cert.grade);
  const gc = gradeColor(cert.grade);
  const isValid = cert.status === 'Valid';

  // Role-based type label
  const typeLabel = cert.role.toLowerCase().includes('intern')
    ? 'Certificate of Internship Completion'
    : 'Certificate of Professional Recognition';

  // Unique ID displayed prominently on certificate
  const displayId = cert.certificate_no;

  return (
    <div
      id="printable-certificate"
      className="select-none"
      style={{
        WebkitUserSelect: 'none',
        userSelect: 'none',
        fontFamily: "'Georgia', 'Times New Roman', serif",
        background: 'linear-gradient(135deg, #0f0f1a 0%, #13131f 40%, #0a0a14 100%)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '24px',
        overflow: 'hidden',
        position: 'relative',
        boxShadow: '0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04)',
      }}
    >
      {/* ── Decorative gold outer border frame ── */}
      <div style={{
        position: 'absolute', inset: '10px',
        border: '1.5px solid rgba(245,158,11,0.25)',
        borderRadius: '16px',
        pointerEvents: 'none',
        zIndex: 0
      }} />
      <div style={{
        position: 'absolute', inset: '14px',
        border: '0.5px solid rgba(245,158,11,0.12)',
        borderRadius: '13px',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      {/* ── Corner ornaments ── */}
      {(['tl','tr','bl','br'] as const).map((pos) => (
        <div key={pos} style={{
          position: 'absolute',
          top: pos.startsWith('t') ? 18 : 'auto',
          bottom: pos.startsWith('b') ? 18 : 'auto',
          left: pos.endsWith('l') ? 18 : 'auto',
          right: pos.endsWith('r') ? 18 : 'auto',
          width: 40, height: 40,
          borderTop: pos.startsWith('t') ? '2px solid rgba(245,158,11,0.5)' : 'none',
          borderBottom: pos.startsWith('b') ? '2px solid rgba(245,158,11,0.5)' : 'none',
          borderLeft: pos.endsWith('l') ? '2px solid rgba(245,158,11,0.5)' : 'none',
          borderRight: pos.endsWith('r') ? '2px solid rgba(245,158,11,0.5)' : 'none',
          zIndex: 1, pointerEvents: 'none'
        }} />
      ))}

      {/* ── Watermark repeat text (anti-tamper) ── */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexWrap: 'wrap', gap: '24px',
        padding: '24px', alignContent: 'center',
        transform: 'rotate(-20deg) scale(1.3)',
        opacity: 0.018, pointerEvents: 'none', zIndex: 0,
        fontFamily: 'monospace', fontWeight: 900,
        fontSize: '11px', letterSpacing: '0.12em',
        textTransform: 'uppercase', color: '#ffffff',
        lineHeight: '2'
      }}>
        {Array.from({ length: 40 }).map((_, i) => (
          <span key={i}>SIDDHI DYNAMICS LLP • AUTHENTIC • NOT EDITABLE • </span>
        ))}
      </div>

      {/* ── Radial glow center ── */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 60% 50% at 50% 30%, rgba(139,92,246,0.06) 0%, transparent 70%)',
        pointerEvents: 'none', zIndex: 0
      }} />

      {/* ── Revoked overlay ── */}
      {!isValid && (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 20,
          background: 'rgba(0,0,0,0.55)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          pointerEvents: 'none'
        }}>
          <div style={{
            color: '#f87171', fontWeight: 900, fontSize: '3rem',
            letterSpacing: '0.3em', textTransform: 'uppercase',
            border: '4px solid #f87171', padding: '12px 32px',
            borderRadius: '8px', transform: 'rotate(-20deg)',
            opacity: 0.9, fontFamily: 'monospace'
          }}>
            REVOKED
          </div>
        </div>
      )}

      {/* ── CONTENT ── */}
      <div style={{ position: 'relative', zIndex: 2, padding: '48px 48px 40px' }}>

        {/* ── HEADER: Logo + Company ── */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          {/* Logo mark */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '8px' }}>
            <div style={{
              width: 52, height: 52,
              background: 'linear-gradient(135deg, rgba(139,92,246,0.3), rgba(245,158,11,0.2))',
              border: '1.5px solid rgba(245,158,11,0.4)',
              borderRadius: '12px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 900, fontSize: '16px', color: '#f59e0b',
              letterSpacing: '0.05em'
            }}>
              SD
            </div>
            <div>
              <div style={{ fontWeight: 900, fontSize: '22px', letterSpacing: '0.1em', color: '#ffffff', fontFamily: 'sans-serif', textTransform: 'uppercase' }}>
                SIDDHI DYNAMICS LLP
              </div>
              <div style={{ fontFamily: 'monospace', fontSize: '9px', color: 'rgba(255,255,255,0.45)', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
                LLPIN: ACJ-3766 &nbsp;•&nbsp; Ministry of Corporate Affairs, Govt. of India
              </div>
            </div>
          </div>

          {/* Gold divider with ornament */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', margin: '16px 0' }}>
            <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(245,158,11,0.5), transparent)' }} />
            <div style={{ color: '#f59e0b', fontSize: '14px' }}>✦</div>
            <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(245,158,11,0.5), transparent)' }} />
          </div>

          {/* Certificate type badge */}
          <div style={{
            display: 'inline-block',
            padding: '6px 20px',
            border: '1px solid rgba(245,158,11,0.35)',
            borderRadius: '100px',
            fontFamily: 'sans-serif',
            fontWeight: 700,
            fontSize: '11px',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: '#f59e0b',
            background: 'rgba(245,158,11,0.07)'
          }}>
            {typeLabel}
          </div>
        </div>

        {/* ── CERTIFICATE ID BADGE (prominently top-right) ── */}
        <div style={{
          position: 'absolute', top: '48px', right: '48px',
          textAlign: 'right',
        }}>
          <div style={{
            background: 'rgba(245,158,11,0.08)',
            border: '1px solid rgba(245,158,11,0.3)',
            borderRadius: '10px',
            padding: '8px 14px',
            fontFamily: 'monospace',
          }}>
            <div style={{ fontSize: '8px', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '2px' }}>
              Certificate ID
            </div>
            <div style={{ fontWeight: 900, fontSize: '13px', color: '#f59e0b', letterSpacing: '0.05em' }}>
              {displayId}
            </div>
          </div>
        </div>

        {/* ── BODY ── */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>

          {/* Sub-line */}
          <p style={{
            fontFamily: 'sans-serif', fontSize: '11px',
            color: 'rgba(255,255,255,0.4)',
            letterSpacing: '0.22em', textTransform: 'uppercase',
            marginBottom: '14px', fontWeight: 600
          }}>
            This is to officially certify that
          </p>

          {/* ── INTERN/EMPLOYEE NAME — Large, prominent ── */}
          <div style={{ marginBottom: '10px' }}>
            <h1 style={{
              fontFamily: "'Georgia', serif",
              fontSize: 'clamp(28px, 5vw, 44px)',
              fontWeight: 700,
              color: '#ffffff',
              letterSpacing: '0.03em',
              lineHeight: 1.1,
              textShadow: '0 0 40px rgba(139,92,246,0.4)',
              margin: 0
            }}>
              {cert.recipient_name}
            </h1>

            {/* Decorative underline */}
            <div style={{
              width: '200px', height: '2px', margin: '10px auto 0',
              background: `linear-gradient(90deg, transparent, ${gc}, transparent)`
            }} />
          </div>

          {/* ── ID Numbers row ── */}
          <div style={{
            display: 'inline-flex', flexWrap: 'wrap', gap: '16px',
            justifyContent: 'center',
            marginBottom: '20px',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: '12px',
            padding: '10px 20px',
          }}>
            {cert.college_id_number && (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: 'sans-serif' }}>
                  Student / Roll ID
                </div>
                <div style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '12px', color: 'rgba(255,255,255,0.8)' }}>
                  {cert.college_id_number}
                </div>
              </div>
            )}
            {cert.college_id_number && cert.govt_id_masked && (
              <div style={{ width: '1px', background: 'rgba(255,255,255,0.1)', alignSelf: 'stretch' }} />
            )}
            {cert.govt_id_type && cert.govt_id_masked && (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: 'sans-serif' }}>
                  Govt. ID ({cert.govt_id_type})
                </div>
                <div style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '12px', color: 'rgba(255,255,255,0.8)' }}>
                  {cert.govt_id_masked}
                </div>
              </div>
            )}
            {cert.college_name && (
              <>
                {(cert.college_id_number || cert.govt_id_masked) && (
                  <div style={{ width: '1px', background: 'rgba(255,255,255,0.1)', alignSelf: 'stretch' }} />
                )}
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: 'sans-serif' }}>
                    Institution
                  </div>
                  <div style={{ fontFamily: 'sans-serif', fontWeight: 600, fontSize: '12px', color: 'rgba(255,255,255,0.8)', maxWidth: '180px' }}>
                    {cert.college_name}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* ── Completion paragraph ── */}
          <p style={{
            fontFamily: "'Georgia', serif",
            fontSize: '14px',
            color: 'rgba(255,255,255,0.65)',
            lineHeight: 1.85,
            maxWidth: '600px',
            margin: '0 auto 24px',
            padding: '0 16px'
          }}>
            has successfully completed an intensive{' '}
            <strong style={{ color: '#ffffff', fontWeight: 700 }}>{cert.duration}</strong>{' '}
            professional tenure as{' '}
            <strong style={{ color: gc, fontWeight: 700 }}>{cert.role}</strong>{' '}
            at <strong style={{ color: '#ffffff' }}>Siddhi Dynamics LLP</strong>,{' '}
            from <strong style={{ color: '#ffffff' }}>{cert.start_date}</strong> to{' '}
            <strong style={{ color: '#ffffff' }}>{cert.completion_date}</strong>,{' '}
            demonstrating exceptional commitment, applied business acumen, and measurable professional impact.
          </p>

          {/* ── Key Achievements ── */}
          {cert.key_achievements && cert.key_achievements.length > 0 && (
            <div style={{
              textAlign: 'left',
              background: 'rgba(255,255,255,0.025)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: '14px',
              padding: '16px 20px',
              marginBottom: '20px',
              maxWidth: '640px',
              marginInline: 'auto'
            }}>
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                marginBottom: '10px'
              }}>
                <span style={{
                  fontFamily: 'sans-serif', fontWeight: 700, fontSize: '10px',
                  letterSpacing: '0.2em', textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.5)'
                }}>
                  ✦ Key Contributions & Proofs
                </span>
                <span style={{
                  fontFamily: 'monospace', fontSize: '10px', fontWeight: 700,
                  color: '#34d399',
                  background: 'rgba(52,211,153,0.08)',
                  border: '1px solid rgba(52,211,153,0.2)',
                  padding: '2px 8px', borderRadius: '100px'
                }}>
                  {cert.points_of_proof_count} CEO-Verified Proofs
                </span>
              </div>
              <ul style={{ margin: 0, padding: '0 0 0 16px', listStyle: 'none' }}>
                {cert.key_achievements.map((item, i) => (
                  <li key={i} style={{
                    fontFamily: 'sans-serif', fontSize: '12px',
                    color: 'rgba(255,255,255,0.6)',
                    lineHeight: 1.7,
                    paddingLeft: '0',
                    display: 'flex', gap: '8px', marginBottom: '4px'
                  }}>
                    <span style={{ color: gc, fontWeight: 900, flexShrink: 0 }}>›</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* ── Grade badge ── */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '12px',
            padding: '10px 24px',
            background: `rgba(${gc === '#f59e0b' ? '245,158,11' : gc === '#34d399' ? '52,211,153' : gc === '#60a5fa' ? '96,165,250' : '167,139,250'},0.08)`,
            border: `1px solid ${gc}33`,
            borderRadius: '100px',
          }}>
            <span style={{ fontFamily: 'sans-serif', fontSize: '11px', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600 }}>
              Performance Grade
            </span>
            <span style={{ fontWeight: 900, fontSize: '14px', color: gc, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              {cert.grade}
            </span>
            <span style={{ color: '#f59e0b', letterSpacing: '2px', fontSize: '12px' }}>
              {'★'.repeat(stars)}{'☆'.repeat(5 - stars)}
            </span>
          </div>
        </div>

        {/* ── SIGNATURE & SEAL ROW ── */}
        <div style={{
          marginTop: '28px',
          paddingTop: '20px',
          borderTop: '1px solid rgba(245,158,11,0.15)',
          display: 'grid',
          gridTemplateColumns: '1fr auto 1fr',
          gap: '24px',
          alignItems: 'end'
        }}>
          {/* Left: Registry data */}
          <div style={{ fontFamily: 'monospace', fontSize: '10px', color: 'rgba(255,255,255,0.35)', lineHeight: 2 }}>
            <div><span style={{ color: 'rgba(255,255,255,0.55)', fontWeight: 700 }}>Certificate No:</span> <span style={{ color: gc, fontWeight: 700 }}>{cert.certificate_no}</span></div>
            <div><span style={{ color: 'rgba(255,255,255,0.55)', fontWeight: 700 }}>Issue Date:</span> {cert.issue_date}</div>
            <div><span style={{ color: 'rgba(255,255,255,0.55)', fontWeight: 700 }}>Checksum:</span> <span style={{ wordBreak: 'break-all' }}>{cert.verification_checksum}</span></div>
            <div style={{ marginTop: '6px' }}>
              <span style={{
                background: isValid ? 'rgba(52,211,153,0.1)' : 'rgba(248,113,113,0.1)',
                border: `1px solid ${isValid ? 'rgba(52,211,153,0.3)' : 'rgba(248,113,113,0.3)'}`,
                color: isValid ? '#34d399' : '#f87171',
                padding: '2px 10px', borderRadius: '100px',
                fontWeight: 700, fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.12em'
              }}>
                {isValid ? '✓ Registry: Valid' : '✗ Registry: Revoked'}
              </span>
            </div>
          </div>

          {/* Center: Official seal */}
          <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
            <div style={{
              width: 80, height: 80,
              borderRadius: '50%',
              border: '2px solid rgba(245,158,11,0.45)',
              background: 'radial-gradient(circle, rgba(245,158,11,0.08), rgba(245,158,11,0.03))',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 24px rgba(245,158,11,0.12)',
            }}>
              <div style={{ fontSize: '20px', color: '#f59e0b' }}>✦</div>
              <div style={{ fontFamily: 'monospace', fontWeight: 900, fontSize: '7px', color: '#f59e0b', letterSpacing: '0.1em', textTransform: 'uppercase', textAlign: 'center', lineHeight: 1.3, marginTop: '2px' }}>
                OFFICIAL<br />SEAL
              </div>
              <div style={{ fontFamily: 'monospace', fontSize: '6px', color: 'rgba(245,158,11,0.6)', letterSpacing: '0.08em' }}>
                ACJ-3766
              </div>
            </div>
            <div style={{ fontFamily: 'monospace', fontSize: '8px', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              MCA Registered
            </div>
          </div>

          {/* Right: Signature */}
          <div style={{ textAlign: 'right' }}>
            <div style={{
              fontFamily: "'Georgia', serif",
              fontSize: '20px', fontStyle: 'italic',
              fontWeight: 700, color: '#ffffff',
              marginBottom: '6px',
              letterSpacing: '0.02em'
            }}>
              Sarugu Sai Vara Prasad
            </div>
            <div style={{
              width: '140px', height: '1.5px',
              background: `linear-gradient(90deg, transparent, ${gc})`,
              marginLeft: 'auto', marginBottom: '6px'
            }} />
            <div style={{ fontFamily: 'sans-serif', fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.7)', letterSpacing: '0.05em' }}>
              Founder & Designated Partner
            </div>
            <div style={{ fontFamily: 'sans-serif', fontSize: '10px', color: 'rgba(255,255,255,0.35)' }}>
              Siddhi Dynamics LLP
            </div>
          </div>
        </div>

        {/* ── Footer: verification URL ── */}
        <div style={{
          marginTop: '20px',
          paddingTop: '14px',
          borderTop: '1px dashed rgba(255,255,255,0.08)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
          fontFamily: 'monospace', fontSize: '9px', color: 'rgba(255,255,255,0.25)',
          textAlign: 'center'
        }}>
          <span style={{ color: '#34d399' }}>🔒</span>
          <span>
            Immutable Anti-Tamper Record &nbsp;•&nbsp; 
            Verify at: <strong style={{ color: 'rgba(255,255,255,0.45)' }}>siddhidynamics.in/verify-certificate?no={cert.certificate_no}</strong>
            &nbsp;•&nbsp; Issued under Siddhi Dynamics LLP Digital Authentication Guidelines
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function CertificateVerification() {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryNo = searchParams.get('no') || '';

  const [searchInput, setSearchInput] = useState(queryNo);
  const [certificate, setCertificate] = useState<CertificateRecord | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    if (queryNo) {
      setSearchInput(queryNo);
      performSearch(queryNo);
    }
  }, [queryNo]);

  const performSearch = (query: string) => {
    if (!query.trim()) { setCertificate(null); setHasSearched(false); return; }
    setCertificate(internshipService.getCertificateByNo(query.trim()));
    setHasSearched(true);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    setSearchParams({ no: searchInput.trim() });
    performSearch(searchInput.trim());
  };

  const copyCertNo = () => {
    if (certificate) {
      navigator.clipboard.writeText(certificate.certificate_no);
      toast.success('Certificate ID copied!');
    }
  };

  const handlePrint = () => window.print();

  return (
    <div className="min-h-screen bg-background text-foreground font-sans flex flex-col">
      <Helmet>
        <title>Certificate Verification Portal | Siddhi Dynamics LLP</title>
        <meta name="description" content="Verify the authenticity of Siddhi Dynamics LLP internship certificates and employee credentials. Every certificate has a unique ID and cryptographic checksum." />
        <style>{`
          @media print {
            body * { visibility: hidden !important; }
            #printable-certificate, #printable-certificate * { visibility: visible !important; }
            #printable-certificate { position: fixed; inset: 0; width: 100vw; margin: 0; border-radius: 0 !important; }
          }
        `}</style>
      </Helmet>

      <Navbar />

      <main className="flex-1 pt-28 pb-20 px-4 sm:px-6 max-w-5xl mx-auto w-full">

        {/* Breadcrumb */}
        <div className="mb-8 flex items-center justify-between">
          <Link to="/careers" className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Careers
          </Link>
          <span className="text-[11px] font-mono px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
            LLPIN: ACJ-3766
          </span>
        </div>

        {/* Hero */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-primary text-xs font-semibold mb-4">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Anti-Tamper Cryptographic Credential Registry
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-3">
            Certificate <span className="bg-gradient-to-r from-amber-400 to-primary bg-clip-text text-transparent">Verification</span> Portal
          </h1>
          <p className="text-sm text-muted-foreground">
            Every intern and employee issued a certificate has a unique <span className="font-mono text-foreground">SD-CERT-YYYY-XX-XXXX</span> identifier and tamper-proof checksum permanently recorded in our registry.
          </p>

          {/* Search */}
          <form onSubmit={handleSearchSubmit} className="mt-6 flex gap-2 max-w-xl mx-auto">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Enter Certificate ID (SD-CERT-...) or recipient email"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-card border border-border/80 text-foreground text-xs sm:text-sm font-mono focus:outline-none focus:border-primary shadow-sm"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-3 rounded-xl bg-primary text-primary-foreground font-black text-xs uppercase tracking-wider hover:opacity-90 transition-opacity flex items-center gap-2 cursor-pointer shadow-md"
            >
              <ShieldCheck className="w-4 h-4" />
              Verify
            </button>
          </form>

          {/* Sample chips */}
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-[11px] text-muted-foreground">
            <span>Sample IDs:</span>
            {['SD-CERT-2026-BD-0108', 'SD-CERT-2026-DM-0214'].map(id => (
              <button
                key={id}
                onClick={() => { setSearchInput(id); performSearch(id); }}
                className="px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-amber-400 font-mono cursor-pointer border border-white/10 transition-colors"
              >
                {id}
              </button>
            ))}
          </div>
        </div>

        {/* Result */}
        {hasSearched && (
          <div className="space-y-5">
            {certificate ? (
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">

                {/* Status banner */}
                <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                  certificate.status === 'Valid'
                    ? 'bg-emerald-500/10 border-emerald-500/30'
                    : 'bg-rose-500/10 border-rose-500/30'
                }`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      certificate.status === 'Valid' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                    }`}>
                      {certificate.status === 'Valid' ? <CheckCircle2 className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`font-black text-sm uppercase tracking-wider ${certificate.status === 'Valid' ? 'text-emerald-200' : 'text-rose-200'}`}>
                          {certificate.status === 'Valid' ? '✓ Cryptographically Verified & Authentic' : '✗ Certificate Revoked'}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/10 text-white">
                          Certificate ID: <span className="font-mono text-amber-300">{certificate.certificate_no}</span>
                        </span>
                      </div>
                      <p className="text-xs text-white/60 mt-0.5">
                        {certificate.status === 'Valid'
                          ? `Official record confirmed for ${certificate.recipient_name} — Issued ${certificate.issue_date}`
                          : 'This certificate has been revoked by administrator authority.'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
                    <button onClick={handlePrint} className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold text-white flex items-center gap-1.5 transition-colors cursor-pointer">
                      <Printer className="w-3.5 h-3.5" />
                      Print
                    </button>
                    <button onClick={copyCertNo} className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold text-white flex items-center gap-1.5 transition-colors cursor-pointer">
                      <Copy className="w-3.5 h-3.5" />
                      Copy ID
                    </button>
                  </div>
                </div>

                {/* Certificate Template */}
                <CertificateTemplate cert={certificate} />

                {/* Technical record */}
                <div className="p-5 rounded-2xl bg-card/60 border border-border/50 text-xs space-y-3">
                  <h4 className="font-bold text-foreground flex items-center gap-2">
                    <BadgeCheck className="w-4 h-4 text-amber-400" />
                    Permanent Registry Ledger Entry
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-[11px]">
                    {[
                      { label: 'Certificate ID', value: certificate.certificate_no, color: 'text-amber-400' },
                      { label: 'Recipient Name', value: certificate.recipient_name, color: 'text-foreground' },
                      { label: 'Role / Designation', value: certificate.role, color: 'text-primary' },
                      { label: 'Student / Roll ID', value: certificate.college_id_number || '—', color: 'text-foreground' },
                      { label: `Govt ID (${certificate.govt_id_type})`, value: certificate.govt_id_masked, color: 'text-foreground' },
                      { label: 'Cryptographic Checksum', value: certificate.verification_checksum, color: 'text-emerald-400' },
                    ].map(f => (
                      <div key={f.label} className="p-3 rounded-xl bg-white/4 border border-white/5">
                        <span className="text-muted-foreground block text-[10px] uppercase tracking-wider mb-0.5">{f.label}</span>
                        <span className={`font-bold truncate block ${f.color}`}>{f.value}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground text-[11px]">
                    <Lock className="w-3 h-3 text-emerald-400" />
                    Immutable Record • Non-Editable • Non-Copyable • Anti-Tamper Protected
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                className="p-10 rounded-3xl bg-card border border-rose-500/30 text-center space-y-4 max-w-lg mx-auto"
              >
                <div className="w-14 h-14 rounded-full bg-rose-500/15 text-rose-400 flex items-center justify-center mx-auto">
                  <XCircle className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-foreground">Certificate Not Found</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  No record matches <strong className="text-foreground font-mono">"{searchInput}"</strong>.
                  Check the certificate number printed on your document carefully — it follows the format{' '}
                  <span className="font-mono text-amber-400">SD-CERT-YYYY-BD/DM-XXXX</span>.
                </p>
                <p className="text-xs text-muted-foreground">
                  Contact our registrar:{' '}
                  <a href="mailto:careers@siddhidynamics.in" className="text-primary hover:underline font-semibold">
                    careers@siddhidynamics.in
                  </a>
                </p>
              </motion.div>
            )}
          </div>
        )}
      </main>

      <FooterSection />
    </div>
  );
}
