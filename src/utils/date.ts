import type { CollectionEntry } from "astro:content";
import { siteConfig } from "@/site.config";

export function getFormattedDate(
	date: Date | undefined,
	options?: Intl.DateTimeFormatOptions,
): string {
	if (date === undefined) {
		return "Invalid Date";
	}

	return new Intl.DateTimeFormat(siteConfig.date.locale, {
		...(siteConfig.date.options as Intl.DateTimeFormatOptions),
		...options,
	}).format(date);
}

// export function collectionDateSort(
// 	a: CollectionEntry<"post" | "note">,
// 	b: CollectionEntry<"post" | "note">,
// ) {
// 	return b.data.publishDate.getTime() - a.data.publishDate.getTime();
// }

export function collectionDateSort(a: CollectionEntry<any>, b: CollectionEntry<any>) {
  const dateA = new Date(a.data.updatedDate || a.data.publishDate);
  const dateB = new Date(b.data.updatedDate || b.data.publishDate);

  return dateB.getTime() - dateA.getTime(); // descending order
}
