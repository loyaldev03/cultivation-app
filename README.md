Cannected
==============
[![Build Status](https://cannvas.visualstudio.com/c5c40111-3553-4535-aa8a-164a734fe30a/_apis/build/status/1)](https://cannvas.visualstudio.com/c5c40111-3553-4535-aa8a-164a734fe30a/_apis/build/status/1)


## Development Setup
---

### Rails / Ruby version
* v5.2.3 / v2.5.1

### Node version
- Node v8.11+ / v10 (not tested with v12)
- Npm v6+
- Yarn v1.15+ (*We use `yarn` for this project*)

### Database
* MongoDB v4.0+
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
* To use redis via docker
* `docker run --name redis -d -p 6379:6379 redis`

### Development Workflow
* Pick a task from VSTS
    * Move task to `Active` column & assign yourself to the task
* Branch from `develop` to start working on a task.
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
* Once done with task, push to remote and create a PR to merge back to `develop` branch.
* Assign reviewer and associate the relevent task(s) to the PR.
    * NOTE: Once a PR is merged, it would automatically be deployed to `staging` (`https://cannvas-staging.herokuapp.com`) server.

#### PR to Master
* When ready to deploy to Client's site, create PR to merge from `develop` to `master`
* Once merged, the CI will deploy the changes to production and `https://beta.cannected.com`

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


# New Client Setup

## Create new Cluster on MongoDB Atlas
1. Select us-west-1 for California
1. Select M10 for dedicated instance with 3 replica set nodes
1. Create a new MongoDB User under Security > Database Access
    - Create new Custom Role
    - Follow existing role
1. Click "CONNECT" button to get connection string

## Create AWS S3 bucket for client
1. Create bucket - *e.g. mountain1.cannected.com*
1. Add CORS configuration to the bucket
    ```
    <?xml version="1.0" encoding="UTF-8"?>
    <CORSConfiguration xmlns="http://s3.amazonaws.com/doc/2006-03-01/">
    <CORSRule>
        <AllowedOrigin>https://mountain.cannected.com</AllowedOrigin>
        <AllowedMethod>GET</AllowedMethod>
        <AllowedMethod>POST</AllowedMethod>
        <AllowedMethod>PUT</AllowedMethod>
        <MaxAgeSeconds>3000</MaxAgeSeconds>
        <AllowedHeader>Authorization</AllowedHeader>
        <AllowedHeader>x-amz-date</AllowedHeader>
        <AllowedHeader>x-amz-content-sha256</AllowedHeader>
        <AllowedHeader>content-type</AllowedHeader>
    </CORSRule>
    <CORSRule>
        <AllowedOrigin>*</AllowedOrigin>
        <AllowedMethod>GET</AllowedMethod>
        <MaxAgeSeconds>3000</MaxAgeSeconds>
    </CORSRule>
    </CORSConfiguration>
    ```
1. Create IAM user - *e.g. mountain-rails-s3*
1. Attach policy to IAM user from #2 to allow to access #1
    ```
    {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Effect": "Allow",
                "Action": "s3:ListBucket",
                "Resource": "arn:aws:s3:::mountain1.cannected.com"
            },
            {
                "Effect": "Allow",
                "Action": [
                    "s3:PutObject",
                    "s3:GetObject",
                    "s3:DeleteObject"
                ],
                "Resource": "arn:aws:s3:::mountain1.cannected.com/*"
            }
        ]
    }
    ```
1. Copy Access Key and Secret key from 2 and add to server ENV settings.

## Configure SMS_FROM environement variable
1. Make sure the value is not too long

## Configure OneSignal
1. Create new app id from OneSignal site
1. Copy the app id & api key to the env variables

## Changing Client Domain name
1. Update GoDaddy > DNS > Add CNAME pointing to Cloud66
  - dig newsubdomain.cannected.com to check if DNS has resovled to Cloud66
1. Update Clound66 > Configuration > Environment Variables
  - Update MAILER_URL_HOST
  - Under Add-Ins > SSL, add the new domain name to the list 
1. Update AWS > S3 >  bucket > Permissions > CORS configuration
1. Run `/health_check/full` to verify health
