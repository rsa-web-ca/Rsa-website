import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import css from "./studio.css?inline";
import { mountStudio } from "./studio";

const LOGO_COLOR = `${import.meta.env.BASE_URL}images/logo-color.png`;
const LOGO_WHITE = `${import.meta.env.BASE_URL}images/logo-white.png`;
const FONTS =
  "https://fonts.googleapis.com/css2?family=Fira+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@400;500;600&family=Source+Serif+4:opsz,wght@8..60,500;8..60,600&display=swap";

/**
 * FS Palette Studio — an unlisted internal tool at /fs-palette-studio.
 * Nothing on the site links here, it renders outside the site Layout, and it
 * is kept out of search indexes and the sitemap.
 *
 * Its stylesheet is mounted only while this route is open, so its global
 * rules (body, :root tokens) never touch the rest of the site.
 */
export default function FsPaletteStudio() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => mountStudio(root.current!), []);

  // Unlisted page: set its own title and keep it out of search results.
  useEffect(() => {
    const prevTitle = document.title;
    document.title = "FS Palette Studio";
    const robots = document.createElement("meta");
    robots.name = "robots";
    robots.content = "noindex, nofollow";
    document.head.appendChild(robots);
    return () => {
      document.title = prevTitle;
      robots.remove();
    };
  }, []);

  return (
    <div className="fs-studio" ref={root}>
      <link rel="stylesheet" href={FONTS} />
      <style>{css}</style>

      <div className="wrap">
        <header className="top">
          <div>
            <Link to="/" className="brand" aria-label="R Shivakumar & Associates — home">
              <picture>
                <source srcSet={LOGO_WHITE} media="(prefers-color-scheme: dark)" />
                <img src={LOGO_COLOR} alt="R Shivakumar & Associates, Chartered Accountants" width={2997} height={801} />
              </picture>
            </Link>
            <h1>FS Palette Studio</h1>
            <p className="sub">Browse the palettes, open one to see it applied to statements, notes, policies and the audit report, then select it or adjust any colour and save your own.</p>
          </div>
          <div className="selbox" aria-live="polite">
            <div><div className="lbl">Current selection</div><strong id="selName">None selected</strong> <span id="selId" className="note"></span></div>
          </div>
        </header>

        <div className="layout">
          <nav className="rail" id="rail" aria-label="Palette categories"></nav>
          <main>
            <div className="tools">
              <input type="search" id="q" placeholder="Search by name, ID, colour word or hex (e.g. burgundy, gold, #1F3864)" aria-label="Search palettes" />
              <span className="count" id="count"></span>
            </div>
            <div id="list"></div>
          </main>
        </div>
      </div>

      <div className="drawer" id="drawer" hidden>
        <div className="panel" role="dialog" aria-modal="true" aria-labelledby="dTitle">
          <div className="head">
            <div><div className="note" id="dId"></div><h2 id="dTitle"></h2><div className="note" id="dChar"></div></div>
            <div className="row">
              <div className="seg" role="group" aria-label="Layout preview">
                <button type="button" id="mRefine" aria-pressed="true">Refine layout</button>
                <button type="button" id="mRedesign" aria-pressed="false">Redesign layout</button>
              </div>
              <button className="btn primary" id="btnSelect" type="button">Select this palette</button>
              <button className="btn" id="btnClose" type="button">Close</button>
            </div>
          </div>
          <div className="body">
            <div className="proof-wrap"><div className="proof m-refine" id="proof"></div></div>
            <div className="bench">
              <h3>Colours and their roles</h3>
              <p className="note">Change any colour with the picker or by typing a hex code. The lighter and darker buttons step the colour by 8%. Changes preview immediately and are kept only when you save.</p>
              <div className="roles" id="roles"></div>
              <h3>Contrast checks</h3>
              <div className="checks" id="checks"></div>
              <h3>Borrow a colour from another palette</h3>
              <div className="row">
                <select id="borrowPal" aria-label="Palette to borrow from"></select>
                <select id="borrowFrom" aria-label="Colour to take"></select>
                <span className="note">into</span>
                <select id="borrowTo" aria-label="Role to replace"></select>
                <button className="btn" type="button" id="btnBorrow">Apply</button>
              </div>
              <h3>Save as my palette</h3>
              <div className="row">
                <input type="text" id="saveName" placeholder="Name, e.g. Madhus burgundy" aria-label="Name for saved palette" />
                <button className="btn primary" type="button" id="btnSave">Save</button>
                <button className="btn" type="button" id="btnReset">Reset changes</button>
              </div>
              <p className="note" id="saveNote"></p>
              <h3>Palette code</h3>
              <p className="note">All 19 colours of this palette, ready to copy.</p>
              <pre className="tok" id="tok"></pre>
              <button className="btn" type="button" id="btnCopy">Copy palette code</button>
            </div>
          </div>
        </div>
      </div>
      <div className="toast" id="toast" hidden></div>
    </div>
  );
}
