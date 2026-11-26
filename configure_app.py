import os
import re
import shutil
import sys

APPS = {
    "evcharger": {
        "display_name": "EV Charger Load CAD",
        "bundle_id": "com.shehryarnoor.evchargerload.ios",
        "prof_name": "EVChargerLoad_AppStore",
        "profile_uuid": "a3e39a1e-ae26-455c-b06b-6a02394b85ab"
    },
    "acoustic": {
        "display_name": "Acoustic Room CAD",
        "bundle_id": "com.shehryarnoor.acousticroomcad.ios",
        "prof_name": "AcousticRoomCAD_AppStore",
        "profile_uuid": "12e9c564-dbdf-48a3-9ccd-27119517b06b"
    },
    "sauna": {
        "display_name": "Sauna Heater CAD",
        "bundle_id": "com.shehryarnoor.saunaheatercad.ios",
        "prof_name": "SaunaHeaterCAD_AppStore",
        "profile_uuid": "55c961cf-9217-454c-8971-d31ea2070f4f"
    }
}

slug = sys.argv[1]
cfg = APPS[slug]
puuid = cfg["profile_uuid"]
bid = cfg["bundle_id"]
pname = cfg["prof_name"]
dname = cfg["display_name"]

for target_www in ["www", os.path.join("ios", "App", "App", "public")]:
    if os.path.exists(target_www):
        shutil.rmtree(target_www)
    shutil.copytree(os.path.join("apps", slug, "www"), target_www)

shutil.copy2(
    os.path.join("apps", slug, "AppIcon-512@2x.png"),
    os.path.join("ios", "App", "App", "Assets.xcassets", "AppIcon.appiconset", "AppIcon-512@2x.png"),
)

plist_path = os.path.join("ios", "App", "App", "Info.plist")
with open(plist_path, "r", encoding="utf-8") as f:
    pt = f.read()
pt = re.sub(r"(<key>CFBundleDisplayName</key>\s*<string>)([^<]+)(</string>)", rf"\g<1>{dname}\g<3>", pt)
with open(plist_path, "w", encoding="utf-8") as f:
    f.write(pt)

pbx_path = os.path.join("ios", "App", "App.xcodeproj", "project.pbxproj")
with open(pbx_path, "r", encoding="utf-8") as f:
    pbx = f.read()
pbx = re.sub(r"PRODUCT_BUNDLE_IDENTIFIER = [^;]+;", f"PRODUCT_BUNDLE_IDENTIFIER = {bid};", pbx)
pbx = re.sub(r"IPHONEOS_DEPLOYMENT_TARGET = [^;]+;", "IPHONEOS_DEPLOYMENT_TARGET = 15.0;", pbx)
pbx = re.sub(r"MARKETING_VERSION = [^;]+;", "MARKETING_VERSION = 1.0;", pbx)
pbx = re.sub(r"CURRENT_PROJECT_VERSION = [^;]+;", "CURRENT_PROJECT_VERSION = 1;", pbx)
pbx = re.sub(r'PROVISIONING_PROFILE = "[^"]+";', f'PROVISIONING_PROFILE = "{puuid}";', pbx)
pbx = re.sub(r"PROVISIONING_PROFILE_SPECIFIER = [^;]+;", f"PROVISIONING_PROFILE_SPECIFIER = {pname};", pbx)
with open(pbx_path, "w", encoding="utf-8") as f:
    f.write(pbx)

exp = f'''<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>method</key><string>app-store-connect</string>
    <key>teamID</key><string>RR89GK8L2G</string>
    <key>uploadSymbols</key><true/>
    <key>signingStyle</key><string>manual</string>
    <key>signingCertificate</key><string>Apple Distribution</string>
    <key>provisioningProfiles</key>
    <dict><key>{bid}</key><string>{puuid}</string></dict>
</dict>
</plist>'''
with open("ExportOptions.plist", "w", encoding="utf-8") as f:
    f.write(exp)
print("Configured:", slug, bid)
