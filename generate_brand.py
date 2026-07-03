#!/usr/bin/env python3
"""Generate TaskForge brand graphics using fal.ai FLUX schnell."""

import os
import time
import urllib.request
from fal_client import SyncClient

API_KEY = "44ef2688-d7b6-447a-b525-dcb720431ca2:95849aeb7a1d918750438f243e1fa72e"
OUT_DIR = os.path.join(os.path.dirname(__file__), "public")
os.makedirs(OUT_DIR, exist_ok=True)

client = SyncClient(key=API_KEY)

IMAGES = [
    {
        "name": "hero-bg.jpg",
        "size": "landscape_16_9",  # 1536x1024 approx
        "prompt": (
            "Abstract dark tech landscape, geometric network nodes and glowing connections flowing across a deep navy void, "
            "neon cyan (#06B6D4) data streams connecting geometric shapes, subtle accent purple (#8B5CF6) edge lights, "
            "particle grid fading into infinite depth, clean minimal composition, no text no letters no typography, "
            "works as subtle background behind hero overlay, cinematic volumetric lighting, 8K photorealistic render, "
            "dark theme, premium Web3 aesthetic, sleek futuristic"
        ),
    },
    {
        "name": "og-image.jpg",
        "size": "landscape_16_9",
        "prompt": (
            "Premium Web3 marketing card for 'TaskForge', dark deep navy background with Solana-style gradient sweep "
            "from electric purple (#8B5CF6) to neon cyan (#06B6D4) across the bottom third, "
            "the word 'TaskForge' in large bold futuristic tech-style letters centered in the upper half, "
            "subtitle 'Hire AI Agents on Solana' in smaller elegant text below it, "
            "geometric network nodes in corners, clean professional layout, dark theme, 8K, sharp"
        ),
    },
    {
        "name": "favicon.png",
        "size": "square_hd",  # 1024x1024
        "prompt": (
            "Minimal geometric logo mark, a stylized anvil shape formed by intersecting clean lines, "
            "neon cyan (#06B6D4) glowing outline on deep navy (#0a0e1a) solid background, "
            "the anvil silhouette is compact and centered, simple enough to be recognizable at 32px icon size, "
            "no text no letters, clean vector-like appearance, dark theme, premium tech brand mark, 8K"
        ),
    },
    {
        "name": "feature-illustration.jpg",
        "size": "square_hd",  # 1024x1024
        "prompt": (
            "Abstract digital illustration of AI agents connecting in a network, bright glowing nodes lighting up "
            "one by one across a dark void, data streams flowing between nodes as luminous particle trails, "
            "color palette: deep navy (#0a0e1a) background, neon cyan (#06B6D4) node connections, "
            "accent purple (#8B5CF6) highlights, network topology visualization, "
            "some nodes brighter than others indicating active agents, the flow conveys intelligence and automation, "
            "clean beautiful composition, no text, dark theme, premium Web3 aesthetic, 8K photorealistic render"
        ),
    },
]

for img in IMAGES:
    out_path = os.path.join(OUT_DIR, img["name"])
    print(f"\n{'='*60}")
    print(f"Generating: {img['name']} ({img['size']})")
    print(f"Prompt: {img['prompt'][:120]}...")
    print(f"{'='*60}")

    try:
        result = client.subscribe(
            "fal-ai/flux/schnell",
            {
                "prompt": img["prompt"],
                "image_size": img["size"],
                "num_images": 1,
            },
        )
        image_url = result["images"][0]["url"]
        print(f"✅ Generated: {image_url}")

        # Download and save
        print(f"   Downloading → {out_path}")
        urllib.request.urlretrieve(image_url, out_path)

        file_size = os.path.getsize(out_path)
        print(f"   💾 Saved: {out_path} ({file_size:,} bytes)")

    except Exception as e:
        print(f"❌ FAILED for {img['name']}: {e}")

print(f"\n{'='*60}")
print("ALL DONE. Generated files:")
for img in IMAGES:
    p = os.path.join(OUT_DIR, img["name"])
    if os.path.exists(p):
        print(f"  ✅ {p} ({os.path.getsize(p):,} bytes)")
    else:
        print(f"  ❌ {p} (NOT FOUND)")
print(f"{'='*60}")
