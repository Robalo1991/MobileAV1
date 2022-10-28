# Aspectos de configuração

1. Criar uma conta no GitHub

- Gerenciamento da Configuração:
  - versionamento
  - visões individuais do projeto (check in/chech out)

2. Criar uma conta no Glitch.me

- Login usando a conta do GitHub

3. New Project --> Opção glitch-hello-website

4. Para trocar o nome: [Settings][edit details][Edit Details] (novamente)

MOCK-UP: Protótipo/Desenho/Proposta Tela

# Como fazer o Upload de um arquivo para o projeto

1. [Assets][upload]
2. Clicar no arquivo (Asset) e copiar a URL
3. Abrir o [Terminal]
4. Efetuar o download com:
   $ wget -colar a url- (irá fazer download do arquivo para a área do projeto)
   para renomear:
5. Renomear o arquivo
   $ mv -nome estranho- -novo nome-

# Padrão para nomes

divXXX - para divs <br/>
tfXXX - para inputs de texto <br/>
btXXX - para botões <br/>


# Conceitos de JavaScript

# Primeiro Exemplo com o uso de Javascript

* Como criar uma classe em Javascript
* Como instanciar objetos em Javascript
* Como enviar mensagens para objetos

___Não deixe a matéria acumular!___

* A Classe define a interface (especificação) de seus objetos. 
* A interface de um objeto apresenta atributos e métodos.
* Em Javascript, não precisamos formalmente declarar os atributos (como em Java, p.ex.). Basta usá-los com 'this'
que o atributo será adicionado ao objeto.
* O primeiro método que devemos criar em uma classe Javascript é o método construtor. Ele é executado pelo 
próprio objeto assim que ele é criado (usando o operador new).
* Nos métodos, sempre que quisermos fazer referência ao objetos que estiver executando o método, vamos usar a 
palavra reservada 'this'

* O operador new tem a missão de ___criar um novo objeto___. Para isso, ele irá fazer duas coisas:
  - Alocará memória para o novo objeto na Heap
  - Solicitará ao novo objeto que execute o método construtor definido em sua classe.

* Em Javascript, String é um tipo primitivo (diferentemente de Java) e uma literal String pode ser expressa
usando aspas ou aspas simples. Ex: "Javascript"  'Sou uma String'

* Para criarmos variáveis, devemos usar as palavras reservadas 'let' ou 'var'. Em funções e métodos, para criar 
variáveis locais usamos 'let'. Para variáveis com escopo de todo o arquivo, usamos 'var'. O uso de 'let' e 'var'
só se torna obrigatório se no início do arquivo colocamos a indicação 'use strict'.

* Toda vez que tivermos a estrutura [REF].<msg>(<param>); ou seja, um termo entre
  ponto e abre parênteses, isso caracteriza um envio de mensagem. Essa mensagem 
  será enviada ao objeto referenciado pela variável indicada à frente do ponto. 
  Dessa forma, o objeto irá executar o método com o mesmo nome da mensagem.