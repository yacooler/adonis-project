import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'activities'

  async up() {
    this.schema
      .withSchema('act')
      .createTable(this.tableName, (table) => {
        table.increments('activity_id').primary({constraintName: 'pk_activities'})

        table.string('name', 255).notNullable(),
        table.string('customer_phone', 255).nullable(),
        table.string('customer_email', 255).nullable(),
        table.date('hold_date').notNullable(),
        table.time('hold_time').notNullable(),
        table.integer('duration').notNullable(),
        table.enu('type', ['DANCING', 'DRINKING', 'SLEEPING']),
        table.string('slug', 255).notNullable(),

        table.timestamp('created_at').defaultTo(this.now())
        table.timestamp('updated_at').defaultTo(this.now())
    })
  }

  async down() {
    this.schema.withSchema('act').dropTable(this.tableName)
  }
}