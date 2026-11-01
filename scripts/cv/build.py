#!/usr/bin/env python3
"""Build public/CV.docx and public/CV.pdf from the source CV (scripts/cv/source/CV.source.docx).

The source is the hand-written Word CV. This script edits it and exports the PDF with LibreOffice:
- company names coloured by contract;
- the experience timeline drawn as a red year axis with one branch per job (green = salaried,
  yellow = the Keytchens freelance period, turning green at the CDI with a diamond), each drawing
  placed from the measured position of the job titles (two LibreOffice passes);
- an open source section at the bottom, with the pull request counts of data/opensource.ts;
- header and metadata fixes (title, contact line).

Usage: python3 scripts/cv/build.py [--source scripts/cv/source/CV.source.docx] [--out public]
Needs Python 3.10+, LibreOffice (`soffice` on PATH), Google Chrome (env CHROME), pdftotext (poppler)
and ImageMagick (`magick`). Python standard library only.
"""
import argparse
import datetime
import os
import re
import shutil
import subprocess
import sys
import tempfile
import zipfile
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent.parent
_args = argparse.ArgumentParser(description="Build CV.docx and CV.pdf from the source CV.")
_args.add_argument("--source", type=Path, default=HERE / "source" / "CV.source.docx", help="source Word CV")
_args.add_argument("--out", type=Path, default=ROOT / "public", help="folder that receives CV.docx and CV.pdf")
ARGS = _args.parse_args()
SRC = ARGS.source.resolve()
OUT = ARGS.out.resolve()
WORK = HERE / ".build"  # scratch files, gitignored
LO_PROFILE = Path(tempfile.gettempdir()) / "cv-build-libreoffice-profile"
CHROME = os.environ.get("CHROME", "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome")


def require_tools():
    missing = []
    if not Path(CHROME).exists() and not shutil.which(CHROME):
        missing.append(f"Google Chrome not found at {CHROME!r}: set the CHROME environment variable to its binary")
    for tool, hint in (("soffice", "LibreOffice"), ("pdftotext", "poppler"), ("magick", "ImageMagick")):
        if not shutil.which(tool):
            missing.append(f"`{tool}` not found on PATH: install {hint}")
    if not SRC.exists():
        missing.append(f"source CV not found: {SRC}")
    if missing:
        sys.exit("cannot build the CV:\n- " + "\n- ".join(missing))
PX = 4  # strip pixels per point
EMU = 12700  # EMU per point

RED = "DC2626"
GREEN = "3F7A0B"
NEUTRAL = "111827"
# Contract per job (key = the drawing name git-XXX), from LinkedIn: every job on the trunk is
# salaried (CDI, Mobelite CDD); Keytchens was freelance 09/2018 - 08/2020, then CDI (its name
# follows the CDI, the freelance phase line stays green).
CONTRACTS = {name: "permanent" for name in ("ORPI", "CCM", "KEY", "MAT", "MOB", "PIX", "ARG")}

# Jobs, newest first: drawing name -> (start, end) as (year, month); None = ongoing.
# Salaried jobs (CDI, CDD, full time) are green branches, the freelance period a yellow one.
# These dates mirror the experience chapter (i18n `experience.items` and data/experience.ts):
# update both when a job changes. The drawing names are those of the pictures in the source CV.
_today = datetime.date.today()
NOW = (_today.year, _today.month)
JOBS = {
    "ORPI": ((2025, 9), None),
    "CCM": ((2024, 9), (2025, 8)),
    "KEY": ((2020, 9), (2024, 8)),  # CDI
    "MAT": ((2019, 7), (2020, 8)),
    "MOB": ((2018, 12), (2019, 3)),
    "PIX": ((2018, 3), (2018, 11)),
    "ARG": ((2016, 11), (2017, 10)),
}
# Keytchens: one branch, freelance (yellow) 09/2018 - 08/2020, then CDI (green) 09/2020 - 08/2024
KEYTCHENS = {"start": (2018, 9), "freelance_end": (2020, 8), "cdi_start": (2020, 9), "end": (2024, 8), "label": "freelance Keytchens"}
COUNTRY = {1: ("#eef7e1", "FRANCE"), 2: ("#fdeceb", "TUNISIE")}  # tint of the year column per page
AXIS_RED, GREEN_LINE, YELLOW_LINE = "#ec3b33", "#4f9a12", "#efb000"
AX, LANE_G, LANE_Y = 97, 118, 137  # x of the axis and of the two branch lanes (px, 4 px = 1 pt)
STRIP_W = 150  # px: 37.5 pt, just inside the 38 pt text indent
YEAR_FONT = 35  # px: 8.75 pt


# Logo marks (Simple Icons, CC0, and neutral marks) shared with the open source page
LOGOS_JS = ROOT / "utils" / "anatomy" / "logos.mjs"
OPENSOURCE_TS = ROOT / "data" / "opensource.ts"
EXTRA_RELS = []  # (id, type, target, external)
EXTRA_MEDIA = {}  # zip name -> svg (rendered to png at build time)
IMG = "http://schemas.openxmlformats.org/officeDocument/2006/relationships/image"
LINK = "http://schemas.openxmlformats.org/officeDocument/2006/relationships/hyperlink"


