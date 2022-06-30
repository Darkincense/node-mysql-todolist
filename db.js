const mysql = require("promise-mysql");
var dateTime = require('node-datetime');


class MysqlRequest {
  
  state = {
    mysqlConfig: {  // 数据库配置
      host: "127.0.0.1",
      user: "root",
      password: "root123456",
      port: "3306",
      database: "test",
    },
    table: 'todo',  // 表
  }

  // 获取数据库表中所有数据
  getAll = async function () {
    return await this.query(`select * from ${this.state.table}`);
  }
  
  // mysql数据库交互
  query = async function(sql) {
    const connection = await mysql.createConnection(this.state.mysqlConfig);
    try {
      const result = connection.query(sql);
      connection.end();
      return result;
    } catch (error) {
      throw error;
    }
  }
  
  // 添加或者更新todolist
  update = async function(todo) {
    todo.is_done = todo.is_done == undefined ? 0 : todo.is_done;
  
    if (todo.id) {
      Object.assign(this.getTodoById(todo.id), todo);
      return await this.query(`
      UPDATE ${this.state.table}
      SET content='${todo.content}',is_done='${todo.is_done}'
      WHERE ${this.state.table}.id=${todo.id}
      `);
    } else {
      var dt = dateTime.create();
      dt.format('m/d/Y H:M:S');
      // todo.date = new Date().toJSON().slice(0, 10);
      todo.date = new Date(dt.now()).toJSON().slice(0, 20);
      return await this.query(`
      INSERT INTO ${this.state.table} (content,date,is_done) 
      VALUES ('${todo.content}','${todo.date}','${todo.is_done}')
      `);
    }
  }
  
  // 根据id获取对应的list
  getTodoById = async function(id) {
    const result = await this.query(`SELECT * FROM ${this.state.table} WHERE ${this.state.table}.id='${id}'`);
    if (result[0]) {
      return result[0];
    }
    return null;
  }

  // 删除
  remove = async function(id) {
    return await this.query(`DELETE FROM ${this.state.table} WHERE ${this.state.table}.id='${id}'`);
  }
}

module.exports = MysqlRequest;
