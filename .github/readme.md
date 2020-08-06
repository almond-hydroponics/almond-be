<div align="center">

## almond-be

[![Maintainability](https://api.codeclimate.com/v1/badges/0bf9c930aba3128bd6ae/maintainability)](https://codeclimate.com/github/almond-hydroponics/almond-be/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/0bf9c930aba3128bd6ae/test_coverage)](https://codeclimate.com/github/almond-hydroponics/almond-be/test_coverage)
[![Language grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/g/almond-hydroponics/almond-be.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/almond-hydroponics/almond-be/context:javascript)
[![Total alerts](https://img.shields.io/lgtm/alerts/g/almond-hydroponics/almond-be.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/almond-hydroponics/almond-be/alerts/)
<img src="https://img.shields.io/badge/version-0.0.1-blue.svg?cacheSeconds=2592000" />

</div>

<div align="center">

    Almond backend application for the hydroponics farm

  [![Almond](../public/img/readme.svg)](https://almond-re-staging.herokuapp.com/)

  #### Simple but complicated almond

</div>

## Description
This application will be used in a hydroponics farm control system to be used at home with limited space, in greenhouses and indoors as well.

### Application Heroku Links

-   Backend (Swagger Documentation):
    [swagger-documentation](https://almond-api.herokuapp.com/)

-   Frontend (Almond App Hosting):
    [almond web app](https://almond-re-staging.herokuapp.com/)

-   Postman collection
    <br />
    <br />
    [![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/f9f0f4ab064818fbf641)

### Development set up
1. Install [`Node JS`](https://nodejs.org/en/).
2. To clone, run `git clone https://github.com/mashafrancis/almond-be`.
3. `cd` into the root of the **project directory**.
4. Install [`yarn`](https://yarnpkg.com/en/docs/install#mac-stable).
5. Run `yarn install` on the terminal to install dependencies.
6. Create a `.env` file in the root directory of the application. Example of the content of a `.env` file is shown in the `.env.example`
7. Install mongodb to your system [`mongodb`](https://docs.mongodb.com/manual/installation/)
8. Install mongodb-tools by running `apt-get mongodb-tools`
9. Install redis server on your machine [`redis install`](https://redis.io/topics/quickstart)
7. Setup local development server.

### Development server

Run `yarn start:dev` for a dev server. Navigate to `http://localhost:8080/`. The app will automatically reload if you change any of the source files.

### Build

Run `yarn build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## FAQ
See the almond [wiki](https://github.com/mashafrancis/almond-hw/wiki)

