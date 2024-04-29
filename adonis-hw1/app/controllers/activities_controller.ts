import type { HttpContext } from '@adonisjs/core/http'
import Activity from '#models/activity'
import activityValidator from '#validators/activityValidator';
import db from '@adonisjs/lucid/services/db';

export default class ActivitiesController {
  /**
   * Display a list of resource
   */
  async index({}: HttpContext) {
    return Activity.query().preload('category');
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request }: HttpContext) {
    const payload = await request.validateUsing(activityValidator, {meta:{activityId:undefined}});
    const ret = await Activity.create(payload);
    await ret.save()
    return ret;
  }

  /**
   * Show individual record
   */
  async show({ params }: HttpContext) {
    const act = await Activity.findOrFail(params.id);
    await act.load('category');
    await act.load('speakers');
    return act;
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request }: HttpContext) {

    const activityToUpdate = await Activity.findOrFail(params.id);
    await activityToUpdate.load('speakers');

    const payload = await request.validateUsing(activityValidator, {meta:{activityId: activityToUpdate.activityId }});
    
    if (payload.isCatering === false){
      payload.cateringComment = null;
      payload.cateringAmount = null;
    }


    //Записываем сущность и связанные сущности в транзакции
    const trx = await db.transaction()
  
    try {
      activityToUpdate.useTransaction(trx)
      //Если нашли спикеров в пэйлоаде или в обновляемой записи - синхронизируем значения
      let speakersToSync;

      if (payload.speakers || activityToUpdate.speakers){  
        if(payload.speakers && payload.speakers.length > 0){
          //Если пришли новые значения в пэйлоаде
          speakersToSync = Object.fromEntries(new Map(payload.speakers.map(e =>  ([e.speakerId.toString(), {'duration': e.duration}]))));
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

  /**
   * Delete record
   */
  async destroy({ params }: HttpContext) {
    const found = await Activity.findOrFail(params.id);
    await found.delete();
    return found;
  }
}