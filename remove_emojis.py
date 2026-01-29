
import os

file_path = r"c:\Users\anisk\Desktop\Portfolio-Anis-main\index.html"

# List of emojis/chars to remove
emojis = [
    "🎓", "🛡️", "💼", "🔍", "🎯", "🏆", "🗣️", 
    "💻", "🌐", "🎮", "🛡", "️", "\ufffd"
]

# Read file
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Replace emojis
for emoji in emojis:
    content = content.replace(emoji, "")

# Cleanup double spaces (run multiple times or regex)
while "  " in content:
    content = content.replace("  ", " ")

# Fix specific spacing issues that might arise (e.g. " • " becoming " • ")
content = content.replace("• •", "•")

# Write back
with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Cleaned successfully.")
