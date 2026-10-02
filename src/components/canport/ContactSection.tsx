import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { portfolioProfile, servicePlans, getCalendlyUrl } from '../../data/portfolioData';
import { Mail, Calendar, Linkedin, Send, CheckCircle2, RotateCcw, Sparkles, ExternalLink, Clock, Loader2, ChevronDown } from 'lucide-react';

interface ContactSectionProps {
  onOpenBooking?: (plan?: string) => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ onOpenBooking }) => {
  const [selectedPlan, setSelectedPlan] = useState<string>('');
  const [planMenuOpen, setPlanMenuOpen] = useState(false);
  const [activePlanIndex, setActivePlanIndex] = useState(0);
  const planMenuRef = useRef<HTMLDivElement>(null);
  const planTriggerRef = useRef<HTMLButtonElement>(null);
  const activeOptionRef = useRef<HTMLLIElement>(null);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [validationAttempted, setValidationAttempted] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    needs: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationAttempted(true);
    const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim());
    const hasEmptyField = !selectedPlan || !formData.name.trim() || !formData.email.trim() || !formData.role.trim() || !formData.needs.trim();
    if (hasEmptyField || !emailIsValid) {
      setErrorMessage(hasEmptyField
        ? 'Veuillez remplir tous les champs avant d’envoyer.'
        : 'Veuillez saisir une adresse email valide.');
      return;
    }
    if (isRedirecting) return;
    setErrorMessage('');
    setIsRedirecting(true);
    const note = [formData.role.trim(), formData.needs.trim()].filter(Boolean).join(' — ');
    window.location.assign(getCalendlyUrl(selectedPlan, {
      name: formData.name.trim(),
      email: formData.email.trim(),
      note,
    }));
  };

  const handleReset = () => {
    setSubmitted(false);
    setIsRedirecting(false);
    setValidationAttempted(false);
    setSelectedPlan('');
    setErrorMessage('');
    setFormData({
      name: '',
      email: '',
      role: '',
      needs: '',
    });
  };

  const calendlyUrlWithPlan = getCalendlyUrl(selectedPlan, {
    name: formData.name,
    email: formData.email,
  });
  const planInvalid = validationAttempted && !selectedPlan;

  const selectedPlanIndex = servicePlans.findIndex((plan) => plan.name === selectedPlan);

  const openPlanMenu = () => {
    setActivePlanIndex(selectedPlanIndex >= 0 ? selectedPlanIndex : 0);
    setPlanMenuOpen(true);
  };

  const choosePlan = (planName: string) => {
    setSelectedPlan(planName);
    setPlanMenuOpen(false);
    planTriggerRef.current?.focus();
    if (planName && errorMessage) setErrorMessage('');
  };

  const handlePlanTriggerKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (!planMenuOpen) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openPlanMenu();
      }
      return;
    }
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActivePlanIndex((i) => Math.min(i + 1, servicePlans.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActivePlanIndex((i) => Math.max(i - 1, 0));
        break;
      case 'Home':
        e.preventDefault();
        setActivePlanIndex(0);
        break;
      case 'End':
        e.preventDefault();
        setActivePlanIndex(servicePlans.length - 1);
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (servicePlans[activePlanIndex]) choosePlan(servicePlans[activePlanIndex].name);
        break;
      case 'Escape':
        e.preventDefault();
        setPlanMenuOpen(false);
        planTriggerRef.current?.focus();
        break;
      case 'Tab':
        setPlanMenuOpen(false);
        break;
    }
  };

  useEffect(() => {
    if (!planMenuOpen) return;
    const onPointerDown = (e: PointerEvent) => {
      if (planMenuRef.current && !planMenuRef.current.contains(e.target as Node)) {
        setPlanMenuOpen(false);
      }
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [planMenuOpen]);

  useEffect(() => {
    if (planMenuOpen) activeOptionRef.current?.scrollIntoView({ block: 'nearest' });
  }, [planMenuOpen, activePlanIndex]);

  const nameInvalid = validationAttempted && !formData.name.trim();
  const emailInvalid = validationAttempted && (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim()));
  const roleInvalid = validationAttempted && !formData.role.trim();
  const needsInvalid = validationAttempted && !formData.needs.trim();

  return (
    <section id="contact" className="py-14 sm:py-20 md:py-28 bg-[#FDFBF7] border-t border-[#EAE3D8] scroll-mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-9 sm:gap-12">
          {/* Left direct contact card */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="lg:col-span-5 space-y-6"
          >
            <span className="text-xs font-semibold uppercase tracking-wider text-[#7A583E] block">
              Prise de contact
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#2D241E] tracking-tight">
              Prêt·e à vous libérer de l'administratif ?
            </h2>
            <p className="text-sm sm:text-base text-[#635345] leading-relaxed">
              Discutons de vos besoins actuels lors d'un appel découverte gratuit de 30 minutes, ou écrivez-moi directement par message.
            </p>

            <div className="p-4 sm:p-7 rounded-2xl sm:rounded-3xl bg-[#FAF7F2] border border-[#E8E1D5] space-y-1 shadow-2xs hover:shadow-lg transition-all duration-300">
              <div className="flex min-h-14 items-center gap-3.5 px-2 py-1.5 rounded-2xl hover:bg-white/70 transition-colors">
                <div className="w-10 h-10 rounded-2xl bg-white border border-[#E8E1D5] flex items-center justify-center text-[#7A583E] shadow-2xs shrink-0">
                  <Calendar className="w-4 h-4 text-[#8F6544]" />
                </div>
                <div className="min-w-0">
                  <span className="text-xs text-[#8A7969] block">Appel découverte offert (30 min)</span>
                  <button
                    type="button"
                    onClick={() => onOpenBooking?.(selectedPlan || undefined)}
                    className="break-words text-xs sm:text-sm font-bold text-[#2D241E] hover:text-[#7A583E] underline decoration-[#E0A97E] underline-offset-4 active:scale-95 transition-all cursor-pointer text-left"
                  >
                    Choisir un créneau sur mon agenda{selectedPlan ? ` (${selectedPlan})` : ''}
                  </button>
                </div>
              </div>

              <div className="flex min-h-14 items-center gap-3.5 px-2 py-1.5 rounded-2xl hover:bg-white/70 transition-colors">
                <div className="w-10 h-10 rounded-2xl bg-white border border-[#E8E1D5] flex items-center justify-center text-[#7A583E] shadow-2xs shrink-0">
                  <Mail className="w-4 h-4 text-[#8F6544]" />
                </div>
                <div className="min-w-0">
                  <span className="text-xs text-[#8A7969] block">Email direct</span>
                  <a
                    href={`mailto:${portfolioProfile.links.email}`}
                    className="mt-0.5 block break-all text-xs sm:text-sm font-bold leading-snug text-[#2D241E] hover:text-[#7A583E] transition-colors"
                  >
                    {portfolioProfile.links.email}
                  </a>
                </div>
              </div>

              <div className="flex min-h-14 items-center gap-3.5 px-2 py-1.5 rounded-2xl hover:bg-white/70 transition-colors">
                <div className="w-10 h-10 rounded-2xl bg-white border border-[#E8E1D5] flex items-center justify-center text-[#7A583E] shadow-2xs shrink-0">
                  <Linkedin className="w-4 h-4 text-[#8F6544]" />
                </div>
                <div className="min-w-0">
                  <span className="text-xs text-[#8A7969] block">Réseau professionnel</span>
                  <a
                    href={portfolioProfile.links.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-0.5 block text-xs sm:text-sm font-bold leading-snug text-[#2D241E] hover:text-[#7A583E] transition-colors"
                  >
                    Profil LinkedIn de Candya
                  </a>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right form */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, delay: 0.15, ease: 'easeOut' }}
            className="lg:col-span-7"
          >
            <div className="p-4 sm:p-9 rounded-2xl sm:rounded-3xl bg-white border border-[#E8E1D5] shadow-xs hover:shadow-xl transition-all duration-300">
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2 sm:gap-3 mb-2">
                <h3 className="text-lg sm:text-xl font-extrabold text-[#2D241E] tracking-tight">
                  Envoyer un message écrit
                </h3>
                <span className="max-w-28 text-center text-[10px] sm:text-[11px] font-semibold text-[#8F6544] bg-[#F7F2E8] px-2 py-1 rounded-xl sm:rounded-full border border-[#E8DFC8]">
                  Réponse sous 24h
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#635345] mb-6">
                Je vous réponds personnellement avec soin et pragmatisme sous 24h ouvrées.
              </p>

              {submitted ? (
                /* Soothing Success Indicator Animation */
                <motion.div
                  initial={{ opacity: 0, scale: 0.94, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="p-4 sm:p-10 rounded-2xl sm:rounded-3xl bg-gradient-to-b from-[#F7FAF5] via-[#FCFDFB] to-[#F7FAF5] border border-emerald-200/80 text-center relative overflow-hidden shadow-sm"
                >
                  {/* Calming ambient waves */}
                  <motion.div
                    initial={{ scale: 0.6, opacity: 0.6 }}
                    animate={{ scale: [1, 1.4, 1.7], opacity: [0.4, 0.15, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeOut' }}
                    className="absolute top-12 left-1/2 -translate-x-1/2 w-28 h-28 rounded-full bg-emerald-200/40 pointer-events-none -z-0"
                  />
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0.5 }}
                    animate={{ scale: [1, 1.3, 1.5], opacity: [0.3, 0.1, 0] }}
                    transition={{ duration: 3, delay: 0.8, repeat: Infinity, ease: 'easeOut' }}
                    className="absolute top-12 left-1/2 -translate-x-1/2 w-28 h-28 rounded-full bg-[#E0A97E]/30 pointer-events-none -z-0"
                  />

                  {/* Soothing animated Checkmark */}
                  <div className="relative z-10 w-18 h-18 mx-auto mb-4 flex items-center justify-center">
                    <motion.div
                      initial={{ scale: 0, rotate: -20 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.1 }}
                      className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-[0_4px_20px_rgba(16,185,129,0.18)] border border-emerald-200"
                    >
                      <svg
                        className="w-8 h-8 text-emerald-700"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <motion.path
                          d="M20 6L9 17L4 12"
                          initial={{ pathLength: 0, opacity: 0 }}
                          animate={{ pathLength: 1, opacity: 1 }}
                          transition={{ duration: 0.7, delay: 0.25, ease: 'easeInOut' }}
                        />
                      </svg>
                    </motion.div>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35, duration: 0.5 }}
                    className="relative z-10"
                  >
                    <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-800 bg-emerald-100/80 px-3 py-1 rounded-full inline-block mb-2">
                      Transmission confirmée
                    </span>
                    <h4 className="text-xl sm:text-2xl font-extrabold text-[#2D241E] tracking-tight">
                      Message transmis avec succès !
                    </h4>
                    <p className="text-xs sm:text-sm text-[#5C4D3E] max-w-md mx-auto mt-2 leading-relaxed">
                      Merci <strong className="text-[#2D241E]">{formData.name}</strong>, votre demande concernant la formule <span className="text-[#A87C51] font-bold underline decoration-[#E0A97E]">{selectedPlan}</span> a bien été transmise à Candya.
                    </p>
                  </motion.div>

                  {/* Summary card */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.45, duration: 0.5 }}
                    className="mt-6 p-4 rounded-2xl bg-white border border-[#E6DDD0] text-xs text-[#5C4D3E] max-w-md mx-auto text-left space-y-2 shadow-2xs relative z-10"
                  >
                    <div className="grid grid-cols-1 gap-1 pb-2 border-b border-[#F0EBE2] sm:flex sm:items-center sm:justify-between">
                      <span className="font-semibold text-[#7A695B]">Formule choisie :</span>
                      <span className="font-bold text-[#2D241E] bg-[#FAF4EB] px-2 py-0.5 rounded-md border border-[#E8DFC8]">
                        {selectedPlan}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 gap-1 pb-2 border-b border-[#F0EBE2] sm:flex sm:items-center sm:justify-between">
                      <span className="font-semibold text-[#7A695B]">Email de contact :</span>
                       <span className="break-all font-medium text-[#2D241E]">{formData.email}</span>
                    </div>
                    <div className="grid grid-cols-1 gap-1 sm:flex sm:items-center sm:justify-between">
                      <span className="font-semibold text-[#7A695B]">Engagement de réponse :</span>
                      <span className="font-bold text-emerald-700 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        Sous 24h ouvrées
                      </span>
                    </div>
                  </motion.div>

                  {/* Direct bridge to Calendly with the selected plan */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.55, duration: 0.5 }}
                    className="mt-6 p-4 rounded-2xl bg-[#FAF6F0] border border-[#E8DFC8] text-xs text-[#5C4D3E] max-w-md mx-auto text-center space-y-3 relative z-10"
                  >
                    <div className="flex items-center justify-center gap-1.5 text-[11px] font-bold text-[#7A583E] uppercase tracking-wide">
                      <Sparkles className="w-3.5 h-3.5 text-[#A87C51]" />
                      <span>Vous souhaitez aller plus vite ?</span>
                    </div>
                    <p className="text-xs text-[#635345] leading-relaxed">
                      Planifiez dès à présent votre échange découverte gratuit de 30 minutes sur Calendly avec la formule <strong>{selectedPlan}</strong> :
                    </p>
                    <a
                      href={calendlyUrlWithPlan}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-2 py-3 px-5 rounded-full bg-[#2D241E] hover:bg-[#3E3228] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer"
                    >
                      <Calendar className="w-4 h-4 text-[#E0A97E]" />
                      <span>Réserver mon créneau Calendly ({selectedPlan})</span>
                      <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                    </a>
                  </motion.div>

                  <div className="mt-6 pt-2 relative z-10">
                    <button
                      type="button"
                      onClick={handleReset}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-[#E6DDD0] hover:border-[#7A583E] text-xs font-semibold text-[#2D241E] transition-all cursor-pointer shadow-2xs hover:shadow-xs active:scale-95"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-[#7A583E]" />
                      <span>Envoyer un autre message</span>
                    </button>
                  </div>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-4">
                  {/* Plan / Subject selector */}
                  <div>
                    <label htmlFor="contact-plan" className="text-xs font-bold text-[#3E3228] block mb-2">
                      Formule ou besoin ciblé <span className="text-red-600">*</span>
                    </label>
                    <div className="relative">
                      <select
                        id="contact-plan"
                        name="plan"
                        required
                        aria-invalid={planInvalid}
                        value={selectedPlan}
                        onChange={(e) => {
                          setSelectedPlan(e.target.value);
                          if (e.target.value && errorMessage) setErrorMessage('');
                        }}
                        className={`min-h-11 w-full appearance-none rounded-2xl border bg-[#FAF7F2]/90 px-4 py-2.5 pr-11 text-xs font-semibold text-[#2D241E] backdrop-blur-md transition-all focus:bg-white focus:outline-hidden focus-visible:ring-2 sm:text-sm ${planInvalid ? 'border-red-500 focus:border-red-600 focus-visible:ring-red-200' : 'border-[#E6DDD0] focus:border-[#7A583E] focus-visible:ring-[#A87C51]/30'}`}
                      >
                        <option value="" disabled>Cliquez ici pour choisir une formule</option>
                        {servicePlans.map((plan) => (
                          <option key={plan.id} value={plan.name}>
                            {plan.name} — {plan.badge}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7A583E]" aria-hidden="true" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="contact-name" className="text-xs font-bold text-[#3E3228] block mb-1">Votre nom & prénom *</label>
                      <input
                        id="contact-name"
                        name="name"
                        autoComplete="name"
                        type="text"
                        required
                        maxLength={100}
                        aria-invalid={nameInvalid}
                        value={formData.name}
                        onChange={(e) => {
                          setFormData({ ...formData, name: e.target.value });
                          if (e.target.value.trim() && errorMessage) setErrorMessage('');
                        }}
                        placeholder="Ex: Sophie Martin"
                        className={`w-full px-4 py-2.5 rounded-2xl bg-[#FAF7F2] border text-xs sm:text-sm text-[#2D241E] focus:outline-hidden focus:bg-white transition-all ${nameInvalid ? 'border-red-500 focus:border-red-600 ring-2 ring-red-100' : 'border-[#E6DDD0] focus:border-[#7A583E]'}`}
                      />
                    </div>
                    <div>
                      <label htmlFor="contact-email" className="text-xs font-bold text-[#3E3228] block mb-1">Votre adresse email *</label>
                      <input
                        id="contact-email"
                        name="email"
                        autoComplete="email"
                        type="email"
                        required
                        maxLength={255}
                        aria-invalid={emailInvalid}
                        value={formData.email}
                        onChange={(e) => {
                          setFormData({ ...formData, email: e.target.value });
                          if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.target.value.trim()) && errorMessage) setErrorMessage('');
                        }}
                        placeholder="sophie@monbusiness.com"
                        className={`w-full px-4 py-2.5 rounded-2xl bg-[#FAF7F2] border text-xs sm:text-sm text-[#2D241E] focus:outline-hidden focus:bg-white transition-all ${emailInvalid ? 'border-red-500 focus:border-red-600 ring-2 ring-red-100' : 'border-[#E6DDD0] focus:border-[#7A583E]'}`}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="contact-role" className="text-xs font-bold text-[#3E3228] block mb-1">Votre activité & format d'accompagnement <span className="text-red-600">*</span></label>
                    <input
                      id="contact-role"
                      name="role"
                      type="text"
                      required
                      maxLength={200}
                      aria-invalid={roleInvalid}
                      value={formData.role}
                      onChange={(e) => {
                        setFormData({ ...formData, role: e.target.value });
                        if (e.target.value.trim() && errorMessage) setErrorMessage('');
                      }}
                      placeholder="Ex: Coach certifiée, formatrice en ligne (200 élèves/an)..."
                      className={`w-full px-4 py-2.5 rounded-2xl bg-[#FAF7F2] border text-xs sm:text-sm text-[#2D241E] focus:outline-hidden focus:bg-white transition-all ${roleInvalid ? 'border-red-500 focus:border-red-600 ring-2 ring-red-100' : 'border-[#E6DDD0] focus:border-[#7A583E]'}`}
                    />
                  </div>

                  <div>
                    <div className="mb-1">
                      <label htmlFor="contact-needs" className="text-xs font-bold text-[#3E3228] block">
                        Ce qui vous pèse aujourd'hui <span className="text-red-500">*</span>
                      </label>
                    </div>

                    <textarea
                      id="contact-needs"
                      name="needs"
                      required
                      maxLength={1000}
                      aria-invalid={needsInvalid}
                      rows={6}
                      value={formData.needs}
                      onChange={(e) => {
                        const needs = e.target.value;
                        setFormData((prev) => ({ ...prev, needs }));
                        if (needs.trim() && errorMessage) {
                          setErrorMessage('');
                        }
                      }}
                      placeholder="Gestion des emails, retard de facturation, suivi des clients..."
                      className={`w-full resize-none rounded-2xl border bg-[#FAF7F2] px-4 py-3 text-xs leading-relaxed text-[#2D241E] transition-all placeholder:text-[#9A8A7B] focus:bg-white focus:outline-hidden focus-visible:ring-2 sm:text-sm ${needsInvalid ? 'border-red-500 focus:border-red-600 focus-visible:ring-red-200' : 'border-[#E6DDD0] focus:border-[#7A583E] focus-visible:ring-[#A87C51]/30'}`}
                    />

                    {errorMessage && (
                      <p className="mt-1.5 text-xs text-red-600 font-medium">
                        {errorMessage}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                    <button
                      type="submit"
                      disabled={isRedirecting}
                      aria-busy={isRedirecting}
                      className="w-full sm:flex-1 py-3.5 px-6 rounded-full bg-[#2D241E] hover:bg-[#3E3228] active:scale-95 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-sm hover:shadow-lg transition-all cursor-pointer disabled:cursor-wait disabled:opacity-70"
                    >
                       {isRedirecting && <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />}
                       <span>{isRedirecting ? 'Envoi en cours…' : 'Envoyer et continuer sur Calendly'}</span>
                      <Send className="w-3.5 h-3.5 text-[#E0A97E]" />
                    </button>
                    <a
                      href={calendlyUrlWithPlan}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto py-3.5 px-5 rounded-full bg-[#FAF7F2] border border-[#E6DDD0] hover:bg-[#F2ECE2] text-[#473B30] text-xs font-semibold inline-flex items-center justify-center gap-2 transition-colors"
                      title="Ouvrir directement sur Calendly"
                    >
                      <Calendar className="w-3.5 h-3.5 text-[#7A583E]" />
                      <span>Calendly direct</span>
                      <ExternalLink className="w-3 h-3 text-[#8F6544]" />
                    </a>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
