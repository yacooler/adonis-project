import type { HttpContext } from '@adonisjs/core/http'
import Activity from '#models/activity'
import activityValidator from '#validators/activityValidator';

export default class ActivitiesController {
  /**
   * Display a list of resource
   */
  async index({}: HttpContext) {
    return Activity.all();
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
    return await Activity.findOrFail(params.id)
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request }: HttpContext) {
    const found = await Activity.findOrFail(params.id);
    const payload = await request.validateUsing(activityValidator, {meta:{activityId: found.activityId }});
    
    //см. Вопросы.txt
    if (payload.isCatering === false){
      payload.cateringComment = null;
      payload.cateringAmount = null;
    }

    const res = await found.merge(payload).save();
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