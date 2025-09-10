from flask import Flask, render_template, request, jsonify, redirect
import sqlite3

app = Flask(__name__)

def get_db_connection():
    conn = sqlite3.connect('database.db')
    conn.row_factory = sqlite3.Row
    return conn

@app.route('/')
def index():
    conn = get_db_connection()
    checklists = conn.execute('''
        SELECT c.id, c.nome, c.descricao, c.categoria, COUNT(i.id) as total_itens
        FROM checklist c
        LEFT JOIN item i ON c.id = i.checklist_id
        GROUP BY c.id
        ORDER BY c.data_criacao DESC
    ''').fetchall()
    conn.close()
    return render_template('index.html', dados=checklists)

@app.route('/criar', methods=['GET', 'POST'])
def criar():
    if request.method == 'GET':
        return render_template('criar.html')
    
    if request.method == 'POST':
        dados = request.get_json()

        if not dados or 'name' not in dados or 'items' not in dados or 'severityLevels' not in dados:
            return jsonify({'bool': False, 'message': 'Dados incompletos recebidos.'}), 400

        conn = get_db_connection()
        cursor = conn.cursor()

        try:
            sql_checklist = "INSERT INTO checklist (nome, descricao, categoria) VALUES (?, ?, ?)"
            cursor.execute(sql_checklist, (dados['name'], dados['description'], dados['category']))
            checklist_id = cursor.lastrowid

            items_para_inserir = [(item['question'], checklist_id) for item in dados['items']]
            if items_para_inserir:
                sql_item = "INSERT INTO item (question, checklist_id) VALUES (?, ?)"
                cursor.executemany(sql_item, items_para_inserir)

            niveis_para_inserir = [(nivel['name'], nivel['time'], checklist_id) for nivel in dados['severityLevels']]
            if niveis_para_inserir:
                sql_nivel = "INSERT INTO nivel (nome, tempo, checklist_id) VALUES (?, ?, ?)"
                cursor.executemany(sql_nivel, niveis_para_inserir)

            conn.commit()
            return jsonify({'bool': True, 'message': 'Checklist criado com sucesso!'})

        except Exception as e:
            conn.rollback()
            print(f"Erro no banco de dados: {e}")
            return jsonify({'bool': False, 'message': 'Ocorreu um erro interno no servidor.'}), 500
        finally:
            conn.close()

@app.route('/editar', methods=['GET'])
def editar():
    checklist_id = request.args.get('id')
    if not checklist_id:
        return redirect('/')
    
    conn = get_db_connection()
    checklist_data = conn.execute("SELECT * FROM checklist WHERE id = ?", (checklist_id,)).fetchone()
    
    if not checklist_data:
        conn.close()
        return redirect('/')

    items_data = conn.execute("SELECT * FROM item WHERE checklist_id = ?", (checklist_id,)).fetchall()
    niveis_data = conn.execute("SELECT * FROM nivel WHERE checklist_id = ?", (checklist_id,)).fetchall()
    conn.close()
    
    checklist = dict(checklist_data)
    items = [dict(row) for row in items_data]
    niveis = [dict(row) for row in niveis_data]
    
    return render_template('editar.html', checklist=checklist, items=items, niveis=niveis)


if __name__ == '__main__':
    app.run(debug=True)