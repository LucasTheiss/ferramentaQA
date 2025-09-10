# Ferramenta QA
Trabalho para implementação de uma ferramente para gerencimaneto de checklists focado em Quality Assurance para matéria de Qualidade de Software.

## Como rodar
É necessária a instalação de todas as dependências especificadas no arquivo `app.py`, após isso, configurar `.env` com as variáveis ocultas relacionadas ao e-mail, executar `data/db_create.py` para criação do banco de dados, executar `app.py` para iniciação do arquivo Flask
e por fim, acessar o `https://127.0.0.1:5000`.

## Módulos
### app.py
Framework: Flask \
\
Arquivo principal na execução do site:
- Define as rotas da aplicação.
- Possui toda a lógica de backend.
- Realiza a renderização de templates.
- Realiza o envio de e-mails através do `Flask-mail`.
- Realiza todas as transações nos banco de dados.

### Banco de dados 
Framework: SQLite \
\
Principais tabelas
- checklist: Armazena as informações gerais de cada checklist (nome, descrição, categoria).
- nivel: Guarda os níveis de gravidade personalizados (Crítico, Alto, etc.) e seus prazos, associados a um checklist.
- item: Contém as perguntas/critérios de cada checklist.
- verificacao: Registra uma "sessão" de resposta a um checklist, incluindo a data e a pontuação final.
- resposta: Armazena a resposta individual ("Sim", "Não", "NA") para cada item de uma verificação.
- notificacao: Log de cada notificação enviada, com destinatário, prazo e status ("Pendente" ou "Resolvido").

### templates/
Responsável por toda a estrutura visual da aplicação.

`Tecnologia`: HTML com motor de templates `Jinja2`.

`base.html`: Arquivo mestre que define o cabeçalho, a estrutura principal e a importação de CSS/JS, sendo estendido por todas as outras páginas para manter a consistência.

`Páginas Dinâmicas`: Utilizam a sintaxe do `Jinja2` para carregar dinamicamente os dados fornecidos pelo app.py diretamente no HTML, melhorando a performance geral.

### static/
Responsável pela estilização e interatividade das páginas no navegador do usuário.

`style.css`: 
Define toda a identidade visual do projeto, utilizando um layout moderno baseado em Flexbox e Grid CSS.

`Arquivos .js`:
Responsabilidades: Manipulação do DOM, 
gerenciamento de eventos, chamadas fetch para a API do app.py e uso da biblioteca SweetAlert2 para exibir pop-ups e confirmações de forma elegante. 
Cada página com lógica mais extensa possui seu próprio arquivo de script para manter o código organizado.


## Funcionalidades
Seção dedicada às funcionalidades principais da aplicação. \
\
Obs: Todas as páginas principais possuem uma barra de pesquisa para facilitar a busca por itens específicos.

## Gestão de Checklists:
- Criar checklists personalizados com nome, categoria e descrição.
- Definir itens (perguntas) e níveis de gravidade com prazos de resolução para cada checklist.
- Editar checklists existentes, alterando qualquer um de seus dados.
- Listar e Pesquisar todos os checklists criados com um filtro dinâmico.

## Verificação:
- Responder a um checklist, marcando cada item como "Sim", "Não" ou "Não Aplicável".
- Atribuir um nível de gravidade para cada item marcado como "Não".
- Calcular a pontuação de aprovação do checklist em tempo real durante o preenchimento.
  
## Histórico e Relatórios:
- Consultar um histórico completo de todas as verificações já realizadas.
- Visualizar relatórios detalhados de cada verificação, com todas as perguntas, respostas e gravidades atribuídas.

## Notificação e Acompanhamento:
- Notificar responsáveis por e-mail sobre itens não conformes diretamente da página de relatório.
- Acompanhar todas as notificações enviadas em uma página dedicada, com status de "Pendente" ou "Resolvido".
- Identificar visualmente as pendências que ultrapassaram o prazo de resolução.
- Marcar pendências como "Resolvidas" para fechar o ciclo de auditoria.
