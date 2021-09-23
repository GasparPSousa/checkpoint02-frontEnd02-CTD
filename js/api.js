
function carregandoJanela() {
    tempo = 0;
    let loading = document.getElementById('loading');
    console.log(loading)

    setTimeout(() => {
        loading.style.display = 'none';
    }, 3000);
}

let sectionTarefas = document.getElementById('secao-tarefas');

function criarTarefa(descricao, id) {
    const artigo = document.createElement('article');
    artigo.setAttribute('id', 'visualizar');
    artigo.innerHTML =
     ` 
    <div class="section__box-icons">

    </div>
    <div class="section__box-paragrafo">
         <p>${descricao}</p>
         <div class="section__box-datas">
            <p>Id: ${id}</p>
        </div>
    </div>
    `
    return artigo;
}


async function requisitarTarefas() {
    try {
        const resquisicao = await (await fetch('https://jsonplaceholder.typicode.com/todos/')).json();
        for (let i = 0; i < resquisicao.length; i++) {
            let novaTarefa = criarTarefa(resquisicao[i].title, resquisicao[i].id)
            if(resquisicao[i].completed == true) {
                novaTarefa.children[1].children[0].classList.toggle('tachado');
            }
            sectionTarefas.appendChild(novaTarefa);
        }
    } catch (erro) {
        console.log(erro.name);
        return erro.name;
    }
}

requisitarTarefas();

