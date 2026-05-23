import React, { useState, useEffect } from "react";
import {
  Briefcase,
  Cake,
  Users,
  Cookie,
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Github,
  Globe,
  Award,
  BookOpen,
  GraduationCap,
  Plus,
  Trash2,
  Printer,
  Sparkles,
  Save,
  FileText,
  Edit,
  Menu,
  X,
  Languages,
  RotateCcw,
  CheckCircle,
  HelpCircle,
  Link,
  Share2,
  Terminal,
  Upload,
  Image,
  Settings,
  Copy,
  Code,
  FileCode,
  Database,
  Eye,
  Lock
} from "lucide-react";
import { AreaCurriculo, CurriculoData, CurriculoMultidisciplinar, Experiencia, Educacao, Idioma } from "./types";
import { DEFAULT_CURRICULOS } from "./defaultData";
import ResumeView from "./components/ResumeView";
import AIEnhancerModal from "./components/AIEnhancerModal";

export default function App() {
  // Determine if it is a shared read-only view via URL params
  const isSharedViewParam = typeof window !== "undefined" && 
    (new URLSearchParams(window.location.search).get("view") === "true" || 
     new URLSearchParams(window.location.search).get("share") === "true");

  // Load data from localStorage or use default mock data
  const [data, setData] = useState<CurriculoMultidisciplinar>(() => {
    const saved = localStorage.getItem("joas_kelph_cv_portfolio");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.areas) {
          // Force name to be exactly "Joás Kelph" in all areas to prevent accent-loss changes
          Object.keys(parsed.areas).forEach((area) => {
            if (parsed.areas[area]) {
              parsed.areas[area].nome = "Joás Kelph";
            }
          });

          const itArea = parsed.areas["Tecnologia da Informação"];
          // If TI area is missing, incomplete, or contains our previous mock data placeholder, migrate to real PDF info
          if (!itArea || !itArea.experiencias || itArea.experiencias.some((exp: any) => exp.empresa === "TechSoluções Inovadoras Ltda.")) {
            parsed.areas["Tecnologia da Informação"] = { ...DEFAULT_CURRICULOS.areas["Tecnologia da Informação"] };
          }

          const gestaoArea = parsed.areas["Gestão"];
          // If Gestão area is missing, incomplete, or contains our previous mock food/F&B placeholder, migrate to real PDF info
          if (!gestaoArea || !gestaoArea.experiencias || gestaoArea.experiencias.some((exp: any) => exp.empresa === "Supermercado & Panificadora Aliança Ltda." || exp.empresa === "Rede de Restaurantes Bela Vista")) {
            parsed.areas["Gestão"] = { ...DEFAULT_CURRICULOS.areas["Gestão"] };
          }

          const atendimentoArea = parsed.areas["Atendimento ao Público"];
          // If Atendimento ao Público area is missing, incomplete, or contains old F&B placeholder, migrate to real PDF info
          if (!atendimentoArea || !atendimentoArea.experiencias || atendimentoArea.experiencias.some((exp: any) => exp.empresa === "Boulangerie Gourmet D'or" || exp.empresa === "Cafeteria Espresso & Cia")) {
            parsed.areas["Atendimento ao Público"] = { ...DEFAULT_CURRICULOS.areas["Atendimento ao Público"] };
          }

          const confeitariaArea = parsed.areas["Confeitaria"];
          // If Confeitaria area is missing, doesn't have the new courses, or doesn't have instagram, migrate to real PDF info
          if (!confeitariaArea || !confeitariaArea.certificacoes || !confeitariaArea.certificacoes.some((cert: any) => cert.includes("IFRS") || cert.includes("Pasta Americana")) || !confeitariaArea.contato.instagram) {
            parsed.areas["Confeitaria"] = { ...DEFAULT_CURRICULOS.areas["Confeitaria"] };
          }

          const padariaArea = parsed.areas["Padaria"];
          // If Padaria area is missing, doesn't have the new Salgadeiro course, or doesn't have instagram, migrate
          if (!padariaArea || !padariaArea.certificacoes || !padariaArea.certificacoes.some((cert: any) => cert.includes("Salgadeiro")) || !padariaArea.contato.instagram) {
            parsed.areas["Padaria"] = { ...DEFAULT_CURRICULOS.areas["Padaria"] };
          }
          localStorage.setItem("joas_kelph_cv_portfolio", JSON.stringify(parsed));
        }
        return parsed;
      } catch (e) {
        console.error("Erro ao ler dados do localStorage:", e);
      }
    }
    return DEFAULT_CURRICULOS;
  });

  const [activeArea, setActiveArea] = useState<AreaCurriculo>(data.activeArea || "Gestão");
  
  // Decide if shared view mode is on: true for visitors, false if owner activated editor
  const [isSharedView, setIsSharedView] = useState<boolean>(() => {
    const urlParams = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");
    if (urlParams.get("edit") === "true") return false;
    if (urlParams.get("view") === "true" || urlParams.get("share") === "true") return true;
    
    if (typeof window !== "undefined") {
      const storedAdmin = localStorage.getItem("joas_admin_editor_active");
      if (storedAdmin === "true") return false;
    }
    return true; // Default view-only for public!
  });

  const [isEditMode, setIsEditMode] = useState<boolean>(() => {
    const urlParams = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");
    if (urlParams.get("edit") === "true") return true;
    if (urlParams.get("view") === "true" || urlParams.get("share") === "true") return false;
    
    if (typeof window !== "undefined") {
      return localStorage.getItem("joas_admin_editor_active") === "true";
    }
    return false;
  });

  const [passwordModalOpen, setPasswordModalOpen] = useState<boolean>(false);
  const [passwordInput, setPasswordInput] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const handleToggleMode = (mode: "view" | "edit") => {
    if (mode === "edit") {
      setPasswordInput("");
      setPasswordError(null);
      setPasswordModalOpen(true);
    } else {
      setIsSharedView(true);
      setIsEditMode(false);
      localStorage.setItem("joas_admin_editor_active", "false");
    }
  };

  const handleVerifyPassword = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (passwordInput === "05062004") {
      setIsSharedView(false);
      setIsEditMode(true);
      localStorage.setItem("joas_admin_editor_active", "true");
      setPasswordModalOpen(false);
      setPasswordError(null);
    } else {
      setPasswordError("Senha incorreta! Tente novamente.");
    }
  };

  const [exportModalOpen, setExportModalOpen] = useState<boolean>(false);
  const [copiedDataSuccess, setCopiedDataSuccess] = useState<boolean>(false);

  const [shareToast, setShareToast] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [mobileViewTab, setMobileViewTab] = useState<"edit" | "preview">("edit");
  const [saveBanner, setSaveBanner] = useState<boolean>(false);

  // Gemini AI modal state
  const [aiModalOpen, setAiModalOpen] = useState<boolean>(false);
  const [aiTextToEnhance, setAiTextToEnhance] = useState<string>("");
  const [aiTextType, setAiTextType] = useState<"resumo" | "experiência" | "educação" | "geral">("resumo");
  const [aiCallback, setAiCallback] = useState<((text: string) => void) | null>(null);

  // Auto-sync activeArea state with the nested multidisciplinary schema
  useEffect(() => {
    setData((prev) => ({
      ...prev,
      activeArea,
    }));
  }, [activeArea]);

  // Persist to localStorage changes
  const saveToLocalStorage = (latestData: CurriculoMultidisciplinar) => {
    localStorage.setItem("joas_kelph_cv_portfolio", JSON.stringify(latestData));
    setSaveBanner(true);
    setTimeout(() => setSaveBanner(false), 3000);
  };

  const handleReset = () => {
    if (window.confirm("Deseja realmente redefinir o currículo para as informações padrão originais? Suas alterações serão perdidas.")) {
      setData(DEFAULT_CURRICULOS);
      setActiveArea(DEFAULT_CURRICULOS.activeArea);
      saveToLocalStorage(DEFAULT_CURRICULOS);
    }
  };

  const currentCv: CurriculoData = data.areas[activeArea];

  // Deep update functions for current active CV
  const updateCurrentCv = (updater: (draft: CurriculoData) => void) => {
    setData((prev) => {
      const updatedAreas = { ...prev.areas };
      const draft = JSON.parse(JSON.stringify(updatedAreas[activeArea])) as CurriculoData;
      updater(draft);
      updatedAreas[activeArea] = draft;
      const next = { ...prev, areas: updatedAreas };
      saveToLocalStorage(next);
      return next;
    });
  };

  // 1. Basic Info Updaters
  const handleBasicChange = (field: keyof CurriculoData, value: string) => {
    updateCurrentCv((draft) => {
      (draft[field] as string) = value;
    });
  };

  const handleContactChange = (field: keyof typeof currentCv.contato, value: string) => {
    updateCurrentCv((draft) => {
      draft.contato[field] = value;
    });
  };

  // 2. Experiences Core CRUD
  const handleAddExperience = () => {
    updateCurrentCv((draft) => {
      draft.experiencias.push({
        id: "exp_" + Date.now(),
        empresa: "Nova Empresa",
        cargo: "Novo Cargo",
        periodo: "Mês/Ano - Mês/Ano",
        descricao: "Descreva suas principais funções e aprendizados aqui.",
      });
    });
  };

  const handleUpdateExperience = (id: string, field: keyof Experiencia, value: string) => {
    updateCurrentCv((draft) => {
      const idx = draft.experiencias.findIndex((x) => x.id === id);
      if (idx !== -1) {
        draft.experiencias[idx][field] = value;
      }
    });
  };

  const handleRemoveExperience = (id: string) => {
    updateCurrentCv((draft) => {
      draft.experiencias = draft.experiencias.filter((x) => x.id !== id);
    });
  };

  // 3. Educations CRUD
  const handleAddEducation = () => {
    updateCurrentCv((draft) => {
      draft.educacoes.push({
        id: "edu_" + Date.now(),
        instituicao: "Instituição de Ensino",
        curso: "Curso ou Formação",
        periodo: "Ano de faturamento ou período",
        descricao: "",
      });
    });
  };

  const handleUpdateEducation = (id: string, field: keyof Educacao, value: string) => {
    updateCurrentCv((draft) => {
      const idx = draft.educacoes.findIndex((x) => x.id === id);
      if (idx !== -1) {
        draft.educacoes[idx][field] = value;
      }
    });
  };

  const handleRemoveEducation = (id: string) => {
    updateCurrentCv((draft) => {
      draft.educacoes = draft.educacoes.filter((x) => x.id !== id);
    });
  };

  // 4. Skills CSV/String Updater
  const handleSkillsChange = (val: string) => {
    updateCurrentCv((draft) => {
      draft.habilidades = val.split(",").map((x) => x.trim()).filter(Boolean);
    });
  };

  // 5. Languages CRUD
  const handleAddLanguage = () => {
    updateCurrentCv((draft) => {
      draft.idiomas.push({
        id: "idiom_" + Date.now(),
        idioma: "Novo Idioma",
        nivel: "Intermediário",
      });
    });
  };

  const handleUpdateLanguage = (id: string, field: keyof Idioma, value: string) => {
    updateCurrentCv((draft) => {
      const idx = draft.idiomas.findIndex((x) => x.id === id);
      if (idx !== -1) {
        draft.idiomas[idx][field] = value;
      }
    });
  };

  const handleRemoveLanguage = (id: string) => {
    updateCurrentCv((draft) => {
      draft.idiomas = draft.idiomas.filter((x) => x.id !== id);
    });
  };

  // 6. Certifications CSV/String Updater
  const handleCertificationsChange = (val: string) => {
    updateCurrentCv((draft) => {
      draft.certificacoes = val.split("\n").map((x) => x.trim()).filter(Boolean);
    });
  };

  // Open Gemini AI Enhancer Trigger
  const triggerAiEnhancement = (
    text: string,
    type: "resumo" | "experiência" | "educação" | "geral",
    applyCallback: (enhancedText: string) => void
  ) => {
    setAiTextToEnhance(text);
    setAiTextType(type);
    setAiCallback(() => applyCallback);
    setAiModalOpen(true);
  };

  // Render Category Icons representing areas
  const getAreaIcon = (area: AreaCurriculo, className = "h-5 w-5") => {
    switch (area) {
      case "Gestão":
        return <Briefcase className={className} />;
      case "Confeitaria":
        return <Cake className={className} />;
      case "Atendimento ao Público":
        return <Users className={className} />;
      case "Padaria":
        return <Cookie className={className} />;
      case "Tecnologia da Informação":
        return <Terminal className={className} />;
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    let id = "utouqcjxpr426mcz656m53-750296846089"; // Fallback to user's real project ID
    const host = typeof window !== "undefined" ? window.location.hostname : "";
    // Matches standard Google Cloud / Run subdomains containing standard UUID or specific project/deployment pattern
    const match = host.match(/([a-z0-9]{15,40}-[0-9]{5,20})/i);
    if (match) {
      id = match[1];
    }
    const shareUrl = `https://ais-pre-${id}.us-east1.run.app?view=true`;
    
    navigator.clipboard.writeText(shareUrl)
      .then(() => {
        setShareToast(true);
        setTimeout(() => setShareToast(false), 4000);
      })
      .catch((err) => {
        console.error("Erro ao copiar link:", err);
        // Fallback case
        const tempInput = document.createElement("input");
        tempInput.value = shareUrl;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand("copy");
        document.body.removeChild(tempInput);
        setShareToast(true);
        setTimeout(() => setShareToast(false), 4000);
      });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800 antialiased font-sans transition-colors duration-150 relative notranslate">
      
      {/* View-Only Share Mode Alert Banner removed as requested */}

      {/* Save Toast Indicator */}
      {saveBanner && (
        <div className="fixed bottom-6 right-6 z-50 bg-indigo-900 border border-blue-500/30 text-white px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 text-xs no-print animate-bounce">
          <CheckCircle className="h-4 w-4 text-emerald-400" />
          <span>Alterações salvas no seu navegador!</span>
        </div>
      )}

      {/* Share Toast Indicator */}
      {shareToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-emerald-500/30 text-white px-5 py-4 rounded-2xl shadow-xl flex flex-col gap-2 text-xs no-print max-w-sm animate-bounce">
          <div className="flex items-center gap-2 font-bold text-emerald-400">
            <CheckCircle className="h-4 w-4" />
            <span>Link de Compartilhamento Copiado!</span>
          </div>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            O link de visualização foi copiado com bloqueio de edição.
          </p>
          <div className="bg-blue-500/10 border border-blue-500/25 p-2.5 rounded-xl text-[10px] text-blue-300 space-y-1 mt-1">
            <span className="font-bold block text-blue-200">Aviso importante para o celular:</span>
            <p className="leading-normal font-sans">
              Para este link funcionar publicamente (evitando "Page not found"), lembre-se de clicar no botão azul <strong>"Share" (Compartilhar)</strong> localizado no topo do <strong>Google AI Studio</strong>. Isso colocará seu aplicativo portfólio oficialmente no ar!
            </p>
          </div>
        </div>
      )}

      {/* HEADER INTEGRADO */}
      <header className="bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-950 text-white border-b border-blue-900/40 sticky top-0 z-40 shadow-md no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Left side: Profile image + Title */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-400 rounded-full blur-xs opacity-40 animate-pulse" />
                <img
                  src={currentCv.fotoUrl || "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=300&h=300"}
                  alt={currentCv.nome}
                  className="relative w-12 h-12 rounded-full border-2 border-blue-400/80 object-cover object-top grayscale-xs"
                />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-300 font-mono block">
                  Portfólio de Currículos
                </span>
                <h2 className="font-display font-bold text-lg text-white leading-tight">
                  {currentCv.nome}
                </h2>
              </div>
            </div>

            {/* Desktop Navigation Link/Icons */}
            <nav className="hidden md:flex items-center gap-6 text-sm text-slate-200">
              <a
                href={`mailto:${currentCv.contato.email}`}
                className="flex items-center gap-1.5 hover:text-white hover:underline transition-all"
                title="Enviar E-mail"
              >
                <Mail className="h-4 w-4 text-blue-400" />
                <span>E-mail</span>
              </a>
              {currentCv.contato.linkedin && (
                <a
                  href={`https://${currentCv.contato.linkedin}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 hover:text-white hover:underline transition-all"
                  title="Acessar LinkedIn"
                >
                  <Linkedin className="h-4 w-4 text-blue-400" />
                  <span>LinkedIn</span>
                </a>
              )}
              {currentCv.contato.github && (
                <a
                  href={`https://${currentCv.contato.github}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 hover:text-white hover:underline transition-all"
                  title="Acessar GitHub"
                >
                  <Github className="h-4 w-4 text-blue-400" />
                  <span>GitHub</span>
                </a>
              )}
              {currentCv.contato.website && (
                <a
                  href={`https://${currentCv.contato.website}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 hover:text-white hover:underline transition-all"
                >
                  <Globe className="h-4 w-4 text-blue-400" />
                  <span>Site</span>
                </a>
              )}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-3">
              <button
                onClick={() => handleToggleMode(isSharedView ? "edit" : "view")}
                className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer border ${
                  isSharedView
                    ? "bg-slate-800 hover:bg-slate-700 text-white border-slate-700 hover:border-slate-600"
                    : "bg-amber-500/10 border-amber-500/30 text-amber-300 hover:bg-amber-500/20"
                }`}
                title={isSharedView ? "Entrar no modo administrativo de edição" : "Voltar para o modo de portfólio limpo"}
              >
                {isSharedView ? (
                  <>
                    <Settings className="h-3.5 w-3.5 text-blue-400" />
                    <span>Acessar Modo Editor</span>
                  </>
                ) : (
                  <>
                    <Eye className="h-3.5 w-3.5 text-amber-400" />
                    <span>Ver como Visitante</span>
                  </>
                )}
              </button>

              {!isSharedView && (
                <>
                  <button
                    onClick={() => setIsEditMode(!isEditMode)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                      isEditMode
                        ? "bg-blue-600 hover:bg-blue-500 text-white shadow-sm"
                        : "bg-slate-800 hover:bg-slate-700 text-white border border-slate-705"
                    }`}
                  >
                    <Edit className="h-3.5 w-3.5" />
                    {isEditMode ? "Fechar Form de Edição" : "Editar Currículo"}
                  </button>

                  <button
                    onClick={() => setExportModalOpen(true)}
                    className="px-4 py-2 bg-indigo-950/60 hover:bg-indigo-900 text-indigo-200 border border-indigo-700/40 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer"
                    title="Exportar arquivo defaultData.ts com as suas edições de hoje"
                  >
                    <Database className="h-3.5 w-3.5 text-indigo-400" />
                    <span>Exportar Dados</span>
                  </button>

                  <button
                    onClick={handleShare}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shadow-sm shadow-indigo-950/20 cursor-pointer"
                    title="Copiar link especial de visualização"
                  >
                    <Share2 className="h-3.5 w-3.5" />
                    Compartilhar
                  </button>
                </>
              )}
              
              <button
                onClick={handlePrint}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shadow-sm shadow-emerald-950/20 cursor-pointer"
              >
                <Printer className="h-3.5 w-3.5" />
                Imprimir / PDF
              </button>

              {!isSharedView && (
                <button
                  onClick={handleReset}
                  className="p-2 hover:bg-white/10 rounded-xl transition-all text-slate-400 hover:text-white"
                  title="Redefinir dados padrão"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Mobile menu trigger */}
            <div className="flex md:hidden items-center gap-2">
              {!isSharedView && (
                <button
                  onClick={handleShare}
                  className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors"
                  title="Compartilhar"
                >
                  <Share2 className="h-4 w-4" />
                </button>
              )}
              <button
                onClick={handlePrint}
                className="p-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-500 transition-colors"
                title="Imprimir"
              >
                <Printer className="h-4 w-4" />
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 hover:bg-white/10 text-white rounded-lg transition-colors focus:outline-none"
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-slate-900 border-t border-slate-800 py-4 px-6 space-y-4 animate-fadeIn">
            <div className="grid grid-cols-2 gap-3 text-xs">
              <a
                href={`mailto:${currentCv.contato.email}`}
                className="flex items-center gap-2 p-2.5 bg-slate-800/60 rounded-lg text-slate-200"
              >
                <Mail className="h-4 w-4 text-blue-400" />
                <span>E-mail</span>
              </a>
              {currentCv.contato.linkedin && (
                <a
                  href={`https://${currentCv.contato.linkedin}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 p-2.5 bg-slate-800/60 rounded-lg text-slate-200"
                >
                  <Linkedin className="h-4 w-4 text-blue-400" />
                  <span>Linkedin</span>
                </a>
              )}
              {currentCv.contato.github && (
                <a
                  href={`https://${currentCv.contato.github}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 p-2.5 bg-slate-800/60 rounded-lg text-slate-200"
                >
                  <Github className="h-4 w-4 text-blue-400" />
                  <span>Github</span>
                </a>
              )}
              {currentCv.contato.website && (
                <a
                  href={`https://${currentCv.contato.website}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 p-2.5 bg-slate-800/60 rounded-lg text-slate-200"
                >
                  <Globe className="h-4 w-4 text-blue-400" />
                  <span>Site</span>
                </a>
              )}
            </div>

            <hr className="border-slate-800" />

            <div className="flex flex-col gap-2">
              {/* Baixar / Imprimir em PDF sempre disponível de forma clara */}
              <button
                onClick={() => {
                  handlePrint();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-sm shadow-emerald-900/30"
              >
                <Printer className="h-3.5 w-3.5" />
                <span>Baixar / Imprimir em PDF</span>
              </button>

              {!isSharedView && (
                <button
                  onClick={() => {
                    handleShare();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-sm shadow-indigo-950/30"
                >
                  <Share2 className="h-3.5 w-3.5" />
                  <span>Compartilhar Currículo</span>
                </button>
              )}

              {!isSharedView ? (
                <>
                  <button
                    onClick={() => {
                      handleToggleMode("view");
                      setMobileMenuOpen(false);
                    }}
                    className="w-full py-2.5 bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Eye className="h-3.5 w-3.5 text-amber-400" />
                    <span>Ver como Visitante</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsEditMode(!isEditMode);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full py-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer ${
                      isEditMode ? "bg-blue-600 text-white" : "bg-slate-800 text-slate-300"
                    }`}
                  >
                    <Edit className="h-3.5 w-3.5" />
                    <span>{isEditMode ? "Fechar Form de Edição" : "Editar Currículo Manual"}</span>
                  </button>

                  <button
                    onClick={() => {
                      setExportModalOpen(true);
                      setMobileMenuOpen(false);
                    }}
                    className="w-full py-2.5 bg-indigo-950/60 hover:bg-indigo-900 text-indigo-200 border border-indigo-700/40 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Database className="h-3.5 w-3.5 text-indigo-400" />
                    <span>Exportar Dados</span>
                  </button>

                  <button
                    onClick={() => {
                      handleReset();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full py-2.5 bg-slate-800 text-rose-400 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    <span>Reiniciar Dados Padrão</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    handleToggleMode("edit");
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-705 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Settings className="h-3.5 w-3.5 text-blue-400" />
                  <span>Acessar Modo Editor</span>
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* DETALHE: IMAGEM DE CONJUNTO EM PRINT */}
      <div className="hidden print-only print:block text-slate-400 text-[10px] text-center mb-4">
        <span>Currículo Profissional - Gerado a partir do Portfólio Digital de {currentCv.nome}</span>
      </div>

      {/* CORE WORKSPACE */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* SIDEBAR: SELEÇÃO DA ÁREA CURRICULAR */}
        <aside className="lg:col-span-3 space-y-4 no-print lg:sticky lg:top-24">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 md:p-5 space-y-3 lg:space-y-4">
            <div>
              <h3 className="font-display font-semibold text-slate-800 text-sm">
                Minhas Áreas Curriculares
              </h3>
              <p className="text-xs text-slate-500">
                Selecione para alternar o modelo do currículo e customizá-lo:
              </p>
            </div>

            <nav className="flex flex-col gap-2 w-full">
              {(Object.keys(data.areas) as AreaCurriculo[]).map((area) => {
                const isActive = activeArea === area;
                return (
                  <button
                    key={area}
                    onClick={() => {
                      setActiveArea(area);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 lg:py-3 rounded-xl text-xs font-semibold transition-all duration-150 text-left cursor-pointer border ${
                      isActive
                        ? "bg-blue-600 hover:bg-blue-600/90 text-white border-blue-600 shadow-md shadow-blue-600/10"
                        : "bg-slate-50 hover:bg-slate-100/80 text-slate-600 border-slate-100/80"
                    }`}
                  >
                    <span className={`p-1.5 rounded-lg shrink-0 ${
                      isActive ? "bg-white/15 text-white" : "bg-slate-200/50 text-slate-500"
                    }`}>
                      {getAreaIcon(area, "h-3.5 w-3.5")}
                    </span>
                    <span className="truncate" translate="no">{area}</span>
                  </button>
                );
              })}
            </nav>

            <div className="pt-2">
              {!isSharedView ? (
                <div className="bg-blue-50/50 rounded-xl p-3 border border-blue-100/30 text-[11px] text-blue-800 leading-relaxed space-y-1">
                  <p className="font-semibold flex items-center gap-1">
                    <Sparkles className="h-3 w-3 text-blue-600 animate-pulse" />
                    Gostaria de ver IA em ação?
                  </p>
                  <p>
                    Ative o <strong>Modo Edição</strong> e clique no botão de faísca para ter sua descrição reescrita pelo Gemini AI profissionalmente para cada área!
                  </p>
                </div>
              ) : (
                <div className="bg-amber-50 rounded-xl p-3 border border-amber-200 text-[11px] text-amber-900 leading-relaxed space-y-1">
                  <p className="font-semibold flex items-center gap-1">
                    🔒 Modo Visitante
                  </p>
                  <p>
                    Você está em modo de somente-leitura e compartilhamento protegido. Navegue pelas abas acima para conhecer os currículos multidisciplinares de Joás Kelph.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-slate-900 text-slate-300 rounded-2xl p-4.5 space-y-3 shadow-md border border-slate-800 hidden lg:block">
            <h4 className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">
              Instruções de Personalização
            </h4>
            <ol className="text-xs space-y-2 list-decimal list-inside text-slate-400 leading-relaxed">
              <li>
                Escolha a vaga desejada no menu acima;
              </li>
              {isSharedView ? (
                <li>
                  Baixe e imprima as versões oficiais disponíveis em PDF.
                </li>
              ) : (
                <>
                  <li>
                    Clique em <strong>Editar Currículo</strong> se o painel de formulário não estiver aberto;
                  </li>
                  <li>
                    Edite qualquer informação em tempo real na aba correspondente;
                  </li>
                </>
              )}
              <li>
                Quando estiver pronto, clique em <strong>Imprimir / PDF</strong> para salvar.
              </li>
            </ol>
          </div>
        </aside>

        {/* WORKSPACE MIDDLE: COMBINED EDITOR FORM AND LIVE CV VISUALIZER */}
        <main className="lg:col-span-9 space-y-4 md:space-y-6">
          
          {/* Segmented Switcher for small screens (displayed below xl width when editing is active) */}
          {isEditMode && !isSharedView && (
            <div className="xl:hidden bg-slate-100 p-1 rounded-xl border border-slate-200/80 flex gap-1 shadow-xs no-print">
              <button
                type="button"
                onClick={() => setMobileViewTab("edit")}
                className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  mobileViewTab === "edit"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-200/60"
                }`}
              >
                <Edit className="h-3.5 w-3.5" />
                <span>📝 Editar Dados</span>
              </button>
              <button
                type="button"
                onClick={() => setMobileViewTab("preview")}
                className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  mobileViewTab === "preview"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-200/60"
                }`}
              >
                <FileText className="h-3.5 w-3.5" />
                <span>👁️ Ver Currículo</span>
              </button>
            </div>
          )}

          <div className={`grid grid-cols-1 ${(isEditMode && !isSharedView) ? "xl:grid-cols-2" : "grid-cols-1"} gap-6 items-start`}>
            
            {/* DINAMIC FORM EDITOR PANEL */}
            {isEditMode && !isSharedView && (
              <div className={mobileViewTab === "edit" ? "block" : "hidden xl:block"}>
                <section className="bg-white rounded-2xl border border-slate-100 p-5 space-y-6 shadow-sm no-print max-h-[85vh] overflow-y-auto">
              
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded-md">
                    Painel do Editor
                  </span>
                  <h3 className="font-display font-bold text-slate-800 text-base flex items-center gap-1.5">
                    Modificando Currículo de: {activeArea}
                  </h3>
                </div>
                <button
                  onClick={() => setIsEditMode(false)}
                  className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600"
                  title="Esconder painel"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* SECTION: BASIC DETAILS */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-50 pb-1">
                  Dados de Identidade & Contato
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-500 block">Nome do Profissional</label>
                    <input
                      type="text"
                      value={currentCv.nome}
                      onChange={(e) => handleBasicChange("nome", e.target.value)}
                      className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                      placeholder="Ex: Joás Kelph"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-500 block">Título / Cargo Alvo</label>
                    <input
                      type="text"
                      value={currentCv.tituloProfissional}
                      onChange={(e) => handleBasicChange("tituloProfissional", e.target.value)}
                      className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                      placeholder="Ex: Padeiro Sênior"
                    />
                  </div>

                  <div className="sm:col-span-2 space-y-2">
                    <label className="text-[11px] font-semibold text-slate-500 block">Foto de Perfil</label>
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center bg-slate-50 p-3.5 border border-slate-200 rounded-xl">
                      <div className="relative group shrink-0">
                        <img
                          src={currentCv.fotoUrl || "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=300&h=300"}
                          alt="Previsualização"
                          className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md bg-white"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=300&h=300";
                          }}
                        />
                      </div>
                      <div className="flex-1 space-y-2 w-full">
                        <div className="flex flex-col gap-1.5">
                          <span className="text-[10px] font-medium text-slate-400 block">Faça upload de uma imagem ou informe a URL/caminho abaixo:</span>
                          <div className="flex gap-2">
                            <label className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all shadow-sm">
                              <Upload className="h-3 w-3" />
                              <span>Fazer Upload</span>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    const reader = new FileReader();
                                    reader.onloadend = () => {
                                      if (typeof reader.result === "string") {
                                        handleBasicChange("fotoUrl", reader.result);
                                      }
                                    };
                                    reader.readAsDataURL(file);
                                  }
                                }}
                                className="hidden"
                              />
                            </label>
                            {currentCv.fotoUrl && (
                              <button
                                type="button"
                                onClick={() => handleBasicChange("fotoUrl", "")}
                                className="px-2.5 py-1.5 bg-slate-200 hover:bg-rose-100 hover:text-rose-600 text-slate-600 rounded-lg text-xs font-semibold transition-all cursor-pointer"
                              >
                                Esvaziar
                              </button>
                            )}
                          </div>
                        </div>
                        <div className="relative">
                          <input
                            type="text"
                            value={currentCv.fotoUrl}
                            onChange={(e) => handleBasicChange("fotoUrl", e.target.value)}
                            className="w-full text-xs px-3 py-1.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 font-mono"
                            placeholder="Ex: https://images.unsplash... ou caminho da foto"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-500 block">Cidade e Estado de Residência</label>
                    <input
                      type="text"
                      value={currentCv.contato.localizacao}
                      onChange={(e) => handleContactChange("localizacao", e.target.value)}
                      className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                      placeholder="Ex: Porto Alegre, RS - Brasil"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-500 block">Número de Telefone</label>
                    <input
                      type="text"
                      value={currentCv.contato.telefone}
                      onChange={(e) => handleContactChange("telefone", e.target.value)}
                      className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                      placeholder="Ex: (51) 98765-4321"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-500 block">E-mail de Contato</label>
                    <input
                      type="email"
                      value={currentCv.contato.email}
                      onChange={(e) => handleContactChange("email", e.target.value)}
                      className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                      placeholder="joas@exemplo.com"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-500 block">Link LinkedIn (Sem https://)</label>
                    <input
                      type="text"
                      value={currentCv.contato.linkedin}
                      onChange={(e) => handleContactChange("linkedin", e.target.value)}
                      className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                      placeholder="linkedin.com/in/joas"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-500 block">Link GitHub (Sem https://)</label>
                    <input
                      type="text"
                      value={currentCv.contato.github}
                      onChange={(e) => handleContactChange("github", e.target.value)}
                      className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                      placeholder="github.com/joas"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-500 block">Web-site Próprio</label>
                    <input
                      type="text"
                      value={currentCv.contato.website}
                      onChange={(e) => handleContactChange("website", e.target.value)}
                      className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                      placeholder="www.joas.com"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-500 block">Instagram (Opcional)</label>
                    <input
                      type="text"
                      value={currentCv.contato.instagram || ""}
                      onChange={(e) => handleContactChange("instagram", e.target.value)}
                      className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                      placeholder="@jottaconfeitaria"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION: SUMMARY & GEMINI IA BUTTON */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                    Resumo Profissional
                  </label>
                  
                  <button
                    onClick={() =>
                      triggerAiEnhancement(currentCv.resumo, "resumo", (txt) =>
                        handleBasicChange("resumo", txt)
                      )
                    }
                    className="flex items-center gap-1 text-[10px] font-semibold text-blue-700 hover:text-blue-800 bg-blue-50 hover:bg-blue-100/70 border border-blue-200 px-2 py-1 rounded-lg transition-colors cursor-pointer shrink-0"
                    title="Pedir ao Gemini AI para otimizar estruturação do resumo"
                  >
                    <Sparkles className="h-3 w-3 text-amber-500 animate-pulse" />
                    Utilizar Gemini AI
                  </button>
                </div>

                <div className="relative">
                  <textarea
                    rows={4}
                    value={currentCv.resumo}
                    onChange={(e) => handleBasicChange("resumo", e.target.value)}
                    className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 leading-relaxed font-sans"
                    placeholder="Escreva um breve resumo profissional de suas maiores competências..."
                  />
                </div>
              </div>

              {/* SECTION: EXPERIENCES LIST EDITOR */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-50 pb-1">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Histórico Profissional
                  </h4>
                  <button
                    onClick={handleAddExperience}
                    className="flex items-center gap-1 text-[10px] font-bold text-white bg-blue-600 hover:bg-blue-700 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                  >
                    <Plus className="h-3 w-3" />
                    Adicionar
                  </button>
                </div>

                <div className="space-y-3.5">
                  {currentCv.experiencias.map((exp, index) => (
                    <div
                      key={exp.id}
                      className="p-3 bg-slate-50 border border-slate-200 rounded-2xl relative space-y-2.5"
                    >
                      <button
                        onClick={() => handleRemoveExperience(exp.id)}
                        className="absolute top-2 right-2 p-1 text-slate-400 hover:text-red-500 rounded-md transition-colors"
                        title="Excluir experiência"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>

                      <span className="text-[10px] font-bold text-slate-400 font-mono">
                        Item #{index + 1}
                      </span>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-slate-500 uppercase">Empresa</label>
                          <input
                            type="text"
                            value={exp.empresa}
                            onChange={(e) => handleUpdateExperience(exp.id, "empresa", e.target.value)}
                            className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-slate-500 uppercase">Cargo</label>
                          <input
                            type="text"
                            value={exp.cargo}
                            onChange={(e) => handleUpdateExperience(exp.id, "cargo", e.target.value)}
                            className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-slate-500 uppercase">Período / Datas</label>
                          <input
                            type="text"
                            value={exp.periodo}
                            onChange={(e) => handleUpdateExperience(exp.id, "periodo", e.target.value)}
                            className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center">
                          <label className="text-[9px] font-bold text-slate-500 uppercase">Atividades</label>
                          <button
                            onClick={() =>
                              triggerAiEnhancement(exp.descricao, "experiência", (txt) =>
                                handleUpdateExperience(exp.id, "descricao", txt)
                              )
                            }
                            className="flex items-center gap-1 text-[9px] font-semibold text-blue-700 hover:text-blue-800 bg-blue-50 px-2 py-0.5 rounded-md transition-all cursor-pointer"
                          >
                            <Sparkles className="h-2.5 w-2.5 text-amber-500 animate-pulse" />
                            Refinar Atividades
                          </button>
                        </div>
                        <textarea
                          rows={3}
                          value={exp.descricao}
                          onChange={(e) => handleUpdateExperience(exp.id, "descricao", e.target.value)}
                          className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 leading-normal"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* SECTION: EDUCATION LIST EDITOR */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-50 pb-1">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Educação & Curso
                  </h4>
                  <button
                    onClick={handleAddEducation}
                    className="flex items-center gap-1 text-[10px] font-bold text-white bg-blue-600 hover:bg-blue-700 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                  >
                    <Plus className="h-3 w-3" />
                    Adicionar
                  </button>
                </div>

                <div className="space-y-3.5">
                  {currentCv.educacoes.map((edu, index) => (
                    <div
                      key={edu.id}
                      className="p-3 bg-slate-50 border border-slate-200 rounded-2xl relative space-y-2.5"
                    >
                      <button
                        onClick={() => handleRemoveEducation(edu.id)}
                        className="absolute top-2 right-2 p-1 text-slate-400 hover:text-red-500 rounded-md transition-colors"
                        title="Excluir educação"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>

                      <span className="text-[10px] font-bold text-slate-400 font-mono">
                        Item #{index + 1}
                      </span>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-slate-500 uppercase">Instituição</label>
                          <input
                            type="text"
                            value={edu.instituicao}
                            onChange={(e) => handleUpdateEducation(edu.id, "instituicao", e.target.value)}
                            className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-slate-500 uppercase">Curso / Certificado</label>
                          <input
                            type="text"
                            value={edu.curso}
                            onChange={(e) => handleUpdateEducation(edu.id, "curso", e.target.value)}
                            className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-slate-500 uppercase">Periodo</label>
                          <input
                            type="text"
                            value={edu.periodo}
                            onChange={(e) => handleUpdateEducation(edu.id, "periodo", e.target.value)}
                            className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-slate-500 uppercase">Descrição Acadêmica</label>
                        <textarea
                          rows={2}
                          value={edu.descricao || ""}
                          onChange={(e) => handleUpdateEducation(edu.id, "descricao", e.target.value)}
                          className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* SECTION: SKILLS */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                  Competências (Separadas por vírgula)
                </label>
                <input
                  type="text"
                  value={currentCv.habilidades ? currentCv.habilidades.join(", ") : ""}
                  onChange={(e) => handleSkillsChange(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500"
                  placeholder="Liderança, Panificação, Atendimento..."
                />
              </div>

              {/* SECTION: LANGUAGES */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-50 pb-1">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Idiomas
                  </h4>
                  <button
                    onClick={handleAddLanguage}
                    className="flex items-center gap-1 text-[10px] font-bold text-white bg-blue-600 hover:bg-blue-700 px-2 rounded-md transition-colors cursor-pointer"
                  >
                    <Plus className="h-3 w-3" />
                    Adicionar
                  </button>
                </div>

                <div className="space-y-2">
                  {currentCv.idiomas && currentCv.idiomas.map((idiom) => (
                    <div key={idiom.id} className="flex gap-2 items-center bg-slate-50 p-2 rounded-xl relative">
                      <input
                        type="text"
                        value={idiom.idioma}
                        onChange={(e) => handleUpdateLanguage(idiom.id, "idioma", e.target.value)}
                        className="text-xs px-2 py-1 bg-white border border-slate-200 rounded-md focus:outline-none focus:border-blue-500 flex-1"
                        placeholder="Idioma"
                      />
                      <input
                        type="text"
                        value={idiom.nivel}
                        onChange={(e) => handleUpdateLanguage(idiom.id, "nivel", e.target.value)}
                        className="text-xs px-2 py-1 bg-white border border-slate-200 rounded-md focus:outline-none focus:border-blue-500 w-28"
                        placeholder="Nível (Ex: Fluente)"
                      />
                      <button
                        onClick={() => handleRemoveLanguage(idiom.id)}
                        className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                        title="Remover idioma"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* SECTION: CERTIFICATIONS */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                  Cursos & Credenciais (Um por linha)
                </label>
                <textarea
                  rows={3}
                  value={currentCv.certificacoes ? currentCv.certificacoes.join("\n") : ""}
                  onChange={(e) => handleCertificationsChange(e.target.value)}
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500"
                  placeholder="EX: Curso de Confeitaria Avançada (ANVISA)"
                />
              </div>

            </section>
              </div>
            )}

            {/* CHIC LIVE CV DISPLAY PREVIEW */}
            <div className={`${(isEditMode && !isSharedView) && mobileViewTab !== "preview" ? "hidden xl:block" : "block"} print:block print-container w-full`}>
              <section className="print-container w-full">
            
            {/* Header Toolbar containing Preview options */}
            <div className="bg-slate-800/90 text-white rounded-t-2xl px-5 py-3.5 border-b border-slate-700 flex items-center justify-between no-print shadow-sm">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-blue-400" />
                <span className="text-[11px] font-bold uppercase tracking-wider">
                  Visualização do Documento (Pronto p/ Imprimir)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] tracking-widest font-mono text-slate-400">
                  TAMANHO: A4
                </span>
              </div>
            </div>

            {/* Standard Printable Resume Container */}
            <ResumeView data={currentCv} areaName={activeArea} />

            {/* Hint below Resume View in App */}
            <div className="bg-blue-900/10 border border-blue-100 p-4 rounded-xl mt-4 text-xs text-blue-800 leading-relaxed flex items-start gap-2.5 no-print">
              <HelpCircle className="h-5 w-5 shrink-0 text-blue-600 mt-0.5" />
              <div>
                <span className="font-semibold block">Pronto para salvar ou imprimir?</span>
                <p className="mt-0.5 text-slate-600">
                  Todas as barras de menu, formulários e botões de Inteligência Artificial do site foram configurados para sumir automaticamente quando o papel de impressão ou salvamento PDF for aberto. Você pode clicar no botão <strong>Imprimir / PDF</strong> no rodapé ou cabeçalho para ver o layout profissional otimizado da folha A4.
                </p>
                <div className="mt-2.5">
                  <button
                    onClick={handlePrint}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-lg shadow-sm font-mono text-[10px]"
                  >
                    <Printer className="h-3 w-3" />
                    ABRIR DIÁLOGO DE IMPRESSÃO
                  </button>
                </div>
              </div>
            </div>

          </section>
            </div>

          </div>
        </main>
      </div>

      {/* FOOTER DA PÁGINA */}
      <footer className="bg-slate-900 border-t border-slate-800 py-8 text-xs text-slate-400 no-print mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="font-display font-semibold text-white" translate="no">
              Joás Kelph • Portfólio de Currículos Especializados
            </h4>
            <p className="text-slate-500">
              Alternância inteligente de trilhas profissionais e suporte com Inteligência Artificial Gemini (Google).
            </p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[10px] text-slate-500 font-mono">
              © {new Date().getFullYear()} • Feito com Stack React + Tailwind CSS
            </span>
          </div>
        </div>
      </footer>

      {/* GEMINI AI ENHANCER MODAL */}
      <AIEnhancerModal
        isOpen={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
        originalText={aiTextToEnhance}
        areaName={activeArea}
        textType={aiTextType}
        onApply={(txt) => {
          if (aiCallback) aiCallback(txt);
        }}
      />

      {/* EXPORT DATA MODAL */}
      {exportModalOpen && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-xs flex items-center justify-center p-4 z-50 no-print animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 space-y-4 shadow-2xl relative">
            <button
              onClick={() => {
                setExportModalOpen(false);
                setCopiedDataSuccess(false);
              }}
              className="absolute top-4 right-4 p-1.5 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-2.5">
              <div className="p-2.5 bg-indigo-500/10 rounded-xl border border-indigo-500/20 text-indigo-400">
                <FileCode className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-display font-medium text-white text-base">
                  Exportar Dados de Produção
                </h3>
                <span className="text-[11px] text-slate-400">
                  Salve permanentemente as modificações no seu código-fonte para carregar no seu domínio final (GitHub, etc.).
                </span>
              </div>
            </div>

            <div className="bg-blue-950/30 border border-blue-500/15 p-4 rounded-xl text-slate-300 text-xs leading-relaxed space-y-1.5">
              <span className="text-blue-300 font-semibold block">Como usar seus dados no seu próprio domínio/site:</span>
              <ol className="list-decimal list-inside space-y-1 text-slate-300 text-[11px]">
                <li>Copie todo o código gerado no campo de texto abaixo.</li>
                <li>No seu projeto local recebido do export, navegue até o arquivo <code className="bg-slate-950 px-1 py-0.5 rounded text-indigo-300 font-mono text-[10px]">/src/defaultData.ts</code>.</li>
                <li>Substitua todo o conteúdo original desse arquivo pelo código copiado.</li>
                <li>Pronto! Quando você enviar para o GitHub, o seu site carregará automaticamente todos os seus dados atualizados (para todos os visitantes)!</li>
              </ol>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Código de defaultData.ts (Completo)
                </label>
                <button
                  onClick={() => {
                    const code = `import { CurriculoMultidisciplinar } from "./types";\n\nexport const DEFAULT_CURRICULOS: CurriculoMultidisciplinar = ${JSON.stringify(data, null, 2)};\n`;
                    navigator.clipboard.writeText(code).then(() => {
                      setCopiedDataSuccess(true);
                      setTimeout(() => setCopiedDataSuccess(false), 3000);
                    });
                  }}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-mono text-[10.5px] font-semibold rounded-lg flex items-center gap-1.5 transition-all cursor-pointer shadow-sm shadow-indigo-950/20"
                >
                  <Copy className="h-3 w-3" />
                  <span>{copiedDataSuccess ? "Copiado!" : "Copiar Código"}</span>
                </button>
              </div>

              <textarea
                readOnly
                value={`import { CurriculoMultidisciplinar } from "./types";\n\nexport const DEFAULT_CURRICULOS: CurriculoMultidisciplinar = ${JSON.stringify(data, null, 2)};`}
                className="w-full h-64 text-[10px] font-mono p-3 bg-slate-950 border border-slate-850 rounded-xl text-slate-300 focus:outline-none scrollbar-thin select-all"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => {
                  setExportModalOpen(false);
                  setCopiedDataSuccess(false);
                }}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 hover:text-white rounded-xl text-xs font-semibold text-slate-300 cursor-pointer transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PASSWORD PROTECTION MODAL */}
      {passwordModalOpen && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-xs flex items-center justify-center p-4 z-50 no-print animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl relative animate-scaleUp">
            <button
              onClick={() => {
                setPasswordModalOpen(false);
                setPasswordInput("");
                setPasswordError(null);
              }}
              className="absolute top-4 right-4 p-1.5 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex flex-col items-center text-center space-y-2">
              <div className="p-3 bg-blue-500/10 rounded-full border border-blue-500/20 text-blue-400">
                <Lock className="h-6 w-6" />
              </div>
              <h3 className="font-display font-medium text-white text-base">
                Área Administrativa
              </h3>
              <p className="text-xs text-slate-400 leading-normal px-2">
                Para acessar as ferramentas de edição e personalização, por favor insira a senha de acesso.
              </p>
            </div>

            <form onSubmit={handleVerifyPassword} className="space-y-3.5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Senha de Acesso
                </label>
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    if (passwordError) setPasswordError(null);
                  }}
                  placeholder="••••••••"
                  autoFocus
                  className="w-full text-center tracking-widest text-sm px-4 py-3 bg-slate-950 border border-slate-850 rounded-xl text-white placeholder-slate-700 focus:outline-none focus:border-blue-500 font-mono transition-colors"
                />
                {passwordError && (
                  <p className="text-[11px] text-rose-400 text-center font-medium animate-pulse">
                    {passwordError}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setPasswordModalOpen(false);
                    setPasswordInput("");
                    setPasswordError(null);
                  }}
                  className="py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl text-xs cursor-pointer transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="py-2.5 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-semibold rounded-xl text-xs cursor-pointer transition-all shadow-md shadow-blue-950/20"
                >
                  Confirmar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
