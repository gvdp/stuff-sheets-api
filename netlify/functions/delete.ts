import { deleteRowFromSheet } from 'sheets-as-an-api-functions'
import { SHEET_IDS } from '../../src/config'

export const handler = deleteRowFromSheet(SHEET_IDS)
