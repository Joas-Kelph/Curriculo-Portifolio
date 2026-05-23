import { CurriculoData } from "../types";
import { Mail, Phone, MapPin, Linkedin, Github, Globe, Award, BookOpen, Briefcase, GraduationCap, Languages, Sparkles } from "lucide-react";

interface ResumeViewProps {
  data: CurriculoData;
  areaName: string;
}

export default function ResumeView({ data, areaName }: ResumeViewProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-md shadow-slate-100/50 p-4 sm:p-6 md:p-8 relative overflow-hidden print:p-0 print:border-none print:shadow-none print:rounded-none">
      
      {/* Visual Accent for selected area in web view */}
      <div className="absolute top-0 right-0 left-0 h-2 bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-700 no-print" />
      
      {/* Floating Category Stamp */}
      <div className="absolute top-5 right-6 text-right no-print">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 select-none" translate="no">
          <Sparkles className="h-3 w-3 text-blue-600" />
          Perfil: {areaName}
        </span>
      </div>

      {/* Primary Header Section */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6 border-b border-slate-100 pb-6 print:pb-5">
        
        {/* Profile Avatar / Placeholder */}
        <div className="relative group shrink-0">
          <div className="absolute inset-0 bg-blue-500 rounded-2xl blur-xs opacity-20 group-hover:opacity-30 transition-opacity" />
          <img
            src={data.fotoUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300&h=300"}
            alt={data.nome}
            referrerPolicy="no-referrer"
            className="relative w-24 h-24 md:w-28 md:h-28 rounded-2xl object-cover border-2 border-white shadow-md shadow-blue-900/10 grayscale-xs"
          />
        </div>

        {/* Name and Professional Title */}
        <div className="text-center md:text-left flex-1 space-y-2">
          <div className="space-y-1">
            <h1 className="font-display font-extrabold text-2xl md:text-3.5xl text-slate-800 tracking-tight leading-tight print:text-2xl" translate="no">
              {data.nome || "Seu Nome Completo"}
            </h1>
            <p className="font-medium text-blue-600 text-sm md:text-base tracking-wide uppercase font-display print:text-sm">
              {data.tituloProfissional || "Sua Profissão / Cargo Alvo"}
            </p>
          </div>

          {/* Quick contact bar */}
          <div className="flex flex-wrap justify-center md:justify-start gap-x-4 gap-y-1.5 text-xs text-slate-500 pt-1 print:text-slate-600 max-w-full overflow-hidden">
            {data.contato.localizacao && (
              <span className="flex items-center gap-1 min-w-0 max-w-full">
                <MapPin className="h-3.5 w-3.5 text-blue-500 print:text-slate-600 shrink-0" />
                <span className="truncate">{data.contato.localizacao}</span>
              </span>
            )}
            {data.contato.telefone && (
              <span className="flex items-center gap-1 min-w-0 max-w-full">
                <Phone className="h-3.5 w-3.5 text-blue-500 print:text-slate-600 shrink-0" />
                <span className="truncate">{data.contato.telefone}</span>
              </span>
            )}
            {data.contato.email && (
              <span className="flex items-center gap-1 min-w-0 max-w-full">
                <Mail className="h-3.5 w-3.5 text-blue-500 print:text-slate-600 shrink-0" />
                <span className="break-all">{data.contato.email}</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Sections: Dual-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-6 print:grid-cols-12 print:gap-5">
        
        {/* LEFT COLUMN: Metadata elements (Contact cards, Skills, Languages, Certifications) */}
        <div className="lg:col-span-4 space-y-6 print:col-span-4 print:space-y-5 print:pr-2">
          
          {/* Social and Contacts block */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-display">
              Presença Digital
            </h3>
            <ul className="space-y-2 text-xs text-slate-600">
              {data.contato.linkedin && (
                <li>
                  <a
                    href={`https://${data.contato.linkedin}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 hover:text-blue-600 transition-colors py-0.5 print:text-slate-700"
                  >
                    <Linkedin className="h-4 w-4 text-blue-500/80 shrink-0 print:text-slate-600" />
                    <span className="truncate">{data.contato.linkedin.replace("linkedin.com/in/", "")}</span>
                  </a>
                </li>
              )}
              {data.contato.github && (
                <li>
                  <a
                    href={`https://${data.contato.github}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 hover:text-blue-600 transition-colors py-0.5 print:text-slate-700"
                  >
                    <Github className="h-4 w-4 text-slate-700 shrink-0 print:text-slate-600" />
                    <span className="truncate">{data.contato.github.replace("github.com/", "")}</span>
                  </a>
                </li>
              )}
              {data.contato.website && (
                <li>
                  <a
                    href={`https://${data.contato.website}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 hover:text-blue-600 transition-colors py-0.5 print:text-slate-700"
                  >
                    <Globe className="h-4 w-4 text-blue-500/80 shrink-0 print:text-slate-600" />
                    <span className="truncate">{data.contato.website}</span>
                  </a>
                </li>
              )}
            </ul>
          </div>

          {/* Skills Section */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-display block">
              Competências Técnicas
            </h3>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {data.habilidades && data.habilidades.length > 0 ? (
                data.habilidades.map((skill, index) => (
                  <span
                    key={index}
                    className="text-[11px] font-medium px-2 py-0.5 bg-blue-50 text-blue-800 rounded-md border border-blue-100/50 print:bg-white print:border-slate-200 print:text-slate-800"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <span className="text-xs italic text-slate-400">Nenhuma competência cadastrada.</span>
              )}
            </div>
          </div>

          {/* Languages Section */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-display flex items-center gap-1.5">
              <Languages className="h-3.5 w-3.5 text-blue-600/75 shrink-0 print:text-slate-600" />
              Idiomas
            </h3>
            <ul className="space-y-2 text-xs text-slate-600">
              {data.idiomas && data.idiomas.length > 0 ? (
                data.idiomas.map((idiom) => (
                  <li key={idiom.id} className="flex justify-between items-center bg-slate-50/50 p-2 rounded-lg border border-slate-100/30 print:bg-white print:border-none print:p-0">
                    <span className="font-semibold text-slate-700 print:text-slate-800" translate="no">{idiom.idioma}</span>
                    <span className="text-slate-500 font-mono text-[10px] bg-slate-100 px-1.5 py-0.5 rounded-sm print:bg-white print:border print:border-slate-200 print:text-slate-600" translate="no">
                      {idiom.nivel}
                    </span>
                  </li>
                ))
              ) : (
                <li className="text-xs italic text-slate-400">Nenhum idioma registrado.</li>
              )}
            </ul>
          </div>

          {/* Certifications Section */}
          {data.certificacoes && data.certificacoes.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-display flex items-center gap-1.5">
                <Award className="h-3.5 w-3.5 text-blue-600/75 shrink-0 print:text-slate-600" />
                Cursos & Credenciais
              </h3>
              <ul className="space-y-2 text-xs text-slate-600">
                {data.certificacoes.map((cert, index) => (
                  <li key={index} className="flex gap-2 items-start text-xs text-slate-600 leading-relaxed print:text-slate-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0 print:bg-slate-600" />
                    <span>{cert}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

        </div>

        {/* RIGHT COLUMN: Professional Summary, Work Experience, Education */}
        <div className="lg:col-span-8 space-y-6 print:col-span-8 print:space-y-5 lg:border-l lg:border-slate-100 lg:pl-6 print:border-l print:border-slate-200 print:pl-5">
          
          {/* Summary */}
          <div className="space-y-2.5">
            <h2 className="text-sm font-bold uppercase tracking-wider text-blue-700 font-display flex items-center gap-1.5 print:text-slate-800 print:font-bold">
              <BookOpen className="h-4 w-4 shrink-0" />
              Resumo Profissional
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed font-normal text-justify print:text-slate-800 print:text-xs">
              {data.resumo || "Profissional ético e motivado aguardando preenchimento curricular."}
            </p>
          </div>

          {/* Work Experience */}
          <div className="space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-blue-700 font-display flex items-center gap-1.5 border-b border-blue-50/50 pb-1 print:text-slate-800 print:border-slate-200">
              <Briefcase className="h-4 w-4 shrink-0" />
              Experiência Profissional
            </h2>
            
            <div className="space-y-5">
              {data.experiencias && data.experiencias.length > 0 ? (
                data.experiencias.map((exp) => (
                  <div key={exp.id} className="relative group space-y-1">
                    
                    {/* Header line for item */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <h4 className="font-bold text-slate-700 text-sm tracking-tight print:text-slate-900">
                        {exp.cargo}
                      </h4>
                      <span className="text-[11px] font-mono text-slate-400 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100 shrink-0 self-start sm:self-center print:bg-white print:border-none print:text-slate-600 print:p-0">
                        {exp.periodo}
                      </span>
                    </div>

                    {/* Sub title row */}
                    <p className="text-xs font-semibold text-blue-600 tracking-wide print:text-slate-700">
                      {exp.empresa}
                    </p>

                    {/* Description */}
                    <p className="text-xs text-slate-500 leading-relaxed text-slate-600 text-justify pt-1 print:text-slate-700">
                      {exp.descricao}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-xs italic text-slate-400">Nenhuma experiência registrada.</p>
              )}
            </div>
          </div>

          {/* Education */}
          <div className="space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-blue-700 font-display flex items-center gap-1.5 border-b border-blue-50/50 pb-1 print:text-slate-800 print:border-slate-200">
              <GraduationCap className="h-4 w-4 shrink-0" />
              Educação & Formação
            </h2>
            
            <div className="space-y-4">
              {data.educacoes && data.educacoes.length > 0 ? (
                data.educacoes.map((edu) => (
                  <div key={edu.id} className="space-y-1">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <h4 className="font-bold text-slate-700 text-sm tracking-tight print:text-slate-950">
                        {edu.curso}
                      </h4>
                      <span className="text-[11px] font-mono text-slate-400 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100 shrink-0 self-start sm:self-center print:bg-white print:border-none print:text-slate-600 print:p-0">
                        {edu.periodo}
                      </span>
                    </div>
                    
                    <p className="text-xs font-semibold text-slate-500 print:text-slate-700">
                      {edu.instituicao}
                    </p>

                    {edu.descricao && (
                      <p className="text-xs text-slate-500 pt-0.5 leading-relaxed print:text-slate-600">
                        {edu.descricao}
                      </p>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-xs italic text-slate-400">Nenhuma formação registrada.</p>
              )}
            </div>
          </div>

        </div>

      </div>

      {/* Modern Watermark Footer */}
      <div className="text-center text-[10px] text-slate-300 font-mono tracking-widest pt-8 border-t border-slate-50 mt-6 select-none uppercase flex items-center justify-center gap-1.5 print:hidden">
        <span>Portfólio de Currículo Profissional</span>
        <span>•</span>
        <span>Dinamizado por Gemini AI</span>
      </div>
    </div>
  );
}
