"""Rule-based skill extraction against a curated dictionary."""

from __future__ import annotations

import re
from functools import lru_cache
from typing import Iterable

from src.preprocessing import normalize_text
from utils.constants import SKILL_ALIASES, SKILL_CATALOG


def _pattern_for_alias(alias: str) -> re.Pattern[str]:
    escaped = re.escape(alias.lower().strip()).replace(r"\ ", r"\s+")
    return re.compile(rf"(?<![a-z0-9]){escaped}(?![a-z0-9])", re.IGNORECASE)


@lru_cache(maxsize=1)
def _compiled_aliases() -> tuple[tuple[str, re.Pattern[str]], ...]:
    rows: list[tuple[str, re.Pattern[str]]] = []
    for canonical, aliases in SKILL_ALIASES.items():
        alias_set = {canonical.lower(), *(a.lower() for a in aliases)}
        for alias in sorted(alias_set, key=len, reverse=True):
            rows.append((canonical, _pattern_for_alias(alias)))
    return tuple(rows)


def extract_skills(text: str, extra_skills: Iterable[str] | None = None) -> list[str]:
    normalized = normalize_text(text).lower()
    if not normalized:
        return []

    allowed = {s.lower() for s in (extra_skills or SKILL_CATALOG)}
    found: list[str] = []
    seen: set[str] = set()

    for canonical, pattern in _compiled_aliases():
        if canonical.lower() not in allowed or canonical in seen:
            continue
        if pattern.search(normalized):
            seen.add(canonical)
            found.append(canonical)

    return found


def extract_skill_set(text: str, extra_skills: Iterable[str] | None = None) -> set[str]:
    return set(extract_skills(text, extra_skills=extra_skills))
