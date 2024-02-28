import wretch from "wretch";

const api = wretch("http://localhost:8888").resolve((r) => r.json());

describe("sheet call", () => {

  it("can call sheet api", async () => {
    const res = await api.get("/sheet").catch((error) => {
      throw new Error(`Call failed with ${error.status}`);
    });
    expect(res).toContainEqual({
      key: "STUFF",
      name: "Stuff",
      url: "/sheet/STUFF/",
    });
  });
  it("can list all the tabs in the sheet", async () => {
    const res = await api.get("/sheet/TEST").catch((error) => {
      throw new Error(`Call failed with ${error.status}`);
    });
    expect(res).toEqual([
        {
          key: "STUFF",
          name: "Stuff",
          url: "/sheet/STUFF/",
        }
      ],
    );
  });
});