def rel(rid, target, kind=LINK):
    EXTRA_RELS.append((rid, kind, target, kind == LINK))
    return rid


def logo_path(key):
    m = re.search(rf'^  {key}: "([^"]+)"', LOGOS_JS.read_text(), re.M)
    if not m:
        sys.exit(f"logo {key!r} not found in {LOGOS_JS}")
    return m.group(1)


def pr_counts():
    """Merged / open pull requests per repository, from the portfolio's data/opensource.ts."""
    import json
    text = OPENSOURCE_TS.read_text()
    block = text[text.index("export const pullRequests"):]
    prs = json.loads(block[block.index("= [") + 2: block.index("\n]") + 2])
    out = {}
    for pr in prs:
        c = out.setdefault(pr["repo"], {"merged": 0, "open": 0})
        c[pr["state"]] += 1
    return out


def dec(ym):
    return ym[0] + (ym[1] - 1) / 12


def run(*cmd, **kw):
    return subprocess.run(cmd, check=True, capture_output=True, text=True, **kw).stdout


def to_pdf(docx: Path) -> Path:
    run("soffice", f"-env:UserInstallation={LO_PROFILE.as_uri()}", "--headless", "--convert-to", "pdf", "--outdir", str(docx.parent), str(docx))
    return docx.with_suffix(".pdf")


def words(pdf: Path):
    """[(page, xMin, yMin, xMax, yMax, text)] from pdftotext -bbox."""
    html = run("pdftotext", "-bbox", str(pdf), "-")
    out = []
    page = 0
    for line in html.splitlines():
        if "<page " in line:
            page += 1
        m = re.search(r'xMin="([\d.]+)" yMin="([\d.]+)" xMax="([\d.]+)" yMax="([\d.]+)">([^<]*)<', line)
        if m:
            out.append((page, *map(float, m.groups()[:4]), m.group(5)))
    return out


def measure(pdf: Path, titles):
    """Page, title top and content bottom of every job, in points."""
    ws = words(pdf)
    found = []
    for name, title in titles:
        first = title.split()[0]
        second = title.split()[1] if len(title.split()) > 1 else None
        hit = None
        for i, w in enumerate(ws):
            if w[5] == first and abs(w[1] - 81.3) < 1.5 and (second is None or ws[i + 1][5] == second):
                if not found or (w[0], w[2]) > (found[-1]["page"], found[-1]["title"]):
                    hit = (i, w)
                    break
        if not hit:
            sys.exit(f"title not found: {title}")
        i, w = hit
        stack = next(x for x in ws[i + 1:] if x[5] == "Stack" and abs(x[1] - 81.3) < 1.5)
        found.append({"name": name, "page": w[0], "title": w[2], "stack_bottom": stack[4]})
    return found


