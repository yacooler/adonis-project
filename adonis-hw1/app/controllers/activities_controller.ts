import type { HttpContext } from '@adonisjs/core/http'
import Activity from '#models/activity'
import activityValidator from '#validators/activityValidator';

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

    const [ activityToUpdate ] = await Activity
      .query()
      .where(Activity.primaryKey, params.id)
      .preload('speakers', (query) => {query.pivotColumns(['duration'])})

    const payload = await request.validateUsing(activityValidator, {meta:{activityId: activityToUpdate.activityId }});
    
    if (payload.isCatering === false){
      payload.cateringComment = null;
      payload.cateringAmount = null;
    }

    //Если нашли спикеров в пэйлоаде или в обновляемой записи - синхронизируем значения
    if (payload.speakers || activityToUpdate.speakers){
      
      if(payload.speakers && payload.speakers.length > 0){
        //Подготовили объект с доп данными
        const speakers = Object.fromEntries(new Map(payload.speakers.map(e =>  ([e.id.toString(), {'duration': e.duration}]))))  
        await activityToUpdate.related('speakers').sync(speakers);
      } else {
        await activityToUpdate.related('speakers').sync([]);
      }   
    }

    const res = await activityToUpdate.merge(payload).save();
    await res.load('speakers');
    return res;
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