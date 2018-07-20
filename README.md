Cannected
==============
[![Build Status](https://cannvas.visualstudio.com/c5c40111-3553-4535-aa8a-164a734fe30a/_apis/build/status/1)](https://cannvas.visualstudio.com/c5c40111-3553-4535-aa8a-164a734fe30a/_apis/build/status/1)


## Development Setup
---

### Rails / Ruby version
* v5.2.0 / v2.5.1

### Database
* Install MongoDB (v3.6+) locally for development
* Install Robo 3T (https://robomongo.org/download) - GUI tools for MongoDB

### Configuration
* Copy `master.key` from others and put it under `config/master.key`
* Run `git config core.hooksPath .githooks` - to configure git hooks
* NOTE: `git commit` would trigger pre-commit hook to format Ruby & JavaScript codes

### Running development server
* `rails s`
* or running together with webpack-dev-server `foreman start -f Procfile.dev`

### Running the test suite
* `bundle exec rspec`

#### TDD: To keep running rspec during development: 
* `bundle exec spring rspec`
* `bundle exec guard`

## Staging Setup
---

### Heroku app
* `heroku git:remote -a cannvas-staging` - to add heroku app

### Deploying to Staging Server
* `git push heroku master` - to deploy to master to staging
* Staging URL http://cannvas-staging.herokuapp.com/
