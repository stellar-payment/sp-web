import { resolveResource } from "@tauri-apps/api/path";
import { convertFileSrc } from "@tauri-apps/api/tauri";

async function loadAsset(dir: string): Promise<string> { 
    return convertFileSrc(await resolveResource(dir))
}

export {
    loadAsset
}