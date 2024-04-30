import type { HttpContext } from '@adonisjs/core/http'
import Activity from '#models/activity'
import activityValidator from '#validators/activityValidator';
import db from '@adonisjs/lucid/services/db';
import activitySyncSpeakers from './functions/activitySyncSpeakers.js';

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
    const act = await Activity.create(payload);
     //Записываем спикеров
    return activitySyncSpeakers(act, payload);
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
    
    //Записываем спикеров
    return activitySyncSpeakers(activityToUpdate, payload);
    
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