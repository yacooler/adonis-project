import { Database } from "@adonisjs/lucid/database";
import { LucidModel } from "@adonisjs/lucid/types/model";
import { FieldContext } from "@vinejs/vine/types";

//Возвращаем функцию, проверяющую поле на уникальность
const buildUniqueRule= (Model: LucidModel, metaDataKey: string | undefined = undefined) => {
  return async (db: Database, value: string, field: FieldContext) => { 
    const metaData = metaDataKey? field.meta[metaDataKey] : undefined;
    const query = db.modelQuery(Model).where(field.name.toString(), value)
    if (metaDataKey && metaData){
      query.andWhereNot(metaDataKey, metaData);
    } 
    return !(await query.first());
  }
}

export default buildUniqueRule