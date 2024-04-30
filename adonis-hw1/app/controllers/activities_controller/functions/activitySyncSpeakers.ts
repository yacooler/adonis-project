import Activity from "#models/activity";
import db from "@adonisjs/lucid/services/db";

const activitySyncSpeakers = async (activityToUpdate: Activity, payload: any) =>{
  //Записываем сущность и связанные сущности в транзакции
  const trx = await db.transaction()
  
  try {
    activityToUpdate.useTransaction(trx)
    //Если нашли спикеров в пэйлоаде или в обновляемой записи - синхронизируем значения
    let speakersToSync: any;

    if (payload.speakers || activityToUpdate.speakers){  
      if(payload.speakers && payload.speakers.length > 0){
        //Если пришли новые значения в пэйлоаде
        speakersToSync = Object.fromEntries(new Map(payload.speakers.map( (e: any) =>  ([e.speakerId.toString(), {'duration': e.duration}]))));
      } else {
        speakersToSync = [];
      } 
      await activityToUpdate.useTransaction(trx).related('speakers').sync(speakersToSync);  
    }

    const res = await activityToUpdate.useTransaction(trx).merge(payload).save();

    await trx.commit()
    await res.load('speakers');
    res.speakers.forEach(sp => sp.duration = sp.$extras.pivot_duration)
    return res;
  } catch (error) {
    await trx.rollback()
  }
}

export default activitySyncSpeakers;