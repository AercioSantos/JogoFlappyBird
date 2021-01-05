console.log('[DevSoutinho] Flappy Bird');

let frames = 0;

const som_HIT = new Audio();
som_HIT.src = './efeitos/hit.wav';

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
function criaChao(){
  const chao = {
    spriteX: 0,
    spriteY: 610,
    largura: 224,
    altura: 112,
    x: 0,
    y: canvas.height - 112,
    atualiza(){
      const movimentoDoChao = 1;
      const repeteEm = chao.largura / 2;
      const movimentacao = chao.x - movimentoDoChao;

      //console.log("[chao.x]", chao.x);
      //console.log("[repeteEm]", repeteEm);
      //console.log("[Movimentacao]", movimentacao % repeteEm);
      chao.x = movimentacao % repeteEm;
    },
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
  return chao;
};

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
      if(fazColisao(flappyBird, globais.chao)){
        console.log('Fez colisão');
        som_HIT.play();

        setTimeout(()=>{
          mudaParaTela(Telas.INICIO);

        }, 500);
        
        return;
      }

      flappyBird.velocidade = flappyBird.velocidade + flappyBird.gravidade;
      flappyBird.y = flappyBird.y + flappyBird.velocidade;
    },
    movimentos: [
      {spriteX: 0, spriteY: 0, }, // asa pra cima
      {spriteX: 0, spriteY: 26, }, // asa no meio
      {spriteX: 0, spriteY: 52, }, // asa pra baixo
      {spriteX: 0, spriteY: 26, }, // asa no meio
    ],
    frameAtual: 0,
    atualizaOFrameAtual(){
      const intervaloDeFrames = 10;
      const passouOIntervalo = frames % intervaloDeFrames === 0;

      if(passouOIntervalo){
        const baseDoIncremento = 1;
        const incremento = baseDoIncremento + flappyBird.frameAtual;
        const baseRepeticao = flappyBird.movimentos.length;
        flappyBird.frameAtual = incremento % baseRepeticao;
      }
      
    },
    desenha(){
      flappyBird.atualizaOFrameAtual();
      const { spriteX, spriteY } = flappyBird.movimentos[flappyBird.frameAtual];
      contexto.drawImage(
        sprites,
        spriteX, spriteY,  
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
      globais.chao = criaChao();
    },

    desenha(){
      planoFundo.desenha();
      globais.chao.desenha();
      globais.flappyBird.desenha();
      mensagemInicial.desenha();
    },

    click(){
      mudaParaTela(Telas.JOGO);
    },

    atualiza(){
      globais.chao.atualiza();
    }

  }
};

Telas.JOGO = {
  desenha(){
    planoFundo.desenha();
    globais.chao.desenha();
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
  

  frames = frames + 1;
  requestAnimationFrame(loop);
}


window.addEventListener('click', function(){
  if(telaAtiva.click){
    telaAtiva.click();
  }
});

mudaParaTela(Telas.INICIO);
loop();