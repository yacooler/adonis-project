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

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

router.resource('activity', ActivitiesController)

