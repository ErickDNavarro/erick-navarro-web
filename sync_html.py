import glob, re
import sys

with open('index.html', 'r', encoding='utf-8') as f:
    index_content = f.read()

# 1. Replace inline style in index.html with links
css_links = '<link rel="stylesheet" href="css/styles.css">\n    <link rel="stylesheet" href="css/home.css">'
new_index_content = re.sub(r'<style>.*?</style>', css_links, index_content, flags=re.DOTALL)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(new_index_content)
print('Updated index.html CSS links.')

# 2. Extract components
nav_match = re.search(r'<nav class="nav">.*?</nav>', index_content, flags=re.DOTALL)
footer_match = re.search(r'<footer class="footer">.*?</footer>', index_content, flags=re.DOTALL)
json_match = re.search(r'<script type="application/ld\+json">.*?</script>', index_content, flags=re.DOTALL)

if not nav_match or not footer_match:
    print('Error: Could not find nav or footer in index.html')
    sys.exit(1)

nav_html = nav_match.group(0)
footer_html = footer_match.group(0)
json_html = json_match.group(0) if json_match else ''

html_files = glob.glob('*.html')
for file in html_files:
    if file == 'index.html': continue
    
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
        
    changed = False
    
    # Unify Nav
    new_content = re.sub(r'<nav class="nav">.*?</nav>', nav_html.replace('\\', '\\\\'), content, flags=re.DOTALL)
    if new_content != content: changed = True
    content = new_content
    
    # Unify Footer
    new_content = re.sub(r'<footer class="footer">.*?</footer>', footer_html.replace('\\', '\\\\'), content, flags=re.DOTALL)
    if new_content != content: changed = True
    content = new_content
    
    # Add JSON-LD if not present
    if json_html and json_html not in content:
        # insert before </head>
        content = content.replace('</head>', f'    {json_html}\n</head>')
        changed = True
        
    if changed:
        with open(file, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f'Updated {file}')

print('HTML sync completed.')
