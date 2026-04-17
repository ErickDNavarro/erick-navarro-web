#!/usr/bin/env python3
"""
Web Audit Script — Scans a multi-page HTML site for common issues.
Usage: python audit.py /path/to/site/
"""

import os
import sys
import re
import json
from pathlib import Path
from html.parser import HTMLParser
from collections import defaultdict

class HTMLAuditor(HTMLParser):
    def __init__(self, filename):
        super().__init__()
        self.filename = filename
        self.ids = []
        self.classes_used = set()
        self.links = []
        self.images = []
        self.scripts = []
        self.stylesheets = []
        self.meta_tags = {}
        self.has_viewport = False
        self.has_title = False
        self.title_text = ""
        self.forms = []
        self.inputs_without_label = []
        self.imgs_without_alt = []
        self.inline_style_count = 0
        self.tag_stack = []
        self.nav_html = ""
        self.in_nav = False
        self.nav_depth = 0
        self.nav_links = []
        self.footer_links = []
        self.in_footer = False
        self.has_particle_canvas = False
        self.has_cursor_dot = False
        self.has_cursor_ring = False
        self.has_noise = False
        self.has_scroll_progress = False
        self.has_wa_float = False
        self.wa_href = ""
        self.duplicate_ids = []
        self.current_line = 0
        self.issues = []

    def handle_starttag(self, tag, attrs):
        attrs_dict = dict(attrs)

        # Track IDs
        if 'id' in attrs_dict:
            id_val = attrs_dict['id']
            if id_val in self.ids:
                self.duplicate_ids.append(id_val)
            self.ids.append(id_val)
            # Check known elements
            if id_val == 'particleCanvas': self.has_particle_canvas = True
            if id_val == 'cursorDot': self.has_cursor_dot = True
            if id_val == 'cursorRing': self.has_cursor_ring = True
            if id_val == 'scrollProgress': self.has_scroll_progress = True

        # Track classes
        if 'class' in attrs_dict:
            for c in attrs_dict['class'].split():
                self.classes_used.add(c)
                if c == 'noise': self.has_noise = True
                if c == 'wa-float':
                    self.has_wa_float = True
                    self.wa_href = attrs_dict.get('href', '')

        # Track links
        if tag == 'a' and 'href' in attrs_dict:
            href = attrs_dict['href']
            self.links.append(href)
            if self.in_nav:
                self.nav_links.append(href)
            if self.in_footer:
                self.footer_links.append(href)

        # Track images
        if tag == 'img':
            src = attrs_dict.get('src', '')
            alt = attrs_dict.get('alt', None)
            self.images.append({'src': src, 'alt': alt})
            if alt is None:
                self.imgs_without_alt.append(src)

        # Track scripts
        if tag == 'script' and 'src' in attrs_dict:
            self.scripts.append(attrs_dict['src'])

        # Track stylesheets
        if tag == 'link' and attrs_dict.get('rel') == 'stylesheet':
            self.stylesheets.append(attrs_dict.get('href', ''))

        # Meta tags
        if tag == 'meta':
            name = attrs_dict.get('name', attrs_dict.get('property', ''))
            content = attrs_dict.get('content', '')
            if name: self.meta_tags[name] = content
            if 'viewport' in str(attrs_dict): self.has_viewport = True

        if tag == 'title': self.has_title = True

        # Inline styles
        if 'style' in attrs_dict:
            self.inline_style_count += 1

        # Nav tracking
        if tag == 'nav':
            self.in_nav = True
            self.nav_depth = 0
        if self.in_nav:
            self.nav_depth += 1

        # Footer tracking
        if tag == 'footer':
            self.in_footer = True

        # Form tracking
        if tag == 'form':
            self.forms.append(attrs_dict)

    def handle_endtag(self, tag):
        if tag == 'nav':
            self.in_nav = False
        if tag == 'footer':
            self.in_footer = False

    def handle_data(self, data):
        pass


def check_internal_links(site_dir, html_files, auditor):
    """Check if internal links point to existing files."""
    issues = []
    for link in auditor.links:
        # Skip external, anchors, mailto, tel, javascript
        if any(link.startswith(p) for p in ['http', '#', 'mailto:', 'tel:', 'javascript:']):
            continue
        # Remove anchor from link
        clean = link.split('#')[0]
        if not clean:
            continue
        target = os.path.join(site_dir, clean)
        if not os.path.exists(target):
            issues.append(f"Broken link: '{link}' -> file not found")
    return issues


