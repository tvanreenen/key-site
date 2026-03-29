(() => {
  /** Set `?debugWatch=1` on the page URL to keep the watch mock visible (Touch sheet hidden) for live CSS tweaks in DevTools. */
  const DEBUG_WATCH_LAYOUT =
    typeof location !== "undefined" && new URLSearchParams(location.search).get("debugWatch") === "1";

  const scrollEl = document.querySelector("[data-terminal-scroll]");
  const historyEl = document.querySelector("[data-terminal-history]");
  const cursorRowEl = document.querySelector("[data-terminal-cursor-row]");
  const typedEl = document.querySelector("[data-typed]");
  const promptEl = document.querySelector("[data-prompt]");
  const caretEl = document.querySelector("[data-caret]");
  const touchSheet = document.querySelector("[data-touch-sheet]");
  const touchTitle = document.querySelector("[data-touch-title]");
  const touchLine1 = document.querySelector("[data-touch-line1]");
  const touchLine2 = document.querySelector("[data-touch-line2]");
  const touchIcon = document.querySelector("[data-touch-icon]");
  const watchFrame = document.querySelector("[data-watch-frame]");
  const watchApprove = document.querySelector("[data-watch-approve]");
  const watchContent = document.querySelector("[data-watch-content]");
  const watchSidePill = watchApprove?.querySelector(".watch-side-pill");
  const watchSideExterior = watchFrame?.querySelector(".watch-side-exterior");

  const fingerprintInnerHTML = touchIcon?.innerHTML ?? "";

  /** Must match `watch-side-double-press` duration in marketing/styles.css */
  const WATCH_DOUBLE_PRESS_MS = 720;

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  function syncWatchSideButton() {
    if (!watchFrame || !watchSidePill || !watchSideExterior) return;
    if (watchFrame.hidden) return;

    const frameRect = watchFrame.getBoundingClientRect();
    const pillRect = watchSidePill.getBoundingClientRect();
    if (!frameRect.width || !pillRect.height) return;

    watchFrame.style.setProperty("--watch-side-exterior-top", `${pillRect.top - frameRect.top}px`);
    watchFrame.style.setProperty("--watch-side-exterior-h", `${pillRect.height}px`);
  }

  function syncWatchSideButtonSoon() {
    requestAnimationFrame(() => {
      requestAnimationFrame(syncWatchSideButton);
    });
  }

  function setCaret(on) {
    if (!caretEl) return;
    /* data-hidden="true" => hidden (see .caret[data-hidden="true"] in CSS) */
    caretEl.dataset.hidden = on ? "false" : "true";
  }

  /**
   * Keep the live prompt row out of sight without removing its line box.
   * This prevents both ghost-carets and the vertical jump from layout collapse.
   */
  function setCursorRowConcealed(concealed) {
    if (!cursorRowEl) return;
    cursorRowEl.dataset.concealed = concealed ? "true" : "false";
  }

  function setPrompt(html) {
    promptEl.innerHTML = html;
  }

  function scrollTerminalToBottom() {
    if (!scrollEl) return;
    /* Snap immediately so newly committed lines do not paint one frame "too high", then correct once layout settles. */
    scrollEl.scrollTop = scrollEl.scrollHeight;
    requestAnimationFrame(() => {
      scrollEl.scrollTop = scrollEl.scrollHeight;
    });
  }

  function appendLine(html, className = "") {
    const div = document.createElement("div");
    div.className = className;
    div.innerHTML = html;
    historyEl.appendChild(div);
    scrollTerminalToBottom();
  }

  function appendTurnBreak() {
    const div = document.createElement("div");
    div.className = "terminal-turn-break";
    div.setAttribute("aria-hidden", "true");
    historyEl.appendChild(div);
    scrollTerminalToBottom();
  }

  function setLineCaret(caret, on) {
    if (!caret) return;
    caret.dataset.hidden = on ? "false" : "true";
  }

  function createLivePromptLine(promptHtml, contentClass = "typed") {
    const div = document.createElement("div");
    div.className = "terminal-command-line";
    div.innerHTML = `${promptHtml}<span class="${contentClass}" data-live-content></span><span class="caret" data-live-caret data-hidden="true" aria-hidden="true"></span>`;
    historyEl.appendChild(div);
    scrollTerminalToBottom();
    return {
      rowEl: div,
      contentEl: div.querySelector("[data-live-content]"),
      caretEl: div.querySelector("[data-live-caret]"),
    };
  }

  function finalizeLivePromptLine(rowEl) {
    rowEl?.querySelector("[data-live-caret]")?.remove();
  }

  async function typeString(targetEl, caret, text, cps = 38) {
    targetEl.textContent = "";
    setLineCaret(caret, true);
    for (let i = 0; i < text.length; i++) {
      targetEl.textContent += text[i];
      await sleep(cps + Math.random() * 18);
    }
  }

  async function typeMasked(targetEl, caret, length, cps = 48) {
    targetEl.textContent = "";
    setLineCaret(caret, true);
    for (let i = 0; i < length; i++) {
      targetEl.textContent += "•";
      await sleep(cps + Math.random() * 22);
    }
  }

  async function runLine(promptHtml, command, { output = [], needAuth = false, auth = {} } = {}) {
    setPrompt(promptHtml);
    typedEl.textContent = "";
    setCursorRowConcealed(true);
    setCaret(false);

    const liveLine = createLivePromptLine(promptHtml);
    await typeString(liveLine.contentEl, liveLine.caretEl, command);
    await sleep(220);

    const willPrintMore = needAuth || output.length > 0;
    finalizeLivePromptLine(liveLine.rowEl);

    if (needAuth) {
      await showAuth(auth);
      await sleep(2200);
      await authSuccess();
      await sleep(600);
      await hideAuth();
    }

    for (const line of output) {
      const cls = line.startsWith("error:") ? "line-err" : "line-out";
      appendLine(escapeHtml(line), cls);
      await sleep(line.length > 60 ? 45 : 90);
    }

    appendTurnBreak();
    /* Idle prompt ready for next scene / inter-scene pause */
    setPrompt(promptHtml);
    setCursorRowConcealed(false);
    setCaret(true);
  }

  const passwordPromptHtml = '<span class="password-prompt">Password:</span>';

  async function runAddScene(promptHtml, scene) {
    const { command, passwordLength } = scene;
    const len = passwordLength ?? 18;

    setPrompt(promptHtml);
    typedEl.textContent = "";
    setCursorRowConcealed(true);
    setCaret(false);

    const commandLine = createLivePromptLine(promptHtml);
    await typeString(commandLine.contentEl, commandLine.caretEl, command);
    await sleep(220);
    finalizeLivePromptLine(commandLine.rowEl);

    await sleep(450);
    const passwordLine = createLivePromptLine(passwordPromptHtml, "typed masked-inline");
    await typeMasked(passwordLine.contentEl, passwordLine.caretEl, len);
    await sleep(200);
    finalizeLivePromptLine(passwordLine.rowEl);

    /* Do not flash an idle caret after password entry; keep the row concealed until the next scene starts typing. */
    setPrompt(promptHtml);
    typedEl.textContent = "";
    setCaret(false);
    setCursorRowConcealed(true);

    await sleep(900);

    appendTurnBreak();
  }

  function escapeHtml(s) {
    return s
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  async function showAuth({ title, line1, line2 } = {}) {
    if (touchTitle) touchTitle.textContent = title ?? "Key Agent";
    if (touchLine1) touchLine1.textContent = line1 ?? "";
    if (touchLine2)
      touchLine2.textContent = line2 ?? "Touch ID or enter your password to allow this.";
    if (touchSheet) {
      if (DEBUG_WATCH_LAYOUT) {
        touchSheet.hidden = true;
        touchSheet.dataset.visible = "false";
      } else {
        touchSheet.hidden = false;
      }
      touchSheet.dataset.visible = "false";
      touchSheet.dataset.success = "false";
    }
    if (watchFrame) {
      watchFrame.hidden = false;
      watchFrame.dataset.visible = "false";
      delete watchFrame.dataset.sidePress;
    }
    if (watchContent) watchContent.hidden = false;
    if (watchApprove) watchApprove.dataset.active = "false";

    await sleep(50);
    if (touchSheet) touchSheet.dataset.visible = "true";
    if (watchFrame) watchFrame.dataset.visible = "true";
    syncWatchSideButtonSoon();

    await sleep(600);
  }

  async function authSuccess() {
    if (touchSheet) touchSheet.dataset.success = "true";
    if (watchFrame) watchFrame.dataset.sidePress = "true";
    await sleep(WATCH_DOUBLE_PRESS_MS);
    if (watchApprove) watchApprove.dataset.active = "true";
    await sleep(420);
    if (DEBUG_WATCH_LAYOUT) {
      return;
    }
  }

  async function hideAuth() {
    if (touchSheet) {
      touchSheet.dataset.visible = "false";
      touchSheet.dataset.success = "false";
    }
    if (!DEBUG_WATCH_LAYOUT && watchFrame) {
      watchFrame.dataset.visible = "false";
    }
    if (touchIcon && fingerprintInnerHTML) {
      touchIcon.innerHTML = fingerprintInnerHTML;
    }
    await sleep(420);
    if (touchSheet) touchSheet.hidden = true;
    if (!DEBUG_WATCH_LAYOUT && watchFrame) {
      watchFrame.hidden = true;
    } else if (DEBUG_WATCH_LAYOUT && watchFrame) {
      watchFrame.dataset.visible = "true";
    }
    if (watchContent) watchContent.hidden = false;
    if (watchFrame) delete watchFrame.dataset.sidePress;
  }

  const promptPlain = '<span class="prompt">&gt;</span>';

  const scenes = [
    {
      kind: "normal",
      promptHtml: promptPlain,
      command: "key list",
      output: ["gmail/pwd", "github/pat", "my-project/openai/api"],
    },
    {
      kind: "normal",
      promptHtml: promptPlain,
      command: "key get github/pat",
      needAuth: true,
      auth: {
        title: "Key Agent",
        line1: "Key Agent is trying to decrypt “github/pat” from the vault.",
        line2: "Touch ID or enter your password to allow this.",
      },
      output: ["ghp_demo_4xQ8vN2pL1mR7sT9uW0"],
    },
    {
      kind: "add",
      promptHtml: promptPlain,
      command: "key add wifi/pwd",
      passwordLength: 22,
    },
    {
      kind: "normal",
      promptHtml: promptPlain,
      command: "openssl rand -base64 32 | key update wifi/pwd",
      output: [],
    },
  ];

  function applyDebugWatchLayout() {
    if (!DEBUG_WATCH_LAYOUT || !watchFrame) return;
    watchFrame.hidden = false;
    watchFrame.dataset.visible = "true";
    delete watchFrame.dataset.sidePress;
    if (watchContent) watchContent.hidden = false;
    if (watchApprove) watchApprove.dataset.active = "false";
    if (touchSheet) {
      touchSheet.hidden = true;
      touchSheet.dataset.visible = "false";
    }
    syncWatchSideButtonSoon();
  }

  if (typeof window !== "undefined") {
    window.addEventListener("resize", syncWatchSideButtonSoon);
  }

  if (typeof ResizeObserver !== "undefined" && watchApprove) {
    const watchAlignmentObserver = new ResizeObserver(syncWatchSideButtonSoon);
    watchAlignmentObserver.observe(watchApprove);
    if (watchFrame) watchAlignmentObserver.observe(watchFrame);
  }

  applyDebugWatchLayout();

  async function loop() {
    await sleep(600);
    for (;;) {
      historyEl.innerHTML = "";
      setPrompt(promptPlain);
      typedEl.textContent = "";
      setCursorRowConcealed(false);
      setCaret(true);

      for (const scene of scenes) {
        if (scene.kind === "add") {
          await runAddScene(scene.promptHtml ?? promptPlain, scene);
        } else {
          await runLine(scene.promptHtml ?? promptPlain, scene.command, {
            output: scene.output ?? [],
            needAuth: scene.needAuth ?? false,
            auth: scene.auth ?? {},
          });
        }
        await sleep(1400);
      }

      await sleep(2200);
    }
  }

  loop().catch(console.error);
})();
