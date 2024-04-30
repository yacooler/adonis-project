import Speaker from '#models/speaker';
import speakerValidator from '#validators/speakerValidator';
import type { HttpContext } from '@adonisjs/core/http'

export default class SpeakersController {
  /**
   * Display a list of resource
   */
  async index({}: HttpContext) {
    return await Speaker.all();
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request }: HttpContext) {
    const payload = await request.validateUsing(speakerValidator);
    const ret = await Speaker.create(payload);
    await ret.save()
    return ret;
  }
  /**
   * Show individual record
   */
  async show({ params }: HttpContext) {
    return await Speaker.findOrFail(params.id);
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request }: HttpContext) {
    const [found, payload] = await Promise.all([
      Speaker.findOrFail(params.id),
      request.validateUsing(speakerValidator)]);

    const res = await found.merge(payload).save();
    return res;

  }

  /**
   * Delete record
   */
  async destroy({ params }: HttpContext) {
    
  }
}