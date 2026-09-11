const timeline = window.SHOT_TIMELINE;

const $ = (id) => document.getElementById(id);
const clamp = (n, min = 0, max = 1) => Math.min(max, Math.max(min, n));
const progressBetween = (time, start, end) => clamp((time - start) / (end - start));
const ease = (n) => n * n * (3 - 2 * n);
const visible = (element, opacity) => { element.style.opacity = clamp(opacity); };
const draw = (element, amount) => {
  const length = Number(element.dataset.length || 1);
  element.style.strokeDasharray = `${length}`;
  element.style.strokeDashoffset = `${length * (1 - clamp(amount))}`;
};

const ids = ["confined-liquid","liquid-contour","substrate","written-line","liquid-transfer-label","old-tip-circle","tip-size-label","tip-size-cross","new-gap-circle","gap-label","liquid-bridge-label","old-representation-group","old-kicker","old-single-tip","old-thinner-tip","old-arrow","old-frame","old-heading","old-group-cross","new-representation-group","new-frame","new-heading","new-question","final-statement"];
const el = Object.fromEntries(ids.map((id) => [id, $(id)]));
document.querySelectorAll(".draw").forEach((path) => { path.dataset.length = Math.ceil(path.getTotalLength()); });

function render(time) {
  const s5 = timeline.shot05, s6 = timeline.shot06;
  const liquid = ease(progressBetween(time, s5.liquidStart, s5.liquidEnd));
  visible(el["confined-liquid"], liquid * .82);
  draw(el["liquid-contour"], liquid);

  const oldFocus = progressBetween(time, s5.oldFocusStart, s5.oldCrossStart);
  draw(el["old-tip-circle"], oldFocus);
  visible(el["tip-size-label"], oldFocus * (1 - .76 * progressBetween(time, s5.oldFocusFadeStart, 8.3)) * (1 - progressBetween(time, 15.4, 16)));
  visible(el["old-tip-circle"], oldFocus * (1 - .72 * progressBetween(time, s5.oldCrossStart, s5.thinkingPauseStart)) * (1 - progressBetween(time, 15.4, 16)));
  el["tip-size-cross"].querySelectorAll(".draw").forEach((p, i) => draw(p, progressBetween(time, s5.oldCrossStart + i * .16, s5.oldCrossStart + .52 + i * .16)));
  visible(el["tip-size-cross"], 1 - progressBetween(time, 15.4, 16));

  draw(el["new-gap-circle"], progressBetween(time, s5.newGapCircleStart, s5.newGapCircleEnd));
  visible(el["new-gap-circle"], 1 - progressBetween(time, 15.4, 16));
  const gap = progressBetween(time, s5.gapLabelStart, s5.gapLabelEnd);
  visible(el["gap-label"], gap * (1 - .55 * progressBetween(time, s5.liquidEmphasisStart, s5.liquidBridgeStart)) * (1 - progressBetween(time, 15.4, 16)));
  draw(el["gap-label"].querySelector("path"), gap);
  const bridge = progressBetween(time, s5.liquidBridgeStart, 13.35);
  visible(el["liquid-bridge-label"], bridge * (1 - progressBetween(time, 15.4, 16)));
  draw($("liquid-pointer"), bridge);

  const substrate = progressBetween(time, s5.substrateStart, 14.25);
  draw(el.substrate, substrate); draw(el["written-line"], progressBetween(time, 14.15, 15));
  visible(el["liquid-transfer-label"], progressBetween(time, 14.55, 15) * (1 - progressBetween(time, 15.15, 15.4)));

  const move = ease(progressBetween(time, s6.moveStructureStart, s6.moveStructureEnd));
  $("hair-structure").setAttribute("transform", `translate(${510 * move} ${65 * move}) scale(${1 - .28 * move})`);
  const replay = time >= s6.transferReplayStart && time < s6.settleStart ? Math.sin(progressBetween(time, s6.transferReplayStart, s6.settleStart) * Math.PI) : 0;
  el["confined-liquid"].style.fill = replay ? `rgb(${169 - 16 * replay},${220 - 8 * replay},${232})` : "";
  if (time >= 15) draw(el["written-line"], .78 + .22 * progressBetween(time, s6.transferReplayStart + .2, s6.settleStart));

  visible(el["old-representation-group"], progressBetween(time, s6.oldTipStart, s6.oldTipStart + .3));
  visible(el["old-kicker"], progressBetween(time, s6.oldTipStart, s6.oldTipStart + .45));
  draw(el["old-single-tip"], progressBetween(time, s6.oldTipStart, 17));
  draw(el["old-thinner-tip"], progressBetween(time, s6.oldThinnerTipStart, 17.55));
  draw(el["old-arrow"], progressBetween(time, s6.oldThinnerTipStart + .15, 17.7));
  draw(el["old-frame"], progressBetween(time, s6.oldFrameStart, 18.3));
  visible(el["old-heading"], progressBetween(time, s6.oldTitleStart, 18.8));
  el["old-group-cross"].querySelectorAll(".draw").forEach((p, i) => draw(p, progressBetween(time, s6.oldCrossStart + i * .12, 19.35 + i * .12)));
  el["old-representation-group"].style.opacity = `${progressBetween(time, s6.oldTipStart, s6.oldTipStart + .3) * (1 - .65 * progressBetween(time, s6.oldCrossStart, s6.comparisonPauseStart))}`;

  visible(el["new-representation-group"], progressBetween(time, s6.newFrameStart, s6.newFrameStart + .1));
  draw(el["new-frame"], progressBetween(time, s6.newFrameStart, s6.newTitleStart));
  visible(el["new-heading"], progressBetween(time, s6.newTitleStart, s6.newTitleStart + .8));
  visible(el["new-question"], progressBetween(time, s6.newQuestionStart, s6.newQuestionStart + .8));
  visible(el["final-statement"], time >= s6.finalHoldStart ? 1 : 0);

  const subtitle = timeline.subtitles.find(([start, end]) => time >= start && time < end)?.[2] || timeline.subtitles.at(-1)[2];
  $("subtitle-text").textContent = subtitle;
  $("corner-note").textContent = time < s6.start
    ? "SHOT 05 · NOTICE THE SPACE BETWEEN TWO HAIRS"
    : "SHOT 06 · A NEW WAY TO LOOK AT THE PROBLEM";
  $("progress").value = time;
  $("timecode").value = `00:${String(Math.floor(time)).padStart(2,"0")} / 00:25`;
}

