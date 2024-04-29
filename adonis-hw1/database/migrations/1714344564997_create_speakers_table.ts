import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'speakers'

  async up() {
    this.schema
      .withSchema('act')
      .createTable(this.tableName, (table) => {
        table.increments('speaker_id').primary({constraintName:'pk_speakers'})
        table.string('name').notNullable()
        table.timestamp('created_at').defaultTo(this.now())
        table.timestamp('updated_at').defaultTo(this.now())
      })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}