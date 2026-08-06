#!/usr/bin/env python3
"""
Allied Rental — Image optimizer
Fixes the "Image file size too large" SEO warnings by compressing/resizing
the oversized images flagged in the crawl.

HOW TO RUN (from inside your local alliedrentalco repo folder):
    pip install pillow
    python optimize-images.py

It will:
  - Resize any image wider than 1600px down to 1600px (keeps aspect ratio)
  - Re-compress JPEGs at quality 82 and PNGs optimized
  - Overwrite the originals in place (make a backup/commit first if you want)
  - Print the before/after size for each

After running, commit the changed images and push. Nothing else changes.
"""
import os, sys
try:
    from PIL import Image
except ImportError:
    print("Pillow not installed. Run:  pip install pillow"); sys.exit(1)

# The specific oversized images flagged by the crawl (relative to repo root):
TARGETS = [
    "images/team photos/_RRL5363.jpg",   # homepage hero (LCP image — most important)
    "images/team photos/Allied-10.jpg",
    "images/team photos/Allied-18.jpg",
    "images/team photos/Allied-2.jpg",
    "images/uploads/2018/11/dry-ice-blaster-Cleaning.jpg",
    "images/uploads/2018/03/Dehumidifation-for-food-processing-and-storage.png",
    "images/uploads/2019/03/containers-for-Rent-20-foot-standard-container-Novato-CA-Petaluma-CA-Santa-Rosa.jpg",
    "images/uploads/2023/08/image1.png",
    "images/uploads/2018/03/Dehumidifation-for-ice-arenas.jpg",
    "images/uploads/2019/04/steam-cleaner-rental-.jpg",
    "images/uploads/2020/11/The-Importance-of-Smoke-Remover-Filters-for-Hospitals-During-the-Covid-19-Pandemic-scaled.jpg",
    "images/uploads/2017/09/F421_LGR7000XLi_Photo.jpg",
]

MAX_WIDTH = 1600      # generous for web; nothing needs to be wider
JPEG_QUALITY = 82     # visually lossless-ish, big size savings

def human(n):
    for u in ["B","KB","MB"]:
        if n < 1024: return f"{n:.0f}{u}"
        n /= 1024
    return f"{n:.0f}GB"

def optimize(path):
    if not os.path.exists(path):
        print(f"  SKIP (not found): {path}"); return
    before = os.path.getsize(path)
    try:
        im = Image.open(path)
        # Resize if too wide
        if im.width > MAX_WIDTH:
            h = int(im.height * MAX_WIDTH / im.width)
            im = im.resize((MAX_WIDTH, h), Image.LANCZOS)
        ext = os.path.splitext(path)[1].lower()
        if ext in (".jpg", ".jpeg"):
            if im.mode in ("RGBA", "P"): im = im.convert("RGB")
            im.save(path, "JPEG", quality=JPEG_QUALITY, optimize=True, progressive=True)
        elif ext == ".png":
            im.save(path, "PNG", optimize=True)
        else:
            im.save(path)
        after = os.path.getsize(path)
        pct = (1 - after/before) * 100 if before else 0
        print(f"  OK  {path}")
        print(f"      {human(before)} -> {human(after)}  ({pct:.0f}% smaller)")
    except Exception as e:
        print(f"  ERROR on {path}: {e}")

if __name__ == "__main__":
    if not os.path.isdir("images"):
        print("Run this from your repo root (the folder that contains the 'images' folder).")
        sys.exit(1)
    import glob
    # Also catch ANY image over 300KB anywhere in images/ (biggest perf wins)
    big = []
    for ext in ("*.jpg","*.jpeg","*.png"):
        for f in glob.glob(f"images/**/{ext}", recursive=True):
            try:
                if os.path.getsize(f) > 300*1024:
                    big.append(f)
            except: pass
    all_targets = list(dict.fromkeys(TARGETS + big))  # de-dupe, keep order
    print(f"Optimizing {len(all_targets)} images (flagged + any over 300KB)...\n")
    for t in all_targets:
        optimize(t)
    print("\nDone. Review the images look fine, then commit and push.")
