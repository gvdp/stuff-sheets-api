import wretch from "wretch";

const api = wretch("http://localhost:8888").resolve((r) => r.json());

describe("sheet call", () => {
  it("can call sheet api", async () => {
    const res = await api.get("/sheet").catch((error) => {
      throw new Error(`Call failed with ${error.status}`);
    });
    expect(res).toContainEqual({
      key: "TEST",
      name: "TEST",
      url: "/sheet/TEST/",
    });
  });
  it("can list all the tabs in the sheet", async () => {
    const res = await api.get("/sheet/TEST").catch((error) => {
      throw new Error(`Call failed with ${error.status}`);
    });
    expect(res).toEqual({
      sheets: [
        {
          url: "/sheet/TEST/Teams",
        },
        {
          url: "/sheet/TEST/Result",
        },
        {
          url: "/sheet/TEST/Group%20Games",
        },
        {
          url: "/sheet/TEST/Knockout%20Games",
        },
        {
          url: "/sheet/TEST/Calculate%20Schedule",
        },
        {
          url: "/sheet/TEST/Calculate%20Knockout",
        },
        {
          url: "/sheet/TEST/Per%20team",
        },
      ],
    });
  });
  it("can list all values in a tab", async () => {
    const res = await api.get("/sheet/TEST/Result").catch((error) => {
      throw new Error(`Call failed with ${error.status}`);
    });
    expect(res).toEqual({
      values: [
        {
          rank: "1",
        },
        {
          rank: "2",
        },
        {
          rank: "3",
        },
        {
          rank: "4",
        },
        {
          rank: "5",
        },
        {
          rank: "6",
        },
        {
          rank: "7",
        },
        {
          rank: "8",
        },
        {
          rank: "9",
        },
        {
          rank: "10",
        },
      ],
      sheets: [
        {
          url: "/sheet/TEST/Teams",
        },
        {
          url: "/sheet/TEST/Result",
        },
        {
          url: "/sheet/TEST/Group%20Games",
        },
        {
          url: "/sheet/TEST/Knockout%20Games",
        },
        {
          url: "/sheet/TEST/Calculate%20Schedule",
        },
        {
          url: "/sheet/TEST/Calculate%20Knockout",
        },
        {
          url: "/sheet/TEST/Per%20team",
        },
      ],
    });
  });
});
