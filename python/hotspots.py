from PIL import Image

def find_hotspots(image_path, hotspot_color, output_file):
    """Find hotspots in an image and return their UV coordinates, and write them to a TypeScript file."""
    with Image.open(image_path) as img:
        width, height = img.size
        pixels = img.load()

        # Dictionary to keep track of visited pixels
        visited = [[False] * height for _ in range(width)]
        hotspots = []

        def dfs_iterative(x, y):
            """Iterative DFS to find the bounds of the connected region."""
            stack = [(x, y)]
            bounds = {'min_x': x, 'max_x': x, 'min_y': y, 'max_y': y}

            while stack:
                cx, cy = stack.pop()
                if cx < 0 or cx >= width or cy < 0 or cy >= height:
                    continue
                if visited[cx][cy] or pixels[cx, cy] != hotspot_color:
                    continue

                visited[cx][cy] = True

                bounds['min_x'] = min(bounds['min_x'], cx)
                bounds['max_x'] = max(bounds['max_x'], cx)
                bounds['min_y'] = min(bounds['min_y'], cy)
                bounds['max_y'] = max(bounds['max_y'], cy)

                # Push adjacent pixels to the stack
                stack.append((cx + 1, cy))
                stack.append((cx - 1, cy))
                stack.append((cx, cy + 1))
                stack.append((cx, cy - 1))
            
            return bounds

        for x in range(width):
            for y in range(height):
                if not visited[x][y] and pixels[x, y] == hotspot_color:
                    bounds = dfs_iterative(x, y)
                    hotspots.append(bounds)

        # Write hotspots to a TypeScript file
        with open(output_file, 'w') as file:
            file.write('export const hotspots = [\n')
            for h in hotspots:
                uMin = h['min_x'] / width
                uMax = h['max_x'] / width
                vMin = h['min_y'] / height
                vMax = h['max_y'] / height
                file.write(f"  {{ uMin: {uMin:.4f}, uMax: {uMax:.4f}, vMin: {vMin:.4f}, vMax: {vMax:.4f} }},\n")
            file.write('];\n')

# Example usage
hotspot_color = (255, 0, 0, 255)  # Red with full alpha, adjust as needed
find_hotspots('./image.png', hotspot_color, 'hotspots.ts')