def check_css_references(site_dir, auditor):
    """Check if referenced CSS files exist."""
    issues = []
    for css in auditor.stylesheets:
        if css.startswith('http'):
            continue
        path = os.path.join(site_dir, css)
        if not os.path.exists(path):
            issues.append(f"Missing CSS: '{css}'")
    return issues


def check_js_references(site_dir, auditor):
    """Check if referenced JS files exist."""
    issues = []
    for js in auditor.scripts:
        if js.startswith('http'):
            continue
        path = os.path.join(site_dir, js)
        if not os.path.exists(path):
            issues.append(f"Missing JS: '{js}'")
    return issues


def extract_css_classes(css_content):
    """Extract class names defined in CSS."""
    pattern = r'\.([a-zA-Z_-][\w-]*)'
    return set(re.findall(pattern, css_content))


def check_placeholder_text(content, filename):
    """Check for leftover placeholder text."""
    issues = []
    placeholders = [
        ('TUNUMERO', 'Placeholder phone number'),
        ('Lorem ipsum', 'Lorem ipsum placeholder'),
        ('TODO', 'TODO marker'),
        ('FIXME', 'FIXME marker'),
        ('placeholder', 'Possible placeholder'),
        ('example.com', 'Example domain'),
    ]
    for text, desc in placeholders:
        if text in content:
            issues.append(f"Found '{text}' ({desc})")
    return issues


