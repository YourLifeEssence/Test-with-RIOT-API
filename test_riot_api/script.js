const avatar         = document.getElementById("avatar");
const summoner_level = document.getElementById("summoner_level");
const nickname       = document.getElementById("nickname");
const tagline        = document.getElementById("tagline");
const regionHtml     = document.getElementById("region");

const rank_img       = document.getElementById("rank_img");
const tier           = document.getElementById("tier");
const lp             = document.getElementById("lp");

const name_search    = document.getElementById("name_search");
const tag_search     = document.getElementById("tag_search");
const search_btn     = document.getElementById("search_btn");

const match_list     = document.getElementById("match-list");

const routingValue   = 'europe';

// Data Dragon periodically changes version. Keep one fallback for offline use,
// but prefer Riot's current version instead of hard-coding it in every URL.
let dataDragonVersion = '16.8.1';

const dataDragonReady = fetch('https://ddragon.leagueoflegends.com/api/versions.json')
    .then(response => response.ok ? response.json() : null)
    .then(versions => {
        if (Array.isArray(versions) && versions[0]) dataDragonVersion = versions[0];
    })
    .catch(() => null);

function dataDragonAsset(folder, file) {
    return `https://ddragon.leagueoflegends.com/cdn/${dataDragonVersion}/img/${folder}/${file}`;
}

