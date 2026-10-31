"use strict";
(() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __async = (__this, __arguments, generator) => {
    return new Promise((resolve, reject) => {
      var fulfilled = (value) => {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      };
      var rejected = (value) => {
        try {
          step(generator.throw(value));
        } catch (e) {
          reject(e);
        }
      };
      var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
      step((generator = generator.apply(__this, __arguments)).next());
    });
  };

  // <define:__MEMEX_AUTH__>
  var define_MEMEX_AUTH_default = { username: "phil", hash: "3e687d198cdbe190ebdfdac649fb19daefe988ee0055f47b803bfc043a9389bf" };

  // src/auth.ts
  var STORAGE_KEY = "memex:auth";
  function hex(buffer) {
    return Array.from(new Uint8Array(buffer)).map((b) => b.toString(16).padStart(2, "0")).join("");
  }
  function sha256(str) {
    return __async(this, null, function* () {
      const enc = new TextEncoder().encode(str);
      const buf = yield crypto.subtle.digest("SHA-256", enc);
      return hex(buf);
    });
  }
  function authenticate(username, password) {
    return __async(this, null, function* () {
      const cfg = (typeof define_MEMEX_AUTH_default !== "undefined" ? define_MEMEX_AUTH_default : void 0) || { username: "phil", hash: "dev-mode" };
      if (username !== cfg.username) return false;
      const hash = yield sha256(`${username}:${password}`);
      if (hash !== cfg.hash) return false;
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ user: username, at: Date.now() }));
      return true;
    });
  }
  function isAuthenticated() {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return false;
    try {
      const data2 = JSON.parse(raw);
      return !!data2.user && typeof data2.at === "number";
    } catch (e) {
      return false;
    }
  }
  function logout() {
    sessionStorage.removeItem(STORAGE_KEY);
  }
  function currentUser() {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw).user || null;
    } catch (e) {
      return null;
    }
  }

  // src/sm2.ts
  var MIN_EASE = 1.3;
  var INITIAL_EASE = 2.5;
  function sm2(state, quality, now = /* @__PURE__ */ new Date()) {
    var _a, _b, _c;
    const ef = (_a = state == null ? void 0 : state.easeFactor) != null ? _a : INITIAL_EASE;
    const reps = (_b = state == null ? void 0 : state.repetitions) != null ? _b : 0;
    const interval = (_c = state == null ? void 0 : state.interval) != null ? _c : 0;
    let newEf;
    let newInterval;
    let newReps;
    if (quality < 2) {
      newReps = 0;
      newInterval = 1;
      newEf = Math.max(MIN_EASE, ef - 0.2);
    } else {
      newReps = reps + 1;
      if (newReps === 1) {
        newInterval = 1;
      } else if (newReps === 2) {
        newInterval = 6;
      } else {
        newInterval = Math.round(interval * ef);
      }
      newEf = ef + (0.1 - (3 - quality) * (0.08 + (3 - quality) * 0.02));
      newEf = Math.max(MIN_EASE, newEf);
    }
    const nextDate = new Date(now);
    nextDate.setDate(nextDate.getDate() + newInterval);
    nextDate.setHours(23, 59, 0, 0);
    return {
      easeFactor: newEf,
      interval: newInterval,
      repetitions: newReps,
      nextReview: nextDate.toISOString(),
      lastReview: now.toISOString()
    };
  }
  function isDue(state, now = /* @__PURE__ */ new Date()) {
    if (!state) return true;
    return now >= new Date(state.nextReview);
  }

  // src/store.ts
  var STATE_KEY = "memex:review-states";
  function loadData() {
    try {
      const raw = localStorage.getItem(STATE_KEY);
      if (raw) {
        const data2 = JSON.parse(raw);
        if (data2.version === 1) return data2;
      }
    } catch (e) {
    }
    return { version: 1, states: {} };
  }
  function saveData(data2) {
    localStorage.setItem(STATE_KEY, JSON.stringify(data2));
  }
  function saveReview(cardId, quality) {
    const data2 = loadData();
    const current = data2.states[cardId] ? __spreadValues({}, data2.states[cardId]) : null;
    const next = sm2(current, quality);
    data2.states[cardId] = {
      easeFactor: next.easeFactor,
      interval: next.interval,
      repetitions: next.repetitions,
      nextReview: next.nextReview,
      lastReview: next.lastReview
    };
    saveData(data2);
    return next;
  }
  function getDueCards(cards) {
    const data2 = loadData();
    const now = /* @__PURE__ */ new Date();
    return cards.filter((c) => {
      const s = data2.states[c.id];
      if (!s) return true;
      return now >= new Date(s.nextReview);
    });
  }
  function getStats() {
    const data2 = loadData();
    const now = /* @__PURE__ */ new Date();
    const states = Object.values(data2.states);
    return {
      total: states.length,
      reviewed: states.filter((s) => s.repetitions > 0).length,
      due: states.filter((s) => now >= new Date(s.nextReview)).length,
      mature: states.filter((s) => s.repetitions >= 5).length
    };
  }
  function resetCard(cardId) {
    const data2 = loadData();
    delete data2.states[cardId];
    saveData(data2);
  }
  function getCardQueue(cards) {
    const data2 = loadData();
    return cards.map((c) => ({
      card: c,
      state: data2.states[c.id] ? __spreadValues({}, data2.states[c.id]) : null
    })).sort((a, b) => {
      const aDue = a.state ? new Date(a.state.nextReview).getTime() : 0;
      const bDue = b.state ? new Date(b.state.nextReview).getTime() : 0;
      return aDue - bDue;
    });
  }

  // src/app.ts
  var data = null;
  var currentCategory = null;
  var studyQueue = [];
  var studyIndex = 0;
  var showingBack = false;
  var $ = (s) => document.querySelector(s);
  var $$ = (s) => document.querySelectorAll(s);
  function showScreen(id) {
    var _a;
    $$(".screen").forEach((el) => el.classList.remove("active"));
    (_a = $(`#${id}`)) == null ? void 0 : _a.classList.add("active");
  }
  function handleLogin(e) {
    return __async(this, null, function* () {
      e.preventDefault();
      const username = $("#login-user").value.trim();
      const password = $("#login-pass").value.trim();
      const errEl = $("#login-error");
      if (!username || !password) {
        errEl.textContent = "Enter both username and password.";
        return;
      }
      const ok = yield authenticate(username, password);
      if (ok) {
        errEl.textContent = "";
        renderDashboard();
      } else {
        errEl.textContent = "Invalid credentials.";
      }
    });
  }
  function renderDashboard() {
    var _a;
    showScreen("dashboard");
    $("#user-name").textContent = currentUser() || "User";
    $("#stats-total").textContent = String((_a = data == null ? void 0 : data.totalCards) != null ? _a : 0);
    const stats = getStats();
    $("#stats-reviewed").textContent = String(stats.reviewed);
    $("#stats-due").textContent = String(stats.due);
    $("#stats-mature").textContent = String(stats.mature);
    const list = $("#category-list");
    list.innerHTML = "";
    if (!data) return;
    for (const cat of data.categories) {
      const cards = data.flashcards[cat];
      const dueCards = getDueCards(cards);
      const item = document.createElement("button");
      item.className = "category-item";
      item.innerHTML = `
      <span class="cat-name">${cat}</span>
      <span class="cat-count">${cards.length} cards \xB7 ${dueCards.length} due</span>
    `;
      item.addEventListener("click", () => startStudy(cat));
      list.appendChild(item);
    }
  }
  function startStudy(category) {
    currentCategory = category;
    const cards = data == null ? void 0 : data.flashcards[category];
    if (!cards || cards.length === 0) return;
    studyQueue = getCardQueue(cards);
    studyIndex = 0;
    showingBack = false;
    showScreen("study");
    renderCard();
  }
  function renderCard() {
    if (studyIndex >= studyQueue.length) {
      $("#study-card").classList.add("hidden");
      $("#study-done").classList.remove("hidden");
      $("#study-progress-text").textContent = "All caught up! \u{1F389}";
      return;
    }
    const entry = studyQueue[studyIndex];
    const total = studyQueue.length;
    const remaining = total - studyIndex;
    const dueCount = studyQueue.filter((e) => !e.state || isDue(e.state, /* @__PURE__ */ new Date())).length;
    $("#study-card").classList.remove("hidden");
    $("#study-done").classList.add("hidden");
    $("#study-progress-text").textContent = `Card ${studyIndex + 1} of ${total} \xB7 ${dueCount} due \xB7 ${remaining - dueCount} preview`;
    const frontEl = $("#card-front");
    const backEl = $("#card-back");
    frontEl.textContent = entry.card.front;
    backEl.textContent = entry.card.back;
    backEl.classList.add("hidden");
    $("#card-category").textContent = `#${entry.card.category}`;
    const lastEl = $("#card-last-reviewed");
    if (entry.card.lastReviewed) {
      lastEl.textContent = `Last reviewed: ${entry.card.lastReviewed}`;
      lastEl.classList.remove("hidden");
    } else {
      lastEl.classList.add("hidden");
    }
    showingBack = false;
    $("#card-reveal").classList.remove("hidden");
    $("#card-rate").classList.add("hidden");
  }
  function revealBack() {
    if (showingBack) return;
    showingBack = true;
    $("#card-back").classList.remove("hidden");
    $("#card-reveal").classList.add("hidden");
    $("#card-rate").classList.remove("hidden");
  }
  document.addEventListener("keydown", (e) => {
    if (!showingBack && (e.key === " " || e.key === "Enter")) {
      e.preventDefault();
      revealBack();
      return;
    }
    if (showingBack && ["0", "1", "2", "3"].includes(e.key)) {
      rateCard(parseInt(e.key));
    }
  });
  function rateCard(quality) {
    const entry = studyQueue[studyIndex];
    saveReview(entry.card.id, quality);
    studyIndex++;
    showingBack = false;
    renderCard();
  }
  function handleLogout() {
    logout();
    showScreen("login");
    $("#login-user").value = "";
    $("#login-pass").value = "";
  }
  function init() {
    return __async(this, null, function* () {
      var _a, _b, _c, _d, _e, _f;
      try {
        const resp = yield fetch("flashcards.json");
        data = yield resp.json();
      } catch (err) {
        console.error("Failed to load flashcards.json:", err);
        $("#app-root").innerHTML = `<div class="error">Failed to load flashcard data. Run the parser first.</div>`;
        return;
      }
      (_a = $("#login-form")) == null ? void 0 : _a.addEventListener("submit", handleLogin);
      (_b = $("#logout-btn")) == null ? void 0 : _b.addEventListener("click", handleLogout);
      (_c = $("#card-reveal-btn")) == null ? void 0 : _c.addEventListener("click", revealBack);
      $$(".rate-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          rateCard(parseInt(btn.dataset.quality || "0"));
        });
      });
      (_d = $("#study-back-btn")) == null ? void 0 : _d.addEventListener("click", () => {
        renderDashboard();
      });
      (_e = $("#study-done-btn")) == null ? void 0 : _e.addEventListener("click", () => {
        renderDashboard();
      });
      (_f = $("#study-reset-btn")) == null ? void 0 : _f.addEventListener("click", () => {
        if (currentCategory && confirm("Reset all review data for this category?")) {
          const cards = (data == null ? void 0 : data.flashcards[currentCategory]) || [];
          cards.forEach((c) => resetCard(c.id));
          startStudy(currentCategory);
        }
      });
      if (isAuthenticated()) {
        renderDashboard();
      } else {
        showScreen("login");
      }
    });
  }
  document.addEventListener("DOMContentLoaded", init);
})();
