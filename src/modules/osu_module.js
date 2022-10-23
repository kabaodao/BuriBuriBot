const fs = require('node:fs');
const fetch = (...args) =>
  import('node-fetch').then(({ default: fetchh }) => fetchh(...args));
const dotenv = require('dotenv');
const { EmbedBuilder } = require('discord.js');

dotenv.config({ path: '../.env' });

const osuClientId = process.env.OSU_CLIENT_ID;
const osuClientSecret = process.env.OSU_CLIENT_SECRET;

exports.createUserEmbed = (userData, type) => {
  if (userData === undefined) {
    const embed = new EmbedBuilder()
      .setColor(0x808080)
      .setTitle('This user has no records within 24 hours.');
    return embed;
  }
  const mapTitle = userData.beatmapset.title;
  const mapVersion = userData.beatmap.version;
  const mapUrl = userData.beatmap.url;
  const userAvatar = userData.user.avatar_url;
  const userName = userData.user.username;
  const userUrl = `https://osu.ppy.sh/users/${userData.user.id}`;
  const mapTime = userData.beatmap.total_length;
  const bpm = userData.beatmap.bpm;
  const circles = userData.beatmap.count_circles;
  const sliders = userData.beatmap.count_sliders;
  const spinners = userData.beatmap.count_spinners;
  const cs = userData.beatmap.cs;
  const ar = userData.beatmap.ar;
  const od = userData.beatmap.accuracy;
  const star = userData.beatmap.difficulty_rating;
  const gameMode = userData.mode;
  const mods = userData.mods.join(', ');
  const score = userData.score;
  const acc = Math.trunc(userData.accuracy * 10000) / 100;
  const rank = userData.rank;
  const pp = userData.pp;
  const maxCombo = userData.max_combo;
  const c300 = userData.statistics.count_300;
  const c100 = userData.statistics.count_100;
  const c50 = userData.statistics.count_50;
  const cGeki = userData.statistics.count_geki;
  const cKatu = userData.statistics.count_katu;
  const cMiss = userData.statistics.count_miss;

  const embed = new EmbedBuilder()
    .setColor(0xff66aa)
    .setTitle(`${mapTitle} [${mapVersion}]`)
    .setURL(`${mapUrl}`)
    .setAuthor({
      name: `${userName}'s ${type} map score`,
      iconURL: `${userAvatar}`,
      url: `${userUrl}`,
    })
    .setDescription(
      `Time: ${mapTime}, BPM: ${bpm}, Object: ${
        circles + sliders + spinners
      }\nCircles: ${circles}, Sliders: ${sliders}, Spinners: ${spinners}\nCS: ${cs}, AR: ${ar}, OD: ${od}, ⭐️: ${star}`,
    )
    .addFields(
      {
        name: 'Result',
        value: `Mode: ${gameMode}\nMods: ${mods}\nScore: ${score}`,
        inline: true,
      },
      {
        name: 'ㅤ',
        value: `Acc: ${acc}%\nRank: ${rank}\nPP: ${pp}`,
        inline: true,
      },
      {
        name: 'ㅤ',
        value: `MaxCombo: ${maxCombo}\n300: ${c300}, 100: ${c100}, 50: ${c50}\ngeki: ${cGeki}, katu: ${cKatu}, miss: ${cMiss}`,
        inline: true,
      },
    );

  return embed;
};

// Osu token functions
const getUnixTimestamp = () => {
  const date = new Date();
  const unixTimestamp = date.getTime();

  return unixTimestamp;
};

const getOsuTokenJson = () => {
  try {
    const tokenJson = JSON.parse(fs.readFileSync('../osu_token.json', 'utf-8'));
    return tokenJson;
  } catch (e) {
    const tokenJson = {
      access_token: '',
      expires_in: 0,
      token_type: 'Bearer',
      createUnixTimestamp: 0,
    };
    return tokenJson;
  }
};

const checkOsuToken = (tokenJson, unixTimestamp) => {
  if (unixTimestamp > tokenJson.createUnixTimestamp + 86400000) {
    console.log('Take token.');
    return false;
  } else {
    console.log('Return json token.');
    return true;
  }
};

const writeOsuToken = (tokenJson, unixTimestamp, responseData) => {
  const newTokeJson = Object.assign({}, tokenJson);
  for (const i in tokenJson) {
    if (i === 'createUnixTimestamp') {
      newTokeJson[i] = unixTimestamp;
    } else {
      newTokeJson[i] = responseData[i];
    }
  }
  fs.writeFile(
    '../osu_token.json',
    JSON.stringify(newTokeJson, null, '  '),
    (err) => {
      if (err) console.log('error', err);
    },
  );
};

const getOsuToken = async () => {
  const tokenJson = getOsuTokenJson();
  const unixTimestamp = getUnixTimestamp();
  if (checkOsuToken(tokenJson, unixTimestamp)) {
    return tokenJson.access_token;
  } else {
    const url = new URL('https://osu.ppy.sh/oauth/token');
    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };
    const body = {
      client_id: osuClientId,
      client_secret: osuClientSecret,
      grant_type: 'client_credentials',
      scope: 'public',
    };

    const token = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    })
      .then((response) => response.json())
      .then((data) => {
        writeOsuToken(tokenJson, unixTimestamp, data);
        return data.access_token;
      });

    return token;
  }
};

// Osu data functions
const getOsuUserId = async (token, userName) => {
  const url = new URL(`https://osu.ppy.sh/api/v2/users/${userName}`);
  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Authorization: `Bearer ${token}`,
  };
  const userId = await fetch(url, {
    method: 'GET',
    headers,
  })
    .then((response) => response.json())
    .then((data) => {
      return data.id;
    });

  return userId;
};

exports.getOsuUserData = async (userName, type, mode) => {
  const token = await getOsuToken();
  const userId = await getOsuUserId(token, userName);

  const url = new URL(
    `https://osu.ppy.sh/api/v2/users/${userId}/scores/${type}`,
  );
  const params = {
    include_fails: '0',
    limit: '1',
    offset: '0',
  };
  Object.keys(params).forEach((key) =>
    url.searchParams.append(key, params[key]),
  );
  if (mode !== null) {
    url.searchParams.append(mode, mode);
  }
  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Authorization: `Bearer ${token}`,
  };

  const userData = await fetch(url, {
    method: 'GET',
    headers,
  })
    .then((response) => response.json())
    .then((data) => data);

  return userData[0];
};

exports.getOsuMapData = async (mapId) => {
  const token = await getOsuToken();

  const url = new URL(`https://osu.ppy.sh/api/v2/beatmaps/${mapId}/scores`);
  const params = {
    mode: 'osu',
    // mods: 'modi',
    // type: 'sunt',
  };
  Object.keys(params).forEach((key) =>
    url.searchParams.append(key, params[key]),
  );
  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Authorization: `Bearer ${token}`,
  };

  const mapData = await fetch(url, {
    method: 'GET',
    headers,
  });

  return mapData;
};
