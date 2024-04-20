import vine from '@vinejs/vine'
import { DateTime } from 'luxon';

const activityValidator = vine
    .withMetaData<{activityId: number|undefined}>()
    .compile(
    vine.object({
        name: vine.string().minLength(3).maxLength(255),
        customerPhone: vine.string().mobile({locale:["ru-RU"]}).optional().requiredIfMissing('customerEmail'),
        customerEmail: vine.string().email().optional().requiredIfMissing('customerPhone'),
        holdDate: vine.date({formats:'YYYY-MM-DD'}).after('today').transform(d=> DateTime.fromJSDate(d)),
        holdTime: vine.date({formats: 'hh:mm:ss'}).transform(d=> DateTime.fromJSDate(d)),
        duration: vine.number().min(1).max(23),
        type: vine.enum(['DANCING', 'DRINKING', 'SLEEPING']),
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
);

export default activityValidator;