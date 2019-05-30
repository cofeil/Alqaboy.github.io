var mysql      = require('mysql');
// var promise    = require('bluebird');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'root',
  database : 'autodata',
  port	:'3306'
});
 
connection.connect();
 
module.exports = {


  insert: function(tabel, data) {
     return new Promise(function(resolve, reject){    
     connection.query('INSERT INTO '+tabel+' SET ?',data, function(err, result) {
         if (err)  reject(err);
       resolve(result);		
     });
   
   });
  },
  select: function(tabel, id) {
     return new Promise(function(resolve, reject){
     connection.query('SELECT * FROM '+tabel+' WHERE id = ? ',[id], function(err, rows, fields) {
       if (err) reject(err);
         resolve(rows);
     });
   });	
  },
  update: function(tabel, data) {
     return new Promise(function(resolve, reject){
     connection.query('UPDATE '+tabel+' SET ?' , [data] ,function(err, rows, fields) {
       if (err) reject(err);				
       resolve(rows);
     });	
   });
  },
  selectAllFrom: function(tabel) {
    return new Promise(function(resolve, reject){
      connection.query('SELECT * FROM '+tabel, function(err, rows, fields) {
        if (err) reject(err);
          resolve(rows);
      });
    });	
  },
  getAvailableCars: function(){
    return new Promise(function(resolve, reject){
      connection.query('SELECT masini.id, marca, model, an_fabricatie, cmc, pret, observatii, imagini_path, combustibili.nume AS combustibil_nume, status.nume AS status FROM masini INNER JOIN combustibili ON masini.combustibil_id = combustibili.id INNER JOIN status ON masini.status_id = status.id '  ,function(err, rows, fields) {
        if (err) reject(err);				
        resolve(rows);
      });	
    });
  },
  getAllCars: function(){
    return new Promise(function(resolve, reject){
      connection.query('SELECT masini.id, marca, model, an_fabricatie, cmc, pret, observatii, imagini_path, combustibili.nume AS combustibil_nume, status.nume AS status FROM masini INNER JOIN combustibili ON masini.combustibil_id = combustibili.id INNER JOIN status ON masini.status_id = status.id '  ,function(err, rows, fields) {
        if (err) reject(err);				
        resolve(rows);
      });	
    });
  },
  getAllCereriByCarId: function(masina_id){
    return new Promise(function(resolve, reject){
      connection.query('SELECT * FROM cerere WHERE masina_id = ?'  ,[masina_id],function(err, rows, fields) {
        if (err) reject(err);				
        resolve(rows);
      });	
    });
  },
  getCar: function( id ){
    return new Promise(function(resolve, reject){
      connection.query('SELECT masini.id, marca, model, an_fabricatie, cmc, pret, observatii, imagini_path, combustibili.nume AS combustibil_nume, status.nume AS status FROM masini INNER JOIN combustibili ON masini.combustibil_id = combustibili.id INNER JOIN status ON masini.status_id = status.id Where masini.id = ? '  , [id] ,function(err, rows, fields) {
        if (err) reject(err);				
        resolve(rows);
      });	
    });
  },
  getAllCereri: function(){
    return new Promise(function(resolve, reject){
      connection.query('SELECT *, masini.status_id AS masiniStatus, cerere.status_id as cerereStatus, status.nume as cerereStatusNume, cerere.nume AS nume, cerere.id AS cerere_id '+
      'FROM cerere INNER JOIN masini ON cerere.masina_id = masini.id JOIN status ON cerere.status_id = status.id'  ,function(err, rows, fields) {
        if (err) reject(err);				
        resolve(rows);
      });	
    });
  },
  aprobaCerere: function(id){
    return new Promise(function(resolve, reject){
      connection.query('UPDATE cerere SET status_id = 8 WHERE id = ?; '  ,[id],function(err, rows, fields) {
        if (err) reject(err);				
        resolve(rows);
      });	
    });
  },
  refuzaCerere: function(id){
    return new Promise(function(resolve, reject){
      connection.query('UPDATE cerere SET status_id = 10 WHERE id = ?; '  ,[id],function(err, rows, fields) {
        if (err) reject(err);				
        resolve(rows);
      });	
    });
  },
  stergeCerere: function(id){
    return new Promise(function(resolve, reject){
      connection.query('DELETE FROM cerere WHERE id=?',[id]  ,function(err, rows, fields) {
        if (err) reject(err);				
        resolve(rows);
      });	
    });
  },
  updateStatusMasina: function(status_id, masina_id){
    return new Promise(function(resolve, reject){
      connection.query('UPDATE masini SET status_id = ? WHERE id = ?; '  ,[status_id, masina_id],function(err, rows, fields) {
        if (err) reject(err);				
        resolve(rows);
      });	
    });
  },
  checkIfUserExist: function(a,b) { 
    return new Promise(function(resolve, reject){
      connection.query('SELECT * FROM users WHERE email = ? AND password = ? ' , [a,b] ,function(err, rows, fields) {
        if (err){ reject(err)};
        resolve(rows);
      });	
    });
  },
  getUserByEmailAndPass: function(a,b) {  		
    return new Promise(function(resolve, reject){
      connection.query('SELECT id FROM users WHERE email = ? AND password = ? ' , [a,b] ,function(err, rows, fields) {
        if (err){ reject(err)};
        resolve(rows);
      });	
    });
  },
  isToken: function(a) {  		
    return new Promise(function(resolve, reject){
      connection.query('SELECT * FROM users WHERE token = ? ' , [a] ,function(err, rows, fields) {
        if (err){ reject(err)};
        resolve(rows);
      });	
    });
  },
  createToken: function(token, id) {
    return new Promise(function(resolve, reject){      
      connection.query('UPDATE users SET token = ? WHERE id = ?',[token, id], function(err, result) {
          if (err)  reject(err);
        resolve(result);		
      });    
    });
 },

  deleteToken: function ( a ){
    return new Promise(function(resolve, reject){
      connection.query('UPDATE users SET token = 0 WHERE id = ? ' , [a] ,function(err, rows, fields) {
        if (err){ reject(err)};
        resolve(rows);
      });	
    });
  },  

};