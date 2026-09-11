const timeline = window.SHOT_TIMELINE;
const tuning = window.SHOT_TUNING;

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

const transform = ({ x, y, scale }) => `translate(${x} ${y}) scale(${scale})`;
const sketchFrame = ({ x, y, width, height }) =>
  `M${x} ${y + 9} C${x + width * .33} ${y},${x + width * .66} ${y + 5},${x + width - 6} ${y + 11} ` +
  `L${x + width} ${y + height - 9} C${x + width * .66} ${y + height},${x + width * .33} ${y + height - 4},${x} ${y + height - 11}Z`;
const setTextPosition = (id, x, y) => { $(id).setAttribute("x", x); $(id).setAttribute("y", y); };

function applyTuning() {
  const { layout, typography, emphasis } = tuning;
  const root = document.documentElement.style;
  Object.entries({
    "--concept-size": typography.conceptLabel + "px", "--title-size": typography.title + "px",
    "--question-size": typography.question + "px", "--new-question-size": typography.newQuestion + "px",
    "--subtitle-size": typography.subtitle + "px", "--cn-label-size": typography.chineseLabel + "px",
    "--secondary-size": typography.secondaryLabel + "px", "--circle-stroke": emphasis.circleStrokeWidth,
    "--frame-stroke": emphasis.frameStrokeWidth, "--cross-stroke": emphasis.crossOutStrokeWidth,
    "--secondary-opacity": emphasis.secondaryLabelOpacity
  }).forEach(([name, value]) => root.setProperty(name, value));

  $("scientific-scene").setAttribute("transform", transform(layout.shot05.scene));
  $("old-representation-group").setAttribute("transform", transform(layout.shot06.oldGroup));
  $("old-diagram").setAttribute("transform", transform(layout.shot06.oldDiagram));
  $("old-frame").setAttribute("d", sketchFrame(layout.shot06.oldFrame));
  const oldFrame = layout.shot06.oldFrame, inset = layout.shot06.oldCrossInset;
  const oldCross = $("old-group-cross").querySelectorAll("path");
  oldCross[0].setAttribute("d", `M${oldFrame.x + inset.x} ${oldFrame.y + inset.y}L${oldFrame.x + oldFrame.width - inset.x} ${oldFrame.y + oldFrame.height - inset.y}`);
  oldCross[1].setAttribute("d", `M${oldFrame.x + oldFrame.width - inset.x} ${oldFrame.y + inset.y}L${oldFrame.x + inset.x} ${oldFrame.y + oldFrame.height - inset.y}`);
  setTextPosition("old-kicker", layout.shot06.oldKicker.x, layout.shot06.oldKicker.y);
  setTextPosition("old-title", layout.shot06.oldTitle.x, layout.shot06.oldTitle.y);
  setTextPosition("old-title-cn", layout.shot06.oldTitle.chineseX, layout.shot06.oldTitle.chineseY);
  setTextPosition("old-question", layout.shot06.oldQuestion.x, layout.shot06.oldQuestion.y);
  $("new-frame").setAttribute("d", sketchFrame(layout.shot06.newFrame));
  setTextPosition("new-title", layout.shot06.newTitle.x, layout.shot06.newTitle.y);
  setTextPosition("new-title-cn", layout.shot06.newTitle.x, layout.shot06.newTitle.chineseY);
  setTextPosition("new-question", layout.shot06.newQuestion.x, layout.shot06.newQuestion.y);
  $("new-question").querySelectorAll("tspan").forEach((line, index) => {
    line.setAttribute("x", layout.shot06.newQuestion.x);
    line.setAttribute("dy", index ? layout.shot06.newQuestion.lineGap : 0);
  });
  setTextPosition("final-statement", layout.finalStatement.x, layout.finalStatement.y);
  [["tip-size-label", layout.shot05.tipLabel], ["gap-label", layout.shot05.gapLabel], ["liquid-bridge-label", layout.shot05.liquidBridgeLabel]].forEach(([id, position]) => {
    const texts = $(id).querySelectorAll("text");
    texts[0].setAttribute("x", position.x); texts[0].setAttribute("y", position.y);
    texts[1].setAttribute("x", position.x); texts[1].setAttribute("y", position.y + position.lineGap);
  });
  const subtitle = layout.subtitle, box = $("subtitle-layer").querySelector("rect");
  Object.entries({ x:subtitle.x, y:subtitle.y, width:subtitle.width, height:subtitle.height }).forEach(([key,value]) => box.setAttribute(key,value));
  setTextPosition("subtitle-text", subtitle.textX, subtitle.textY);
}

applyTuning();
// Path lengths are measured after tunable geometry has been applied.
document.querySelectorAll(".draw").forEach((path) => { path.dataset.length = Math.ceil(path.getTotalLength()); });