def page_svg(page, top, bottom, anchors, layout_page, first_page, last_page):
    """The time axis for one page: red axis graduated by year, green branches for the salaried
    jobs (start date -> end date), the yellow freelance branch. `anchors`: [(date, y_pt)] on this page."""
    h = (bottom - top) * PX
    pts = sorted(anchors, key=lambda a: -a[0])  # newest (top) first

    def y_of(d):
        if not pts or d > pts[0][0] + 1e-9 or d < pts[-1][0] - 1e-9:
            return None
        for (d0, y0), (d1, y1) in zip(pts, pts[1:]):
            if d1 <= d <= d0:
                y = y0 + (d0 - d) / (d0 - d1) * (y1 - y0) if d0 != d1 else y0
                return (y - top) * PX
        return None

    tint, _country = COUNTRY[page]
    out = [f'<rect x="0" y="0" width="{AX - 12}" height="{h:.1f}" fill="{tint}"/>']
    # axis: from the newest date on the page (or the page top) to the oldest (or the page bottom)
    ax_top = y_of(pts[0][0]) if first_page else 0
    ax_bottom = y_of(pts[-1][0]) if last_page else h
    out.append(f'<line x1="{AX}" y1="{ax_top:.1f}" x2="{AX}" y2="{ax_bottom:.1f}" stroke="{AXIS_RED}" stroke-width="10" stroke-linecap="round"/>')
    if first_page:  # today: the axis goes on
        out.append(f'<path d="M{AX - 13} {ax_top + 16:.1f} L{AX} {ax_top - 2:.1f} L{AX + 13} {ax_top + 16:.1f}" fill="none" stroke="{AXIS_RED}" stroke-width="7"/>')
    # year ticks with their label, left of the axis
    for year in range(2016, NOW[0] + 1):
        y = y_of(year)
        if y is None or y < 30 or y > h - 10:
            continue
        out.append(f'<line x1="{AX - 16}" y1="{y:.1f}" x2="{AX}" y2="{y:.1f}" stroke="{AXIS_RED}" stroke-width="5"/>')
        # a tick just above the start dot (labelled 2016) gets its label above the tick, not on it
        near_start = last_page and 0 < ax_bottom - y < 56
        base = y - 6 if near_start else y + 12
        out.append(f'<text x="{AX - 18}" y="{base:.1f}" text-anchor="end" font-family="Arial" font-weight="700" font-size="{YEAR_FONT}" fill="#7f1d1d">{year}</text>')
    if last_page:  # where it all started
        out.append(f'<circle cx="{AX}" cy="{ax_bottom:.1f}" r="9" fill="{AXIS_RED}"/>')
        out.append(f'<text x="{AX - 18}" y="{ax_bottom + 12:.1f}" text-anchor="end" font-family="Arial" font-weight="700" font-size="{YEAR_FONT}" fill="#7f1d1d">2016</text>')

    def branch(x, colour, d0, d1, label=None):
        y0 = y_of(d0)  # start (lower)
        y1 = y_of(d1) if d1 is not None else None  # end (higher)
        parts = []
        top_y = y1 if y1 is not None else (y_of(dec(NOW)) if d1 is None and y_of(dec(NOW)) is not None else 0)
        bottom_y = y0 if y0 is not None else h
        if y0 is not None:  # leaves the axis at its start date
            parts.append(f'<path d="M{AX} {y0:.1f} C{AX + 18} {y0:.1f} {x} {y0 - 4:.1f} {x} {y0 - 22:.1f}" fill="none" stroke="{colour}" stroke-width="8"/>')
            parts.append(f'<circle cx="{AX}" cy="{y0:.1f}" r="8" fill="#fff" stroke="{colour}" stroke-width="5"/>')
            bottom_y = y0 - 22
        if d1 is None:  # ongoing: open arrow at the top
            parts.append(f'<line x1="{x}" y1="{bottom_y:.1f}" x2="{x}" y2="{top_y + 2:.1f}" stroke="{colour}" stroke-width="8"/>')
            parts.append(f'<path d="M{x - 11} {top_y + 16:.1f} L{x} {top_y:.1f} L{x + 11} {top_y + 16:.1f}" fill="none" stroke="{colour}" stroke-width="6"/>')
        elif y1 is not None:  # closed at its end date
            parts.append(f'<line x1="{x}" y1="{bottom_y:.1f}" x2="{x}" y2="{y1:.1f}" stroke="{colour}" stroke-width="8"/>')
            parts.append(f'<circle cx="{x}" cy="{y1:.1f}" r="7" fill="#fff" stroke="{colour}" stroke-width="5"/>')
            parts.append(f'<line x1="{x - 9}" y1="{y1 - 13:.1f}" x2="{x + 9}" y2="{y1 - 13:.1f}" stroke="{colour}" stroke-width="5"/>')
        else:  # runs on past the page top
            parts.append(f'<line x1="{x}" y1="{bottom_y:.1f}" x2="{x}" y2="0" stroke="{colour}" stroke-width="8"/>')
        if label and (bottom_y - top_y) > 260:
            cy = (bottom_y + (top_y if y1 is not None else 0)) / 2
            size = 18
            length = len(label) * size * 0.58 + 16
            parts.append(f'<rect x="{x - 11}" y="{cy - length / 2:.1f}" width="22" height="{length:.1f}" fill="#fff"/>')
            parts.append(f'<text transform="translate({x + 6} {cy:.1f}) rotate(-90)" text-anchor="middle" font-family="Arial" font-weight="700" font-size="{size}" fill="#a06d00">{label}</text>')
        return "".join(parts)

    def vlabel(x, cy, text, colour, size=18):
        length = len(text) * size * 0.58 + 16
        return (f'<rect x="{x - 11}" y="{cy - length / 2:.1f}" width="22" height="{length:.1f}" fill="#fff"/>'
                f'<text transform="translate({x + 6} {cy:.1f}) rotate(-90)" text-anchor="middle" font-family="Arial" font-weight="700" font-size="{size}" fill="{colour}">{text}</text>')

    def keytchens(x):
        """One branch: yellow while freelance, green once the contract became a CDI, with a diamond
        at the change (between 08/2020 and 09/2020) and a closed cap at the end (08/2024)."""
        k = KEYTCHENS
        y0, y_end = y_of(dec(k["start"])), y_of(dec(k["end"]))
        ya, yb = y_of(dec(k["freelance_end"])), y_of(dec(k["cdi_start"]))
        yc = (ya + yb) / 2 if ya is not None and yb is not None else None
        parts = []
        bottom = h
        if y0 is not None:
            parts.append(f'<path d="M{AX} {y0:.1f} C{AX + 18} {y0:.1f} {x} {y0 - 4:.1f} {x} {y0 - 22:.1f}" fill="none" stroke="{YELLOW_LINE}" stroke-width="8"/>')
            parts.append(f'<circle cx="{AX}" cy="{y0:.1f}" r="8" fill="#fff" stroke="{YELLOW_LINE}" stroke-width="5"/>')
            bottom = y0 - 22
        yellow_top = yc if yc is not None else (0 if y_end is None else None)
        if yellow_top is not None:
            parts.append(f'<line x1="{x}" y1="{bottom:.1f}" x2="{x}" y2="{yellow_top:.1f}" stroke="{YELLOW_LINE}" stroke-width="8"/>')
            if bottom - yellow_top > 260:
                parts.append(vlabel(x, (bottom + yellow_top) / 2, k["label"], "#a06d00"))
        if y_end is not None:
            green_bottom = yc if yc is not None else h
            parts.append(f'<line x1="{x}" y1="{green_bottom:.1f}" x2="{x}" y2="{y_end:.1f}" stroke="{GREEN_LINE}" stroke-width="8"/>')
            parts.append(f'<circle cx="{x}" cy="{y_end:.1f}" r="7" fill="#fff" stroke="{GREEN_LINE}" stroke-width="5"/>')
            parts.append(f'<line x1="{x - 9}" y1="{y_end - 13:.1f}" x2="{x + 9}" y2="{y_end - 13:.1f}" stroke="{GREEN_LINE}" stroke-width="5"/>')
        if yc is not None:  # contract change: freelance -> CDI
            parts.append(vlabel(x, yc - 46, "CDI", "#3f7a0b", 17))
            parts.append(f'<path d="M{x} {yc - 11:.1f} L{x + 11} {yc:.1f} L{x} {yc + 11:.1f} L{x - 11} {yc:.1f} Z" fill="{GREEN_LINE}" stroke="#fff" stroke-width="2.5"/>')
        return "".join(parts)

    out.append(keytchens(LANE_Y))
    for j in layout_page:
        if j["name"] == "KEY":  # drawn by keytchens() on the outer lane
            continue
        start, end = JOBS[j["name"]]
        out.append(branch(LANE_G, GREEN_LINE, dec(start), dec(end) if end else None))
    return f'<svg xmlns="http://www.w3.org/2000/svg" width="{STRIP_W}" height="{round(h)}" viewBox="0 0 {STRIP_W} {round(h)}">{"".join(out)}</svg>'


