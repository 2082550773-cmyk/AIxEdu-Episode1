export const timeline = Object.freeze({
  duration: 25,
  shot05: Object.freeze({
    start: 0, liquidStart: 1, liquidEnd: 3,
    oldFocusStart: 3, oldCrossStart: 3.5, thinkingPauseStart: 4.3,
    newGapCircleStart: 4.8, newGapCircleEnd: 6.5,
    oldFocusFadeStart: 6.5, pauseStart: 8.3,
    gapLabelStart: 9.2, gapLabelEnd: 11.2,
    liquidEmphasisStart: 11.2, liquidBridgeStart: 12,
    substrateStart: 13.5, end: 15
  }),
  shot06: Object.freeze({
    start: 15, moveStructureStart: 15.4, moveStructureEnd: 16,
    oldTipStart: 16, oldThinnerTipStart: 17,
    oldFrameStart: 17.7, oldTitleStart: 18.3,
    oldCrossStart: 18.8, comparisonPauseStart: 19.5,
    newFrameStart: 20.2, newTitleStart: 21,
    newQuestionStart: 21.8, transferReplayStart: 22.8,
    settleStart: 23.6, finalHoldStart: 24, end: 25
  }),
  subtitles: Object.freeze([
    [0, 3, "液体进入两根毛之间以后"],
    [3, 6.5, "真正重要的东西开始变了"],
    [6.5, 8.3, "控制液体转移的，不再只是“尖端到底有多细”"],
    [8.3, 9.2, "而是——"],
    [9.2, 11.2, "两根毛之间的 gap"],
    [11.2, 12, "以及里面形成的——"],
    [12, 15, "liquid bridge"],
    [15, 15.4, "你看，"],
    [15.4, 17, "问题已经从——"],
    [17, 18.3, "怎样做一个——"],
    [18.3, 18.8, "怎样做一个更细的 tip？"],
    [18.8, 20.2, "变成了——"],
    [20.2, 21.8, "怎样利用两根毛之间的结构去控制液体"],
    [21.8, 24, "怎样利用两根毛之间的结构去控制液体"],
    [24, 25.01, "这不是同一道题的更好答案。"]
  ])
});
