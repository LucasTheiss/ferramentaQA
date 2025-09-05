from flask import Flask, render_template, request
import sqlite3

app = Flask(__name__)

@app.route('/')
def index():
    conn = get_db_connection()
    dados = conn.execute('SELECT * FROM checklist').fetchall()
    if len(dados) == 0:
        dados = None
    return render_template('index.html', dados=dados)

@app.route('/criar', methods=['GET', 'POST'])
def criar():
    if request.method == 'GET':
        return render_template('criar.html')
    return
    conn = get_db_connection()

@app.route('/notificacoes')
def notificacoes():
    conn = get_db_connection()
    dados = None
    pass
    return render_template('notificacoes.html', dados=dados)

def get_db_connection():
    conn = sqlite3.connect('data/database.db')
    conn.row_factory = sqlite3.Row
    return conn

if __name__ == '__main__':
    app.run(debug=True)