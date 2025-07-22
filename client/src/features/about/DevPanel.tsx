import React from 'react';

// I'M WELL AWARE THIS CODE IS TERRIBLE I'M SO SORRY IF YOU EVER HAVE TO READ THIS
type HoneycombType = 'static' | 'dynamic' | 'glowing';

interface DevPanelProps {
    noiseAmount: number;
    onNoiseAmountChange: (value: number) => void;
    showDebug: boolean;
    onShowDebugChange: (value: boolean) => void;
    honeycombType: HoneycombType;
    onHoneycombTypeChange: (type: HoneycombType) => void;
}

export function DevPanel({
    noiseAmount,
    onNoiseAmountChange,
    showDebug,
    onShowDebugChange,
    honeycombType,
    onHoneycombTypeChange,
}: DevPanelProps) {
    return (
        <div className="fixed top-4 right-4 z-50 bg-black/80 backdrop-blur-sm border border-white/20 rounded-lg p-4 text-white">
            <h3 className="text-sm font-bold mb-3">Dev Panel</h3>

            <div className="space-y-3">
                <div>
                    <label className="block text-xs mb-1">
                        Honeycomb Type: <span className="text-yellow-400 capitalize">{honeycombType}</span>
                    </label>
                    <select
                        value={honeycombType}
                        onChange={e => onHoneycombTypeChange(e.target.value as HoneycombType)}
                        className="w-full bg-gray-700 text-white border border-gray-600 rounded px-2 py-1 text-xs"
                    >
                        <option value="static">Static</option>
                        <option value="dynamic">Dynamic</option>
                        <option value="glowing">Glowing</option>
                    </select>
                </div>

                <div>
                    <label className="block text-xs mb-1">
                        Noise Amount: <span className="text-yellow-400">{noiseAmount.toFixed(2)}</span>
                    </label>
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={noiseAmount}
                        onChange={e => onNoiseAmountChange(parseFloat(e.target.value))}
                        className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                    />
                </div>

                <div>
                    <label className="flex items-center text-xs">
                        <input type="checkbox" checked={showDebug} onChange={e => onShowDebugChange(e.target.checked)} className="mr-2" />
                        Show Debug Visualization
                    </label>
                </div>
            </div>

            <style>{`
                .slider::-webkit-slider-thumb {
                    appearance: none;
                    width: 16px;
                    height: 16px;
                    background: #f0c455;
                    cursor: pointer;
                    border-radius: 50%;
                    border: 2px solid #1a1a1a;
                }

                .slider::-moz-range-thumb {
                    width: 16px;
                    height: 16px;
                    background: #f0c455;
                    cursor: pointer;
                    border-radius: 50%;
                    border: 2px solid #1a1a1a;
                }
            `}</style>
        </div>
    );
}
