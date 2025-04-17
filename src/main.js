// Código para gerar grades horárias para o curso de Sistemas para Internet
// Avaliação da quantidade de conflitos de cada grade horária gerada

function gerarDisciplinas() {
  const disciplinas = [];
  const totalDisciplinas = 25;
  const totalPeriodos = 5;
  const totalProfessores = 10;

  for (let i = 0; i < totalDisciplinas; i++) {
    const periodo = Math.floor(i / 5);
    const professor = i % totalProfessores;
    disciplinas.push({
      sigla: `D${i.toString().padStart(2, "0")}`,
      professor: `P${professor.toString().padStart(2, "0")}`,
      periodo: periodo,
    });
  }

  return disciplinas;
}

function embaralhar(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function popInicial(disciplinas, linhas = 50, colunas = 100) {
  const populacao = [];

  for (let i = 0; i < linhas; i++) {
    const individuo = Array(colunas).fill(null);

    for (let periodo = 0; periodo < 5; periodo++) {
      const disciplinasDoPeriodo = disciplinas.filter(d => d.periodo === periodo);
      const disciplinasEmbaralhadas = embaralhar(disciplinasDoPeriodo);

      disciplinasEmbaralhadas.forEach((disciplina) => {
        let alocados = 0;
        const horariosDisponiveis = [];

        for (let j = 0; j < colunas; j++) {
          if (Math.floor(j / 20) === periodo && individuo[j] === null) {
            horariosDisponiveis.push(j);
          }
        }

        const horariosEmbaralhados = embaralhar(horariosDisponiveis);

        for (const horario of horariosEmbaralhados) {
          if (alocados < 4) {
            individuo[horario] = `${disciplina.sigla} ${disciplina.professor}`;
            alocados++;
          } else {
            break;
          }
        }
      });
    }

    populacao.push(individuo);
  }

  return populacao;
}

function avaliacao(grade) {
  let conflitos = 0;

  for (let dia = 0; dia < 5; dia++) {
    for (let horario = 0; horario < 4; horario++) {
      const professoresNesseHorario = new Set();

      for (let periodo = 0; periodo < 5; periodo++) {
        const idx = periodo * 20 + dia * 4 + horario;
        const celula = grade[idx];

        if (celula) {
          const professor = celula.split(" ")[1];
          if (professoresNesseHorario.has(professor)) {
            conflitos++;
          } else {
            professoresNesseHorario.add(professor);
          }
        }
      }
    }
  }

  return conflitos;
}

function renderizarGrade(populacao) {
  const app = document.getElementById("app");
  const conflitosDiv = document.getElementById("conflitos");

  app.innerHTML = "";
  conflitosDiv.innerHTML = "";

  const conflitosArray = populacao.map(individuo => avaliacao(individuo));
  conflitosDiv.textContent = "Conflitos por indivíduo: " + JSON.stringify(conflitosArray);

  const tabela = document.createElement("table");

  const trPeriodos = document.createElement("tr");
  const thVazio1 = document.createElement("th");
  thVazio1.rowSpan = 2;
  thVazio1.textContent = "#";
  trPeriodos.appendChild(thVazio1);

  for (let i = 0; i < 5; i++) {
    const th = document.createElement("th");
    th.colSpan = 20;
    th.textContent = `Período ${i + 1}`;
    trPeriodos.appendChild(th);
  }
  tabela.appendChild(trPeriodos);

  const trHorarios = document.createElement("tr");
  for (let i = 0; i < 100; i++) {
    const th = document.createElement("th");
    const dia = ["Seg", "Ter", "Qua", "Qui", "Sex"][Math.floor((i % 20) / 4)];
    const horario = (i % 4) + 1;
    th.textContent = `${dia} H${horario}`;
    trHorarios.appendChild(th);
  }
  tabela.appendChild(trHorarios);

  populacao.forEach((linha, idx) => {
    const tr = document.createElement("tr");

    const thLinha = document.createElement("th");
    thLinha.textContent = `${idx + 1}`;
    tr.appendChild(thLinha);

    linha.forEach((celula) => {
      const td = document.createElement("td");
      td.textContent = celula || "";
      tr.appendChild(td);
    });

    tabela.appendChild(tr);
  });

  app.appendChild(tabela);
}

// Execução
const disciplinas = gerarDisciplinas();
const populacao = popInicial(disciplinas);
renderizarGrade(populacao);
