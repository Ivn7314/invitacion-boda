"use strict";

const fechaTexto = document.body.dataset.fecha;
const fechaEvento = new Date(fechaTexto).getTime();

const dias = document.getElementById("dias");
const horas = document.getElementById("horas");
const minutos = document.getElementById("minutos");
const segundos = document.getElementById("segundos");
const fechaVisible = document.getElementById("fechaVisible");

// Mostrar la fecha formateada en pantalla automáticamente
if (fechaVisible && fechaTexto) {
  const fechaObj = new Date(fechaTexto);
  const opciones = { day: "numeric", month: "long", year: "numeric" };
  fechaVisible.textContent = fechaObj
    .toLocaleDateString("es-ES", opciones)
    .toUpperCase();
}

function actualizarContador() {
  const ahora = Date.now();
  const diferencia = fechaEvento - ahora;

  if (diferencia <= 0) {
    dias.textContent = "00";
    horas.textContent = "00";
    minutos.textContent = "00";
    segundos.textContent = "00";
    return;
  }

  const d = Math.floor(diferencia / (1000 * 60 * 60 * 24));
  const h = Math.floor((diferencia / (1000 * 60 * 60)) % 24);
  const m = Math.floor((diferencia / (1000 * 60)) % 60);
  const s = Math.floor((diferencia / 1000) % 60);

  dias.textContent = String(d).padStart(2, "0");
  horas.textContent = String(h).padStart(2, "0");
  minutos.textContent = String(m).padStart(2, "0");
  segundos.textContent = String(s).padStart(2, "0");
}

actualizarContador();
setInterval(actualizarContador, 1000);

// --- REPRODUCTOR DE AUDIO (Limitado a 10 segundos) ---
const audio = document.getElementById("audio");
const play = document.getElementById("play");
const retroceder = document.getElementById("retroceder");
const adelantar = document.getElementById("adelantar");
const progreso = document.getElementById("progreso");

const TIEMPO_INICIO = 0;
const TIEMPO_FIN = 50; // Límite exacto de los 10 segundos

play.addEventListener("click", async () => {
  if (audio.paused) {
    try {
      // Si el audio está al inicio o ya pasó de los 10s, lo regresamos al inicio
      if (
        audio.currentTime < TIEMPO_INICIO ||
        audio.currentTime >= TIEMPO_FIN
      ) {
        audio.currentTime = TIEMPO_INICIO;
      }
      await audio.play();
      play.textContent = "❚❚";
    } catch {
      console.log("No se pudo reproducir el audio.");
    }
  } else {
    audio.pause();
    play.textContent = "▶";
  }
});

retroceder.addEventListener("click", () => {
  audio.currentTime = Math.max(TIEMPO_INICIO, audio.currentTime - 3);
});

adelantar.addEventListener("click", () => {
  audio.currentTime = Math.min(TIEMPO_FIN, audio.currentTime + 3);
});

// Control estricto para que se detenga exactamente a los 10 segundos y actualice la barra
audio.addEventListener("timeupdate", () => {
  if (audio.currentTime >= TIEMPO_FIN) {
    audio.pause();
    audio.currentTime = TIEMPO_INICIO;
    play.textContent = "▶";
  }

  const duracionFragmento = TIEMPO_FIN - TIEMPO_INICIO;
  const tiempoActualRelativo = audio.currentTime - TIEMPO_INICIO;

  if (duracionFragmento > 0) {
    progreso.value = (tiempoActualRelativo / duracionFragmento) * 100;
  }
});

progreso.addEventListener("input", () => {
  const duracionFragmento = TIEMPO_FIN - TIEMPO_INICIO;
  audio.currentTime =
    TIEMPO_INICIO + (progreso.value / 100) * duracionFragmento;
});

audio.addEventListener("ended", () => {
  play.textContent = "▶";
  progreso.value = 0;
  audio.currentTime = TIEMPO_INICIO;
});
