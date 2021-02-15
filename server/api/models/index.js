const mysql = require('mysql');     //引入mysql模块

// var pool  = mysql.createPool({
//   connectionLimit : 10,
//   host:'127.0.0.1',
//   port:'3306',
//   user:'root',
//   password:'123456',
//   database:'myblog'
// });
var pool  = mysql.createPool({
  connectionLimit : 10,
  host:'182.61.19.98',
  port:'3306',
  user:'myblog',
  password:'123456',
  database:'myblog'
});
const queryPromise = (sql) => {
  return new Promise( (resolve, reject) => {
    pool.getConnection( (err, connection) => {
      if (err) {
        reject(err)
      } else {
        connection.query(sql, (err, result) => {
          if (err) {
            reject(err)
          } else {
            resolve(result)
          }
          connection.release()
        })
      }
    })
  })
}

pool.on('connection', function (connection) {
  console.log('connection')
});
pool.on('release', function (connection) {
  console.log('release')
});
// const db = mysql.createConnection({      //创建mysql实例
//   host:'127.0.0.1',
//   port:'3306',
//   user:'root',
//   password:'123456',
//   database:'myblog'
// });
// db.connect((err)=>{
//   if(err){
//     console.error('数据库连接失败')
//     return
//   }
// })
// db.queryPromise = (sql) => {
//   return new Promise( (resolve,reject) => {
//     db.query(sql,(err,result) => {
//       if (err) {
//         reject(`[SELECT ERROR]:${err.message}`)
//       }
//       resolve(result)
//     })
//   })
// }

module.exports = {
  queryPromise,

  async getAll (table) {
    const res = await queryPromise(`SELECT * FROM ${table}`)
    return res
  },
  async getByCond (table,field,value) {
    const res = await queryPromise(`SELECT * FROM ${table} WHERE BINARY ${field}='${value}'`)
    return res
  },
  async searchByCond (table,field,value) {
    const res = await queryPromise(`SELECT * FROM ${table} WHERE BINARY ${field}='${value}'`)
    return res
  },
  async searchByTwoConds (table,field1,value1,field2,value2) {
    const res = await queryPromise(`SELECT * FROM ${table} WHERE BINARY ${field1}='${value1}' AND ${field2}='${value2}'`)
    return res
  },
  // async searchByConds (table,field,value) {
  //   const res = await queryPromise(`SELECT (${field}) FROM ${table} WHERE BINARY ${field}='${value}'`)
  //   return res
  // },
  async addFolder (newName) {
    const res = await queryPromise(`INSERT INTO folders (name) VALUES ('${newName}')`)
    return res
  },
  // async addSpecialFolder (newName) {
  //   const res = await queryPromise(`INSERT INTO folders (name) VALUES ('${newName}'`)
  //   return res
  // }
  async addNoteTitle (folderId, newTitle) {
    const res = await queryPromise(`INSERT INTO notes (folderId, title) VALUES ('${folderId}','${newTitle}')`)
    return res
  },
  async renameFolder (id, newName) {
    const res = await queryPromise(`UPDATE folders SET name='${newName}' WHERE BINARY id='${id}'`)
    return res
  },
  async deleteFolder (id) {
    const res = await queryPromise(`DELETE FROM folders WHERE BINARY id='${id}'`)
    return res
  },
  async updateNote (conditions,values) {
    const keys_c = Object.keys(conditions)
    const keys_v = Object.keys(values)
    // console.log(`UPDATE notes SET ${keys_v[0]}="${values[keys_v[0]]}" WHERE BINARY ${keys_c[0]}=${conditions[keys_c[0]]} AND ${keys_c[1]}=${conditions[keys_c[1]]}`)
    const res = await queryPromise(`UPDATE notes SET ${keys_v[0]}="${values[keys_v[0]]}" WHERE BINARY ${keys_c[0]}=${conditions[keys_c[0]]} AND ${keys_c[1]}=${conditions[keys_c[1]]}`)
    return res
  },
  async deleteNote (folderId,id) {
    const res = await queryPromise(`DELETE FROM notes WHERE BINARY id='${id}' AND folderId='${folderId}'`)
    return res
  },
}