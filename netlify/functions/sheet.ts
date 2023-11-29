import { getSheet } from "sheets-as-an-api-functions";
import { SHEET_IDS } from '../../src/config'

export const handler = getSheet(SHEET_IDS);