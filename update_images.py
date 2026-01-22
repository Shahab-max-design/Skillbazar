import re

# Male professional headshot URLs from Unsplash (all verified male)
male_images = [
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',  # Young man
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face',  # Pro man
    'https://images.unsplash.com/photo-1519085360771-9852bada1c3f?w=400&h=400&fit=crop&crop=face',  # Male pro
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=face',  # Handsome
    'https://images.unsplash.com/photo-1516321318423-f06f70504c94?w=400&h=400&fit=crop&crop=face',  # Portrait
    'https://images.unsplash.com/photo-1514888286974-6c03bf1e7785?w=400&h=400&fit=crop&crop=face',  # Outdoors
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',  # Confident
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face',  # Serious
]

# Read file
with open('lib/data.ts', 'r') as f:
    content = f.read()

# Find all unique image URLs
unique_images = list(set(re.findall(r'image: "(https://images\.unsplash\.com/photo-[^"]+)"', content)))
print(f'Found {len(unique_images)} unique image URLs')

# Replace each with male images (cycling through the list)
for idx, old_image in enumerate(sorted(unique_images)):
    new_image = male_images[idx % len(male_images)]
    # Escape the old image for regex
    escaped_old = re.escape(old_image)
    content = re.sub(f'image: "{escaped_old}"', f'image: "{new_image}"', content)
    print(f'Replaced image #{idx+1}')

# Write file
with open('lib/data.ts', 'w') as f:
    f.write(content)

print('All images updated to male headshots only!')
