import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'activities'

  async up() {
    this.schema
      .withSchema('act')
      .alterTable(this.tableName, (table) => {
        table
          .integer('category_id')
          .unsigned()
          .notNullable()
          .references('category_id')
          .inTable('act.categories')
    })
  }

  async down() {
    this.schema
      .withSchema('act')
      .alterTable(this.tableName, (table) => {
        table.dropForeign('category_id')
        table.dropColumn('category_id')
    })
  }
}