# Todo List App Command Line Version 1.0.2 is Here!
This is a new release of our Todo List Application in command line Version 1.0.2!

## 🎁 Features:
   * You can Create a Todo.
   * You can Remove a Todo.
   * You can List all Todos.
   * You can Edit a specific Todo.
   * You can make a Todo Incomplete(if todo is completed).
   * You can complete a Todo(if todo is incomplete).
   * You can Read a specific Todo.
   * Available for <img width="20px" src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Apple_logo_grey.svg/732px-Apple_logo_grey.svg.png"> Mac and <img src="https://upload.wikimedia.org/wikipedia/commons/5/5f/Windows_logo_-_2012.svg" width="20px"> Windows.
## 📖 Guides:
   * First Clone this repository from the Command Line by Typing `git clone https://github.com/Siddharth453/Todo-List.git` or go to <a href="https://cmd-todo-list9.herokuapp.com/download/v1.0.2">https://cmd-todo-list9.herokuapp.com/download/v1.0.2</a>.
   * Then from the command line type `cd Todo-List/Todo-CLI.v1.0.2`.
   * Then run `npm install`
   * then run `/Users/<your user>/mongodb/bin/mongod.exe --dbpath=/Users/<your user>/mongodb-data` to start the mognodb local server.
   * And you have finished the setup part of the application!
   * Type `node app.js --help` for more information of the commands.
   * Type `node app.js create --title="<Your Title>" --description="<Your Description>" --due="<Your Due Date>" --urgent="<Type true or false>"` to create a todo.
   * Type `node app.js remove --title="<Type the title of the todo which you want to delete>"` to remove a todo.
   * Type `node app.js find` to List all the Todos you have.
   * Type `node app.js read --title="<Type the title of the todo which you want to read>"` to read a speific todo.
   * Type `node app.js complete --title="<Type the title of the todo which you want to complete>"` to complete a todo(if the todo is incomplete)
   * Type `node app.js incomplete --title="<Type the title of the todo which you want to incomplete>"` to incomplete a todo(if the todo is completed)
   * Type `node app.js edit --title="<Type the Titile of the Todo which you want to edit>" --editTitle="<Your Title>" --editDescription="<Your Description>" --editDue="<Your Due Date>" --urgent="<Type true or false>"` to edit a specific todo.
   * Type `version.cmd` to see the version of the application (if on Windows Command Prompt).
   * Type `bash version.sh` to see the version of the application (if on Bash).
 ## 🗂 Requirements:
   * Requires node v12.18.3.
   * Requires mongodb v4.4.1.
 
 ***
 
<h6>Thanks</h6>
<h5>Siddharth Kumar</h5>
<p align="right">Version 1.0.2(Latest)</p>
