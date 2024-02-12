import type { NextApiRequest, NextApiResponse } from 'next'
 
type Game = {
  link: string
  title: string
  embed: string | number
  cover: string
}

type ResponseData = {
  games: Array<Game>
}

const itchLinks = ["https://jingruchenmax.itch.io/arcade-key-binding"];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
    const gameInfo = await Promise.all(itchLinks.map(async (link) => {
        const gamePage = await (await fetch(link)).text();
        const embedMatch = /.*src=.*classic.itch.zone\/html\/(?<embed_id>\d+).*\">/.exec(gamePage);
        const coverMatch = /.*<div class="header.*<img.*src="(?<img_link>.*)"\/>/.exec(gamePage);
        const titleMatch = /.*<title>(?<title_text>.*)<\/title>/.exec(gamePage);
        return {
            link: link,
            title: titleMatch && titleMatch.groups["title_text"],
            embed: embedMatch && embedMatch.groups["embed_id"],
            cover: coverMatch && coverMatch.groups["img_link"]
        };
    }));
    res.status(200).json({ games: gameInfo as Array<Game> })
}