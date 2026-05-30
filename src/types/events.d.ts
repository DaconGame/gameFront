/** 게임 ↔ React 셸 사이에서 쓰는 커스텀 window 이벤트 타입 보강. */
declare global {
  interface WindowEventMap {
    "game:exit": CustomEvent;
  }
}

export { };
