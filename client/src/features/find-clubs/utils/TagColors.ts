export const getTagColor = (tagId: string): string => {
    const colors = [
        'bg-blue-500 text-white',
        'bg-green-500 text-white',
        'bg-purple-500 text-white',
        'bg-red-500 text-white',
        'bg-yellow-500 text-black',
        'bg-pink-500 text-white',
        'bg-indigo-500 text-white',
        'bg-teal-500 text-white',
    ];
    const index = parseInt(tagId.slice(-2), 16) % colors.length; // more varied
    return colors[index];
};
