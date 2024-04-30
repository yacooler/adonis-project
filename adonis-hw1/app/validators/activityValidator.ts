import Activity from '#models/activity';
import vine, { VineNumber, VineObject } from '@vinejs/vine'
import { DateTime } from 'luxon';
import buildExistsRule from './helpers/buildExistsRule.js';
import buildUniqueRule from './helpers/buildUniqieRule.js';
import Category from '#models/category';
import Speaker from '#models/speaker';


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

//isOptional true если мы хотим иметь возможность в целом не передавать группу
const cateringGroup = (isOptional: boolean) =>  vine.group([
    vine.group.if(
      (data) => vine.helpers.isTrue(data.isCatering),
      {
        isCatering: vine.literal(true),
        cateringComment: vine.string(),
        cateringAmount: vine.number(),
      }
    ),
    vine.group.if(
      (data) => {
        vine.helpers.isFalse(data.isCatering)
      },
      {
        isCatering: vine.literal(false),
        cateringComment: vine.any().parse(()=>null).nullable(),
        cateringAmount: vine.any().parse(()=>null).nullable()
      }
    ),
    vine.group.else({
      isCatering: isOptional ? vine.boolean().optional() : vine.boolean()
    })
  ]);


const activityValidator = vine
    .withMetaData<{activityId: number|undefined}>()
    .compile(
    vine.object({
        name: vine.string().minLength(3).maxLength(255),
        holdDate: vine.date({formats:'YYYY-MM-DD'}).after('today').transform(d=> DateTime.fromJSDate(d)),
        holdTime: vine.date({formats: 'hh:mm:ss'}).transform(d=> DateTime.fromJSDate(d)),
        duration: vine.number().min(1).max(23),
        categoryId: vine.number().exists(buildExistsRule(Category)),
        cateringComment: vine.string().nullable().optional(), //Если поля не поставить сюда, TS не правильно выводит тип для payload
        cateringAmount: vine.number().nullable().optional(), //Если поля не поставить сюда, TS не правильно выводит тип для payload
        slug: vine.string().url().unique(buildUniqueRule(Activity, 'activityId')),
        speakers: vine.array(
            vine.object({
                speakerId: vine.number(), 
                duration: vine.number()
              })
            )
            .primaryKeysExists({model: Speaker, primaryKeyMapper: (a)=> (a as any)['speakerId'] }).optional()
    })
        .merge(customerGroup)
        .merge(cateringGroup(false))

);


export default activityValidator;