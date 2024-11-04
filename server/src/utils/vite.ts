import path from "path";
import fs from "fs";
import { ServerConfig } from "@/config/environment";

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

export async function getViteAssets(config: ServerConfig): Promise<{
  "main.js": string | null;
  "main.css": string | null;
}> {
  try {
    const manifestPath = path.join(config.assetPath, "manifest.json");
    const manifestContent = fs.readFileSync(manifestPath, "utf-8");
    const manifest = JSON.parse(manifestContent) as ViteManifest;

    const mainEntry = Object.values(manifest).find(
      (entry) => entry.isEntry && entry.src === "src/main.tsx"
    );

    const assets = {
      "main.js": mainEntry ? `/${mainEntry.file}` : null,
      "main.css": mainEntry && mainEntry.css ? `/${mainEntry.css[0]}` : null,
    };

    return assets;
  } catch (error) {
    console.warn("No manifest file found, using default asset paths");
    return {
      "main.js": null,
      "main.css": null,
    };
  }
}
