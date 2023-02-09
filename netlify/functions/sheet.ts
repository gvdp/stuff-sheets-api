import { Handler } from "@netlify/functions";
import axios, { AxiosError } from "axios";
import { camelCase } from "camel-case";
import { SHEET_IDS } from "../../src/config";
import { createAuthUrl, getTokenFromRefresh } from "../../src/google-tokens";

export const handler: Handler = async (event) => {
  const sheetCode = event.path.split("/")[2];
  const tabTitle = event.path.split("/")[3];

  const spreadsheetId = SHEET_IDS[sheetCode]?.sheetID;

  if (!spreadsheetId) {
    return {
      statusCode: 200,
      body: JSON.stringify(
        Object.entries(SHEET_IDS).map(([key, { name }]) => ({
          name,
          key,
          url: `/sheet/${key}/`,
        })),
        null,
        2
      ),
    };
  }

  let token = process.env.ACCESS_TOKEN;
  const refreshToken = process.env.REFRESH_TOKEN as string;

  if (!(token || refreshToken)) {
    return {
      statusCode: 301,
      headers: {
        Location: createAuthUrl(
          "http://localhost:8888",
          "https://www.googleapis.com/auth/spreadsheets.readonly"
        ),
        "Cache-Control": "",
      },
    };
  }

  if (!token && refreshToken) {
    token = await getTokenFromRefresh(refreshToken);
  }

  try {
    let values;
    if (tabTitle) {
      const range = `${tabTitle}!A1:Z100`;
      const response = await axios.get<{ values: string[][] }>(
        `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const keys = response.data.values[0].map((key) => camelCase(key));

      values = response.data.values
        .slice(1, response.data.values.length)
        .filter((values) => values.length > 0)
        .map((values) => {
          return keys.reduce(
            (obj, key, index) => ({
              ...obj,
              [key]: values[index],
            }),
            {}
          );
        });
    }

    const response = await axios.get<{
      sheets: { properties: { title: string } }[];
    }>(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const sheets = response.data.sheets.map((sheet) => ({
      url: `/sheet/${sheetCode}/${encodeURIComponent(sheet.properties.title)}`,
    }));
    return {
      statusCode: 200,
      headers: {
        Location: "",
        "Cache-Control": "public, s-maxage=60",
      },
      body: JSON.stringify(
        {
          ...(values && { values }),
          sheets,
        },
        null,
        2
      ),
    };
  } catch (e) {
    if (axios.isAxiosError(e)) {
      console.error("axios error", (e as AxiosError).response?.status);
    } else {
      console.error(e);
    }
    return { statusCode: 500 };
  }
};
