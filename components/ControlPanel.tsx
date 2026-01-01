
import React, { useState, useEffect, useMemo } from 'react';
import { Select, OptionGroup } from './Select';
import { Tooltip } from './Tooltip';
import { Settings, ChevronUp, ChevronDown, Minus, Plus, Dices, Cpu } from 'lucide-react';
import { ModelOption, ProviderOption, AspectRatioOption } from '../types';
import { 
    HF_MODEL_OPTIONS, 
    GITEE_MODEL_OPTIONS, 
    MS_MODEL_OPTIONS, 
    Z_IMAGE_MODELS, 
    FLUX_MODELS, 
    getModelConfig, 
    getGuidanceScaleConfig 
} from '../constants';
import { getCustomProviders, getServiceMode } from '../services/utils';

interface ControlPanelProps {
    provider: ProviderOption;
    setProvider: (val: ProviderOption) => void;
    model: ModelOption;
    setModel: (val: ModelOption) => void;
    aspectRatio: AspectRatioOption;
    setAspectRatio: (val: AspectRatioOption) => void;
    steps: number;
    setSteps: (val: number) => void;
    guidanceScale: number;
    setGuidanceScale: (val: number) => void;
    seed: string;
    setSeed: (val: string) => void;
    t: any;
    aspectRatioOptions: { value: string; label: string }[];
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
    provider,
    setProvider,
    model,
    setModel,
    aspectRatio,
    setAspectRatio,
    steps,
    setSteps,
    guidanceScale,
    setGuidanceScale,
    seed,
    setSeed,
    t,
    aspectRatioOptions
}) => {
    const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
    const [modelOptions, setModelOptions] = useState<OptionGroup[]>([]);

    // Build grouped model options dynamically
    useEffect(() => {
        const updateModelOptions = () => {
            const serviceMode = getServiceMode();
            const groups: OptionGroup[] = [];
            
            const showBase = serviceMode === 'local' || serviceMode === 'hydration';
            const showCustom = serviceMode === 'server' || serviceMode === 'hydration';

            // 1. Default Providers
            if (showBase) {
                // Hugging Face (Always visible)
                groups.push({
                    label: t.provider_huggingface,
                    options: HF_MODEL_OPTIONS.map(m => ({ label: m.label, value: `huggingface:${m.value}` }))
                });

                // Gitee (Only if token exists)
                const hasGiteeToken = localStorage.getItem('giteeToken');
                if (hasGiteeToken) {
                    groups.push({
                        label: t.provider_gitee,
                        options: GITEE_MODEL_OPTIONS.map(m => ({ label: m.label, value: `gitee:${m.value}` }))
                    });
                }

                // Model Scope (Only if token exists)
                const hasMsToken = localStorage.getItem('msToken');
                if (hasMsToken) {
                    groups.push({
                        label: t.provider_modelscope,
                        options: MS_MODEL_OPTIONS.map(m => ({ label: m.label, value: `modelscope:${m.value}` }))
                    });
                }
            }

            // 2. Custom Providers
            if (showCustom) {
                const customProviders = getCustomProviders();
                customProviders.forEach(cp => {
                    const models = cp.models.generate;
                    if (models && models.length > 0) {
                        groups.push({
                            label: cp.name,
                            options: models.map(m => ({
                                label: m.name,
                                value: `${cp.id}:${m.id}`
                            }))
                        });
                    }
                });
            }

            setModelOptions(groups);
        };

        updateModelOptions();
        // Listen for storage changes to update list dynamically (e.g. after adding token in settings)
        window.addEventListener('storage', updateModelOptions);
        return () => window.removeEventListener('storage', updateModelOptions);
    }, [t]);

    // Determine current model configuration (Standard or Custom)
    const activeConfig = useMemo(() => {
        const customProviders = getCustomProviders();
        // Try to find custom provider matching the ID
        const activeCustomProvider = customProviders.find(p => p.id === provider);
        
        if (activeCustomProvider) {
            // It's a custom provider
            const customModel = activeCustomProvider.models.generate?.find(m => m.id === model);
            
            if (customModel) {
                return {
                    isCustom: true,
                    steps: customModel.steps ? {
                        min: customModel.steps.range[0],
                        max: customModel.steps.range[1],
                        default: customModel.steps.default
                    } : null,
                    guidance: customModel.guidance ? {
                        min: customModel.guidance.range[0],
                        max: customModel.guidance.range[1],
                        step: 0.1,
                        default: customModel.guidance.default
                    } : null
                };
            }
        }

        // Fallback to standard config
        return {
            isCustom: false,
            steps: getModelConfig(provider, model),
            guidance: getGuidanceScaleConfig(model, provider)
        };
    }, [provider, model]);

    // Initialize defaults when model changes
    useEffect(() => {
        if (activeConfig.isCustom) {
            if (activeConfig.steps) {
                setSteps(activeConfig.steps.default);
            }
            if (activeConfig.guidance) {
                setGuidanceScale(activeConfig.guidance.default);
            }
        }
        // Standard provider defaults are handled in App.tsx effects, 
        // but custom ones need explicit handling here since App.tsx 
        // mainly relies on getModelConfig/constants.
    }, [activeConfig, setSteps, setGuidanceScale]);

    const handleRandomizeSeed = () => {
        setSeed(Math.floor(Math.random() * 2147483647).toString());
    };

    const handleAdjustSeed = (amount: number) => {
        const current = parseInt(seed || '0', 10);
        if (isNaN(current)) {
            setSeed((0 + amount).toString());
        } else {
            setSeed((current + amount).toString());
        }
    };

    // Handle Model Change: Parse "provider:modelId"
    const onModelChange = (val: string) => {
        // value format is "provider:modelId"
        const parts = val.split(':');
        if (parts.length >= 2) {
            const newProvider = parts[0] as ProviderOption;
            const newModel = parts.slice(1).join(':') as ModelOption; // Join back in case model ID has colons
            
            setProvider(newProvider);
            setModel(newModel);
        }
    };

    // Construct current value for Select
    const currentSelectValue = `${provider}:${model}`;

    return (
        <div className="space-y-4 md:space-y-6">
            {/* Model Selection (Grouped) */}
            <Select
                label={t.model}
                value={currentSelectValue}
                onChange={onModelChange}
                options={modelOptions}
                icon={<Cpu className="w-5 h-5" />}
            />

            {/* Aspect Ratio */}
            <Select
                label={t.aspectRatio}
                value={aspectRatio}
                onChange={(val) => setAspectRatio(val as AspectRatioOption)}
                options={aspectRatioOptions}
            />

            {/* Advanced Settings */}


        </div>
    );
};