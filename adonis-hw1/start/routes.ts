/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import ActivitiesController from '#controllers/activities_controller'
import CategoriesController from '#controllers/categories_controller'
import SpeakersController from '#controllers/speakers_controller'

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

router.resource('activity', ActivitiesController).except(['create','edit']);
router.resource('category', CategoriesController).except(['create','edit']);
router.resource('speaker', SpeakersController).except(['create','edit']);

