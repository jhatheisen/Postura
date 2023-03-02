# ![logo-no-background](https://user-images.githubusercontent.com/106848904/222582532-03b094ce-1fa8-4736-803c-8facc323092b.png)

This is the repository for the Postura Website.

## Live Link

https://postura.onrender.com


## Screenshots

![image](https://user-images.githubusercontent.com/106848904/222584063-1ab97942-f60c-4f5e-95a4-0fde2e8762e3.png)
![image](https://user-images.githubusercontent.com/106848904/222584134-bab45259-1def-4c0c-a8be-18f34f28f2b0.png)
![image](https://user-images.githubusercontent.com/106848904/222584445-f7f11ae7-ce84-4ae7-929c-d61d3d3f62e0.png)




## Wiki Link
* [API Documentation](https://github.com/jhatheisen/Postura/wiki/API-routes)
* [Database Schema](https://github.com/jhatheisen/Postura/wiki/Database-Schema)
* [Feature List](https://github.com/jhatheisen/Postura/wiki/Features)
* [Redux Store Shape](https://github.com/jhatheisen/Postura/wiki/Redux-Store)
* [Feature List](https://github.com/jhatheisen/Postura/wiki/Features)
* [User Stories](https://github.com/jhatheisen/Postura/wiki/User-Stories)
* [Wireframe](https://github.com/jhatheisen/Postura/wiki/Wireframes)

## Tech Stack
* Frameworks, Platforms, and Libraries: 
  * Javascript
  * Python
  * HTML5
  * CSS3
  * Node.js
  * React
  * Redux
  * Flask
  * SQLAlchemy
  * Alembic
* Database
  * Postgres
  * SQLite3
* Hosting
  * Render

## Getting started
1. Clone this repository (only this branch)

2. Install dependencies

      ```bash
      pipenv install -r requirements.txt
      ```

3. Create a **.env** file based on the example with proper settings for your
   development environment

4. Make sure the SQLite3 database connection URL is in the **.env** file

5. This starter organizes all tables inside the `flask_schema` schema, defined
   by the `SCHEMA` environment variable.  Replace the value for
   `SCHEMA` with a unique name, **making sure you use the snake_case
   convention**.

6. Get into your pipenv, migrate your database, seed your database, and run your Flask app

   ```bash
   pipenv shell
   ```

   ```bash
   flask db upgrade
   ```

   ```bash
   flask seed all
   ```

   ```bash
   flask run
   ```

7. To run the React App in development, checkout the [README](./react-app/README.md) inside the `react-app` directory.
