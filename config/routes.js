/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` your home page.            *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/

  '/': { view: 'RERS/index' },


  /***************************************************************************
  *                                                                          *
  * More custom routes here...                                               *
  * (See https://sailsjs.com/config/routes for examples.)                    *
  *                                                                          *
  * If a request to a URL doesn't match any of the routes in this file, it   *
  * is matched against "shadow routes" (e.g. blueprint routes).  If it does  *
  * not match any of those, it is matched against static assets.             *
  *                                                                          *
  ***************************************************************************/

  '/RERS/create': 'RERSController.create',
  '/RERS/json': 'RERSController.json',
  '/user/json': 'UserController.json',
  '/': 'RERSController.index',
  '/RERS/search/': 'RERSController.search',
  '/RERS/admin': 'RERSController.admin',
  'GET /RERS/detail/:id': 'RERSController.detail',
  '/RERS/edit/:id': 'RERSController.edit',
  'POST /RERS/delete/:id': 'RERSController.delete',
  'POST /user/:id/add/:fk': 'UserController.add',
  'POST /user/:id/remove/:fk': 'UserController.remove',
  'GET /user/login': 'UserController.login',
  'POST /user/login': 'UserController.login',
  'POST /user/logout': 'UserController.logout',
  '/user/': 'UserController.index',
  'GET /RERS/:id/occupants':'RERSController.populate',
  'GET /user/:id/supervises':'UserController.populate',
};