def render_any(svgs):
    """Chrome draws every SVG on one page (stacked), magick cuts them out at their own sizes."""
    html = WORK / "pics.html"
    sizes = {n: (int(v.split('width="')[1].split('"')[0]), int(v.split('height="')[1].split('"')[0])) for n, v in svgs.items()}
    y, cells, at = 0, [], {}
    for n, svg in svgs.items():
        at[n] = y
        cells.append(f'<div style="position:absolute;left:0;top:{y}px">{svg}</div>')
        y += sizes[n][1] + 4
    html.write_text(f'<!doctype html><html><body style="margin:0;background:transparent">{"".join(cells)}</body></html>')
    shot = WORK / "pics.png"
    run(CHROME, "--headless", "--disable-gpu", "--hide-scrollbars", "--force-device-scale-factor=1", "--default-background-color=00000000",
        f"--window-size={max(w for w, _ in sizes.values()) + 20},{y + 20}", f"--screenshot={shot}", html.as_uri())
    out = {}
    for n, (w, h) in sizes.items():
        png = WORK / f"{n}.png"
        run("magick", str(shot), "-crop", f"{w}x{h}+0+{at[n]}", "+repage", "-strip", "-define", "png:exclude-chunk=date,time", str(png))
        out[n] = png
    return out


def render_strips(svgs):
    """One page holding every drawing side by side; Chrome draws it, magick cuts them out."""
    html = WORK / "strips.html"
    height = max(int(s.split('height="')[1].split('"')[0]) for s in svgs.values()) + 8
    cells = "".join(f'<div style="position:absolute;left:{i * (STRIP_W + 4)}px;top:0">{svg}</div>' for i, svg in enumerate(svgs.values()))
    html.write_text(f'<!doctype html><html><body style="margin:0;background:transparent">{cells}</body></html>')
    shot = WORK / "strips.png"
    run(CHROME, "--headless", "--disable-gpu", "--hide-scrollbars", "--force-device-scale-factor=1", "--default-background-color=00000000",
        f"--window-size={len(svgs) * (STRIP_W + 4) + 20},{height}", f"--screenshot={shot}", html.as_uri())
    files = {}
    for i, (name, svg) in enumerate(svgs.items()):
        h = int(svg.split('height="')[1].split('"')[0])
        png = WORK / f"axis-{name}.png"
        run("magick", str(shot), "-crop", f"{STRIP_W}x{h}+{i * (STRIP_W + 4)}+0", "+repage", "-strip", "-define", "png:exclude-chunk=date,time", str(png))
        files[name] = png
    return files


