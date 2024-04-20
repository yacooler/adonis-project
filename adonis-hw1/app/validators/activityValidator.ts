import Category from '#models/category';
import vine from '@vinejs/vine'
import { DateTime } from 'luxon';


const customerGroup = vine.group([
    vine.group.if((data) => 'customerPhone' in data, {
      customerPhone: vine.string().mobile({locale:["ru-RU"]})
    }),
    vine.group.if((data) => 'customerEmail' in data, {
      customerEmail: vine.string().email()
    })
  ])
  .otherwise((_, field) => {
    console.log("-------------------------------", field);
    field.report(
      'Предоставьте корректный телефон или email',
      'phone_or_email',
      field
    )
  });

const cateringGroup = vine.group([
    vine.group.if(
      (data) => vine.helpers.isTrue(data.isCatering),
      {
        isCatering: vine.literal(true),
        cateringComment: vine.string(),
        cateringAmount: vine.number(),
      }
    ),
    vine.group.else({
      isCatering: vine.literal(false)
    }),
  ]);


const activityValidator = vine
    .withMetaData<{activityId: number|undefined}>()
    .compile(
    vine.object({
        name: vine.string().minLength(3).maxLength(255),
        holdDate: vine.date({formats:'YYYY-MM-DD'}).after('today').transform(d=> DateTime.fromJSDate(d)),
        holdTime: vine.date({formats: 'hh:mm:ss'}).transform(d=> DateTime.fromJSDate(d)),
        duration: vine.number().min(1).max(23),
        categoryId: vine.number().exists(async (_db, value) => {
          return (await Category.find(value)) ? true : false;
        }),
        cateringComment: vine.string().nullable().optional(), //Если поля не поставить сюда, TS не правильно выводит тип для payload
        cateringAmount: vine.number().nullable().optional(), //Если поля не поставить сюда, TS не правильно выводит тип для payload
        slug: vine.string().url().unique(
            async (db, value, field) => {
                //Для INSERT
                if(!field.meta.activityId){
                    return !(await db
                        .from('act.activities')
                        .where('slug', value)
                        .first());
                }
                //Для UPDATE     
                return !(await db
                    .from('act.activities')
                    .where('slug', value)
                    .andWhereNot('activity_id', field.meta.activityId)
                    .first());                  
        }),
    })
        .merge(customerGroup)
        .merge(cateringGroup)

);


export default activityValidator;