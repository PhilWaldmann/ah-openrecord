[Actionhero](http://actionherojs.com/) [OpenRecord](https://github.com/PhilWaldmann/openrecord) initializer
=============

* be sure to enable the plugin within actionhero (config/api.js)
* you will need to add the ah-openrecord-plugin package (npm install ah-openrecord-plugin --save) to your package.json

configure your database connection via `config/database.js`


# global Resource() function

The global `Resource()` function is a macro for creating actionhero actions.
The following example creates 5 actions which will use the `User` model:
 * users:create
 * users:destroy
 * users:update
 * users:get
 * users:list

```js
module.exports = Resource('User');
```

If you just need e.g. `list` do the following:

```js
module.exports = Resource('User', {
	actions: ['list']
});
```


## Optional Options

* `action`: The base resource name. e.g. `user`. By default it'll take the filename (without .js)
* `actions`: Array of available actions. e.g. `['list', 'get']`
* `scope`: Array of OpenRecord scopes which should be called
* `prefix`: Action name prefix. `prefix: 'admin'` will create action `admin:user:list` 
* `requireAuth`: Boolean. Is authentication required or not (will behandled by identity plugin)
* `requireRole`: String. What role do you need to call that actions (will behandled by identity plugin)
* `custom`: Array of custom actionhero actions