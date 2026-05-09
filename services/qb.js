import axios from "axios";

let cookie = "";

export async function loginQB() {

  const response = await axios.post(
    `${process.env.QB_URL}/api/v2/auth/login`,
    new URLSearchParams({
      username: process.env.QB_USERNAME,
      password: process.env.QB_PASSWORD
    }),
    {
      headers: {
        "Content-Type":
          "application/x-www-form-urlencoded"
      },
      timeout: 10000
    }
  );

  cookie = response.headers["set-cookie"][0]
    .split(";")[0];

  console.log("Logged into qBittorrent");
}

export async function getTorrents() {

  let response;

  try {

    response = await axios.get(
      `${process.env.QB_URL}/api/v2/torrents/info`,
      {
        headers: {
          Cookie: cookie
        },
        timeout: 10000
      }
    );

  } catch (err) {

    console.log(
      "Session expired. Re-logging..."
    );

    await loginQB();

    response = await axios.get(
      `${process.env.QB_URL}/api/v2/torrents/info`,
      {
        headers: {
          Cookie: cookie
        },
        timeout: 10000
      }
    );
  }

  return response.data;
}

export async function moveBottom(hash) {

  await axios.post(
    `${process.env.QB_URL}/api/v2/torrents/bottomPrio`,
    `hashes=${hash}`,
    {
      headers: {
        Cookie: cookie,
        "Content-Type":
          "application/x-www-form-urlencoded"
      },
      timeout: 10000
    }
  );

  console.log(`Moved to bottom: ${hash}`);
}

export async function restorePriority(hash) {

  await axios.post(
    `${process.env.QB_URL}/api/v2/torrents/topPrio`,
    `hashes=${hash}`,
    {
      headers: {
        Cookie: cookie,
        "Content-Type":
          "application/x-www-form-urlencoded"
      },
      timeout: 10000
    }
  );

  console.log(`Restored priority: ${hash}`);
}