import Category from '#models/category'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await Category.create({title:'Активный отдых', description: 'Активный отдых - картинг, танцы, кони'})
    await Category.create({title:'Рыбалка', description: 'Язь, показывают рыбов'})
    await Category.create({title:'Вечеринка', description: 'Всё включено!'})
    await Category.create({title:'Сон', description: 'Послеобеденный сон в палатках под соснами'})
  }
}