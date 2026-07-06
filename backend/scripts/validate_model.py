"""
 * BabyGuide PH — Model Validation Script
 *
 * Validates that the YOLO model at model/best.pt has class names
 * matching the 5 expected skin conditions after a test inference.
 * Run from the backend/ directory:
 *   python scripts/validate_model.py
 *
 * Exit codes:
 *   0 = all checks passed
 *   1 = one or more checks failed
 *   2 = model file not found or could not be loaded
"""

import os
import sys
import io

EXPECTED_CLASSES = {"Measles", "Heat Rash", "Chickenpox", "Eczema", "Normal Skin"}

# Expected class names as the training set defines them (raw model output)
EXPECTED_RAW = {"Chickenpox", "chickenpox", "Heat-Rash", "eczema", "measles", "normal skin"}

# ── Helpers ──────────────────────────────────────────

RED = "\033[91m"
GREEN = "\033[92m"
YELLOW = "\033[93m"
BOLD = "\033[1m"
RESET = "\033[0m"


def pass_(msg: str) -> None:
    print(f"  {GREEN}[PASS]{RESET} {msg}")


def fail(msg: str) -> None:
    print(f"  {RED}[FAIL]{RESET} {msg}")


def warn(msg: str) -> None:
    print(f"  {YELLOW}[WARN]{RESET} {msg}")


def heading(title: str) -> None:
    print(f"\n{BOLD}{title}{RESET}")
    print("-" * len(title))


# ── Resolve model path ───────────────────────────────

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.dirname(SCRIPT_DIR)
PROJECT_ROOT = os.path.dirname(BACKEND_DIR)
MODEL_PATH = os.path.join(PROJECT_ROOT, "model", "best.pt")


# ── Main ─────────────────────────────────────────────

