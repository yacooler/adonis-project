import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'activities'

  async up() {
    this.schema.withSchema('act').alterTable(this.tableName, (table) => {
      table.boolean('is_catering').notNullable().defaultTo(false)
      table.string('catering_comment').nullable()
      table.decimal('catering_amount', 12, 2).nullable()

      //Удаляем колонку с типом
      table.dropColumn('type')
    })
  }

  async down() {
    this.schema.withSchema('act').alterTable(this.tableName, (table) => {
      table.dropChecks('activities_is_catering_default') //Вот тут бы понять, можно ли задать имя для defaultTo
      table.dropColumn('is_catering')
      table.dropColumn('catering_comment')
      table.dropColumn('catering_amount')

      //Возвращаем колонку с типом (вряд ли это вообще хорошая идея, чисто для практики)
      table.enu('type', ['DANCING', 'DRINKING', 'SLEEPING'])
    })
  }
}