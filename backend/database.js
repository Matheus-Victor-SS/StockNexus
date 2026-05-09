//importando biblioteca
const sqlite3 = require('sqlite3').verbose();//verbose ativa mensagens de log detalhadas para depuração

// Conecta ao banco de dados SQLite (cria o arquivo se não existir)
const db = new sqlite3.Database('./database.db', (err) => {//(err) => é uma função de callback que é chamada após a tentativa de conexão ao banco
  if (err) {
    console.error('Erro ao conectar ao banco:', err.message);//mostra erro
  } else {
    console.log('Conectado ao banco de dados SQLite.');
  }
});

// Cria a tabela de produtos se ela não existir
db.serialize(() => {//serialize executa em ordem
  db.run(`
    CREATE TABLE IF NOT EXISTS produtos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      codigo_barras TEXT NOT NULL UNIQUE,
      nome TEXT NOT NULL,
      descricao TEXT,
      quantidade INTEGER NOT NULL,
      preco REAL NOT NULL
    )
  `, (err) => {
    if (err) {
      console.error('Erro ao criar tabela:', err.message);
    } else {
      console.log('Tabela de produtos criada/verificada.');
    }
  });
});

// Exporta a instância do banco para uso em outros arquivos
module.exports = db;