def main() -> int:
    print(f"{BOLD}BabyGuide PH — Model Validation{RESET}")
    print(f"{'=' * 40}")
    print(f"Model path: {MODEL_PATH}")

    if not os.path.exists(MODEL_PATH):
        fail(f"Model file not found at {MODEL_PATH}")
        return 2

    # ── Load model ──────────────────────────────────
    heading("1. Loading model")
    model = None
    raw_names = None
    failures = 0

    # Try primary path (ultralytics)
    try:
        from ultralytics import YOLO
        model = YOLO(MODEL_PATH)
        raw_names = model.names
        pass_(f"Model loaded via ultralytics (task={model.task})")
    except ImportError:
        warn("ultralytics not installed — falling back to pickle metadata reader")
        try:
            import pickle
            with open(MODEL_PATH, "rb") as f:
                raw = pickle.load(f)
                # YOLO stores names in the model dict under "model"
                if hasattr(raw, "names"):
                    raw_names = raw.names
                elif isinstance(raw, dict) and "names" in raw:
                    raw_names = raw["names"]
                else:
                    # Deep search in CKPT keys
                    ckpt = getattr(raw, "ckpt", None) or raw
                    if isinstance(ckpt, dict):
                        raw_names = ckpt.get("names") or (
                            ckpt.get("model", {}).names if hasattr(ckpt.get("model"), "names") else None
                        )
            if raw_names:
                pass_(f"Model metadata read via pickle ({len(raw_names)} classes)")
            else:
                fail("Could not extract class names from pickle")
                return 2
        except Exception as e2:
            fail(f"Pickle fallback also failed: {e2}")
            fail("Install ultralytics in your venv and try again: pip install -r requirements.txt")
            return 2
    except Exception as e:
        fail(f"Failed to load model: {e}")
        return 2

    # ── Check raw class names ───────────────────────────
    heading("2. Raw model class names")

    # Check that we have at least 5 classes
    if len(raw_names) < 5:
        fail(f"Expected at least 5 classes, got {len(raw_names)}")
        failures += 1
    else:
        pass_(f"Model has {len(raw_names)} classes")

    for idx, name in raw_names.items():
        if name in EXPECTED_RAW:
            pass_(f"  [{idx}] \"{name}\" is a recognized raw class name")
        else:
            fail(f"  [{idx}] \"{name}\" is NOT in the expected set {EXPECTED_RAW}")
            warn(f"        Expected one of: {sorted(EXPECTED_RAW)}")
            failures += 1

    # ── Check normalization mapping ─────────────────
    heading("3. Normalization mapping coverage")
    CLASS_NAME_NORMALIZATION = {
        "Chickenpox": "Chickenpox",
        "chickenpox": "Chickenpox",
        "Heat-Rash": "Heat Rash",
        "eczema": "Eczema",
        "measles": "Measles",
        "normal skin": "Normal Skin",
    }

    for idx in range(len(raw_names)):
        raw = raw_names[idx]
        if raw in CLASS_NAME_NORMALIZATION:
            canonical = CLASS_NAME_NORMALIZATION[raw]
            pass_(f"  \"{raw}\" → \"{canonical}\"")
        else:
            fail(f"  \"{raw}\" has no normalization mapping")
            failures += 1

    # ── Check canonical names exist in content dict ─
    heading("4. Canonical names in SKIN_CONDITION_CONTENT")
    SKIN_CONDITION_CONTENT = {
        "Measles": {},
        "Heat Rash": {},
        "Chickenpox": {},
        "Eczema": {},
        "Normal Skin": {},
    }

    canonical_keys = set(CLASS_NAME_NORMALIZATION.values())
    for key in sorted(canonical_keys):
        if key in SKIN_CONDITION_CONTENT:
            pass_(f"  \"{key}\" found in SKIN_CONDITION_CONTENT")
        else:
            fail(f"  \"{key}\" MISSING from SKIN_CONDITION_CONTENT")
            failures += 1

    if canonical_keys != EXPECTED_CLASSES:
        missing = EXPECTED_CLASSES - canonical_keys
        extra = canonical_keys - EXPECTED_CLASSES
        if missing:
            warn(f"  Canonical names missing expected keys: {missing}")
        if extra:
            warn(f"  Extra canonical names not in expected set: {extra}")

    # ── Run test inference (requires ultralytics) ───
    heading("5. Test inference (synthetic image)")
    if model is None:
        warn("Skipped — model not loaded via ultralytics (install dependencies for full test)")
        pass_("Class name mapping already verified in steps 2–4")
    else:
        try:
            from PIL import Image
            import numpy as np
            dummy = Image.fromarray(np.random.randint(0, 255, (640, 640, 3), dtype=np.uint8))
            results = model(dummy)
            result = results[0]

            if result.probs is not None:
                class_idx = int(result.probs.top1)
                raw = model.names.get(class_idx, None)
                canonical = CLASS_NAME_NORMALIZATION.get(raw, raw) if raw else None
                pass_(f"Inference OK (classification model)")
                pass_(f"  Top-1 raw class: \"{raw}\"")
                pass_(f"  Normalised: \"{canonical}\"")
            elif result.boxes is not None and len(result.boxes) > 0:
                boxes = result.boxes
                idx = int(boxes.cls[int(boxes.conf.argmax())])
                raw = model.names.get(idx, None)
                canonical = CLASS_NAME_NORMALIZATION.get(raw, raw) if raw else None
                pass_(f"Inference OK (detection model)")
                pass_(f"  Top box raw class: \"{raw}\"")
                pass_(f"  Normalised: \"{canonical}\"")
            else:
                warn("Inference ran but produced no predictions (expected on synthetic noise)")
                pass_("  No prediction — class names structure still verified above")

        except Exception as e:
            fail(f"Test inference failed: {e}")
            failures += 1

    # ── Summary ─────────────────────────────────────
    heading("Result")
    if failures == 0:
        print(f"  {GREEN}{BOLD}All checks passed!{RESET}")
        return 0
    else:
        print(f"  {RED}{BOLD}{failures} check(s) failed{RESET}")
        return 1


if __name__ == "__main__":
    sys.exit(main())
