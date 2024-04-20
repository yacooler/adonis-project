import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'


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
  declare type: string

  @column()
  declare slug: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime


}