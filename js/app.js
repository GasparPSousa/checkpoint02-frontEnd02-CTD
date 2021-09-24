//VARIÁVEIS

let botaoSalvar = document.getElementById('btn-salvar');
let form = document.getElementById('formulario');
let sectionTarefas = document.getElementById('secao-tarefas');

/* gerando data atual */
let data = new Date();
let dia = String(data.getDate()).padStart(2, '0');
let mes = String(data.getMonth() + 1).padStart(2, '0');
let ano = data.getFullYear();
let dataAtual = ano + '-' + mes + '-' + dia;

const localStorageTarefas = JSON.parse(localStorage.getItem('arrayTarefas'));
const minhasTarefas = localStorage.getItem('arrayTarefas') !== null ? localStorageTarefas : [];

const localStorageIdTarefas = JSON.parse(localStorage.getItem('idsTarefas'));
let indexTarefas = localStorage.getItem('idsTarefas') !== null ? localStorageIdTarefas : [];

for (objTarefa of minhasTarefas) {//leitura de itens no localStorage
    let novoTarefa = criarTarefa(objTarefa.dataCriacao, objTarefa.dataLimite, objTarefa.descricao, objTarefa.idTarefa);
    sectionTarefas.appendChild(novoTarefa);
}

let iconsChecked = document.querySelectorAll('[data-click-checked]');
iconsChecked.forEach(el => el.addEventListener('click', (e) => {
    e.preventDefault();
    // let idTarefa = parseInt(el.id);
    // let indexTarefa = indexTarefas.indexOf(idTarefa);
    let divInput = el.parentElement;
    let paragrafo = divInput.parentElement.children[2].children[0];
    paragrafo.classList.toggle('tachado');
}))


function aplicarBackground(el, article) {
    let paletaCores = article.children[1];
    let input = article.children[0].children[1];
   
        return function () {
            article.style.backgroundColor = el.value;
            paletaCores.removeChild(paletaCores.firstChild);
            input.disabled = false;
        }
}

var cores = ["#003366", "#336699", "#006666", "#66FF99", "#CCFFFF", "#CCCCFF"];
function criarPaleta(artigo) {
    let divPaleta = document.createElement('div');
    divPaleta.setAttribute('class', 'child-paleta');
    cores.forEach(function (cor) {
        var button = document.createElement('button');
        button.setAttribute('class', 'btn-cor');
        button.value = cor;
        button.type = 'button';
        button.style.backgroundColor = cor;
        button.addEventListener('click', aplicarBackground(button, artigo));
        divPaleta.appendChild(button);
    });
    return divPaleta;
}

let iconsColor = document.querySelectorAll('[data-click-color]');
iconsColor.forEach(el => el.addEventListener('mouseover', (e) => {
    e.preventDefault();
    let divInput = el.parentElement;
    let article = divInput.parentElement;
    let paletaCores = article.children[1];
    paletaCores.appendChild(criarPaleta(article));
    paletaCores.classList.remove('escolhas-none');
    el.disabled = true;
}))

let iconsLixeira = document.querySelectorAll('[data-click-lixeira]');
iconsLixeira.forEach(el => el.addEventListener('click', (e) => {
    e.preventDefault();
    let idTarefa = parseInt(el.id);
    let indexTarefa = indexTarefas.indexOf(idTarefa);
    console.log(indexTarefa)
    let confirmacao = confirm("Você quer mesmo excluir essa tarefa?");
    if (confirmacao) {
        minhasTarefas.splice(indexTarefa, 1);
        indexTarefas.splice(indexTarefa, 1);//removendo um elemento do indexCards para manter o sincronismo com o index de meusCards
        location.reload();
    } else
        e.stopPropagation();

    localStorage.setItem('arrayTarefas', JSON.stringify(minhasTarefas));//atualização do localStorage
    localStorage.setItem('idsTarefas', JSON.stringify(indexTarefas));//atualização do localStorage
}))

function objetoTarefa() {
    let tarefa = {};
    tarefa.dataCriacao = dataAtual;
    tarefa.dataLimite = form.dataLimite.value;
    tarefa.descricao = form.descricao.value;
    tarefa.checked = false;
    tarefa.idTarefa = idGenerator();
    return tarefa;
}

function idGenerator() {//função para gerar ids
    return Math.round(Math.random() * 10000);
}


function criarTarefa(dataCriacao, dataLimite, descricao, id) {
    const artigo = document.createElement('article');
    artigo.innerHTML =
        `
    <div class="section__box-icons">
        <input data-click-checked id="${id}" type="image" src="./midias/check.png" alt="checked">
        <input data-click-color id="${id}" type="image" src="./midias/color-palette.png" alt="cor">
        <input data-click-lixeira id="${id}" type="image" src="./midias/bin.png" alt="lixeira">
    </div>
    <div class="escolhas-flex paleta"></div>
    <div class="section__box-paragrafo">
         <p>${descricao}</p>
    </div>
    <div class="section__box-datas">
        <p>Data de criação: ${dataCriacao}</p>
        <p>Data limite: ${dataLimite}</p>
    </div>
    `
    return artigo;
}

botaoSalvar.addEventListener('click', (e) => {
    e.preventDefault();

    if (form.dataLimite.value === '' || form.descricao.value === '') {//alerta de campos vazios
        alert("Os campos de Data Limite e Descrição não podem estar vazios!");
        return;
    } else if (form.dataLimite.value < dataAtual) {
        alert("A Data Limite deve ser igual ou superior à data atual!");
        return
    } else {
        const objTarefa = objetoTarefa();
        let novaTarefa = criarTarefa(objTarefa.dataCriacao, objTarefa.dataLimite, objTarefa.descricao, objTarefa.idTarefa);

        form.dataLimite.value = "";
        form.descricao.value = "";

        minhasTarefas.push(objTarefa);
        indexTarefas.push(objTarefa.idTarefa);
        localStorage.setItem('arrayTarefas', JSON.stringify(minhasTarefas));
        localStorage.setItem('idsTarefas', JSON.stringify(indexTarefas));
        sectionTarefas.appendChild(novaTarefa);
        location.reload();
    }
})