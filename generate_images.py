import fal_client
import requests
import os

client = fal_client.SyncClient(key="44ef2688-d7b6-447a-b525-dcb720431ca2:95849aeb7a1d918750438f243e1fa72e")

OUT_DIR = "/Users/joergpeetz/workspace/taskforge-landing/public"
os.makedirs(OUT_DIR, exist_ok=True)

def generate(prompt, filename):
    print(f"Generating: {filename} ...")
    result = client.subscribe("fal-ai/flux/schnell", {"prompt": prompt, "num_images": 1})
    url = result["images"][0]["url"]
    r = requests.get(url)
    path = os.path.join(OUT_DIR, filename)
    with open(path, "wb") as f:
        f.write(r.content)
    print(f"SAVED: {filename} ({len(r.content)} bytes)")
    return path

# 1. step1-post.jpg
generate(
    "A glowing translucent holographic interface floating in dark space, showing a task description being typed. Neon cyan input fields, purple cursor. Abstract geometric shapes orbit the interface. Deep navy background with subtle grid lines. Premium cinematic lighting, 8K quality, no text, dark mode aesthetic.",
    "step1-post.jpg"
)

# 2. step2-compete.jpg
generate(
    "Multiple glowing geometric nodes representing AI agents orbiting around a central task hologram in dark space. Purple and cyan energy particles flowing between nodes. Competitive energy, dynamic motion. Deep navy background. Cinematic volumetric lighting. Abstract representation of agents competing for work.",
    "step2-compete.jpg"
)

# 3. step3-deliver.jpg
generate(
    "A luminous completed task hologram with a subtle checkmark glow in neon cyan. Geometric shapes coalescing into a finished form. Satisfying completion energy. Purple particles settle. Deep navy background. Premium aesthetic, cinematic quality, 8K, dark mode.",
    "step3-deliver.jpg"
)

# 4. for-agents.jpg
generate(
    "A single brilliant geometric crystal agent node glowing in neon cyan, floating above a dark reflective surface. Light trails showing incoming payment stream in purple. Autonomous, powerful, premium. Deep navy gradient background. Cinematic lighting. Abstract representation of an AI agent earning money.",
    "for-agents.jpg"
)

# 5. solana-speed.jpg
generate(
    "Abstract visualization of blockchain speed, neon cyan and purple light streaks zooming through dark geometric space. Blazing fast light trails. Deep navy background with subtle hexagonal grid. Solana purple to cyan gradient aesthetic. Cinematic motion blur. Premium Web3 feel. No text.",
    "solana-speed.jpg"
)

# 6. solana-cheap.jpg
generate(
    "Tiny glowing particles representing micro-transactions flowing through a dark geometric network. Each particle glows purple or cyan. Scale contrast, massive network, tiny transactions. Deep navy background. Premium abstract visualization of low-cost blockchain transactions. Cinematic quality.",
    "solana-cheap.jpg"
)

# 7. solana-usdc.jpg
generate(
    "A glowing geometric stablecoin symbol, circle with dollar essence, floating in dark space, surrounded by purple and cyan data streams. Stable, reliable, premium. USDC on Solana visual metaphor. Deep navy background. Cinematic lighting, 8K dark mode aesthetic. Abstract and elegant.",
    "solana-usdc.jpg"
)

# 8. waitlist-bg.jpg
generate(
    "A dark futuristic portal gateway visual with concentric geometric rings glowing in purple and cyan, drawing the eye to the center. Inviting but mysterious. Deep navy background. Premium cinematic quality. Abstract invitation aesthetic. No text. Dark mode. 8K.",
    "waitlist-bg.jpg"
)

# 9. footer-pattern.png
generate(
    "A subtle dark geometric tessellation pattern with tiny repeating hexagons and nodes in very low opacity purple on deep navy background. Seamless tile. Premium tech texture. Dark mode. Minimal, not distracting. 8K quality. No text.",
    "footer-pattern.png"
)

# 10. og-image-v2.jpg
generate(
    "A dramatic wide-angle view of a dark futuristic marketplace with floating holographic agent profiles orbiting a central glowing TaskForge symbol, geometric anvil forge shape in neon cyan. Purple energy connecting everything. Solana gradient sweep purple to cyan. Deep navy background. Epic cinematic composition. Premium Web3 ecosystem visual. No readable text, just the abstract scene.",
    "og-image-v2.jpg"
)

print("\n===== ALL DONE =====")
print("SAVED: step1-post.jpg")
print("SAVED: step2-compete.jpg")
print("SAVED: step3-deliver.jpg")
print("SAVED: for-agents.jpg")
print("SAVED: solana-speed.jpg")
print("SAVED: solana-cheap.jpg")
print("SAVED: solana-usdc.jpg")
print("SAVED: waitlist-bg.jpg")
print("SAVED: footer-pattern.png")
print("SAVED: og-image-v2.jpg")
print("DONE: 10 images generated")
