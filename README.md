Cannected
==============
[![Build Status](https://cannvas.visualstudio.com/c5c40111-3553-4535-aa8a-164a734fe30a/_apis/build/status/1)](https://cannvas.visualstudio.com/c5c40111-3553-4535-aa8a-164a734fe30a/_apis/build/status/1)


## Development Setup
---

### Rails / Ruby version
* v5.2.1 / v2.5.1

### Node version
- Node v8.11+
- Npm v5.6+
- Yarn v1.9.4+ (*We use `yarn` for this project*)

### Database
* MongoDB v3.6+, don't use v4.x yet since mLab (https://mlab.com/mlab-vs-atlas/) doesn't support it yet (19 Sept 2018).
* Database GUI tools - Robo 3T (https://robomongo.org/download)

### Configuration
* Copy `master.key` from others and put it under `config/master.key`
* Run `git config core.hooksPath .githooks`
* NOTE: `git commit` would trigger `pre-commit` hook to format `Ruby` & `JavaScript` codes

### Development
* Run `bundle install`
* Run `yarn install`
* Run `rails s` OR `foreman start -f Procfile.dev` (to run `webpack-dev-server` too)

### Running the test suite
* `bundle exec rspec`

#### TDD: To keep running rspec during development: 
* `bundle exec spring rspec`
* `bundle exec guard`

## Staging Server URL
http://cannvas-staging.herokuapp.com/

## Beta Server URL
https://beta.cannected.com/

### Deployment
1. Create PR to merge to `master`. 
2. Once PR is merged, it would automatically be deployed to Staging server.
