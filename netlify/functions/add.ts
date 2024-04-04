import { addRowToSheet } from "sheets-as-an-api-functions";
import { SHEET_IDS } from '../../src/config'

export const handler = addRowToSheet(SHEET_IDS);