function render(time) {
  const s5 = timeline.shot05, s6 = timeline.shot06;
  const liquid = ease(progressBetween(time, s5.liquidStart, s5.liquidEnd));
  visible(el["confined-liquid"], liquid * .82);
  draw(el["liquid-contour"], liquid);

  const oldFocus = progressBetween(time, s5.oldFocusStart, s5.oldCrossStart);
  draw(el["old-tip-circle"], oldFocus);
  visible(el["tip-size-label"], oldFocus * (1 - .76 * progressBetween(time, s5.oldFocusFadeStart, 8.3)) * (1 - progressBetween(time, 15.4, 16)));
  visible(el["old-tip-circle"], oldFocus * (1 - progressBetween(time, s5.oldCrossStart, s5.thinkingPauseStart)));
  el["tip-size-cross"].querySelectorAll(".draw").forEach((p, i) => draw(p, progressBetween(time, s5.oldCrossStart + i * .16, s5.oldCrossStart + .52 + i * .16)));
  visible(el["tip-size-cross"], 1 - progressBetween(time, 15.4, 16));

  draw(el["new-gap-circle"], progressBetween(time, s5.newGapCircleStart, s5.newGapCircleEnd));
  visible(el["new-gap-circle"], 1 - progressBetween(time, 15.4, 16));
  const gap = progressBetween(time, s5.gapLabelStart, s5.gapLabelEnd);
  visible(el["gap-label"], gap * (1 - .55 * progressBetween(time, s5.liquidEmphasisStart, s5.liquidBridgeStart)) * (1 - progressBetween(time, 15.4, 16)));
  draw(el["gap-label"].querySelector("path"), gap);
  const bridge = progressBetween(time, s5.liquidBridgeStart, s5.liquidBridgeEnd);
  visible(el["liquid-bridge-label"], bridge * (1 - progressBetween(time, 15.4, 16)));
  draw($("liquid-pointer"), bridge);

  const substrate = progressBetween(time, s5.substrateStart, s5.substrateDrawEnd);
  draw(el.substrate, substrate); draw(el["written-line"], progressBetween(time, s5.writtenLineStart, s5.end));
  visible(el["liquid-transfer-label"], progressBetween(time, s5.transferLabelStart, s5.end) * (1 - progressBetween(time, s6.start + .15, s6.moveStructureStart)));

  const move = ease(progressBetween(time, s6.moveStructureStart, s6.moveStructureEnd));
  const target = tuning.layout.shot06.newStructure;
  $("hair-structure").setAttribute("transform", `translate(${target.x * move} ${target.y * move}) scale(${1 + (target.scale - 1) * move})`);
  const replay = time >= s6.transferReplayStart && time < s6.settleStart ? Math.sin(progressBetween(time, s6.transferReplayStart, s6.settleStart) * Math.PI) : 0;
  el["confined-liquid"].style.fill = replay ? `rgb(${169 - 16 * replay},${220 - 8 * replay},${232})` : "";
  if (time >= 15) draw(el["written-line"], .78 + .22 * progressBetween(time, s6.transferReplayStart + .2, s6.settleStart));

  visible(el["old-representation-group"], progressBetween(time, s6.oldTipStart, s6.oldTipStart + .3));
  visible(el["old-kicker"], progressBetween(time, s6.oldTipStart, s6.oldTipStart + .45) * (1 - progressBetween(time, s6.oldTitleStart, s6.oldTitleEnd)));
  draw(el["old-single-tip"], progressBetween(time, s6.oldTipStart, s6.oldTipEnd));
  draw(el["old-thinner-tip"], progressBetween(time, s6.oldThinnerTipStart, s6.oldThinnerTipEnd));
  draw(el["old-arrow"], progressBetween(time, s6.oldArrowStart, s6.oldArrowEnd));
  draw(el["old-frame"], progressBetween(time, s6.oldFrameStart, s6.oldFrameEnd));
  visible(el["old-heading"], progressBetween(time, s6.oldTitleStart, s6.oldTitleEnd));
  el["old-group-cross"].querySelectorAll(".draw").forEach((p, i) => draw(p, progressBetween(time, s6.oldCrossStart + i * .12, s6.oldCrossEnd - .15 + i * .12)));
  const oldFade = 1 - tuning.emphasis.oldRepresentationOpacity;
  el["old-representation-group"].style.opacity = `${progressBetween(time, s6.oldTipStart, s6.oldTipStart + .3) * (1 - oldFade * progressBetween(time, s6.oldCrossStart, s6.comparisonPauseStart))}`;

  visible(el["new-representation-group"], progressBetween(time, s6.newFrameStart, s6.newFrameStart + .1));
  draw(el["new-frame"], progressBetween(time, s6.newFrameStart, s6.newTitleStart));
  visible(el["new-heading"], progressBetween(time, s6.newTitleStart, s6.newTitleEnd));
  visible(el["new-question"], progressBetween(time, s6.newQuestionStart, s6.newQuestionEnd));
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
