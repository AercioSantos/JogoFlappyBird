console.log('[DevSoutinho] Flappy Bird');

const sprites = new Image();
sprites.src = './sprites.png';

const canvas = document.querySelector('canvas');
const contexto = canvas.getContext('2d');

//[background]
const planoFundo = {
  spriteX: 390,
  spriteY: 0,
  largura: 275,
  altura: 204,
  x: 0,
  y: canvas.height - 204,

  desenha(){
    contexto.fillStyle = '#70c5ce';
    contexto.fillRect(0,0, canvas.width, canvas.height);

    contexto.drawImage(
      sprites,
      planoFundo.spriteX, planoFundo.spriteY,
      planoFundo.largura, planoFundo.altura,
      planoFundo.x, planoFundo.y,
      planoFundo.largura, planoFundo.altura,
    );

    contexto.drawImage(
      sprites,
      planoFundo.spriteX, planoFundo.spriteY,
      planoFundo.largura, planoFundo.altura,
      (planoFundo.x + planoFundo.largura), planoFundo.y,
      planoFundo.largura, planoFundo.altura,
    );

  }
}

//[chao]
const chao = {
  spriteX: 0,
  spriteY: 610,
  largura: 224,
  altura: 112,
  x: 0,
  y: canvas.height - 112,

  desenha(){
    contexto.drawImage(
      sprites,
      chao.spriteX, chao.spriteY,
      chao.largura, chao.altura,
      chao.x, chao.y,
      chao.largura, chao.altura,
    );

    contexto.drawImage(
      sprites,
      chao.spriteX, chao.spriteY,
      chao.largura, chao.altura,
      (chao.x + chao.largura), chao.y,
      chao.largura, chao.altura,
    );
  }
}

function fazColisao(flappyBird, chao){
  const flappyBirdY = flappyBird.y + flappyBird.altura;
  const chaoY = chao.y;

  if(flappyBirdY >= chaoY){
    return true;
  }

  return false;
}

function criaFlappyBird(){

  const flappyBird = {
    spriteX: 0,
    spriteY: 0,
    largura: 33,
    altura: 24,
    x: 10,
    y: 50,
    gravidade: 0.25,
    velocidade: 0,
    pulo: 4.6,
  
    pula(){
      console.log("Devo pular");
      console.log('[antes]', flappyBird.velocidade);
      flappyBird.velocidade = - flappyBird.pulo;
      console.log('[depois]', flappyBird.velocidade);
    },
  
    atualiza(){
      if(fazColisao(flappyBird, chao)){
        console.log('Fez colisão');
  
        mudaParaTela(Telas.INICIO);
        return;
      }
      flappyBird.velocidade = flappyBird.velocidade + flappyBird.gravidade;
      
      flappyBird.y = flappyBird.y + flappyBird.velocidade;
    },
  
    desenha(){
      contexto.drawImage(
        sprites,
        flappyBird.spriteX, flappyBird.spriteY,  
        flappyBird.largura, flappyBird.altura, 
        flappyBird.x, flappyBird.y, 
        flappyBird.largura, flappyBird.altura,
      );
    }
  }
  return flappyBird;
}


//[mensagemGetReady]
const mensagemInicial = {
  spriteX: 134,
  spriteY: 0,
  largura: 174,
  altura: 152,
  x: (canvas.width / 2) - 174 / 2,
  y: 50,

  desenha(){
    contexto.drawImage(
      sprites,
      mensagemInicial.spriteX, mensagemInicial.spriteY,
      mensagemInicial.largura, mensagemInicial.altura,
      mensagemInicial.x, mensagemInicial.y,
      mensagemInicial.largura, mensagemInicial.altura,
    );
  }
}

//
// [Telas]
//
const globais = {};
let telaAtiva = {}
function mudaParaTela(novaTela){
  telaAtiva = novaTela;

  if(telaAtiva.inicializa){
    telaAtiva.inicializa();
  }
}

const Telas = {
  INICIO: {
    inicializa(){
      globais.flappyBird = criaFlappyBird();
    },

    desenha(){
      planoFundo.desenha();
      chao.desenha();
      globais.flappyBird.desenha();
      mensagemInicial.desenha();
    },

    click(){
      mudaParaTela(Telas.JOGO);
    },

    atualiza(){

    }

  }
};

Telas.JOGO = {
  desenha(){
    planoFundo.desenha();
    chao.desenha();
    globais.flappyBird.desenha();
  },

  click(){
    globais.flappyBird.pula();
  },

  atualiza(){
    globais.flappyBird.atualiza();
  }
}


function loop(){

  telaAtiva.desenha();
  telaAtiva.atualiza();
  

  requestAnimationFrame(loop);
}


window.addEventListener('click', function(){
  if(telaAtiva.click){
    telaAtiva.click();
  }
});

mudaParaTela(Telas.INICIO);
loop();