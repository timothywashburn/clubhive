import { getTagColor } from '../utils/TagColors';
import type { Tag } from '../../../hooks/fetchTags';

type TagSelectionPopupProps = {
    tags: Tag[];
    selectedTags: Tag[];
    toggleTag: (tagId: string) => void;
    inline?: boolean;
};

// This is the component that displays the scrollable tag selection popup
export function TagSelectionPopup({ tags, selectedTags, toggleTag, inline }: TagSelectionPopupProps) {
    return (
        <div
            className={`${inline ? 'relative mt-2' : 'absolute mt-2'} z-20 w-64 bg-surface border border-outline-variant rounded-lg shadow-lg p-4`}
        >
            <p className="font-semibold text-sm text-on-surface-variant mb-2">Select tags:</p>
            <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
                {tags.map(tag => {
                    const isSelected = selectedTags.find(selectedTag => selectedTag._id === tag._id);
                    return (
                        <button
                            type="button"
                            key={tag._id}
                            onClick={() => toggleTag(tag._id)}
                            className={`px-3 py-1 rounded-full text-sm border transition ${
                                isSelected
                                    ? `${getTagColor(tag._id)} font-semibold border-primary`
                                    : `${getTagColor(tag._id)} font-normal border-outline-variant hover:bg-primary-container-hover`
                            }`}
                        >
                            {tag.text}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
