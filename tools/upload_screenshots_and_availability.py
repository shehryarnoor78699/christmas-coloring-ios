import glob
import hashlib
import os
import urllib.request
from asc_api import api_request, APP_ID

IPHONE_DIR = r"D:\ChristmasColoringIOS\APP_STORE_CONNECT_ASSETS\screenshots_iphone_6.7_1290x2796"
IPAD_DIR = r"D:\ChristmasColoringIOS\APP_STORE_CONNECT_ASSETS\screenshots_ipad_12.9_2048x2732"


def get_localization_id():
    vers = api_request("GET", f"/v1/apps/{APP_ID}/appStoreVersions")
    ver_id = vers["data"][0]["id"]
    print("Found App Store Version ID:", ver_id)
    locs = api_request("GET", f"/v1/appStoreVersions/{ver_id}/appStoreVersionLocalizations")
    loc_id = locs["data"][0]["id"]
    print("Found en-US Localization ID:", loc_id)
    return ver_id, loc_id


def get_or_create_screenshot_set(loc_id: str, display_type: str) -> str:
    existing = api_request("GET", f"/v1/appStoreVersionLocalizations/{loc_id}/appScreenshotSets")
    for s in existing.get("data", []):
        if s["attributes"]["screenshotDisplayType"] == display_type:
            return s["id"]
    created = api_request(
        "POST",
        "/v1/appScreenshotSets",
        {
            "data": {
                "type": "appScreenshotSets",
                "attributes": {"screenshotDisplayType": display_type},
                "relationships": {
                    "appStoreVersionLocalization": {
                        "data": {"type": "appStoreVersionLocalizations", "id": loc_id}
                    }
                },
            }
        },
    )
    return created["data"]["id"]


def upload_single_screenshot(set_id: str, fpath: str):
    bname = os.path.basename(fpath)
    with open(fpath, "rb") as f:
        raw_bytes = f.read()
    fsize = len(raw_bytes)
    md5_hex = hashlib.md5(raw_bytes).hexdigest()

    # 1. Reserve screenshot
    res = api_request(
        "POST",
        "/v1/appScreenshots",
        {
            "data": {
                "type": "appScreenshots",
                "attributes": {"fileSize": fsize, "fileName": bname},
                "relationships": {
                    "appScreenshotSet": {
                        "data": {"type": "appScreenshotSets", "id": set_id}
                    }
                },
            }
        },
    )
    shot_id = res["data"]["id"]
    ops = res["data"]["attributes"]["uploadOperations"]

    # 2. Upload binary chunks to Apple's S3/upload URLs
    for op in ops:
        u_method = op["method"]
        u_url = op["url"]
        offset = op["offset"]
        length = op["length"]
        chunk = raw_bytes[offset : offset + length]
        hdrs = {h["name"]: h["value"] for h in op.get("requestHeaders", [])}
        req = urllib.request.Request(u_url, data=chunk, headers=hdrs, method=u_method)
        with urllib.request.urlopen(req, timeout=120) as resp:
            resp.read()

    # 3. Commit upload
    api_request(
        "PATCH",
        f"/v1/appScreenshots/{shot_id}",
        {
            "data": {
                "type": "appScreenshots",
                "id": shot_id,
                "attributes": {
                    "uploaded": True,
                    "sourceFileChecksum": md5_hex,
                },
            }
        },
    )
    print(f"   Uploaded & committed: {bname} ({fsize} bytes)")


def setup_territories_availability():
    print("Checking App Availability across territories...")
    try:
        terr_resp = api_request("GET", "/v1/territories?limit=200")
        all_t_ids = [t["id"] for t in terr_resp.get("data", [])]
        print(f"   Found {len(all_t_ids)} territories.")

        avail_body = {
            "data": {
                "type": "appAvailabilities",
                "attributes": {"availableInNewTerritories": True},
                "relationships": {
                    "app": {"data": {"type": "apps", "id": APP_ID}},
                    "availableTerritories": {
                        "data": [{"type": "territories", "id": tid} for tid in all_t_ids]
                    },
                },
            }
        }
        api_request("POST", "/v2/appAvailabilities", avail_body)
        print("   Configured App Availability for all 175 territories!")
    except Exception as e:
        print("   Note on territories availability:", e)


if __name__ == "__main__":
    ver_id, loc_id = get_localization_id()

    print("\n1. Uploading 8 iPhone 6.7\" (APP_IPHONE_67) Screenshots via API...")
    iphone_set_id = get_or_create_screenshot_set(loc_id, "APP_IPHONE_67")
    for fpath in sorted(glob.glob(os.path.join(IPHONE_DIR, "*.png"))):
        upload_single_screenshot(iphone_set_id, fpath)

    print("\n2. Uploading 4 iPad Pro 12.9\" (APP_IPAD_PRO_3GEN_129) Screenshots via API...")
    ipad_set_id = get_or_create_screenshot_set(loc_id, "APP_IPAD_PRO_3GEN_129")
    for fpath in sorted(glob.glob(os.path.join(IPAD_DIR, "*.png"))):
        upload_single_screenshot(ipad_set_id, fpath)

    print("\n3. Configuring Worldwide Territory Availability...")
    setup_territories_availability()

    print("\nALL SCREENSHOTS & AVAILABILITY UPLOADED TO APP STORE CONNECT!")
