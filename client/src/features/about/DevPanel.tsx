import React from 'react';

// I'M WELL AWARE THIS CODE IS TERRIBLE I'M SO SORRY IF YOU EVER HAVE TO READ THIS
interface DevPanelProps {
    noiseAmount: number;
    onNoiseAmountChange: (value: number) => void;
    showDebug: boolean;
    onShowDebugChange: (value: boolean) => void;
}

export function DevPanel({
    noiseAmount,
    onNoiseAmountChange,
    showDebug,
    onShowDebugChange,
}: DevPanelProps) {
    return (
        <div className="fixed top-4 right-4 z-50 bg-black/80 backdrop-blur-sm border border-white/20 rounded-lg p-4 text-white">
            <h3 className="text-sm font-bold mb-3">Dev Panel</h3>

            <div className="space-y-3">
                <div>
                    <label className="block text-xs mb-1">
                        Noise Amount:{' '}
                        <span className="text-yellow-400">
                            {noiseAmount.toFixed(2)}
                        </span>
                    </label>
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={noiseAmount}
                        onChange={e =>
                            onNoiseAmountChange(parseFloat(e.target.value))
                        }
                        className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                    />
                </div>

                <div>
                    <label className="flex items-center text-xs">
                        <input
                            type="checkbox"
                            checked={showDebug}
                            onChange={e => onShowDebugChange(e.target.checked)}
                            className="mr-2"
                        />
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
