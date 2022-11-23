const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
const dbPath = path.join(__dirname, "todoApplication.db");
const app = express();
app.use(express.json());
let dataBase = null;

const initializeDbAndServer = async () => {
  try {
    dataBase = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server run at http://localhost:3000");
    });
  } catch (e) {
    console.log(`Db Error: ${e.message}`);
  }
};
initializeDbAndServer();

app.get("/todos/", async (request, response) => {
  try {
    const queryParameters = request.query;
    console.log(queryParameters);
    switch (true) {
      case queryParameters.status !== undefined:
        const { status } = queryParameters;
        const statusQuery = `SELECT * FROM todo WHERE status = '${status}';`;
        const statusArray = await dataBase.all(statusQuery);
        response.send(statusArray);
        break;
      case queryParameters.priority !== undefined:
        const { priority } = queryParameters;
        const priorityQuery = `SELECT * FROM todo WHERE priority = '${priority}';`;
        const priorityArray = await dataBase.all(priorityQuery);
        response.send(priorityArray);
        break;
      case queryParameters.status !== undefined &&
        queryParameters.priority !== undefined:
        //const { status, priority } = queryParameters;
        const resultQuery = `SELECT * FROM todo WHERE status = '${status}' AND priority = '${priority}';`;
        const resultArray = await dataBase.all(resultQuery);
        response.send(resultArray);
        break;
      case queryParameters.search_q !== undefined:
        const { search_q } = queryParameters;
        const searchQuery = `SELECT * FROM todo WHERE todo LIKE '%${search_q}%';`;
        const searchArray = await dataBase.all(searchQuery);
        response.send(searchArray);
        break;
    }
  } catch (e) {
    console.log(`Error: ${e.message}`);
  }
});

//API2
app.get("/todos/:todoId/", async (request, response) => {
  try {
    const { todoId } = request.params;
    const todoQuery = `
            SELECT 
               *
            FROM todo
            WHERE id = ${todoId};`;
    const getTodoDetails = await dataBase.get(todoQuery);
    response.send(getTodoDetails);
  } catch (e) {
    console.log("error: ${e.message}");
  }
});

// API3
app.post("/todos/", async (request, response) => {
  try {
    const { id, todo, priority, status } = request.body;
    const createTodoQuery = `
        INSERT INTO 
            todo (id, todo, priority, status)
        VALUES
            (${id}, '${todo}', '${priority}', '${status}');`;
    const createTodoDetails = await dataBase.run(createTodoQuery);
    response.send(`Todo Successfully Added`);
  } catch (e) {
    console.log(`error: ${e.message}`);
  }
});

//API4
app.put("/todos/:todoId/", async (request, response) => {
  try {
    const { todoId } = request.params;
    const requestBody = request.body;
    //console.log(requestBody);
    //console.log(requestBody.status);
    switch (true) {
      case requestBody.status !== undefined:
        const { status } = requestBody;
        const statusQueryUpdate = `
                UPDATE todo
                SET
                    status = '${status}'
                WHERE id = ${todoId};`;
        await dataBase.run(statusQueryUpdate);
        response.send(`Status Updated`);
      case requestBody.priority !== undefined:
        const { priority } = requestBody;
        const priorityQueryUpdate = `
                UPDATE todo
                SET
                    priority = '${priority}'
                WHERE id = ${todoId};`;
        await dataBase.run(priorityQueryUpdate);
        response.send("Priority Updated");
      case requestBody.todo !== undefined:
        const { todo } = requestBody;
        const todoQueryUpdate = `
                UPDATE todo
                SET 
                    todo = '${todo}'
                WHERE id = ${todoId};`;
        await dataBase.run(todoQueryUpdate);
        response.send(`Todo Updated`);
    }
  } catch (e) {
    console.log(`error: ${e.message}`);
  }
});

//API5
app.delete("/todos/:todoId/", async (request, response) => {
  try {
    const { todoId } = request.params;
    const deleteTodoQuery = `
            DELETE FROM todo WHERE id = ${todoId};`;
    await dataBase.run(deleteTodoQuery);
    response.send(`Todo Deleted`);
  } catch (e) {
    console.log(`error: ${e.message}`);
  }
});

module.exports = app;
