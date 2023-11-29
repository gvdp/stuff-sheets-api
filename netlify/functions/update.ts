import { updateSheet } from "sheets-as-an-api-functions";
import { SHEET_IDS } from '../../src/config'

export const handler = updateSheet(SHEET_IDS);