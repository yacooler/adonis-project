import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import { type HasMany } from '@adonisjs/lucid/types/relations'
import Activity from './activity.js'

export default class Category extends BaseModel {
  static table = 'act.categories'

  @column({ isPrimary: true })
  declare categoryId: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @column()
  declare title: string

  @column()
  declare description: string

  @hasMany(()=>Activity)
  declare activities: HasMany<typeof Activity>
}