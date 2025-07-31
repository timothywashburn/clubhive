export const getTagColor = (tagId: string): string => {
    const colors = [
        'bg-[#EF5151]/50 text-on-primary-container',
        'bg-[#E47430]/50 text-on-primary-container',
        'bg-[#E4CA44]/50 text-on-primary-container',
        'bg-[#7DD272]/50 text-on-primary-container',
        'bg-[#6EE0BE]/50 text-on-primary-container',
        'bg-[#81CFEC]/50 text-on-primary-container',
        'bg-[#BDB0EA]/50 text-on-primary-container',
        'bg-[#D79BE1]/50 text-on-primary-container',
        'bg-[#F2CBEE]/50 text-on-primary-container',
        'bg-[#F78F63]/50 text-on-primary-container',
        'bg-[#C8F383]/50 text-on-primary-container',
        'bg-[#D9D9D9]/50 text-on-primary-container',
        'bg-[#F68F8F]/50 text-on-primary-container',
        'bg-[#F4D59B]/50 text-on-primary-container',
    ];
    const index = parseInt(tagId.slice(-2), 16) % colors.length;
    return colors[index];
};
