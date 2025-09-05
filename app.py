from flask import Flask, render_template, request, redirect, jsonify
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
    
    dados = request.get_json()
    conn = get_db_connection()

    cursor = conn.cursor()

    sql_checklist = "INSERT INTO checklist (nome, descricao, categoria) VALUES (?, ?, ?)"
    cursor.execute(sql_checklist, (dados['nome'], dados['descricao'], dados['categoria']))

    idatual = cursor.lastrowid

    perguntas_para_inserir = [(pergunta, idatual) for pergunta in dados['perguntas']]
    sql_item = "INSERT INTO item (pergunta, checklist_id) VALUES (?, ?)"
    cursor.executemany(sql_item, perguntas_para_inserir)

    niveis_para_inserir = [(item['nivel'], item['tempo'], idatual) for item in dados['niveis']]
    sql_nivel = "INSERT INTO nivel (nome, tempo, checklist_id) VALUES (?, ?, ?)"
    cursor.executemany(sql_nivel, niveis_para_inserir)

    conn.commit()

    if conn:
        conn.close()

    return jsonify({'bool': True, 'mensagem': 'Checklist criado com sucesso!'})

@app.route('/editar', methods=['GET', 'POST'])
def editar():
    if request.method == 'GET':
        id = request.args.get('id')
        if not id:
            return redirect('/')
        
        conn = get_db_connection()
        

        sql_checklist = "SELECT * FROM checklist WHERE id = ?"
        dados = conn.execute(sql_checklist, id).fetchone()

        sql_itens = "SELECT * FROM item WHERE checklist_id = ?"
        perguntas = conn.execute(sql_itens, id).fetchall()

        sql_niveis = "SELECT * FROM nivel  WHERE checklist_id = ?"
        niveis = conn.execute(sql_niveis, id).fetchall()

        totalItens = len(perguntas)

        return render_template('editar.html', dados=dados, niveis=niveis, perguntas=perguntas, totalItens=totalItens)
    #TODO
    return

@app.route('/verificar', methods=['GET', 'POST'])
def verificar():
    # TODO
    if request.method == 'GET':
        pass
    pass

@app.route('/notificacoes')
def notificacoes():
    # TODO
    pass
    conn = get_db_connection()
    dados = None
    return render_template('notificacoes.html', dados=dados)

def get_db_connection():
    conn = sqlite3.connect('database.db')
    conn.row_factory = sqlite3.Row
    return conn

if __name__ == '__main__':
    app.run(debug=True)