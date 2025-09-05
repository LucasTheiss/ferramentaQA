let totalItens = 0
let indexTotal = 0
let listaElementos = []
let niveis = []
let indexNivel = 0

function salvarItem(tipo) {
    if (tipo === 'pergunta') {
        const input = document.getElementById('checklist-input-save')
        const texto = input.value.trim()
        
        if (texto === '') return
        
        const item = {
            id: indexTotal,
            texto: texto
        }
        
        criarElementoLista(tipo, item, indexTotal)
        listaElementos.push(item)
        indexTotal++
        totalItens++
        document.querySelector('#numero').innerHTML = totalItens

        input.value = ''
        input.focus()
    } 
    else if (tipo === 'nivel') {
        const inputNivel = document.getElementById('nivel-input-save')
        const inputTempo = document.getElementById('tempo-input-save')
        const nivel = inputNivel.value.trim()
        const tempo = inputTempo.value.trim()
        
        if (nivel === '' || tempo === '') return
        
        const item = {
            id: indexNivel,
            nivel: nivel,
            tempo: parseInt(tempo)
        }
        
        criarElementoLista(tipo, item, indexNivel)
        niveis.push(item)
        indexNivel++
        
        inputNivel.value = ''
        inputTempo.value = ''
        inputNivel.focus()
    }
}

function criarElementoLista(tipo, item, id) {
    const novaLinha = document.createElement('div')
    novaLinha.className = tipo === 'pergunta' ? 'checklist-item row' : 'nivel-item row'
    
    if (tipo === 'pergunta') {
        const linhaDeAdicionar = document.querySelector('.checklist-adicionar')
        const container = document.querySelector('.checklist-itens')
        
        novaLinha.innerHTML = `
            <div class="col-10 checklist-item">
                <input class="checklist-input" value="${item.texto}" id="${id}" data-tipo="pergunta">
            </div>
            <div class="col">
                <div class="salvar" onclick="atualizarItem('pergunta', this)">
                    <svg class="salvar" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="blue" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                        <polyline points="17 21 17 13 7 13 7 21"></polyline>
                        <polyline points="7 3 7 8 15 8"></polyline>
                    </svg>
                </div>
                <button class="btn btn-link text-danger p-0" onclick="excluirItem('pergunta', this)">
                    <svg class="excluir" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="red" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M3 6h18"></path>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        <line x1="10" y1="11" x2="10" y2="17"></line>
                        <line x1="14" y1="11" x2="14" y2="17"></line>
                    </svg>
                </button>
            </div>
        `
        container.insertBefore(novaLinha, linhaDeAdicionar)
    } 
    else if (tipo === 'nivel') {
        const linhaDeAdicionar = document.querySelector('.nivel-adicionar')
        const container = document.querySelector('.niveis-itens')
        
        novaLinha.innerHTML = `
            <div class="col-6 checklist-item">
                <input class="checklist-input" value="${item.nivel}" id="nivel-${id}" data-tipo="nivel">
            </div>
            <div class="col-4 checklist-item">
                <input type="number" class="checklist-input" value="${item.tempo}" id="tempo-${id}" min="1">
            </div>
            <div class="col">
                <div class="salvar" onclick="atualizarItem('nivel', this)">
                    <svg class="salvar" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="blue" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                        <polyline points="17 21 17 13 7 13 7 21"></polyline>
                        <polyline points="7 3 7 8 15 8"></polyline>
                    </svg>
                </div>
                <button class="btn btn-link text-danger p-0" onclick="excluirItem('nivel', this)">
                    <svg class="excluir" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="red" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M3 6h18"></path>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        <line x1="10" y1="11" x2="10" y2="17"></line>
                        <line x1="14" y1="11" x2="14" y2="17"></line>
                    </svg>
                </button>
            </div>
        `
        container.insertBefore(novaLinha, linhaDeAdicionar)
    }
}

function excluirItem(tipo, botao) {
    const linha = botao.parentElement.parentElement
    
    if (tipo === 'pergunta') {
        const input = linha.querySelector('.checklist-input')
        const id = Number(input.id)
        
        let i = 0
        for (; i < listaElementos.length && listaElementos[i].id != id; i++){}
        
        if (i < listaElementos.length) {
            listaElementos.splice(i, 1)
        }
        
        totalItens--
        document.querySelector('#numero').innerHTML = totalItens
    } 
    else if (tipo === 'nivel') {
        const inputNivel = linha.querySelector('input[id^="nivel-"]')
        const id = Number(inputNivel.id.replace('nivel-', ''))
        
        let i = 0
        for (; i < niveis.length && niveis[i].id != id; i++){}
        
        if (i < niveis.length) {
            niveis.splice(i, 1)
        }
    }
    
    linha.remove()
}

function atualizarItem(tipo, botao) {
    const linha = botao.parentElement.parentElement
    
    if (tipo === 'pergunta') {
        const input = linha.querySelector('.checklist-input')
        const id = Number(input.id)
        const novoTexto = input.value
        
        let i = 0
        for(; i < listaElementos.length && listaElementos[i].id != id; i++){}
        
        if(i < listaElementos.length) {
            listaElementos[i].texto = novoTexto
        }
    } 
    else if (tipo === 'nivel') {
        const inputNivel = linha.querySelector('input[id^="nivel-"]')
        const inputTempo = linha.querySelector('input[id^="tempo-"]')
        const id = Number(inputNivel.id.replace('nivel-', ''))
        const novoNivel = inputNivel.value
        const novoTempo = parseInt(inputTempo.value)
        
        let i = 0
        for(; i < niveis.length && niveis[i].id != id; i++){}
        
        if(i < niveis.length) {
            niveis[i].nivel = novoNivel
            niveis[i].tempo = novoTempo
        }
    }
}

function voltar() {
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
    })
}

function enviarFormulario() {
    const nome = document.getElementById('nome').value.trim()
    const descricao = document.getElementById('descricao').value.trim()
    const categoria = document.getElementById('categoria').value.trim()
    
    if (nome === '') {
        Swal.fire('Erro', 'O nome do checklist é obrigatório', 'error')
        return
    }
    
    if (listaElementos.length === 0) {
        Swal.fire('Erro', 'Adicione pelo menos uma pergunta ao checklist', 'error')
        return
    }
    
    if (niveis.length === 0) {
        Swal.fire('Erro', 'Adicione pelo menos um nível de gravidade', 'error')
        return
    }
    
    const dados = {
        nome: nome,
        descricao: descricao,
        categoria: categoria,
        perguntas: listaElementos.map(item => item.texto),
        niveis: niveis.map(item => ({
            nivel: item.nivel,
            tempo: item.tempo
        }))
    }
    
    fetch('/criar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(dados)
    })
    .then(response => response.json())
    .then(data => {
        if (data.bool) {
            Swal.fire({
                title: 'Sucesso!',
                text: data.message,
                icon: 'success'
            }).then(() => {
                window.location.href = '/'
            })
        } else {
            Swal.fire('Erro', data.message || 'Erro ao criar checklist', 'error')
        }
    })
    .catch(error => {
        Swal.fire('Erro', 'Erro ao comunicar com o servidor' + error, 'error')
    })
}