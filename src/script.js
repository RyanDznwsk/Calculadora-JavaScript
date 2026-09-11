let expressao = "";
let limparProxClique = false;

let visor = document.getElementById('visor');
visor.textContent = "";

const botoes = document.querySelectorAll('button');

botoes.forEach(btn => {
    btn.addEventListener('click', e => {
        let valor = e.currentTarget.value;
        cliqueBotao(valor);
    })
});

function cliqueBotao(valor) {
    if (valor === "clear") {
        expressao = "";
        limparProxClique = false;
        visor.textContent = "";
    } else if (valor === "backspace") {
        expressao = expressao.slice(0, -1);
        visor.textContent = expressao;
    } else if (valor === "equal") {
        let tokens = tokenizar(expressao);
        let postfix = infixToPostfix(tokens);
        alert("Postfix: " + postfix);
    } else {
        const operadoresContinuidade = ["+", "-", "×", "÷", "^", "%", "!"]
        if (limparProxClique && !operadoresContinuidade.includes(valor)) {
            expressao = valor;
        } else {
            if (expressao && operadoresContinuidade.includes(valor)) {
                let ultimoChar = expressao.slice(-1);
                if (operadoresContinuidade.includes(ultimoChar)) {
                    expressao = expressao.slice(0, -1) + valor;
                } else {
                    expressao += valor;
                }
            } else {
                expressao += valor;
            }
        }
        limparProxClique = false;
        visor.textContent = expressao;
    }
}

function tokenizar(expressaoTexto) {
    let tokens = [];
    let numeroAtual = "";
    let operadores = ["+", "-", "×", "÷", "^", "!", "%", "(", ")", "π", "e"];
    let funcoes = ["sin", "cos", "tan", "log", "ln", "√"];

    let i = 0;
    while (i < expressao.length) {
        let char = expressaoTexto[i];
        if ((char >= '0' && char <= '9') || char === ".") {
            numeroAtual += char;
            i++;
        } else {
            if (numeroAtual) {
                tokens.push(numeroAtual);
                numeroAtual = "";
            }
            let funcaoEncontrada = false;
            for (let f of funcoes) {
                if (expressaoTexto.substring(i).startsWith(f)) {
                    tokens.push(f);
                    i += f.length;
                    funcaoEncontrada = true;
                    break;
                }
            }
            if (funcaoEncontrada) {
                continue;
            }
            if (operadores.includes(char)) {
                tokens.push(char);
                i++;
            } else {
                i++;
            }
        }
    }
    if (numeroAtual) {
        tokens.push(numeroAtual);
    }
    return tokens;
}

function infixToPostfix(tokens) {
    const precedencia = {
        "+": 1, "-": 1,
        "×": 2, "÷": 2,
        "^": 3, "sin": 3, "cos": 3, "tan": 3, "log": 3, "ln": 3, "√": 3, "!": 3, "%": 3
    }
    saida = [];
    pilha = [];

    for (let token of tokens) {
        if (!isNaN(token) || token === "π" || token === "e") {
            saida.push(token);
        } else if (["sin", "cos", "tan", "log", "ln", "√", "("].includes(token)) {
            pilha.push(token);
        } else if (token === ")") {
            while (pilha.length > 0 && pilha[pilha.length - 1] !== "(") {
                saida.push(pilha.pop());
            }
            if (pilha.length > 0 && pilha[pilha.length - 1] === "(") {
                pilha.pop();
            }
            if (pilha.length > 0 && ["sin", "cos", "tan", "log", "ln", "√"].includes(pilha[pilha.length - 1])) {
                saida.push(pilha.pop());
            }
        } else if (token in precedencia) {
            while (pilha.lenght > 0 && pilha[pilha.length - 1] !== "(" && precedencia[pilha[pilha.lenght - 1]] >= precedencia[token]) {
                saida.push(pilha.pop());
            }
            pilha.push(token);
        }
    }
    while (pilha.length > 0) {
        saida.push(pilha.pop());
    }
    return saida;
}

function calcularPostfix(tokensPostfix) {
    let pilha = [];

    const factorial = (n) => {
        if (n < 0 || !Number.isInteger(n)) return "Erro";
        if (n === 0 || n === 1) return 1;
        let resultado = 1;
        for (let i = 2; i <= n; i++) resultado *= i;
        return resultado;
    }
    
    for (let token of tokensPostfix) {
        if (!isNaN(token)) {
            pilha.push(parseFloat(token))
        } else if (token === "π") {
            pilha.push(Math.PI);
        } else if (token === "e") {
            pilha.push(Math.E);
        } else if (["+", "-", "×", "÷", "^"].includes(token)) {
            if (pilha.length < 2) return "Erro";
            let num2 = pilha.pop();
            let num1 = pilha.pop();
            
            if (token === "+") pilha.push(num1 + num2);
            else if (token === "-") pilha.push(num1 - num2);
            else if (token === "×") pilha.push(num1 * num2);
            else if (token === "÷") {
                if (num2 == 0) return "Erro";
                pilha.push(num1 / num2);
            } else if (token === "^") pilha.push(Math.pow(num1, num2));
        } else if (["sin", "cos", "tan", "log", "ln", "√", "!", "%"].includes(token)) {
            if (pilha.length < 1) return "Erro";
            let num = pilha.pop()
                
            if (token === "√") {
                if (num < 0) return "Erro";
                pilha.push(Math.sqrt(num));
            } else if (token === "sin") pilha.push(Math.sin(num * (Math.PI / 180)));
            else if (token === "cos") pilha.push(Math.cos(num * (Math.PI / 180)));
            else if (token === "tan") pilha.push(math.tan(num * (Math.PI / 180)));
            else if (token === "log") {
                if (num <= 0) return "Erro";
                pilha.push(Math.log10(num));
            } else if (token === "ln") {
                if (num <= 0) { return "Erro" }
                pilha.push(Math.log(num));
            } else if (token === "!") {
                let resFatorial = fatorial(num);
                if (resFatorial === "Erro") return "Erro";
                pilha.push(resFatorial);
            } else if (token === "%") pilha.push(num / 100);
        }
    }
    if (pilha.length === 1) {
        let resultado = pilha[0];
        if (isNaN(resultado) || !isFinite(resultado)) return "Erro";
        if (Number.isInteger(resultado)) return resultado;
        return parseFloat(resultado.toFixed(6));
    }
    return "Erro";
}