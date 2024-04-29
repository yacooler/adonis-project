import Speaker from '#models/speaker'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await Speaker.create({name:'Тамада'})
    await Speaker.create({name:'Ведущий'})
    await Speaker.create({name:'Певец'})
  }
}