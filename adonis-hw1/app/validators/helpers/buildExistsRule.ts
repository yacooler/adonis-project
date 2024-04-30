import { Database } from "@adonisjs/lucid/database";
import { LucidModel } from "@adonisjs/lucid/types/model";

//Проверка на наличие поля в БД
const buildExistsRule = (Model: LucidModel) => {
  return async (db: Database, value: string) => { 
    return (await db.modelQuery(Model).where(Model.primaryKey, value)) !== null
  }
}

export default buildExistsRule