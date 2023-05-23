function atualizarGrid(fornecedores) {
  const grid = document.getElementById("fornecedores-grid");
  grid.innerHTML = ""; // Limpar o grid existente

  fornecedores.forEach((fornecedor) => {
    const fornecedorDiv = document.createElement("div");
    fornecedorDiv.classList.add("fornecedor");

    const imagem = document.createElement("img");
    imagem.src = "img/heineken.png";
    imagem.alt = "company profile picture";
    imagem.classList.add("company-logo");
    fornecedorDiv.appendChild(imagem);

    const companyInfoDiv = document.createElement("div");
    companyInfoDiv.classList.add("company-information");

    const companyName = document.createElement("p");
    companyName.classList.add("company-name");
    companyName.textContent = fornecedor.nome;
    companyInfoDiv.appendChild(companyName);

    const additionalInfoDiv = document.createElement("div");
    additionalInfoDiv.classList.add("additional-information");

    const companyEmail = document.createElement("p");
    companyEmail.classList.add("company-email");
    const emailSpan = document.createElement("span");
    emailSpan.classList.add("email");
    emailSpan.textContent = fornecedor.email;
    companyEmail.textContent = "E-mail: ";
    companyEmail.appendChild(emailSpan);
    additionalInfoDiv.appendChild(companyEmail);

    const companyCNPJ = document.createElement("p");
    companyCNPJ.classList.add("company-CNPJ");
    const cnpjSpan = document.createElement("span");
    cnpjSpan.classList.add("cnpj");
    cnpjSpan.textContent = fornecedor.cnpj;
    companyCNPJ.textContent = "CNPJ: ";
    companyCNPJ.appendChild(cnpjSpan);
    additionalInfoDiv.appendChild(companyCNPJ);

    companyInfoDiv.appendChild(additionalInfoDiv);
    fornecedorDiv.appendChild(companyInfoDiv);

    const visualizarButton = document.createElement("button");
    visualizarButton.classList.add("btn-visualizar-fornecedor");
    visualizarButton.textContent = "Visualizar";
    fornecedorDiv.appendChild(visualizarButton);

    grid.appendChild(fornecedorDiv);
  });
}

const grid = document.getElementById("fornecedores-grid");
function limparFornecedores() {
  grid.innerHTML = "";
}

function listaVazia() {
  const lista_vazia = document.createElement("p");
  lista_vazia.classList.add("nenhum-fornecedor");
  lista_vazia.textContent = "Nenhum fornecedor encontrado";
  if (grid.contains(lista_vazia)) return;
  grid.appendChild(lista_vazia);
}

function semFornecedores() {
  const vazio = document.createElement("p");
  vazio.classList.add("nenhum-fornecedor");
  vazio.textContent = "Nenhum fornecedor cadastrado";
  if (grid.contains(vazio)) return;
  grid.appendChild(vazio);
}

/*--- EVENT LISTENERS ---*/

/* abre tela de cadastro */
const btnAdicionar = document.getElementById("btn-adicionar");
const camadaSobreposicao = document.getElementById("camadaSobreposicao");
btnAdicionar.addEventListener("click", function (event) {
  const telaDeCadastro = document.getElementById("container-novo-fornecedor");

  telaDeCadastro.classList.remove("hidden");
  telaDeCadastro.classList.add("container-novo-fornecedor");
  camadaSobreposicao.classList.add("camadaSobreposicao");
});

/*limpa tela de cadastro */
const enderecoForm = document.getElementById("inscricao-endereco");
const emailForm = document.getElementById("inscricao-email");
const cnpjForm = document.getElementById("inscricao-cnpj");
const nomeForm = document.getElementById("inscricao-nome");
const telefoneForm = document.getElementById("inscricao-telefone");
function limpaCampos() {
  enderecoForm.value = "";
  emailForm.value = "";
  cnpjForm.value = "";
  nomeForm.value = "";
  telefoneForm.value = "";
}

/* fecha tela de cadastro com botao */
const btnFecharCadastro = document.getElementById("fechar-inscricao");
btnFecharCadastro.addEventListener("click", fechaCadastro);

