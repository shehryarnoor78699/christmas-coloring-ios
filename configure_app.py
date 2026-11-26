import os, re, shutil, sys
APPS = {
  "heatpump": {
    "display_name": "Heat Pump & Mini Spli",
    "bundle_id": "com.shehryarnoor.heatpumpsizing.ios",
    "prof_name": "HeatPumpSizing_AppStore",
    "profile_uuid": "d0e9232d-de03-4665-b9e0-b9aee79fe335"
  },
  "snowload": {
    "display_name": "Snow Load & Roof Ice ",
    "bundle_id": "com.shehryarnoor.snowloadroof.ios",
    "prof_name": "SnowLoadRoof_AppStore",
    "profile_uuid": "d43a4a7c-fae0-48d6-8794-0b3a84261c47"
  },
  "offgrid": {
    "display_name": "VanLife & Off-Grid Ba",
    "bundle_id": "com.shehryarnoor.offgridbattery.ios",
    "prof_name": "OffGridBattery_AppStore",
    "profile_uuid": "35e00685-5bea-4ce8-8bf8-1c24b7ce115e"
  }
}

slug = sys.argv[1]
cfg = APPS[slug]
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
pt = re.sub(r"(<key>CFBundleDisplayName</key>\s*<string>)([^<]+)(</string>)", rf"\g<1>{cfg['display_name']}\g<3>", pt)
with open(plist_path, "w", encoding="utf-8") as f:
    f.write(pt)

pbx_path = os.path.join("ios", "App", "App.xcodeproj", "project.pbxproj")
with open(pbx_path, "r", encoding="utf-8") as f:
    pbx = f.read()
pbx = re.sub(r"PRODUCT_BUNDLE_IDENTIFIER = [^;]+;", f"PRODUCT_BUNDLE_IDENTIFIER = {cfg['bundle_id']};", pbx)
pbx = re.sub(r"MARKETING_VERSION = [^;]+;", "MARKETING_VERSION = 1.0;", pbx)
pbx = re.sub(r"CURRENT_PROJECT_VERSION = [^;]+;", "CURRENT_PROJECT_VERSION = 1;", pbx)
pbx = re.sub(r'PROVISIONING_PROFILE = "[^"]+";', f'PROVISIONING_PROFILE = "{cfg[\'profile_uuid\']}";', pbx)
pbx = re.sub(r"PROVISIONING_PROFILE_SPECIFIER = [^;]+;", f"PROVISIONING_PROFILE_SPECIFIER = {cfg['prof_name']};", pbx)
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
    <dict><key>{cfg['bundle_id']}</key><string>{cfg['profile_uuid']}</string></dict>
</dict>
</plist>'''
with open("ExportOptions.plist", "w", encoding="utf-8") as f:
    f.write(exp)
print("Configured:", slug, cfg["bundle_id"])
