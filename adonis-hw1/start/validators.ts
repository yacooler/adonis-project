import { LucidModel } from '@adonisjs/lucid/types/model'
import vine, { VineArray, VineNumber } from '@vinejs/vine'
import { SchemaTypes } from '@vinejs/vine/types'


declare module '@vinejs/vine' {
  interface VineArray<Schema extends SchemaTypes> {
    primaryKeysExists(options: primaryKeysExistsOptions): this
  }
}

type primaryKeysExistsOptions = {
  model: LucidModel,
  //Мапер, для получения значений primary key из объекта сложной структуры
  primaryKeyMapper?: (arrayItem: SchemaTypes) => number
}

const primaryKeysExistsRule = vine.createRule<primaryKeysExistsOptions>(async (value, options, field) => {

  const valuesArray = value as SchemaTypes[];

  console.log(valuesArray);
  //Мапер по умолчанию предполагает, что нам пришел плоский массив чисел и мапер умеет конвертировать каждый элемент в
  const defaultPrimaryKeyMapper = (val: SchemaTypes): number => {
    return val as unknown as number;
  }

  const { model, primaryKeyMapper = defaultPrimaryKeyMapper} = options;
  
  //Нас интересуют только уникальные значения при проверке в БД, чтобы корректно сравнить количество
  const uniqueValues = [...new Set(valuesArray.map(primaryKeyMapper))];

  const res = await model.findMany(uniqueValues);

  if (res.length !== uniqueValues.length){
    field.report(`Field {{ field }} must contain valid ${model.name} primary key values`, 'primaryKeysExists', field, options)
  }

})

VineArray.macro('primaryKeysExists', 
  function (this: VineArray<VineNumber>, options: primaryKeysExistsOptions){
  return this.use(primaryKeysExistsRule(options));
})

