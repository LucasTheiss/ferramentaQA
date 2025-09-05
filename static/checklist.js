let totalItens = 0
let indexTotal = 0
let listaElementos = []
let niveis = []

function salvarPergunta() {
    const inputElement = document.getElementById('checklist-input-save')
    const textoPergunta = inputElement.value.trim()

    if (textoPergunta === '') {
        return
    }

    const novoItem = {
        id: indexTotal,
        texto: textoPergunta
    }

    const linhaDeAdicionar = document.querySelector('.checklist-adicionar')
    const container = document.querySelector('.checklist-itens')

    const novaLinha = document.createElement('div')
    novaLinha.className = 'checklist-item row'

    const colunaTexto = document.createElement('div')
    colunaTexto.className = 'col-10 checklist-item'
    const inputTexto = document.createElement('input')
    inputTexto.className = "checklist-input"
    inputTexto.value = textoPergunta
    inputTexto.id = indexTotal
    colunaTexto.append(inputTexto)

    const colunaAcoes = document.createElement('div')
    colunaAcoes.className = 'col'

    const botaoSalvar = document.createElement('div')
    botaoSalvar.className = 'salvar'
    botaoSalvar.setAttribute('onclick', 'atualizarPergunta(this)')
    botaoSalvar.innerHTML = `
        <svg class="salvar" xmlns="http://www.w3.org/2000/svg" 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="blue" 
            stroke-width="2" 
            stroke-linecap="round" 
            stroke-linejoin="round">
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
            <polyline points="17 21 17 13 7 13 7 21"></polyline>
            <polyline points="7 3 7 8 15 8"></polyline>
        </svg>
    `

    const botaoDeletar = document.createElement('button')
    botaoDeletar.className = 'btn btn-link text-danger p-0'
    botaoDeletar.setAttribute('onclick', 'excluirPergunta(this)')
    botaoDeletar.innerHTML = `
        <svg class="excluir" xmlns="http://www.w3.org/2000/svg" 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="red" 
            stroke-width="2" 
            stroke-linecap="round" 
            stroke-linejoin="round">
            <path d="M3 6h18"></path>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            <line x1="10" y1="11" x2="10" y2="17"></line>
            <line x1="14" y1="11" x2="14" y2="17"></line>
        </svg>
    `

    colunaAcoes.appendChild(botaoSalvar)
    colunaAcoes.appendChild(botaoDeletar)
    novaLinha.appendChild(colunaTexto)
    novaLinha.appendChild(colunaAcoes)

    container.insertBefore(novaLinha, linhaDeAdicionar)

    inputElement.value = ''
    inputElement.focus()

    
    listaElementos.push(novoItem)
    totalItens++
    indexTotal++
}

function excluirPergunta(botao) {
    const linhaParaRemover = botao.parentElement.parentElement;
    const inputDaLinha = linhaParaRemover.querySelector('.checklist-input');
    const idParaRemover = Number(inputDaLinha.id);

    let i = 0;
    for (; i < listaElementos.length && listaElementos[i].id != idParaRemover; i++){}
    
    if (i < listaElementos.length) {
        listaElementos.splice(i, 1);
    }
    
    linhaParaRemover.remove();
    totalItens--;
}

function atualizarPergunta(botao){
    const linha = botao.parentElement.parentElement;
    const inputDaLinha = linha.querySelector('.checklist-input');
    const idParaAtualizar = Number(inputDaLinha.id);
    const novoTexto = inputDaLinha.value;

    let i = 0;
    for(; i < listaElementos.length && listaElementos[i].id != idParaAtualizar; i++){}

    if(i < listaElementos.length) {
        listaElementos[i].texto = novoTexto;
    }
    console.log(listaElementos  )
}

function voltar(){
    Swal.fire({
        title: "Tem certeza que deseja continuar?",
        text: "Seu progresso não salvo será perdido!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Cancelar",
        cancelButtonText: "Continuar"
    }).then((result) => {
        if (!result.isConfirmed) {
            window.location.href = '/'
        }
    });
}