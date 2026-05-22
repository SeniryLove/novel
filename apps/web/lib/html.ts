import { generateHTML } from "@tiptap/html";
import { defaultExtensions } from "@/components/tailwind/extensions";

export function toHtml(json: any) {
    console.log(defaultExtensions);
  return generateHTML(json, defaultExtensions);
}