let expressao = ""
let limparProxClique = false

const botoes = document.querySelectorAll('button');

botoes.forEach(btn => {
    btn.addEventListener('click', e => {
        let valor = e.target.value;
        alert(valor);
    })
});