import express from "express";
import dotenv from "dotenv";
import axios from "axios";
import getToken from "./token.mjs";

const app = express();
const port = process.env.PORT || 4000;
dotenv.config();

const simpleError = (res, err) => res.status(500).send({ err });

const getHeader = async () => {
  const Authorization = await getToken();
  return {
    Authorization,
    Accept: "application/json;odata=verbose"
  };
};

app.get("/", (req, res) => {
  res.status(200).send("ok");
});

app.get("/info", async (req, res) => {
  try {
    const headers = await getHeader();
    const response = await axios.get(`${process.env.TENANT}_api/web`, {
      headers,
      json: true
    });
    const {
      d: { Created, Description, SiteLogoUrl, Title, Url }
    } = response.data;
    res.status(200).send({
      Created,
      Description,
      SiteLogoUrl,
      Title,
      Url
    });
  } catch (err) {
    simpleError(res, err);
  }
});

app.get("/mvv", async (req, res) => {
  try {
    const headers = await getHeader();
    const response = await axios.get(
      `${process.env.TENANT}_api/web/lists/getbytitle('MVV')/items?$select=Title,Conteudo,Modified,Created,GUID`,
      {
        headers,
        json: true
      }
    );
    const {
      d: { results = [] }
    } = response.data || { d: {} };
    res.status(200).send(
      results.map(r => ({
        Title: r.Title,
        Conteudo: r.Conteudo,
        Modified: r.Modified,
        Created: r.Created,
        GUID: r.GUID
      }))
    );
  } catch (err) {
    simpleError(res, err);
  }
});

app.listen(port, "0.0.0.0", () => {
  console.log(`http://0.0.0.0:${port}`);
});
