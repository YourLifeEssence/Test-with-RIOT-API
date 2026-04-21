const avatar = document.getElementById("avatar");
const summoner_level = document.getElementById("summoner_level");
const nickname = document.getElementById("nickname");
const tagline = document.getElementById("tagline");
const regionHtml = document.getElementById("region");

const rank_img = document.getElementById("rank_img");
const tier = document.getElementById("tier");
const lp = document.getElementById("lp");

const name_search = document.getElementById("name_search");
const tag_search = document.getElementById("tag_search");
const search_btn = document.getElementById("search_btn");


const routingValue = 'europe';


async function getResponse(url) {
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'X-Riot-Token': '...'
        }
    });
    
    if (!response.ok) {
        console.error(`Ошибка: ${response.status}`);
        return null;
    }

    const data = await response.json();
    return data;
}


async function getRiotAccount(gameName, tagLine) {
    const url = `https://${routingValue}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${gameName}/${tagLine}`;
    
    const data = await getResponse(url);
    const { puuid } = data;
    return puuid;
}


async function getRegionAccount(puuid) {
    const url = `https://${routingValue}.api.riotgames.com/riot/account/v1/region/by-game/lol/by-puuid/${puuid}`

    const data = await getResponse(url);
    const { region } = data;
    return region;
}


async function getRankAccount(puuid, region) {
    const url = `https://${region}.api.riotgames.com/lol/league/v4/entries/by-puuid/${puuid}`

    const data = await getResponse(url);
    const soloQueue = data.find(item => item.queueType === "RANKED_SOLO_5x5");
    const flexQueue = data.find(item => item.queueType === "RANKED_FLEX_SR");


    const myTierSolo = soloQueue ? soloQueue.tier : "Unranked";
    const myTierFlex = flexQueue ? flexQueue.tier : "Unranked";


    const pointSoloQueue = soloQueue?.leaguePoints ?? 0;
    const pointFlexQueue = flexQueue?.leaguePoints ?? 0;

    return [myTierSolo, pointSoloQueue, myTierFlex, pointFlexQueue];
}


async function getIconAndLevelAccount(puuid, region) {
    const url = `https://${region}.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}`

    const data = await getResponse(url);
    const iconId = data.profileIconId;
    const levelSummoner = data.summonerLevel;
    return [iconId, levelSummoner];
}


async function getListIdMatches(puuid, count = 20) {
    const url = `https://${routingValue}.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&${count}`;

    const data = await getResponse(url);
    return data;
}


function parseMatchStats(MatchesData, searchPuuid) {
    return MatchesData.map(match => {
        const info = match.info;

        const allPlayers = info.participants.map(p => {
            return {
                puuid: p.puuid,
                level: p.champLevel,
                championName: p.championName,
                name: p.riotIdGameName,
                tag: p.riotIdTagline,

                spells: { s1: p.summoner1Id, s2: p.summoner2Id },

                runes: {
                    main: p.perks.styles[0].selections[0].perk,
                    subStyle: p.perks.styles[1].style
                },

                items: [p.item0, p.item1, p.item2, p.item3, p.item4, p.item5, p.item6],

                kda: {
                    k: p.kills,
                    d: p.deaths,
                    a: p.assists,
                    kp: p.challenges?.killParticipation || 0
                },

                cs: {
                    minions: p.totalMinionsKilled,
                    jungle: p.neutralMinionsKilled,
                    total: p.totalMinionsKilled + p.neutralMinionsKilled
                },

                damage: p.totalDamageDealtToChampions,
                win: p.win
            };
        });

        const mainPlayer = allPlayers.find(p => p.puuid === searchPuuid);

        return {
            gameId: info.gameId,
            gameDuration: info.gameDuration,
            gameMode: info.gameMode,
            searchPuuid: searchPuuid,
            mainPlayerData: mainPlayer,
            players: allPlayers
        };
    });
}


async function getInformationFromMatch(puuid, count = 20) {
    const listMatchIds =  await getListIdMatches(puuid, count);

    if(!Array.isArray(listMatchIds)){
        console.error("Error : Не удалось получить список ID матчей");
        return;
    }

    const MatchesData = [];

    for (const id of listMatchIds) {
        const url = `https://${routingValue}.api.riotgames.com/lol/match/v5/matches/${id.toUpperCase()}`;
        const matchData = await getResponse(url);
        MatchesData.push(matchData);
    }

    const data = parseMatchStats(MatchesData, puuid);
    return data;
}


async function main() {
    let gameName = name_search.value;
    let tagLine = tag_search.value;
    let _puuid = await getRiotAccount(gameName, tagLine);
    let region = await getRegionAccount(_puuid);
    let [rankSolo, pointsSolo, rankFlex, pointsFlex] = await getRankAccount(_puuid, region);
    let [iconId, levelSummoner] = await getIconAndLevelAccount(_puuid, region);

    avatar.src = `https://ddragon.leagueoflegends.com/cdn/16.7.1/img/profileicon/${iconId}.png`;
    summoner_level.textContent = levelSummoner;
    nickname.textContent = gameName;
    tagline.textContent = tagLine;
    regionHtml.textContent = region;
    rank_img.src = `https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-static-assets/global/default/images/ranked-emblem/emblem-${rankSolo.toLowerCase()}.png`;
    tier.textContent = rankSolo;
    lp.textContent = pointsSolo;

    getInformationFromMatch(_puuid, 20);
}



search_btn.addEventListener("click", () => {
    main();

});