let currentTime = 0, playing = !matchMedia("(prefers-reduced-motion: reduce)").matches, previous = performance.now();
function frame(now) {
  if (playing) {
    currentTime += (now - previous) / 1000;
    if (currentTime >= timeline.duration) { currentTime = timeline.duration; playing = false; }
  }
  previous = now; render(currentTime); $("play-pause").textContent = playing ? "Pause" : "Play";
  requestAnimationFrame(frame);
}
function togglePlay() { if (currentTime >= timeline.duration) currentTime = 0; playing = !playing; previous = performance.now(); }
$("play-pause").addEventListener("click", togglePlay);
$("replay").addEventListener("click", () => { currentTime = 0; playing = true; previous = performance.now(); });
$("progress").addEventListener("input", (event) => { currentTime = Number(event.target.value); playing = false; render(currentTime); });
addEventListener("keydown", (event) => {
  if (event.code === "Space") { event.preventDefault(); togglePlay(); }
  if (event.code === "Home") { currentTime = 0; playing = false; }
  if (event.code === "ArrowRight") { currentTime = Math.min(25, currentTime + .5); playing = false; }
  if (event.code === "ArrowLeft") { currentTime = Math.max(0, currentTime - .5); playing = false; }
});
render(0); requestAnimationFrame(frame);
