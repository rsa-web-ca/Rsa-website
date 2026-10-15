import catalogue from "../../data/fs-palettes.json";

/*
 * FS Palette Studio behaviour — a straight port of the standalone tool's
 * script. The page markup comes from FsPaletteStudio.tsx; this module wires it
 * up imperatively and returns a cleanup function for when the route unmounts.
 *
 * The standalone tool could save palettes to a shared database; on the
 * website there is none, so selections and saved palettes live in this
 * browser's localStorage.
 */

type Roles = Record<string, string>;
type Check = { check: string; fg: string; bg: string; ratio: number; need: number; ok: boolean };
type Palette = {
  id: string;
  name: string;
  category: string;
  character: string;
  roles: Roles;
  checks?: Check[];
  based_on?: string;
  saved_at?: string;
};
type Selection = { palette_id: string; palette_name: string; roles: Roles };
type Catalogue = { roles: string[]; role_use: Record<string, string>; palettes: Palette[] };

const CAT = catalogue as Catalogue;
const ROLES = CAT.roles, USE = CAT.role_use;
const NICE = (r: string) => r.replace(/_/g, " ").replace(/\bbg\b/, "fill").replace(/^cy /, "current-year ").replace(/^./, (c) => c.toUpperCase());

/* ---------- colour helpers (mirror of fsstudio/palette.py) ---------- */
const norm = (h: string) => { const m = /^#?([0-9a-f]{6})$/i.exec((h || "").trim()); return m ? "#" + m[1].toUpperCase() : null; };
const rgb = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const hex = (a: number[]) => "#" + a.map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0")).join("").toUpperCase();
const mix = (a: string, b: string, t: number) => { const x = rgb(a), y = rgb(b); return hex(x.map((v, i) => v + (y[i] - v) * t)); };
const lin = (c: number) => { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
const lum = (h: string) => { const [r, g, b] = rgb(h); return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b); };
const contrast = (a: string, b: string) => { const x = lum(a), y = lum(b); return Math.round(((Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05)) * 100) / 100; };
const readable = (h: string, bg: string, t: number) => { let c = h, n = 0; const to = lum(bg) > 0.4 ? "#000000" : "#FFFFFF"; while (contrast(c, bg) < t && n < 40) { c = mix(c, to, 0.05); n++; } return c; };
const CHECKS: [string, string, number, string][] = [
  ["table_header_text", "table_header_bg", 4.5, "Header text on header fill"],
  ["heading", "page_bg", 4.5, "Headings on page"],
  ["ink", "page_bg", 7, "Body text on page"],
  ["ink", "row_alt", 4.5, "Figures on alternate rows"],
  ["ink", "cy_band", 4.5, "Figures in current-year band"],
  ["ink", "subtotal_bg", 4.5, "Figures on subtotal rows"],
  ["total_text", "total_bg", 4.5, "Text on total rows"],
  ["total_text", "cy_total_bg", 4.5, "Totals in current-year band"],
  ["secondary", "cy_band", 4.5, "Note numbers and policy titles"],
  ["sub_header_text", "sub_header_bg", 4.5, "Sub-header text"],
  ["muted", "page_bg", 4.5, "Footer and caption text"],
  ["rule", "page_bg", 1.5, "Rule line visible on page"],
  ["border", "page_bg", 1.15, "Table lines visible"]];

/* ---------- report proof ---------- */
const PROOF = `
<div class="cover"><div><div class="c1">Annual Report 2025-26</div><div class="c2">Financial Statements</div></div><div class="c3"></div></div>
<div class="pg">
 <div class="runhead"><span>Sample Industries Limited</span><span>Standalone Financial Statements</span></div>
 <div class="ent">Sample Industries Limited</div>
 <h4 class="st">Balance Sheet as at March 31, 2026</h4>
 <div class="units">(All amounts in ₹ lakh, unless otherwise stated)</div>
 <table>
  <thead><tr><th>Particulars</th><th style="text-align:center">Note</th><th>As at<br>March 31, 2026</th><th>As at<br>March 31, 2025</th></tr></thead>
  <tbody>
   <tr class="sec"><td colspan="2">Equity and liabilities</td><td class="cy"></td><td></td></tr>
   <tr><td>Equity share capital</td><td class="nt">3</td><td class="cy">1,250.00</td><td>1,250.00</td></tr>
   <tr><td>Other equity</td><td class="nt">4</td><td class="cy">8,946.32</td><td>7,412.85</td></tr>
   <tr class="sub"><td>Total equity</td><td class="nt"></td><td class="cy">10,196.32</td><td>8,662.85</td></tr>
   <tr><td>Long-term borrowings</td><td class="nt">5</td><td class="cy">2,104.60</td><td>2,880.00</td></tr>
   <tr><td>Trade payables</td><td class="nt">6</td><td class="cy">1,342.18</td><td>1,105.74</td></tr>
   <tr><td>Other current liabilities</td><td class="nt">7</td><td class="cy">412.09</td><td>–</td></tr>
   <tr class="tot"><td>Total equity and liabilities</td><td class="nt"></td><td class="cy">14,055.19</td><td>12,648.59</td></tr>
  </tbody>
 </table>
 <div class="divider">Notes to the financial statements</div>
 <div class="noteh"><span class="num">12</span><span class="ttl">Trade receivables ageing</span></div>
 <table>
  <thead><tr><th>Particulars</th><th colspan="3" style="text-align:center">Outstanding from due date</th><th>Total</th></tr>
  <tr class="subh"><th></th><th>&lt; 6 months</th><th>6 months – 1 year</th><th>1–2 years</th><th></th></tr></thead>
  <tbody>
   <tr><td>Undisputed – considered good</td><td class="cy">1,804.12</td><td>402.18</td><td>96.40</td><td>2,302.70</td></tr>
   <tr><td>Disputed – considered doubtful</td><td class="cy">–</td><td>18.30</td><td>(4.25)</td><td>14.05</td></tr>
   <tr class="tot"><td>Total</td><td class="cy">1,804.12</td><td>420.48</td><td>92.15</td><td>2,316.75</td></tr>
  </tbody>
 </table>
 <div class="pol"><div class="pt">2.4 Revenue recognition</div><p>Revenue from the sale of goods is recognised when control of the goods passes to the customer, which is usually on dispatch, at the transaction price net of returns, trade discounts and goods and services tax.</p></div>
 <div class="aud">
  <div class="a0"></div>
  <div class="a1">Independent Auditor's Report</div>
  <div class="a2">To the Members of Sample Industries Limited</div>
  <div class="a3">Qualified Opinion</div>
  <div><p>We have audited the accompanying standalone financial statements of Sample Industries Limited, which comprise the Balance Sheet as at March 31, 2026 …</p></div>
  <div class="a3">Emphasis of Matter</div>
  <div><p>We draw attention to Note 34 to the financial statements regarding … Our opinion is not modified in respect of this matter.</p></div>
 </div>
 <div class="runfoot"><span>Sample Industries Limited · Annual Report 2025-26</span><span>Page 14</span></div>
</div>`;

const SELECTION_KEY = "fsps-selection";
const SAVED_KEY = "fsps-palettes";

function readStore<T>(key: string, fallback: T): T {
  try { return (JSON.parse(localStorage.getItem(key) || "null") as T) ?? fallback; } catch { return fallback; }
}

/** Wires up the studio inside `root`; returns a cleanup function. */
export function mountStudio(root: HTMLElement): () => void {
  const $ = <T extends HTMLElement = HTMLElement>(id: string) => root.querySelector<T>("#" + id)!;
  let custom: Palette[] = readStore<Palette[]>(SAVED_KEY, []).filter((p) => p && p.roles);
  let selection: Selection | null = null;
  let current: Palette | null = null, working: Roles = {}, mode = "refine";
  let toastTimer: ReturnType<typeof setTimeout> | undefined;
  const listeners = new AbortController();
  const { signal } = listeners;

  const allPalettes = () => CAT.palettes.concat(custom);
  function toast(msg: string) { const t = $("toast"); t.textContent = msg; t.hidden = false; clearTimeout(toastTimer); toastTimer = setTimeout(() => (t.hidden = true), 2600); }

  /* ---------- list ---------- */
  let activeCat = "All";
  function cats() {
    const order: string[] = []; const n: Record<string, number> = {};
    allPalettes().forEach((p) => { if (!(p.category in n)) { order.push(p.category); n[p.category] = 0; } n[p.category]++; });
    return { order, n };
  }
  function renderRail() {
    const { order, n } = cats(); const rail = $("rail"); rail.textContent = "";
    const mk = (label: string, count: number) => {
      const b = document.createElement("button"); b.type = "button";
      b.setAttribute("aria-pressed", String(activeCat === label));
      const a = document.createElement("span"); a.textContent = label; const c = document.createElement("span"); c.className = "n"; c.textContent = String(count);
      b.append(a, c); b.onclick = () => { activeCat = label; renderRail(); renderList(); window.scrollTo({ top: 0 }); }; rail.append(b);
    };
    mk("All", allPalettes().length);
    order.forEach((c) => mk(c, n[c]));
  }
  function matches(p: Palette, q: string) {
    if (!q) return true; q = q.toLowerCase().trim();
    const hay = [p.id, p.name, p.category, p.character].join(" ").toLowerCase();
    if (hay.includes(q)) return true;
    if (q.startsWith("#")) return Object.values(p.roles).some((v) => v.toLowerCase().startsWith(q));
    return q.split(/\s+/).every((w) => hay.includes(w));
  }
  function swatches(r: Roles) {
    const d = document.createElement("div"); d.className = "sw";
    ["primary", "secondary", "accent", "table_header_bg", "cy_band", "total_bg", "sub_header_bg"].forEach((k) => { const i = document.createElement("i"); i.style.background = r[k]; i.title = NICE(k) + " " + r[k]; d.append(i); });
    return d;
  }
  function miniPreview(r: Roles) {
    const d = document.createElement("div"); d.className = "mini"; d.style.background = r.page_bg; d.style.color = r.ink;
    d.innerHTML = '<div class="t"></div><table><thead><tr><th></th><th>FY 2026</th><th>FY 2025</th></tr></thead><tbody>' +
      "<tr><td>Trade receivables</td><td>24,16,251</td><td>12,16,840</td></tr>" +
      "<tr><td>Cash and bank</td><td>12,98,782</td><td>10,27,882</td></tr>" +
      '<tr class="tt"><td>Total</td><td>37,15,033</td><td>22,44,722</td></tr></tbody></table>';
    const t = d.querySelector<HTMLElement>(".t")!; t.textContent = "Balance Sheet"; t.style.color = r.heading;
    d.querySelectorAll("th").forEach((th) => { th.style.background = r.table_header_bg; th.style.color = r.table_header_text; });
    const rows = d.querySelectorAll("tbody tr");
    d.querySelectorAll("td").forEach((td) => (td.style.color = r.ink));
    rows.forEach((tr) => { (tr.children[1] as HTMLElement).style.background = tr.classList.contains("tt") ? r.cy_total_bg : r.cy_band; tr.querySelectorAll("td").forEach((td) => (td.style.borderBottom = "1px solid " + r.border)); });
    rows[2].querySelectorAll("td").forEach((td, i) => { if (i !== 1) td.style.background = r.total_bg; td.style.color = r.total_text; td.style.fontWeight = "700"; td.style.borderTop = "1px solid " + r.accent; td.style.borderBottom = "2px double " + r.accent; });
    return d;
  }
  function card(p: Palette) {
    const b = document.createElement("button"); b.type = "button"; b.className = "card";
    if (selection && selection.palette_id === p.id) b.setAttribute("aria-current", "true");
    b.append(swatches(p.roles), miniPreview(p.roles));
    const m = document.createElement("div"); m.className = "meta";
    const idl = document.createElement("div"); idl.className = "idline";
    const a = document.createElement("span"); a.textContent = p.id;
    const warn = (p.checks || []).filter((c) => !c.ok).length; const w = document.createElement("span"); w.textContent = warn ? warn + " contrast warning" + (warn > 1 ? "s" : "") : "";
    idl.append(a, w);
    const nm = document.createElement("div"); nm.className = "name"; nm.textContent = p.name;
    const ch = document.createElement("div"); ch.className = "char"; ch.textContent = p.character;
    m.append(idl, nm, ch); b.append(m);
    b.onclick = () => openPalette(p);
    return b;
  }
  function renderList() {
    const q = $<HTMLInputElement>("q").value; const list = $("list"); list.textContent = "";
    const { order } = cats(); let total = 0;
    order.forEach((c) => {
      if (activeCat !== "All" && activeCat !== c) return;
      const ps = allPalettes().filter((p) => p.category === c && matches(p, q));
      if (!ps.length) return;
      total += ps.length;
      const h = document.createElement("h2"); h.className = "cat-h"; h.textContent = c;
      const s = document.createElement("span"); s.textContent = ps.length + " palette" + (ps.length > 1 ? "s" : ""); h.append(s);
      const g = document.createElement("div"); g.className = "grid";
      ps.forEach((p, i) => { const el = card(p); el.title = c + ", palette " + (i + 1); g.append(el); });
      list.append(h, g);
    });
    if (!total) { const e = document.createElement("p"); e.className = "empty"; e.textContent = "No palette matches that search. Try a colour word such as teal, gold or plum."; list.append(e); }
    $("count").textContent = total + " of " + allPalettes().length + " palettes";
  }

  /* ---------- proof ---------- */
  function applyProof(r: Roles) {
    const pr = $("proof"); const s = pr.style;
    const map: Record<string, string> = {
      "--p-ink": "ink", "--p-page": "page_bg", "--p-muted": "muted", "--p-rule": "rule", "--p-heading": "heading", "--p-hbg": "table_header_bg", "--p-htx": "table_header_text",
      "--p-sbg": "sub_header_bg", "--p-stx": "sub_header_text", "--p-border": "border", "--p-secondary": "secondary", "--p-alt": "row_alt", "--p-band": "cy_band", "--p-subtotal": "subtotal_bg",
      "--p-cytotal": "cy_total_bg", "--p-total": "total_bg", "--p-ttx": "total_text", "--p-accent": "accent", "--p-primary": "primary"};
    Object.entries(map).forEach(([v, k]) => s.setProperty(v, r[k]));
    s.setProperty("--p-htx2", contrast(r.primary, "#FFFFFF") >= contrast(r.primary, r.ink) ? "#FFFFFF" : r.ink);
    pr.className = "proof m-" + mode;
  }

  /* ---------- bench ---------- */
  function renderRoles() {
    const box = $("roles"); box.textContent = "";
    ROLES.forEach((k) => {
      const row = document.createElement("div"); row.className = "role";
      const c = document.createElement("input"); c.type = "color"; c.value = working[k].toLowerCase(); c.id = "c_" + k; c.setAttribute("aria-label", NICE(k) + " colour picker");
      const lbl = document.createElement("div"); const rn = document.createElement("div"); rn.className = "rn"; rn.textContent = NICE(k); const ru = document.createElement("div"); ru.className = "ru"; ru.textContent = USE[k]; lbl.append(rn, ru);
      const h = document.createElement("input"); h.className = "hex"; h.id = "h_" + k; h.value = working[k]; h.setAttribute("aria-label", NICE(k) + " hex code"); h.spellcheck = false;
      const mb = document.createElement("div"); mb.className = "mini-btns";
      const lt = document.createElement("button"); lt.type = "button"; lt.textContent = "+"; lt.title = "Lighter"; lt.setAttribute("aria-label", "Make " + NICE(k) + " lighter");
      const dk = document.createElement("button"); dk.type = "button"; dk.textContent = "−"; dk.title = "Darker"; dk.setAttribute("aria-label", "Make " + NICE(k) + " darker");
      mb.append(lt, dk);
      const set = (v: string) => { working[k] = v; c.value = v.toLowerCase(); h.value = v; h.removeAttribute("aria-invalid"); refresh(); };
      c.oninput = () => set(norm(c.value)!);
      h.oninput = () => { const v = norm(h.value); if (v) { set(v); } else h.setAttribute("aria-invalid", "true"); };
      lt.onclick = () => set(mix(working[k], "#FFFFFF", 0.08)); dk.onclick = () => set(mix(working[k], "#000000", 0.08));
      row.append(c, lbl, h, mb); box.append(row);
    });
  }
  function renderChecks() {
    const box = $("checks"); box.textContent = "";
    CHECKS.forEach(([fg, bg, need, label]) => {
      const ratio = contrast(working[fg], working[bg]); const ok = ratio >= need;
      const d = document.createElement("div"); d.className = "chk " + (ok ? "ok" : "bad");
      const t = document.createElement("span"); t.textContent = (ok ? "Passes: " : "Low contrast: ") + label + " — " + ratio + ":1 (needs " + need + ":1)";
      d.append(t);
      if (!ok) {
        const fix = readable(working[fg], working[bg], need); const b = document.createElement("button"); b.type = "button"; b.className = "btn"; b.textContent = "Use " + fix + " for " + NICE(fg).toLowerCase();
        b.onclick = () => { working[fg] = fix; renderRoles(); refresh(); }; d.append(b);
      }
      box.append(d);
    });
  }
  function tokenString() {
    return JSON.stringify({ id: current!.id, name: current!.name + (changed() ? " (edited)" : ""), roles: working }, null, 1);
  }
  function changed() { return ROLES.some((k) => working[k] !== current!.roles[k]); }
  function refresh() { applyProof(working); renderChecks(); $("tok").textContent = tokenString(); }
  function fillBorrow() {
    const bp = $("borrowPal"); bp.textContent = "";
    allPalettes().forEach((p) => { const o = document.createElement("option"); o.value = p.id; o.textContent = p.id + " · " + p.name; bp.append(o); });
    [$("borrowFrom"), $("borrowTo")].forEach((sel) => { sel.textContent = ""; ROLES.forEach((k) => { const o = document.createElement("option"); o.value = k; o.textContent = NICE(k); sel.append(o); }); });
    $<HTMLSelectElement>("borrowFrom").value = "accent"; $<HTMLSelectElement>("borrowTo").value = "accent";
  }
  function openPalette(p: Palette) {
    current = p; working = Object.assign({}, p.roles);
    $("dId").textContent = p.id + " · " + p.category; $("dTitle").textContent = p.name; $("dChar").textContent = p.character;
    $("proof").innerHTML = PROOF;
    renderRoles(); fillBorrow(); refresh();
    $<HTMLInputElement>("saveName").value = ""; $("saveNote").textContent = "";
    updateSelectButton();
    $("drawer").hidden = false; document.body.style.overflow = "hidden"; $("btnClose").focus();
  }
  function closeDrawer() { $("drawer").hidden = true; document.body.style.overflow = ""; }
  function updateSelectButton() {
    const b = $<HTMLButtonElement>("btnSelect"); b.disabled = false;
    b.textContent = (selection && selection.palette_id === current!.id && !changed()) ? "Selected" : (changed() ? "Select with my changes" : "Select this palette");
    b.title = "Records your choice in this browser and copies all 19 colours.";
  }
  function selectTok() { const r = document.createRange(); r.selectNodeContents($("tok")); const s = getSelection()!; s.removeAllRanges(); s.addRange(r); toast("Press Ctrl+C to copy"); }
  function showSelection() {
    $("selName").textContent = selection ? selection.palette_name : "None selected";
    $("selId").textContent = selection ? selection.palette_id : "";
  }

  const onKey = (e: KeyboardEvent) => { if (e.key === "Escape" && !$("drawer").hidden) closeDrawer(); };
  $("btnClose").onclick = closeDrawer;
  $("drawer").addEventListener("click", (e) => { if ((e.target as HTMLElement).id === "drawer") closeDrawer(); }, { signal });
  document.addEventListener("keydown", onKey, { signal });
  $("mRefine").onclick = () => { mode = "refine"; $("mRefine").setAttribute("aria-pressed", "true"); $("mRedesign").setAttribute("aria-pressed", "false"); applyProof(working); };
  $("mRedesign").onclick = () => { mode = "redesign"; $("mRedesign").setAttribute("aria-pressed", "true"); $("mRefine").setAttribute("aria-pressed", "false"); applyProof(working); };
  $("btnReset").onclick = () => { working = Object.assign({}, current!.roles); renderRoles(); refresh(); updateSelectButton(); };
  $("btnBorrow").onclick = () => {
    const p = allPalettes().find((x) => x.id === $<HTMLSelectElement>("borrowPal").value); if (!p) return;
    working[$<HTMLSelectElement>("borrowTo").value] = p.roles[$<HTMLSelectElement>("borrowFrom").value];
    renderRoles(); refresh(); updateSelectButton(); toast("Colour borrowed from " + p.name);
  };
  $("roles").addEventListener("input", () => updateSelectButton(), { signal });
  $("btnCopy").onclick = () => { const t = tokenString(); if (navigator.clipboard) { navigator.clipboard.writeText(t).then(() => toast("Palette code copied"), () => selectTok()); } else selectTok(); };
  $("q").addEventListener("input", renderList, { signal });

  /* ---------- persistence (this browser only) ---------- */
  function slug(n: string) { return n.replace(/[^A-Za-z0-9]+/g, "-").replace(/^-|-$/g, "").toUpperCase().slice(0, 40) || "PALETTE"; }
  $("btnSave").onclick = () => {
    const name = $<HTMLInputElement>("saveName").value.trim();
    if (!name) { $("saveNote").textContent = "Give the palette a name first."; $("saveName").focus(); return; }
    const id = "CUSTOM-" + slug(name);
    const fails = CHECKS.filter(([f, b, n]) => contrast(working[f], working[b]) < n).map((c) => c[3]);
    const doc: Palette = {
      id, name, category: "My palettes", character: "Saved from " + current!.name + (fails.length ? ". Contrast warnings kept: " + fails.join(", ") + "." : "."),
      based_on: current!.id, roles: Object.assign({}, working), checks: CHECKS.map(([f, b, n, l]) => ({ check: l, fg: f, bg: b, ratio: contrast(working[f], working[b]), need: n, ok: contrast(working[f], working[b]) >= n })), saved_at: new Date().toISOString()};
    const next = custom.filter((p) => p.id !== id).concat(doc);
    try { localStorage.setItem(SAVED_KEY, JSON.stringify(next)); }
    catch (e) { $("saveNote").textContent = "Could not save: " + (e instanceof Error && e.message ? e.message : "the save was refused") + "."; return; }
    custom = next; renderRail(); renderList(); fillBorrow();
    $("saveNote").textContent = "Saved as " + id + ". It now appears under My palettes."; toast("Saved " + name);
  };
  $("btnSelect").onclick = () => {
    const pick: Selection = { palette_id: changed() ? current!.id + "-EDITED" : current!.id, palette_name: current!.name + (changed() ? " (edited)" : ""), roles: Object.assign({}, working) };
    try { localStorage.setItem(SELECTION_KEY, JSON.stringify(pick)); } catch { /* storage unavailable */ }
    selection = pick; showSelection(); renderList(); updateSelectButton();
    const msg = "Select this palette: " + tokenString();
    const done = () => toast("Selected " + pick.palette_name + ". All 19 colours copied");
    if (navigator.clipboard) { navigator.clipboard.writeText(msg).then(done, () => { selectTok(); }); } else selectTok();
    $("saveNote").textContent = "Selected " + pick.palette_name + ". All 19 hex codes copied.";
  };

  selection = readStore<Selection | null>(SELECTION_KEY, null); renderRail(); renderList(); showSelection();

  return () => {
    listeners.abort();
    clearTimeout(toastTimer);
    document.body.style.overflow = "";
  };
}
