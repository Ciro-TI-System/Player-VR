// cria uma tag script
var tag = document.createElement("script");

// busca api e insere um src
tag.src = "https://www.youtube.com/iframe_api";

// coloca a 1º tag script do código antes da tag script criada acima
var firstScriptTag = document.getElementsByTagName("script")[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// Criação do iframes
let video;

let ambientLight;
// variável de controle

let animationEnded = false;

const videoId = "qC0vDKVPCrw";

// 2º frame (abaixo)
function createAmbientLight() {
  if (!animationEnded) return;

  ambientLight = new YT.Player("ambient-light", {
    videoId,
    events: {
      /* 1º ajuste: vídeo mutado */
      onReady: ambientLightReady,
      /* mudança de estado */
      onStateChange: ambientStateChange,
    },
  });
}

// 1º frame (acima)
window.onYouTubeIframeAPIReady = function () {
  video = new YT.Player("video", {
    videoId,
    events: {
      /* quando mudar o estado do vídeo */
      onStateChange: videoStateChange,
    },
  });
};

// Controle dos vídeos
function videoStateChange(event) {
  switch (event.data) {
    case YT.PlayerState.PLAYING:
      if (!ambientLight) return;
      // coloca o vídeo de baixo no msm tempo q o vídeo principal!
      ambientLight.seekTo(event.target.getCurrentTime());
      // play no vídeo secundário
      ambientLight.playVideo();
      break;

    case YT.PlayerState.PAUSED:
      if (!ambientLight) return;
      ambientLight.seekTo(event.target.getCurrentTime());
      ambientLight.pauseVideo();
      break;
  }
}

function betterAmbientLight(event) {
  /* comando video mute */
  event.target.mute();

  const qualityLevels = event.target.getAvailableQualityLevels();
  if (qualityLevels && qualityLevels.length && qualityLevels.length > 0) {
    /* garante que buscará o menor index independente do nível de qualidade que existir */
    qualityLevels.reverse();
    const lowestLevel =
      qualityLevels[qualityLevels.findIndex((q) => q !== "auto")];

    event.target.setPlaybackQuality(lowestLevel);
  }
}

// Quando vídeo secundário estiver pronto
function ambientLightReady(event) {
  betterAmbientLight(event);
}

function ambientStateChange(event) {
  switch (event.data) {
    case YT.PlayerState.BUFFERING:
    case YT.PlayerState.PLAYING:
      betterAmbientLight(event);
      break;
  }
}

//Colocando o vídeo secundário na página
// pegando div "app"
const app = document.querySelector("#app");
/* quando a animação acabar, executa a função */
app.addEventListener("animationend", (e) => {
  if (e.animationName !== "appear") return;

  animationEnded = true;
  createAmbientLight();
});
