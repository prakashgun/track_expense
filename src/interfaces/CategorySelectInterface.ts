import CategoryInterface from "./CategoryInterface"

export default interface CategorySelectInterface {
    categories: CategoryInterface[],
    selectedCategory: CategoryInterface,
    setSelectedCategory: (category: CategoryInterface) => void
}