def picture(rid, name, w_pt, h_pt, pid, inline=True, anchor_xml=""):
    cx, cy = round(w_pt * EMU), round(h_pt * EMU)
    graphic = (f'<a:graphic xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"><a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture">'
               f'<pic:pic xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture"><pic:nvPicPr><pic:cNvPr id="0" name="{name}.png"/><pic:cNvPicPr/></pic:nvPicPr>'
               f'<pic:blipFill><a:blip r:embed="{rid}"/><a:stretch><a:fillRect/></a:stretch></pic:blipFill>'
               f'<pic:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="{cx}" cy="{cy}"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></pic:spPr></pic:pic></a:graphicData></a:graphic>')
    lock = '<wp:cNvGraphicFramePr><a:graphicFrameLocks xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" noChangeAspect="1"/></wp:cNvGraphicFramePr>'
    doc_pr = f'<wp:docPr id="{pid}" name="{name}" descr=""/>'
    if inline:
        return f'<w:r><w:drawing><wp:inline distT="0" distB="0" distL="0" distR="0"><wp:extent cx="{cx}" cy="{cy}"/><wp:effectExtent l="0" t="0" r="0" b="0"/>{doc_pr}{lock}{graphic}</wp:inline></w:drawing></w:r>'
    return (f'<w:r><w:drawing><wp:anchor distT="0" distB="0" distL="0" distR="0" simplePos="0" allowOverlap="1" behindDoc="1" locked="0" layoutInCell="1" relativeHeight="3000">'
            f'<wp:simplePos x="0" y="0"/>{anchor_xml}<wp:extent cx="{cx}" cy="{cy}"/><wp:effectExtent l="0" t="0" r="0" b="0"/><wp:wrapNone/>{doc_pr}{lock}{graphic}</wp:anchor></w:drawing></w:r>')


