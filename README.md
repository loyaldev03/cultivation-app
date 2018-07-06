# README


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
* `foreman start -f Procfile.dev`

### Running the test suite
* `bundle exec rspec`

#### TDD: To keep running rspec during development: 
* Run `bundle exec spring rspec`
* Run `bundle exec guard`

## Staging Setup
---

### Heroku app
* Run `heroku git:remote -a cannvas-staging` - to add heroku app

### Deploying to Staging Server
* Run `git push heroku master` - to deploy to master to staging
* Staging URL http://cannvas-staging.herokuapp.com/
