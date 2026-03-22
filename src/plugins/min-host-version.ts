import { isAtLeast, parseSemver } from "../infra/runtime-guard.js";

export const MIN_HOST_VERSION_PREFIX = ">=";
export const MIN_HOST_VERSION_FORMAT =
  'openclaw.install.minHostVersion must use a semver floor in the form ">=x.y.z"';

export type MinHostVersionRequirement = {
  raw: string;
  minimumLabel: string;
};

export type MinHostVersionCheckResult =
  | { ok: true; requirement: MinHostVersionRequirement | null }
  | { ok: false; kind: "invalid"; error: string }
  | {
      ok: false;
      kind: "incompatible";
      requirement: MinHostVersionRequirement;
      currentVersion: string;
    };

export function parseMinHostVersionRequirement(
  raw: string | undefined,
): MinHostVersionRequirement | null {
  const trimmed = raw?.trim();
  if (!trimmed) {
    return null;
  }
  if (!trimmed.startsWith(MIN_HOST_VERSION_PREFIX)) {
    return null;
  }
  const minimumLabel = trimmed.slice(MIN_HOST_VERSION_PREFIX.length).trim();
  if (!minimumLabel || !parseSemver(minimumLabel)) {
    return null;
  }
  return {
    raw: trimmed,
    minimumLabel,
  };
}

export function validateMinHostVersion(raw: string | undefined): string | null {
  const trimmed = raw?.trim();
  if (!trimmed) {
    return null;
  }
  return parseMinHostVersionRequirement(trimmed) ? null : MIN_HOST_VERSION_FORMAT;
}

export function checkMinHostVersion(params: {
  currentVersion: string | undefined;
  minHostVersion: string | undefined;
}): MinHostVersionCheckResult {
  const trimmedMinHostVersion = params.minHostVersion?.trim();
  if (!trimmedMinHostVersion) {
    return { ok: true, requirement: null };
  }
  const requirement = parseMinHostVersionRequirement(trimmedMinHostVersion);
  if (!requirement) {
    return { ok: false, kind: "invalid", error: MIN_HOST_VERSION_FORMAT };
  }
  const currentVersion = params.currentVersion?.trim() || "unknown";
  const currentSemver = parseSemver(currentVersion);
  const minimumSemver = parseSemver(requirement.minimumLabel);
  if (!minimumSemver || !isAtLeast(currentSemver, minimumSemver)) {
    return {
      ok: false,
      kind: "incompatible",
      requirement,
      currentVersion,
    };
  }
  return { ok: true, requirement };
}
