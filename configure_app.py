import os
import re
import shutil
import sys

APPS = {
    "boardfoot": {
        "app_id": "6829714912",
        "display_name": "Board Foot CutPlus",
        "bundle_id": "com.localtools.boardfootcalculator.plus",
        "prof_name": "BoardFootCutPlus_AppStore",
        "profile_uuid": "5eff8ac1-49b6-4b7d-a3b6-598d53ee7697",
    },
    "shrinkage": {
        "app_id": "6829715260",
        "display_name": "Wood Shrinkage Plus",
        "bundle_id": "com.localtools.woodshrinkagecalculator.plus",
        "prof_name": "WoodShrinkagePlus_AppStore",
        "profile_uuid": "a8445c1f-6f13-4d21-8db4-448441b2325b",
    },
    "soil": {
        "app_id": "6829714210",
        "display_name": "Soil Calc BedPlus",
        "bundle_id": "com.localtools.soilcalculator.plus",
        "prof_name": "SoilBedPlus_AppStore",
        "profile_uuid": "9fbaa117-aa79-4fda-a6d5-b6f3da671320",
    },
    "gravel": {
        "app_id": "6829713141",
        "display_name": "Gravel StonePlus",
        "bundle_id": "com.localtools.gravelcalculator.plus",
        "prof_name": "GravelStonePlus_AppStore",
        "profile_uuid": "a1b5c284-4bb5-495c-9440-a6ecf53b73a8",
    },
    "mulch": {
        "app_id": "6829710935",
        "display_name": "Mulch GardenPlus",
        "bundle_id": "com.localtools.mulchcalculator.plus",
        "prof_name": "MulchGardenPlus_AppStore",
        "profile_uuid": "55f50325-0024-48d7-bf0f-1e5f18217284",
    },
}

slug = sys.argv[1]
cfg = APPS[slug]
print(f"=== Configuring Xcode Project for {cfg['display_name']} ({cfg['bundle_id']}) [Version 1.0.0 Build 10] ===")

# 1. Copy web studio into www/ and ios/App/App/public/
for target_www in ["www", os.path.join("ios", "App", "App", "public")]:
    if os.path.exists(target_www):
        shutil.rmtree(target_www)
    shutil.copytree(os.path.join("apps", slug, "www"), target_www)

# 2. Copy 1024x1024 AppIcon
icon_src = os.path.join("apps", slug, "AppIcon-512@2x.png")
icon_dst = os.path.join("ios", "App", "App", "Assets.xcassets", "AppIcon.appiconset", "AppIcon-512@2x.png")
shutil.copy2(icon_src, icon_dst)

# 3. Update Info.plist display name
plist_path = os.path.join("ios", "App", "App", "Info.plist")
with open(plist_path, "r", encoding="utf-8") as f:
    plist_txt = f.read()
plist_txt = re.sub(
    r"(<key>CFBundleDisplayName</key>\s*<string>)([^<]+)(</string>)",
    rf"\g<1>{cfg['display_name']}\g<3>",
    plist_txt,
)
with open(plist_path, "w", encoding="utf-8") as f:
    f.write(plist_txt)

# 4. Update project.pbxproj with bundle_id, MARKETING_VERSION = 1.0.0, CURRENT_PROJECT_VERSION = 10, profile UUID & specifier
pbx_path = os.path.join("ios", "App", "App.xcodeproj", "project.pbxproj")
with open(pbx_path, "r", encoding="utf-8") as f:
    pbx = f.read()

pbx = re.sub(r"PRODUCT_BUNDLE_IDENTIFIER = [^;]+;", f"PRODUCT_BUNDLE_IDENTIFIER = {cfg['bundle_id']};", pbx)
pbx = re.sub(r"MARKETING_VERSION = [^;]+;", "MARKETING_VERSION = 1.0.0;", pbx)
pbx = re.sub(r"CURRENT_PROJECT_VERSION = [^;]+;", "CURRENT_PROJECT_VERSION = 10;", pbx)
pbx = re.sub(r'PROVISIONING_PROFILE = "[^"]+";', f'PROVISIONING_PROFILE = "{cfg["profile_uuid"]}";', pbx)
pbx = re.sub(r"PROVISIONING_PROFILE_SPECIFIER = [^;]+;", f"PROVISIONING_PROFILE_SPECIFIER = {cfg['prof_name']};", pbx)

with open(pbx_path, "w", encoding="utf-8") as f:
    f.write(pbx)

# 5. Write ExportOptions.plist for this app
export_plist = f"""<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>method</key>
    <string>app-store-connect</string>
    <key>teamID</key>
    <string>RR89GK8L2G</string>
    <key>uploadSymbols</key>
    <true/>
    <key>signingStyle</key>
    <string>manual</string>
    <key>signingCertificate</key>
    <string>Apple Distribution</string>
    <key>provisioningProfiles</key>
    <dict>
        <key>{cfg['bundle_id']}</key>
        <string>{cfg['profile_uuid']}</string>
    </dict>
</dict>
</plist>
"""
with open("ExportOptions.plist", "w", encoding="utf-8") as f:
    f.write(export_plist)

print(f"=== Successfully configured {slug} ({cfg['bundle_id']}) ===")
