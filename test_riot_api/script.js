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
}



search_btn.addEventListener("click", () => {
    main();

});