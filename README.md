Cannected
==============
[![Build Status](https://cannvas.visualstudio.com/c5c40111-3553-4535-aa8a-164a734fe30a/_apis/build/status/1)](https://cannvas.visualstudio.com/c5c40111-3553-4535-aa8a-164a734fe30a/_apis/build/status/1)


## Development Setup
---

### Rails / Ruby version
* v5.2.3 / v2.5.1

### Node version
- Node v8.11+
- Npm v6+
- Yarn v1.15+ (*We use `yarn` for this project*)

### Database
* MongoDB v3.6+, don't use v4.x yet since mLab (https://mlab.com/mlab-vs-atlas/) doesn't support it yet (19 Sept 2018).
* Database GUI tools - Robo 3T (https://robomongo.org/download)

### Cache Server
* Redis - v4

### Configurations

### Development Setup
* Run `bundle install`
* Run `yarn install`
* Install `foreman` (`gem install foreman`)
* Run `foreman start -f Procfile.dev` (to run `webpack-dev-server & sidekiq` too)
* Run `git config core.hooksPath .githooks`
    * NOTE: `git commit` would trigger `pre-commit` hook to format `Ruby` & `JavaScript` codes
* (Optional) copy `master.key` from others and put it under `config/master.key`

### Docker
* To use mongodb via docker
* Create a new volume for mongodb data `docker volume create mongodbdata`
* Run docker mongodb image
* `docker run --name mongo37 -d -p 27017:27017 -v mongodbdata:/data/db mongo:3.7`

### Development Workflow
* Pick a task from VSTS
    * Move task to `Active` column & assign yourself to the task
* Branch from `master` to start working on a task.
  1. E.g branch name
      1.  `git checkout –b feat/sign-up-page`
      2.  feat – new feature
      3.  bug – bug fixes => “bug/bug-with-sign-up”
      4.  consistence
  2. Prefer smaller commit when work locally, whenever make sense.
* Clean codes
    1.  Put comments when you think the code are complex.
    2.  Follow existing pattern in the existing codebase (if there’s any)
        - Naming, spacing, grouping etc.
        - Consistent pattern.
        - Consistent ui.
    3.  Write code that are easy to maintain – when you have any doubt, ask us on slack.
* Commit codes that related to the task you’re working on.
    1.  E.g. if working on a bug fix, just commit code related to fixing the bug.
* It's fine to have a single PR addressing few smaller tasks / bugs / related items. But **use separate PR** for unrelated tasks.

#### Create Pull Request (PR)
* Once done with task, push to remote and create a PR to merge back to `master` branch.
* Assign reviewer and associate the relevent task(s) to the PR.
    * NOTE: Once a PR is merged, it would automatically be deployed to `staging` server.

### Running the test suite
* `bundle exec rspec`

#### TDD: To keep running rspec during development: 
* `bundle exec spring rspec`
* `bundle exec guard`

## Staging Server URL
- Url: http://cannvas-staging.herokuapp.com/
- Login: `dev@email.com` / `password`

## Beta Server URL
- Url: https://beta.cannected.com/
