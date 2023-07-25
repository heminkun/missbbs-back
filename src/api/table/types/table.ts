export interface CreateTableRequestData {
  username: string
  password: string
}

export interface UpdateTableRequestData {
  id: string
  username: string
  password?: string
}

export interface GetTableRequestData {
  /** 当前页码 */
  page: number
  /** 查询条数 */
  limit: number
  /** 查询参数：用户名 */
  name?: string
  /** 查询参数：手机号 */
  phone?: string
  sort?: string
  key?: string
  tel?: string
}

export interface GetTableData {
  ip: string
  gender: string
  created_at: string
  email: string
  id: string
  tel: string
  role: string
  addr: string
  name: string
}
export interface GetUserSoloData {
  id: number
}

export type GetUserSoloResponseData = ApiResponseData<any>

export type GetTableResponseData = ApiResponseData<{
  list: GetTableData[]
  count: number
}>
