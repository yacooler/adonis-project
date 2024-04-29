import { DateTime } from 'luxon'
import { BaseModel, column, computed } from '@adonisjs/lucid/orm'

export default class Speaker extends BaseModel {

  static table = 'act.speakers'

  @column({ isPrimary: true })
  declare speakerId: number

  @column()
  declare name: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  //Это не колонка в БД, а просто поле для вывода экстра информации
  @computed()
  declare duration: number;
}