def audit_site(site_dir):
    """Run full audit on the site directory."""
    site_dir = os.path.abspath(site_dir)

    if not os.path.isdir(site_dir):
        print(f"ERROR: {site_dir} is not a directory")
        sys.exit(1)

    # Find all HTML files
    html_files = sorted(Path(site_dir).glob('*.html'))
    css_files = sorted(Path(site_dir).rglob('*.css'))
    js_files = sorted(Path(site_dir).rglob('*.js'))

    print(f"\n{'='*60}")
    print(f" WEB AUDIT REPORT")
    print(f" Site: {site_dir}")
    print(f" HTML files: {len(html_files)}")
    print(f" CSS files: {len(css_files)}")
    print(f" JS files: {len(js_files)}")
    print(f"{'='*60}\n")

    # Load CSS classes
    all_css_classes = set()
    for css_file in css_files:
        content = css_file.read_text(encoding='utf-8', errors='ignore')
        all_css_classes.update(extract_css_classes(content))

    # Audit each HTML file
    all_results = {}
    all_nav_links = {}
    all_footer_links = {}

    critical = []
    high = []
    medium = []
    low = []

    for html_file in html_files:
        fname = html_file.name
        content = html_file.read_text(encoding='utf-8', errors='ignore')

        auditor = HTMLAuditor(fname)
        try:
            auditor.feed(content)
        except Exception as e:
            critical.append(f"[{fname}] HTML parse error: {e}")
            continue

        all_results[fname] = auditor
        all_nav_links[fname] = sorted(auditor.nav_links)
        all_footer_links[fname] = sorted(auditor.footer_links)

        # ── CRITICAL ──
        broken = check_internal_links(site_dir, html_files, auditor)
        for b in broken:
            critical.append(f"[{fname}] {b}")

        css_issues = check_css_references(site_dir, auditor)
        for c in css_issues:
            critical.append(f"[{fname}] {c}")

        js_issues = check_js_references(site_dir, auditor)
        for j in js_issues:
            critical.append(f"[{fname}] {j}")

        if auditor.duplicate_ids:
            for dup in auditor.duplicate_ids:
                high.append(f"[{fname}] Duplicate ID: '{dup}'")

        # ── HIGH ──
        if not auditor.has_title:
            high.append(f"[{fname}] Missing <title> tag")

        if not auditor.has_viewport:
            high.append(f"[{fname}] Missing viewport meta tag")

        if not auditor.has_particle_canvas:
            high.append(f"[{fname}] Missing #particleCanvas")

        if not auditor.has_cursor_dot:
            medium.append(f"[{fname}] Missing #cursorDot")

        if not auditor.has_cursor_ring:
            medium.append(f"[{fname}] Missing #cursorRing")

        if not auditor.has_noise:
            medium.append(f"[{fname}] Missing .noise overlay")

        if not auditor.has_scroll_progress:
            medium.append(f"[{fname}] Missing #scrollProgress")

        if not auditor.has_wa_float:
            medium.append(f"[{fname}] Missing WhatsApp float button")

        # ── MEDIUM ──
        placeholders = check_placeholder_text(content, fname)
        for p in placeholders:
            medium.append(f"[{fname}] {p}")

        # Check if page uses shared CSS
        uses_shared_css = any('styles.css' in s for s in auditor.stylesheets)
        has_inline_styles_tag = '<style>' in content
        # index.html is special (has inline styles from before)
        if fname != 'index.html' and not uses_shared_css:
            high.append(f"[{fname}] Does not reference shared css/styles.css")

        uses_shared_js = any('main.js' in s for s in auditor.scripts)
        if fname != 'index.html' and not uses_shared_js:
            high.append(f"[{fname}] Does not reference shared js/main.js")

        # Check GSAP imports
        has_gsap = any('gsap' in s for s in auditor.scripts)
        if not has_gsap:
            high.append(f"[{fname}] Missing GSAP CDN import")

        # Check Google Fonts
        has_fonts = any('fonts.googleapis.com' in s for s in auditor.stylesheets)
        if not has_fonts:
            medium.append(f"[{fname}] Missing Google Fonts import")

        # ── LOW ──
        if auditor.inline_style_count > 10 and fname != 'index.html':
            low.append(f"[{fname}] {auditor.inline_style_count} inline styles (consider moving to CSS)")

        for img in auditor.imgs_without_alt:
            low.append(f"[{fname}] Image without alt: '{img}'")

    # ── CROSS-PAGE CHECKS ──
    print("── CROSS-PAGE CONSISTENCY ──\n")

    # Nav consistency
    nav_sets = {}
    for fname, nav in all_nav_links.items():
        key = str(nav)
        if key not in nav_sets:
            nav_sets[key] = []
        nav_sets[key].append(fname)

    if len(nav_sets) > 1:
        medium.append("NAV INCONSISTENCY: Pages have different navigation links:")
        for nav_str, files in nav_sets.items():
            medium.append(f"  Nav {nav_str}: {', '.join(files)}")

    # Footer consistency
    footer_sets = {}
    for fname, footer in all_footer_links.items():
        key = str(footer)
        if key not in footer_sets:
            footer_sets[key] = []
        footer_sets[key].append(fname)

    if len(footer_sets) > 1:
        medium.append("FOOTER INCONSISTENCY: Pages have different footer links:")
        for f_str, files in footer_sets.items():
            medium.append(f"  Footer {f_str}: {', '.join(files)}")

    # WhatsApp number consistency
    wa_numbers = {}
    for fname, aud in all_results.items():
        if aud.wa_href:
            wa_numbers.setdefault(aud.wa_href, []).append(fname)

    if len(wa_numbers) > 1:
        medium.append("WHATSAPP INCONSISTENCY: Different numbers on different pages:")
        for href, files in wa_numbers.items():
            medium.append(f"  '{href}': {', '.join(files)}")

    # ── PRINT REPORT ──
    def print_section(title, items, icon):
        if items:
            print(f"\n{icon} {title} ({len(items)} issues)")
            print(f"{'─'*50}")
            for item in items:
                print(f"  {item}")
        else:
            print(f"\n✅ {title}: No issues found")

    print_section("CRITICAL", critical, "🔴")
    print_section("HIGH", high, "🟠")
    print_section("MEDIUM", medium, "🟡")
    print_section("LOW", low, "🔵")

    total = len(critical) + len(high) + len(medium) + len(low)
    print(f"\n{'='*60}")
    print(f" TOTAL: {total} issues found")
    print(f"   🔴 Critical: {len(critical)}")
    print(f"   🟠 High: {len(high)}")
    print(f"   🟡 Medium: {len(medium)}")
    print(f"   🔵 Low: {len(low)}")
    print(f"{'='*60}\n")

    # Return structured data
    return {
        'critical': critical,
        'high': high,
        'medium': medium,
        'low': low,
        'total': total,
        'files_scanned': len(html_files),
        'nav_groups': len(nav_sets),
        'footer_groups': len(footer_sets),
    }


if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("Usage: python audit.py /path/to/site/")
        sys.exit(1)

    results = audit_site(sys.argv[1])

    # Save JSON report
    report_path = os.path.join(sys.argv[1], 'audit-report.json')
    with open(report_path, 'w') as f:
        json.dump(results, f, indent=2, ensure_ascii=False)
    print(f"📄 JSON report saved to: {report_path}")
