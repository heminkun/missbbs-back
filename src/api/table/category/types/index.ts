export interface GetCategoryData {
  page: number
  key?: string
  limit: number
  sort?: number
}
export type GetCategoryResponseData = ApiResponseData<{
  list: GetCategoryData[]
  count: number
}>
