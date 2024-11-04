import path from "path";
import fs from "fs";

type ManifestEntry = {
  file: string;
  src?: string;
  isEntry?: boolean;
  dynamicImports?: string[];
  css?: string[];
  assets?: string[];
};

type ViteManifest = {
  [key: string]: ManifestEntry;
};

export async function getViteAssets(): Promise<{
  "main.js": string | null;
  "main.css": string | null;
}> {
  try {
    const manifestPath = path.join(__dirname, "../client/dist/manifest.json");
    const manifestContent = fs.readFileSync(manifestPath, "utf-8");
    const manifest = JSON.parse(manifestContent) as ViteManifest;

    return {
      "main.js": findManifestEntry(manifest, (key) => key.endsWith("main.tsx")),
      "main.css": findManifestEntry(manifest, (key) => key.endsWith(".css")),
    };
  } catch (error) {
    console.warn("No manifest file found, using default asset paths");
    return {
      "main.js": null,
      "main.css": null,
    };
  }
}

function findManifestEntry(
  manifest: ViteManifest,
  predicate: (key: string) => boolean
): string | null {
  const entry = Object.entries(manifest).find(([key]) => predicate(key))?.[1];
  return entry ? `/${entry.file}` : null;
}