function iconFallback(label, color = '#56b9e9') {
    const safeLabel = String(label || '?').slice(0, 2).toUpperCase();
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#17263a"/><stop offset="1" stop-color="#090f19"/></linearGradient></defs><rect width="128" height="128" rx="24" fill="url(#g)"/><path d="M64 18 104 64 64 110 24 64Z" fill="none" stroke="${color}" stroke-width="5" opacity=".75"/><text x="64" y="73" text-anchor="middle" fill="#f4f7fb" font-family="Arial,sans-serif" font-size="28" font-weight="700">${safeLabel}</text></svg>`;
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function setImageFallback(image, label, color) {
    image.onerror = null;
    image.src = iconFallback(label, color);
}

function loadRankEmblem(rank) {
    const normalizedRank = String(rank || 'iron').toLowerCase();
    const emblemRank = normalizedRank === 'unranked' ? 'iron' : normalizedRank;
    const sources = [
        `https://opgg-static.akamaized.net/images/medals_new/${emblemRank}.png`,
        `https://raw.communitydragon.org/16.15/plugins/rcp-fe-lol-static-assets/global/default/images/ranked-emblem/emblem-${emblemRank}.png`,
        `https://raw.communitydragon.org/pbe/plugins/rcp-fe-lol-static-assets/global/default/images/ranked-emblem/emblem-${emblemRank}.png`
    ];
    let sourceIndex = 0;

    rank_img.onerror = () => {
        sourceIndex += 1;

        if (sourceIndex < sources.length) {
            rank_img.src = sources[sourceIndex];
            return;
        }

        const color = rankColors[String(rank || 'UNRANKED').toUpperCase()] || rankColors.UNRANKED;
        setImageFallback(rank_img, '◇', color);
    };

    rank_img.src = sources[sourceIndex];
}

avatar.onerror = () => setImageFallback(avatar, 'RI', '#d5b36c');
rank_img.onerror = () => setImageFallback(rank_img, 'I', '#514a4a');

// An image may fail before this deferred script has finished loading.
if (avatar.complete && !avatar.naturalWidth) setImageFallback(avatar, 'RI', '#d5b36c');
if (rank_img.complete && !rank_img.naturalWidth) setImageFallback(rank_img, 'I', '#514a4a');

const rankColors = {
    "UNRANKED": "#474747",
    "IRON": "#514A4A",
    "BRONZE": "#8C5A2B",
    "SILVER": "#C0C0C0",
    "GOLD": "#FFD700",
    "PLATINUM": "#00A8A8",
    "EMERALD": "#00C957",
    "DIAMOND": "#4FC3F7",
    "MASTER": "#9C27B0",
    "GRANDMASTER": "#C62828",
    "CHALLENGER": "#1E88E5"
}

const summonerSpells = {
    1:  "SummonerBoost.png",
    3:  "SummonerExhaust.png",
    4:  "SummonerFlash.png",
    6:  "SummonerHaste.png",
    7:  "SummonerHeal.png",
    11: "SummonerSmite.png",
    12: "SummonerTeleport.png",
    14: "SummonerDot.png",
    21: "SummonerBarrier.png"
}

const keystoneRunes = {
  // Precision
  8005: "https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Precision/PressTheAttack/PressTheAttack.png",
  8008: "https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Precision/LethalTempo/LethalTempoTemp.png",
  8021: "https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Precision/FleetFootwork/FleetFootwork.png",
  8010: "https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Precision/Conqueror/Conqueror.png",

  // Domination
  8112: "https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Domination/Electrocute/Electrocute.png",
  8124: "https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Domination/Predator/Predator.png",
  8128: "https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Domination/DarkHarvest/DarkHarvest.png",
  9923: "https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Domination/HailOfBlades/HailOfBlades.png",

  // Sorcery
  8214: "https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Sorcery/SummonAery/SummonAery.png",
  8229: "https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Sorcery/ArcaneComet/ArcaneComet.png",
  8230: "https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Sorcery/PhaseRush/PhaseRush.png",
  // Legacy Deathfire Touch is absent from current Data Dragon assets.
  8992: iconFallback('R', '#9c6ade'),

  // Inspiration
  8351: "https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Inspiration/GlacialAugment/GlacialAugment.png",
  8360: "https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Inspiration/UnsealedSpellbook/UnsealedSpellbook.png",
  8369: "https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Inspiration/FirstStrike/FirstStrike.png",

  // Resolve
  8437: "https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Resolve/GraspOfTheUndying/GraspOfTheUndying.png",
  8439: "https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Resolve/VeteranAftershock/VeteranAftershock.png",
  8465: "https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Resolve/Guardian/Guardian.png"
};

const runeStyleIcons = {
  8000: "https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/7201_Precision.png",
  8100: "https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/7200_Domination.png",
  8200: "https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/7202_Sorcery.png",
  8300: "https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/7203_Whimsy.png",
  8400: "https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/7204_Resolve.png"
};


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
            gameMode: info.queueId,
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


function DefineWinOrLose(data, index) {
    let win = data[index].mainPlayerData.win;
    return win;
}


function CalculateGameDuration(data, index) {
    const duration = data[index].gameDuration;
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;

    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}


function LoadAvatar(data, index) { return data[index].mainPlayerData.championName; }


function LoadSummonerSpells(data, index) {
    const firstSpell = summonerSpells[data[index].mainPlayerData.spells.s1];
    const secondSpell = summonerSpells[data[index].mainPlayerData.spells.s2];
    return { 
        0: firstSpell ? dataDragonAsset('spell', firstSpell) : iconFallback('S'),
        1: secondSpell ? dataDragonAsset('spell', secondSpell) : iconFallback('S')
    };
}


function LoadRunes(data, index) {
    return { 
        0: keystoneRunes[data[index].mainPlayerData.runes.main],
        1: runeStyleIcons[data[index].mainPlayerData.runes.subStyle]
    };
}


function LoadKDAandScore(data, index) {1
    const k = data[index].mainPlayerData.kda.k;
    const d = data[index].mainPlayerData.kda.d;
    const a = data[index].mainPlayerData.kda.a;

    const kdaValue = (k + a) / (d === 0 ? 1 : d);
    const result = Math.round(kdaValue * 10) / 10;

    return { 
        0: `${data[index].mainPlayerData.kda.k} / ${data[index].mainPlayerData.kda.d} / ${data[index].mainPlayerData.kda.a}`,
        1: `KDA ${result}`
    };
}


function LoadCSData(data, index) {
    const durations = data[index].gameDuration;
    const totalCS = data[index].mainPlayerData.cs.total;
    const durationInMinutes = durations / 60;
    const cs_per_min_numn = totalCS / durationInMinutes;
    const result = Math.round(cs_per_min_numn * 10) / 10;

    return { 
        0: `CS: ${data[index].mainPlayerData.cs.total}`,
        1: `${result} / min`
    };
}

function CreateNewMatchBlock(win, game_mode, game_duration, champ, summoners, runes, kda, cs) {
    let result = win ? 'win' : 'lose';

    match_list.innerHTML += `
    <div class="match-item ${result}">
        <div class="col meta">
            <div class="mode" id="game_mode">${game_mode}</div>
            <div class="duration" id="game_duration">${game_duration}</div>
        </div>
        <!-- CHAMP, SUMMONERS, RUNES -->
        <div class="col champ-col">
            <img src="${dataDragonAsset('champion', `${champ}.png`)}" class="champ" onerror="setImageFallback(this, '${champ.slice(0, 2)}', '#d5b36c')" alt="${champ}">
            <div class="summoner_spells">
                <img src="${summoners[0]}" onerror="setImageFallback(this, 'S')" alt="Первое заклинание призывателя">
                <img src="${summoners[1]}" onerror="setImageFallback(this, 'S')" alt="Второе заклинание призывателя">
            </div>
            <div class="runes">
                <img src="${runes[0]}" id="primary_rune">
                <img src="${runes[1]}" id="secondary_rune">
            </div>
        </div>
        <!-- KDA -->
        <div class="col kda-col">
            <div class="score-line" id="score">${kda[0]}</div>
            <div class="kda" id="kda">${kda[1]}</div>
        </div>
        <!-- CS -->
        <div class="col cs-col">
            <div id="total_cs">${cs[0]}</div>
            <div class="small" id="cs_per_min">${cs[1]}</div>
        </div>
    </div>
`;
}

function getGameMode(data, index) {
    if(data[index].gameMode == 400)
        return "Normal 5v5";
    else if (data[index].gameMode == 420)
        return "Ranked Solo/Duo";
    else if (data[index].gameMode == 440)
        return "Ranked Flex 5v5";
    else if (data[index].gameMode == 480)
        return "Swiftplay";
    else if (data[index].gameMode == 2400)
        return "ARAM: Mayhem";
    else if (data[index].gameMode == 450)
        return "ARAM";
    else if(data[index].gameMode == 1700)
        return "Arena";
    else if (data[index].gameMode == 890 || data[index].gameMode == 870 || data[index].gameMode == 880)
        return "Bots";
}

async function main() {
    await dataDragonReady;
    let gameName = name_search.value;
    let tagLine = tag_search.value;
    let _puuid = await getRiotAccount(gameName, tagLine);
    let region = await getRegionAccount(_puuid);
    let [rankSolo, pointsSolo, rankFlex, pointsFlex] = await getRankAccount(_puuid, region);
    let [iconId, levelSummoner] = await getIconAndLevelAccount(_puuid, region);

    avatar.onerror = () => setImageFallback(avatar, gameName, '#d5b36c');
    avatar.src = dataDragonAsset('profileicon', `${iconId}.png`);
    summoner_level.textContent = levelSummoner;
    nickname.textContent = gameName;
    tagline.textContent = `#${tagLine}`;
    regionHtml.textContent = region;

    if(rankSolo == "Unranked") {
        loadRankEmblem('UNRANKED');
        tier.style.color = rankColors["UNRANKED"];
        tier.textContent = "Unranked";
        lp.style.color = rankColors["UNRANKED"];
        lp.textContent = `- LP`;
    } else {
        loadRankEmblem(rankSolo);
        tier.style.color = rankColors[rankSolo];
        tier.textContent = rankSolo;
        lp.style.color = rankColors[rankSolo];
        lp.textContent = `${pointsSolo} LP`;
    }
    
    const matchesData = await getInformationFromMatch(_puuid, 20);

    for(match in matchesData) {
        let win           = DefineWinOrLose(matchesData, match);
        let game_duration = CalculateGameDuration(matchesData, match);
        let champ         = LoadAvatar(matchesData, match);
        let summoners     = LoadSummonerSpells(matchesData, match);
        let runes         = LoadRunes(matchesData, match);
        let kda           = LoadKDAandScore(matchesData, match);
        let cs            = LoadCSData(matchesData, match);
        let game_mode      = getGameMode(matchesData, match);

        CreateNewMatchBlock(win, game_mode, game_duration, champ, summoners, runes, kda, cs);
    }
}


search_btn.addEventListener("click", () => {
    match_list.innerHTML = "";
    main();
});
