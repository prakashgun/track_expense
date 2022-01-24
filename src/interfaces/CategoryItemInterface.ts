import CategoryInterface from "./CategoryInterface"

export default interface CategoryItemInterface {
    category: CategoryInterface,
    onPress: () => void
}