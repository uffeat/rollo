import sys
from PIL import Image

if len(sys.argv) != 3:
    print("Usage: convert_image.py <input> <output>")
    sys.exit(1)

inp = sys.argv[1]
outp = sys.argv[2]

img = Image.open(inp)
if outp.lower().endswith(('.jpg', '.jpeg')) and img.mode in ("RGBA", "LA"):
    img = img.convert("RGB")
fmt = "WEBP" if outp.lower().endswith('.webp') else None
img.save(outp, format=fmt)
print(f"Saved: {outp}")
