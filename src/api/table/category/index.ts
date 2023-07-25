// @ts-ignore
import type * as Category from "./types/index"
import { request } from "@/utils/service"

export function getCategoryDataApi(params: Category.GetCategoryData) {
  return request<Category.GetCategoryResponseData>({
    url: "/api/category/list",
    method: "get",
    params
  })
}
