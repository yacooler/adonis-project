import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'categories'

  async up() {
    this.schema
      .withSchema('act')
      .createTable(this.tableName, (table) => {
        table.increments('category_id').primary({constraintName:'pk_categoty'})

        table.timestamp('created_at')
        table.timestamp('updated_at')
        table.string('title', 255).notNullable().unique()
        table.string('description', 255).notNullable()
      })
  }

  async down() {
    this.schema.withSchema('act').dropTable(this.tableName)
  }
}