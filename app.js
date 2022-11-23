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
    const { status } = request.query;
    const statusQuery = `
            SELECT * FROM todo WHERE status = '${status}';`;
    const arrayDetails = await dataBase.all(statusQuery);
    response.send(arrayDetails);
  } catch (e) {
    console.log(`Error: ${e.message}`);
  }
});

app.get("/todos/", async (request, response) => {
  try {
    const { priority } = request.query;
    const priorityQuery = `
        SELECT
           *
        FROM todo
        WHERE priority = '${priority}';`;
    const arrayDetails = await dataBase.all(priorityQuery);
    response.send(arrayDetails);
  } catch (e) {
    console.log(`error: ${e.message}`);
  }
});

app.get("/todos/", async (request, response) => {
  try {
    const { priority, status } = request.query;
    console.log(priority);
    const statusQuery = `
            SELECT * FROM todo WHERE priority = '${priority}' AND status = '${status}';`;
    const arrayDetails = await dataBase.all(statusQuery);
    response.send(arrayDetails);
  } catch (e) {
    console.log(`Error: ${e.message}`);
  }
});

app.get("/todos/", async (request, response) => {
  try {
    const { search_q } = request.query;
    const statusQuery = `
            SELECT * FROM todo WHERE todo LIKE '%${search_q}%';`;
    const arrayDetails = await dataBase.all(statusQuery);
    response.send(arrayDetails);
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
    const { status } = request.body;
    const updateTodoQuery = `
            UPDATE todo
            SET
               status = '${status}'
            WHERE
                id = ${todoId};`;
    await dataBase.run(updateTodoQuery);
    response.send(`Status Updated`);
  } catch (e) {
    console.log(`error: ${e.message}`);
  }
});
app.put("/todos/:todoId", async (request, response) => {
  try {
    const { todoId } = request.params;
    const { priority } = request.body;
    const priorityUpdateQuery = `
            UPDATE todo
            SET
                priority = '${priority}'
            WHERE id = ${todoId};`;
    await dataBase.run(priorityUpdateQuery);
    response.send(`Priority Updated`);
  } catch (e) {
    console.log(`error: ${e.message}`);
  }
});

app.put("/todos/:todoId", async (request, response) => {
  try {
    const { todoId } = request.params;
    const { todo } = request.body;
    const todoUpdateQuery = `
            UPDATE todo
            SET
                todo = '${todo}'
            WHERE id = ${todoId};`;
    await dataBase.run(todoUpdateQuery);
    response.send(`Todo Updated`);
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