/* função para fechar a tela de cadastro */
function fechaCadastro() {
  const telaDeCadastro = document.getElementById("container-novo-fornecedor");
  telaDeCadastro.classList.remove("container-novo-fornecedor");
  telaDeCadastro.classList.add("hidden");
  camadaSobreposicao.classList.remove("camadaSobreposicao");

  limpaCampos();
  buscarTodos();
}

/* seta imagem selecionada como backgroud-image */
const inputFile = document.getElementById("input-file");
const inputElement = document.getElementById("input-file-holder");
inputFile.addEventListener("change", function (event) {
  const file = event.target.files[0];
  const reader = new FileReader();

  reader.addEventListener("load", function () {
    const imageUrl = reader.result;
    inputElement.style.backgroundColor = "transparent";
    inputElement.style.backgroundImage = `url("${imageUrl}")`;
    inputElement.style.backgroundRepeat = "no-repeat";
  });

  if (file) {
    reader.readAsDataURL(file);
  }
});

// Função de buscar todos os fornecedores
window.addEventListener("load", buscarTodos);

const mainTitle = document.getElementById("main-title");
const searchBar = document.getElementById("search-input");
searchBar.addEventListener("keyup", function (event) {
  event.preventDefault();

  mainTitle.textContent = "Resultados";

  buscarFornecedores();
});

// evita que, ao usuário pressionar enter, uma nova aba seja aberta
const searchForm = document.getElementById("search-form");
searchForm.addEventListener("submit", function (event) {
  event.preventDefault();
});

const searchSelect = document.getElementById("search-select");
searchSelect.addEventListener("change", function (event) {
  event.preventDefault();

  buscarFornecedores();
});

/* ______REQUESTS______ */

function buscarFornecedores() {
  let searchSelect = document.getElementById("search-select").value;
  let searchFornecedor = document.getElementById("search-input").value;

  if (searchFornecedor == "") {
    buscarTodos();
    return;
  }

  let xhr = new XMLHttpRequest();

  xhr.open(
    "GET",
    `http://localhost:8080/fornecedores/search?search-select=
      ${searchSelect}&search-fornecedor=${searchFornecedor}`,
    true
  );

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      let fornecedores = JSON.parse(this.responseText);

      if (fornecedores.length == 0) {
        limparFornecedores();
        listaVazia();
      } else {
        atualizarGrid(fornecedores);
      }
    }
  };

  xhr.send();
}

function buscarTodos() {
  let xhr = new XMLHttpRequest();

  xhr.open("GET", `http://localhost:8080/fornecedores/all`, true);

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      let fornecedores = JSON.parse(this.responseText);

      if (fornecedores.length == 0) {
        limparFornecedores();
        semFornecedores();
        mainTitle.textContent = "Fornecedores Cadastrados";
      } else {
        atualizarGrid(fornecedores);
        mainTitle.textContent = "Fornecedores Cadastrados";
      }
    }
  };

  xhr.send();
}

const postForm = document.getElementById("inscricao-novo-fornecedor");

postForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const jsonBody = JSON.stringify({
    cnpj: cnpjForm.value,
    nome: nomeForm.value,
    endereço: enderecoForm.value,
    telefone: telefoneForm.value,
    email: emailForm.value,
  });

  console.log(jsonBody);

  const url = "http://localhost:8080/fornecedores/add";

  const xhr = new XMLHttpRequest();

  // Abre a conexão com o método POST
  xhr.open("POST", url, true);

  // Define o tipo de conteúdo da requisição como application/json
  xhr.setRequestHeader("Content-Type", "application/json");

  // Define a função de callback para o evento de conclusão da requisição
  xhr.onreadystatechange = function () {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      if (xhr.status === 200) {
        console.log("Requisição enviada com sucesso!");
      } else {
        console.error("Ocorreu um erro na requisição:", xhr.status);
      }
    }
  };

  fechaCadastro();

  // Envia a requisição com o corpo JSON
  xhr.send(jsonBody);
});

