<div align="center">

## almond-be

[![Gitpod Ready-to-Code](https://img.shields.io/badge/Gitpod-Ready--to--Code-blue?logo=gitpod)](https://gitpod.io/#https://github.com/almond-hydroponics/almond-be)
![CI](https://github.com/almond-hydroponics/almond-be/workflows/CI/badge.svg)
[![CircleCI](https://circleci.com/gh/almond-hydroponics/almond-be.svg?style=svg)](https://circleci.com/gh/almond-hydroponics/almond-be)
[![Maintainability](https://api.codeclimate.com/v1/badges/0bf9c930aba3128bd6ae/maintainability)](https://codeclimate.com/github/almond-hydroponics/almond-be/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/0bf9c930aba3128bd6ae/test_coverage)](https://codeclimate.com/github/almond-hydroponics/almond-be/test_coverage)
[![Language grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/g/almond-hydroponics/almond-be.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/almond-hydroponics/almond-be/context:javascript)
[![Total alerts](https://img.shields.io/lgtm/alerts/g/almond-hydroponics/almond-be.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/almond-hydroponics/almond-be/alerts/)

</div>

<div align="center">

    Almond backend application for the hydroponics farm

[![Almond](../public/img/readme.svg)](https://almond-re-staging.herokuapp.com/)

#### Simple but complicated almond

</div>

## Description

This application will be used in a hydroponics farm control system to be used at home with limited space, in greenhouses and indoors as well.

### Application Heroku Links

- Backend (Swagger Documentation):
  [swagger-documentation](https://almond-api.herokuapp.com/)

- Frontend (Almond App Hosting):
  [almond web index](https://almond-re-staging.herokuapp.com/)

- Postman collection
  <br />
  <br />
  [![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/144b6f12e9e9def531e1#?env%5Balmond%5D=W3sia2V5IjoiYmFzZS11cmwiLCJ2YWx1ZSI6IiIsImVuYWJsZWQiOnRydWV9LHsia2V5IjoidG9rZW4iLCJ2YWx1ZSI6IiIsImVuYWJsZWQiOnRydWV9LHsia2V5IjoiZ3JhZmFuYS11cmwiLCJ2YWx1ZSI6IiIsImVuYWJsZWQiOnRydWV9LHsia2V5IjoiZ3JhZmFuYS10b2tlbiIsInZhbHVlIjoiIiwiZW5hYmxlZCI6dHJ1ZX0seyJrZXkiOiJpbmZsdXgtc2VydmVyLXVybCIsInZhbHVlIjoiIiwiZW5hYmxlZCI6dHJ1ZX0seyJrZXkiOiJ2ZXJpZmljYXRpb25Ub2tlbiIsInZhbHVlIjoiIiwiZW5hYmxlZCI6dHJ1ZX0seyJrZXkiOiJlbWFpbCIsInZhbHVlIjoidGVzdEB0ZXN0LmNvbSIsImVuYWJsZWQiOnRydWV9LHsia2V5IjoidXNlcl9pZCIsInZhbHVlIjoiIiwiZW5hYmxlZCI6dHJ1ZX0seyJrZXkiOiJkZXZpY2VfaWQiLCJ2YWx1ZSI6IiIsImVuYWJsZWQiOnRydWV9XQ==)

### Development set up

1. Install [`Node JS`](https://nodejs.org/en/).
2. To clone, run `git clone https://github.com/almond-hydroponics/almond-be`.
3. `cd` into the root of the **project directory**.
4. Install [`yarn`](https://yarnpkg.com/en/docs/install#mac-stable).
5. Run `yarn install` on the terminal to install dependencies.
6. Create a `.env` file in the root directory of the application. Example of the content of a `.env` file is shown in the `.env.example`
7. Install mongodb to your system [`mongodb`](https://docs.mongodb.com/manual/installation/)
8. Install mongodb-tools by running `apt-get mongodb-tools`
9. Install redis server on your machine [`redis install`](https://redis.io/topics/quickstart)
10. Setup local development server.

### Development server

Run `yarn start:dev` for a dev server. Navigate to `http://localhost:8080/`. The index will automatically reload if you change any of the source files.

### Build

Run `yarn build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

### Online one-click setup

You can use Gitpod for the one click online setup. With a single click it will launch a workspace and automatically:

- Clone the `almond-be` repo.
- Install the dependencies.
- Run `cp .env.example .env`.
- Run `yarn install & yarn build`.
- Run `yarn start`.

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/from-referrer/)

### API Validation

By using celebrate the req.body schema becomes clary defined at route level, so even frontend devs can read what an API endpoint expects without need to writting a documentation that can get outdated quickly.

```js
route.post(
	'/signup',
	celebrate({
		body: Joi.object({
			name: Joi.string().required(),
			email: Joi.string().required(),
			password: Joi.string().required(),
		}),
	}),
	controller.signup,
);
```

**Example error**

```json
{
	"errors": {
		"message": "child \"email\" fails because [\"email\" is required]"
	}
}
```

[Read more about celebrate here](https://github.com/arb/celebrate) and [the Joi validation API](https://github.com/hapijs/joi/blob/v15.0.1/API.md)

## FAQ

See the almond [wiki](https://github.com/mashafrancis/almond-hw/wiki)