def edit_text(xml):
    # company names by contract: the run right after each job title paragraph
    for name in JOBS:
        m = re.search(rf'name="git-{name}".*?</w:p><w:p>.*?<w:color w:val="{GREEN}"/>', xml, re.S)
        if not m:
            sys.exit(f"company run not found: {name}")
        colour = {"permanent": RED, "freelance": GREEN}.get(CONTRACTS.get(name), NEUTRAL)
        xml = xml[: m.end() - len(f'<w:color w:val="{GREEN}"/>')] + f'<w:color w:val="{colour}"/>' + xml[m.end():]
    # header contact line: his own site, not pepprio.com (Pepprio stays in Projets)
    xml, n = re.subn(r'<w:r><w:rPr>(?:(?!</w:r>).)*?<w:t xml:space="preserve">   ·   </w:t></w:r><w:hyperlink w:history="1" r:id="[^"]+"><w:r><w:rPr>(?:(?!</w:r>).)*?<w:t xml:space="preserve">pepprio\.com</w:t></w:r></w:hyperlink>', "", xml, count=1, flags=re.S)
    if n != 1:
        sys.exit("pepprio.com not found in the header")
    # Keytchens phases follow the graph: freelance in yellow, CDI in green
    at = xml.index("Freelance, à distance · ")
    p0 = xml.rindex("<w:p>", 0, at)
    p1 = xml.index("</w:p>", xml.index("</w:p>", at) + 6) + 6
    block = xml[p0:p1]
    block = block.replace('w:color="7BC313"', 'w:color="EFB000"', 1).replace(f'<w:color w:val="{GREEN}"/>', '<w:color w:val="A06D00"/>', 1)
    block = block.replace('w:color="DC2626" w:sz="12"', 'w:color="4F9A12" w:sz="12"', 1)
    cdi = block.index("CDI · ")
    block = block[:cdi] + block[cdi:].replace(f'<w:color w:val="{RED}"/>', f'<w:color w:val="{GREEN}"/>', 1)
    xml = xml[:p0] + block + xml[p1:]
    # legend of the graph: a picture at the right end of the section heading, so the heading
    # stays plain text for CV parsers
    legend_svg = ('<svg xmlns="http://www.w3.org/2000/svg" width="880" height="40" viewBox="0 0 880 40" font-family="Arial" font-weight="700" font-size="27">'
                  '<rect x="40" y="8" width="9" height="26" fill="#4f9a12"/><text x="58" y="31" fill="#4f9a12">salarié (CDI, CDD)</text>'
                  '<rect x="350" y="8" width="9" height="26" fill="#efb000"/><text x="368" y="31" fill="#b07d00">freelance</text>'
                  '<path d="M546 9 L557 21 L546 33 L535 21 Z" fill="#4f9a12"/><text x="566" y="31" fill="#4f9a12">CDI</text>'
                  '<text x="880" y="31" text-anchor="end" fill="#b91c1c">axe : années</text></svg>')
    EXTRA_MEDIA["word/media/cv-legend.png"] = legend_svg
    rel("rIdLegend", "media/cv-legend.png", IMG)
    h = xml.index("Expérience professionnelle</w:t></w:r></w:p>")
    end = h + len("Expérience professionnelle</w:t></w:r>")
    pos = '<wp:positionH relativeFrom="margin"><wp:align>right</wp:align></wp:positionH><wp:positionV relativeFrom="paragraph"><wp:posOffset>50800</wp:posOffset></wp:positionV>'
    xml = xml[:end] + picture("rIdLegend", "cv-legend", 220, 10, 90, inline=False, anchor_xml=pos) + xml[end:]
    # Mobelite was a fixed-term contract
    at = xml.index('<w:t xml:space="preserve">Mobelite</w:t>')
    loc = xml.index('<w:t xml:space="preserve">  ·  Tunis, Tunisie</w:t>', at)
    xml = xml[:loc] + '<w:t xml:space="preserve">  ·  Tunis, Tunisie · CDD</w:t>' + xml[loc + len('<w:t xml:space="preserve">  ·  Tunis, Tunisie</w:t>'):]
    # open source contributions at the bottom
    heading = re.search(r'(<w:p><w:pPr><w:pStyle w:val="Heading1"/>.*?<w:t xml:space="preserve">)Langues et centres d&apos;intérêt(</w:t></w:r></w:p>)', xml, re.S)
    head = heading.group(1).rsplit("<w:p>", 1)[-1]
    head = "<w:p>" + head
    font = '<w:rFonts w:ascii="Arial" w:cs="Arial" w:eastAsia="Arial" w:hAnsi="Arial"/>'

    def run_(text, colour="374151", bold=False, size=18):
        b = "<w:b/><w:bCs/>" if bold else ""
        return f'<w:r><w:rPr>{font}{b}<w:color w:val="{colour}"/><w:sz w:val="{size}"/><w:szCs w:val="{size}"/></w:rPr><w:t xml:space="preserve">{text}</w:t></w:r>'

    def para(*runs, after=40):
        return f'<w:p><w:pPr><w:keepLines/><w:spacing w:after="{after}" w:line="252"/></w:pPr>{"".join(runs)}</w:p>'

    def link(rid, text):
        return f'<w:hyperlink w:history="1" r:id="{rid}">{run_(text, GREEN)}</w:hyperlink>'

    # The three Symfony bundles stay in "Projets" and are linked again in the contributions section
    rid_of = {}
    for title in ("Symfony CRUD Template Bundle", "Symfony Mouse Tracker", "Symfony Diagram Bundle"):
        at = xml.index(f'<w:t xml:space="preserve">{title}</w:t>')
        start = xml.rindex("<w:p>", 0, at)
        end = xml.index("</w:p>", xml.index("</w:p>", at) + 6) + 6
        rid_of[title] = re.search(r'r:id="([^"]+)"', xml[start:end]).group(1)
    # clear space between the end of the timeline (2016) and the "Projets" heading
    at = xml.index('<w:t xml:space="preserve">Projets</w:t>')
    hp = xml.rindex("<w:p>", 0, at)
    xml = xml[:hp] + xml[hp:at].replace('<w:spacing w:after="70" w:before="170"/>', '<w:spacing w:after="70" w:before="420"/>', 1) + xml[at:]
    sep = run_("  ·  ", "6B7280")

    def sub(text):
        return f'<w:p><w:pPr><w:keepNext/><w:spacing w:after="40" w:before="100"/></w:pPr>{run_(text, "111827", True, 19)}</w:p>'

    def item(name, links, text, icon=None):
        first = [icon] if icon else []
        first += [run_(name, NEUTRAL, True, 19)]
        for rid, label in links:
            first += [sep, link(rid, label)]
        return (f'<w:p><w:pPr><w:keepNext/><w:spacing w:after="10" w:before="60"/></w:pPr>{"".join(first)}</w:p>'
                + para(run_(text), after=30))

    own = [
        ("diagram-bundle", [(rel("rIdPkgDiagram", "https://packagist.org/packages/benmacha/diagram-bundle"), "packagist.org/packages/benmacha/diagram-bundle"), (rid_of["Symfony Diagram Bundle"], "github.com/BenMacha/diagram-bundle")],
         "Diagramme entité-relation interactif de Doctrine pour Symfony 5.4 – 7.x : API JSON, studio React, export SVG / PNG / JDL."),
        ("mousetracker", [(rel("rIdPkgMouse", "https://packagist.org/packages/benmacha/mousetracker"), "packagist.org/packages/benmacha/mousetracker"), (rid_of["Symfony Mouse Tracker"], "github.com/BenMacha/mouseTracker")],
         "Heatmaps, scroll maps et relecture de sessions auto-hébergées pour Symfony, alternative open source à Hotjar."),
        ("audit-bundle", [(rel("rIdPkgAudit", "https://packagist.org/packages/benmacha/audit-bundle"), "packagist.org/packages/benmacha/audit-bundle"), ("rIdAuditBundle", "github.com/BenMacha/audit-bundle")],
         "Audit des modifications des entités Doctrine avec retour arrière, interface web et API REST."),
        ("templatebundle", [(rel("rIdPkgTemplate", "https://packagist.org/packages/benmacha/templatebundle"), "packagist.org/packages/benmacha/templatebundle"), (rid_of["Symfony CRUD Template Bundle"], "github.com/BenMacha/Templatebundle")],
         "Génération d&apos;interfaces CRUD pour les applications Symfony."),
        ("authx-bundle", [(rel("rIdAuthx", "https://github.com/BenMacha/authx-bundle"), "github.com/BenMacha/authx-bundle")],
         "Authentification et autorisation pour Symfony : JWT, OpenID Connect, gestion des utilisateurs, journal d&apos;audit, abonnements."),
        ("omnimail-mcp", [(rel("rIdOmnimail", "https://github.com/BenMacha/omnimail-mcp"), "github.com/BenMacha/omnimail-mcp")],
         "Serveur MCP open source multi-comptes mail (iCloud, Gmail, Outlook, Yahoo, Proton, Infomaniak, IMAP), Docker, RGPD."),
        ("UberEat PHP SDK", [(rel("rIdUberEatsSdk", "https://github.com/pepprio/uber-eats-sdk-php"), "github.com/pepprio/uber-eats-sdk-php")],
         "SDK PHP de l&apos;API Uber Eats Marketplace, maintenu aujourd&apos;hui sous pepprio/uber-eats-sdk-php."),
    ]
    counts = pr_counts()

    def count_text(repos):
        merged = sum(counts.get(r, {}).get("merged", 0) for r in repos)
        opened = sum(counts.get(r, {}).get("open", 0) for r in repos)
        parts = []
        if merged:
            parts.append(f"{merged} pull request{'s' if merged > 1 else ''} fusionnée{'s' if merged > 1 else ''}")
        if opened:
            parts.append(f"{opened} en revue")
        return ", ".join(parts)

    def pr_list(repo):
        return "https://github.com/" + repo + "/pulls?q=is%3Apr+author%3ABenMacha"

    upstream = [
        ("symfony", "#000000", "Symfony", ["symfony/symfony"], [(rel("rIdUpSymfony", "https://github.com/symfony/symfony"), "github.com/symfony/symfony"), (rel("rIdPrSymfony", pr_list("symfony/symfony")), "mes pull requests")],
         "Security, Messenger, Cache, Form, RateLimiter"),
        ("apiplatform", "#374151", "API Platform", ["api-platform/core", "api-platform/api-platform"], [(rel("rIdUpApi", "https://github.com/api-platform/core"), "github.com/api-platform/core"), (rel("rIdPrApi", pr_list("api-platform/core")), "mes pull requests")],
         "Doctrine, sérialiseur, GraphQL, Laravel ; installateur api-platform/api-platform"),
        ("caddy", "#1f88c0", "Caddy", ["caddyserver/caddy"], [(rel("rIdUpCaddy", "https://github.com/caddyserver/caddy"), "github.com/caddyserver/caddy"), (rel("rIdPrCaddy", pr_list("caddyserver/caddy")), "mes pull requests")],
         "reverse proxy, fastcgi, file server, logging"),
        ("database", "#374151", "Ting – ORM de CCM Benchmark", ["ccmbenchmark/ting"], [(rel("rIdUpTing", "https://github.com/ccmbenchmark/ting"), "github.com/ccmbenchmark/ting"), (rel("rIdTingIssue", "https://github.com/ccmbenchmark/ting/issues/120"), "issue #120")],
         "injection SQL signalée dans le pilote PostgreSQL, corrigée en 4.1.1"),
    ]
    contrib = []
    for n, (key, colour, name, repos, links, topics) in enumerate(upstream):
        EXTRA_MEDIA[f"word/media/logo-{key}.png"] = f'<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24"><path fill="{colour}" fill-rule="evenodd" d="{logo_path(key)}"/></svg>'
        rid = rel(f"rIdLogo{key}", f"media/logo-{key}.png", IMG)
        icon = picture(rid, f"logo-{key}", 10, 10, 100 + n) + run_(" ")
        contrib.append(item(name, links, f"{count_text(repos)} — {topics}", icon))
    section = (
        head + "Contributions open source" + heading.group(2)
        + sub("Mes projets")
        + "".join(item(name, links, text) for name, links, text in own)
        + sub("Projets auxquels j&apos;ai contribué")
        + "".join(contrib)
        + para(run_("Tout le détail : ", NEUTRAL, True), link("rIdOpenSource", "benmacha.tn/open-source"), after=0)
    )
    return xml.replace("<w:sectPr>", section + "<w:sectPr>", 1)


