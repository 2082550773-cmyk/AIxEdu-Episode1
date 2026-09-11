// Exposed explicitly for classic-script, file:// playback. Keep all retiming here.
window.SHOT_TIMELINE = Object.freeze({
  duration: 25,
  shot05: Object.freeze({
    start: 0, liquidStart: 0, liquidEnd: 1.5,
    oldFocusStart: 1.5, oldFocusEnd: 2, oldCrossStart: 5, oldCircleFadeEnd: 6.8,
    newGapCircleStart: 6.8, newGapCircleEnd: 9.7,
    oldFocusFadeStart: 7.7, oldFocusFadeEnd: 9.7,
    gapLabelStart: 7.7, gapLabelEnd: 9.7,
    liquidEmphasisStart: 9.7, liquidBridgeStart: 10.5, liquidBridgeEnd: 13.5,
    substrateStart: 12, substrateDrawEnd: 12.75,
    writtenLineStart: 12.65, transferLabelStart: 12.95, end: 13.5
  }),
  shot06: Object.freeze({
    start: 13.5, moveStructureStart: 13.9, moveStructureEnd: 14.5,
    oldTipStart: 14, oldTipEnd: 15, oldThinnerTipStart: 15,
    oldThinnerTipEnd: 15.7, oldArrowStart: 15.15, oldArrowEnd: 15.7,
    oldFrameStart: 15.7, oldFrameEnd: 16.3, oldTitleStart: 16.3,
    oldTitleEnd: 17.3, oldCrossStart: 17.3, oldCrossEnd: 18,
    comparisonPauseStart: 18, newFrameStart: 18.7, newTitleStart: 19.5,
    newTitleEnd: 20.3, newQuestionStart: 20.3, newQuestionEnd: 21.1,
    transferReplayStart: 21.4,
    settleStart: 22.5, finalHoldStart: 22.5, end: 25
  }),
  subtitles: Object.freeze([
    [0, 1.5, "液体进入两根毛之间以后"],
    [1.5, 5, "真正重要的东西开始变了"],
    [5, 6.8, "控制液体转移的，不再只是“尖端到底有多细”"],
    [6.8, 7.7, "而是——"],
    [7.7, 9.7, "两根毛之间的 gap"],
    [9.7, 10.5, "以及里面形成的——"],
    [10.5, 13.5, "liquid bridge"],
    [13.5, 13.9, "你看，"],
    [13.9, 15.5, "问题已经从——"],
    [15.5, 17.3, "怎样做一个更细的 tip？"],
    [17.3, 20.3, "变成了——"],
    [20.3, 22.5, "怎样利用两根毛之间的结构去控制液体"],
    [22.5, 25.01, "这不是同一道题的更好答案。"]
  ])
});

// Visual tuning controls. Values match the approved base; adjust here rather
// than editing SVG paths, CSS rules, or render math in other files.
window.SHOT_TUNING = Object.freeze({
  layout: Object.freeze({
    shot05: Object.freeze({
      scene: Object.freeze({ x: 0, y: 0, scale: 1 }),
      tipLabel: Object.freeze({ x: 1010, y: 525, lineGap: 34 }),
      gapLabel: Object.freeze({ x: 1040, y: 323, lineGap: 37 }),
      liquidBridgeLabel: Object.freeze({ x: 1015, y: 405, lineGap: 37 })
    }),
    shot06: Object.freeze({
      oldGroup: Object.freeze({ x: 0, y: 0, scale: 1 }),
      oldDiagram: Object.freeze({ x: 97, y: 80, scale: 1 }),
      oldFrame: Object.freeze({ x: 90, y: 105, width: 650, height: 570 }),
      oldKicker: Object.freeze({ x: 415, y: 155 }),
      oldTitle: Object.freeze({ x: 415, y: 155, chineseX: 415, chineseY: 190 }),
      oldQuestion: Object.freeze({ x: 415, y: 260 }),
      oldCrossInset: Object.freeze({ x: 30, y: 40 }),
      newStructure: Object.freeze({ x: 689, y: 249, scale: 0.62 }),
      newFrame: Object.freeze({ x: 860, y: 105, width: 650, height: 570 }),
      newTitle: Object.freeze({ x: 1185, y: 155, chineseY: 190 }),
      newQuestion: Object.freeze({ x: 1185, y: 255, lineGap: 40 })
    }),
    finalStatement: Object.freeze({ x: 1040, y: 755 }),
    subtitle: Object.freeze({ x: 280, y: 804, width: 1040, height: 64, textX: 800, textY: 846 })
  }),
  typography: Object.freeze({
    conceptLabel: 34, title: 27, question: 26, newQuestion: 24,
    subtitle: 28, chineseLabel: 27, secondaryLabel: 20
  }),
  emphasis: Object.freeze({
    oldRepresentationOpacity: 0.35, secondaryLabelOpacity: 1,
    circleStrokeWidth: 4, frameStrokeWidth: 3, crossOutStrokeWidth: 4
  })
});
