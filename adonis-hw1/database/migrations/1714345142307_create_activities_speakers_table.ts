import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'activities_speakers'

  async up() {
    this.schema
      .withSchema('act')
      .createTable(this.tableName, (table) => {
        table.increments('activitiy_speaker_id').primary({constraintName:'pk_activities_speakers'})

        table.integer('activity_id').unsigned().notNullable().references('activity_id').inTable('act.activities')
        table.integer('speaker_id').unsigned().notNullable().references('speaker_id').inTable('act.speakers')

        table.integer('duration').unsigned().notNullable()

        table.timestamp('created_at').defaultTo(this.now())
        table.timestamp('updated_at').defaultTo(this.now())
      })
  }

  async down() {
    this.schema.withSchema('act').dropTable(this.tableName)
  }
}