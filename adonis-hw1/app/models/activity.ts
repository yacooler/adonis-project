import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import { type BelongsTo } from '@adonisjs/lucid/types/relations'
import Category from './category.js'

export default class Activity extends BaseModel {
  static table = 'act.activities'

  @column({ isPrimary: true })
  declare activityId: number

  @column()
  declare name: string

  @column()
  declare customerPhone: string

  @column()
  declare customerEmail: string

  @column.dateTime()
  declare holdDate: DateTime

  @column.dateTime()
  declare holdTime: DateTime

  @column()
  declare duration: number

  @column()
  declare slug: string

  @column()
  declare isCatering: boolean

  @column()
  declare cateringComment: string | null

  @column()
  declare cateringAmount: number | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @column()
  declare categoryId: number

  //У активности может быть одна категория
  @belongsTo(()=>Category)
  declare category: BelongsTo<typeof Category>
}