import os
import sys
import base64
import argparse
from io import BytesIO

try:
    from openai import OpenAI
except ImportError:
    print("The 'openai' package is not installed. Run: pip install -r e:/rollo/client/scripts/requirements.txt", file=sys.stderr)
    sys.exit(1)


def main():
    parser = argparse.ArgumentParser(description="Generate an image via OpenAI and save it locally.")
    parser.add_argument("--prompt", required=True, help="Text prompt describing the image to generate.")
    parser.add_argument("--out", required=True, help="Output image file path (e.g., e:/rollo/client/client/public/images/viper_ai.png)")
    parser.add_argument("--size", default="1024x1024", help="Image size (e.g., 512x512, 1024x1024).")
    args = parser.parse_args()

    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        print("OPENAI_API_KEY environment variable is not set.", file=sys.stderr)
        print("Set it, then re-run. Example: $Env:OPENAI_API_KEY='sk-...'\n")
        sys.exit(1)

    client = OpenAI(api_key=api_key)

    try:
        result = client.images.generate(
            model="gpt-image-1",
            prompt=args.prompt,
            size=args.size,
        )
    except Exception as e:
        print(f"Image generation failed: {e}", file=sys.stderr)
        sys.exit(2)

    try:
        b64 = result.data[0].b64_json
    except Exception:
        print("Unexpected response format from API.", file=sys.stderr)
        sys.exit(3)

    img_bytes = base64.b64decode(b64)
    out_dir = os.path.dirname(args.out)
    if out_dir:
        os.makedirs(out_dir, exist_ok=True)

    # If the requested output is webp/jpg, convert using Pillow; otherwise write raw PNG bytes.
    ext = os.path.splitext(args.out)[1].lower()
    if ext in (".webp", ".jpg", ".jpeg"):
        try:
            from PIL import Image
        except ImportError:
            print("Pillow is required for saving to webp/jpg. Install with: pip install pillow", file=sys.stderr)
            sys.exit(4)
        try:
            img = Image.open(BytesIO(img_bytes))
            # Preserve transparency for webp when present; convert to RGB for jpg.
            if ext in (".jpg", ".jpeg") and img.mode in ("RGBA", "LA"):
                img = img.convert("RGB")
            img.save(args.out, format="WEBP" if ext == ".webp" else "JPEG")
        except Exception as e:
            print(f"Failed to convert/save image: {e}", file=sys.stderr)
            sys.exit(5)
    else:
        with open(args.out, "wb") as f:
            f.write(img_bytes)

    print(f"Saved image: {args.out}")


if __name__ == "__main__":
    main()
