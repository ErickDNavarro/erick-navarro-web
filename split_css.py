import re

with open('extracted_style.css', 'r', encoding='utf-8') as f:
    css = f.read()

# Remove the surrounding <style> tags
css = css.replace('<style>', '').replace('</style>', '').strip()

# We will split the CSS by blocks defined by /* ── block_name ── */
blocks = re.split(r'(/\* ──.*?── \*/)', css)

shared_css = []
home_css = []

home_keywords = [
    'Particle Canvas',
    'HERO',
    'Mid-page CTA band',
    'Hero Stats',
    'MARQUEE',
    'Pricing Cards',
    'Scramble text placeholder',
    'Contact Prominent'
]

current_dest = shared_css
shared_css.append(blocks[0]) # Initial un-commented block if any

for i in range(1, len(blocks), 2):
    header = blocks[i]
    content = blocks[i+1] if i+1 < len(blocks) else ""
    
    is_home = any(k in header for k in home_keywords)
    
    if is_home:
        home_css.append(header + content)
    else:
        shared_css.append(header + content)

with open('css/styles.css', 'w', encoding='utf-8') as f:
    f.write("".join(shared_css))

with open('css/home.css', 'w', encoding='utf-8') as f:
    f.write("".join(home_css))

print("CSS split completed.")
