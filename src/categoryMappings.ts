export const categoryMappings = {
    gender: {
        man: 'man',
        woman: 'woman',
    },
    subCategory: {
        pants: 'pants',
        tops: 'tops',
        accessories: 'accessories',
    }
}

export const assignSelectedCategories = (selectedCategories: string[]) => {
    const selectedGenderCategory = Object.keys(categoryMappings.gender).find(gender =>
        selectedCategories.includes(gender)
    ) || '';

    const selectedSubCategory = Object.keys(categoryMappings.subCategory).find(subCat =>
        selectedCategories.includes(subCat)
    ) || '';

    return { selectedGenderCategory, selectedSubCategory };
}