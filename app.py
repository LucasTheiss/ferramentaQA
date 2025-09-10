from flask import Flask, render_template, request, jsonify, redirect
from datetime import datetime, timedelta
from flask_mail import Mail, Message
import sqlite3
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)

app.config.update(
    MAIL_SERVER=os.getenv("MAIL_SERVER"),
    MAIL_PORT=int(os.getenv("MAIL_PORT")),
    MAIL_USE_SSL=os.getenv("MAIL_USE_SSL") == "True",
    MAIL_USERNAME=os.getenv("MAIL_USERNAME"),
    MAIL_PASSWORD=os.getenv("MAIL_PASSWORD")
)
mail = Mail(app)

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

@app.route('/editar/<int:checklist_id>', methods=['GET', 'POST'])
def editar(checklist_id):
    conn = get_db_connection()

    if request.method == 'POST':
        dados = request.get_json()
        
        if not dados or 'name' not in dados or 'items' not in dados or 'severityLevels' not in dados:
            return jsonify({'bool': False, 'message': 'Dados incompletos recebidos.'}), 400

        try:
            cursor = conn.cursor()

            cursor.execute("DELETE FROM item WHERE checklist_id = ?", (checklist_id,))
            cursor.execute("DELETE FROM nivel WHERE checklist_id = ?", (checklist_id,))

            sql_update_checklist = "UPDATE checklist SET nome = ?, descricao = ?, categoria = ? WHERE id = ?"
            cursor.execute(sql_update_checklist, (dados['name'], dados['description'], dados['category'], checklist_id))
            items_para_inserir = [(item['question'], checklist_id) for item in dados['items']]
            if items_para_inserir:
                cursor.executemany("INSERT INTO item (question, checklist_id) VALUES (?, ?)", items_para_inserir)

            niveis_para_inserir = [(nivel['name'], nivel['time'], checklist_id) for nivel in dados['severityLevels']]
            if niveis_para_inserir:
                cursor.executemany("INSERT INTO nivel (nome, tempo, checklist_id) VALUES (?, ?, ?)", niveis_para_inserir)

            conn.commit()
            return jsonify({'bool': True, 'message': 'Checklist atualizado com sucesso!'})

        except Exception as e:
            conn.rollback()
            print(f"Erro ao atualizar o banco de dados: {e}")
            return jsonify({'bool': False, 'message': 'Ocorreu um erro interno no servidor.'}), 500
        finally:
            conn.close()


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

@app.route('/verificar/<int:checklist_id>', methods=['GET', 'POST'])
def verificar(checklist_id):
    conn = get_db_connection()

    if request.method == 'POST':
        respostas = request.get_json()
        if not respostas:
            return jsonify({'bool': False, 'message': 'Nenhuma resposta recebida.'}), 400

        try:
            total_sim = sum(1 for r in respostas if r['answer'] == 'Sim')
            total_nao = sum(1 for r in respostas if r['answer'] == 'Não')
            
            if (total_sim + total_nao) == 0:
                score = 100.0
            else:
                score = (total_sim / (total_sim + total_nao)) * 100.0

            cursor = conn.cursor()

            sql_verificacao = "INSERT INTO verificacao (checklist_id, score_aprovacao) VALUES (?, ?)"
            cursor.execute(sql_verificacao, (checklist_id, score))
            verificacao_id = cursor.lastrowid

            respostas_para_inserir = []
            for r in respostas:
                respostas_para_inserir.append((
                    verificacao_id,
                    r['itemId'],
                    r['answer'],
                    r.get('severityId')
                ))
            
            sql_respostas = "INSERT INTO resposta (verificacao_id, item_id, resposta_texto, nivel_id) VALUES (?, ?, ?, ?)"
            cursor.executemany(sql_respostas, respostas_para_inserir)

            conn.commit()
            return jsonify({'bool': True, 'message': 'Checklist finalizado com sucesso!'})

        except Exception as e:
            conn.rollback()
            print(f"Erro ao salvar verificação: {e}")
            return jsonify({'bool': False, 'message': 'Ocorreu um erro interno ao salvar as respostas.'}), 500
        finally:
            conn.close()

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
    
    return render_template('verificar.html', checklist=checklist, items=items, niveis=niveis)

@app.route('/historico')
def historico():
    conn = get_db_connection()
    verificacoes = conn.execute('''
        SELECT v.id, v.data_verificacao, v.score_aprovacao, c.nome as checklist_nome
        FROM verificacao v
        JOIN checklist c ON v.checklist_id = c.id
        ORDER BY v.data_verificacao DESC
    ''').fetchall()
    conn.close()
    verificacoes_lista = []
    for row in verificacoes:
        row_dict = dict(row) 
        row_dict['data_verificacao'] = datetime.strptime(row_dict['data_verificacao'], '%Y-%m-%d %H:%M:%S')
        verificacoes_lista.append(row_dict)

    return render_template('historico.html', verificacoes=verificacoes_lista)

