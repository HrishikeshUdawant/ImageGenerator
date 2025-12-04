
import React, { useState, useEffect } from 'react';
import { X, Save, Key, Languages } from 'lucide-react';
import { Language } from '../translations';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    lang: Language;
    setLang: (lang: Language) => void;
    t: any;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, lang, setLang, t }) => {
    const [token, setToken] = useState('');

    useEffect(() => {
        if (isOpen) {
            setToken(localStorage.getItem('huggingFaceToken') || '');
        }
    }, [isOpen]);

    const handleSave = () => {
        localStorage.setItem('huggingFaceToken', token.trim());
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
             <div className="w-full max-w-md bg-[#0D0B14] border border-white/10 rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 ring-1 ring-white/10">
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-white/5">
                    <div className="flex items-center gap-2">
                         <div className="p-1.5 rounded-md bg-purple-500/10 text-purple-400">
                             <Key className="w-4 h-4" />
                         </div>
                         <h2 className="text-lg font-bold text-white">{t.settings}</h2>
                    </div>
                    <button onClick={onClose} className="p-1 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                
                <div className="p-6 space-y-6">
                    {/* Language Selector */}
                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-white/90 mb-3">
                            <Languages className="w-4 h-4 text-purple-400" />
                            {t.language}
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => setLang('en')}
                                className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all border ${
                                    lang === 'en' 
                                    ? 'bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-900/20' 
                                    : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:text-white'
                                }`}
                            >
                                English
                            </button>
                            <button
                                onClick={() => setLang('zh')}
                                className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all border ${
                                    lang === 'zh' 
                                    ? 'bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-900/20' 
                                    : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:text-white'
                                }`}
                            >
                                中文
                            </button>
                        </div>
                    </div>

                    <div className="h-px bg-white/5 w-full"></div>

                    {/* HF Token */}
                    <div>
                        <label className="block text-sm font-medium text-white/90 mb-2">
                            {t.hfToken}
                        </label>
                         <div className="relative">
                            <input
                                type="password"
                                value={token}
                                onChange={(e) => setToken(e.target.value)}
                                placeholder="hf_..."
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all font-mono text-sm"
                            />
                        </div>
                        <p className="mt-2 text-xs text-white/40 leading-relaxed">
                            {t.hfTokenHelp} <a className="text-purple-600 hover:text-purple-400 underline decoration-purple-600/30" href="https://huggingface.co/settings/tokens" target="_blank">{t.hfTokenLink}</a> {t.hfTokenHelpEnd}
                        </p>
                    </div>
                </div>

                <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-white/5 bg-white/[0.02]">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                    >
                        {t.cancel}
                    </button>
                    <button
                        onClick={handleSave}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-purple-600 hover:bg-purple-500 active:bg-purple-700 rounded-lg transition-colors shadow-lg shadow-purple-900/20"
                    >
                        <Save className="w-4 h-4" />
                        {t.save}
                    </button>
                </div>
            </div>
        </div>
    );
};
