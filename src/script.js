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

function calcular_postfix(tokens_postfix) {
    let pilha = [];
    
    for (let token of tokens_postfix) {
        if (!isNaN(token)) {
            pilha.push(parseFloat(token))
        }
            elif token == "π":
                pilha.append(math.pi)
            elif token == "e":
                pilha.append(math.e)
            elif token in ["+", "-", "×", "÷", "^"]:
                if len(pilha) < 2: return "Erro"
                
                num2 = pilha.pop()
                num1 = pilha.pop()
                
                if token == "+": pilha.append(num1 + num2)
                elif token == "-": pilha.append(num1 - num2)
                elif token == "×": pilha.append(num1 * num2)
                elif token == "÷":
                    if num2 == 0: return "Erro"
                    pilha.append(num1 / num2)
                elif token == "^": pilha.append(num1 ** num2)
            elif token in ["sin", "cos", "tan", "log", "ln", "√", "!", "%"]:
                if len(pilha) < 1: return "Erro"
                
                num = pilha.pop()
                
                if token == "√":
                    if num < 0: return "Erro"
                    pilha.append(math.sqrt(num))
                elif token == "sin": pilha.append(math.sin(math.radians(num)))
                elif token == "cos": pilha.append(math.cos(math.radians(num)))
                elif token == "tan": pilha.append(math.tan(math.radians(num)))
                elif token == "log":
                    if num <= 0: return "Erro"
                    pilha.append(math.log10(num))
                elif token == "ln":
                    if num <= 0: return "Erro"
                    pilha.append(math.log(num))
                elif token == "!":
                    if num < 0 or not num.is_integer(): return "Erro"
                    pilha.append(math.factorial(int(num)))
                elif token == "%": pilha.append(num / 100)
    }
}