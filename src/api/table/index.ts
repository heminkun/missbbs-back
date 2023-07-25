import { request } from "@/utils/service"
import type * as Table from "./types/table"
/** 改 */
export function updateTableDataApi(data: Table.UpdateTableRequestData) {
  return request({
    url: "table",
    method: "put",
    data
  })
}

// @ts-ignore
export function getUserSoloApi(params: Table.GetUserSoloData) {
  return request<Table.GetUserSoloResponseData>({
    url: "api/user/solo",
    method: "get",
    params
  })
}
/** 查 */
export function getTableDataApi(params: Table.GetTableRequestData) {
  return request<Table.GetTableResponseData>({
    url: "api/user/list",
    method: "get",
    params
  })
}
