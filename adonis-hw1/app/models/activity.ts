import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, manyToMany } from '@adonisjs/lucid/orm'
import type { ManyToMany, BelongsTo } from '@adonisjs/lucid/types/relations'
import Category from './category.js'
import Speaker from './speaker.js'

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

  @column({consume: Boolean})
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
  @belongsTo(()=>Category, {foreignKey:'categoryId'})
  declare category: BelongsTo<typeof Category>

  //У активности может быть множество спикеров
  //Таблицы по умолчанию в ед. числе
  //Локальные ключи по умолчанию id, связующие - через "_"
  @manyToMany(() => Speaker, {
      pivotTable: 'act.activities_speakers',

      localKey: 'activityId',
      pivotForeignKey: 'activity_id',
      relatedKey: 'speakerId',
      pivotRelatedForeignKey: 'speaker_id',

      pivotColumns: ['duration'],

      pivotTimestamps: true
    })

  declare speakers: ManyToMany<typeof Speaker>


}