@app.route('/relatorio/<int:verificacao_id>')
def relatorio(verificacao_id):
    conn = get_db_connection()
    
    verificacao_info = conn.execute('''
        SELECT v.id, v.data_verificacao, v.score_aprovacao, c.nome as checklist_nome, c.descricao, c.categoria
        FROM verificacao v
        JOIN checklist c ON v.checklist_id = c.id
        WHERE v.id = ?
    ''', (verificacao_id,)).fetchone()

    if not verificacao_info:
        conn.close()
        return redirect('/historico')

    verificacao_dict = dict(verificacao_info)
    verificacao_dict['data_verificacao'] = datetime.strptime(verificacao_dict['data_verificacao'], '%Y-%m-%d %H:%M:%S')

    respostas = conn.execute('''
        SELECT r.id, r.resposta_texto, i.question, n.nome as nivel_nome
        FROM resposta r
        JOIN item i ON r.item_id = i.id
        LEFT JOIN nivel n ON r.nivel_id = n.id
        WHERE r.verificacao_id = ?
    ''', (verificacao_id,)).fetchall()

    conn.close()

    return render_template('relatorio.html', info=verificacao_dict, respostas=respostas)

# Adicione estas rotas ao final do app.py

@app.route('/notificar', methods=['POST'])
def notificar():
    dados = request.get_json()
    resposta_id = dados.get('resposta_id')
    destinatario = dados.get('destinatario')
    assunto = dados.get('assunto')
    corpo = dados.get('corpo')

    if not all([resposta_id, destinatario, assunto, corpo]):
        return jsonify({'bool': False, 'message': 'Dados incompletos.'}), 400

    conn = get_db_connection()
    # Pega o tempo em dias associado à gravidade da resposta
    resposta_info = conn.execute('''
        SELECT n.tempo 
        FROM resposta r 
        JOIN nivel n ON r.nivel_id = n.id 
        WHERE r.id = ?
    ''', (resposta_id,)).fetchone()

    if not resposta_info or not resposta_info['tempo']:
        conn.close()
        return jsonify({'bool': False, 'message': 'Gravidade não encontrada para este item.'}), 404
    
    # Calcula a data limite
    dias_para_resolver = resposta_info['tempo']
    data_envio = datetime.now()
    data_limite = data_envio + timedelta(days=dias_para_resolver)

    try:
        # Envia o e-mail
        msg = Message(subject=assunto,
                      sender=('QA System', app.config['MAIL_USERNAME']),
                      recipients=[destinatario],
                      body=corpo)
        mail.send(msg)

        # Registra a notificação no banco de dados
        conn.execute('''
            INSERT INTO notificacao (resposta_id, destinatario_email, data_envio, data_limite, status)
            VALUES (?, ?, ?, ?, 'Pendente')
        ''', (resposta_id, destinatario, data_envio, data_limite))
        conn.commit()
        
        return jsonify({'bool': True, 'message': 'Notificação enviada e registrada com sucesso!'})
    except Exception as e:
        conn.rollback()
        print(f"Erro ao notificar: {e}")
        return jsonify({'bool': False, 'message': 'Ocorreu um erro ao enviar a notificação.'}), 500
    finally:
        conn.close()

@app.route('/notificacoes')
def notificacoes():
    conn = get_db_connection()
    # Query complexa para buscar todas as informações necessárias para os cards
    lista_notificacoes = conn.execute('''
        SELECT 
            n.id, n.destinatario_email, n.data_envio, n.data_limite, n.status,
            c.nome as checklist_nome,
            i.question,
            nv.nome as nivel_nome
        FROM notificacao n
        JOIN resposta r ON n.resposta_id = r.id
        JOIN item i ON r.item_id = i.id
        JOIN checklist c ON i.checklist_id = c.id
        JOIN nivel nv ON r.nivel_id = nv.id
        ORDER BY n.data_limite ASC
    ''').fetchall()
    conn.close()
    
    return render_template('notificacoes.html', notificacoes=lista_notificacoes, agora=datetime.now())

@app.route('/notificacoes/resolver/<int:notificacao_id>', methods=['POST'])
def resolver_notificacao(notificacao_id):
    conn = get_db_connection()
    try:
        conn.execute("UPDATE notificacao SET status = 'Resolvido' WHERE id = ?", (notificacao_id,))
        conn.commit()
        return jsonify({'bool': True, 'message': 'Status atualizado para Resolvido.'})
    except Exception as e:
        conn.rollback()
        print(f"Erro ao resolver: {e}")
        return jsonify({'bool': False, 'message': 'Erro ao atualizar o status.'}), 500
    finally:
        conn.close()

if __name__ == '__main__':
    app.run(debug=True)