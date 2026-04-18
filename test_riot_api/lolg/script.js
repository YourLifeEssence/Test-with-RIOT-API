const button = document.querySelector(".btn");

const txt1   = document.getElementById("text1");
const icon1  = document.getElementById("icon1");

const txt2   = document.getElementById("text2");
const icon2  = document.getElementById("icon2");

const txt3   = document.getElementById("text3");
const icon3  = document.getElementById("icon3");

const txt4   = document.getElementById("text4");
const icon4  = document.getElementById("icon4");

/* Функция чтоб достать Puuid
async function getRiotAccount(gameName, tagLine) {
    const routingValue = 'europe';
    const url = `https://${routingValue}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${gameName}/${tagLine}`;

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'X-Riot-Token': 'RGAPI-5412de35-7083-4e07-b2bf-996ca826dde6'
        }
    });

    if (!response.ok) {
        console.error(`Ошибка: ${response.status}`);
        return null;
    }
    
    const data = await response.json();
    const { puuid } = data;
    
    console.log("Данные аккаунта:", data);

    return puuid;
}
*/


//PUUIDs list:
//Sierra Grace    - m7wSHSgbOjVJcZFBOJdKUHjulpRvXtApgstdZWtdn3TwUABbx31GAGQR-rbc0m-l64T_g2ViSQUCxw
//Гори Ярче Звезд - iMGRffIqjht8S4bfvUrdpu97icCxDoqGAshE5oplw-0U0udl3OaIYCnJf-Uon9sPbkoR2ygCD8kIHg
//Qwish           - YN8k4-OUfvHNPQAG29v-hBbsx_wWzUuWiY40sdB85dZywV8Ms0nDPhwqIhO_cLgRKoYtUGMH1VqXkg
//Чай Поставьте   - IwC5x-9c04Nx21WxWbibEiWtXZ6wo4Pz0pcIAHOL-u3Vo1Aje_174HujFt1ZObuCJXlDe_ij0hjTEg


let champById = {};

async function loadChampions() {
    const response = await fetch('champions.json');
    const result = await response.json();
    const allChamps = result.data;

    for (let name in allChamps) {
        const champ = allChamps[name];
        const id = champ.key;
        
        champById[id] = {
            name: champ.name,
            image: champ.image.full
        };
    }

    console.log("Справочник готов! Проверка (266):", champById["266"].name);
}

const AkaliMastery   = "https://ru.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-puuid/m7wSHSgbOjVJcZFBOJdKUHjulpRvXtApgstdZWtdn3TwUABbx31GAGQR-rbc0m-l64T_g2ViSQUCxw/by-champion/84";
const SierraIco      = "https://ru.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/m7wSHSgbOjVJcZFBOJdKUHjulpRvXtApgstdZWtdn3TwUABbx31GAGQR-rbc0m-l64T_g2ViSQUCxw";

const YoneMastery    = "https://ru.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-puuid/iMGRffIqjht8S4bfvUrdpu97icCxDoqGAshE5oplw-0U0udl3OaIYCnJf-Uon9sPbkoR2ygCD8kIHg/by-champion/777";
const YLEIco         = "https://ru.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/iMGRffIqjht8S4bfvUrdpu97icCxDoqGAshE5oplw-0U0udl3OaIYCnJf-Uon9sPbkoR2ygCD8kIHg";

const IreliaMastery  = "https://ru.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-puuid/YN8k4-OUfvHNPQAG29v-hBbsx_wWzUuWiY40sdB85dZywV8Ms0nDPhwqIhO_cLgRKoYtUGMH1VqXkg/by-champion/39";
const QwishIco       = "https://ru.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/YN8k4-OUfvHNPQAG29v-hBbsx_wWzUuWiY40sdB85dZywV8Ms0nDPhwqIhO_cLgRKoYtUGMH1VqXkg";

const AkshanMastery  = "https://ru.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-puuid/IwC5x-9c04Nx21WxWbibEiWtXZ6wo4Pz0pcIAHOL-u3Vo1Aje_174HujFt1ZObuCJXlDe_ij0hjTEg/by-champion/166";
const ChaiIco        = "https://ru.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/IwC5x-9c04Nx21WxWbibEiWtXZ6wo4Pz0pcIAHOL-u3Vo1Aje_174HujFt1ZObuCJXlDe_ij0hjTEg";

async function dataFetcher(url) {
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'X-Riot-Token': 'RGAPI-5412de35-7083-4e07-b2bf-996ca826dde6'
        }
    })

    const data = await response.json();
    console.log(data);

    return data;
}

async function requester()
{
    //Sierra Grace
    const akaliMs = await dataFetcher(AkaliMastery);
    txt1.textContent = akaliMs.championLevel;

    const srrIc = await dataFetcher(SierraIco);
    icon1.src = `https://ddragon.leagueoflegends.com/cdn/16.7.1/img/profileicon/${srrIc.profileIconId}.png`;

    //Гори Ярче Звезд
    const yoneMs = await dataFetcher(YoneMastery);
    txt2.textContent = yoneMs.championLevel;

    const yleIc = await dataFetcher(YLEIco);
    icon2.src = `https://ddragon.leagueoflegends.com/cdn/16.7.1/img/profileicon/${yleIc.profileIconId}.png`;

    //Qwish
    const ireliaMs = await dataFetcher(IreliaMastery);
    txt3.textContent = ireliaMs.championLevel;

    const qwishIc = await dataFetcher(QwishIco);
    icon3.src = `https://ddragon.leagueoflegends.com/cdn/16.7.1/img/profileicon/${qwishIc.profileIconId}.png`;

    //Чай Поставьте
    const akshanMs = await dataFetcher(AkshanMastery);
    txt4.textContent = akshanMs.championLevel;

    const chaiIc = await dataFetcher(ChaiIco);
    icon4.src = `https://ddragon.leagueoflegends.com/cdn/16.7.1/img/profileicon/${chaiIc.profileIconId}.png`;
}

button.addEventListener("click", () => {
    //requester();
    loadChampions();
});