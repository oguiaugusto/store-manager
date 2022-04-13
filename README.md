# Welcome to my Store Manager repository!

This project was made by [Guilherme Augusto](https://github.com/oguiaugusto), using Node Express, MySQL and MSC architecture to validate knowledge learned in [Trybe](https://www.betrybe.com/).

---

## Description

The objective was to create a Store Manager API using NodeJS and ExpressJS. It was developed using the software architecture **Model-Service-Controller**. All data was manipulated in a MySQL database.

#### API Endpoints:

##### Products:
- GET /products
- GET /products/:id
- POST /products
- PUT /products/:id
- DELETE /products/:id

##### Sales:
- GET /sales
- GET /sales/:id
- POST /sales
- PUT /sales/:id
- DELETE /sales/:id

---

## Used Technologies

  - Node Js
  - Express Js
  - MySQL
  - mysql2 ([npm library](https://www.npmjs.com/package/mysql2))
  - Nodemon
  - DotEnv

## Using Application

1. Clone repository
    * `git clone git@github.com:oguiaugusto/store-manager.git`

2. Install the dependencies if it exists
    * In the repository folder: `npm install`

3. Set environment variables on a .env file in the root folder:
    ```sql
      MYSQL_HOST=`your host`
      MYSQL_USER=`your user`
      MYSQL_PASSWORD=`your password`
      PORT=`your port`
    ```

4. Create Store Manager database
    * The script to create the db is in a file called `StoreManager.sql`.

4. Run the API
    * Using nodemon (for development)
      * `npm run debug`
    * Using default node
      * `npm start`

---

## Copyright

  - Integration tests were provided by [Trybe](https://www.betrybe.com/).