def anchor_images(xml, rels, layout, files, media_names):
    by = {j["name"]: j for j in layout}
    for name, png in files.items():
        j = by[name]
        h_emu = round(j["height"] * EMU)
        w_emu = round(STRIP_W / PX * EMU)
        top_emu = round(j["top"] * EMU)
        m = re.search(rf'<wp:positionV relativeFrom="paragraph"><wp:posOffset>-?\d+</wp:posOffset></wp:positionV><wp:extent cx="(\d+)" cy="\d+"/>((?:(?!</wp:anchor>).)*?name="git-{name}"(?:(?!</wp:anchor>).)*?<a:ext cx="\d+" cy=")\d+(")', xml, re.S)
        if not m:
            sys.exit(f"anchor not found: {name}")
        xml = xml[: m.start()] + f'<wp:positionV relativeFrom="page"><wp:posOffset>{top_emu}</wp:posOffset></wp:positionV><wp:extent cx="{w_emu}" cy="{h_emu}"/>' + re.sub(r'<a:ext cx="\d+"', f'<a:ext cx="{w_emu}"', m.group(2)) + str(h_emu) + m.group(3) + xml[m.end():]
    return xml


def build():
    require_tools()
    shutil.rmtree(WORK, ignore_errors=True)
    WORK.mkdir()
    with zipfile.ZipFile(SRC) as z:
        entries = {i.filename: z.read(i.filename) for i in z.infolist()}
    xml = entries["word/document.xml"].decode()
    rels = entries["word/_rels/document.xml.rels"].decode()
    xml = edit_text(xml)
    rels = rels.replace("</Relationships>", '<Relationship Id="rIdOpenSource" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/hyperlink" Target="https://benmacha.tn/open-source" TargetMode="External"/><Relationship Id="rIdAuditBundle" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/hyperlink" Target="https://github.com/BenMacha/audit-bundle" TargetMode="External"/></Relationships>')

    rels = rels.replace("</Relationships>", "".join(
        f'<Relationship Id="{i}" Type="{t}" Target="{tg.replace("&", "&amp;")}"{" TargetMode=\"External\"" if ext else ""}/>' for i, t, tg, ext in EXTRA_RELS) + "</Relationships>")
    # rendered pictures (legend, logos)
    pics = render_any({Path(n).stem: svg for n, svg in EXTRA_MEDIA.items()})
    for n in EXTRA_MEDIA:
        entries[n] = pics[Path(n).stem].read_bytes()
    # document metadata, read by CV parsers and shown as the PDF title
    core = entries["docProps/core.xml"].decode()
    core = re.sub(r"<dc:title>.*?</dc:title>", "<dc:title>CV — Ali BEN MECHA</dc:title>", core)
    entries["docProps/core.xml"] = core.encode()

    def save(path, xml_text, media=None):
        with zipfile.ZipFile(path, "w", zipfile.ZIP_DEFLATED) as z:
            for name, data in entries.items():
                if name == "word/document.xml":
                    data = xml_text.encode()
                elif name == "word/_rels/document.xml.rels":
                    data = rels.encode()
                elif media and name in media:
                    data = media[name]
                # fixed timestamps: the same source gives the same CV.docx, byte for byte
                info = zipfile.ZipInfo(name, date_time=(2026, 1, 1, 0, 0, 0))
                info.compress_type = zipfile.ZIP_DEFLATED
                z.writestr(info, data)

    # pass 1: text only, to measure where every job title lands
    p1 = WORK / "pass1.docx"
    save(p1, xml)
    titles = []
    for name in JOBS:
        m = re.search(rf'name="git-{name}".*?</w:drawing></w:r><w:r>.*?<w:t xml:space="preserve">([^<]*)</w:t>', xml, re.S)
        titles.append((name, m.group(1).replace("&amp;", "&")))
    layout = measure(to_pdf(p1), titles)

    # one drawing per page, anchored to the first job title of that page
    pages = sorted({j["page"] for j in layout})
    svgs, frames = {}, {}
    for p in pages:
        on = [j for j in layout if j["page"] == p]
        anchors = []
        for i, j in enumerate(on):
            start, end = JOBS[j["name"]]
            row_bottom = on[i + 1]["title"] if i + 1 < len(on) else j["stack_bottom"] + (14 if p == pages[-1] else 8)
            anchors.append((dec(end) if end else dec(NOW), j["title"] + (3 if end is None else 5.5)))
            anchors.append((dec(start), row_bottom - 7))
        top = on[0]["title"] - (9 if p == pages[0] else 6) if p == pages[0] else 30.0
        bottom = on[-1]["stack_bottom"] + (14 if p == pages[-1] else 30)
        if p != pages[-1]:
            bottom = 790.0  # runs to the bottom of the page body, on to the next page
        svgs[on[0]["name"]] = page_svg(p, top, bottom, anchors, on, p == pages[0], p == pages[-1])
        frames[on[0]["name"]] = {"top": top, "height": bottom - top}
    files = render_strips(svgs)

    # the page drawings replace the images of the first job of each page; the other images go
    media = {}
    for name, png in files.items():
        rid = re.search(rf'name="git-{name}".*?r:embed="(\w+)"', xml, re.S).group(1)
        target = re.search(rf'Id="{rid}"[^>]*Target="([^"]+)"', rels).group(1)
        media[f"word/{target}"] = png.read_bytes()
    for j in layout:
        if j["name"] not in files:
            m = re.search(rf'<w:r><w:drawing>(?:(?!</w:drawing>).)*?name="git-{j["name"]}".*?</w:drawing></w:r>', xml, re.S)
            xml = xml[: m.start()] + xml[m.end():]
    xml = anchor_images(xml, rels, [{"name": n, **f} for n, f in frames.items()], files, media)
    OUT.mkdir(parents=True, exist_ok=True)
    final = OUT / "CV.docx"
    save(final, xml, media)
    pdf = to_pdf(final)
    check = measure(pdf, titles)
    for a, b in zip(layout, check):
        if (a["page"], round(a["title"], 1)) != (b["page"], round(b["title"], 1)):
            sys.exit(f"layout moved for {a['name']}: {a} vs {b}")
    for n, f in frames.items():
        print(f"{n}: drawing from {f['top']:.1f} pt, {f['height']:.1f} pt tall")
    print(f"wrote {final} and {pdf}")


build()
