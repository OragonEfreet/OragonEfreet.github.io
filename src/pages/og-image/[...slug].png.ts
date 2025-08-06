import RobotoMonoBold from "@/assets/roboto-mono-700.ttf";
import RobotoMono from "@/assets/roboto-mono-regular.ttf";
import { getAllPosts } from "@/data/post";
import { siteConfig } from "@/site.config";
import { getFormattedDate } from "@/utils/date";
import { Resvg } from "@resvg/resvg-js";
import type { APIContext, InferGetStaticPropsType } from "astro";
import satori, { type SatoriOptions } from "satori";
import { html } from "satori-html";

// Dark theme colors: uniform orange accent
const ACCENT = "#FF8C00";      // orange tone
const COMPL = ACCENT;            // use same orange for border and fills
const BG = "#1d1f21";           // dark background
const TEXT = "#c9cacc";        // light neutral text
const TITLE = "#ffffff";        // white title text

const ogOptions: SatoriOptions = {
  // debug: true,
  fonts: [
    {
      data: Buffer.from(RobotoMono),
      name: "Roboto Mono",
      style: "normal",
      weight: 400,
    },
    {
      data: Buffer.from(RobotoMonoBold),
      name: "Roboto Mono",
      style: "normal",
      weight: 700,
    },
  ],
  height: 630,
  width: 1200,
};

const markup = (title: string, pubDate: string) => html`
  <div tw="flex flex-col w-full h-full bg-[${BG}] text-[${TEXT}]">
    <div tw="flex flex-col flex-1 w-full p-10 justify-center">
      <p tw="text-2xl mb-6">${pubDate}</p>
      <h1 tw="text-6xl font-bold leading-snug text-[${TITLE}]">${title}</h1>
    </div>
    <div tw="flex items-center justify-between w-full p-10 border-t border-[${COMPL}] text-xl">
      <div tw="flex items-center">
        <p tw="font-semibold text-[${ACCENT}]">${siteConfig.title}</p>
      </div>
      <p tw="text-[${ACCENT}]">by ${siteConfig.author}</p>
    </div>
  </div>
`;

type Props = InferGetStaticPropsType<typeof getStaticPaths>;

export async function GET(context: APIContext) {
  const { pubDate, title } = context.props as Props;

  const postDate = getFormattedDate(pubDate, {
    month: "long",
    weekday: "long",
  });
  const svg = await satori(markup(title, postDate), ogOptions);
  const png = new Resvg(svg).render().asPng();
  return new Response(png, {
    headers: {
      "Cache-Control": "public, max-age=31536000, immutable",
      "Content-Type": "image/png",
    },
  });
}

export async function getStaticPaths() {
  const posts = await getAllPosts();
  return posts
    .filter(({ data }) => !data.ogImage)
    .map((post) => ({
      params: { slug: post.id },
      props: {
        pubDate: post.data.updatedDate ?? post.data.publishDate,
        title: post.data.title,
      },
    }));
}
