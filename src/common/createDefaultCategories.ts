import { getRepository } from 'typeorm/browser'
import { Category } from '../entities/Category'
import dbConnect from './dbConnect'

export default async () => {
    await dbConnect()
    const categoryRepository = await getRepository(Category)

    const categoriesCount = await categoryRepository.count()

    if (categoriesCount === 0) {

        const defaultCategories = [
            {
                name: 'Food',
                icon_name: 'fastfood',
                icon_type: 'material-icons'
            },
            {
                name: 'Clothing',
                icon_name: 'tshirt',
                icon_type: 'font-awesome-5'
            },
            {
                name: 'Transportation',
                icon_name: 'car',
                icon_type: 'font-awesome'
            },
            {
                name: 'Education',
                icon_name: 'graduation-cap',
                icon_type: 'font-awesome'
            },
            {
                name: 'Entertainment',
                icon_name: 'movie',
                icon_type: 'material-icons'
            },
            {
                name: 'Social',
                icon_name: 'group',
                icon_type: 'font-awesome'
            },
            {
                name: 'Investment',
                icon_name: 'bar-graph',
                icon_type: 'entypo'
            },
            {
                name: 'Health',
                icon_name: 'fitness-center',
                icon_type: 'material-icons'
            },
            {
                name: 'Medical',
                icon_name: 'medical-services',
                icon_type: 'material-icons'
            },
            {
                name: 'Others',
                icon_name: 'miscellaneous-services',
                icon_type: 'material-icons'
            }
        ]

        await categoryRepository
            .createQueryBuilder()
            .insert()
            .into(Category)
            .values(defaultCategories)
            .execute()

        console.log('Default categories saved')
    }
}