import base64
import json
import os
import subprocess
from asc_api import api_request, OPENSSL_BIN, BUNDLE_ID_STR, APP_ID

KEYS_DIR = r"D:\ChristmasColoringIOS\APPLE_SIGNING_KEYS"
CSR_PATH = os.path.join(KEYS_DIR, "CertificateSigningRequest.certSigningRequest")
KEY_PATH = os.path.join(KEYS_DIR, "apple_distribution.key")
CER_PATH = os.path.join(KEYS_DIR, "distribution.cer")
PEM_PATH = os.path.join(KEYS_DIR, "distribution.pem")
P12_PATH = os.path.join(KEYS_DIR, "apple_distribution.p12")
PP_PATH = os.path.join(KEYS_DIR, "ChristmasColoringStudioPro_AppStore.mobileprovision")
P12_PASSWORD = "Christmas2026!"
CERT_ID = "74DWFW6CC7"


def create_profile_and_secrets():
    # 1. Look up Bundle ID resource ID
    print("1. Looking up Bundle ID resource ID...")
    b_resp = api_request("GET", f"/v1/bundleIds?filter[identifier]={BUNDLE_ID_STR}")
    bundle_res_id = None
    for item in b_resp.get("data", []):
        if item["attributes"]["identifier"] == BUNDLE_ID_STR:
            bundle_res_id = item["id"]
            break
    if not bundle_res_id:
        raise RuntimeError(f"Bundle ID {BUNDLE_ID_STR} not found!")
    print(f"   Found Bundle ID resource ID: {bundle_res_id}")

    # 2. Create App Store Provisioning Profile (IOS_APP_STORE)
    print("2. Creating App Store Provisioning Profile (IOS_APP_STORE)...")
    prof_name = "ChristmasColoringStudioPro_AppStore"
    existing_profs = api_request("GET", "/v1/profiles")
    for p in existing_profs.get("data", []):
        if p["attributes"]["name"] == prof_name:
            api_request("DELETE", f"/v1/profiles/{p['id']}")

    prof_resp = api_request(
        "POST",
        "/v1/profiles",
        {
            "data": {
                "type": "profiles",
                "attributes": {
                    "name": prof_name,
                    "profileType": "IOS_APP_STORE",
                },
                "relationships": {
                    "bundleId": {
                        "data": {"type": "bundleIds", "id": bundle_res_id}
                    },
                    "certificates": {
                        "data": [{"type": "certificates", "id": CERT_ID}]
                    },
                },
            }
        },
    )
    prof_b64 = prof_resp["data"]["attributes"]["profileContent"]
    prof_uuid = prof_resp["data"]["attributes"]["uuid"]
    with open(PP_PATH, "wb") as f:
        f.write(base64.b64decode(prof_b64))
    print(f"   Saved Provisioning Profile {PP_PATH} (UUID: {prof_uuid})")

    with open(P12_PATH, "rb") as f:
        p12_b64 = base64.b64encode(f.read()).decode("ascii")
    with open(os.path.join(KEYS_DIR, "SECRET_BUILD_CERTIFICATE_BASE64.txt"), "w") as f:
        f.write(p12_b64)
    with open(os.path.join(KEYS_DIR, "SECRET_BUILD_PROVISION_PROFILE_BASE64.txt"), "w") as f:
        f.write(prof_b64)
    with open(os.path.join(KEYS_DIR, "PROVISIONING_PROFILE_UUID.txt"), "w") as f:
        f.write(prof_uuid)

    print("ALL SIGNING CERTIFICATES AND PROFILES CREATED AUTOMATICALLY!")


if __name__ == "__main__":
    create_profile_and_secrets()
