import base64
import json
import os
import subprocess
import tempfile
import time
import urllib.request
import urllib.error

KEY_ID = "XF38985D46"
ISSUER_ID = "5b9858bf-9f09-49a3-8e5f-35d2e113b6c2"
P8_PATH = r"D:\ChristmasColoringIOS\APPLE_SIGNING_KEYS\AuthKey_XF38985D46.p8"
OPENSSL_BIN = r"C:\Program Files\Git\usr\bin\openssl.exe"
APP_ID = "6838872303"
BUNDLE_ID_STR = "com.shehryarnoor.christmascoloring.ios"


def b64url(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).rstrip(b"=").decode("ascii")


def der_to_raw_es256(der_sig: bytes) -> bytes:
    # ASN.1 SEQUENCE (0x30), total_len, INTEGER (0x02), r_len, r_bytes, INTEGER (0x02), s_len, s_bytes
    idx = 2
    if der_sig[1] & 0x80:
        idx += (der_sig[1] & 0x7F)
    assert der_sig[idx] == 0x02
    r_len = der_sig[idx + 1]
    r_bytes = der_sig[idx + 2 : idx + 2 + r_len]
    idx = idx + 2 + r_len
    assert der_sig[idx] == 0x02
    s_len = der_sig[idx + 1]
    s_bytes = der_sig[idx + 2 : idx + 2 + s_len]

    r_int = int.from_bytes(r_bytes, "big")
    s_int = int.from_bytes(s_bytes, "big")
    return r_int.to_bytes(32, "big") + s_int.to_bytes(32, "big")


def make_jwt() -> str:
    now = int(time.time())
    header = {"alg": "ES256", "kid": KEY_ID, "typ": "JWT"}
    payload = {
        "iss": ISSUER_ID,
        "iat": now - 10,
        "exp": now + 1100,
        "aud": "appstoreconnect-v1",
    }
    signing_input = f"{b64url(json.dumps(header, separators=(',', ':')).encode())}.{b64url(json.dumps(payload, separators=(',', ':')).encode())}"

    with tempfile.NamedTemporaryFile(delete=False) as tf:
        tf.write(signing_input.encode("ascii"))
        tf_path = tf.name

    try:
        der_sig = subprocess.check_output([OPENSSL_BIN, "dgst", "-sha256", "-sign", P8_PATH, tf_path])
    finally:
        os.remove(tf_path)

    raw_sig = der_to_raw_es256(der_sig)
    return f"{signing_input}.{b64url(raw_sig)}"


def api_request(method: str, path_or_url: str, body=None, extra_headers=None):
    token = make_jwt()
    url = path_or_url if path_or_url.startswith("http") else f"https://api.appstoreconnect.apple.com{path_or_url}"
    headers = {
        "Authorization": f"Bearer {token}",
        "Accept": "application/json",
    }
    data = None
    if body is not None:
        if isinstance(body, (dict, list)):
            data = json.dumps(body).encode("utf-8")
            headers["Content-Type"] = "application/json"
        elif isinstance(body, bytes):
            data = body
    if extra_headers:
        headers.update(extra_headers)

    req = urllib.request.Request(url, data=data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req, timeout=60) as resp:
            raw = resp.read()
            if not raw:
                return {}
            return json.loads(raw.decode("utf-8"))
    except urllib.error.HTTPError as e:
        err_body = e.read().decode("utf-8", errors="replace")
        print(f"HTTP {e.code} on {method} {url}:\n{err_body}")
        raise


if __name__ == "__main__":
    os.makedirs(r"D:\ChristmasColoringIOS\tools", exist_ok=True)
    app_info = api_request("GET", f"/v1/apps/{APP_ID}")
    print("Connected to App Store Connect API! App Name:", app_info["data"]["attributes"]["name"])
